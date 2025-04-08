import React from "react";
import "./PlanFilter.css";

const PlanFilter = ({ filters, onFilterChange }) => {
  return (
    <div className="plan-filter">
      <h3>Filter Plans</h3>
      <div className="filter-group">
        <label>Max Price: ${filters.maxPrice}</label>
        <input
          type="range"
          min="0"
          max="500"
          value={filters.maxPrice}
          onChange={(e) =>
            onFilterChange({ ...filters, maxPrice: e.target.value })
          }
        />
      </div>
      <div className="filter-group">
        <label>Coverage Type:</label>
        <select
          value={filters.coverageType}
          onChange={(e) =>
            onFilterChange({ ...filters, coverageType: e.target.value })
          }
        >
          <option value="all">All Coverage</option>
          <option value="emergency">Emergency</option>
          <option value="dental">Dental</option>
          <option value="vision">Vision</option>
        </select>
      </div>
    </div>
  );
};

export default PlanFilter;
