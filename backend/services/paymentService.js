// backend/services/paymentService.js
import Paymentrepository from '../repositories/Paymentrepository.js';
import { logger } from './logger.js';
import emailService from './emailservice.js';
import customerService from './customerService.js';

/**
 * Handles successful payment workflow
 * @param {Object} payment - Saved payment record
 */
async function handleSuccessfulPayment(payment) {
  try {
    // 1. Get customer email
    const customer = await customerService.findByPhone(payment.phone_number);
    if (!customer) {
      throw new Error(`Customer not found for phone: ${payment.phone_number}`);
    }

    // 2. Send email notification
    const emailResult = await emailService.sendPaymentConfirmation({
      to: customer.email,
      amount: payment.amount,
      receiptNumber: payment.mpesa_receipt_number,
      paymentDate: payment.transaction_date
    });

    if (!emailResult.success) {
      await paymentRepository.logEmailStatus(payment.id, 'failed');
      logger.warn('Email notification failed', {
        paymentId: payment.id,
        error: emailResult.error
      });
    } else {
      await paymentRepository.logEmailStatus(payment.id, 'sent');
    }

    // 3. Update customer balance
    await customerService.updateBalance(customer.id, payment.amount);

  } catch (error) {
    logger.error('Successful payment handling failed', {
      paymentId: payment.id,
      error: error.message
    });
    throw error;
  }
}

/**
 * Handles failed payment workflow
 * @param {Object} payment - Saved payment record
 * @param {string} failureReason - Description of failure
 */
async function handleFailedPayment(payment, failureReason) {
  try {
    await paymentRepository.updatePaymentStatus(payment.id, 'failed', failureReason);
    logger.info(`Payment failed: ${failureReason}`, { paymentId: payment.id });
  } catch (error) {
    logger.error('Failed payment handling error', {
      paymentId: payment.id,
      error: error.message
    });
  }
}

/**
 * Processes M-Pesa callback and handles the full payment workflow
 * @param {Object} callbackData - Raw M-Pesa callback payload
 * @returns {Promise<{success: boolean, payment?: Object, error?: string}>}
 */
export const processMpesaCallback = async (callbackData) => {
  const stkCallback = callbackData.Body.stkCallback;
  
  try {
    // 1. Validate callback structure
    if (!stkCallback || !stkCallback.ResultCode) {
      throw new Error('Invalid M-Pesa callback structure');
    }

    // 2. Save to database
    const dbResult = await paymentRepository.savePayment(callbackData);
    
    if (!dbResult.success) {
      logger.error('Database save failed', {
        error: dbResult.error,
        callbackData
      });
      throw new Error('Failed to persist payment');
    }

    // 3. Process based on payment status
    if (stkCallback.ResultCode === 0) {
      await handleSuccessfulPayment(dbResult.payment);
    } else {
      await handleFailedPayment(dbResult.payment, stkCallback.ResultDesc);
    }

    return {
      success: true,
      payment: dbResult.payment
    };

  } catch (error) {
    logger.error('Payment processing failed', {
      error: error.message,
      stack: error.stack,
      callbackData
    });
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Export handlers for testing purposes
export const _handlers = {
  handleSuccessfulPayment,
  handleFailedPayment
};

// Default export
export default {
  processMpesaCallback,
  _handlers
};