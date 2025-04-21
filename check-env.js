import 'dotenv/config';

// List of expected M-Pesa environment variables
const requiredVars = [
  'MPESA_BUSINESS_SHORTCODE',
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET',
  'MPESA_PASSKEY',
  'MPESA_AUTH_URL',
  'MPESA_STK_PUSH_URL',
  'MPESA_CALLBACK_URL'
];

console.log('==== M-PESA ENVIRONMENT VARIABLES CHECK ====');
console.log('');

let allVarsPresent = true;

// Check each variable
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = !!value;
  
  console.log(`${varName}: ${isSet ? '✅ SET' : '❌ MISSING'}`);
  
  // For set variables, show value for non-sensitive ones or just indicate presence for sensitive ones
  if (isSet) {
    if (varName.includes('KEY') || varName.includes('SECRET') || varName.includes('PASSKEY')) {
      console.log(`  Value: [HIDDEN FOR SECURITY]`);
    } else {
      console.log(`  Value: "${value}"`);
    }
  }
  
  if (!isSet) {
    allVarsPresent = false;
  }
});

console.log('');
console.log(`Overall status: ${allVarsPresent ? '✅ All variables are set' : '❌ Some variables are missing'}`);
console.log('');