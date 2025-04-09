import { AuthProvider } from "./contexts/AuthContext.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./Pages/Home.jsx";
import PlanComparison from "./Pages/PlanComparison.jsx";
import PlanDetails from "./Pages/PlanDetails.jsx";
import CheckoutPage from "./Pages/CheckoutPage.jsx";
import UserDashboard from "./Pages/UserDashboard.jsx";
import Login from "./Pages/Login.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<PlanComparison />} />
          <Route path="/plans/:id" element={<PlanDetails />} />
          <Route path="/login" element={<Login />} />
         

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/userdashboard" element={<UserDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
