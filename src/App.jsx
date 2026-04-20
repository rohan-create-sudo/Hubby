import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import RoleSelection from './pages/Auth/RoleSelection';

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
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/role" element={<RoleSelection />} />
          </Route>
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/files" element={<Files />} />
            <Route path="/settings" element={<Profile />} />
            <Route path="/invite" element={<ClientInvite />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
