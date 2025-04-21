
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Award, Users, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/10 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">About StudentSafe</h1>
              <p className="text-xl text-gray-700 mb-6">
                Simplifying insurance for the next generation of professionals.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  StudentSafe was founded with a simple mission: to make insurance accessible, 
                  affordable, and straightforward for students pursuing internships and attachments.
                </p>
                <p className="text-lg text-gray-600">
                  We understand that navigating insurance requirements can be overwhelming, 
                  especially when you're focused on your professional development. That's why 
                  we've created a platform that simplifies the process, allowing you to compare 
                  options and secure coverage in minutes.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Students collaborating" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-gray-600">
                These principles guide everything we do at StudentSafe.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Protection",
                  description: "We ensure students have access to quality insurance coverage that truly protects them when they need it most."
                },
                {
                  icon: BookOpen,
                  title: "Education",
                  description: "We believe in empowering students with the knowledge to make informed insurance decisions."
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "We support the student community by providing resources tailored to their unique needs."
                },
                {
                  icon: Award,
                  title: "Excellence",
                  description: "We strive for excellence in everything we do, from our platform to our customer service."
                }
              ].map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-600">
                Passionate professionals dedicated to serving the student community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Jane Doe",
                  role: "Founder & CEO",
                  bio: "Former insurance executive with a passion for education and student welfare."
                },
                {
                  name: "John Smith",
                  role: "Head of Partnerships",
                  bio: "Builds relationships with top insurance providers to ensure the best coverage options."
                },
                {
                  name: "Sarah Johnson",
                  role: "Customer Success Lead",
                  bio: "Dedicated to making sure every student has a seamless experience with StudentSafe."
                }
              ].map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center space-y-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-medium">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
