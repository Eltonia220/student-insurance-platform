import React from "react";
import "./PlanRecommendation.css";

const PlanRecommendation = ({ plans, filters }) => {
  // Simple recommendation logic
  const recommendedPlan = plans.reduce(
    (acc, plan) =>
      plan.price <= filters.maxPrice && (!acc || plan.rating > acc.rating)
        ? plan
        : acc,
    null,
  );

  return (
    <div className="plan-recommendation">
      <h3>Recommended Plan</h3>
      {recommendedPlan ? (
        <div className="recommended-card">
          <h4>{recommendedPlan.name}</h4>
          <p>${recommendedPlan.price}/month</p>
          <p>Rating: {recommendedPlan.rating} ★</p>
        </div>
      ) : (
        <p>No plans match your filters</p>
      )}
    </div>
  );
};

export default PlanRecommendation;
