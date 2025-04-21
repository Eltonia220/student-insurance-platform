
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            <p className="text-gray-600 mb-6">Last Updated: April 9, 2025</p>
            
            <div className="prose prose-blue max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to StudentSafe, a platform that connects students with insurance providers for internship and attachment coverage. By accessing or using our website, mobile application, or any other services provided by StudentSafe (collectively, the "Services"), you agree to be bound by these Terms of Service.
              </p>
              
              <h2>2. Definitions</h2>
              <p>
                "StudentSafe," "we," "us," or "our" refers to StudentSafe Ltd., the company that operates the Services.
                "User," "you," or "your" refers to any individual who accesses or uses our Services.
                "Insurance Provider" refers to any third-party insurance company whose products are available through our platform.
              </p>
              
              <h2>3. Eligibility</h2>
              <p>
                To use our Services, you must be at least 18 years of age or the legal age of majority in your jurisdiction, whichever is higher. If you are under the required age, you may only use our Services with the involvement and consent of a parent or guardian.
              </p>
              
              <h2>4. Account Registration</h2>
              <p>
                To access certain features of our Services, you may need to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              
              <h2>5. Services Description</h2>
              <p>
                StudentSafe provides a platform that allows students to compare and apply for insurance coverage for internships and attachments from various Insurance Providers. We do not provide insurance coverage directly but facilitate connections between Users and Insurance Providers.
              </p>
              <p>
                While we strive to provide accurate information about insurance products, we do not guarantee the accuracy, completeness, or reliability of any information on our platform. You should review the specific terms, conditions, and details of any insurance policy before purchasing.
              </p>
              
              <h2>6. User Responsibilities</h2>
              <p>
                When using our Services, you agree not to:
              </p>
              <ul>
                <li>Provide false or misleading information</li>
                <li>Use our Services for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the integrity or performance of our Services</li>
                <li>Attempt to gain unauthorized access to our Services or related systems</li>
                <li>Harvest or collect information about other users without their consent</li>
              </ul>
              
              <h2>7. Payment Terms</h2>
              <p>
                Insurance premiums are set by the Insurance Providers, not by StudentSafe. When you purchase insurance through our platform, you agree to pay all applicable fees and taxes as specified during the checkout process.
              </p>
              <p>
                Payment processing is handled by secure third-party payment processors. By providing your payment information, you authorize us and our payment processors to charge the amount due to your selected payment method.
              </p>
              
              <h2>8. Refunds and Cancellations</h2>
              <p>
                Refund and cancellation policies are determined by the Insurance Providers. Please review the specific terms of your insurance policy for details about cancellation rights and refund eligibility.
              </p>
              
              <h2>9. Privacy</h2>
              <p>
                Your privacy is important to us. Our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your personal information. By using our Services, you consent to our collection and use of your information as described in our Privacy Policy.
              </p>
              
              <h2>10. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. If we make material changes, we will notify you through our Services or by other means. Your continued use of our Services after such changes constitutes your acceptance of the revised Terms.
              </p>
              
              <h2>11. Termination</h2>
              <p>
                We may terminate or suspend your access to all or part of our Services, with or without notice, for any conduct that we, in our sole discretion, believe violates these Terms or is harmful to other users of our Services, us, or third parties, or for any other reason.
              </p>
              
              <h2>12. Disclaimer of Warranties</h2>
              <p>
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              
              <h2>13. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL STUDENTSAFE, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
              </p>
              
              <h2>14. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p>
                StudentSafe Ltd.<br />
                123 University Avenue<br />
                Nairobi, Kenya<br />
                Email: legal@studentsafe.com
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
