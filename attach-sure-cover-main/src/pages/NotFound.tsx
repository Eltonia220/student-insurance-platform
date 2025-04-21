
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <div className="space-y-4">
              <Button asChild size="lg" className="w-full">
                <Link to="/">Return to Home</Link>
              </Button>
              <p className="text-gray-500">
                Need assistance? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link>
              </p>
            </div>
            
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium mb-4">You might find these helpful:</h2>
              <ul className="space-y-2 text-left">
                <li>
                  <Link to="/browse-plans" className="text-primary hover:underline flex items-center">
                    <span className="mr-2">•</span>
                    Browse Insurance Plans
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-primary hover:underline flex items-center">
                    <span className="mr-2">•</span>
                    How StudentSafe Works
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-primary hover:underline flex items-center">
                    <span className="mr-2">•</span>
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
