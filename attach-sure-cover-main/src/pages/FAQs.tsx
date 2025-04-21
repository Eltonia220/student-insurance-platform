
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQs = () => {
  const faqCategories = [
    {
      category: "General Questions",
      questions: [
        {
          question: "What is StudentSafe?",
          answer: "StudentSafe is a platform that helps students find and apply for insurance coverage specifically designed for internships and attachments. We partner with leading insurance providers to offer a range of plans that meet the requirements of universities and organizations."
        },
        {
          question: "How does StudentSafe work?",
          answer: "StudentSafe allows you to compare different insurance plans, apply online in minutes, and receive your insurance certificate digitally. You can filter plans based on your specific needs, compare coverage and pricing, and choose the option that works best for you."
        },
        {
          question: "Is StudentSafe available in all countries?",
          answer: "Currently, StudentSafe is available in Kenya and select East African countries. We're continuously expanding our coverage area to serve more students globally."
        }
      ]
    },
    {
      category: "Coverage & Plans",
      questions: [
        {
          question: "What types of insurance do you offer?",
          answer: "We offer various types of insurance including personal accident, medical, professional indemnity, and general liability coverage tailored for students on internships and attachments."
        },
        {
          question: "How long do the insurance plans last?",
          answer: "We offer flexible coverage periods ranging from 1 month to 12 months, depending on the duration of your internship or attachment."
        },
        {
          question: "Can I get coverage for international internships?",
          answer: "Yes, we offer special plans for international internships that provide coverage across multiple countries. These plans may have different pricing and terms compared to local coverage."
        }
      ]
    },
    {
      category: "Application Process",
      questions: [
        {
          question: "What documents do I need to apply?",
          answer: "You'll typically need your student ID, a copy of your internship or attachment letter, and your personal identification details. Some specific plans may require additional documentation."
        },
        {
          question: "How long does the application process take?",
          answer: "The online application takes approximately 5-10 minutes to complete. Most applications are processed within 24 hours, after which you'll receive your insurance certificate."
        },
        {
          question: "Can I apply on behalf of someone else?",
          answer: "While you can help someone complete an application, the policyholder must provide their own personal information and consent to the terms and conditions."
        }
      ]
    },
    {
      category: "Payment & Billing",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept credit/debit cards, mobile money payments (M-Pesa, Airtel Money), and bank transfers for premium payments."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No, we believe in transparent pricing. The price you see is the total amount you'll pay for your coverage period. There are no hidden administration or processing fees."
        },
        {
          question: "Can I pay in installments?",
          answer: "For certain long-term plans, installment options may be available. This varies by insurance provider and plan type, and will be clearly indicated before purchase."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-xl text-gray-700">
                Find answers to common questions about StudentSafe and our insurance offerings.
              </p>
            </div>
          </div>
        </section>
        
        {/* FAQ Categories */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`} className="border bg-white rounded-lg shadow-sm">
                        <AccordionTrigger className="px-6 hover:no-underline">
                          <span className="text-left font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Still Have Questions */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our support team is ready to help you with any other questions you might have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/how-it-works">Learn How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQs;
