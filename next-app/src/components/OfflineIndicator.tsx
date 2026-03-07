"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/OfflineIndicator.css';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      
      const handleOnline = () => {
        setIsOnline(true);
        setShowIndicator(true);
        setTimeout(() => setShowIndicator(false), 3000);
      };

      const handleOffline = () => {
        setIsOnline(false);
        setShowIndicator(true);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Show indicator if offline on mount
      if (!navigator.onLine) {
        setShowIndicator(true);
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!showIndicator) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="offline-indicator-content">
          <span className="offline-indicator-icon">
            {isOnline ? '✅' : '⚠️'}
          </span>
          <span className="offline-indicator-text">
            {isOnline ? 'Back online' : 'You are offline'}
          </span>
          {isOnline && (
            <button
              className="offline-indicator-close"
              onClick={() => setShowIndicator(false)}
            >
              ✕
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineIndicator;
