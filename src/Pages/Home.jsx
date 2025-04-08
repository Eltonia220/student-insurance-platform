import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import HeroSection from "../components/HeroSection";
import SearchBar from "../components/SearchBar";
import StatsPreview from "../components/StatsPreview";
import PlanHighlights from "../components/PlanHighlights";
import ProcessFlow from "../components/ProcessFlow";
import Testimonials from "../components/Testimonials";
import FinalCTA from "../components/FinalCTA";
import "./Home.scss";

const Home = () => {
  const navigate = useNavigate();

  // Sample data for process steps
  const steps = [
    {
      id: 1,
      number: "1",
      title: "Compare",
      description: "View side-by-side plan comparisons",
    },
    {
      id: 2,
      number: "2",
      title: "Select",
      description: "Choose your perfect coverage",
    },
    {
      id: 3,
      number: "3",
      title: "Enroll",
      description: "Complete your application in minutes",
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section with CTA */}
      <HeroSection onGetStarted={() => navigate("/plans")} />

      {/* Floating Search Bar */}
      <SearchBar
        onSearch={(query) =>
          navigate(`/plans?search=${encodeURIComponent(query)}`)
        }
      />

      {/* Stats Section */}
      <StatsPreview />

      {/* Plan Highlights with View All Button */}
      <section className="plan-highlights section">
        <Container>
          <h2 className="section-title">Popular Student Plans</h2>
          <PlanHighlights />
          <div className="text-center mt-5">
            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => navigate("/plans")}
              className="px-5 btn-plan-link"
            >
              View All Plans →
            </Button>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <ProcessFlow steps={steps} />

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA */}
      <FinalCTA onGetStarted={() => navigate("/plans")} />
    </div>
  );
};

export default Home;
