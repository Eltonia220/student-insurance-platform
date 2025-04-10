
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-border/40">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold">SS</span>
              </div>
              <span className="font-bold text-xl">StudentSafe</span>
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              Your trusted platform for finding the perfect insurance coverage for your student internship or attachment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link to="/browse-plans" className="text-gray-600 hover:text-primary transition-colors">Browse Plans</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faqs" className="text-gray-600 hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <address className="not-italic text-sm text-gray-600 space-y-2">
              <p>123 University Avenue</p>
              <p>Nairobi, Kenya</p>
              <p className="pt-2">
                <a href="tel:+254712345678" className="hover:text-primary transition-colors">+254 712 345 678</a>
              </p>
              <p>
                <a href="mailto:info@studentsafe.com" className="hover:text-primary transition-colors">info@studentsafe.com</a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-6 text-sm text-center text-gray-600">
          <p>© {new Date().getFullYear()} StudentSafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
