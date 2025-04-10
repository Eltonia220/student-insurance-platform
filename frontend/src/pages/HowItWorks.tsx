
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Search, FileText, CheckCircle, Shield } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">How StudentSafe Works</h1>
              <p className="text-xl text-gray-700 mb-8">
                Get the insurance coverage you need for your internship or attachment in just a few simple steps.
              </p>
              <Button asChild size="lg">
                <Link to="/browse-plans">Explore Plans</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Process Steps */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-16">
                {[
                  {
                    step: "Step 1",
                    title: "Compare Plans",
                    description: "Browse our comprehensive selection of insurance plans tailored specifically for students on internships and attachments. Filter by coverage type, duration, and budget to find options that meet your specific needs.",
                    icon: Search,
                    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    imageAlt: "Person comparing insurance plans"
                  },
                  {
                    step: "Step 2",
                    title: "Apply Online",
                    description: "Once you've found the right plan, complete your application online in just a few minutes. Our streamlined process only asks for essential information, and you can upload any required documents directly through our secure platform.",
                    icon: FileText,
                    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    imageAlt: "Person filling out online form"
                  },
                  {
                    step: "Step 3",
                    title: "Get Approved",
                    description: "Most applications are processed within 24 hours. Once approved, you'll receive an email confirmation with your policy details and insurance certificate that you can download or print for your records.",
                    icon: CheckCircle,
                    image: "https://images.unsplash.com/photo-1579389083078-4e435ce89920?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    imageAlt: "Person receiving confirmation"
                  },
                  {
                    step: "Step 4",
                    title: "Enjoy Peace of Mind",
                    description: "Start your internship or attachment with confidence, knowing you're properly covered. If you ever need to make a claim, our dedicated support team is available to guide you through the process every step of the way.",
                    icon: Shield,
                    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    imageAlt: "Student at internship"
                  }
                ].map((step, index) => (
                  <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
                    <div className="w-full md:w-1/2 space-y-4">
                      <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                        {step.step}
                      </div>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    <div className="w-full md:w-1/2">
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <img src={step.image} alt={step.imageAlt} className="w-full h-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Preview */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Have more questions about how StudentSafe works?</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "How long does it take to get coverage?",
                  answer: "Most applications are processed within 24 hours, and you'll receive your insurance certificate immediately after approval."
                },
                {
                  question: "What documents do I need to apply?",
                  answer: "You'll need your student ID, a copy of your attachment/internship letter, and basic personal information."
                },
                {
                  question: "Can I cancel my policy if my internship ends early?",
                  answer: "Yes, most policies can be cancelled with a prorated refund if your internship ends earlier than expected."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
              
              <div className="text-center mt-8">
                <Button asChild variant="outline">
                  <Link to="/faqs">View All FAQs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Compare insurance plans and apply online in minutes.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-blue-50">
              <Link to="/browse-plans">Find a Plan Now</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
