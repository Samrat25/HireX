import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'candidate' | 'admin';
  requireEmailVerification?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireEmailVerification = false 
}: ProtectedRouteProps) => {
  const { user, firebaseUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!user || !firebaseUser) {
    // Redirect to auth page with return URL
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireEmailVerification && !user.isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'admin' ? '/admin' : '/candidate';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;