"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from './Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * Wraps components that require authentication
 * Shows login screen if user is not authenticated
 */
export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading Impression...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (fallback as React.ReactElement) || <Login />;
  }

  return <>{children}</>;
}
