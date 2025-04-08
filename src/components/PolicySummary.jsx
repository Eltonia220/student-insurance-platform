import React from "react";
import PropTypes from "prop-types";
import { Card, Button, ListGroup, Spinner, Alert } from "react-bootstrap";

const PolicySummary = ({
  plan,
  studentInfo,
  onConfirm,
  onBack,
  isProcessing,
}) => {
  return (
    <Card className="p-4 shadow-sm">
      <Card.Header as="h4" className="bg-light">
        Review Your Policy
      </Card.Header>
      <Card.Body>
        <h5 className="mb-3">Plan Details</h5>
        <div className="mb-4">
          <p>
            <strong>Plan Name:</strong> {plan.name}
          </p>
          <p>
            <strong>Monthly Price:</strong> ${plan.price.toFixed(2)}
          </p>
          <p>
            <strong>Coverage Includes:</strong>
          </p>
          <ListGroup variant="flush">
            {plan.coverage.map((item, index) => (
              <ListGroup.Item key={index}>{item}</ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <h5 className="mb-3">Student Information</h5>
        <div className="mb-4">
          <p>
            <strong>Name:</strong> {studentInfo.name}
          </p>
          <p>
            <strong>University:</strong> {studentInfo.university}
          </p>
          <p>
            <strong>Email:</strong> {studentInfo.email}
          </p>
          <p>
            <strong>Age:</strong> {studentInfo.age}
          </p>
        </div>

        <Alert variant="warning" className="mb-4">
          By confirming this purchase, you agree to our Terms of Service and
          authorize the payment method provided. This plan will automatically
          renew each month until canceled.
        </Alert>

        <div className="d-flex justify-content-between">
          <Button
            variant="outline-secondary"
            onClick={onBack}
            disabled={isProcessing}
          >
            Back
          </Button>
          <Button variant="success" onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Confirm Purchase"
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

PolicySummary.propTypes = {
  plan: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    coverage: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  studentInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    university: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool,
};

export default PolicySummary;
