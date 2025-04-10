
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';

const ProtectedRoute = () => {
  // This is a simplified authentication check for the prototype
  // In a real app, you would check if the user is authenticated via a context or hook
  const [isAuthenticated] = useState(true);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the landing page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
