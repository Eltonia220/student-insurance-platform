import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  ListGroup,
  Table,
  Badge,
} from "react-bootstrap";
import { plans, providers } from "../data/plans"; // Import the data
import Alert from "react-bootstrap/Alert";

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [planProviders, setPlanProviders] = useState([]); // Renamed to avoid conflict
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the selected plan
    const selectedPlan = plans.find((p) => p.id === id);

    if (selectedPlan) {
      setPlan(selectedPlan);
      // Find providers that offer this plan
      const matchingProviders = providers.filter((provider) =>
        selectedPlan.providers.includes(provider.id),
      );
      setPlanProviders(matchingProviders);
    }

    setLoading(false);
  }, [id]);

  if (loading)
    return <Container className="py-5 text-center">Loading...</Container>;
  if (!plan) return <Container className="py-5">Plan not found</Container>;

  return (
    <Container className="py-5">
      <Button
        variant="outline-primary"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        ← Back to Plans
      </Button>

      <Card className="mb-5 shadow-sm">
        <Card.Body>
          <Card.Title as="h2">{plan.name}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            ${plan.price}/month
          </Card.Subtitle>
          <Card.Text>{plan.description}</Card.Text>

          <h5 className="mt-4">Coverage Includes:</h5>
          <ListGroup variant="flush">
            {plan.coverage.map((item, index) => (
              <ListGroup.Item key={index}>{item}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
      {/* Add the Purchase Button Here */}
      <div className="d-grid mb-4">
        <Button
          variant="success"
          size="lg"
          onClick={() => navigate("/checkout", { state: { plan } })}
        >
          Purchase This Plan
        </Button>
      </div>

      <h3 className="mb-4">Available Providers</h3>

      {planProviders.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Rating</th>
              <th>Price</th>
              <th>Benefits</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {planProviders.map((provider) => (
              <tr key={provider.id}>
                <td>{provider.name}</td>
                <td>
                  <Badge bg="success">{provider.rating} ★</Badge>
                </td>
                <td>${provider.price}/mo</td>
                <td>
                  <ul className="list-unstyled">
                    {provider.benefits.map((benefit, i) => (
                      <li key={i}>
                        <small>✓ {benefit}</small>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => alert(`Contact: ${provider.contact}`)}
                  >
                    Contact
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No providers found for this plan</Alert>
      )}
    </Container>
  );
};

export default PlanDetails;
