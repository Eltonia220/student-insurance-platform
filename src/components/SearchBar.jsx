import React from "react";
const SearchBar = () => (
  <div className="search-section my-5">
    <div
      className="bg-white p-4 rounded-4 shadow-sm"
      style={{ transform: "translateY(-50%)" }}
    >
      <div className="input-group">
        <input
          type="text"
          className="form-control form-control-lg border-0 py-3"
          placeholder="Search by provider, coverage, or price..."
        />
        <button className="btn btn-primary px-4 rounded-end">
          <i className="bi bi-search"></i> Search
        </button>
      </div>
    </div>
  </div>
);

export default SearchBar;
