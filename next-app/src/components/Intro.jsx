import "../styles/Intro.css";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Intro = ({ closeIntro, playAudio }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const skipIntro = useCallback(() => {
    sessionStorage.setItem("intro-done", "1");
    closeIntro();
  }, [closeIntro]);

  const nextStep = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < 2) {
        setCurrentStep(prev => prev + 1);
      } else {
        sessionStorage.setItem("intro-done", "1");
        closeIntro();
      }
      setIsAnimating(false);
    }, 300);
  }, [currentStep, isAnimating, closeIntro]);

  // Initialize audio on mount
  useEffect(() => {
    playAudio();
  }, [playAudio]);

  // Auto-advance fallback (optional, can be removed for full manual control)
  useEffect(() => {
    if (currentStep < 2) {
      const timer = setTimeout(() => {
        if (!isAnimating) {
          nextStep();
        }
      }, 4000); // Auto-advance after 4 seconds if user doesn't interact
      return () => clearTimeout(timer);
    }
  }, [currentStep, isAnimating, nextStep]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'Escape') {
        skipIntro();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextStep, skipIntro]);

  const messages = [
    {
      text: "Make every word count",
      icon: "💬",
      description: "Analyze your speech and improve your delivery"
    },
    {
      text: "Speak with confidence",
      icon: "🎯",
      description: "Get real-time feedback on your speaking style"
    },
    {
      text: "Ready to begin?",
      icon: "✨",
      description: "Start your journey to better communication"
    }
  ];

  const currentMessage = messages[currentStep];

  return (
    <div className="intro-container" onClick={nextStep}>
      <div className="intro-overlay"></div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className="intro-content"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -30 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="intro-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2, 
              type: "spring", 
              stiffness: 200, 
              damping: 15 
            }}
          >
            {currentMessage.icon}
          </motion.div>

          <motion.h1
            className="intro-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {currentMessage.text}
          </motion.h1>

          <motion.p
            className="intro-description"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {currentMessage.description}
          </motion.p>

          {/* Progress Indicator */}
          <motion.div
            className="intro-progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : index < currentStep ? 'completed' : ''}`}
                animate={{
                  scale: index === currentStep ? 1.3 : 1,
                  opacity: index <= currentStep ? 1 : 0.3
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </motion.div>

          {/* Continue Button */}
          <motion.button
            className="continue-btn"
            onClick={(e) => {
              e.stopPropagation();
              nextStep();
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentStep < 2 ? (
              <>
                <span>Continue</span>
                <motion.span
                  className="btn-arrow"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  →
                </motion.span>
              </>
            ) : (
              <>
                <span>Get Started</span>
                <span className="btn-arrow">✨</span>
              </>
            )}
          </motion.button>

          {/* Click hint */}
          <motion.p
            className="click-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            Click anywhere or press Enter to continue
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Skip Button */}
      <motion.button
        className="skip-btn"
        onClick={(e) => {
          e.stopPropagation();
          skipIntro();
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Skip introduction"
      >
        Skip
      </motion.button>
    </div>
  );
};

export default Intro;
