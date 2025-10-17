import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'candidate' | 'admin';
  createdAt: Date;
  lastLoginAt: Date;
  isEmailVerified: boolean;
  profileComplete: boolean;
}

class AuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName: string, role: 'candidate' | 'admin' = 'candidate'): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName });

      // Send email verification
      await sendEmailVerification(user);

      // Create user profile in Firestore
      await this.createUserProfile(user, role);

      return userCredential;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      await this.updateLastLogin(userCredential.user.uid);
      
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create one
      const userProfile = await this.getUserProfile(userCredential.user.uid);
      if (!userProfile) {
        await this.createUserProfile(userCredential.user, 'candidate');
      } else {
        await this.updateLastLogin(userCredential.user.uid);
      }
      
      return userCredential;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Update password
  async updateUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No authenticated user found');
      }

      // Re-authenticate user before updating password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  // Send email verification
  async sendVerificationEmail(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  // Create user profile in Firestore
  async createUserProfile(user: User, role: 'candidate' | 'admin'): Promise<void> {
    try {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isEmailVerified: user.emailVerified,
        profileComplete: false
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Update last login time
  private async updateLastLogin(uid: string): Promise<void> {
    try {
      await this.updateUserProfile(uid, { lastLoginAt: new Date() });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Get user role
  async getUserRole(uid: string): Promise<'candidate' | 'admin' | null> {
    try {
      const profile = await this.getUserProfile(uid);
      return profile?.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;