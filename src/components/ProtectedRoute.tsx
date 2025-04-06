import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page with the attempted URL
    return <Navigate to="/login" state={{ from: location.pathname, message: 'Please sign in to access this page' }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 