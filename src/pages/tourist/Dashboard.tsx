import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Users, MessageSquare, ArrowRight } from 'lucide-react';

const TouristDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.first_name || 'Tourist'}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here's an overview of your tourist dashboard. You can manage your bookings, find guides, and communicate with them.
        </p>
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Bookings card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h2 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">My Bookings</h2>
            </div>
            <Link 
              to="/tourist/bookings" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Active bookings</p>
          </div>
          <div className="mt-4">
            <Link
              to="/tourist/bookings"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              View all bookings →
            </Link>
          </div>
        </div>

        {/* Available Guides card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">Available Guides</h2>
            </div>
            <Link 
              to="/tourist/guides" 
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Guides available</p>
          </div>
          <div className="mt-4">
            <Link
              to="/tourist/guides"
              className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
            >
              Browse guides →
            </Link>
          </div>
        </div>

        {/* Messages card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">Messages</h2>
            </div>
            <Link 
              to="/tourist/messages" 
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Unread messages</p>
          </div>
          <div className="mt-4">
            <Link
              to="/tourist/messages"
              className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              View all messages →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/tourist/guides"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Users className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-3" />
            <span className="text-gray-700 dark:text-gray-200">Find a Guide</span>
          </Link>
          <Link
            to="/tourist/bookings"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-3" />
            <span className="text-gray-700 dark:text-gray-200">View Bookings</span>
          </Link>
          <Link
            to="/tourist/profile"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-200">Update Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard; 