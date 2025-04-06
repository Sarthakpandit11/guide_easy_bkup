import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Create a custom event for auth state changes
export const AUTH_STATE_CHANGED = 'authStateChanged';
export const authStateChanged = () => {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{ full_name?: string; profile_picture?: string } | null>(null);
  const { user } = useAuth();

  const checkAuth = useCallback(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setIsAuthenticated(true);
        setUserData(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    } else {
      setIsAuthenticated(false);
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    // Check auth state on mount and when location changes
    checkAuth();

    // Listen for auth state changes
    window.addEventListener(AUTH_STATE_CHANGED, checkAuth);
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED, checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, [checkAuth]);

  // Update auth state when location changes
  useEffect(() => {
    checkAuth();
  }, [location.pathname, checkAuth]);

  const handleLogout = useCallback(() => {
    // Clear authentication state
    localStorage.removeItem('user');
    
    // Update component state
    setIsAuthenticated(false);
    setUserData(null);
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);

    // Notify other components about auth state change
    window.dispatchEvent(new CustomEvent('AUTH_STATE_CHANGED', {
      detail: { isAuthenticated: false, user: null }
    }));

    // Redirect to signin page and replace history
    navigate('/signin', { replace: true });
  }, [navigate]);

  const handleNavigation = useCallback((section: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } });
    } else {
      const element = document.getElementById(section);
      if (element) {
        const navbarHeight = 64;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [location.pathname, navigate]);

  // Handle scroll after navigation
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const section = location.state.scrollTo;
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          const navbarHeight = 64;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location.state]);

  // Function to get the appropriate dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'Guide':
        return '/guide/dashboard';
      case 'Tourist':
        return '/tourist/dashboard';
      default:
        return '/';
    }
  };
  
  // Function to get the appropriate profile path based on user role
  const getProfilePath = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'Admin':
        return '/admin/profile';
      case 'Guide':
        return '/guide/profile';
      case 'Tourist':
        return '/tourist/profile';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <button 
              onClick={() => navigate('/')}
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-xl font-bold text-blue-600">Tourist Booking</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <button
              onClick={() => handleNavigation('home')}
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('about')}
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-blue-600"
            >
              About
            </button>
            <button
              onClick={() => handleNavigation('destinations')}
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-blue-600"
            >
              Popular Destinations
            </button>
            <button
              onClick={() => handleNavigation('guides')}
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-blue-600"
            >
              Guides
            </button>
          </div>

          {/* Auth Buttons / Profile Picture */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="transition-all duration-300 ease-in-out">
              {!isAuthenticated ? (
                <div className="flex items-center space-x-4 opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => navigate(getProfilePath())}
                    className="group relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-200 focus:outline-none transform hover:scale-105"
                    title={userData?.full_name || 'View Profile'}
                  >
                    {userData?.profile_picture ? (
                      <>
                        <img
                          src={userData.profile_picture}
                          alt={userData.full_name || 'Profile'}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all duration-200">
                        <User className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 transition-transform duration-200 ${
                  isMobileMenuOpen ? 'rotate-180' : ''
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`sm:hidden transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-2 opacity-0 pointer-events-none'
        }`}
      >
        <div className="pt-2 pb-3 space-y-1">
          <button
            onClick={() => {
              handleNavigation('home');
              setIsMobileMenuOpen(false);
            }}
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
          >
            Home
          </button>
          <button
            onClick={() => {
              handleNavigation('about');
              setIsMobileMenuOpen(false);
            }}
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
          >
            About
          </button>
          <button
            onClick={() => {
              handleNavigation('destinations');
              setIsMobileMenuOpen(false);
            }}
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
          >
            Popular Destinations
          </button>
          <button
            onClick={() => {
              handleNavigation('guides');
              setIsMobileMenuOpen(false);
            }}
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
          >
            Guides
          </button>
          {!isAuthenticated ? (
            <div className="space-y-1 pt-2 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full pl-3 pr-4 py-2 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="space-y-1 pt-2 border-t border-gray-200">
              <div className="flex items-center px-4 py-2">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {userData?.profile_picture ? (
                      <img
                        src={userData.profile_picture}
                        alt={userData.full_name || 'Profile'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-700">
                    {userData?.full_name || 'User'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate(getDashboardPath());
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate(getProfilePath());
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;