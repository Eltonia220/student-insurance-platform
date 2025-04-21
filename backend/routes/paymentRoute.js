import express from 'express';
import paymentRepository from './repositories/paymentRepository.js';

const router = express.Router();

// STK Push Callback Handler
router.post('/mpesa-callback', async (req, res) => {
  try {
    const { success, payment, error } = await paymentRepository.saveMpesaPayment(req.body);
    
    if (success) {
      console.log('✅ Payment saved:', payment.id);
      return res.status(200).json({ 
        ResultCode: 0, 
        ResultDesc: 'Callback processed successfully',
        paymentId: payment.id
      });
    }
    
    console.error('❌ Payment save failed:', error);
    return res.status(400).json({
      ResultCode: 1,
      ResultDesc: error || 'Failed to process callback'
    });
    
  } catch (error) {
    console.error('🔥 Callback processing error:', error.message);
    return res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Internal server error'
    });
  }
});

// Payment Status Check Endpoint
router.get('/payment-status/:checkoutRequestId', async (req, res) => {
  try {
    const payment = await paymentRepository.findPaymentByCheckoutId(
      req.params.checkoutRequestId
    );
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    return res.status(200).json({
      success: true,
      status: payment.status,
      amount: payment.amount,
      receiptNumber: payment.receipt_number,
      paymentDate: payment.payment_date
    });
    
  } catch (error) {
    console.error('Status check error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Manual Status Update
router.patch('/update-payment/:checkoutRequestId', async (req, res) => {
  try {
    const { status, receiptNumber } = req.body;
    
    if (!['pending', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }

    const updatedPayment = await paymentRepository.updatePaymentStatus(
      req.params.checkoutRequestId,
      status,
      receiptNumber
    );

    return res.status(200).json({
      success: true,
      payment: updatedPayment
    });
    
  } catch (error) {
    console.error('Update error:', {
      message: error.message,
      params: req.params,
      body: req.body
    });
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;