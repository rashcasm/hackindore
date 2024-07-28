// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../custom-hooks/user';

const ProtectedRoute = ({ element: Component, role, ...rest }) => {
  const { user } = useContext(UserContext);

  if (!user || user.role !== role) {
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
