import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeXcqOPfdlT7edLCuL1_4gm-U5BanBywU",
  authDomain: "medified-31a2c.firebaseapp.com",
  projectId: "medified-31a2c",
  storageBucket: "medified-31a2c.firebasestorage.app",
  messagingSenderId: "1014446276148",
  appId: "1:1014446276148:web:9f16609387997967125461",
  measurementId: "G-LYQ3VW0B2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional - only in production)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;