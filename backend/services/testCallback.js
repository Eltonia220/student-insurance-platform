// backend/tests/testCallback.js
import { sendEmailNotification } from '../services/emailservice.js';

// ================= VERIFICATION HELPERS =================
const verifySuccessfulPayment = (response) => {
  console.assert(
    response.success === true,
    '❌ Success test failed: Expected success=true'
  );
  console.assert(
    response.receiptNumber,
    '❌ Receipt test failed: Missing receipt number'
  );
  console.log('💰 Payment verification passed!');
};

const verifyFailedPayment = (response) => {
  console.assert(
    response.success === false,
    '❌ Failure test failed: Expected success=false'
  );
  console.assert(
    response.message?.includes('not successful') || response.error,
    '❌ Error message test failed: Missing error description'
  );
  console.log('🛑 Failure handling passed!');
};

// ================= MOCK SERVICES =================
const mockSaveToDB = async (data) => {
  // Extract amount from callback metadata
  const amountItem = data.Body.stkCallback.CallbackMetadata?.Item?.find(
    item => item.Name === "Amount"
  );
  const amount = amountItem?.Value || 0;
  
  return {
    success: true,
    amount,
    receiptNumber: 'MOCK' + Math.random().toString(36).substring(2, 10)
  };
};

// ================= TEST DATA =================
const testSuccessfulPayment = {
  Body: {
    stkCallback: {
      ResultCode: 0,
      ResultDesc: 'Success',
      CallbackMetadata: {
        Item: [
          { Name: "Amount", Value: 100 },
          { Name: "MpesaReceiptNumber", Value: "NCJ7F5B7JQ" },
          { Name: "PhoneNumber", Value: 254712345678 }
        ]
      }
    }
  }
};

const testFailedPayment = {
  Body: {
    stkCallback: {
      ResultCode: 1,
      ResultDesc: 'Insufficient funds'
    }
  }
};

// ================= CORE PROCESSING =================
const processMpesaCallback = async (callbackData) => {
  try {
    console.log('\n📥 Processing M-Pesa Callback Data:', JSON.stringify(callbackData, null, 2));
    
    if (callbackData.Body.stkCallback.ResultCode !== 0) {
      const errorMsg = `Payment not successful: ${callbackData.Body.stkCallback.ResultDesc}`;
      console.warn('⚠️', errorMsg);
      return { 
        success: false,
        message: errorMsg
      };
    }

    // Save to database
    const dbResult = await mockSaveToDB(callbackData);
    console.log(dbResult.success ? '✅ Transaction saved to DB' : '❌ DB save failed');

    // Extract amount for email
    const amount = callbackData.Body.stkCallback.CallbackMetadata.Item.find(
      item => item.Name === "Amount"
    ).Value;

    // Send notification
    const emailResult = await sendEmailNotification({
      to: 'customer@example.com',
      subject: 'Payment Confirmation',
      text: `Payment of KES ${amount} received. Receipt: ${dbResult.receiptNumber}`
    });

    return { 
      success: emailResult.success,
      message: 'Payment processed successfully',
      receiptNumber: dbResult.receiptNumber,
      amount
    };
    
  } catch (error) {
    console.error('❌ Callback processing failed:', error);
    return { 
      success: false,
      error: error.message 
    };
  }
};

// ================= TEST EXECUTION =================
(async () => {
  console.log('=== Starting M-Pesa Callback Tests ===');
  
  // Test successful payment
  console.log('\n🔄 Testing successful payment scenario...');
  const successResult = await processMpesaCallback(testSuccessfulPayment);
  verifySuccessfulPayment(successResult);
  
  // Test failed payment
  console.log('\n🔄 Testing failed payment scenario...');
  const failResult = await processMpesaCallback(testFailedPayment);
  verifyFailedPayment(failResult);
  
  console.log('\n=== Test Summary ===');
  console.log(`✅ Successful payment test: ${successResult.success ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ Failed payment test: ${!failResult.success ? 'PASSED' : 'FAILED'}`);
})();