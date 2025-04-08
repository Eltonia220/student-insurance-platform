import React, { useState, useEffect } from "react";
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
import PaymentGateway from "../components/PaymentGateway";
import PolicySummary from "../components/PolicySummary";
import jsPDF from "jspdf";
import "./CheckoutPage.css"; // For progress step styles

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  // Auto-redirect after successful purchase
  useEffect(() => {
    if (showConfirmation) {
      const timer = setTimeout(() => navigate("/"), 10000);
      return () => clearTimeout(timer);
    }
  }, [showConfirmation]);

  const handleStudentInfoChange = (e) => {
    const { name, value } = e.target;
    setStudentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = (paymentData) => {
    if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv) {
      alert("Please complete all payment fields");
      return;
    }
    setPaymentInfo(paymentData);
    setStep(3);
  };

  const handlePurchase = () => {
    // In production: Send to backend API here
    console.log("Purchase completed:", {
      ...studentInfo,
      plan: plan.name,
      paymentInfo: { last4: paymentInfo.cardNumber.slice(-4) }, // Mask sensitive data
    });
    setShowConfirmation(true);
  };

  const downloadConfirmationPDF = () => {
    setIsGeneratingPDF(true);
    const doc = new jsPDF();

    // Styled PDF content
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 128); // Navy blue
    doc.text("Insurance Purchase Confirmation", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.text(`Confirmation #: ${Math.floor(Math.random() * 1000000)}`, 20, 50);

    // Plan details
    doc.setFontSize(14);
    doc.text(`Plan: ${plan.name}`, 20, 70);
    doc.text(`Price: $${plan.price}/month`, 20, 80);

    // Student info
    doc.text("Student Information:", 20, 100);
    doc.text(`Name: ${studentInfo.name}`, 25, 110);
    doc.text(`University: ${studentInfo.university}`, 25, 120);
    doc.text(`Email: ${studentInfo.email}`, 25, 130);

    // Coverage
    doc.text("Coverage Includes:", 20, 150);
    plan.coverage.forEach((item, i) => {
      doc.text(`• ${item}`, 25, 160 + i * 10);
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Thank you for choosing StudentInsure!",
      105,
      280,
      null,
      null,
      "center",
    );

    doc.save(`StudentInsure_${studentInfo.name.replace(" ", "_")}.pdf`);
    setIsGeneratingPDF(false);
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
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Age *</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={studentInfo.age}
                  onChange={handleStudentInfoChange}
                  min="16"
                  max="30"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={studentInfo.email}
                  onChange={handleStudentInfoChange}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setStep(2)}
                  disabled={
                    !studentInfo.name ||
                    !studentInfo.university ||
                    !studentInfo.age ||
                    !studentInfo.email
                  }
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
        />
      )}

      {/* Step 3: Policy Confirmation */}
      {step === 3 && (
        <PolicySummary
          plan={plan}
          studentInfo={studentInfo}
          onConfirm={handlePurchase}
          onBack={() => setStep(2)}
        />
      )}

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={() => navigate("/")} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Purchase Complete!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                fill="#28a745"
              />
            </svg>
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

export default CheckoutPage;
