
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Mail, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SuccessPage = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    // In a real app this would download the actual receipt
    toast({
      title: "Receipt downloaded",
      description: "Your receipt has been downloaded successfully.",
      variant: "default",
    });
  };

  const handleEmail = () => {
    // In a real app this would email the receipt
    toast({
      title: "Receipt emailed",
      description: "Your receipt has been sent to your email.",
      variant: "default",
    });
  };

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

            <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">Application Submitted Successfully!</h1>
            <p className="text-gray-600 mb-8">Your insurance application has been received and is being processed.</p>

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
                <Button onClick={handleDownload} variant="outline" className="flex gap-2">
                  <Download className="h-4 w-4" />
                  Download Receipt
                </Button>

                <Button onClick={handleEmail} variant="outline" className="flex gap-2">
                  <Mail className="h-4 w-4" />
                  Email Receipt
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 flex flex-col space-y-4">
              <h3 className="font-medium">Have questions?</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  to="/"
                  className="flex items-center justify-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  <span>View FAQs</span>
                </Link>
                
                <Link 
                  to="/"
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
