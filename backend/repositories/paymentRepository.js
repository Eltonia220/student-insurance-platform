// backend/repositories/paymentRepository.js
import db from './db.js';

class PaymentRepository {
  /**
   * Saves M-Pesa payment callback data
   * @param {object} callbackData - Raw M-Pesa callback
   * @returns {Promise<{success: boolean, payment?: object, error?: string}>}
   */
  static async saveMpesaPayment(callbackData) {
    const stkCallback = callbackData.Body.stkCallback;
    const metadata = stkCallback.CallbackMetadata?.Item || [];
    
    const getMetadataValue = (name) => 
      metadata.find(item => item.Name === name)?.Value || null;

    const receiptNumber = getMetadataValue('MpesaReceiptNumber');
    const phoneNumber = getMetadataValue('PhoneNumber');
    const amount = getMetadataValue('Amount');
    const accountReference = getMetadataValue('AccountReference');

    // Check if payment already exists
    const existingPayment = await this.findPaymentByReceipt(receiptNumber);
    if (existingPayment) {
      return {
        success: true,
        payment: existingPayment,
        message: 'Payment already recorded'
      };
    }

    // Insert into transactions table
    const query = `
      INSERT INTO transactions (
        transaction_id,
        merchant_request_id,
        amount,
        status,
        phone,
        receipt_number,
        callback_data,
        payment_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      stkCallback.CheckoutRequestID,
      stkCallback.MerchantRequestID,
      amount,
      stkCallback.ResultCode === '0' ? 'completed' : 'failed',
      phoneNumber,
      receiptNumber,
      callbackData,
      new Date()
    ];

    try {
      const result = await db.query(query, values);
      return {
        success: true,
        payment: result.rows[0]
      };
    } catch (error) {
      console.error('Payment save error:', error);
      return {
        success: false,
        error: 'Failed to save payment',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      };
    }
  }

  /**
   * Finds payment by M-Pesa receipt number
   * @param {string} receiptNumber - M-Pesa receipt number
   * @returns {Promise<object|null>}
   */
  static async findPaymentByReceipt(receiptNumber) {
    const result = await db.query(
      'SELECT * FROM transactions WHERE receipt_number = $1',
      [receiptNumber]
    );
    return result.rows[0] || null;
  }

  /**
   * Finds payment by checkout request ID
   * @param {string} checkoutRequestID 
   * @returns {Promise<object|null>}
   */
  static async findPaymentByCheckoutId(checkoutRequestID) {
    const result = await db.query(
      'SELECT * FROM transactions WHERE transaction_id = $1',
      [checkoutRequestID]
    );
    return result.rows[0] || null;
  }

  /**
   * Updates transaction status
   * @param {string} checkoutRequestID 
   * @param {string} status 
   * @param {string|null} receiptNumber 
   * @returns {Promise<object>}
   */
  static async updatePaymentStatus(checkoutRequestID, status, receiptNumber = null) {
    const query = `
      UPDATE transactions
      SET 
        status = $1,
        receipt_number = COALESCE($2, receipt_number),
        payment_date = CURRENT_TIMESTAMP
      WHERE transaction_id = $3
      RETURNING *
    `;
    
    const result = await db.query(query, [
      status,
      receiptNumber,
      checkoutRequestID
    ]);
    
    return result.rows[0];
  }
}

export default PaymentRepository;