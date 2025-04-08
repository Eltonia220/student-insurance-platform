import React from "react";
import { Container, Button } from "react-bootstrap";

const FinalCTA = () => (
  <Container className="final-cta py-5 my-5 bg-light rounded-3">
    <h2 className="display-5 fw-bold mb-4">Ready to Get Covered?</h2>
    <p className="fs-5 mb-4">Compare plans in under 5 minutes</p>
    <Button variant="primary" size="lg" className="px-5">
      Start Comparing
    </Button>
  </Container>
);

export default FinalCTA;
