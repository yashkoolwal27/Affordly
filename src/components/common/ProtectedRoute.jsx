// ==========================================
// ProtectedRoute Component
// ==========================================
// Wraps routes that require authentication or admin access.
// Redirects unauthenticated users to /auth and
// non-admin users away from /admin routes.

import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuthStore();

  // Still checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <LoadingSpinner size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // Not logged in — redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Admin-only route but user is not admin
  if (adminOnly && profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
