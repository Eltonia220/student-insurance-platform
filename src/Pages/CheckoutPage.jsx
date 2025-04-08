import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Modal,
  Spinner,
} from "react-bootstrap";
import Lottie from "react-lottie";
import PaymentGateway from "../components/PaymentGateway";
import PolicySummary from "../components/PolicySummary";
import jsPDF from "jspdf";
import successAnimation from "../assets/success-animation.json";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    university: "",
    age: "",
    email: "",
    studentId: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateAge = (age) => age >= 16 && age <= 30;
  const validateCard = (card) => /^\d{16}$/.test(card.replace(/\s/g, ""));
  const validateExpiry = (expiry) =>
    /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry);
  const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);

  // Redirect if no plan selected
  useEffect(() => {
    if (!plan) {
      navigate("/plans", { state: { error: "Please select a plan first" } });
    }
  }, [plan, navigate]);

  // Auto-redirect after purchase
  useEffect(() => {
    let timer;
    if (showConfirmation) {
      timer = setTimeout(() => navigate("/"), 10000);
    }
    return () => clearTimeout(timer);
  }, [showConfirmation, navigate]);

  const handleStudentInfoChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (paymentData) => {
    setError(null);

    if (!validateCard(paymentData.cardNumber)) {
      setError("Please enter a valid 16-digit card number");
      return;
    }

    if (!validateExpiry(paymentData.expiry)) {
      setError("Please enter a valid expiry date (MM/YY)");
      return;
    }

    if (!validateCVV(paymentData.cvv)) {
      setError("Please enter a valid 3-4 digit CVV");
      return;
    }

    try {
      setIsProcessing(true);
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPaymentInfo(paymentData);
      setStep(3);
    } catch (err) {
      setError("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchase = async () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate API call with 10% failure rate
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.9 ? reject() : resolve();
        }, 1500);
      });

      console.log("Purchase completed:", {
        ...studentInfo,
        plan: plan.name,
        paymentInfo: { last4: paymentInfo.cardNumber.slice(-4) },
      });
      setShowConfirmation(true);
    } catch (err) {
      setError("Purchase failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setIsSubmitted(false);
    }
  };

  const downloadConfirmationPDF = () => {
    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF();

      // PDF Content
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 128);
      doc.text(
        "Insurance Purchase Confirmation",
        105,
        20,
        null,
        null,
        "center",
      );

      doc.setFontSize(12);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
      doc.text(
        `Confirmation #: ${Math.floor(Math.random() * 1000000)}`,
        20,
        50,
      );

      doc.setFontSize(14);
      doc.text(`Plan: ${plan.name}`, 20, 70);
      doc.text(`Price: $${plan.price}/month`, 20, 80);
      doc.text("Student Information:", 20, 100);
      doc.text(`Name: ${studentInfo.name}`, 25, 110);
      doc.text(`University: ${studentInfo.university}`, 25, 120);
      doc.text(`Email: ${studentInfo.email}`, 25, 130);
      doc.text("Coverage Includes:", 20, 150);

      plan.coverage.forEach((item, i) => {
        doc.text(`• ${item}`, 25, 160 + i * 10);
      });

      doc.setFontSize(10);
      doc.text(
        "Thank you for choosing StudentInsure!",
        105,
        280,
        null,
        null,
        "center",
      );
      doc.save(`StudentInsure_${studentInfo.name.replace(" ", "_")}.pdf`);
    } catch (err) {
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!plan) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h4>No plan selected</h4>
          <p>Please choose a plan before proceeding to checkout.</p>
          <Button onClick={() => navigate("/plans")} variant="primary">
            Back to Plans
          </Button>
        </Alert>
      </Container>
    );
  }

  // Lottie animation config
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Container className="py-5 checkout-page">
      <h2 className="mb-4 text-center">Complete Your Purchase</h2>

      {/* Progress Indicator */}
      <div className="checkout-progress mb-5">
        <div className={`step ${step >= 1 ? "active" : ""}`}>
          <span>1. Student Details</span>
        </div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>
          <span>2. Payment</span>
        </div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>
          <span>3. Confirm</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert
          variant="danger"
          className="mb-4"
          dismissible
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="processing-overlay">
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Processing...</span>
        </div>
      )}

      {/* Step 1: Student Information */}
      {step === 1 && (
        <Card className="p-4 mb-4 shadow-sm">
          <Card.Header as="h4" className="bg-light">
            Student Information
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Full Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={studentInfo.name}
                  onChange={handleStudentInfoChange}
                  required
                  aria-required="true"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>University *</Form.Label>
                <Form.Control
                  type="text"
                  name="university"
                  value={studentInfo.university}
                  onChange={handleStudentInfoChange}
                  required
                  aria-required="true"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Age *</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={studentInfo.age}
                  onChange={handleStudentInfoChange}
                  isInvalid={!!studentInfo.age && !validateAge(studentInfo.age)}
                  min="16"
                  max="30"
                  required
                  aria-required="true"
                />
                <Form.Control.Feedback type="invalid">
                  Must be between 16-30 years
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={studentInfo.email}
                  onChange={handleStudentInfoChange}
                  isInvalid={
                    !!studentInfo.email && !validateEmail(studentInfo.email)
                  }
                  required
                  aria-required="true"
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(-1)}
                  aria-label="Go back to previous page"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setStep(2)}
                  disabled={
                    !studentInfo.name ||
                    !studentInfo.university ||
                    !validateAge(studentInfo.age) ||
                    !validateEmail(studentInfo.email)
                  }
                  aria-label="Continue to payment"
                >
                  Continue to Payment
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <PaymentGateway
          plan={plan}
          onSubmit={handlePaymentSubmit}
          onBack={() => setStep(1)}
          isProcessing={isProcessing}
        />
      )}

      {/* Step 3: Policy Confirmation */}
      {step === 3 && (
        <PolicySummary
          plan={plan}
          studentInfo={studentInfo}
          onConfirm={handlePurchase}
          onBack={() => setStep(2)}
          isProcessing={isProcessing}
        />
      )}

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={() => navigate("/")} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Purchase Complete!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <Lottie
              options={defaultOptions}
              height={120}
              width={120}
              ariaRole="img"
              title="Success animation"
            />
            <h4 className="mt-3">Thank you, {studentInfo.name}!</h4>
          </div>
          <p>
            Your <strong>{plan.name}</strong> coverage is now active.
          </p>
          <p>
            A confirmation has been sent to <strong>{studentInfo.email}</strong>
            .
          </p>
          <Alert variant="info" className="mt-3">
            You'll be redirected to the homepage in 10 seconds...
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
          <Button
            variant="primary"
            onClick={downloadConfirmationPDF}
            disabled={isGeneratingPDF}
            aria-label="Download confirmation as PDF"
          >
            {isGeneratingPDF ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generating PDF...
              </>
            ) : (
              "Download Confirmation (PDF)"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

CheckoutPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      plan: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        price: PropTypes.number,
        coverage: PropTypes.arrayOf(PropTypes.string),
        providers: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  }),
};

CheckoutPage.defaultProps = {
  location: { state: {} },
};

export default CheckoutPage;
