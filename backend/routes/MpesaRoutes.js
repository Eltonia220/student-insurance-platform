import express from 'express';
import { initiateSTKPush } from '../controllers/mpesaController.js';

const router = express.Router();

// Test endpoints
router.get('/', (_, res) => {
  res.json({
    status: 'success',
    message: 'M-Pesa base endpoint working',
    availableEndpoints: ['/test', '/stk-push']
  });
});

router.get('/test', (req, res) => {
  res.json({ status: 'success', message: 'Test endpoint working' });
});

// STK Push endpoint
router.post('/stk-push', initiateSTKPush);

export default router;