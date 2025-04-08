import React from "react";
import { Container, Button } from "react-bootstrap";

const PlanComparison = () => {
  return (
    <Container className="py-5">
      <h1 className="display-4 mb-4">Compare Insurance Plans</h1>
      {/* Your plan comparison content here */}
      <Button variant="outline-primary" href="/" className="mt-4">
        ← Back to Home
      </Button>
    </Container>
  );
};

export default PlanComparison;
