const nodemailer = require('nodemailer');

// Configure transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your provider
  port: 587, // Usually 587 (TLS) or 465 (SSL)
  secure: false, // true for SSL, false for TLS
  auth: {
    user: 'your_email@gmail.com', // Your email
    pass: 'your_app_password', // Your password or app password
  },
});

// Test email
transporter.sendMail({
  from: '"Test" <your_email@gmail.com>',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email.',
}, (err, info) => {
  if (err) {
    console.error('❌ Error sending email:', err);
  } else {
    console.log('✅ Email sent:', info.response);
  }
});