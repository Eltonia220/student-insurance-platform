// routes/transactionsRoutes.js
import express from 'express';
import { 
  getTransaction, 
  downloadReceipt, 
  emailReceipt 
} from '../controllers/transactionController.js';
import { authenticate } from '../middlewares/authMiddleware.js';



const router = express.Router();

// Get transaction details
router.get('/:id', authenticate, getTransaction);

// Generate and download receipt
router.get('/:id/receipt', authenticate, downloadReceipt);

// Email receipt to user
router.post('/:id/email-receipt', authenticate, emailReceipt);

export default router;