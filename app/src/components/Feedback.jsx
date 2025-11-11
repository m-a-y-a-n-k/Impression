import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { feebackTextConfig } from "../config/feedbackText";
import { feedbackCTAMotionConfig } from "../config/feedbackCTAMotion";
import { isFavorite, toggleFavorite } from "../utils/progressStorage";
import "../styles/Feedback.css";

export default function FeedBack({ userFeedback, resetFeedback, feedbackMessage, analysisData, entryId }) {
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

  const config = feebackTextConfig[userFeedback];
  // Use enhanced score if available, otherwise fallback to sentiment-based score
  const score = analysisData?.overallScore || config.score;
  // Use provided feedbackMessage if available, otherwise select randomly
  const customFeedback = feedbackMessage || (() => {
    const customFeedbackIndex = Math.floor(
      Math.random() * config.feedback.length
    );
    return config.feedback[customFeedbackIndex];
  })();
  const customCTAText = config.ctaText;

  const getScoreColor = (score) => {
    if (score >= 80) return "#38a169"; // Green
    if (score >= 60) return "#d69e2e"; // Yellow
    if (score >= 40) return "#ed8936"; // Orange
    return "#e53e3e"; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const getFeedbackIcon = (userFeedback) => {
    const icons = {
      positive: "🎉",
      negative: "😔",
      neutral: "😐",
      mixed: "🤔"
    };
    return icons[userFeedback] || "💭";
  };

  const getFeedbackGradient = (userFeedback) => {
    const gradients = {
      positive: "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
      negative: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
      neutral: "linear-gradient(135deg, #718096 0%, #4a5568 100%)",
      mixed: "linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)"
    };
    return gradients[userFeedback] || gradients.neutral;
  };

  return (
    <div className="feedback-container" data-feedback-type={userFeedback}>
      <motion.div 
        className="feedback-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="feedback-header"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="feedback-icon">{getFeedbackIcon(userFeedback)}</span>
          <h2 className="feedback-text">{customFeedback}</h2>
        </motion.div>

        {score && (
          <motion.div 
            className="score-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="score-display">
              <div className="score-label">
                <span className="score-text">Impression Score</span>
                <span className="score-value" style={{ color: getScoreColor(score) }}>
                  {score}
                </span>
              </div>
              <div className="score-bar-container">
                <motion.div 
                  className="score-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                  style={{ backgroundColor: getScoreColor(score) }}
                />
              </div>
              <div className="score-description">
                <span className="score-label-text" style={{ color: getScoreColor(score) }}>
                  {getScoreLabel(score)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Analysis Metrics */}
        {analysisData && (
          <motion.div
            className="analysis-metrics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="metrics-grid">
              {analysisData.fillerWords.count > 0 && (
                <div className="metric-item">
                  <span className="metric-icon">🗣️</span>
                  <div className="metric-content">
                    <span className="metric-label">Filler Words</span>
                    <span className="metric-value">{analysisData.fillerWords.count}</span>
                  </div>
                </div>
              )}
              {analysisData.pace.wordsPerMinute > 0 && (
                <div className="metric-item">
                  <span className="metric-icon">⚡</span>
                  <div className="metric-content">
                    <span className="metric-label">Speaking Pace</span>
                    <span className="metric-value">{analysisData.pace.wordsPerMinute} WPM</span>
                  </div>
                </div>
              )}
              {analysisData.vocabulary.totalWords > 0 && (
                <div className="metric-item">
                  <span className="metric-icon">📚</span>
                  <div className="metric-content">
                    <span className="metric-label">Vocabulary</span>
                    <span className="metric-value">{analysisData.vocabulary.diversity}% diverse</span>
                  </div>
                </div>
              )}
              {analysisData.repetition.count > 0 && (
                <div className="metric-item">
                  <span className="metric-icon">🔄</span>
                  <div className="metric-content">
                    <span className="metric-label">Repetitions</span>
                    <span className="metric-value">{analysisData.repetition.count}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Improvement Suggestions */}
            {analysisData.suggestions && analysisData.suggestions.length > 0 && (
              <motion.div
                className="suggestions-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <button
                  className="toggle-suggestions-btn"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <span>{showDetails ? 'Hide' : 'Show'} Improvement Tips</span>
                  <span className="toggle-icon">{showDetails ? '▲' : '▼'}</span>
                </button>
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      className="suggestions-list"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {analysisData.suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          className="suggestion-item"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="suggestion-priority" data-priority={suggestion.priority}>
                            {suggestion.priority === 'high' && '🔴'}
                            {suggestion.priority === 'medium' && '🟡'}
                            {suggestion.priority === 'low' && '🟢'}
                          </div>
                          <div className="suggestion-content">
                            <p className="suggestion-message">{suggestion.message}</p>
                            {suggestion.tip && (
                              <p className="suggestion-tip">💡 {suggestion.tip}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}

        <motion.div 
          className="feedback-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="feedback-actions-row">
            {entryId && (
              <motion.button
                className="favorite-btn"
                onClick={handleToggleFavorite}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <span className="favorite-icon">{isFavorited ? "⭐" : "☆"}</span>
              </motion.button>
            )}
            {customCTAText && (
              <motion.button
                className="feedback-btn"
                data-user-feedback={userFeedback}
                onClick={resetFeedback}
                initial={feedbackCTAMotionConfig.initial}
                animate={feedbackCTAMotionConfig.animate}
                transition={feedbackCTAMotionConfig.transition}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{ background: getFeedbackGradient(userFeedback) }}
                aria-label={`${customCTAText} - Start new feedback session`}
              >
                <span className="btn-text">{customCTAText}</span>
                <span className="btn-icon">✨</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
