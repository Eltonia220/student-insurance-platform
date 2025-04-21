import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_PASS,
  },
});

/**
 * Sends a payment success email to the student
 * @param {Object} param0
 * @param {string} param0.email - Student's email address
 * @param {string} param0.phone - Student's phone number
 * @param {string} param0.amount - Amount paid
 * @param {string} param0.receipt - M-Pesa receipt number
 */
const sendPaymentNotification = async ({ email, phone, amount, receipt }) => {
  if (!email) {
    console.warn('⚠️ No email provided for payment notification');
    return;
  }

  try {
    const mailOptions = {
      from: `"Student Insurance" <${process.env.NOTIFY_EMAIL}>`,
      to: email,
      subject: 'Payment Confirmation - Insurance Platform',
      html: `
        <h2>✅ Payment Received</h2>
        <p>Dear Student,</p>
        <p>Thank you for your payment. Here are the details:</p>
        <ul>
          <li><strong>Phone Number:</strong> ${phone}</li>
          <li><strong>Amount Paid:</strong> KES ${amount}</li>
          <li><strong>Receipt Number:</strong> ${receipt}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <br/>
        <p>Regards,<br/>Student Insurance Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Payment notification sent to ${email}`);
  } catch (err) {
    console.error('❌ Failed to send email notification to student:', err.message);
  }
};

export default sendPaymentNotification;
