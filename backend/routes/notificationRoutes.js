import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure your email transporter for Gmail
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // smtp.gmail.com
  port: process.env.MAIL_PORT, // 587
  secure: process.env.MAIL_SECURE === 'true', // false for 587
  auth: {
    user: process.env.MAIL_USER, // your Gmail email
    pass: process.env.MAIL_PASSWORD, // your Gmail app password
  },
});

// API endpoint to send policy expiration reminders
router.post('/send-policy-reminder', async (req, res) => {
  try {
    const { policyId, clientEmail, clientName, policyType, expiryDate } = req.body;

    // Validate required fields
    if (!policyId || !clientEmail || !clientName || !policyType || !expiryDate) {
      return res.status(400).json({ success: false, message: 'Missing required information' });
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.MAIL_FROM, // The email from which the message is sent
      to: clientEmail, // Recipient's email
      subject: `Policy Reminder: Your ${policyType} policy expires soon`, // Email subject
      html: `
        <div>
          <h2>Policy Expiration Reminder</h2>
          <p>Hello ${clientName},</p>
          <p>This is a friendly reminder that your <strong>${policyType}</strong> policy 
             (ID: ${policyId}) will expire on <strong>${expiryDate}</strong>.</p>
          <p>Please contact our customer service to discuss renewal options.</p>
          <p>Thank you for choosing our services.</p>
          <p>Best regards,<br>Your Insurance Team</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Log the activity (optional)
    console.log(`Reminder sent to ${clientName} (${clientEmail}) for policy ${policyId}`);

    // Send success response
    return res.status(200).json({ success: true, message: 'Reminder email sent successfully' });

  } catch (error) {
    console.error('Error sending reminder email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send reminder email' });
  }
});

export default router;
