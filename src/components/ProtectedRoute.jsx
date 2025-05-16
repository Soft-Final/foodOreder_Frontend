// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token    = localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');

  // 1) not logged in?
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2) logged in, but role not allowed?
  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  // 3) OK
  return children;
};

export default ProtectedRoute;
