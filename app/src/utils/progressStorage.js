/**
 * Progress tracking utility using localStorage
 */

const STORAGE_KEY = 'impression_progress_history';

/**
 * Get all progress entries from localStorage
 * @returns {Array} Array of progress entries
 */
export const getProgressHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading progress history:', error);
    return [];
  }
};

/**
 * Save a feedback entry to progress history
 * @param {Object} entry - Feedback entry object
 * @param {string} entry.sentiment - Sentiment label (positive, negative, neutral, mixed)
 * @param {string} entry.transcript - User's transcript
 * @param {number} entry.score - Score value
 * @param {string} entry.feedback - Feedback message
 */
export const saveProgressEntry = (entry) => {
  try {
    const history = getProgressHistory();
    const now = Date.now();
    const transcript = entry.transcript || '';
    
    // Prevent duplicate entries: check if same transcript was saved within last 2 seconds
    if (transcript.trim() !== '') {
      const recentDuplicate = history.find(h => {
        const timeDiff = now - h.timestamp;
        return h.transcript === transcript && timeDiff < 2000; // 2 seconds
      });
      
      if (recentDuplicate) {
        console.log('Duplicate entry prevented:', transcript);
        return null;
      }
    }
    
    const newEntry = {
      id: now.toString(),
      timestamp: now,
      sentiment: entry.sentiment || 'neutral',
      transcript: transcript,
      score: entry.score || 0,
      feedback: entry.feedback || '',
      date: new Date().toISOString(),
      // Enhanced analysis metrics
      analysis: entry.analysis || null
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(newEntry);
    
    // Limit history to last 200 entries to prevent storage issues
    const limitedHistory = history.slice(0, 200);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
    return newEntry;
  } catch (error) {
    console.error('Error saving progress entry:', error);
    return null;
  }
};

/**
 * Clear all progress history
 */
export const clearProgressHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing progress history:', error);
    return false;
  }
};

/**
 * Get progress statistics
 * @returns {Object} Statistics object
 */
export const getProgressStats = () => {
  try {
    const history = getProgressHistory();
    
    if (history.length === 0) {
      return {
        totalEntries: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        sentimentDistribution: {
          positive: 0,
          negative: 0,
          neutral: 0,
          mixed: 0
        },
        recentTrend: 'neutral',
        entriesByDate: [],
        scoreHistory: []
      };
    }

    // Calculate average score
    const scores = history.map(entry => entry.score || 0).filter(score => score > 0);
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;

    // Get highest and lowest scores
    const validScores = scores.filter(s => s > 0);
    const highestScore = validScores.length > 0 ? Math.max(...validScores) : 0;
    const lowestScore = validScores.length > 0 ? Math.min(...validScores) : 0;

    // Sentiment distribution
    const sentimentDistribution = history.reduce((acc, entry) => {
      const sentiment = entry.sentiment || 'neutral';
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0, mixed: 0 });

    // Calculate recent trend (last 5 entries)
    const recentEntries = history.slice(0, 5);
    const recentScores = recentEntries.map(e => e.score || 0).filter(s => s > 0);
    const recentAverage = recentScores.length > 0
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      : 0;
    
    let recentTrend = 'stable';
    if (recentAverage >= 70) recentTrend = 'improving';
    else if (recentAverage <= 40) recentTrend = 'declining';

    // Group entries by date for chart data
    const entriesByDate = history.reduce((acc, entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { date, count: 0, avgScore: 0, scores: [] };
      }
      acc[date].count++;
      if (entry.score > 0) {
        acc[date].scores.push(entry.score);
      }
      return acc;
    }, {});

    // Calculate average scores per date
    Object.keys(entriesByDate).forEach(date => {
      const scores = entriesByDate[date].scores;
      entriesByDate[date].avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    });

    // Score history for line chart (last 30 entries)
    const scoreHistory = history.slice(0, 30).map(entry => ({
      score: entry.score || 0,
      timestamp: entry.timestamp,
      sentiment: entry.sentiment
    }));

    return {
      totalEntries: history.length,
      averageScore,
      highestScore,
      lowestScore,
      sentimentDistribution,
      recentTrend,
      entriesByDate: Object.values(entriesByDate).reverse(),
      scoreHistory,
      lastEntryDate: history[0]?.timestamp || null,
      firstEntryDate: history[history.length - 1]?.timestamp || null
    };
  } catch (error) {
    console.error('Error calculating progress stats:', error);
    return {
      totalEntries: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      sentimentDistribution: { positive: 0, negative: 0, neutral: 0, mixed: 0 },
      recentTrend: 'stable',
      entriesByDate: [],
      scoreHistory: []
    };
  }
};

/**
 * Get entries for a specific date range
 * @param {number} days - Number of days to look back
 * @returns {Array} Filtered entries
 */
export const getRecentEntries = (days = 7) => {
  try {
    const history = getProgressHistory();
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    return history.filter(entry => entry.timestamp >= cutoffDate);
  } catch (error) {
    console.error('Error getting recent entries:', error);
    return [];
  }
};

/**
 * Escape CSV field value (handles commas, quotes, and newlines)
 * @param {string} value - Value to escape
 * @returns {string} Escaped value
 */
const escapeCSVField = (value) => {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};

/**
 * Export progress history as CSV
 * @returns {string} CSV string of history
 */
export const exportProgressHistory = () => {
  try {
    const history = getProgressHistory();
    
    if (history.length === 0) {
      return null;
    }
    
    // CSV Headers
    const headers = [
      'Date',
      'Time',
      'Score',
      'Sentiment',
      'Filler Words',
      'Speaking Pace (WPM)',
      'Vocabulary Diversity (%)',
      'Repetitions',
      'Suggestions Count',
      'Transcript',
      'Feedback'
    ];
    
    // Create CSV rows
    const rows = [headers.join(',')];
    
    // Add data rows
    history.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      const row = [
        escapeCSVField(dateStr),
        escapeCSVField(timeStr),
        escapeCSVField(entry.score || 0),
        escapeCSVField(entry.sentiment || 'neutral'),
        escapeCSVField(entry.analysis?.fillerWords || 0),
        escapeCSVField(entry.analysis?.pace || 0),
        escapeCSVField(entry.analysis?.vocabulary || 0),
        escapeCSVField(entry.analysis?.repetition || 0),
        escapeCSVField(entry.analysis?.suggestions || 0),
        escapeCSVField(entry.transcript || ''),
        escapeCSVField(entry.feedback || '')
      ];
      
      rows.push(row.join(','));
    });
    
    // Add summary statistics at the end
    const stats = getProgressStats();
    rows.push(''); // Empty row separator
    rows.push('Summary Statistics');
    rows.push('Metric,Value');
    rows.push(`Total Entries,${stats.totalEntries}`);
    rows.push(`Average Score,${stats.averageScore}`);
    rows.push(`Highest Score,${stats.highestScore}`);
    rows.push(`Lowest Score,${stats.lowestScore}`);
    rows.push(`Recent Trend,${stats.recentTrend}`);
    rows.push(''); // Empty row separator
    rows.push('Sentiment Distribution');
    rows.push('Sentiment,Count,Percentage');
    Object.entries(stats.sentimentDistribution).forEach(([sentiment, count]) => {
      const percentage = stats.totalEntries > 0 
        ? ((count / stats.totalEntries) * 100).toFixed(1) 
        : '0.0';
      rows.push(`${sentiment},${count},${percentage}%`);
    });
    
    return rows.join('\n');
  } catch (error) {
    console.error('Error exporting progress:', error);
    return null;
  }
};

