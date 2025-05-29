import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always call hooks at the top level
  const { isAuthenticated } = useAuth();

  try {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <>{children}</>;
  } catch (error) {
    console.error('Authentication error:', error);
    // Safely redirect to login if auth fails for any reason
    return <Navigate to="/login" />;
  }
};
