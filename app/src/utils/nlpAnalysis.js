import nlp from 'compromise';
import compendium from 'compendium-js';

/**
 * Enhanced NLP analysis using compromise and compendium
 */

// Common filler words to detect
const FILLER_WORDS = [
  'um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'well', 
  'actually', 'basically', 'literally', 'right', 'okay', 'ok',
  'i mean', 'sort of', 'kind of', 'you see', 'i guess'
];

/**
 * Detect filler words in text
 * @param {string} text - Input text
 * @returns {Object} Filler word analysis
 */
export const detectFillerWords = (text) => {
  if (!text || text.trim() === '') {
    return { count: 0, words: [], percentage: 0 };
  }

  const lowerText = text.toLowerCase();
  const words = text.split(/\s+/);
  const foundFillers = [];
  const fillerCounts = {};

  FILLER_WORDS.forEach(filler => {
    // Handle multi-word fillers
    if (filler.includes(' ')) {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        foundFillers.push(...matches);
        fillerCounts[filler] = (fillerCounts[filler] || 0) + matches.length;
      }
    } else {
      // Single word filler
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        foundFillers.push(...matches);
        fillerCounts[filler] = (fillerCounts[filler] || 0) + matches.length;
      }
    }
  });

  const totalWords = words.length;
  const percentage = totalWords > 0 ? Math.round((foundFillers.length / totalWords) * 100) : 0;

  return {
    count: foundFillers.length,
    words: foundFillers,
    percentage,
    breakdown: fillerCounts,
    severity: percentage > 10 ? 'high' : percentage > 5 ? 'medium' : 'low'
  };
};

/**
 * Analyze sentence structure
 * @param {string} text - Input text
 * @returns {Object} Sentence structure analysis
 */
export const analyzeSentenceStructure = (text) => {
  if (!text || text.trim() === '') {
    return { sentenceCount: 0, avgLength: 0, variety: 'low' };
  }

  const doc = nlp(text);
  const sentences = doc.sentences().out('array');
  const sentenceCount = sentences.length;
  
  const sentenceLengths = sentences.map(s => {
    const words = s.split(/\s+/).filter(w => w.length > 0);
    return words.length;
  });

  const avgLength = sentenceLengths.length > 0
    ? Math.round(sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length)
    : 0;

  // Calculate variety (standard deviation of sentence lengths)
  const variance = sentenceLengths.length > 0
    ? sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length
    : 0;
  const stdDev = Math.sqrt(variance);
  
  let variety = 'low';
  if (stdDev > 8) variety = 'high';
  else if (stdDev > 4) variety = 'medium';

  return {
    sentenceCount,
    avgLength,
    minLength: Math.min(...sentenceLengths, 0),
    maxLength: Math.max(...sentenceLengths, 0),
    variety,
    sentenceLengths
  };
};

/**
 * Detect word repetition
 * @param {string} text - Input text
 * @returns {Object} Repetition analysis
 */
export const detectRepetition = (text) => {
  if (!text || text.trim() === '') {
    return { repeatedWords: [], count: 0 };
  }

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3); // Only check words longer than 3 characters

  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  const repeatedWords = Object.entries(wordCounts)
    .filter(([word, count]) => count > 2)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));

  return {
    repeatedWords: repeatedWords.slice(0, 5), // Top 5
    count: repeatedWords.length,
    severity: repeatedWords.length > 3 ? 'high' : repeatedWords.length > 1 ? 'medium' : 'low'
  };
};

/**
 * Analyze vocabulary and clarity
 * @param {string} text - Input text
 * @returns {Object} Vocabulary analysis
 */
export const analyzeVocabulary = (text) => {
  if (!text || text.trim() === '') {
    return { uniqueWords: 0, totalWords: 0, diversity: 0, complexity: 'low' };
  }

  const doc = nlp(text);
  const words = doc.terms().out('array');
  const totalWords = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  const diversity = totalWords > 0 ? Math.round((uniqueWords / totalWords) * 100) : 0;

  // Simple complexity check: average word length
  const avgWordLength = words.length > 0
    ? words.reduce((sum, w) => sum + w.length, 0) / words.length
    : 0;

  let complexity = 'low';
  if (avgWordLength > 6) complexity = 'high';
  else if (avgWordLength > 4.5) complexity = 'medium';

  return {
    uniqueWords,
    totalWords,
    diversity,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    complexity
  };
};

