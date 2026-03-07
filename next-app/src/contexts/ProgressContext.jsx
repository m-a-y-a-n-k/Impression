import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  getProgressHistory, 
  saveProgressEntry as saveToLocal,
  getProgressStats,
  clearProgressHistory as clearLocal
} from '../utils/progressStorage';
import { syncProgressToCloud, fetchCloudHistory } from '../utils/firebaseService';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial data
  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Load from Local Storage first (immediate)
      const localHistory = getProgressHistory();
      let mergedHistory = [...localHistory];

      // 2. If authenticated, fetch from Cloud and merge
      if (isAuthenticated && currentUser) {
        const cloudHistory = await fetchCloudHistory(currentUser.uid);
        
        // Merge and deduplicate by timestamp
        const seenTimestamps = new Set(localHistory.map(h => h.timestamp));
        cloudHistory.forEach(entry => {
          if (!seenTimestamps.has(entry.timestamp)) {
            mergedHistory.push(entry);
          }
        });

        // Sort by timestamp descending
        mergedHistory.sort((a, b) => b.timestamp - a.timestamp);
      }

      setHistory(mergedHistory);
      // We'll use local stats calculation for now as it's computed from history
      // but in a more advanced version, we might store stats in Firestore too
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

  // Save new entry
  const saveEntry = async (entryData) => {
    // 1. Save to Local Storage
    const newEntry = saveToLocal(entryData);
    if (!newEntry) return null;

    // 2. Clear history state to trigger re-render or update manually
    // Optimization: Update local state immediately
    setHistory(prev => [newEntry, ...prev]);
    
    // 3. If authenticated, sync to Cloud
    if (isAuthenticated && currentUser) {
      await syncProgressToCloud(currentUser.uid, newEntry);
    }

    // Refresh stats
    setStats(getProgressStats());
    
    return newEntry;
  };

  const clearHistory = async () => {
    clearLocal();
    setHistory([]);
    setStats(getProgressStats());
    // Cloud clearing would usually be a separate "Delete Account Data" action
    // but for now we'll just clear locally.
  };

  const value = {
    history,
    stats,
    loading,
    saveEntry,
    clearHistory,
    refreshProgress: loadProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export default ProgressContext;
