// backend/services/testEmailService.js
import 'dotenv/config'; // This must be FIRST
import { sendEmailNotification } from './emailservice.js';

console.log('Environment variables:', {
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '*****' : 'MISSING'
});

const testEmail = async () => {
  const result = await sendEmailNotification({
    to: 'eltonianyingi@gmail.com',
    subject: 'Service Test Email',
    text: 'This is a test of the email service functionality.'
  });

  console.log('Test completed:', result);
};

testEmail();