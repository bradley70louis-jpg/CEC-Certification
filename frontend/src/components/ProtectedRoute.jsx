import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ While we’re checking authentication (e.g. page refresh)
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // 🚫 If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If logged in, render the protected page
  return children;
}
