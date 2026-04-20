import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AuthLayout = () => {
  const { user } = useAppContext();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex justify-center items-center h-full w-full bg-white" style={{ minHeight: '100vh' }}>
      <div className="card p-6" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="text-primary font-bold text-center mb-6" style={{ fontSize: '1.5rem' }}>LANCE</h1>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
