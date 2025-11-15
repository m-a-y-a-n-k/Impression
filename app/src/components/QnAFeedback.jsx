import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getCategoryIcon, 
  getCategoryDisplayName,
  getDifficultyLabel 
} from "../config/qnaQuestions";
import { isFavorite, toggleFavorite } from "../utils/progressStorage";
import "../styles/QnAFeedback.css";

const QnAFeedback = ({ evaluation, question, onTryAgain, onNewQuestion, onBack, entryId }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (entryId) {
      setIsFavorited(isFavorite(entryId));
    }
  }, [entryId]);

  const handleToggleFavorite = () => {
    if (entryId) {
      const newFavoriteStatus = toggleFavorite(entryId);
      setIsFavorited(newFavoriteStatus);
    }
  };

  // Safety checks
  if (!evaluation || !question) {
    return (
      <div className="qna-feedback-container">
        <div className="qna-feedback-card">
          <div className="error-message">
            <p>⚠️ Unable to load feedback. Please try again.</p>
            <button className="back-btn-feedback" onClick={onBack}>🏠 Home</button>
          </div>
        </div>
      </div>
    );
  }

  // Ensure all required evaluation properties exist
  const safeEvaluation = {
    grade: evaluation?.grade || { color: '#6b7280', grade: 'N/A', label: 'Unknown', message: 'Evaluation incomplete' },
    overallScore: evaluation?.overallScore || 0,
    scores: evaluation?.scores || { accuracy: 0, clarity: 0, completeness: 0, vocabulary: 0 },
    keywordAnalysis: evaluation?.keywordAnalysis || { matchedKeywords: [], missingKeywords: [], totalKeywords: 0 },
    clarityAnalysis: evaluation?.clarityAnalysis || { issues: [] },
    completenessAnalysis: evaluation?.completenessAnalysis || { wordCount: 0, status: 'unknown' },
    vocabularyAnalysis: evaluation?.vocabularyAnalysis || { diversity: 0 },
    suggestions: evaluation?.suggestions || [],
    nlpAnalysis: evaluation?.nlpAnalysis || { 
      sentenceStructure: { sentenceCount: 0 },
      vocabulary: { uniqueWords: 0 },
      fillerWords: { count: 0 }
    },
    category: evaluation?.category,
    difficulty: evaluation?.difficulty
  };

  return (
    <div className="qna-feedback-container">
      {/* Home Button */}
      <button
        className="qna-home-button"
        onClick={onBack}
        aria-label="Go to home"
        title="Go to home"
      >
        <span className="home-icon">🏠</span>
        <span className="home-text">Home</span>
      </button>

      <motion.div
        className="qna-feedback-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="feedback-header">
          {entryId && (
            <button 
              className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={handleToggleFavorite}
            >
              {isFavorited ? '★' : '☆'}
            </button>
          )}
        </div>

        {/* Score Display */}
        <motion.div
          className="score-display"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div 
            className="score-circle"
            style={{ borderColor: safeEvaluation.grade.color }}
          >
            <div className="score-number">{safeEvaluation.overallScore}</div>
            <div className="score-total">/100</div>
          </div>
          <div className="grade-info">
            <div 
              className="grade-badge"
              style={{ backgroundColor: safeEvaluation.grade.color }}
            >
              {safeEvaluation.grade.grade}
            </div>
            <div className="grade-label">{safeEvaluation.grade.label}</div>
          </div>
        </motion.div>

        {/* Feedback Message */}
        <div className="feedback-message">
          <p>{safeEvaluation.grade.message}</p>
        </div>

        {/* Question Info */}
        <div className="answered-question-info">
          <div className="info-row">
            <span className="info-icon">{getCategoryIcon(safeEvaluation.category)}</span>
            <span className="info-text">{getCategoryDisplayName(safeEvaluation.category)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Difficulty:</span>
            <span className="info-text">{getDifficultyLabel(safeEvaluation.difficulty)}</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="score-breakdown">
          <h3 className="breakdown-title">Score Breakdown</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-name">Accuracy</span>
                <span className="metric-score">{safeEvaluation.scores.accuracy}%</span>
              </div>
              <div className="metric-bar">
                <motion.div 
                  className="metric-fill"
                  style={{ backgroundColor: getMetricColor(safeEvaluation.scores.accuracy) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${safeEvaluation.scores.accuracy}%` }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </div>
              <p className="metric-detail">
                Keywords: {safeEvaluation.keywordAnalysis.matchedKeywords.length}/{safeEvaluation.keywordAnalysis.totalKeywords}
              </p>
            </div>

            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-name">Clarity</span>
                <span className="metric-score">{safeEvaluation.scores.clarity}%</span>
              </div>
              <div className="metric-bar">
                <motion.div 
                  className="metric-fill"
                  style={{ backgroundColor: getMetricColor(safeEvaluation.scores.clarity) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${safeEvaluation.scores.clarity}%` }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                />
              </div>
              <p className="metric-detail">
                {safeEvaluation.clarityAnalysis.issues.length > 0 
                  ? safeEvaluation.clarityAnalysis.issues[0] 
                  : 'Clear and well-structured'}
              </p>
            </div>

            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-name">Completeness</span>
                <span className="metric-score">{safeEvaluation.scores.completeness}%</span>
              </div>
              <div className="metric-bar">
                <motion.div 
                  className="metric-fill"
                  style={{ backgroundColor: getMetricColor(safeEvaluation.scores.completeness) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${safeEvaluation.scores.completeness}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
              <p className="metric-detail">
                {safeEvaluation.completenessAnalysis.wordCount} words ({safeEvaluation.completenessAnalysis.status})
              </p>
            </div>

            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-name">Vocabulary</span>
                <span className="metric-score">{safeEvaluation.scores.vocabulary}%</span>
              </div>
              <div className="metric-bar">
                <motion.div 
                  className="metric-fill"
                  style={{ backgroundColor: getMetricColor(safeEvaluation.scores.vocabulary) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${safeEvaluation.scores.vocabulary}%` }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </div>
              <p className="metric-detail">
                {safeEvaluation.vocabularyAnalysis.diversity}% diversity
              </p>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {safeEvaluation.suggestions.length > 0 && (
          <div className="suggestions-section">
            <h3 className="suggestions-title">💡 Areas for Improvement</h3>
            <div className="suggestions-list">
              {safeEvaluation.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className={`suggestion-item priority-${suggestion.priority}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="suggestion-message">{suggestion.message}</div>
                  <div className="suggestion-tip">{suggestion.tip}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Analysis Toggle */}
        <button
          className="toggle-details-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '▼' : '▶'} {showDetails ? 'Hide' : 'Show'} Detailed Analysis
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="detailed-analysis"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Missing Keywords */}
              {safeEvaluation.keywordAnalysis.missingKeywords.length > 0 && (
                <div className="detail-section">
                  <h4>Missing Key Concepts</h4>
                  <div className="keyword-tags">
                    {safeEvaluation.keywordAnalysis.missingKeywords.map((keyword, idx) => (
                      <span key={idx} className="keyword-tag missing">{keyword}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Keywords */}
              {safeEvaluation.keywordAnalysis.matchedKeywords.length > 0 && (
                <div className="detail-section">
                  <h4>Concepts Covered ✓</h4>
                  <div className="keyword-tags">
                    {safeEvaluation.keywordAnalysis.matchedKeywords.map((keyword, idx) => (
                      <span key={idx} className="keyword-tag matched">{keyword}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* NLP Insights */}
              <div className="detail-section">
                <h4>Language Analysis</h4>
                <div className="nlp-stats">
                  <div className="stat-item">
                    <span className="stat-label">Sentence Count:</span>
                    <span className="stat-value">{safeEvaluation.nlpAnalysis.sentenceStructure.sentenceCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg Sentence Length:</span>
                    <span className="stat-value">{safeEvaluation.nlpAnalysis.sentenceStructure.avgLength || 0} words</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Unique Words:</span>
                    <span className="stat-value">{safeEvaluation.nlpAnalysis.vocabulary.uniqueWords}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Filler Words:</span>
                    <span className="stat-value">{safeEvaluation.nlpAnalysis.fillerWords.count}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="action-buttons">
          <motion.button
            className="action-btn secondary"
            onClick={onTryAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🔄 Try This Again
          </motion.button>
          <motion.button
            className="action-btn primary"
            onClick={onNewQuestion}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ➡️ New Question
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const getMetricColor = (score) => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#fbbf24";
  return "#ef4444";
};

export default QnAFeedback;

