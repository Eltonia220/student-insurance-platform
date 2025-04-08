import React from 'react';
import './PlanListing.css'; // CSS import (make sure filename matches exactly)

const PlanListing = ({ plans }) => {
  return (
    <div className="plan-listing-container">
      <h2 className="plan-listing-title">Available Insurance Plans</h2>
      
      <div className="plans-grid">
        {plans.map(plan => (
          <div key={plan.id} className="plan-card">
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <span className="plan-price">${plan.price}/mo</span>
            </div>
            <div className="plan-details">
              <p><strong>Coverage:</strong> {plan.coverage}</p>
              <p><strong>Provider:</strong> {plan.provider}</p>
            </div>
            <button className="select-plan-btn">Select Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanListing;