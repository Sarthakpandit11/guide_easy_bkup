import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  let user = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
  }

  useEffect(() => {
    // Check if user data is valid
    if (user && (!user.id || !user.email || !user.role)) {
      console.error('Invalid user data found');
      localStorage.removeItem('user');
      navigate('/signin');
    }
  }, [user, navigate]);

  // If there's no user, redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace state={{ message: 'Please sign in to access this page' }} />;
  }

  // If we have a user, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 