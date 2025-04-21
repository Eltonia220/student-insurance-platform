// services/notificationService.js

// Example email notification service
export const sendEmailNotification = async (recipient, message) => {
    console.log(`[Notification] Email to ${recipient}: ${message}`);
    // Implement your actual email sending logic here
  };
  
  // Example SMS notification service (useful for M-Pesa confirmations)
  export const sendSMSNotification = async (phoneNumber, message) => {
    console.log(`[Notification] SMS to ${phoneNumber}: ${message}`);
    // Implement your actual SMS sending logic here
  };
  
  export default {
    sendEmailNotification,
    sendSMSNotification
  };