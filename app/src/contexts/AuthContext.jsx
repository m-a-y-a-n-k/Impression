import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

/**
 * Authentication Context
 * Manages user authentication state, Google SSO, and user profile
 */

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user profile in Firestore
  const initializeUserProfile = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user profile
        const newProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          preferences: {
            language: 'en',
            theme: 'system',
            notifications: true
          },
          stats: {
            totalSessions: 0,
            totalPracticeTime: 0,
            lastPracticeDate: null
          }
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      } else {
        // Update last login
        const existingProfile = userSnap.data();
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp()
        });
        setUserProfile(existingProfile);
      }
    } catch (err) {
      console.error('Error initializing user profile:', err);
      setError(err.message);
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserProfile(userSnap.data());
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      await initializeUserProfile(result.user);
      return result;
    } catch (err) {
      console.error('Error signing in with Google:', err);
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUserProfile(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      if (!currentUser) throw new Error('No user logged in');

      const userRef = doc(db, 'users', currentUser.uid);
      
      // Update Firestore
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Update Firebase Auth profile if display name or photo changes
      if (updates.displayName || updates.photoURL) {
        await firebaseUpdateProfile(currentUser, {
          displayName: updates.displayName || currentUser.displayName,
          photoURL: updates.photoURL || currentUser.photoURL
        });
      }

      // Refresh local profile
      await fetchUserProfile(currentUser.uid);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences) => {
    try {
      setError(null);
      if (!currentUser) throw new Error('No user logged in');

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        preferences: {
          ...userProfile.preferences,
          ...preferences
        },
        updatedAt: serverTimestamp()
      });

      // Refresh local profile
      await fetchUserProfile(currentUser.uid);
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update user stats
  const updateUserStats = async (stats) => {
    try {
      if (!currentUser) return;

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        stats: {
          ...userProfile.stats,
          ...stats
        },
        updatedAt: serverTimestamp()
      });

      // Refresh local profile
      await fetchUserProfile(currentUser.uid);
    } catch (err) {
      console.error('Error updating stats:', err);
      setError(err.message);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signInWithGoogle,
    logout,
    updateUserProfile,
    updatePreferences,
    updateUserStats,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;

