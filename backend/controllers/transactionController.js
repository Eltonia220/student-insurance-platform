import models from '../models/index.js';
const { Transaction, User } = models;

import { generatePDF } from '../utils/pdfGenerator.js';
import { sendEmail } from '../utils/emailService.js';
import logger from '../utils/logger.js';

// Get transaction by ID
export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔥 Getting transaction with ID: ${id}`);
    const transaction = await Transaction.findByPk(id);
    
    if (!transaction) {
      console.log(`❌ Transaction not found for ID: ${id}`);
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    console.log(`✅ Found transaction with ID: ${id}`);
    return res.status(200).json(transaction);
  } catch (error) {
    logger.error(`Error fetching transaction: ${error.message}`, { error });
    console.log(`❌ Error fetching transaction: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Generate and download receipt
export const downloadReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔥 Generating receipt for transaction ID: ${id}`);
    const transaction = await Transaction.findByPk(id);
    
    if (!transaction) {
      console.log(`❌ Transaction not found for ID: ${id}`);
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Generate PDF buffer
    const pdfBuffer = await generatePDF({
      transactionId: transaction.id,
      amount: transaction.amount,
      date: transaction.payment_date,
      receiptNumber: transaction.receipt_number || `RCPT-${transaction.id}`,
      phone: transaction.phone,
      merchantRequestId: transaction.merchant_request_id,
      status: transaction.status
    });

    console.log(`✅ PDF generated for transaction ID: ${id}`);
    
    // Set headers and send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Receipt-${transaction.id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    logger.error(`Error generating receipt: ${error.message}`, { error });
    console.log(`❌ Error generating receipt: ${error.message}`);
    return res.status(500).json({ message: 'Failed to generate receipt' });
  }
};

// Email receipt to user
export const emailReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔥 Sending receipt email for transaction ID: ${id}`);
    const transaction = await Transaction.findByPk(id);
    
    if (!transaction) {
      console.log(`❌ Transaction not found for ID: ${id}`);
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Generate PDF buffer
    const pdfBuffer = await generatePDF({
      transactionId: transaction.id,
      amount: transaction.amount,
      date: transaction.payment_date,
      receiptNumber: transaction.receipt_number || `RCPT-${transaction.id}`,
      phone: transaction.phone,
      merchantRequestId: transaction.merchant_request_id,
      status: transaction.status
    });

    console.log(`✅ PDF generated for transaction ID: ${id}`);

    // Fetch user by phone number
    const user = await getUserByPhone(transaction.phone);
    const email = user ? user.email : null;

    if (!email) {
      console.log(`❌ No email found for phone number: ${transaction.phone}`);
      return res.status(404).json({ message: 'User email not found' });
    }

    console.log(`✅ Email found for user: ${email}`);
    
    // Send email
    await sendEmail({
      to: email,
      subject: 'Your Insurance Payment Receipt',
      text: `Thank you for your payment of KES ${transaction.amount}. Your receipt is attached.`,
      attachments: [
        {
          filename: `Receipt-${transaction.id}.pdf`,
          content: pdfBuffer
        }
      ]
    });
    
    console.log(`✅ Receipt email sent successfully to: ${email}`);
    return res.status(200).json({ message: 'Receipt sent to email successfully' });
  } catch (error) {
    logger.error(`Error emailing receipt: ${error.message}`, { error });
    console.log(`❌ Error emailing receipt: ${error.message}`);
    return res.status(500).json({ message: 'Failed to email receipt' });
  }
};

// Helper function to get user by phone
const getUserByPhone = async (phone) => {
  try {
    console.log(`🔥 Fetching user by phone: ${phone}`);
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      console.log(`❌ No user found with phone: ${phone}`);
    }
    return user;
  } catch (error) {
    logger.error(`Error fetching user by phone: ${error.message}`, { error });
    console.log(`❌ Error fetching user by phone: ${error.message}`);
    return null;
  }
};
