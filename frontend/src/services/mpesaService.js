// frontend/src/services/mpesaService.js
import axios from 'axios';

// Point to your backend server URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/mpesa/stk-push'

export const mpesaService = {
  /**
   * Initiates an M-PESA STK push request
   * @param {Object} paymentData - Payment details
   * @param {string} paymentData.phoneNumber - Customer phone number
   * @param {number} paymentData.amount - Amount to pay
   * @param {string} paymentData.reference - Payment reference
   * @returns {Promise} Promise with the STK push response
   */
  initiatePayment: async (paymentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/mpesa/stk-push`, paymentData);

      return response.data;
    } catch (error) {
      console.error('M-PESA payment initiation failed:', error);
      throw error;
    }
  },

  /**
   * Checks the status of an M-PESA payment
   * @param {string} checkoutRequestId - The checkout request ID from the STK push
   * @returns {Promise} Promise with the payment status
   */
  checkPaymentStatus: async (checkoutRequestId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/mpesa/status/${checkoutRequestId}`);
      return response.data;
    } catch (error) {
      console.error('M-PESA status check failed:', error);
      throw error;
    }
  },

  /**
   * Gets payment confirmation from callback data
   * @param {string} merchantRequestId - The merchant request ID to check
   * @returns {Promise} Promise with the callback data
   */
  getPaymentConfirmation: async (merchantRequestId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments/mpesa/confirmation/${merchantRequestId}`);
      return response.data;
    } catch (error) {
      console.error('M-PESA confirmation check failed:', error);
      throw error;
    }
  }
};