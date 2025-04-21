// tests/mpesaService.test.js
import { processCallbackData } from '../services/MpesaService.js';
import { db } from '../services/db.js';

// Mock the sendEmailNotification function to avoid actual email sending during tests
jest.mock('../services/emailService.js', () => ({
  sendEmailNotification: jest.fn(),
}));

// Mock the database querycd backend

jest.mock('../services/db.js', () => ({
  query: jest.fn(),
}));

describe('processCallbackData', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should process a successful payment and save the transaction', async () => {
    const callbackData = {
      Body: {
        stkCallback: {
          ResultCode: 0,
          ResultDesc: 'Success',
          CallbackMetadata: {
            Item: [
              { Name: 'PhoneNumber', Value: '2547XXXXXXXX' },
              { Name: 'Amount', Value: 100 },
              { Name: 'MpesaReceiptNumber', Value: '123456' },
            ],
          },
        },
      },
      UserId: 1,
    };

    db.query.mockResolvedValueOnce({ rows: [{ id: 1, email: 'test@example.com' }] }); // Mock user query result

    await processCallbackData(callbackData);

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO transactions (user_id, amount, phone, receipt_number, status, result_code, result_desc, callback_data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [1, 100, '2547XXXXXXXX', '123456', 'Success', 0, 'Success', JSON.stringify(callbackData)]
    );
    expect(sendEmailNotification).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Payment Received',
      text: 'We received a payment of KES 100. Receipt: 123456. Thank you!',
    });
  });

  it('should handle payment failure', async () => {
    const callbackData = {
      Body: {
        stkCallback: {
          ResultCode: 1,
          ResultDesc: 'Payment Failed',
          CallbackMetadata: {
            Item: [
              { Name: 'PhoneNumber', Value: '2547XXXXXXXX' },
              { Name: 'Amount', Value: 100 },
              { Name: 'MpesaReceiptNumber', Value: '123456' },
            ],
          },
        },
      },
      UserId: 1,
    };

    db.query.mockResolvedValueOnce({ rows: [] }); // No user found for this phone number

    await processCallbackData(callbackData);

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO transactions (status, callback_data) VALUES ($1, $2)',
      ['Failed', JSON.stringify(callbackData)]
    );
  });
});
