
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import BrowsePlans from "./pages/BrowsePlans";
import ApplicationForm from "./pages/ApplicationForm";
import SuccessPage from "./pages/SuccessPage";
import NotFound from "./pages/NotFound";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import FAQs from "./pages/FAQs";
import ContactUs from "./pages/ContactUs";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/browse-plans" element={<BrowsePlans />} />
                <Route path="/application/:planId" element={<ApplicationForm />} />
                <Route path="/success" element={<SuccessPage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
