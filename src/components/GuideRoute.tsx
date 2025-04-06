import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuideRoute = () => {
  const { user, getDashboardPath } = useAuth();
  const location = useLocation();
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    // Read directly from localStorage to ensure we have the latest data
    const storedUser = localStorage.getItem('user');
    console.log('GuideRoute - Raw user from localStorage:', storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('GuideRoute - Parsed user from localStorage:', parsedUser);
        console.log('GuideRoute - User role from localStorage:', parsedUser?.role);
        setLocalUser(parsedUser);
      } catch (error) {
        console.error('GuideRoute - Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('GuideRoute - No user found in localStorage');
    }
  }, []);

  // Use the localUser state which is directly from localStorage
  const currentUser = localUser || user;
  console.log('GuideRoute - Current user from context:', user);
  console.log('GuideRoute - Current user from localStorage:', localUser);
  console.log('GuideRoute - Final current user:', currentUser);

  useEffect(() => {
    console.log('GuideRoute - Current user:', currentUser);
    console.log('GuideRoute - Current pathname:', location.pathname);
  }, [currentUser, location]);

  // If there's no user, redirect to login
  if (!currentUser) {
    console.log('GuideRoute - No user found, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Please sign in to access this page' }} />;
  }

  // If user is not a guide, redirect to their role-specific dashboard
  if (currentUser.role !== 'Guide') {
    console.log(`GuideRoute - User with role ${currentUser.role} attempted to access guide dashboard`);
    const dashboardPath = getDashboardPath(currentUser.role);
    console.log(`GuideRoute - Redirecting to ${dashboardPath}`);
    return <Navigate to={dashboardPath} replace state={{ message: 'You do not have permission to access this page' }} />;
  }

  // If we have a guide user, render the child routes
  console.log('GuideRoute - Rendering guide routes');
  return <Outlet />;
};

export default GuideRoute; 