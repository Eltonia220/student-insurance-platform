import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./PlanHighlights.scss"; // We'll create this for custom styles

const PlanHighlights = () => {
  const navigate = useNavigate();

  // Sample plan data - replace with your actual data
  const plans = [
    {
      id: 1,
      name: "Basic Coverage",
      price: "89",
      features: ["$500 deductible", "80% coverage", "24/7 telehealth"],
      bestFor: "Budget-conscious students",
    },
    {
      id: 2,
      name: "Standard Plan",
      price: "129",
      features: ["$250 deductible", "90% coverage", "Prescription discount"],
      bestFor: "Most students",
    },
    {
      id: 3,
      name: "Premium Protection",
      price: "189",
      features: ["$100 deductible", "100% coverage", "Global coverage"],
      bestFor: "Comprehensive protection",
    },
  ];

  return (
    <section className="plan-highlights py-5">
      <Container>
        <h2 className="text-center mb-5 section-title">
          Our Most Popular Plans
        </h2>

        <Row className="g-4">
          {plans.map((plan) => (
            <Col key={plan.id} lg={4} md={6}>
              <Card
                className="h-100 plan-card shadow-sm"
                onClick={() => navigate(`/plans?id=${plan.id}`)}
              >
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="plan-badge mb-3">
                    <span className="badge bg-primary">Popular</span>
                  </div>
                  <h3 className="mb-3">{plan.name}</h3>
                  <div className="plan-price mb-4">
                    <span className="display-5 fw-bold">${plan.price}</span>
                    <span className="text-muted">/month</span>
                  </div>

                  <ul className="plan-features mb-4">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <span className="me-2 text-success">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <p className="small text-muted mb-3">
                      Best for: {plan.bestFor}
                    </p>
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/plans?id=${plan.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default PlanHighlights;
