import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Form, Button, Spinner, Alert } from "react-bootstrap";

const PaymentGateway = ({ onSubmit, onBack, isProcessing }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCard = (cardNumber) => {
    // Simple Luhn algorithm validation
    const value = cardNumber.replace(/\D/g, "");
    let sum = 0;
    for (let i = 0; i < value.length; i++) {
      let digit = parseInt(value[i]);
      if ((value.length - i) % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  const validateExpiry = (expiry) => {
    if (!expiry) return false;
    const [month, year] = expiry.split("/");
    if (!month || !year) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    return (
      parseInt(year) > currentYear ||
      (parseInt(year) === currentYear && parseInt(month) >= currentMonth)
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .substring(0, 19);
  };

  const formatExpiry = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .substring(0, 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate fields
    const newErrors = {};
    if (!validateCard(paymentData.cardNumber)) {
      newErrors.cardNumber = "Invalid card number";
    }
    if (!validateExpiry(paymentData.expiry)) {
      newErrors.expiry = "Invalid expiry date";
    }
    if (paymentData.cvv.length < 3) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit({
        cardNumber: paymentData.cardNumber.replace(/\D/g, ""),
        expiry: paymentData.expiry,
        cvv: paymentData.cvv,
      });
    } catch (error) {
      Alert.error("Payment processing failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <Card.Header as="h4" className="bg-light">
        Payment Information
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Card Number *</Form.Label>
            <Form.Control
              type="text"
              name="cardNumber"
              value={formatCardNumber(paymentData.cardNumber)}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              isInvalid={!!errors.cardNumber}
              maxLength={19}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.cardNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>Expiry Date *</Form.Label>
                <Form.Control
                  type="text"
                  name="expiry"
                  value={formatExpiry(paymentData.expiry)}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  isInvalid={!!errors.expiry}
                  maxLength={5}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.expiry}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6 mb-3">
              <Form.Group>
                <Form.Label>CVV *</Form.Label>
                <Form.Control
                  type="password"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleChange}
                  placeholder="•••"
                  isInvalid={!!errors.cvv}
                  maxLength={4}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.cvv}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              label="Save card for future payments"
              name="saveCard"
              checked={paymentData.saveCard}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={onBack}
              disabled={isSubmitting || isProcessing}
            >
              Back
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || isProcessing}
            >
              {isSubmitting || isProcessing ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Process Payment"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

PaymentGateway.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
};

export default PaymentGateway;
