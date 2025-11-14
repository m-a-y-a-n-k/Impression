import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getCategoryIcon,
  getCategoryDisplayName,
  getDifficultyColor,
  getDifficultyLabel
} from "../config/qnaQuestions";
import "../styles/QuestionDisplay.css";

const QuestionDisplay = ({ question, onSubmit, onBack }) => {
  // Initialize hooks first (must be at top level)
  const [answer, setAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(question?.timeLimit || 300);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    if (answer.trim().length === 0) {
      return;
    }

    setIsSubmitting(true);
    await onSubmit(answer, timeElapsed);
    setIsSubmitting(false);
  };

  // Auto-submit when time runs out
  useEffect(() => {
    if (isTimeUp && answer.trim().length > 0 && !isSubmitting) {
      handleSubmit();
    }
  }, [isTimeUp]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 30) return '#ef4444'; // Red
    if (timeRemaining <= 60) return '#f59e0b'; // Orange
    return 'var(--card-text)'; // Normal
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  // Safety check for question (after hooks)
  if (!question) {
    return (
      <div className="question-display-container">
        <div className="question-display-card">
          <div className="error-message" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>⚠️ No question available. Please try again.</p>
            <button className="back-btn" onClick={onBack}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="question-display-container">
      <motion.div
        className="question-display-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="question-header">
          <button className="back-btn" onClick={onBack} disabled={isSubmitting}>
            ← Back
          </button>
          <div className={`timer ${timeRemaining <= 30 ? 'timer-warning' : ''}`}>
            <span className="timer-icon">{timeRemaining <= 30 ? '⚠️' : '⏱️'}</span>
            <span 
              className="timer-text" 
              style={{ color: getTimerColor() }}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        {/* Time Warning */}
        {isTimeUp && (
          <div className="time-up-warning">
            ⏰ Time's up! {answer.trim().length > 0 ? 'Submitting your answer...' : 'Please provide an answer.'}
          </div>
        )}

        {/* Question Info */}
        <div className="question-info">
          <div className="category-badge">
            <span className="category-icon">{getCategoryIcon(question?.category)}</span>
            <span className="category-name">{getCategoryDisplayName(question?.category)}</span>
          </div>
          <div 
            className="difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(question?.difficulty) }}
          >
            {getDifficultyLabel(question?.difficulty)}
          </div>
        </div>

        {/* Question Text */}
        <div className="question-content">
          <h2 className="question-title">Question</h2>
          <p className="question-text">{question?.question || 'No question text available'}</p>
        </div>

        {/* Answer Input */}
        <div className="answer-section">
          <div className="answer-header">
            <h3 className="answer-title">Your Answer</h3>
            <div className="word-count">
              <span className={wordCount < (question?.expectedLength || 100) * 0.8 ? 'count-low' : 'count-good'}>
                {wordCount}
              </span>
              <span className="count-separator">/</span>
              <span className="count-expected">~{question?.expectedLength || 100} words</span>
            </div>
          </div>
          <textarea
            className="answer-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... Be clear, concise, and include key concepts."
            disabled={isSubmitting || isTimeUp}
          />
        </div>

        {/* Tips */}
        <div className="tips-section">
          <p className="tips-title">💡 Tips for a great answer:</p>
          <ul className="tips-list">
            <li>Explain concepts clearly and concisely</li>
            <li>Use relevant technical terminology</li>
            <li>Provide examples where appropriate</li>
            <li>Structure your answer logically</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="submit-section">
          <motion.button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={answer.trim().length === 0 || isSubmitting || isTimeUp}
            whileHover={{ scale: (answer.trim().length > 0 && !isTimeUp) ? 1.02 : 1 }}
            whileTap={{ scale: (answer.trim().length > 0 && !isTimeUp) ? 0.98 : 1 }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Evaluating...
              </>
            ) : isTimeUp ? (
              'Time\'s Up!'
            ) : (
              'Submit Answer'
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionDisplay;


