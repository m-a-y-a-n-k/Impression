"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  userProfile: any;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: any) => Promise<void>;
  updatePreferences: (preferences: any) => Promise<void>;
  updateUserStats: (stats: any) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
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
        const existingProfile = userSnap.data();
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp()
        });
        setUserProfile(existingProfile);
      }
    } catch (err: any) {
      console.error('Error initializing user profile:', err);
      setError(err.message);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserProfile(userSnap.data());
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      await initializeUserProfile(result.user);
      return result;
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUserProfile(null);
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateUserProfile = async (updates: any) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { ...updates, updatedAt: serverTimestamp() });
      if (updates.displayName || updates.photoURL) {
        await firebaseUpdateProfile(currentUser, {
          displayName: updates.displayName || currentUser.displayName,
          photoURL: updates.photoURL || currentUser.photoURL
        });
      }
      await fetchUserProfile(currentUser.uid);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updatePreferences = async (preferences: any) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        preferences: { ...userProfile.preferences, ...preferences },
        updatedAt: serverTimestamp()
      });
      await fetchUserProfile(currentUser.uid);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateUserStats = async (stats: any) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        stats: { ...userProfile.stats, ...stats },
        updatedAt: serverTimestamp()
      });
      await fetchUserProfile(currentUser.uid);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) await fetchUserProfile(user.uid);
      else setUserProfile(null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser, userProfile, loading, error, signInWithGoogle, logout,
      updateUserProfile, updatePreferences, updateUserStats, isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
