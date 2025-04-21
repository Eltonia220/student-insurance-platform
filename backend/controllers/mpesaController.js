import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import winston from 'winston';
import { Op } from 'sequelize';
import Transaction from '../models/Transaction.js';
import Student from '../models/student.js';
import sendPaymentNotification from '../utils/sendNotification.js'; // Ensure this exists

// ======================
// 1. Configuration Setup
// ======================
const SAFARICOM_IPS = ['196.201.214.200', '196.201.214.206'];
const MAX_AMOUNT = 100000;
const MIN_AMOUNT = 10;
const PENDING_TX_TIMEOUT = 30 * 60 * 1000; // 30 minutes

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

// ======================
// 2. Environment Validation
// ======================
const requiredEnvVars = [
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET',
  'MPESA_AUTH_URL',
  'MPESA_BUSINESS_SHORTCODE',
  'MPESA_PASSKEY',
  'MPESA_STK_PUSH_URL',
  'MPESA_CALLBACK_URL'
];

const validateEnvironment = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length) {
    logger.error(`Missing ENV vars: ${missing.join(', ')}`);
    throw new Error('Server misconfigured');
  }
};
validateEnvironment();

// ======================
// 3. Security Utilities
// ======================
const maskPhone = (phone) => phone?.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');

const encrypt = (text) => {
  if (!process.env.ENCRYPTION_KEY || !process.env.IV) return text;
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
    Buffer.from(process.env.IV, 'hex')
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const validateSafaricomIP = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    const clientIP = req.headers['x-forwarded-for'] || req.ip;
    if (!SAFARICOM_IPS.some(ip => clientIP?.includes(ip))) {
      logger.warn(`Unauthorized IP: ${clientIP}`);
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
  next();
};

// ======================
// 4. Utility Functions
// ======================
const generateRequestId = () => crypto.randomBytes(8).toString('hex');
const validatePhoneNumber = (phone) => {
  const match = phone?.match(/^(?:254|\+254|0)?(7\d{8})$/);
  return match ? `254${match[1]}` : null;
};
const generateTimestamp = () => new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const generatePassword = () => Buffer.from(
  `${process.env.MPESA_BUSINESS_SHORTCODE}${process.env.MPESA_PASSKEY}${generateTimestamp()}`
).toString('base64');

let authTokenCache = { token: null, expiresAt: 0 };

const getAuthToken = async () => {
  if (authTokenCache.token && Date.now() < authTokenCache.expiresAt) {
    return authTokenCache.token;
  }
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  const response = await axios.get(process.env.MPESA_AUTH_URL, {
    headers: { Authorization: `Basic ${auth}` },
    timeout: 5000
  });
  if (!response.data.access_token) throw new Error('Invalid token response');

  authTokenCache = {
    token: response.data.access_token,
    expiresAt: Date.now() + 3500 * 1000
  };
  return response.data.access_token;
};

const axiosRetry = async (config, retries = 3) => {
  try {
    return await axios({ ...config, timeout: 10000 });
  } catch (err) {
    if (retries > 0 && (!err.response || err.response.status >= 500)) {
      logger.warn(`Retrying request... attempts left: ${retries}`);
      await new Promise((r) => setTimeout(r, 1000));
      return axiosRetry(config, retries - 1);
    }
    throw err;
  }
};

// ======================
// 5. STK Push
// ======================
export const initiateSTKPush = async (req, res) => {
  const requestId = generateRequestId();
  const { phone, amount, accountReference = 'INSURANCE' } = req.body;

  try {
    if (!phone || !amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid phone and amount required' });
    }

    const amountNumber = parseFloat(amount);
    if (amountNumber < MIN_AMOUNT || amountNumber > MAX_AMOUNT) {
      return res.status(400).json({ error: `Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}` });
    }

    const formattedPhone = validatePhoneNumber(phone);
    if (!formattedPhone) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const encryptedPhone = encrypt(formattedPhone);
    const pendingTx = await Transaction.findOne({
      where: {
        phone: encryptedPhone,
        amount: amountNumber,
        status: 'pending',
        createdAt: { [Op.gt]: new Date(Date.now() - PENDING_TX_TIMEOUT) }
      }
    });

    if (pendingTx) {
      return res.status(409).json({ error: 'Similar transaction already pending' });
    }

    const token = await getAuthToken();
    const stkPayload = {
      BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
      Password: generatePassword(),
      Timestamp: generateTimestamp(),
      TransactionType: 'CustomerPayBillOnline',
      Amount: amountNumber,
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: 'Insurance Premium Payment'
    };

    const stkResponse = await axiosRetry({
      method: 'post',
      url: process.env.MPESA_STK_PUSH_URL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: stkPayload
    });

    if (stkResponse.data?.ResponseCode !== '0') {
      throw new Error(stkResponse.data?.ResponseDescription || 'STK Push Failed');
    }

    await Transaction.create({
      merchant_request_id: stkResponse.data.MerchantRequestID,
      checkoutRequestID: stkResponse.data.CheckoutRequestID,
      phone: encryptedPhone,
      amount: amountNumber,
      account_reference: accountReference,
      status: 'pending',
      callback_data: null
    });

    res.status(200).json({
      success: true,
      checkoutRequestID: stkResponse.data.CheckoutRequestID,
      responseDescription: stkResponse.data.ResponseDescription
    });

  } catch (error) {
    logger.error('STK Push Failed', { requestId, error: error.message, stack: error.stack });
    res.status(500).json({ success: false, error: error.message });
  }
};

// ======================
// 6. Callback Handler
// ======================
export const mpesaCallback = async (req, res) => {
  const callbackId = generateRequestId();
  const callbackData = req.body?.Body?.stkCallback;

  try {
    if (!callbackData?.ResultCode) {
      throw new Error('Invalid callback payload');
    }

    const metadata = callbackData.CallbackMetadata?.Item || [];
    const getValue = (name) => metadata.find(i => i.Name === name)?.Value;

    const transactionData = {
      merchant_request_id: callbackData.MerchantRequestID,
      checkoutRequestID: callbackData.CheckoutRequestID,
      status: callbackData.ResultCode === 0 ? 'Success' : 'Failed',
      amount: getValue('Amount'),
      receipt_number: getValue('MpesaReceiptNumber'),
      phone: encrypt(getValue('PhoneNumber')),
      payment_date: new Date(),
      callback_data: req.body
    };

    const [updated] = await Transaction.update(transactionData, {
      where: { checkoutRequestID: transactionData.checkoutRequestID }
    });

    if (updated === 0) {
      logger.warn('No matching transaction for callback', { checkoutRequestID: transactionData.checkoutRequestID });
    }

    if (transactionData.status === 'Success') {
      // 1. Update student status
      await Student.update(
        { insuranceStatus: 'active', lastPaymentDate: new Date() },
        { where: { phoneNumber: transactionData.phone } }
      );

      // 2. Send payment notification email
      const student = await Student.findOne({ where: { phoneNumber: transactionData.phone } });
      if (student && student.email) {
        await sendPaymentNotification({
          email: student.email,
          name: student.name,
          amount: transactionData.amount,
          receipt: transactionData.receipt_number
        });
      }

      logger.info('Payment handled', { receipt: transactionData.receipt_number });
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: 'Callback processed successfully' });

  } catch (error) {
    logger.error('Callback failed', { callbackId, error: error.message, stack: error.stack });
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Callback received' }); // Always return 0
  }
};

// ======================
// 7. Utility Endpoint
// ======================
export const testEndpoint = (req, res) => {
  res.status(200).json({
    status: 'active',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
};
