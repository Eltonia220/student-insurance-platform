import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Loader2, Phone, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MPESAPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

type PaymentStatus = 'input' | 'processing' | 'success' | 'error';

export function MPESAPaymentModal({ isOpen, onClose, onSuccess, amount }: MPESAPaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('input');
  const [countdown, setCountdown] = useState(60);

  // Format phone number to 254 format with improved handling
  const formatPhoneNumber = (number: string): string => {
    if (!number) return '';
    
    const digits = number.replace(/\D/g, '');
    
    // Handle Kenyan numbers starting with 0
    if (digits.startsWith('0') && digits.length >= 9) {
      return `254${digits.substring(1)}`;
    }
    
    // Handle numbers already in international format
    if (digits.startsWith('254')) {
      return digits;
    }
    
    // If number starts with 7, assume it's a Kenyan number without country code
    if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length >= 9) {
      return `254${digits}`;
    }
    
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
  };

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'processing' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 6000);
    } else if (countdown === 0 && status === 'processing') {
      setStatus('error');
      setError('Payment request timed out. Please try again.');
    }
    return () => clearTimeout(timer);
  }, [countdown, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCountdown(60);
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!formattedPhone || formattedPhone.length < 12 || !formattedPhone.startsWith('254')) {
      setError('Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)');
      return;
    }

    if (amount < 10) {
      setError('Minimum payment amount is Ksh 10');
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('processing');
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/mpesa/stk-push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone, // Changed from phoneNumber to phone to match backend
          amount: Math.round(amount)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Payment failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errorCode) {
        throw new Error(data.errorMessage || 'Payment request failed');
      }

      if (data.ResponseCode && data.ResponseCode !== "0") {
        throw new Error(data.ResponseDescription || 'Payment request failed');
      }

      setStatus('success');
      setTimeout(onSuccess, 2000);
      
    } catch (err) {
      console.error('Payment Error:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to process payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tryAgain = () => {
    setStatus('input');
    setError('');
    setPhoneNumber('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setStatus('input');
        setError('');
        setPhoneNumber('');
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">M-PESA Payment</DialogTitle>
        </DialogHeader>
        
        {status === 'input' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <p className="font-medium text-lg text-primary">Ksh {amount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Enter your M-PESA phone number to receive a payment prompt</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">M-PESA Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="phoneNumber"
                  placeholder="e.g. 0712345678"
                  className="pl-9"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={12}
                />
              </div>
              <p className="text-xs text-gray-500">Enter your phone number in the format: 0712345678 or 254712345678</p>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !phoneNumber || phoneNumber.length < 9}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Send Payment Request
              </Button>
            </div>
          </form>
        )}
        
        {status === 'processing' && (
          <div className="py-8 flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="text-center">
              <h3 className="font-medium text-lg">Processing Payment</h3>
              <p className="text-gray-500">
                Please check your phone for the M-PESA payment prompt
                <br />
                <span className="text-sm">(Time remaining: {countdown} seconds)</span>
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Cancel Payment
            </Button>
          </div>
        )}
        
        {status === 'success' && (
          <div className="py-8 flex flex-col items-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">Payment Request Sent</h3>
              <p className="text-gray-500">
                An M-PESA prompt has been sent to your phone. Please complete the payment.
              </p>
            </div>
            <Button variant="outline" onClick={onClose} className="mt-2">
              Close
            </Button>
          </div>
        )}
        
        {status === 'error' && (
          <div className="py-8 flex flex-col items-center space-y-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">Payment Failed</h3>
              <p className="text-gray-500">{error || 'An error occurred while processing your payment.'}</p>
              <div className="flex gap-3 mt-4 justify-center">
                <Button onClick={tryAgain} variant="default">
                  Try Again
                </Button>
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}