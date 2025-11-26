import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Checks if user is authenticated before allowing access to protected pages
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // Check if both token and user exist
    if (token && user) {
      try {
        // Parse user to verify it's valid JSON
        JSON.parse(user);
        setIsAuthenticated(true);
      } catch {
        // Invalid user data, clear and redirect
        console.error('Invalid user data in localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the attempted location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
