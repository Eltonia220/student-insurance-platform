import axios from 'axios';
import { Buffer } from 'buffer';
import 'dotenv/config';

async function testStkPush() {
  try {
    console.log('STEP 1: Getting authentication token...');
    
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');
    
    const tokenResponse = await axios.get(
      process.env.MPESA_AUTH_URL,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    
    const token = tokenResponse.data.access_token;
    console.log('✅ Authentication successful, token received');
    
    // STEP 2: Prepare STK Push request
    console.log('\nSTEP 2: Preparing STK Push request...');
    
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.]/g, '')
      .slice(0, 14);
      
    const password = Buffer.from(
      `${process.env.MPESA_BUSINESS_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');
    
    // For testing, use your own phone number formatted correctly
    const phoneNumber = '254703411608'; // Replace with your test phone number
    
    const payload = {
      BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: 1,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'TestAccount',
      TransactionDesc: 'Test STK Push'
    };
    
    console.log('Request payload prepared:');
    console.log(JSON.stringify(payload, null, 2));
    
    // STEP 3: Send STK Push request
    console.log('\nSTEP 3: Sending STK Push request...');
    console.log('Sending to URL:', process.env.MPESA_STK_PUSH_URL);
    
    const response = await axios.post(
      process.env.MPESA_STK_PUSH_URL,
      payload,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n✅ STK Push request successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.ResponseCode === '0') {
      console.log('\n🎉 SUCCESS: STK Push prompt has been sent to the phone number!');
      console.log('Check your phone for the payment prompt');
      console.log('CheckoutRequestID:', response.data.CheckoutRequestID);
    } else {
      console.log('\n⚠️ NOTICE: Response received but with non-zero ResponseCode');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR with STK Push:');
    console.error('- Message:', error.message);
    
    if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Execute the test
testStkPush();