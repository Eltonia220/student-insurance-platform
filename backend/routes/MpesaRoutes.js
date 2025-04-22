import express from 'express';
import { initiateSTKPush } from '../controllers/mpesaController.js';

const router = express.Router();

// STK Push endpoint
router.post('/stk-push', initiateSTKPush);

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ status: 'success', message: 'Test endpoint working' });
});

export default router;