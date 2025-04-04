import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, User, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Booked Tours', path: '/dashboard/booked-tours', icon: Calendar },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('user');
    
    // Dispatch auth state changed event
    window.dispatchEvent(new CustomEvent('AUTH_STATE_CHANGED', {
      detail: { isAuthenticated: false, user: null }
    }));
    
    // Redirect to signin page
    navigate('/signin', { replace: true });
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Tourist Booking</h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${
                  isActive(item.path) ? 'text-blue-600' : 'text-gray-400'
                }`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-400" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 