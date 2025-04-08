import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PlanComparison = () => {
  const navigate = useNavigate();

  // Mock data - replace with your actual data source
  const plans = [
    { id: 1, name: "Basic Plan", price: "$89" },
    { id: 2, name: "Standard Plan", price: "$129" },
  ];

  return (
    <Container className="py-5">
      <h1 className="mb-4">Compare Plans</h1>

      <div className="plan-list">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card p-4 mb-3 border rounded">
            <h3>{plan.name}</h3>
            <p>{plan.price}/month</p>
            <Button
              variant="primary"
              onClick={() => navigate(`/plans/${plan.id}`)}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline-secondary"
        onClick={() => navigate("/")}
        className="mt-4"
      >
        ← Back to Home
      </Button>
    </Container>
  );
};

export default PlanComparison;
