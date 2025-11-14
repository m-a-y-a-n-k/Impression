import { motion } from "framer-motion";
import { 
  DIFFICULTY_LEVELS, 
  getDifficultyColor, 
  getDifficultyLabel,
  getQuestionCountByDifficulty
} from "../config/qnaQuestions";
import "../styles/DifficultySelector.css";

const DifficultySelector = ({ onSelectDifficulty, onBack }) => {
  const difficulties = [
    {
      level: DIFFICULTY_LEVELS.BEGINNER,
      icon: '🌱',
      description: 'Perfect for getting started with fundamental concepts',
      timeRange: '3 minutes per question'
    },
    {
      level: DIFFICULTY_LEVELS.INTERMEDIATE,
      icon: '🎯',
      description: 'Challenge yourself with more complex topics',
      timeRange: '4 minutes per question'
    },
    {
      level: DIFFICULTY_LEVELS.ADVANCED,
      icon: '🚀',
      description: 'Test your expertise with advanced concepts',
      timeRange: '5 minutes per question'
    }
  ];

  return (
    <div className="difficulty-selector-overlay">
      <motion.div
        className="difficulty-selector-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="difficulty-header">
          <button className="back-btn-difficulty" onClick={onBack}>
            ← Back
          </button>
          <h2>Choose Your Difficulty Level</h2>
        </div>

        {/* Difficulty Cards */}
        <div className="difficulty-grid">
          {difficulties.map((difficulty, index) => (
            <motion.button
              key={difficulty.level}
              className="difficulty-card"
              onClick={() => onSelectDifficulty(difficulty.level)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              style={{ borderColor: getDifficultyColor(difficulty.level) }}
            >
              {/* Icon */}
              <div className="difficulty-icon-wrapper">
                <span className="difficulty-icon">{difficulty.icon}</span>
              </div>

              {/* Title */}
              <h3 
                className="difficulty-title"
                style={{ color: getDifficultyColor(difficulty.level) }}
              >
                {getDifficultyLabel(difficulty.level)}
              </h3>

              {/* Description */}
              <p className="difficulty-description">{difficulty.description}</p>

              {/* Stats */}
              <div className="difficulty-stats">
                <div className="stat-item">
                  <span className="stat-icon">⏱️</span>
                  <span className="stat-text">{difficulty.timeRange}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📝</span>
                  <span className="stat-text">
                    {getQuestionCountByDifficulty(difficulty.level)} questions
                  </span>
                </div>
              </div>

              {/* Start Arrow */}
              <div className="start-arrow">
                <span>Start →</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info Section */}
        <div className="difficulty-info">
          <p className="info-text">
            💡 <strong>Tip:</strong> Each question has a countdown timer. Answer before time runs out for the best score!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DifficultySelector;

