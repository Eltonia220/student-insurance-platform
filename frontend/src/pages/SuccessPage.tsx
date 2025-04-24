import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Mail, HelpCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const SuccessPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract transaction ID from URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const transactionId = searchParams.get('transactionId');
    
    if (transactionId) {
      fetchTransactionDetails(transactionId);
    } else {
      setLoading(false);
      toast({
        title: "Transaction not found",
        description: "We couldn't find your transaction details.",
        variant: "destructive",
      });
    }
  }, [location]);

  const fetchTransactionDetails = async (transactionId) => {
    try {
      const response = await axios.get(`/api/transactions/${transactionId}`);
      setTransaction(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load transaction details.",
        variant: "destructive",
      });
      console.error("Error fetching transaction:", error);
    }
  };

  const handleDownload = async () => {
    if (!transaction) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/transactions/${transaction.id}/receipt`, {
        responseType: 'blob',
      });
      
      // Create a download link and click it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt-${transaction.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setLoading(false);
      toast({
        title: "Receipt downloaded",
        description: "Your receipt has been downloaded successfully.",
        variant: "default",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Download failed",
        description: "We couldn't download your receipt. Please try again.",
        variant: "destructive",
      });
      console.error("Error downloading receipt:", error);
    }
  };

  const handleEmail = async () => {
    if (!transaction) return;
    
    try {
      setLoading(true);
      await axios.post(`/api/transactions/${transaction.id}/email-receipt`);
      setLoading(false);
      
      toast({
        title: "Receipt emailed",
        description: "Your receipt has been sent to your email.",
        variant: "default",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Email failed",
        description: "We couldn't email your receipt. Please try again.",
        variant: "destructive",
      });
      console.error("Error emailing receipt:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading transaction details...</span>
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
            <p className="text-gray-600 mb-8">Your insurance payment has been processed successfully.</p>

            {transaction && (
              <div className="bg-gray-50 rounded-md p-4 mb-6 text-left">
                <h2 className="font-medium mb-2 text-center">Payment Details</h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-medium">Transaction ID:</span>
                  <span>{transaction.id}</span>
                  
                  <span className="font-medium">Amount:</span>
                  <span>KES {transaction.amount.toLocaleString()}</span>
                  
                  <span className="font-medium">Date:</span>
                  <span>{new Date(transaction.payment_date).toLocaleString()}</span>
                  
                  <span className="font-medium">Status:</span>
                  <span className="text-green-600 font-medium">{transaction.status}</span>
                  
                  {transaction.receipt_number && (
                    <>
                      <span className="font-medium">Receipt Number:</span>
                      <span>{transaction.receipt_number}</span>
                    </>
                  )}
                </div>
              </div>
            )}

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
                    <span>Your insurance coverage will begin on your selected start date.</span>
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