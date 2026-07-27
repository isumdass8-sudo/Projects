import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="max-w-6xl mx-auto px-5 py-24 text-center">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="text-forest-dark/70 dark:text-parchment/70">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }
  return children;
}
