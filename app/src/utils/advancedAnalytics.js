/**
 * Advanced Analytics for Progress Dashboard
 * Provides detailed insights, trends, and comparisons
 */

import { getProgressHistory } from './progressStorage';

/**
 * Get practice sessions grouped by time period
 * @param {string} period - 'day', 'week', 'month'
 * @returns {Array} Time-series data
 */
export const getTimeSeriesData = (period = 'day') => {
  const history = getProgressHistory();
  if (history.length === 0) return [];

  const now = Date.now();
  const groupedData = {};

  // Determine time range based on period
  const timeRanges = {
    day: 30 * 24 * 60 * 60 * 1000, // Last 30 days
    week: 12 * 7 * 24 * 60 * 60 * 1000, // Last 12 weeks
    month: 12 * 30 * 24 * 60 * 60 * 1000, // Last 12 months
  };

  const cutoffTime = now - (timeRanges[period] || timeRanges.day);
  const recentHistory = history.filter((entry) => entry.timestamp >= cutoffTime);

  // Group entries by period
  recentHistory.forEach((entry) => {
    const date = new Date(entry.timestamp);
    let key;

    switch (period) {
      case 'day':
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        break;
      case 'week':
        const weekNum = getWeekNumber(date);
        key = `Week ${weekNum}`;
        break;
      case 'month':
        key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        break;
      default:
        key = date.toLocaleDateString();
    }

    if (!groupedData[key]) {
      groupedData[key] = {
        period: key,
        count: 0,
        scores: [],
        wordCounts: [],
        durations: [],
        sentiments: { positive: 0, negative: 0, neutral: 0, mixed: 0 },
      };
    }

    groupedData[key].count++;
    if (entry.score > 0) groupedData[key].scores.push(entry.score);
    if (entry.transcript) {
      const wordCount = entry.transcript.split(/\s+/).filter(w => w.length > 0).length;
      groupedData[key].wordCounts.push(wordCount);
    }
    groupedData[key].sentiments[entry.sentiment || 'neutral']++;
  });

  // Calculate averages and format data
  return Object.values(groupedData).map((group) => ({
    period: group.period,
    practices: group.count,
    avgScore: group.scores.length > 0
      ? Math.round(group.scores.reduce((a, b) => a + b, 0) / group.scores.length)
      : 0,
    avgWords: group.wordCounts.length > 0
      ? Math.round(group.wordCounts.reduce((a, b) => a + b, 0) / group.wordCounts.length)
      : 0,
    positiveCount: group.sentiments.positive,
    negativeCount: group.sentiments.negative,
    neutralCount: group.sentiments.neutral,
    mixedCount: group.sentiments.mixed,
  }));
};

/**
 * Get week number of the year
 */
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

/**
 * Get practice calendar heatmap data (last 12 weeks)
 * @returns {Array} Calendar data with practice counts
 */
export const getCalendarHeatmapData = () => {
  const history = getProgressHistory();
  const now = new Date();
  const weeks = [];
  const dayData = {};

  // Get last 12 weeks
  for (let i = 83; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    dayData[key] = {
      date: key,
      count: 0,
      avgScore: 0,
      scores: [],
      day: date.getDate(),
      month: date.getMonth(),
      dayOfWeek: date.getDay(),
    };
  }

  // Populate with actual practice data
  history.forEach((entry) => {
    const date = new Date(entry.timestamp);
    const key = date.toISOString().split('T')[0];
    if (dayData[key]) {
      dayData[key].count++;
      if (entry.score > 0) dayData[key].scores.push(entry.score);
    }
  });

  // Calculate averages
  Object.values(dayData).forEach((day) => {
    if (day.scores.length > 0) {
      day.avgScore = Math.round(day.scores.reduce((a, b) => a + b, 0) / day.scores.length);
    }
  });

  // Group by weeks
  let currentWeek = [];
  Object.values(dayData).forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === Object.keys(dayData).length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return weeks;
};

/**
 * Get vocabulary diversity over time
 * @returns {Array} Vocabulary stats
 */
export const getVocabularyTrends = () => {
  const history = getProgressHistory();
  const last30 = history.slice(0, 30);

  return last30.map((entry, index) => {
    const words = entry.transcript ? entry.transcript.split(/\s+/).filter(w => w.length > 0) : [];
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const diversity = words.length > 0
      ? Math.round((uniqueWords.size / words.length) * 100)
      : 0;

    return {
      index: 30 - index,
      diversity,
      wordCount: words.length,
      uniqueWords: uniqueWords.size,
      timestamp: entry.timestamp,
    };
  }).reverse();
};

/**
 * Get speaking pace trends
 * @returns {Array} Speaking pace data
 */
export const getPaceTrends = () => {
  const history = getProgressHistory();
  const withPace = history
    .filter(entry => entry.analysis?.pace && entry.analysis.pace > 0)
    .slice(0, 30);

  return withPace.map((entry, index) => ({
    index: withPace.length - index,
    pace: entry.analysis.pace,
    timestamp: entry.timestamp,
    optimal: entry.analysis.pace >= 120 && entry.analysis.pace <= 160,
  })).reverse();
};

/**
 * Get filler words analysis over time
 * @returns {Object} Filler words stats
 */
