import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Replace this with your actual API call
      const response = await createUserAccount(formData);
      
      // Show success message
      toast({
        title: "Account created!",
        description: "Your StudentSafe account has been created successfully.",
      });
      
      // Store user authentication token/data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify({
        id: response.userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      }));
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Sign up error:', error);
      
      // Fixed error handling
      const errorMessage = error && typeof error === 'object' && error.message 
        ? error.message 
        : "Something went wrong. Please try again.";
        
      toast({
        title: "Account creation failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock API function - replace with actual implementation
  const createUserAccount = async (userData) => {
    // This is a placeholder - replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful API response
        resolve({
          success: true,
          token: 'sample-auth-token-' + Math.random().toString(36).substring(2),
          userId: 'user-' + Math.random().toString(36).substring(2)
        });
        
        // Uncomment to simulate an error
        // reject(new Error('Email already in use'));
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <Card className="w-full max-w-sm md:max-w-md mx-4">
          <CardHeader className="space-y-1 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Enter your details to create your StudentSafe account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="firstName" className="text-sm">First name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={handleChange}
                    required 
                    className="text-sm" 
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="lastName" className="text-sm">Last name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={handleChange}
                    required 
                    className="text-sm" 
                  />
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="student@university.edu" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  className="text-sm" 
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                  className="text-sm" 
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm">Confirm password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                  className="text-sm" 
                />
              </div>
              <div className="flex items-start sm:items-center space-x-2">
                <Checkbox id="terms" required className="mt-1 sm:mt-0" />
                <Label htmlFor="terms" className="text-xs sm:text-sm font-medium leading-tight sm:leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    privacy policy
                  </Link>
                </Label>
              </div>
              <Button 
                type="submit" 
                className="w-full text-sm sm:text-base" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Sign up'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" className="text-xs sm:text-sm" type="button">Google</Button>
              <Button variant="outline" className="text-xs sm:text-sm" type="button">Microsoft</Button>
            </div>
            <p className="text-center text-xs sm:text-sm">
              Already have an account?{" "}
              <Link to="/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;