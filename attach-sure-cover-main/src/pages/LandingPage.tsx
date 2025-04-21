
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Clock, Award } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left space-y-6 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Get Covered for Your Attachment
              </h1>
              <p className="text-blue-50 md:text-lg">
                Secure affordable insurance for your internship or attachment in minutes. Compare plans from trusted providers and get the coverage you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-blue-50">
                  <Link to="/browse-plans">Find a Plan</Link>
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Student with laptop" 
                className="rounded-lg shadow-lg max-w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting insurance coverage for your attachment or internship is easy with StudentSafe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center space-y-4 card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg">Compare Plans</h3>
              <p className="text-gray-600">
                Browse and compare insurance plans from multiple providers to find the perfect coverage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center space-y-4 card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg">Apply Online</h3>
              <p className="text-gray-600">
                Complete your application in minutes with our simple and secure online process.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center space-y-4 card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg">Get Covered</h3>
              <p className="text-gray-600">
                Receive your insurance certificate instantly and start your attachment with peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Trusted Insurance Partners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We work with the leading insurance providers to offer you the best coverage options.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['AIG', 'Jubilee', 'Britam', 'CIC Group'].map((partner) => (
              <div key={partner} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <span className="text-xl font-bold text-gray-500">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">What Students Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what other students have to say.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Mwangi",
                school: "University of Nairobi",
                quote: "StudentSafe made finding insurance for my IT attachment so easy! Applied in minutes and had my certificate the same day."
              },
              {
                name: "Lisa Ochieng",
                school: "Kenyatta University",
                quote: "I was worried about getting insurance for my hospital attachment. StudentSafe had the perfect plan for medical students!"
              },
              {
                name: "Brian Kimani",
                school: "Strathmore University",
                quote: "The comparison tool saved me a lot of money! I found an affordable plan that covered everything I needed for my internship."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm space-y-4 card-hover">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.school}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Covered?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Find the perfect insurance plan for your attachment or internship today.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-blue-50">
            <Link to="/browse-plans">Find a Plan Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
