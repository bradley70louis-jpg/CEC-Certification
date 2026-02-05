// 📄 frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./components/AuthContext";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Certificates from "./pages/Certificates.jsx";
import EICRForm from "./pages/EICRForm.jsx";

/**
 * Simple protected route wrapper:
 * If user is not logged in -> send to /login
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            }
          />

          {/* Certificate form route */}
          <Route
            path="/certificate/:id"
            element={
              <ProtectedRoute>
                <EICRForm />
              </ProtectedRoute>
            }
          />

          {/* Optional safety: if someone hits /certificate without an id */}
          <Route
            path="/certificate"
            element={
              <ProtectedRoute>
                <Navigate to="/certificates" replace />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
