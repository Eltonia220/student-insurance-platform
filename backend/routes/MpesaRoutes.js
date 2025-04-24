import express from 'express';
import { 
  initiateSTKPush,
  mpesaCallback,  // Make sure this is imported
  testEndpoint 
} from '../controllers/mpesaController.js';

const router = express.Router();

// Existing routes
router.post('/stk-push', initiateSTKPush);
router.get('/test', testEndpoint);

// Add this critical callback route
router.post('/callback', mpesaCallback);  // <-- THIS WAS MISSING

// Debug endpoint to verify all routes
router.get('/debug', (_, res) => {
  const routes = {
    stkPush: 'POST /stk-push',
    callback: 'POST /callback',  // Now visible here
    test: 'GET /test'
  };
  res.json({ status: 'success', routes });
});

export default router;