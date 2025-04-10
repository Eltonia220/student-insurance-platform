
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Star, ChevronDown, ChevronUp } from 'lucide-react';

// Sample insurance plans data
const insurancePlans = [
  {
    id: "plan1",
    type: "medical",
    provider: "AIG Insurance",
    name: "Medical Attachment Cover",
    price: 4500,
    duration: "3 months",
    description: "Comprehensive medical coverage for students on medical attachments, including liability protection.",
    features: [
      "Medical expenses up to Ksh 500,000",
      "Personal accident cover",
      "Professional indemnity",
      "Emergency evacuation"
    ],
    popular: true
  },
  {
    id: "plan2",
    type: "personal_accident",
    provider: "Jubilee Insurance",
    name: "Personal Accident Shield",
    price: 3200,
    duration: "3 months",
    description: "Protection against accidents that may occur during your internship or attachment period.",
    features: [
      "Accidental death benefit",
      "Permanent disability cover",
      "Medical expenses for injuries",
      "Hospital cash benefit"
    ],
    popular: false
  },
  {
    id: "plan3",
    type: "theft",
    provider: "Britam",
    name: "Student Property Protection",
    price: 2800,
    duration: "3 months",
    description: "Coverage for theft or damage to your personal property and equipment during your attachment.",
    features: [
      "Laptop and electronic devices",
      "Personal belongings",
      "Cash theft protection",
      "Replacement cost coverage"
    ],
    popular: false
  },
  {
    id: "plan4",
    type: "medical",
    provider: "CIC Group",
    name: "Health Intern Cover",
    price: 3900,
    duration: "3 months",
    description: "Specialized coverage for healthcare students during hospital attachments.",
    features: [
      "Needlestick injuries coverage",
      "Infectious disease protection",
      "Medical malpractice",
      "Counseling services"
    ],
    popular: false
  },
  {
    id: "plan5",
    type: "comprehensive",
    provider: "UAP Insurance",
    name: "All-in-One Student Cover",
    price: 5800,
    duration: "3 months",
    description: "Comprehensive protection package that combines medical, accident, and property coverage.",
    features: [
      "Medical coverage up to Ksh 400,000",
      "Personal accident benefits",
      "Property protection up to Ksh 150,000",
      "Third-party liability"
    ],
    popular: true
  },
  {
    id: "plan6",
    type: "personal_accident",
    provider: "Heritage Insurance",
    name: "Engineering Internship Cover",
    price: 3500,
    duration: "3 months",
    description: "Specialized protection for engineering students during industrial attachments.",
    features: [
      "Worksite accident cover",
      "Equipment damage liability",
      "Third-party injury protection",
      "Project failure indemnity"
    ],
    popular: false
  }
];

const BrowsePlans = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const togglePlanDetails = (planId: string) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  const filteredPlans = activeTab === "all" 
    ? insurancePlans 
    : insurancePlans.filter(plan => plan.type === activeTab);

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Browse Insurance Plans</h1>
        <p className="text-gray-600">Find the perfect coverage for your attachment or internship.</p>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="personal_accident">Personal Accident</TabsTrigger>
          <TabsTrigger value="theft">Theft Cover</TabsTrigger>
          <TabsTrigger value="comprehensive">Comprehensive</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className={`card-hover ${plan.popular ? 'border-primary' : ''}`}>
            <CardHeader className="pb-3">
              {plan.popular && (
                <div className="absolute right-4 top-4">
                  <Badge variant="default" className="bg-primary">
                    <Star className="mr-1 h-3 w-3 fill-current" /> Popular
                  </Badge>
                </div>
              )}
              <div className="mb-2 text-sm font-medium text-gray-500">{plan.provider}</div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary">
                  Ksh {plan.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">for {plan.duration}</div>
              </div>
              
              <div className="space-y-2">
                {plan.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                
                {expandedPlan === plan.id && (
                  <div className="animate-fade-in mt-2 space-y-2">
                    {plan.features.slice(2).map((feature, index) => (
                      <div key={index + 2} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center text-sm text-gray-500 hover:text-primary"
                  onClick={() => togglePlanDetails(plan.id)}
                >
                  {expandedPlan === plan.id ? (
                    <>
                      Show less <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/application/${plan.id}`}>Apply Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No plans found</h3>
          <p className="text-gray-600 mt-1">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

export default BrowsePlans;
