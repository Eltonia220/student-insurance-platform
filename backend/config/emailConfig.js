// backend/config/emailConfig.js

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Email configuration
const emailConfig = {
  // SMTP transport configuration
  transport: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Default to Gmail, change as needed
    port: parseInt(process.env.EMAIL_PORT) || 587,    // Default port for TLS
    secure: process.env.EMAIL_SECURE === 'true',      // true for 465 port, false for other ports
    auth: {
      user: process.env.EMAIL_USER,                   // Your email address
      pass: process.env.EMAIL_PASSWORD,               // Your email password or app password
    },
  },
  
  // Default email options
  defaults: {
    from: process.env.EMAIL_FROM || '"Student Insurance Platform" <noreply@example.com>',
  },
};

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(emailConfig.transport, emailConfig.defaults);

// Verify connection configuration
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('Email server connection established successfully');
    return true;
  } catch (error) {
    console.error('Error verifying email connection:', error);
    return false;
  }
};

// Export functions and objects
export const sendMail = async (options) => {
  try {
    const info = await transporter.sendMail(options);
    console.log('Message sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export { transporter, verifyConnection };