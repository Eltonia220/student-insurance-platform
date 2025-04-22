// routes/MpesaRoutes.js
import express from 'express';

// Create a router instance
const router = express.Router();

// Add a test route
router.get('/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'M-Pesa test endpoint is working!'
  });
});

// Add a root route
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'M-Pesa API base endpoint is working!',
    availableRoutes: ['/test']
  });
});

// Export the router
export default router;