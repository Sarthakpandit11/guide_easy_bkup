import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, error: authError, isLoading, user, getDashboardPath } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('LoginPage - User already logged in, redirecting to dashboard');
      console.log('LoginPage - User role:', user.role);
      const dashboardPath = getDashboardPath(user.role);
      console.log('LoginPage - Redirecting to:', dashboardPath);
      
      // Use React Router's navigate instead of window.location.href
      navigate(dashboardPath, { replace: true });
    }
  }, [user, getDashboardPath, navigate]);

  // Check for redirect message
  useEffect(() => {
    const state = location.state as { message?: string, from?: string };
    if (state?.message) {
      setError(state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    console.log('LoginPage - Login attempt with:', { email });

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      console.log('LoginPage - Calling login function');
      await login(email, password);
      console.log('LoginPage - Login successful, setting success message');
      setSuccessMessage('Login successful! Redirecting...');
      
      // The redirection will be handled by the login function in AuthContext
    } catch (err) {
      console.error('LoginPage - Login error:', err);
      setError(authError || 'An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Sign In</h2>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? (
            <span className="loading">
              <Loader className="animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;