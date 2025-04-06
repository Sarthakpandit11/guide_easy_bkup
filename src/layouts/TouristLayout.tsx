import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Calendar, Users, MessageSquare, LogOut, User, Lock } from 'lucide-react';

const TouristLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col h-screen ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/tourist/dashboard" className="text-xl font-bold text-gray-800 dark:text-white">
            Tourist Portal
          </Link>
          <button 
            className="lg:hidden text-gray-500 dark:text-gray-400"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 mt-5 px-2 space-y-1 overflow-y-auto">
          <Link
            to="/tourist/dashboard"
            className={`${
              isActive('/tourist/dashboard')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
          >
            <svg className="mr-4 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          
          <Link
            to="/tourist/bookings"
            className={`${
              isActive('/tourist/bookings')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
          >
            <Calendar className="mr-4 h-6 w-6" />
            My Bookings
          </Link>
          
          <Link
            to="/tourist/guides"
            className={`${
              isActive('/tourist/guides')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
          >
            <Users className="mr-4 h-6 w-6" />
            Available Guides
          </Link>
          
          <Link
            to="/tourist/messages"
            className={`${
              isActive('/tourist/messages')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
          >
            <MessageSquare className="mr-4 h-6 w-6" />
            Messages
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-2 py-2 text-base font-medium rounded-md"
          >
            <LogOut className="mr-4 h-6 w-6" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button 
                  className="lg:hidden text-gray-500 dark:text-gray-400 mr-4"
                  onClick={toggleSidebar}
                >
                  <Menu size={24} />
                </button>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {location.pathname === '/tourist/dashboard' ? 'Dashboard' :
                   location.pathname === '/tourist/bookings' ? 'My Bookings' :
                   location.pathname === '/tourist/guides' ? 'Available Guides' :
                   location.pathname === '/tourist/messages' ? 'Messages' :
                   location.pathname === '/tourist/profile' ? 'Profile' :
                   location.pathname === '/tourist/change-password' ? 'Change Password' :
                   'Tourist Portal'}
                </h1>
              </div>
              
              {/* Profile dropdown */}
              <div className="flex items-center">
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                      <Link
                        to="/tourist/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          View Profile
                        </div>
                      </Link>
                      <Link
                        to="/tourist/change-password"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <div className="flex items-center">
                          <Lock className="mr-2 h-4 w-4" />
                          Change Password
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TouristLayout; 