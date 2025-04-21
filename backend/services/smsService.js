import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMSNotification = (to, message) => {
  client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,  // Twilio phone number
    to: to                                // Receiver's phone number
  })
  .then((message) => {
    console.log('SMS sent:', message.sid);
  })
  .catch((error) => {
    console.error('Error sending SMS:', error);
  });
};
