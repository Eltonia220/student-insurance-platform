import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import winston from 'winston';
import { Op } from 'sequelize';
import models from '../models/index.js';
import sendPaymentNotification from '../utils/sendNotification.js';

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/mpesa.log' }),
    new winston.transports.Console()
  ]
});

// Constants
const SAFARICOM_IPS = ['196.201.214.200', '196.201.214.206'];
const MAX_AMOUNT = 100000;
const MIN_AMOUNT = 10;

// Utility Functions
const generateRequestId = () => crypto.randomBytes(8).toString('hex');
const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const validatePhoneNumber = (phone) => {
  const match = phone?.match(/^(?:254|\+254|0)?(7\d{8})$/);
  return match ? `254${match[1]}` : null;
};

const generatePassword = (shortcode, passkey, timestamp) => {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
};


// Authentication Token Cache
let authTokenCache = { token: null, expiresAt: 0 };

const getAuthToken = async () => {
  if (authTokenCache.token && Date.now() < authTokenCache.expiresAt) {
    return authTokenCache.token;
  }

  try {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get(process.env.MPESA_AUTH_URL, {
      headers: { Authorization: `Basic ${auth}` },
      timeout: 10000
    });

    if (!response.data.access_token) {
      throw new Error('Invalid token response');
    }

    authTokenCache = {
      token: response.data.access_token,
      expiresAt: Date.now() + 3500 * 1000 // expires in ~1 hour
    };

    return response.data.access_token;
  } catch (error) {
    logger.error('Failed to get auth token', { error: error.message });
    throw error;
  }
};

