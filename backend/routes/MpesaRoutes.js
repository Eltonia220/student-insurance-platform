import express from 'express';
import { initiateSTKPush, mpesaCallback } from '../controllers/mpesaController.js';

const router = express.Router();

// STK Push Initiation
router.post('/stk-push', initiateSTKPush);

// M-Pesa Callback Handler
router.post('/callback', mpesaCallback);

// Test endpoint (optional)
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'M-Pesa routes are working' });
});

export default router;