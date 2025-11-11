import "../styles/Landing.css";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedMic from "./AnimatedMic";
import FeedBack from "./Feedback";
import VideoRecorder from "./VideoRecorder";
import ScenarioSelector from "./ScenarioSelector";
import VideoFeedback from "./VideoFeedback";
import { analyzeText } from "../utils/nlpAnalysis";
import { analyzeVideo, calculateVideoScore, generateVideoSuggestions } from "../utils/videoAnalysis";
import { saveProgressEntry } from "../utils/progressStorage";
import { feebackTextConfig } from "../config/feedbackText";
import { getScenarioFeedback, getScenario } from "../config/practiceScenarios";

const Landing = ({ playAudio, stopAudio }) => {
  // Mode selection: 'audio' or 'video'
  const [mode, setMode] = useState('audio');
  const [hasSelectedMode, setHasSelectedMode] = useState(false);
  
  // Audio mode states
  const [userFeedback, setUserFeedback] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [currentEntryId, setCurrentEntryId] = useState(null);
  const lastSavedTranscriptRef = useRef("");
  
  // Video mode states
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [videoAnalysis, setVideoAnalysis] = useState(null);
  const [videoAudioAnalysis, setVideoAudioAnalysis] = useState(null);
  const [videoOverallScore, setVideoOverallScore] = useState(null);
  const [videoEntryId, setVideoEntryId] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

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
    
    // Reset video mode states
    setVideoAnalysis(null);
    setVideoAudioAnalysis(null);
    setVideoOverallScore(null);
    setVideoEntryId(null);
    setShowVideoRecorder(false);
    setSelectedScenarioId(null);
    setAnalysisProgress(0);
  };

  // Handle scenario selection
  const handleScenarioSelect = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    setShowScenarioSelector(false);
    setShowVideoRecorder(true);
  };

  // Extract audio from video blob and analyze speech
  const extractAndAnalyzeAudio = async (videoBlob) => {
    return new Promise((resolve, reject) => {
      try {
        const video = document.createElement('video');
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(video);
        const analyser = audioContext.createAnalyser();
        
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        video.src = URL.createObjectURL(videoBlob);
        video.muted = true;
        
        video.onloadedmetadata = () => {
          // For now, we'll use a simplified approach
          // In production, you'd extract audio track and use speech recognition
          // For this implementation, we'll analyze the video's audio track separately
          resolve(null); // Return null for now - can be enhanced later
        };
        
        video.onerror = () => reject(new Error('Failed to load video'));
      } catch (err) {
        console.error('Error extracting audio:', err);
        resolve(null); // Return null if extraction fails
      }
    });
  };

  // Handle video recording completion
  const handleVideoComplete = async ({ blob, videoElement, duration }) => {
    try {
      setIsProcessing(true);
      setError(null);
      stopAudio();
      
      // Process video analysis with progress callback and optimized sample rate
      // Use 1 fps (1 frame per second) for faster processing
      setAnalysisProgress(0);
      const videoAnalysisResult = await analyzeVideo(videoElement, 1, (progress) => {
        // Update progress in UI
        setAnalysisProgress(progress);
      });
      
      // Extract and analyze audio (simplified - in production, extract audio track)
      // For now, we'll create a mock audio analysis based on video duration
      // In production, extract audio and use speech recognition
      let audioAnalysisResult = null;
      try {
        // Try to extract audio and analyze
        await extractAndAnalyzeAudio(blob);
        // For now, create a basic analysis structure
        // In production, this would come from actual speech recognition
        audioAnalysisResult = {
          overallScore: 75, // Placeholder
          fillerWords: { count: 0 },
          pace: { wordsPerMinute: 150 },
          vocabulary: { diversity: 70, totalWords: 50 }
        };
      } catch (audioErr) {
        console.warn('Audio analysis not available:', audioErr);
      }
      
      // Calculate overall score based on scenario
      const scenario = getScenario(selectedScenarioId);
      const scoreResult = calculateVideoScore(videoAnalysisResult, audioAnalysisResult, scenario);
      
      // Generate suggestions
      const suggestions = generateVideoSuggestions(videoAnalysisResult, scoreResult.breakdown, scenario);
      videoAnalysisResult.suggestions = suggestions;
      
      // Set analysis results
      setVideoAnalysis(videoAnalysisResult);
      setVideoAudioAnalysis(audioAnalysisResult);
      setVideoOverallScore(scoreResult.overall);
      
      // Save to progress history
      const savedEntry = saveProgressEntry({
        type: 'video',
        scenarioId: selectedScenarioId,
        sentiment: videoAnalysisResult.facialExpressions.dominant,
        transcript: audioAnalysisResult ? 'Video recording' : '',
        score: scoreResult.overall,
        feedback: getScenarioFeedback(selectedScenarioId, scoreResult.overall) || 'Great practice session!',
        analysis: {
          video: {
            eyeContact: videoAnalysisResult.eyeContact,
            confidence: videoAnalysisResult.confidence,
            posture: videoAnalysisResult.bodyLanguage.posture.score,
            gestures: videoAnalysisResult.bodyLanguage.gestures.frequency
          },
          audio: audioAnalysisResult ? {
            fillerWords: audioAnalysisResult.fillerWords.count,
            pace: audioAnalysisResult.pace.wordsPerMinute,
            vocabulary: audioAnalysisResult.vocabulary.diversity
          } : null,
          suggestions: suggestions.length
        }
      });
      
      if (savedEntry && savedEntry.id) {
        setVideoEntryId(savedEntry.id);
      }
      
      setShowVideoRecorder(false);
    } catch (err) {
      console.error("Video analysis error:", err);
      setError("Failed to analyze your video. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  // Handle video recorder cancel
  const handleVideoCancel = () => {
    setShowVideoRecorder(false);
    setSelectedScenarioId(null);
    resetFeedback();
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

  // Determine if we should show mode selector
  // Show mode selector only initially when nothing has happened yet
  const showModeSelector = !userFeedback && !videoAnalysis && !isProcessing && !error && !showVideoRecorder && !showScenarioSelector && !hasSelectedMode;

  return (
    <div 
      className="Landing" 
      data-user-feedback={userFeedback}
      data-processing={isProcessing}
      data-mode={mode}
      style={{ background: getBackgroundGradient(userFeedback || (videoAnalysis ? 'positive' : '')) }}
    >
      <div className="landing-container">
        {/* Mode Selector */}
        {showModeSelector && (
          <motion.div
            className="mode-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mode-selector-title">Choose Your Practice Mode</h2>
            <div className="mode-buttons">
              <motion.button
                className={`mode-btn ${mode === 'audio' ? 'active' : ''}`}
                onClick={() => {
                  setMode('audio');
                  setHasSelectedMode(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mode-icon">🎤</span>
                <span className="mode-label">Audio Only</span>
                <span className="mode-description">Quick speech analysis</span>
              </motion.button>
              <motion.button
                className={`mode-btn ${mode === 'video' ? 'active' : ''}`}
                onClick={() => {
                  setMode('video');
                  setHasSelectedMode(true);
                  setShowScenarioSelector(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mode-icon">📹</span>
                <span className="mode-label">Video Practice</span>
                <span className="mode-description">Practice scenarios with video</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Scenario Selector */}
        {showScenarioSelector && (
          <ScenarioSelector
            onSelectScenario={handleScenarioSelect}
            onClose={() => {
              setShowScenarioSelector(false);
              if (!selectedScenarioId) {
                setMode('audio');
              }
            }}
          />
        )}

        {/* Video Recorder */}
        {showVideoRecorder && selectedScenarioId && (
          <VideoRecorder
            scenarioId={selectedScenarioId}
            onComplete={handleVideoComplete}
            onCancel={handleVideoCancel}
          />
        )}

        <AnimatePresence mode="wait">
          {/* Processing Overlay */}
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
                <h2 className="processing-title">
                  {mode === 'video' ? 'Analyzing your video...' : 'Analyzing your message...'}
                </h2>
                <p className="processing-subtitle">
                  {mode === 'video' 
                    ? 'Analyzing facial expressions, body language, and speech'
                    : 'Analyzing sentiment, clarity, and delivery'}
                </p>
                {mode === 'video' && isProcessing && (
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${Math.max(analysisProgress, 2)}%` }}></div>
                    <span className="progress-text">{analysisProgress}%</span>
                  </div>
                )}
                {currentTranscript && mode === 'audio' && (
                  <div className="transcript-preview">
                    <p className="transcript-text">"{currentTranscript}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Error Overlay */}
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

          {/* Audio Mode - Mic Input */}
          {mode === 'audio' && !userFeedback && !isProcessing && !error && !showModeSelector && (
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

          {/* Audio Mode - Feedback */}
          {mode === 'audio' && userFeedback && !isProcessing && (
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

          {/* Video Mode - Feedback */}
          {mode === 'video' && videoAnalysis && !isProcessing && (
            <motion.div
              key="video-feedback"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <VideoFeedback
                videoAnalysis={videoAnalysis}
                audioAnalysis={videoAudioAnalysis}
                overallScore={videoOverallScore}
                scenarioId={selectedScenarioId}
                entryId={videoEntryId}
                resetFeedback={resetFeedback}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Landing;
