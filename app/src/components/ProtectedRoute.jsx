import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

/**
 * ProtectedRoute Component
 * Wraps components that require authentication
 * Shows login screen if user is not authenticated
 */

export default function ProtectedRoute({ children, fallback }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return fallback || <Login />;
  }

  return <>{children}</>;
}

