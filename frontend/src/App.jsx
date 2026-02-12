import React, { useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './context/store';
import { authAPI } from './services/apiService';
import { initiateSocket, disconnectSocket } from './services/socketService';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { Dashboard } from './pages/Dashboard';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { AdminPanel } from './pages/AdminPanel';
import './styles/index.css';

function App() {
  const { setUser, token, setToken } = useAuthStore();

  const checkAuth = useCallback(async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      setToken(null);
      setUser(null);
    }
  }, [setToken, setUser]);

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [checkAuth, token]);

  useEffect(() => {
    if (token) {
      initiateSocket(token);
    }
    return () => {
      if (!token) {
        disconnectSocket();
      }
    };
  }, [token]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task/:taskId"
          element={
            <ProtectedRoute>
              <TaskDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
