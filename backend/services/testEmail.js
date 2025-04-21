require('dotenv').config();
const nodemailer = require('nodemailer');

// Debug: Show loaded email config
console.log('Email Configuration:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD ? '*****' : 'MISSING'
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // For testing only
  }
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.TEST_EMAIL_RECIPIENT,
      subject: 'Test Email from Student Insurance Platform',
      text: 'This is a test email from your student insurance platform.',
      html: '<b>This is a test email from your student insurance platform.</b>'
    });

    console.log('✅ Email sent successfully!');
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.log('\nTroubleshooting Guide:');
    console.log('1. Verify your Gmail has 2FA enabled');
    console.log('2. Confirm you generated an App Password');
    console.log('3. Check your .env file is in the root directory');
    console.log('4. Ensure "Less secure apps" is enabled if not using 2FA');
  }
}

sendTestEmail();
