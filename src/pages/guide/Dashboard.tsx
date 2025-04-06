import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, User, MessageSquare, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const GuideDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.first_name || 'Guide'}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here's an overview of your guide dashboard. You can manage your bookings, update your profile, and communicate with tourists.
        </p>
      </div>

      {/* Profile status */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h2 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">Profile Status</h2>
          </div>
          <Link 
            to="/guide/profile" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="mt-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">Your profile is complete and verified</span>
        </div>
        <div className="mt-4">
          <Link
            to="/guide/profile"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Update profile →
          </Link>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Bookings card */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="ml-4 text-lg font-medium text-gray-900 dark:text-white">My Bookings</h2>
            </div>
            <Link 
              to="/guide/bookings" 
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
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
              to="/guide/bookings"
              className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
            >
              View all bookings →
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
              to="/guide/messages" 
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
              to="/guide/messages"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/guide/bookings"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-3" />
            <span className="text-gray-700 dark:text-gray-200">View Bookings</span>
          </Link>
          <Link
            to="/guide/profile"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <User className="h-5 w-5 text-gray-600 dark:text-gray-300 mr-3" />
            <span className="text-gray-700 dark:text-gray-200">Update Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard; 