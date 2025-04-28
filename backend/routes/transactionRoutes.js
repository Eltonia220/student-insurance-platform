import express from 'express';
import { 
  getTransactionDetails,  // Changed from getTransaction to match your controller
  downloadReceipt,
  emailReceipt
} from '../controllers/transactionController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get transaction details
router.get('/:id', getTransactionDetails);  // Fixed to use imported function

// Generate and download receipt
router.get('/:id/receipt', authenticate, downloadReceipt);

// Email receipt to user
router.post('/:id/email-receipt', authenticate, emailReceipt);

export default router;