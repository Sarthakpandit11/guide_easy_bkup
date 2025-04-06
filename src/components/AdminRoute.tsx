import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, getDashboardPath } = useAuth();
  const location = useLocation();
  const [localUser, setLocalUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read directly from localStorage to ensure we have the latest data
    const storedUser = localStorage.getItem('user');
    console.log('AdminRoute - Raw user from localStorage:', storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('AdminRoute - Parsed user from localStorage:', parsedUser);
        console.log('AdminRoute - User role from localStorage:', parsedUser?.role);
        setLocalUser(parsedUser);
      } catch (error) {
        console.error('AdminRoute - Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('AdminRoute - No user found in localStorage');
    }
    
    setIsLoading(false);
  }, []);

  // Use the localUser state which is directly from localStorage
  const currentUser = localUser || user;
  console.log('AdminRoute - Current user from context:', user);
  console.log('AdminRoute - Current user from localStorage:', localUser);
  console.log('AdminRoute - Final current user:', currentUser);

  useEffect(() => {
    console.log('AdminRoute - Current user:', currentUser);
    console.log('AdminRoute - Current pathname:', location.pathname);
  }, [currentUser, location]);

  // Show loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If there's no user, redirect to login
  if (!currentUser) {
    console.log('AdminRoute - No user found, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location.pathname, message: 'Please sign in to access this page' }} />;
  }

  // Check if user is an admin (case-insensitive)
  const isAdmin = currentUser.role === 'Admin' || currentUser.role?.toLowerCase() === 'admin';
  console.log('AdminRoute - User role:', currentUser.role);
  console.log('AdminRoute - Is admin:', isAdmin);
  
  if (!isAdmin) {
    console.log(`AdminRoute - User with role ${currentUser.role} attempted to access admin dashboard`);
    const dashboardPath = getDashboardPath(currentUser.role);
    console.log(`AdminRoute - Redirecting to ${dashboardPath}`);
    return <Navigate to={dashboardPath} replace />;
  }

  // If we have an admin user, render the child routes
  console.log('AdminRoute - Rendering admin routes');
  return <Outlet />;
};

export default AdminRoute; 