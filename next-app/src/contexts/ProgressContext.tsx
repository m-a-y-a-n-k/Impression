"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  getProgressHistory, 
  saveProgressEntry as saveToLocal,
  getProgressStats,
  clearProgressHistory as clearLocal
} from '@/utils/progressStorage';
import { syncProgressToCloud, fetchCloudHistory } from '@/utils/firebaseService';

interface ProgressContextType {
  history: any[];
  stats: any;
  loading: boolean;
  saveEntry: (entryData: any) => Promise<any>;
  clearHistory: () => Promise<void>;
  refreshProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const localHistory = getProgressHistory();
      let mergedHistory = [...localHistory];

      if (isAuthenticated && currentUser) {
        const cloudHistory = await fetchCloudHistory(currentUser.uid);
        const seenTimestamps = new Set(localHistory.map(h => h.timestamp));
        cloudHistory.forEach(entry => {
          if (!seenTimestamps.has(entry.timestamp)) {
            mergedHistory.push(entry);
          }
        });
        mergedHistory.sort((a, b) => b.timestamp - a.timestamp);
      }

      setHistory(mergedHistory);
      setStats(getProgressStats()); 
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const saveEntry = async (entryData: any) => {
    const newEntry = saveToLocal(entryData);
    if (!newEntry) return null;

    setHistory(prev => [newEntry, ...prev]);
    
    if (isAuthenticated && currentUser) {
      await syncProgressToCloud(currentUser.uid, newEntry);
    }
    setStats(getProgressStats());
    return newEntry;
  };

  const clearHistory = async () => {
    clearLocal();
    setHistory([]);
    setStats(getProgressStats());
  };

  return (
    <ProgressContext.Provider value={{
      history, stats, loading, saveEntry, clearHistory, refreshProgress: loadProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within a ProgressProvider');
  return context;
};

export default ProgressContext;
