import "../styles/Landing.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedMic from "./AnimatedMic";
import FeedBack from "./Feedback";
import compendium from "compendium-js";

const Landing = ({ playAudio, stopAudio }) => {
  const [userFeedback, setUserFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentTranscript, setCurrentTranscript] = useState("");

  const updateUserFeedback = async (transcript) => {
    try {
      setIsProcessing(true);
      setError(null);
      setCurrentTranscript(transcript);
      
      // Add a small delay to show processing state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let analysis = compendium.analyse(transcript, null, [
        "entities",
        "negation",
        "type",
        "numeric"
      ]);

      if (analysis && analysis.length > 0 && analysis[0].profile) {
        const sentiment = analysis[0].profile.label;
        setUserFeedback(sentiment);
      } else {
        throw new Error("Unable to analyze sentiment");
      }
    } catch (err) {
      console.error("Sentiment analysis error:", err);
      setError("Failed to analyze your message. Please try again.");
      // Fallback to neutral sentiment
      setUserFeedback("neutral");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFeedback = () => {
    setUserFeedback("");
    setError(null);
    setCurrentTranscript("");
  };

  const getBackgroundGradient = (feedback) => {
    const gradients = {
      positive: "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
      negative: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
      neutral: "linear-gradient(135deg, #718096 0%, #4a5568 100%)",
      mixed: "linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)",
      default: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    };
    return gradients[feedback] || gradients.default;
  };

  return (
    <div 
      className="Landing" 
      data-user-feedback={userFeedback}
      data-processing={isProcessing}
      style={{ background: getBackgroundGradient(userFeedback) }}
    >
      <div className="landing-container">
        <AnimatePresence mode="wait">
          {isProcessing && (
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
                <h2 className="processing-title">Analyzing your message...</h2>
                <p className="processing-subtitle">Understanding the sentiment</p>
                {currentTranscript && (
                  <div className="transcript-preview">
                    <p className="transcript-text">"{currentTranscript}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {error && !isProcessing && (
            <motion.div
              key="error"
              className="error-overlay"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="error-content">
                <span className="error-icon">⚠️</span>
                <h2 className="error-title">Analysis Error</h2>
                <p className="error-message">{error}</p>
                <button 
                  className="retry-button"
                  onClick={resetFeedback}
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {!userFeedback && !isProcessing && !error && (
            <motion.div
              key="mic"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <AnimatedMic 
                updateUserFeedback={updateUserFeedback} 
                playAudio={playAudio} 
                stopAudio={stopAudio} 
              />
            </motion.div>
          )}

          {userFeedback && !isProcessing && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <FeedBack 
                userFeedback={userFeedback} 
                resetFeedback={resetFeedback}
                transcript={currentTranscript}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Landing;
