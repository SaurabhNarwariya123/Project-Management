import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../context/store';

export const ProtectedRoute = ({ children, roles }) => {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !user) {
    return null;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { token } = useAuthStore();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
