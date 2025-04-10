
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Check, AlertCircle, Upload, Shield, Calendar } from 'lucide-react';

// Sample insurance plans data - in a real app this would come from API or context
const insurancePlans = [
  {
    id: "plan1",
    provider: "AIG Insurance",
    name: "Medical Attachment Cover",
    price: 4500,
    type: "Medical",
  },
  {
    id: "plan2",
    provider: "Jubilee Insurance",
    name: "Personal Accident Shield",
    price: 3200,
    type: "Personal Accident",
  },
  {
    id: "plan3",
    provider: "Britam",
    name: "Student Property Protection",
    price: 2800,
    type: "Theft",
  },
  {
    id: "plan4",
    provider: "CIC Group",
    name: "Health Intern Cover",
    price: 3900,
    type: "Medical",
  },
  {
    id: "plan5",
    provider: "UAP Insurance",
    name: "All-in-One Student Cover",
    price: 5800,
    type: "Comprehensive",
  },
  {
    id: "plan6",
    provider: "Heritage Insurance",
    name: "Engineering Internship Cover",
    price: 3500,
    type: "Personal Accident",
  }
];

const ApplicationForm = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the selected plan based on the URL parameter
  const selectedPlan = insurancePlans.find(plan => plan.id === planId) || {
    id: "",
    provider: "Unknown Provider",
    name: "Unknown Plan",
    price: 0,
    type: "Unknown"
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    school: "",
    department: "",
    startDate: "",
    duration: "3",
    attachmentLetterUploaded: false,
    paymentMethod: "mpesa"
  });

  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = () => {
    // In a real app, this would handle actual file upload
    setFormData(prev => ({ ...prev, attachmentLetterUploaded: true }));
    
    toast({
      title: "File uploaded successfully",
      description: "Your attachment letter has been uploaded.",
      variant: "default",
    });
  };

  const moveToNextStep = () => {
    setFormStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/success');
    }, 1500);
  };

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Apply for Insurance</h1>
        <p className="text-gray-600">Complete your application for {selectedPlan.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Application Form */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${formStep === 1 ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                    1
                  </div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${formStep === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                    2
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Step {formStep} of 2
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {formStep === 1 ? (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          value={formData.fullName} 
                          onChange={handleInputChange} 
                          placeholder="Enter your full name" 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          placeholder="Enter your email" 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          placeholder="Enter your phone number" 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="school">School/University</Label>
                        <Input 
                          id="school" 
                          name="school" 
                          value={formData.school} 
                          onChange={handleInputChange} 
                          placeholder="Enter your school or university" 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department/Faculty</Label>
                        <Input 
                          id="department" 
                          name="department" 
                          value={formData.department} 
                          onChange={handleInputChange} 
                          placeholder="e.g., Computer Science, Engineering" 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Attachment Start Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input 
                            id="startDate" 
                            name="startDate" 
                            type="date" 
                            className="pl-9" 
                            value={formData.startDate} 
                            onChange={handleInputChange} 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Attachment Duration</Label>
                      <Select
                        name="duration"
                        value={formData.duration}
                        onValueChange={(value) => handleSelectChange('duration', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Attachment Letter</Label>
                      <div className="border-2 border-dashed rounded-md border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                        {formData.attachmentLetterUploaded ? (
                          <div className="flex flex-col items-center text-green-600">
                            <Check className="h-8 w-8 mb-2" />
                            <p className="font-medium">File uploaded successfully</p>
                            <p className="text-sm text-gray-500 mt-1">attachment_letter.pdf</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-500">
                              Upload your attachment letter (PDF, JPG or PNG)
                            </p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="mt-3" 
                              onClick={handleFileUpload}
                            >
                              Select File
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="button" 
                        className="w-full"
                        onClick={moveToNextStep}
                        disabled={
                          !formData.fullName || 
                          !formData.email || 
                          !formData.phone || 
                          !formData.school || 
                          !formData.department || 
                          !formData.startDate || 
                          !formData.attachmentLetterUploaded
                        }
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Payment Details</h2>
                    
                    <Alert className="bg-blue-50 text-blue-800 border-blue-100">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Coverage Period</AlertTitle>
                      <AlertDescription>
                        Your insurance will cover {formData.duration} months starting from {formData.startDate}.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <RadioGroup
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mpesa" id="mpesa" />
                          <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                            M-PESA
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer">
                            Debit/Credit Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bank" id="bank" />
                          <Label htmlFor="bank" className="flex-1 cursor-pointer">
                            Bank Transfer
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="pt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setFormStep(1)}
                      >
                        Back to Details
                      </Button>
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full sm:w-auto"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Plan Summary */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Plan Summary</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">{selectedPlan.name}</h3>
                    </div>
                    <span className="text-sm bg-primary/10 text-primary rounded-full px-2 py-0.5">
                      {selectedPlan.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{selectedPlan.provider}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Plan Cost</span>
                    <span className="font-medium">Ksh {selectedPlan.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{formData.duration} months</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">
                      Ksh {(selectedPlan.price * parseInt(formData.duration) / 3).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md text-sm">
                  <p>Your coverage will begin immediately after your application is approved.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