/**
 * Calculate speaking pace (words per minute)
 * @param {string} text - Input text
 * @param {number} durationSeconds - Duration in seconds (optional)
 * @returns {Object} Pace analysis
 */
export const analyzePace = (text, durationSeconds = null) => {
  if (!text || text.trim() === '') {
    return { wordsPerMinute: 0, pace: 'normal', wordCount: 0 };
  }

  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  let wordsPerMinute = 0;
  let pace = 'normal';

  if (durationSeconds && durationSeconds > 0) {
    wordsPerMinute = Math.round((wordCount / durationSeconds) * 60);
  } else {
    // Estimate based on average reading speed (150-160 WPM for speech)
    // Assume average speaking duration
    const estimatedDuration = wordCount / 2.5; // Rough estimate
    wordsPerMinute = Math.round((wordCount / estimatedDuration) * 60);
  }

  if (wordsPerMinute > 180) pace = 'too-fast';
  else if (wordsPerMinute > 160) pace = 'fast';
  else if (wordsPerMinute < 100) pace = 'too-slow';
  else if (wordsPerMinute < 120) pace = 'slow';
  else pace = 'normal';

  return {
    wordsPerMinute,
    pace,
    wordCount,
    estimatedDuration: durationSeconds || Math.round((wordCount / 2.5))
  };
};

/**
 * Get sentiment analysis using compendium
 * @param {string} text - Input text
 * @returns {Object} Sentiment analysis
 */
export const analyzeSentiment = (text) => {
  try {
    const analysis = compendium.analyse(text, null, [
      "entities",
      "negation",
      "type",
      "numeric"
    ]);

    if (analysis && analysis.length > 0 && analysis[0].profile) {
      return {
        label: analysis[0].profile.label,
        score: analysis[0].profile.score || 0,
        tokens: analysis[0].tokens || []
      };
    }
  } catch (error) {
    console.error('Sentiment analysis error:', error);
  }

  return {
    label: 'neutral',
    score: 0,
    tokens: []
  };
};

/**
 * Generate improvement suggestions based on analysis
 * @param {Object} analysis - Complete analysis object
 * @returns {Array} Array of improvement suggestions
 */
export const generateSuggestions = (analysis) => {
  const suggestions = [];

  // Filler word suggestions
  if (analysis.fillerWords.count > 0) {
    if (analysis.fillerWords.severity === 'high') {
      suggestions.push({
        type: 'filler-words',
        priority: 'high',
        message: `You used ${analysis.fillerWords.count} filler words. Try pausing instead of saying "um" or "uh".`,
        tip: 'Practice speaking slowly and pause when you need to think.'
      });
    } else if (analysis.fillerWords.severity === 'medium') {
      suggestions.push({
        type: 'filler-words',
        priority: 'medium',
        message: `You used ${analysis.fillerWords.count} filler words. Consider reducing them for a more confident delivery.`,
        tip: 'Take a breath instead of using filler words.'
      });
    }
  }

  // Repetition suggestions
  if (analysis.repetition.count > 0) {
    suggestions.push({
      type: 'repetition',
      priority: 'medium',
      message: `You repeated some words multiple times. Try using synonyms for variety.`,
      tip: `Repeated words: ${analysis.repetition.repeatedWords.slice(0, 3).map(r => r.word).join(', ')}`
    });
  }

  // Sentence structure suggestions
  if (analysis.sentenceStructure.variety === 'low' && analysis.sentenceStructure.sentenceCount > 2) {
    suggestions.push({
      type: 'sentence-variety',
      priority: 'low',
      message: 'Vary your sentence lengths for better engagement.',
      tip: 'Mix short punchy sentences with longer descriptive ones.'
    });
  }

  if (analysis.sentenceStructure.avgLength > 25) {
    suggestions.push({
      type: 'sentence-length',
      priority: 'medium',
      message: 'Some sentences are quite long. Break them into shorter, clearer statements.',
      tip: 'Aim for 15-20 words per sentence for clarity.'
    });
  }

  // Pace suggestions
  if (analysis.pace.pace === 'too-fast') {
    suggestions.push({
      type: 'pace',
      priority: 'high',
      message: 'You\'re speaking too fast. Slow down for better clarity.',
      tip: `Current pace: ${analysis.pace.wordsPerMinute} WPM. Aim for 140-160 WPM.`
    });
  } else if (analysis.pace.pace === 'too-slow') {
    suggestions.push({
      type: 'pace',
      priority: 'medium',
      message: 'You\'re speaking a bit slowly. Pick up the pace slightly.',
      tip: `Current pace: ${analysis.pace.wordsPerMinute} WPM. Aim for 140-160 WPM.`
    });
  }

  // Vocabulary suggestions
  if (analysis.vocabulary.diversity < 50 && analysis.vocabulary.totalWords > 20) {
    suggestions.push({
      type: 'vocabulary',
      priority: 'low',
      message: 'Use more varied vocabulary to make your message more engaging.',
      tip: 'Try using synonyms and different word choices.'
    });
  }

  return suggestions;
};

