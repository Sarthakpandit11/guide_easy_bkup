import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import TouristSidebar from './TouristSidebar';
import { useAuth } from '../context/AuthContext';

const TouristLayout: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not logged in or not a tourist, redirect to landing page
  if (!user || user.role !== 'tourist') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <TouristSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TouristLayout; 