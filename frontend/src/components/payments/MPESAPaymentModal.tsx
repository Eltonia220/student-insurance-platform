// src/components/payments/MPESAPaymentModal.jsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
// Fix for Error 1: Correct the import path for mpesaService
// Option 1: Adjust the path to match your project structure
import { mpesaService } from '../../services/mpesaService';
// Option 2: Or create the service directly in this file (uncomment if you prefer this approach)
/*
const mpesaService = {
  initiatePayment: async (paymentData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/mpesa/stk-push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      return await response.json();
    } catch (error) {
      console.error('M-PESA payment initiation failed:', error);
      throw error;
    }
  },
  
  getPaymentConfirmation: async (merchantRequestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/mpesa/confirmation/${merchantRequestId}`);
      return await response.json();
    } catch (error) {
      console.error('M-PESA confirmation check failed:', error);
      throw error;
    }
  }
};
*/

import { Phone, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const MPESAPaymentModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  amount, 
  reference = 'INS' + new Date().getTime().toString().slice(-6)
}) => {
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form'); // form, processing, success, failure
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [merchantRequestId, setMerchantRequestId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Format phone number as user types
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // If it starts with 0, replace with 254
    if (value.startsWith('0') && value.length > 1) {
      value = `254${value.slice(1)}`;
    }
    
    setPhoneNumber(value);
  };

  // Function to initiate payment
  const handleInitiatePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 12) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid M-PESA phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');
    
    try {
      const response = await mpesaService.initiatePayment({
        phoneNumber,
        amount,
        reference
      });
      
      if (response.success) {
        setCheckoutRequestId(response.data.CheckoutRequestID);
        setMerchantRequestId(response.data.MerchantRequestID);
        toast({
          title: "Request sent to your phone",
          description: "Please check your phone for the M-PESA prompt",
          variant: "default",
        });
        
        // Start polling for payment status
        startPolling(response.data.CheckoutRequestID, response.data.MerchantRequestID);
      } else {
        setPaymentStep('failure');
        setErrorMessage(response.message || 'Failed to initiate payment');
        toast({
          title: "Payment Failed",
          description: response.message || "There was an error processing your payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      setPaymentStep('failure');
      setErrorMessage(error.response?.data?.message || error.message || 'Network error');
      toast({
        title: "Payment Request Failed",
        description: "There was an error sending the payment request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to poll for payment status
  const startPolling = (checkoutId, merchantId) => {
    // Clear any existing polling
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    const interval = setInterval(async () => {
      try {
        const statusResponse = await mpesaService.getPaymentConfirmation(merchantId);
        
        if (statusResponse.success) {
          if (statusResponse.data.ResultCode === '0') {
            // Payment successful
            clearInterval(interval);
            setPaymentStep('success');
            toast({
              title: "Payment Successful",
              description: "Your payment has been processed successfully",
              variant: "default",
            });
            
            // Wait a moment before closing the modal and proceeding
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 2000);
          } else if (statusResponse.data.ResultCode) {
            // Payment failed with specific error
            clearInterval(interval);
            setPaymentStep('failure');
            setErrorMessage(statusResponse.data.ResultDesc || 'Payment failed');
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 5000); // Check every 5 seconds
    
    setPollingInterval(interval);
    
    // Set a timeout to stop polling after 2 minutes
    setTimeout(() => {
      clearInterval(interval);
      // Only change to failure if still processing (user might have already paid)
      if (paymentStep === 'processing') {
        setPaymentStep('timeout');
      }
    }, 120000);
  };

  // Clean up interval on unmount or when modal closes
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);
  
  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setPaymentStep('form');
      setErrorMessage('');
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>M-PESA Payment</DialogTitle>
        </DialogHeader>
        
        {paymentStep === 'form' && (
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-green-50 rounded-md">
              <div className="flex-shrink-0 mr-3">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  Pay KSh {amount.toLocaleString()} via M-PESA
                </p>
                <p className="text-xs text-gray-500">
                  You will receive a prompt on your phone to complete the payment
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Enter M-PESA Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g., 254712345678"
                value={phoneNumber}
                onChange={handlePhoneChange}
              />
              <p className="text-xs text-gray-500">
                Format: 254XXXXXXXXX (e.g., 254712345678)
              </p>
            </div>
          </div>
        )}
        
        {paymentStep === 'processing' && (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="text-center">
              <h3 className="font-medium">Payment in Progress</h3>
              <p className="text-sm text-gray-500 mt-1">
                Please check your phone and enter your M-PESA PIN to complete the payment
              </p>
            </div>
          </div>
        )}
        
        {paymentStep === 'success' && (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="text-center">
              <h3 className="font-medium text-lg">Payment Successful!</h3>
              <p className="text-sm text-gray-500 mt-1">
                Your payment has been processed successfully.
              </p>
            </div>
          </div>
        )}
        
        {paymentStep === 'failure' && (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500" />
            <div className="text-center">
              <h3 className="font-medium text-lg">Payment Failed</h3>
              <p className="text-sm text-red-500 mt-1">
                {errorMessage || 'There was an error processing your payment'}
              </p>
            </div>
          </div>
        )}
        
        {paymentStep === 'timeout' && (
          <div className="py-6 space-y-4">
            {/* Fix for Error 2: Changed variant from "warning" to "default" */}
            <Alert>
              <AlertDescription>
                We haven't received confirmation of your payment yet. If you completed the payment, please wait a moment. Otherwise, you can try again.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
          {paymentStep === 'form' && (
            <>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                onClick={handleInitiatePayment} 
                disabled={!phoneNumber || phoneNumber.length < 12 || isProcessing}
                className="w-full sm:w-auto"
              >
                Pay Now
              </Button>
            </>
          )}
          
          {paymentStep === 'processing' && (
            <Button variant="outline" onClick={onClose} className="w-full">
              Cancel Payment
            </Button>
          )}
          
          {(paymentStep === 'failure' || paymentStep === 'timeout') && (
            <>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={() => setPaymentStep('form')} className="w-full sm:w-auto">
                Try Again
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};