import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import RoleSelection from './pages/Auth/RoleSelection';

// Landing
import Landing from './pages/Landing/Landing';

// App Pages
import Dashboard from './pages/Dashboard/Dashboard';
import ProjectList from './pages/Projects/ProjectList';
import ProjectDetail from './pages/Projects/ProjectDetail';
import TaskManager from './pages/Tasks/TaskManager';
import Chat from './pages/Chat/Chat';
import Files from './pages/Files/Files';
import Profile from './pages/Settings/Profile';
import ClientInvite from './pages/Invite/ClientInvite';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Landing */}
          <Route path="/" element={<Landing />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/role" element={<RoleSelection />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/files" element={<Files />} />
            <Route path="/settings" element={<Profile />} />
            <Route path="/invite" element={<ClientInvite />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;