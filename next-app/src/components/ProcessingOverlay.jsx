"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ProcessingOverlay = ({ mode, analysisProgress, currentTranscript }) => {
  const getTitles = () => {
    switch (mode) {
      case 'video': return { title: "Analyzing your video...", subtitle: "Analyzing facial expressions, body language, and speech" };
      case 'text': return { title: "Analyzing your text...", subtitle: "Analyzing sentiment, clarity, and delivery" };
      case 'qna': return { title: "Evaluating your answer...", subtitle: "Checking accuracy, clarity, completeness, and vocabulary" };
      default: return { title: "Analyzing your message...", subtitle: "Analyzing sentiment, clarity, and delivery" };
    }
  };

  const { title, subtitle } = getTitles();

  return (
    <motion.div
      key="processing"
      className="processing-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="processing-content">
        <div className="processing-spinner"></div>
        <h2 className="processing-title">{title}</h2>
        <p className="processing-subtitle">{subtitle}</p>
        
        {mode === "video" && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${Math.max(analysisProgress, 2)}%` }}
            ></div>
            <span className="progress-text">{analysisProgress}%</span>
          </div>
        )}
        
        {currentTranscript && (mode === "audio" || mode === "text") && (
          <div className="transcript-preview">
            <p className="transcript-text">"{currentTranscript}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProcessingOverlay;
