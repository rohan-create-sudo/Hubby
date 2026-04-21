import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-spinner">
        <div className="spinner" />
      </div>
    );
  }

  if (currentUser) return <Navigate to="/dashboard" replace />;

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
