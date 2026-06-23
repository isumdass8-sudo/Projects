import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps a page so only logged-in users can see it.
// If not logged in → redirect to /login
// If logged in but wrong role → redirect to their dashboard
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the correct dashboard for their role
    if (user.role === 'member') return <Navigate to="/member/dashboard" replace />;
    return <Navigate to="/librarian/dashboard" replace />;
  }

  return children;
}
