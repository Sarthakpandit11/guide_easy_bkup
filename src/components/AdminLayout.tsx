import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { Bell, Sun, Moon, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    // Read directly from localStorage to ensure we have the latest data
    const storedUser = localStorage.getItem('user');
    console.log('AdminLayout - Raw user from localStorage:', storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('AdminLayout - Parsed user from localStorage:', parsedUser);
        console.log('AdminLayout - User role from localStorage:', parsedUser?.role);
        setLocalUser(parsedUser);
      } catch (error) {
        console.error('AdminLayout - Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('AdminLayout - No user found in localStorage');
    }
  }, []);

  // Use the localUser state which is directly from localStorage
  const currentUser = localUser || user;
  console.log('AdminLayout - Current user from context:', user);
  console.log('AdminLayout - Current user from localStorage:', localUser);
  console.log('AdminLayout - Final current user:', currentUser);

  useEffect(() => {
    // Check if user is admin
    console.log('AdminLayout - Current user:', currentUser);
    console.log('AdminLayout - Current pathname:', window.location.pathname);
    
    if (!currentUser) {
      console.log('AdminLayout - No user found, redirecting to landing page');
      navigate('/');
    } else if (currentUser.role !== 'admin') {
      console.log('AdminLayout - User is not admin, redirecting to landing page');
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Get user's display name
  const displayName = currentUser?.full_name || currentUser?.name || 'Admin';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{displayName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 