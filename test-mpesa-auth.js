import axios from 'axios';
import { Buffer } from 'buffer';
import 'dotenv/config';

async function testMpesaAuth() {
  try {
    console.log('Testing M-Pesa authentication...');
    
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');
    
    console.log('Making auth request to:', process.env.MPESA_AUTH_URL);
    
    const response = await axios.get(
      process.env.MPESA_AUTH_URL,
      { 
        headers: { Authorization: `Basic ${auth}` },
        timeout: 10000
      }
    );
    
    console.log('Authentication successful!');
    console.log('Response data:', response.data);
    console.log('Access token received:', response.data.access_token ? '✅ YES' : '❌ NO');
    
    return response.data.access_token;
  } catch (error) {
    console.error('Authentication Error:');
    console.error('- Message:', error.message);
    
    if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Response data:', error.response.data);
    }
  }
}

testMpesaAuth();