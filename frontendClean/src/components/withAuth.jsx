import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Higher-order component that checks if the user is authenticated.
 * If no token is available in Redux state, it redirects to /login.
 *
 * Usage:
 *   const ProtectedPage = withAuth(MyComponent);
 */
const withAuth = (WrappedComponent) => {
  const Component = WrappedComponent;
  return (props) => {
    const token = useSelector((state) => state.auth.token);
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return <Component {...props} />;
  };
};

export default withAuth;
