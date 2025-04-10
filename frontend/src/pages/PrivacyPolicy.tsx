
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-gray-600 mb-6">Last Updated: April 9, 2025</p>
            
            <div className="prose prose-blue max-w-none">
              <h2>1. Introduction</h2>
              <p>
                At StudentSafe, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, or any other services provided by StudentSafe (collectively, the "Services").
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access or use our Services.
              </p>
              
              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Data</h3>
              <p>
                We may collect personal data that you provide directly to us, including but not limited to:
              </p>
              <ul>
                <li>Contact information (name, email address, phone number, postal address)</li>
                <li>Student information (university/college, student ID, field of study)</li>
                <li>Identification information (national ID number, passport number)</li>
                <li>Internship or attachment details (company, position, duration)</li>
                <li>Payment information (credit card details, mobile money information)</li>
                <li>Documents you upload (attachment letters, student IDs, etc.)</li>
                <li>Health information (for medical insurance applications)</li>
              </ul>
              
              <h3>2.2 Usage Data</h3>
              <p>
                We may also collect information on how you access and use our Services, including:
              </p>
              <ul>
                <li>Log data (IP address, browser type, pages visited, time spent)</li>
                <li>Device information (device type, operating system, unique device identifiers)</li>
                <li>Location data (if permitted by your device settings)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
              
              <h2>3. How We Use Your Information</h2>
              <p>
                We may use the information we collect for various purposes, including to:
              </p>
              <ul>
                <li>Create and manage your account</li>
                <li>Process insurance applications and payments</li>
                <li>Communicate with you about your account or transactions</li>
                <li>Provide customer support</li>
                <li>Send you marketing and promotional communications (with your consent)</li>
                <li>Improve and optimize our Services</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Comply with legal obligations</li>
              </ul>
              
              <h2>4. Disclosure of Your Information</h2>
              <p>
                We may share your personal data with:
              </p>
              <ul>
                <li>Insurance providers to process your applications and claims</li>
                <li>Service providers who perform services on our behalf</li>
                <li>Professional advisers including lawyers, auditors, and insurers</li>
                <li>Government bodies and regulatory authorities as required by law</li>
                <li>Third parties in connection with a business transaction such as a merger or acquisition</li>
              </ul>
              
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              
              <h2>6. Data Retention</h2>
              <p>
                We will retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, regulatory, accounting, or reporting requirements.
              </p>
              
              <h2>7. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal data, including:
              </p>
              <ul>
                <li>The right to access your personal data</li>
                <li>The right to correct inaccurate personal data</li>
                <li>The right to request deletion of your personal data</li>
                <li>The right to restrict or object to processing of your personal data</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent at any time (where processing is based on consent)</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided below.
              </p>
              
              <h2>8. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our Services and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services.
              </p>
              
              <h2>9. Children's Privacy</h2>
              <p>
                Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal data from children. If we become aware that we have collected personal data from children without verification of parental consent, we will take steps to remove that information from our servers.
              </p>
              
              <h2>10. Changes to this Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2>11. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p>
                StudentSafe Ltd.<br />
                123 University Avenue<br />
                Nairobi, Kenya<br />
                Email: privacy@studentsafe.com
              </p>
              
              <h2>12. Links to Other Websites</h2>
              <p>
                Our Services may contain links to other websites not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
              </p>
            </div>
            
            <div className="mt-10 p-6 bg-primary/10 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Need Help?</h3>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
              </p>
              <Link to="/contact" className="inline-flex items-center text-primary hover:underline font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