/**
 * Comprehensive NLP analysis
 * @param {string} text - Input text
 * @param {number} durationSeconds - Optional duration in seconds
 * @returns {Object} Complete analysis object
 */
export const analyzeText = (text, durationSeconds = null) => {
  if (!text || text.trim() === '') {
    return {
      sentiment: { label: 'neutral', score: 0 },
      fillerWords: { count: 0, words: [], percentage: 0 },
      sentenceStructure: { sentenceCount: 0, avgLength: 0 },
      repetition: { repeatedWords: [], count: 0 },
      vocabulary: { uniqueWords: 0, totalWords: 0, diversity: 0 },
      pace: { wordsPerMinute: 0, pace: 'normal', wordCount: 0 },
      suggestions: []
    };
  }

  const sentiment = analyzeSentiment(text);
  const fillerWords = detectFillerWords(text);
  const sentenceStructure = analyzeSentenceStructure(text);
  const repetition = detectRepetition(text);
  const vocabulary = analyzeVocabulary(text);
  const pace = analyzePace(text, durationSeconds);

  const analysis = {
    sentiment,
    fillerWords,
    sentenceStructure,
    repetition,
    vocabulary,
    pace
  };

  const suggestions = generateSuggestions(analysis);

  return {
    ...analysis,
    suggestions,
    overallScore: calculateOverallScore(analysis)
  };
};

/**
 * Calculate overall impression score based on all metrics
 * @param {Object} analysis - Analysis object
 * @returns {number} Overall score (0-100)
 */
const calculateOverallScore = (analysis) => {
  let score = 50; // Base score

  // Sentiment impact (0-30 points)
  const sentimentScores = {
    positive: 30,
    mixed: 15,
    neutral: 10,
    negative: 0
  };
  score += sentimentScores[analysis.sentiment.label] || 10;

  // Filler words penalty (0-20 points)
  if (analysis.fillerWords.percentage > 10) {
    score -= 20;
  } else if (analysis.fillerWords.percentage > 5) {
    score -= 10;
  } else if (analysis.fillerWords.count === 0) {
    score += 5;
  }

  // Repetition penalty (0-10 points)
  if (analysis.repetition.count > 3) {
    score -= 10;
  } else if (analysis.repetition.count > 1) {
    score -= 5;
  }

  // Sentence variety bonus (0-10 points)
  if (analysis.sentenceStructure.variety === 'high') {
    score += 10;
  } else if (analysis.sentenceStructure.variety === 'medium') {
    score += 5;
  }

  // Pace bonus/penalty (0-10 points)
  if (analysis.pace.pace === 'normal') {
    score += 10;
  } else if (analysis.pace.pace === 'fast' || analysis.pace.pace === 'slow') {
    score += 5;
  }

  // Vocabulary diversity bonus (0-10 points)
  if (analysis.vocabulary.diversity > 70) {
    score += 10;
  } else if (analysis.vocabulary.diversity > 50) {
    score += 5;
  }

  // Clamp score between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
};

