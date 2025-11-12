import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getScenarioFeedback, getScenario } from "../config/practiceScenarios";
import { isFavorite, toggleFavorite } from "../utils/progressStorage";
import "../styles/VideoFeedback.css";

export default function VideoFeedback({ 
  videoAnalysis, 
  audioAnalysis, 
  overallScore, 
  scenarioId,
  entryId,
  resetFeedback,
  onBack
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const scenario = getScenario(scenarioId);
  
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

  const feedbackMessage = getScenarioFeedback(scenarioId, overallScore);

  const getScoreColor = (score) => {
    if (score >= 80) return "#38a169";
    if (score >= 60) return "#d69e2e";
    if (score >= 40) return "#ed8936";
    return "#e53e3e";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const getMetricColor = (value, threshold = 70) => {
    return value >= threshold ? "#38a169" : value >= threshold * 0.8 ? "#d69e2e" : "#e53e3e";
  };

  const handleHome = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="video-feedback-container">
      {onBack && (
        <motion.button
          className="home-button"
          onClick={handleHome}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go to home"
          title="Go to home"
        >
          <span className="home-icon">🏠</span>
          <span className="home-text">Home</span>
        </motion.button>
      )}
      <motion.div 
        className="video-feedback-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="video-feedback-header"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="scenario-icon-large">{scenario.icon}</span>
          <h2 className="scenario-name-large">{scenario.name}</h2>
          <p className="feedback-text">{feedbackMessage}</p>
        </motion.div>

        {overallScore !== undefined && (
          <motion.div 
            className="score-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="score-display">
              <div className="score-label">
                <span className="score-text">Overall Performance</span>
                <span className="score-value" style={{ color: getScoreColor(overallScore) }}>
                  {overallScore}
                </span>
              </div>
              <div className="score-bar-container">
                <motion.div 
                  className="score-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallScore}%` }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                  style={{ backgroundColor: getScoreColor(overallScore) }}
                />
              </div>
              <div className="score-description">
                <span className="score-label-text" style={{ color: getScoreColor(overallScore) }}>
                  {getScoreLabel(overallScore)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Video Analysis Metrics */}
        {videoAnalysis && (
          <motion.div
            className="video-metrics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="metrics-title">Video Analysis</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-icon">👁️</span>
                <div className="metric-content">
                  <span className="metric-label">Eye Contact</span>
                  <span 
                    className="metric-value"
                    style={{ color: getMetricColor(videoAnalysis.eyeContact) }}
                  >
                    {videoAnalysis.eyeContact}%
                  </span>
                </div>
              </div>
              
              <div className="metric-card">
                <span className="metric-icon">😊</span>
                <div className="metric-content">
                  <span className="metric-label">Confidence</span>
                  <span 
                    className="metric-value"
                    style={{ color: getMetricColor(videoAnalysis.confidence) }}
                  >
                    {videoAnalysis.confidence}%
                  </span>
                </div>
              </div>
              
              <div className="metric-card">
                <span className="metric-icon">🧍</span>
                <div className="metric-content">
                  <span className="metric-label">Posture</span>
                  <span 
                    className="metric-value"
                    style={{ color: getMetricColor(videoAnalysis.bodyLanguage.posture.score) }}
                  >
                    {videoAnalysis.bodyLanguage.posture.score}%
                  </span>
                </div>
              </div>
              
              <div className="metric-card">
                <span className="metric-icon">🤲</span>
                <div className="metric-content">
                  <span className="metric-label">Gestures</span>
                  <span 
                    className="metric-value"
                    style={{ color: getMetricColor(videoAnalysis.bodyLanguage.gestures.frequency) }}
                  >
                    {videoAnalysis.bodyLanguage.gestures.frequency}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Audio Analysis Metrics */}
        {audioAnalysis && (
          <motion.div
            className="audio-metrics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="metrics-title">Speech Analysis</h3>
            <div className="metrics-grid">
              {audioAnalysis.fillerWords.count > 0 && (
                <div className="metric-card">
                  <span className="metric-icon">🗣️</span>
                  <div className="metric-content">
                    <span className="metric-label">Filler Words</span>
                    <span className="metric-value">{audioAnalysis.fillerWords.count}</span>
                  </div>
                </div>
              )}
              {audioAnalysis.pace.wordsPerMinute > 0 && (
                <div className="metric-card">
                  <span className="metric-icon">⚡</span>
                  <div className="metric-content">
                    <span className="metric-label">Speaking Pace</span>
                    <span className="metric-value">{audioAnalysis.pace.wordsPerMinute} WPM</span>
                  </div>
                </div>
              )}
              {audioAnalysis.vocabulary.totalWords > 0 && (
                <div className="metric-card">
                  <span className="metric-icon">📚</span>
                  <div className="metric-content">
                    <span className="metric-label">Vocabulary</span>
                    <span className="metric-value">{audioAnalysis.vocabulary.diversity}% diverse</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Suggestions */}
        {videoAnalysis?.suggestions && videoAnalysis.suggestions.length > 0 && (
          <motion.div
            className="suggestions-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
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
                  {videoAnalysis.suggestions.map((suggestion, index) => (
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

        <motion.div 
          className="feedback-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <div className="feedback-actions-row">
            {entryId && (
              <motion.button
                className="favorite-btn"
                onClick={handleToggleFavorite}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1.3 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <span className="favorite-icon">{isFavorited ? "⭐" : "☆"}</span>
              </motion.button>
            )}
            <motion.button
              className="feedback-btn"
              onClick={resetFeedback}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              <span className="btn-text">Practice Again</span>
              <span className="btn-icon">✨</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

