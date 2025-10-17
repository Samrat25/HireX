import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authService, UserProfile } from '@/lib/authService';

interface User {
  id: string;
  email: string;
  role: 'candidate' | 'admin';
  name: string;
  isEmailVerified: boolean;
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string, expectedRole?: 'candidate' | 'admin') => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role?: 'candidate' | 'admin') => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  roleWarning: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleWarning, setRoleWarning] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setError(null);
      
      if (firebaseUser) {
        try {
          // Get user profile from Firestore
          const userProfile = await authService.getUserProfile(firebaseUser.uid);
          
          if (userProfile) {
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: userProfile.role,
              name: firebaseUser.displayName || userProfile.displayName || '',
              isEmailVerified: firebaseUser.emailVerified,
              profileComplete: userProfile.profileComplete
            };
            setUser(user);
          } else {
            // If no profile exists, create a default one
            try {
              await authService.createUserProfile(firebaseUser, 'candidate');
              const user: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                role: 'candidate',
                name: firebaseUser.displayName || '',
                isEmailVerified: firebaseUser.emailVerified,
                profileComplete: false
              };
              setUser(user);
            } catch (createError) {
              console.error('Error creating user profile:', createError);
              // Still set user even if profile creation fails
              const user: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                role: 'candidate',
                name: firebaseUser.displayName || '',
                isEmailVerified: firebaseUser.emailVerified,
                profileComplete: false
              };
              setUser(user);
            }
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setError('Failed to load user profile');
          // Still set basic user info even if Firestore fails
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: 'candidate',
            name: firebaseUser.displayName || '',
            isEmailVerified: firebaseUser.emailVerified,
            profileComplete: false
          };
          setUser(user);
        }
        setFirebaseUser(firebaseUser);
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, expectedRole?: 'candidate' | 'admin') => {
    try {
      setError(null);
      setRoleWarning(null);
      setIsLoading(true);
      
      const userCredential = await authService.signIn(email, password);
      
      // If expectedRole is provided, check if it matches the user's actual role
      if (expectedRole && userCredential.user) {
        const userProfile = await authService.getUserProfile(userCredential.user.uid);
        if (userProfile && userProfile.role !== expectedRole) {
          setRoleWarning(
            `You signed in as ${expectedRole} but your account is registered as ${userProfile.role}. You'll be redirected to the ${userProfile.role} dashboard.`
          );
        }
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string, role: 'candidate' | 'admin' = 'candidate') => {
    try {
      setError(null);
      setIsLoading(true);
      await authService.signUp(email, password, displayName, role);
    } catch (error: any) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await authService.signInWithGoogle();
    } catch (error: any) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.signOut();
    } catch (error: any) {
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (error: any) {
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      await authService.updateUserPassword(currentPassword, newPassword);
    } catch (error: any) {
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setError(null);
      await authService.sendVerificationEmail();
    } catch (error: any) {
      setError(getErrorMessage(error));
      throw error;
    }
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser,
      login, 
      signUp,
      loginWithGoogle,
      logout, 
      resetPassword,
      updatePassword,
      sendVerificationEmail,
      isLoading,
      error,
      roleWarning
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
