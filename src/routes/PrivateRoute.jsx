import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.includes(role)) {
    return children;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
