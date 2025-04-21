import { processCallbackData } from '../services/MpesaService.js';

export const mpesaCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    // Process the callback data (e.g., save to DB or trigger other logic)
    console.log('✅ M-Pesa Callback Received:', JSON.stringify(callbackData, null, 2));
    
    // Call service to handle the logic (you can modify the service method as needed)
    await processCallbackData(callbackData);

    // Respond with a success message
    res.status(200).json({ status: 'success', message: 'Callback received successfully' });
  } catch (error) {
    console.error('Error processing M-Pesa callback:', error);
    res.status(500).json({ status: 'fail', message: 'Error processing callback' });
  }
};
