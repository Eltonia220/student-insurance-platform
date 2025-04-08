import React, { useState } from "react";
import "./PlanListing.css";

// Additional components we'll use
import PlanFilter from "./PlanFilter";
import PlanComparison from "./PlanComparison";
import PlanRecommendation from "./PlanRecommendation";

const PlanListing = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Basic Coverage",
      price: 49.99,
      coverage: "Emergency services, basic diagnostics",
      provider: "HealthGuard",
      rating: 4.2,
      features: ["24/7 support", "Annual checkup", "Generic meds"],
    },
    {
      id: 2,
      name: "Premium Plan",
      price: 119.99,
      coverage: "Full medical + dental + vision",
      provider: "WellCare Plus",
      rating: 4.7,
      features: ["No deductible", "Specialist visits", "Prescription coverage"],
    },
  ]);

  const [selectedPlans, setSelectedPlans] = useState([]);
  const [filters, setFilters] = useState({
    maxPrice: 200,
    coverageType: "all",
  });

  // Add to comparison
  const toggleComparison = (planId) => {
    setSelectedPlans((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId],
    );
  };

  // Filter plans based on user selection
  const filteredPlans = plans.filter(
    (plan) =>
      plan.price <= filters.maxPrice &&
      (filters.coverageType === "all" ||
        plan.coverage.toLowerCase().includes(filters.coverageType)),
  );

  return (
    <div className="plan-listing-container">
      {/* Header Section */}
      <header className="page-header">
        <h1>Student Health Insurance Plans</h1>
        <p>Compare and select the best plan for your needs</p>
      </header>

      {/* Filter Component */}
      <PlanFilter filters={filters} onFilterChange={setFilters} />

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Plans List */}
        <section className="plans-section">
          <h2>Available Plans</h2>
          <div className="plans-grid">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="plan-card">
                <div className="plan-badge">{plan.rating} ★</div>
                <h3>{plan.name}</h3>
                <div className="plan-price">${plan.price}/month</div>
                <div className="plan-coverage">{plan.coverage}</div>
                <div className="plan-provider">By {plan.provider}</div>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => toggleComparison(plan.id)}
                  className={`select-btn ${selectedPlans.includes(plan.id) ? "selected" : ""}`}
                >
                  {selectedPlans.includes(plan.id) ? "Added ✓" : "Compare"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Sidebar */}
        <aside className="comparison-sidebar">
          <PlanComparison
            plans={plans.filter((p) => selectedPlans.includes(p.id))}
            onClear={() => setSelectedPlans([])}
          />

          <PlanRecommendation plans={plans} filters={filters} />
        </aside>
      </div>

      {/* Footer CTA */}
      <footer className="plans-footer">
        <button className="cta-button">Apply for Selected Plans</button>
      </footer>
    </div>
  );
};

export default PlanListing;
