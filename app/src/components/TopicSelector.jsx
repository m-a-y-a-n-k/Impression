import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getAllCategories, 
  getCategoryIcon, 
  getCategoryDisplayName, 
  getCategoryDescription,
  getCategoryQuestionCount 
} from '../config/qnaQuestions';
import '../styles/TopicSelector.css';

const TopicSelector = ({ onSelectTopic, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = getAllCategories();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Small delay for visual feedback
    setTimeout(() => {
      onSelectTopic(category);
    }, 300);
  };

  return (
    <div className="topic-selector-container">
      <motion.div
        className="topic-selector-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="topic-selector-header">
          <button className="back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
          <h1 className="topic-selector-title">Choose Your Topic</h1>
          <p className="topic-selector-subtitle">
            Select a topic to explore questions across different difficulty levels
          </p>
        </div>

        {/* Topics Grid */}
        <div className="topics-grid">
          <AnimatePresence>
            {categories.map((category, index) => {
              const questionCount = getCategoryQuestionCount(category);
              const isSelected = selectedCategory === category;
              
              return (
                <motion.button
                  key={category}
                  className={`topic-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05 
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)' 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="topic-icon">
                    {getCategoryIcon(category)}
                  </div>
                  <div className="topic-info">
                    <h3 className="topic-name">
                      {getCategoryDisplayName(category)}
                    </h3>
                    <p className="topic-description">
                      {getCategoryDescription(category)}
                    </p>
                    <div className="topic-meta">
                      <span className="question-count">
                        📝 {questionCount} question{questionCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div 
                      className="selected-indicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Info Footer */}
        <div className="topic-selector-footer">
          <p className="footer-text">
            💡 Each topic contains questions across Beginner, Intermediate, and Advanced levels
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TopicSelector;