// STK Push Implementation
export const initiateSTKPush = async (req, res) => {
  const requestId = generateRequestId();
  const { phone, amount, accountReference = 'INSURANCE', redirectUrl } = req.body;

  try {
    // Input validation
    if (!phone || !amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid phone and amount required' });
    }

    const amountNumber = parseFloat(amount);
    if (amountNumber < MIN_AMOUNT || amountNumber > MAX_AMOUNT) {
      return res.status(400).json({ 
        error: `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}` 
      });
    }

    // Log the exact value of the amount before constructing the payload
    logger.info('Amount received', { requestId, amount: amountNumber });

    const formattedPhone = validatePhoneNumber(phone);
    if (!formattedPhone) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Get M-Pesa auth token
    const token = await getAuthToken();
    const timestamp = generateTimestamp();

    // Prepare STK push payload
    const stkPayload = {
      BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
      Password: generatePassword(
        process.env.MPESA_BUSINESS_SHORTCODE,
        process.env.MPESA_PASSKEY,
        timestamp
      ),
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: String(parseFloat(amount).toFixed(0)),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: 'Insurance Premium Payment'
    };

    // Log the entire payload for debugging
    logger.info('STK Push Payload', { requestId, payload: stkPayload });

    // Send STK push request
    const response = await axios.post(
      process.env.MPESA_STK_PUSH_URL,
      stkPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // Log Safaricom's raw response for debugging
    logger.info('Safaricom STK Response', {
      requestId,
      data: response.data
    });

    if (response.data?.ResponseCode !== '0') {
      throw new Error(response.data?.ResponseDescription || 'STK Push Failed');
    }

    const transaction = await models.Transaction.create({
      user_id: req.user?.id || null,
      merchant_request_id: response.data.MerchantRequestID,
      checkoutRequestID: response.data.CheckoutRequestID,  // Use exact column name from DB
      phone: formattedPhone,
      amount: amountNumber,
      account_reference: accountReference,
      status: 'pending',
      redirect_url: redirectUrl || null  // Store the redirect URL for later use
    });
   
    logger.info('STK push initiated successfully', { 
      requestId, 
      transactionId: transaction.id,
      checkoutRequestID: response.data.CheckoutRequestID 
    });

    // Store transaction ID in session for retrieval on success page
    if (req.session) {
      req.session.pendingTransaction = {
        id: transaction.id,
        timestamp: Date.now()
      };
    }

    return res.status(200).json({
      success: true,
      transactionId: transaction.id,  // Return the transaction ID to the frontend
      checkoutRequestID: response.data.CheckoutRequestID,
      responseDescription: response.data.ResponseDescription
    });

  } catch (error) {
    logger.error('STK Push Failed', { 
      requestId,
      error: error.message,
      safaricomResponse: error.response?.data || 'No response body',
      status: error.response?.status || 'No status code',
      stack: error.stack
    });
    
    return res.status(500).json({ 
      success: false, 
      error: 'Payment processing failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Callback Handler
export const mpesaCallback = async (req, res) => {
  const callbackId = generateRequestId();
  const callbackData = req.body?.Body?.stkCallback;

  try {
    logger.info('Received callback', { callbackId, data: req.body });

    if (!callbackData?.CheckoutRequestID || !callbackData?.ResultCode) {
      logger.warn('Invalid callback payload', { callbackData });
      return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid payload' });
    }

    // Process callback data
    const transactionData = {
      status: callbackData.ResultCode === '0' ? 'completed' : 'failed',
      callback_data: req.body
    };

    // Get additional metadata if payment was successful
    if (callbackData.ResultCode === '0' && callbackData.CallbackMetadata?.Item) {
      const metadata = {};
      callbackData.CallbackMetadata.Item.forEach(item => {
        metadata[item.Name] = item.Value;
      });

      transactionData.receipt_number = metadata.MpesaReceiptNumber;
      transactionData.amount = metadata.Amount;
      transactionData.phone = metadata.PhoneNumber;
      transactionData.payment_date = new Date();
    }

    // Find the transaction first to get its details
    const transaction = await models.Transaction.findOne({
      where: { checkoutRequestID: callbackData.CheckoutRequestID }
    });

    if (!transaction) {
      logger.warn('Transaction not found', { checkoutRequestID: callbackData.CheckoutRequestID });
      return res.status(200).json({ ResultCode: 0, ResultDesc: 'Callback received' });
    }

    // Update the transaction
    await transaction.update(transactionData);

    // Handle successful payment
    if (transactionData.status === 'completed') {
      try {
        await models.sequelize.transaction(async (t) => {
          const [student] = await models.Student.update(
            { 
              insuranceStatus: 'active', 
              lastPaymentDate: new Date(),
              insuranceExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            },
            { 
              where: { phoneNumber: transactionData.phone },
              transaction: t
            }
          );

          if (student) {
            const studentData = await models.Student.findOne({
              where: { phoneNumber: transactionData.phone },
              transaction: t
            });

            if (studentData?.email) {
              await sendPaymentNotification({
                email: studentData.email,
                name: studentData.name,
                amount: transactionData.amount,
                receipt: transactionData.receipt_number,
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                transactionId: transaction.id  // Include transaction ID in notification
              });
            }
          }
        });
      } catch (updateError) {
        logger.error('Failed to update student record', {
          error: updateError.message,
          phone: transactionData.phone
        });
      }
    }

    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Callback processed' });

  } catch (error) {
    logger.error('Callback processing failed', { 
      callbackId, 
      error: error.message,
      stack: error.stack 
    });
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Callback received' });
  }
};

// Get Transaction Details API
export const getTransactionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }
    
    const transaction = await models.Transaction.findByPk(id, {
      attributes: [
        'id', 'amount', 'status', 'receipt_number', 'phone', 'payment_date',
        'merchant_request_id', 'checkoutRequestID', 'account_reference', 'created_at'
      ]
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    return res.status(200).json(transaction);
  } catch (error) {
    logger.error('Error fetching transaction details', { 
      error: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({ error: 'Failed to retrieve transaction details' });
  }
};

// Test Endpoint
export const testEndpoint = (req, res) => {
  res.status(200).json({
    status: 'active',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      stkPush: 'POST /api/mpesa/stk-push',
      callback: 'POST /api/mpesa/callback',
      getTransaction: 'GET /api/transactions/:id',
      test: 'GET /api/mpesa/test'
    }
  });
};
  
  
  
  