import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Tag,
  User,
  LogOut,
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'User Management',
      path: '/admin/users',
      icon: Users,
    },
    {
      title: 'Report Analysis',
      path: '/admin/reports',
      icon: BarChart2,
    },
    {
      title: 'Set Offers',
      path: '/admin/offers',
      icon: Tag,
    },
    {
      title: 'Profile',
      path: '/admin/profile',
      icon: User,
    },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 