// backend/services/emailService.js
import nodemailer from 'nodemailer';
import 'dotenv/config';

// Validate critical environment variables
const requiredVars = ['EMAIL_FROM', 'EMAIL_PASSWORD'];
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`❌ Missing required environment variable: ${varName}`);
  }
}

// Debug log to verify credentials are loaded
console.log('Email service initialized with:', {
  from: process.env.EMAIL_FROM,
  passwordSet: !!process.env.EMAIL_PASSWORD
});

// Create transporter with enhanced configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    // Do not fail on invalid certificates (helpful for testing)
    rejectUnauthorized: false
  },
  logger: true, // Enable logging
  debug: true // Include SMTP traffic in logs
});

/**
 * Send an email notification with enhanced error handling
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.subject - Email subject
 * @param {string} params.text - Plain text body
 * @param {string} [params.html] - Optional HTML body
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendEmailNotification = async ({ to, subject, text, html }) => {
  try {
    if (!to || !subject || !text) {
      throw new Error('Missing required email parameters');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html: html || text // Fallback to text if html not provided
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('👀 Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Email sending failed:');
    console.error('🔴 Error code:', error.code);
    console.error('📛 Error message:', error.message);
    
    // Special handling for common Gmail errors
    if (error.code === 'EAUTH') {
      console.error('\n🔑 Authentication failed. Solutions:');
      console.error('1. Verify your EMAIL_FROM and EMAIL_PASSWORD in .env');
      console.error('2. If using Gmail:');
      console.error('   - Enable 2FA at https://myaccount.google.com/security');
      console.error('   - Create App Password at https://myaccount.google.com/apppasswords');
      console.error('3. Check "Less secure apps" at https://myaccount.google.com/lesssecureapps');
    }
    
    return {
      success: false,
      message: error.message,
      errorCode: error.code
    };
  }
};