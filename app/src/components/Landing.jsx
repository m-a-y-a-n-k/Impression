import "../styles/Landing.css";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedMic from "./AnimatedMic";
import FeedBack from "./Feedback";
import { analyzeText } from "../utils/nlpAnalysis";
import { saveProgressEntry } from "../utils/progressStorage";
import { feebackTextConfig } from "../config/feedbackText";

const Landing = ({ playAudio, stopAudio }) => {
  const [userFeedback, setUserFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [currentEntryId, setCurrentEntryId] = useState(null);
  const lastSavedTranscriptRef = useRef("");

  const updateUserFeedback = async (transcript) => {
    // Prevent duplicate processing of the same transcript
    if (!transcript || transcript.trim() === "" || transcript === lastSavedTranscriptRef.current) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setCurrentTranscript(transcript);
      
      // Mark this transcript as being processed
      lastSavedTranscriptRef.current = transcript;
      
      // Add a small delay to show processing state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Enhanced NLP analysis using compromise
      const enhancedAnalysis = analyzeText(transcript);
      setAnalysisData(enhancedAnalysis);
      
      const sentiment = enhancedAnalysis.sentiment.label;
      setUserFeedback(sentiment);
      
      // Get feedback config for this sentiment
      const config = feebackTextConfig[sentiment] || feebackTextConfig.neutral;
      const feedbackIndex = Math.floor(Math.random() * config.feedback.length);
      const feedback = config.feedback[feedbackIndex];
      
      // Use enhanced overall score if available, otherwise fallback to sentiment score
      const score = enhancedAnalysis.overallScore || config.score || 0;
      
      setFeedbackMessage(feedback);
      
      // Save to progress history with enhanced metrics (only once per transcript)
      const savedEntry = saveProgressEntry({
        sentiment,
        transcript,
        score,
        feedback,
        analysis: {
          fillerWords: enhancedAnalysis.fillerWords.count,
          repetition: enhancedAnalysis.repetition.count,
          pace: enhancedAnalysis.pace.wordsPerMinute,
          vocabulary: enhancedAnalysis.vocabulary.diversity,
          suggestions: enhancedAnalysis.suggestions.length
        }
      });
      
      // Store the entry ID for favorite functionality
      if (savedEntry && savedEntry.id) {
        setCurrentEntryId(savedEntry.id);
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze your message. Please try again.");
      
      // Fallback: try basic analysis
      try {
        const fallbackAnalysis = analyzeText(transcript);
        setAnalysisData(fallbackAnalysis);
        const sentiment = fallbackAnalysis.sentiment.label;
        setUserFeedback(sentiment);
        
        const config = feebackTextConfig[sentiment] || feebackTextConfig.neutral;
        const feedbackIndex = Math.floor(Math.random() * config.feedback.length);
        const feedback = config.feedback[feedbackIndex];
        const score = fallbackAnalysis.overallScore || config.score || 0;
        
        setFeedbackMessage(feedback);
        
        const savedEntry = saveProgressEntry({
          sentiment,
          transcript,
          score,
          feedback,
          analysis: {
            fillerWords: fallbackAnalysis.fillerWords.count,
            repetition: fallbackAnalysis.repetition.count,
            pace: fallbackAnalysis.pace.wordsPerMinute,
            vocabulary: fallbackAnalysis.vocabulary.diversity,
            suggestions: fallbackAnalysis.suggestions.length
          }
        });
        
        if (savedEntry && savedEntry.id) {
          setCurrentEntryId(savedEntry.id);
        }
      } catch (fallbackErr) {
        // Ultimate fallback
        const sentiment = "neutral";
        setUserFeedback(sentiment);
        const config = feebackTextConfig[sentiment];
        const feedback = config.feedback[0];
        setFeedbackMessage(feedback);
        setAnalysisData(null);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFeedback = () => {
    setUserFeedback("");
    setError(null);
    setCurrentTranscript("");
    setFeedbackMessage("");
    setAnalysisData(null);
    setCurrentEntryId(null);
    // Reset the ref so the same transcript can be processed again if needed
    lastSavedTranscriptRef.current = "";
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
                <p className="processing-subtitle">Analyzing sentiment, clarity, and delivery</p>
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
                feedbackMessage={feedbackMessage}
                analysisData={analysisData}
                entryId={currentEntryId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Landing;
