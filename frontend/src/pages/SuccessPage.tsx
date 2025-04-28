import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Mail, HelpCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Input } from '@/components/ui/input';

const SuccessPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [manualLookup, setManualLookup] = useState(false);
  const [manualTransactionId, setManualTransactionId] = useState('');

  // Extract transaction ID from multiple possible sources
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // All possible parameter names used by various payment gateways
    const possibleParamNames = [
      'transactionId', 'transactionID', 'transaction_id', 'txn_id',
      'id', 'payment_id', 'reference', 'ref', 'order_id',
      'payment_reference', 'merchant_reference', 'checkout_id'
    ];
    
    let transactionId;
    
    // Check URL parameters first
    for (const param of possibleParamNames) {
      if (searchParams.get(param)) {
        transactionId = searchParams.get(param);
        console.log(`Found transaction ID in URL parameter '${param}':`, transactionId);
        break;
      }
    }
    
    // Check location state next
    if (!transactionId && location.state) {
      transactionId = location.state.transactionId || 
                      location.state.transactionID || 
                      location.state.paymentReference ||
                      location.state.reference;
      
      if (transactionId) {
        console.log('Found transaction ID in location state:', transactionId);
      }
    }
    
    // Finally check sessionStorage
    if (!transactionId) {
      const storedData = sessionStorage.getItem('pendingTransaction');
      if (storedData) {
        try {
          const { id, timestamp } = JSON.parse(storedData);
          // Only use if data is fresh (within 1 hour)
          if (Date.now() - timestamp < 3600000) {
            transactionId = id;
            console.log('Found transaction ID in sessionStorage:', transactionId);
            sessionStorage.removeItem('pendingTransaction'); // Clean up
          }
        } catch (e) {
          console.error('Error parsing stored transaction data:', e);
        }
      }
    }
    
    if (transactionId) {
      fetchTransactionDetails(transactionId);
    } else {
      console.error("No transaction ID found in URL, state, or storage");
      console.debug("Location search:", location.search);
      console.debug("Location state:", location.state);
      setLoading(false);
      showTransactionNotFoundError();
    }
  }, [location]);

  const fetchTransactionDetails = async (transactionId) => {
    try {
      setLoading(true);
      console.log("Fetching transaction details for ID:", transactionId);
      
      const response = await axios.get(`/api/transactions/${transactionId}`, {
        timeout: 10000,
      });
      
      console.log("Transaction data received:", response.data);
      
      if (response.data) {
        setTransaction(response.data);
      } else {
        throw new Error("Empty response received");
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
      
      const errorMessage = error.response 
        ? `Error ${error.response.status}: ${error.response.data?.message || 'Server error'}` 
        : error.message || "Network error";
      
      toast({
        title: "Error",
        description: `Failed to load transaction details. ${errorMessage}`,
        variant: "destructive",
      });
      
      // If we have a transaction ID but failed to fetch, show manual lookup
      setManualLookup(true);
      setManualTransactionId(transactionId);
    } finally {
      setLoading(false);
    }
  };

  const showTransactionNotFoundError = () => {
    toast({
      title: "Transaction not found",
      description: "We couldn't find your transaction details. Please contact support with your payment details.",
      variant: "destructive",
    });
  };

  const handleDownload = async () => {
    if (!transaction) return;
    
    try {
      setLoading(true);
      toast({
        title: "Downloading",
        description: "Preparing your receipt...",
        variant: "default",
      });
      
      const response = await axios.get(`/api/transactions/${transaction.id}/receipt`, {
        responseType: 'blob',
        timeout: 15000,
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt-${transaction.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      link.remove();
      
      toast({
        title: "Receipt downloaded",
        description: "Your receipt has been downloaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast({
        title: "Download failed",
        description: "We couldn't download your receipt. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async () => {
    if (!transaction) return;
    
    try {
      setLoading(true);
      toast({
        title: "Sending",
        description: "Sending receipt to your email...",
        variant: "default",
      });
      
      await axios.post(`/api/transactions/${transaction.id}/email-receipt`);
      
      toast({
        title: "Receipt emailed",
        description: "Your receipt has been sent to your email address.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error emailing receipt:", error);
      toast({
        title: "Email failed",
        description: "We couldn't email your receipt. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualLookup = () => {
    if (!manualTransactionId.trim()) {
      toast({
        title: "Invalid Transaction ID",
        description: "Please enter a valid transaction ID",
        variant: "destructive",
      });
      return;
    }
    fetchTransactionDetails(manualTransactionId.trim());
  };

  const renderFallbackTransaction = () => (
    <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6">
      <h2 className="font-medium mb-2 text-center text-yellow-800">Transaction Information Not Available</h2>
      <p className="text-sm text-center text-yellow-700 mb-4">
        We're unable to display your transaction details at this time.
      </p>
      
      {manualLookup ? (
        <div className="flex flex-col gap-3 items-center">
          <div className="flex gap-2 w-full max-w-md">
            <Input
              value={manualTransactionId}
              onChange={(e) => setManualTransactionId(e.target.value)}
              placeholder="Enter your transaction ID"
              className="flex-1"
            />
            <Button 
              onClick={handleManualLookup}
              disabled={!manualTransactionId.trim() || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Look Up"}
            </Button>
          </div>
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => navigate('/support')}
            className="text-xs"
          >
            Need help? Contact Support
          </Button>
        </div>
      ) : (
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-xs"
          >
            <Loader2 className="h-3 w-3 mr-1" /> Retry Loading
          </Button>
          <Button 
            variant="link"
            size="sm"
            onClick={() => setManualLookup(true)}
            className="text-xs"
          >
            Enter Transaction ID Manually
          </Button>
        </div>
      )}
    </div>
  );

  if (loading && !transaction) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <span className="text-gray-600">Loading transaction details...</span>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-100">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">Your payment has been processed successfully.</p>

            {transaction ? (
              <div className="bg-gray-50 rounded-md p-4 mb-6 text-left">
                <h2 className="font-medium mb-2 text-center">Payment Details</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="font-mono">{transaction.id}</span>
                  
                  <span className="font-medium">Amount:</span>
                  <span>KES {transaction.amount?.toLocaleString() || 'N/A'}</span>
                  
                  <span className="font-medium">Date:</span>
                  <span>{transaction.payment_date ? new Date(transaction.payment_date).toLocaleString() : 'N/A'}</span>
                  
                  <span className="font-medium">Status:</span>
                  <span className="text-green-600 font-medium">{transaction.status || 'Completed'}</span>
                  
                  {transaction.receipt_number && (
                    <>
                      <span className="font-medium">Receipt Number:</span>
                      <span>{transaction.receipt_number}</span>
                    </>
                  )}
                </div>
              </div>
            ) : renderFallbackTransaction()}

            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 rounded-md p-4">
                <h2 className="font-medium mb-2">What happens next?</h2>
                <ol className="text-sm text-left space-y-2">
                  <li className="flex gap-2">
                    <span className="font-medium">1.</span>
                    <span>Our team will review your application within 24 hours.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">2.</span>
                    <span>You will receive an email confirmation with your policy details.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">3.</span>
                    <span>Your coverage will begin on your selected start date.</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleDownload} 
                  variant="outline" 
                  className="flex gap-2"
                  disabled={loading || !transaction}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Download Receipt
                </Button>

                <Button 
                  onClick={handleEmail} 
                  variant="outline" 
                  className="flex gap-2"
                  disabled={loading || !transaction}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  Email Receipt
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 flex flex-col space-y-4">
              <h3 className="font-medium">Have questions?</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  to="/faqs"
                  className="flex items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  <span>View FAQs</span>
                </Link>
                
                <Link 
                  to="/support"
                  className="flex items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  <span>Contact Support</span>
                </Link>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link to="/dashboard">Return to Dashboard</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPage;