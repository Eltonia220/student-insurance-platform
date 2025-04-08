import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlanListing.css';

const PlanListing = () => {
  // State management
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500,
    coverageType: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/plans');
        setPlans(response.data);
        setFilteredPlans(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching plans:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  // Apply filters and search
  useEffect(() => {
    const results = plans.filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          plan.provider.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = plan.price >= filters.minPrice && 
                         plan.price <= filters.maxPrice;
      
      const matchesCoverage = filters.coverageType === 'all' || 
                            plan.coverage.toLowerCase().includes(filters.coverageType);
      
      return matchesSearch && matchesPrice && matchesCoverage;
    });
    
    setFilteredPlans(results);
  }, [searchTerm, filters, plans]);

  if (isLoading) return <div className="loading">Loading plans...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="plan-listing">
      {/* Search and Filter Section */}
      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="filters">
          <div className="price-filter">
            <label>Price Range:</label>
            <div className="range-slider">
              <input
                type="range"
                min="0"
                max="500"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
              <div className="price-range-display">
                ${filters.minPrice} - ${filters.maxPrice}
              </div>
            </div>
          </div>

          <div className="coverage-filter">
            <label>Coverage Type:</label>
            <select
              value={filters.coverageType}
              onChange={(e) => setFilters({...filters, coverageType: e.target.value})}
            >
              <option value="all">All Coverage</option>
              <option value="emergency">Emergency</option>
              <option value="dental">Dental</option>
              <option value="vision">Vision</option>
              <option value="full">Full Coverage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="plan-grid">
        {filteredPlans.length > 0 ? (
          filteredPlans.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))
        ) : (
          <div className="no-results">
            <p>No plans match your search criteria.</p>
            <button 
              className="reset-filters"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  minPrice: 0,
                  maxPrice: 500,
                  coverageType: 'all'
                });
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Separate PlanCard component for better organization
const PlanCard = ({ plan }) => {
  return (
    <div className="plan-card">
      <div className="plan-image">
        <img 
          src={plan.image || '/default-plan-image.jpg'} 
          alt={plan.name}
          onError={(e) => {
            e.target.src = '/default-plan-image.jpg';
          }}
        />
        <div className="plan-rating">
          <span className="stars">★★★★☆</span>
          <span className="rating-value">4.2</span>
        </div>
      </div>
      <div className="plan-details">
        <h3>{plan.name}</h3>
        <p className="provider">{plan.provider}</p>
        <p className="coverage">{plan.coverage.substring(0, 60)}...</p>
        <div className="plan-footer">
          <span className="price">${plan.price}/mo</span>
          <button className="view-details">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default PlanListing;