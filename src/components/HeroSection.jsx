import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/images/hero-bg.jpg";
import "./HeroSection.scss"; // Create this file for custom styles

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section position-relative">
      {/* Background Image with Overlay */}
      <div className="hero-background">
        <img
          src={heroImage}
          alt="Happy students on campus"
          className="img-fluid w-100"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Hero Content */}
      <Container className="hero-content position-relative">
        <Row className="align-items-center min-vh-80 py-5">
          {" "}
          {/* 80% viewport height */}
          <Col lg={6} className="text-center text-lg-start">
            <h1 className="display-3 fw-bold text-white mb-4">
              <span className="highlight-text">Smart</span> Insurance for
              Students
            </h1>
            <p className="lead text-white mb-5">
              Compare and enroll in the perfect health plan in under 5 minutes
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/plans")}
                className="px-4 py-3 rounded-pill shadow-sm"
              >
                Compare Plans Now
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                onClick={() => navigate("/how-it-works")}
                className="px-4 py-3 rounded-pill"
              >
                How It Works
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
