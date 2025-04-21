// Import the necessary functions
import { processCallbackData } from '../services/MpesaService.js';  // Adjust this path based on your file structure

// Mock M-Pesa Callback Data (Successful Payment)
const mockCallbackDataSuccess = {
  Body: {
    stkCallback: {
      ResultCode: 0, // 0 indicates success
      ResultDesc: "Success",
      CallbackMetadata: {
        Item: [
          { Name: "PhoneNumber", Value: "254703411608" }, // Replace with a test phone number
          { Name: "Amount", Value: 10 },
          { Name: "MpesaReceiptNumber", Value: "1234567890" }
        ]
      }
    }
  }
};

// Mock M-Pesa Callback Data (Failed Payment)
const mockCallbackDataFailed = {
  Body: {
    stkCallback: {
      ResultCode: 1, // Non-zero value indicates failure
      ResultDesc: "Payment Failed",
      CallbackMetadata: {
        Item: [
          { Name: "PhoneNumber", Value: "2547XXXXXXX" },
          { Name: "Amount", Value: 1000 },
          { Name: "MpesaReceiptNumber", Value: "1234567890" }
        ]
      }
    }
  }
};

// Test function to simulate the callback processing
const testCallback = async (callbackData) => {
  try {
    console.log('🔄 Testing M-Pesa callback processing...');
    await processCallbackData(callbackData); // Pass the mock data to your processing function
    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Test success scenario
testCallback(mockCallbackDataSuccess);

// Test failure scenario
testCallback(mockCallbackDataFailed);
