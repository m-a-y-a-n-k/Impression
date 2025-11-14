/**
 * Session Tracking Utility
 * Tracks free session usage and manages subscription limits
 */

const SESSION_STORAGE_KEY = 'impression-sessions';
const FREE_SESSION_LIMIT = 10;

/**
 * Get current session count
 */
export const getSessionCount = () => {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return 0;
    
    const parsed = JSON.parse(data);
    return parsed.count || 0;
  } catch (err) {
    console.error('Error getting session count:', err);
    return 0;
  }
};

/**
 * Get session data including history
 */
export const getSessionData = () => {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) {
      return {
        count: 0,
        sessions: [],
        firstSessionDate: null
      };
    }
    
    return JSON.parse(data);
  } catch (err) {
    console.error('Error getting session data:', err);
    return {
      count: 0,
      sessions: [],
      firstSessionDate: null
    };
  }
};

/**
 * Increment session count
 */
export const incrementSessionCount = () => {
  try {
    const data = getSessionData();
    const now = new Date().toISOString();
    
    const newData = {
      count: data.count + 1,
      sessions: [...data.sessions, { timestamp: now }],
      firstSessionDate: data.firstSessionDate || now,
      lastSessionDate: now
    };
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newData));
    return newData.count;
  } catch (err) {
    console.error('Error incrementing session count:', err);
    return 0;
  }
};

/**
 * Check if user has reached free session limit
 */
export const hasReachedLimit = () => {
  const count = getSessionCount();
  return count >= FREE_SESSION_LIMIT;
};

/**
 * Get remaining free sessions
 */
export const getRemainingFreeSessions = () => {
  const count = getSessionCount();
  return Math.max(0, FREE_SESSION_LIMIT - count);
};

/**
 * Reset session count (admin/testing only)
 */
export const resetSessionCount = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Error resetting session count:', err);
    return false;
  }
};

/**
 * Check if user should see upgrade prompt
 * Show after 7 sessions (3 remaining)
 */
export const shouldShowUpgradePrompt = () => {
  const count = getSessionCount();
  return count >= 7 && count < FREE_SESSION_LIMIT;
};

/**
 * Get session limit info for display
 */
export const getSessionLimitInfo = () => {
  const count = getSessionCount();
  const remaining = getRemainingFreeSessions();
  const hasReached = hasReachedLimit();
  
  return {
    used: count,
    remaining,
    total: FREE_SESSION_LIMIT,
    hasReachedLimit: hasReached,
    showUpgradePrompt: shouldShowUpgradePrompt(),
    percentage: Math.min(100, Math.round((count / FREE_SESSION_LIMIT) * 100))
  };
};

const sessionTrackingService = {
  getSessionCount,
  getSessionData,
  incrementSessionCount,
  hasReachedLimit,
  getRemainingFreeSessions,
  resetSessionCount,
  shouldShowUpgradePrompt,
  getSessionLimitInfo,
  FREE_SESSION_LIMIT
};

export default sessionTrackingService;

