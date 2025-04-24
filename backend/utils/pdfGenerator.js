// utils/pdfGenerator.js
import PDFDocument from 'pdfkit';

export const generatePDF = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a document
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      // Collect PDF data chunks
      doc.on('data', buffer => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      // Add content to PDF
      
      // Logo and header
      doc.fontSize(25)
         .text('Student Insurance', { align: 'center' })
         .moveDown();
      
      // Receipt title
      doc.fontSize(20)
         .text('Payment Receipt', { align: 'center' })
         .moveDown();
         
      // Draw a line
      doc.moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke()
         .moveDown();
      
      // Receipt information
      doc.fontSize(12);
         
      const tableStart = doc.y;
      const colWidth = (doc.page.width - 100) / 2;
      
      // Function to add a row to the table
      const addRow = (label, value) => {
        const rowStart = doc.y;
        doc.text(label, 50, rowStart);
        doc.text(value, 50 + colWidth, rowStart);
        doc.moveDown();
      };
      
      // Add receipt details
      addRow('Receipt Number:', data.receiptNumber);
      addRow('Transaction ID:', data.transactionId);
      addRow('Amount:', `KES ${data.amount.toLocaleString()}`);
      addRow('Date:', new Date(data.date).toLocaleString());
      addRow('Phone Number:', data.phone);
      addRow('Status:', data.status);
      addRow('Reference:', data.merchantRequestId);
      
      // Draw a line
      doc.moveTo(50, doc.y)
         .lineTo(doc.page.width - 50, doc.y)
         .stroke()
         .moveDown();
         
      // Footer
      doc.fontSize(10)
         .text('Thank you for your payment. This is an official receipt for your insurance premium.', {
           align: 'center'
         })
         .moveDown()
         .text('For any questions, please contact our support team.', {
           align: 'center'
         });
      
      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};