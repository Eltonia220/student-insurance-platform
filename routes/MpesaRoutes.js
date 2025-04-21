import express from 'express';
import axios from 'axios';
import { generateAccessToken } from './utils/mpesaAuth.js'; // update path as needed

const router = express.Router();

// Token test route
router.get('/token', async (req, res) => {
  try {
    const token = await generateAccessToken();
    res.json({ access_token: token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get access token' });
  }
});

// STK Push
router.post('/stkpush', async (req, res) => {
  const { phone, amount } = req.body;
  const token = await generateAccessToken();

  const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14);
  const password = Buffer.from(
    process.env.DARAJA_SHORTCODE + process.env.DARAJA_PASSKEY + timestamp
  ).toString('base64');

  const payload = {
    BusinessShortCode: process.env.DARAJA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.DARAJA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: process.env.DARAJA_CALLBACK_URL,
    AccountReference: 'Student Insurance',
    TransactionDesc: 'Insurance Payment',
  };

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({ response: response.data });
  } catch (err) {
    console.error('STK Push Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'STK Push failed', details: err.message });
  }
});

export default router;
