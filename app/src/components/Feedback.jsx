import { motion } from "framer-motion";
import { feebackTextConfig } from "../config/feedbackText";
import { feedbackCTAMotionConfig } from "../config/feedbackCTAMotion";
import "../styles/Feedback.css";

export default function FeedBack({ userFeedback, resetFeedback, feedbackMessage }) {
  const config = feebackTextConfig[userFeedback];
  const score = config.score;
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
                <span className="score-text">Score</span>
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

        <motion.div 
          className="feedback-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
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
        </motion.div>
      </motion.div>
    </div>
  );
}