export const getFillerWordsAnalysis = () => {
  const history = getProgressHistory();
  const last30 = history.slice(0, 30);

  const trends = last30.map((entry, index) => ({
    index: 30 - index,
    count: entry.analysis?.fillerWords || 0,
    timestamp: entry.timestamp,
  })).reverse();

  const total = last30.reduce((sum, entry) => sum + (entry.analysis?.fillerWords || 0), 0);
  const average = last30.length > 0 ? Math.round(total / last30.length) : 0;

  return {
    trends,
    total,
    average,
    improvement: calculateImprovement(trends.map(t => t.count)),
  };
};

/**
 * Calculate improvement rate
 */
const calculateImprovement = (values) => {
  if (values.length < 2) return 0;
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  if (firstAvg === 0) return 0;
  return Math.round(((firstAvg - secondAvg) / firstAvg) * 100);
};

/**
 * Get comparison between two entries
 * @param {string} entryId1 - First entry ID
 * @param {string} entryId2 - Second entry ID
 * @returns {Object} Comparison data
 */
export const compareEntries = (entryId1, entryId2) => {
  const history = getProgressHistory();
  const entry1 = history.find(e => e.id === entryId1);
  const entry2 = history.find(e => e.id === entryId2);

  if (!entry1 || !entry2) return null;

  const getWordCount = (transcript) => {
    return transcript ? transcript.split(/\s+/).filter(w => w.length > 0).length : 0;
  };

  return {
    entry1: {
      id: entry1.id,
      date: new Date(entry1.timestamp).toLocaleDateString(),
      score: entry1.score,
      sentiment: entry1.sentiment,
      wordCount: getWordCount(entry1.transcript),
      fillerWords: entry1.analysis?.fillerWords || 0,
      pace: entry1.analysis?.pace || 0,
      vocabulary: entry1.analysis?.vocabulary || 0,
    },
    entry2: {
      id: entry2.id,
      date: new Date(entry2.timestamp).toLocaleDateString(),
      score: entry2.score,
      sentiment: entry2.sentiment,
      wordCount: getWordCount(entry2.transcript),
      fillerWords: entry2.analysis?.fillerWords || 0,
      pace: entry2.analysis?.pace || 0,
      vocabulary: entry2.analysis?.vocabulary || 0,
    },
    improvements: {
      score: entry2.score - entry1.score,
      fillerWords: (entry1.analysis?.fillerWords || 0) - (entry2.analysis?.fillerWords || 0),
      vocabulary: (entry2.analysis?.vocabulary || 0) - (entry1.analysis?.vocabulary || 0),
    },
  };
};

/**
 * Get overall improvement metrics
 * @returns {Object} Improvement stats
 */
export const getImprovementMetrics = () => {
  const history = getProgressHistory();
  if (history.length < 10) return null;

  const recent = history.slice(0, 10);
  const older = history.slice(Math.max(history.length - 10, 10), history.length);

  const recentAvgScore = recent.reduce((sum, e) => sum + e.score, 0) / recent.length;
  const olderAvgScore = older.reduce((sum, e) => sum + e.score, 0) / older.length;

  const recentFillers = recent.filter(e => e.analysis?.fillerWords).reduce((sum, e) => sum + (e.analysis.fillerWords || 0), 0) / recent.filter(e => e.analysis?.fillerWords).length;
  const olderFillers = older.filter(e => e.analysis?.fillerWords).reduce((sum, e) => sum + (e.analysis.fillerWords || 0), 0) / older.filter(e => e.analysis?.fillerWords).length;

  return {
    scoreImprovement: Math.round(((recentAvgScore - olderAvgScore) / olderAvgScore) * 100) || 0,
    fillerWordsReduction: Math.round(((olderFillers - recentFillers) / olderFillers) * 100) || 0,
    totalPractices: history.length,
    recentPractices: recent.length,
    consistencyScore: calculateConsistencyScore(history),
  };
};

/**
 * Calculate consistency score based on practice frequency
 */
const calculateConsistencyScore = (history) => {
  if (history.length < 7) return 0;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const practicesDays = last7Days.filter(day => {
    return history.some(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === day;
    });
  }).length;

  return Math.round((practicesDays / 7) * 100);
};

/**
 * Get practice streaks
 * @returns {Object} Streak information
 */
export const getPracticeStreaks = () => {
  const history = getProgressHistory();
  if (history.length === 0) return { current: 0, longest: 0 };

  const practiceDays = [...new Set(history.map(entry => {
    return new Date(entry.timestamp).toISOString().split('T')[0];
  }))].sort().reverse();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Check current streak
  if (practiceDays[0] === today || practiceDays[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < practiceDays.length; i++) {
      const prevDate = new Date(practiceDays[i - 1]);
      const currDate = new Date(practiceDays[i]);
      const diffDays = Math.round((prevDate - currDate) / 86400000);
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < practiceDays.length; i++) {
    const prevDate = new Date(practiceDays[i - 1]);
    const currDate = new Date(practiceDays[i]);
    const diffDays = Math.round((prevDate - currDate) / 86400000);
    
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak, tempStreak);

  return {
    current: currentStreak,
    longest: longestStreak,
  };
};

/**
 * Get best performances
 * @param {number} limit - Number of top performances
 * @returns {Array} Top scoring entries
 */
export const getBestPerformances = (limit = 5) => {
  const history = getProgressHistory();
  return history
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(entry => ({
      id: entry.id,
      date: new Date(entry.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      score: entry.score,
      sentiment: entry.sentiment,
      transcript: entry.transcript ? entry.transcript.substring(0, 100) + '...' : '',
    }));
};

