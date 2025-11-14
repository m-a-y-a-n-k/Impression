import { analyzeText } from './nlpAnalysis';

/**
 * Q&A Answer Evaluation Utility
 * Evaluates user answers based on multiple criteria
 */

/**
 * Calculate keyword match score
 * @param {string} answer - User's answer
 * @param {Array} keywords - Expected keywords
 * @returns {Object} Keyword analysis
 */
export const evaluateKeywords = (answer, keywords) => {
  if (!answer || !keywords || keywords.length === 0) {
    return { score: 0, matchedKeywords: [], missingKeywords: keywords, percentage: 0 };
  }

  const answerLower = answer.toLowerCase();
  const matchedKeywords = [];
  const missingKeywords = [];

  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (answerLower.includes(keywordLower)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const percentage = Math.round((matchedKeywords.length / keywords.length) * 100);
  const score = Math.min(100, percentage);

  return {
    score,
    matchedKeywords,
    missingKeywords,
    percentage,
    totalKeywords: keywords.length
  };
};

/**
 * Evaluate answer completeness based on length
 * @param {string} answer - User's answer
 * @param {number} expectedLength - Expected word count
 * @returns {Object} Completeness analysis
 */
export const evaluateCompleteness = (answer, expectedLength) => {
  if (!answer) {
    return { score: 0, wordCount: 0, percentage: 0, status: 'too-short' };
  }

  const words = answer.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Allow 20% variance from expected length
  const minLength = expectedLength * 0.8;
  const maxLength = expectedLength * 1.5;
  
  let score = 0;
  let status = 'optimal';
  let percentage = Math.round((wordCount / expectedLength) * 100);

  if (wordCount < minLength) {
    score = Math.round((wordCount / minLength) * 70);
    status = 'too-short';
  } else if (wordCount > maxLength) {
    score = 85;
    status = 'too-long';
  } else {
    score = 100;
    status = 'optimal';
  }

  return {
    score,
    wordCount,
    expectedLength,
    percentage,
    status
  };
};

/**
 * Evaluate clarity based on NLP analysis
 * @param {Object} nlpAnalysis - NLP analysis result
 * @returns {Object} Clarity analysis
 */
export const evaluateClarity = (nlpAnalysis) => {
  if (!nlpAnalysis) {
    return { score: 0, issues: ['Analysis unavailable'] };
  }

  let score = 100;
  const issues = [];

  // Penalize filler words
  if (nlpAnalysis.fillerWords?.percentage > 10) {
    score -= 30;
    issues.push('Too many filler words (um, uh, like)');
  } else if (nlpAnalysis.fillerWords?.percentage > 5) {
    score -= 15;
    issues.push('Some filler words present');
  }

  // Penalize excessive repetition
  if (nlpAnalysis.repetition?.count > 3) {
    score -= 20;
    issues.push('Excessive word repetition');
  } else if (nlpAnalysis.repetition?.count > 1) {
    score -= 10;
    issues.push('Some word repetition');
  }

  // Evaluate sentence structure
  if (nlpAnalysis.sentenceStructure?.avgLength > 30) {
    score -= 15;
    issues.push('Sentences are too long');
  } else if (nlpAnalysis.sentenceStructure?.avgLength < 8 && nlpAnalysis.sentenceStructure?.sentenceCount > 3) {
    score -= 10;
    issues.push('Sentences are too short');
  }

  // Bonus for good variety
  if (nlpAnalysis.sentenceStructure?.variety === 'high') {
    score += 10;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    issues,
    fillerWordPercentage: nlpAnalysis.fillerWords.percentage,
    repetitionCount: nlpAnalysis.repetition.count,
    avgSentenceLength: nlpAnalysis.sentenceStructure.avgLength
  };
};

/**
 * Evaluate vocabulary richness
 * @param {Object} nlpAnalysis - NLP analysis result
 * @returns {Object} Vocabulary analysis
 */
export const evaluateVocabulary = (nlpAnalysis) => {
  if (!nlpAnalysis || !nlpAnalysis.vocabulary) {
    return { score: 0, diversity: 0, insights: ['Vocabulary analysis unavailable'] };
  }

  let score = 0;
  const insights = [];

  // Vocabulary diversity score
  const diversity = nlpAnalysis.vocabulary.diversity || 0;
  if (diversity >= 70) {
    score = 100;
    insights.push('Excellent vocabulary diversity');
  } else if (diversity >= 60) {
    score = 85;
    insights.push('Good vocabulary diversity');
  } else if (diversity >= 50) {
    score = 70;
    insights.push('Adequate vocabulary diversity');
  } else {
    score = 50;
    insights.push('Limited vocabulary diversity');
  }

  // Complexity bonus
  if (nlpAnalysis.vocabulary.complexity === 'high') {
    score = Math.min(100, score + 10);
    insights.push('Good use of complex vocabulary');
  } else if (nlpAnalysis.vocabulary.complexity === 'low') {
    insights.push('Consider using more sophisticated vocabulary');
  }

  return {
    score,
    insights,
    diversity: nlpAnalysis.vocabulary.diversity,
    complexity: nlpAnalysis.vocabulary.complexity,
    uniqueWords: nlpAnalysis.vocabulary.uniqueWords,
    totalWords: nlpAnalysis.vocabulary.totalWords
  };
};

/**
 * Calculate weighted overall score based on evaluation criteria
 * @param {Object} scores - Individual scores object
 * @param {Object} weights - Weights for each criterion
 * @returns {number} Weighted overall score
 */
export const calculateWeightedScore = (scores, weights) => {
  const weightedScore = 
    (scores.accuracy * weights.accuracy) +
    (scores.clarity * weights.clarity) +
    (scores.completeness * weights.completeness) +
    (scores.vocabulary * weights.vocabulary);

  return Math.round(weightedScore);
};

/**
 * Generate improvement suggestions based on evaluation
 * @param {Object} evaluation - Complete evaluation object
 * @returns {Array} Array of improvement suggestions
 */
export const generateQnASuggestions = (evaluation) => {
  const suggestions = [];

  // Keyword coverage suggestions
  if (evaluation.keywordAnalysis.percentage < 50) {
    suggestions.push({
      type: 'keywords',
      priority: 'high',
      message: 'Your answer is missing many key concepts.',
      tip: `Try to include: ${evaluation.keywordAnalysis.missingKeywords.slice(0, 5).join(', ')}`
    });
  } else if (evaluation.keywordAnalysis.percentage < 75) {
    suggestions.push({
      type: 'keywords',
      priority: 'medium',
      message: 'Include more key concepts to improve your answer.',
      tip: `Consider mentioning: ${evaluation.keywordAnalysis.missingKeywords.slice(0, 3).join(', ')}`
    });
  }

  // Completeness suggestions
  if (evaluation.completenessAnalysis.status === 'too-short') {
    suggestions.push({
      type: 'completeness',
      priority: 'high',
      message: 'Your answer is too brief. Provide more detail and explanation.',
      tip: `Aim for around ${evaluation.completenessAnalysis.expectedLength} words. You wrote ${evaluation.completenessAnalysis.wordCount}.`
    });
  } else if (evaluation.completenessAnalysis.status === 'too-long') {
    suggestions.push({
      type: 'completeness',
      priority: 'low',
      message: 'Your answer is quite lengthy. Try to be more concise.',
      tip: 'Focus on the key points and avoid unnecessary details.'
    });
  }

  // Clarity suggestions
  if (evaluation.clarityAnalysis.issues.length > 0) {
    suggestions.push({
      type: 'clarity',
      priority: 'medium',
      message: 'Improve clarity by addressing these issues:',
      tip: evaluation.clarityAnalysis.issues.join(', ')
    });
  }

  // Vocabulary suggestions
  if (evaluation.vocabularyAnalysis.diversity < 60) {
    suggestions.push({
      type: 'vocabulary',
      priority: 'low',
      message: 'Use more varied vocabulary to enhance your answer.',
      tip: 'Try using synonyms and technical terms where appropriate.'
    });
  }

  return suggestions;
};

/**
 * Get score grade and feedback message
 * @param {number} score - Overall score (0-100)
 * @returns {Object} Grade information
 */
export const getScoreGrade = (score) => {
  if (score >= 90) {
    return {
      grade: 'A+',
      label: 'Outstanding',
      message: 'Excellent answer! You demonstrated comprehensive understanding.',
      color: '#10b981'
    };
  } else if (score >= 80) {
    return {
      grade: 'A',
      label: 'Excellent',
      message: 'Great answer! You showed strong understanding of the topic.',
      color: '#34d399'
    };
  } else if (score >= 70) {
    return {
      grade: 'B',
      label: 'Good',
      message: 'Good answer! A few improvements could make it even better.',
      color: '#fbbf24'
    };
  } else if (score >= 60) {
    return {
      grade: 'C',
      label: 'Fair',
      message: 'Fair answer. Review the key concepts and try to include more detail.',
      color: '#f59e0b'
    };
  } else if (score >= 50) {
    return {
      grade: 'D',
      label: 'Needs Improvement',
      message: 'Your answer needs improvement. Focus on key concepts and clarity.',
      color: '#fb923c'
    };
  } else {
    return {
      grade: 'F',
      label: 'Insufficient',
      message: 'Your answer is insufficient. Review the topic and try again.',
      color: '#ef4444'
    };
  }
};

/**
 * Comprehensive answer evaluation
 * @param {string} answer - User's answer
 * @param {Object} question - Question object with keywords and criteria
 * @param {number} durationSeconds - Optional time taken to answer
 * @returns {Object} Complete evaluation result
 */
export const evaluateAnswer = (answer, question, durationSeconds = null) => {
  try {
    if (!answer || !question) {
      console.error('evaluateAnswer: Missing answer or question');
      return null;
    }

    // Perform NLP analysis with safety check
    const nlpAnalysis = analyzeText(answer, durationSeconds);
    if (!nlpAnalysis) {
      throw new Error('NLP analysis failed');
    }

    // Evaluate different aspects with safety checks
    const keywordAnalysis = evaluateKeywords(answer, question.keywords || []);
    const completenessAnalysis = evaluateCompleteness(answer, question.expectedLength || 100);
    const clarityAnalysis = evaluateClarity(nlpAnalysis);
    const vocabularyAnalysis = evaluateVocabulary(nlpAnalysis);

    // Calculate individual scores
    const scores = {
      accuracy: keywordAnalysis?.score || 0,
      clarity: clarityAnalysis?.score || 0,
      completeness: completenessAnalysis?.score || 0,
      vocabulary: vocabularyAnalysis?.score || 0
    };

    // Calculate weighted overall score
    const overallScore = calculateWeightedScore(scores, question.evaluationCriteria || {});

    // Get grade information
    const grade = getScoreGrade(overallScore);

    // Generate suggestions
    const evaluation = {
      keywordAnalysis,
      completenessAnalysis,
      clarityAnalysis,
      vocabularyAnalysis,
      scores,
      overallScore,
      grade,
      nlpAnalysis
    };

    const suggestions = generateQnASuggestions(evaluation);

    return {
      ...evaluation,
      suggestions: suggestions || [],
      timestamp: new Date().toISOString(),
      questionId: question.id || 'unknown',
      category: question.category || 'unknown',
      difficulty: question.difficulty || 'unknown'
    };
  } catch (error) {
    console.error('Error in evaluateAnswer:', error);
    // Return a basic evaluation on error
    return {
      keywordAnalysis: { score: 0, matchedKeywords: [], missingKeywords: [], totalKeywords: 0 },
      completenessAnalysis: { score: 0, wordCount: 0, status: 'unknown' },
      clarityAnalysis: { score: 0, issues: [] },
      vocabularyAnalysis: { score: 0, diversity: 0 },
      scores: { accuracy: 0, clarity: 0, completeness: 0, vocabulary: 0 },
      overallScore: 0,
      grade: { color: '#6b7280', grade: 'N/A', label: 'Error', message: 'An error occurred during evaluation' },
      nlpAnalysis: { 
        sentenceStructure: { sentenceCount: 0 },
        vocabulary: { uniqueWords: 0 },
        fillerWords: { count: 0 }
      },
      suggestions: [],
      timestamp: new Date().toISOString(),
      questionId: question?.id || 'unknown',
      category: question?.category || 'unknown',
      difficulty: question?.difficulty || 'unknown',
      error: error.message
    };
  }
};

