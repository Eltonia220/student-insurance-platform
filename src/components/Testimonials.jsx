import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Testimonials = () => (
  <section className="testimonials py-5 my-5 bg-light">
    <Container>
      <h2 className="text-center mb-5 display-4 fw-bold">What Students Say</h2>
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="card border-0 shadow-sm p-5">
            {/* Testimonial content */}
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);

export default Testimonials;
