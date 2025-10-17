import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthRedirectOptions {
  preferredRole?: 'candidate' | 'admin';
}

export const useAuthRedirect = (options?: AuthRedirectOptions) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      // Get the intended destination from location state
      const from = (location.state as any)?.from?.pathname;
      
      if (from && from !== '/auth') {
        // Redirect to the originally intended page
        navigate(from, { replace: true });
      } else {
        // Determine redirect path based on user's actual role and preference
        let redirectPath: string;
        
        if (options?.preferredRole && user.role === options.preferredRole) {
          // User's stored role matches their preference
          redirectPath = user.role === 'admin' ? '/admin' : '/candidate';
        } else if (options?.preferredRole && user.role !== options.preferredRole) {
          // User's stored role doesn't match preference - use stored role but show message
          redirectPath = user.role === 'admin' ? '/admin' : '/candidate';
          
          // Could show a toast here about role mismatch if needed
          console.log(`User tried to sign in as ${options.preferredRole} but their account is ${user.role}`);
        } else {
          // No preference specified, use stored role
          redirectPath = user.role === 'admin' ? '/admin' : '/candidate';
        }
        
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, isLoading, navigate, location.state, options?.preferredRole]);
};

export default useAuthRedirect;