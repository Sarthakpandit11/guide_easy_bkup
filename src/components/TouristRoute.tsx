import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TouristRoute = () => {
  const { user, getDashboardPath } = useAuth();
  const location = useLocation();
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    // Read directly from localStorage to ensure we have the latest data
    const storedUser = localStorage.getItem('user');
    console.log('TouristRoute - Raw user from localStorage:', storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('TouristRoute - Parsed user from localStorage:', parsedUser);
        console.log('TouristRoute - User role from localStorage:', parsedUser?.role);
        setLocalUser(parsedUser);
      } catch (error) {
        console.error('TouristRoute - Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('TouristRoute - No user found in localStorage');
    }
  }, []);

  // Use the localUser state which is directly from localStorage
  const currentUser = localUser || user;
  console.log('TouristRoute - Current user from context:', user);
  console.log('TouristRoute - Current user from localStorage:', localUser);
  console.log('TouristRoute - Final current user:', currentUser);

  useEffect(() => {
    console.log('TouristRoute - Current user:', currentUser);
    console.log('TouristRoute - Current pathname:', location.pathname);
  }, [currentUser, location]);

  // If there's no user, redirect to login
  if (!currentUser) {
    console.log('TouristRoute - No user found, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Please sign in to access this page' }} />;
  }

  // If user is not a tourist, redirect to their role-specific dashboard
  if (currentUser.role !== 'Tourist') {
    console.log(`TouristRoute - User with role ${currentUser.role} attempted to access tourist dashboard`);
    const dashboardPath = getDashboardPath(currentUser.role);
    console.log(`TouristRoute - Redirecting to ${dashboardPath}`);
    return <Navigate to={dashboardPath} replace state={{ message: 'You do not have permission to access this page' }} />;
  }

  // If we have a tourist user, render the child routes
  console.log('TouristRoute - Rendering tourist routes');
  return <Outlet />;
};

export default TouristRoute; 