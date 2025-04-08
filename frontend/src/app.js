// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlanListing from './components/PlanListing/PlanListing';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Student Insurance Plans</h1>
        </header>
        
        <main>
          <Routes>
            {/* Main route for the plan listing */}
            <Route path="/" element={<PlanListing />} />
            
            {/* Additional routes can be added here */}
            <Route path="/plans" element={<PlanListing />} />
            
            {/* 404 route */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <p>© 2023 Student Insurance Aggregator</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;