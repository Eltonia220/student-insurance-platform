require('dotenv').config();
const nodemailer = require('nodemailer');

// Debug: Verify environment variables are loaded
console.log('Checking environment variables...');
console.log({
  SMTP_HOST: process.env.SMTP_HOST ? '*****' : 'MISSING',
  SMTP_PORT: process.env.SMTP_PORT ? '*****' : 'MISSING',
  SMTP_USER: process.env.SMTP_USER ? '*****' : 'MISSING',
  SMTP_PASS: process.env.SMTP_PASS ? '*****' : 'MISSING'
});

// Create transporter with enhanced configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  },
  logger: true,
  debug: true
});

async function sendTestEmail() {
  try {
    console.log('Attempting to send test email...');
    
    const info = await transporter.sendMail({
      from: `"Test Sender" <${process.env.SMTP_USER}>`,
      to: process.env.TEST_RECIPIENT,
      subject: 'Test Email',
      text: 'This is a test email from Node.js',
      html: '<b>This is a test email from Node.js</b>'
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
    
    // Additional troubleshooting for common issues
    if (error.code === 'EAUTH') {
      console.error('\n🔑 Authentication failed. Please check:');
      console.error('1. Your SMTP_USER and SMTP_PASS in .env file');
      console.error('2. If using Gmail, ensure you created an App Password');
      console.error('3. That "Less secure app access" is enabled if not using OAuth');
    }
  } finally {
    transporter.close();
  }
}

sendTestEmail();