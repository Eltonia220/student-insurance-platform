import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

const ProcessFlow = ({ steps }) => (
  <section className="process-flow py-5 my-5">
    <Container>
      <h2 className="text-center mb-5 display-4 fw-bold">How It Works</h2>
      <Row className="g-4">
        {steps.map((step) => (
          <Col lg={4} key={step.id}>
            <div className="card h-100 border-0 p-4 text-center">
              <div
                className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{ width: "70px", height: "70px" }}
              >
                {step.number}
              </div>
              <h3 className="h4 mb-3">{step.title}</h3>
              <p className="text-muted">{step.description}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  </section>
);

ProcessFlow.propTypes = {
  steps: PropTypes.array.isRequired,
};

export default ProcessFlow;
