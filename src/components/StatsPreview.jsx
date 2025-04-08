import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const StatsPreview = () => {
  const stats = [
    { value: "10,000+", label: "Students Covered" },
    { value: "98%", label: "Claim Approval" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <section className="stats-section py-5 my-5">
      <Container>
        <Row className="g-4">
          {stats.map((stat, index) => (
            <Col md={4} key={index}>
              <div className="text-center p-4">
                <h3 className="display-5 fw-bold text-primary">{stat.value}</h3>
                <p className="fs-5 text-muted">{stat.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default StatsPreview;
