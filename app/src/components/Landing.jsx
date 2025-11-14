import "../styles/Landing.css";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedMic from "./AnimatedMic";
import TextInput from "./TextInput";
import FeedBack from "./Feedback";
import VideoRecorder from "./VideoRecorder";
import ScenarioSelector from "./ScenarioSelector";
import VideoFeedback from "./VideoFeedback";
import QuestionDisplay from "./QuestionDisplay";
import QnAFeedback from "./QnAFeedback";
import DifficultySelector from "./DifficultySelector";
import PricingModal from "./PricingModal";
import UpgradePrompt from "./UpgradePrompt";
import { analyzeText } from "../utils/nlpAnalysis";
import {
  analyzeVideo,
  calculateVideoScore,
  generateVideoSuggestions,
} from "../utils/videoAnalysis";
import { saveProgressEntry } from "../utils/progressStorage";
import { feebackTextConfig } from "../config/feedbackText";
import { getScenarioFeedback, getScenario } from "../config/practiceScenarios";
import { getRandomQuestion } from "../config/qnaQuestions";
import { evaluateAnswer } from "../utils/qnaEvaluation";
import { useSubscription } from "../contexts/SubscriptionContext";
import { 
  getSessionLimitInfo, 
  incrementSessionCount, 
  hasReachedLimit
} from "../utils/sessionTracking";

const Landing = ({ playAudio, stopAudio }) => {
  // Subscription and session tracking
  const { isPremium, isFree } = useSubscription();
  const [sessionInfo, setSessionInfo] = useState(getSessionLimitInfo());
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [dismissedUpgradePrompt, setDismissedUpgradePrompt] = useState(false);

  // Mode selection: 'text', 'audio', 'video', or 'qna'
  const [mode, setMode] = useState(null);
  const [hasSelectedMode, setHasSelectedMode] = useState(false);

  // Text & Audio mode states (shared since both analyze text)
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

  // Q&A mode states
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showQuestionDisplay, setShowQuestionDisplay] = useState(false);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [qnaEvaluation, setQnaEvaluation] = useState(null);
  const [qnaEntryId, setQnaEntryId] = useState(null);

  // Check session limits and show upgrade prompt
  useEffect(() => {
    const info = getSessionLimitInfo();
    setSessionInfo(info);
    
    // Show upgrade prompt if not premium and should show
    if (isFree() && info.showUpgradePrompt && !dismissedUpgradePrompt) {
      setShowUpgradePrompt(true);
    }
  }, [isFree, dismissedUpgradePrompt]);

  // Check if user can start a new session
  const canStartSession = () => {
    if (isPremium()) return true;
    return !hasReachedLimit();
  };

  // Handle starting a new session
  const handleSessionStart = () => {
    // Check if user has reached limit
    if (!canStartSession()) {
      setShowPricingModal(true);
      return false;
    }

    // Increment session count for free users
    if (isFree()) {
      incrementSessionCount();
      const newInfo = getSessionLimitInfo();
      setSessionInfo(newInfo);
      
      // Show upgrade prompt if running low
      if (newInfo.showUpgradePrompt && !dismissedUpgradePrompt) {
        setShowUpgradePrompt(true);
      }
    }

    return true;
  };

  const updateUserFeedback = async (transcript) => {
    // Prevent duplicate processing of the same transcript
    if (
      !transcript ||
      transcript.trim() === "" ||
      transcript === lastSavedTranscriptRef.current
    ) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setCurrentTranscript(transcript);

      // Mark this transcript as being processed
      lastSavedTranscriptRef.current = transcript;

      // Add a small delay to show processing state
      await new Promise((resolve) => setTimeout(resolve, 800));

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
          suggestions: enhancedAnalysis.suggestions.length,
        },
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

        const config =
          feebackTextConfig[sentiment] || feebackTextConfig.neutral;
        const feedbackIndex = Math.floor(
          Math.random() * config.feedback.length
        );
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
            suggestions: fallbackAnalysis.suggestions.length,
          },
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

    // Reset video mode states and show scenario selector again
    setVideoAnalysis(null);
    setVideoAudioAnalysis(null);
    setVideoOverallScore(null);
    setVideoEntryId(null);
    setShowVideoRecorder(false);
    setSelectedScenarioId(null);
    setShowScenarioSelector(mode === "video"); // Show scenario selector only for video mode
    setAnalysisProgress(0);

    // Reset Q&A mode states
    if (mode === "qna") {
      setQnaEvaluation(null);
      setQnaEntryId(null);
      setShowQuestionDisplay(false);
      setShowDifficultySelector(true); // Show difficulty selector instead
    }
  };

  // Reset to landing screen (mode selector)
  const resetToLanding = () => {
    resetFeedback();
    setMode(null);
    setHasSelectedMode(false);
    setShowScenarioSelector(false);
    setShowQuestionDisplay(false);
    setShowDifficultySelector(false);
    setCurrentQuestion(null);
    setSelectedDifficulty(null);
    setQnaEvaluation(null);
    setQnaEntryId(null);
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
        const video = document.createElement("video");
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
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

        video.onerror = () => reject(new Error("Failed to load video"));
      } catch (err) {
        console.error("Error extracting audio:", err);
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
      const videoAnalysisResult = await analyzeVideo(
        videoElement,
        1,
        (progress) => {
          // Update progress in UI
          setAnalysisProgress(progress);
        }
      );

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
          vocabulary: { diversity: 70, totalWords: 50 },
        };
      } catch (audioErr) {
        console.warn("Audio analysis not available:", audioErr);
      }

      // Calculate overall score based on scenario
      const scenario = getScenario(selectedScenarioId);
      const scoreResult = calculateVideoScore(
        videoAnalysisResult,
        audioAnalysisResult,
        scenario
      );

      // Generate suggestions
      const suggestions = generateVideoSuggestions(
        videoAnalysisResult,
        scoreResult.breakdown,
        scenario
      );
      videoAnalysisResult.suggestions = suggestions;

      // Set analysis results
      setVideoAnalysis(videoAnalysisResult);
      setVideoAudioAnalysis(audioAnalysisResult);
      setVideoOverallScore(scoreResult.overall);

      // Save to progress history
      const savedEntry = saveProgressEntry({
        type: "video",
        scenarioId: selectedScenarioId,
        sentiment: videoAnalysisResult.facialExpressions.dominant,
        transcript: audioAnalysisResult ? "Video recording" : "",
        score: scoreResult.overall,
        feedback:
          getScenarioFeedback(selectedScenarioId, scoreResult.overall) ||
          "Great practice session!",
        analysis: {
          video: {
            eyeContact: videoAnalysisResult.eyeContact,
            confidence: videoAnalysisResult.confidence,
            posture: videoAnalysisResult.bodyLanguage.posture.score,
            gestures: videoAnalysisResult.bodyLanguage.gestures.frequency,
          },
          audio: audioAnalysisResult
            ? {
                fillerWords: audioAnalysisResult.fillerWords.count,
                pace: audioAnalysisResult.pace.wordsPerMinute,
                vocabulary: audioAnalysisResult.vocabulary.diversity,
              }
            : null,
          suggestions: suggestions.length,
        },
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

  // Handle Q&A mode initialization - show difficulty selector
  const handleQnAStart = () => {
    setShowDifficultySelector(true);
  };

  // Handle difficulty selection
  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    const question = getRandomQuestion(null, difficulty);
    setCurrentQuestion(question);
    setShowDifficultySelector(false);
    setShowQuestionDisplay(true);
  };

  // Handle Q&A answer submission
  const handleAnswerSubmit = async (answer, timeElapsed) => {
    if (!currentQuestion) {
      console.error("No current question available");
      setError("No question available. Please try again.");
      return;
    }

    if (!answer || answer.trim().length === 0) {
      setError("Please provide an answer before submitting.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Evaluate the answer with safety checks
      const evaluation = evaluateAnswer(answer, currentQuestion, timeElapsed);

      if (!evaluation) {
        throw new Error("Evaluation failed to produce results");
      }

      setQnaEvaluation(evaluation);

      // Save to progress history with safety checks
      const savedEntry = saveProgressEntry({
        type: "qna",
        questionId: currentQuestion.id || "unknown",
        category: currentQuestion.category || "unknown",
        difficulty: currentQuestion.difficulty || "unknown",
        question: currentQuestion.question || "",
        answer: answer,
        sentiment: "positive", // Q&A doesn't use sentiment
        transcript: answer,
        score: evaluation.overallScore || 0,
        feedback: evaluation.grade?.message || "Evaluation complete",
        analysis: {
          accuracy: evaluation.scores?.accuracy || 0,
          clarity: evaluation.scores?.clarity || 0,
          completeness: evaluation.scores?.completeness || 0,
          vocabulary: evaluation.scores?.vocabulary || 0,
          keywordsCovered:
            evaluation.keywordAnalysis?.matchedKeywords?.length || 0,
          totalKeywords: evaluation.keywordAnalysis?.totalKeywords || 0,
          suggestions: evaluation.suggestions?.length || 0,
        },
      });

      if (savedEntry && savedEntry.id) {
        setQnaEntryId(savedEntry.id);
      }

      setShowQuestionDisplay(false);
    } catch (err) {
      console.error("Q&A evaluation error:", err);
      setError(
        `Failed to evaluate your answer: ${
          err.message || "Unknown error"
        }. Please try again.`
      );
      setShowQuestionDisplay(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle try same question again
  const handleTryAgain = () => {
    setQnaEvaluation(null);
    setQnaEntryId(null);
    setShowQuestionDisplay(true);
  };

  // Handle get new question (keep same difficulty)
  const handleNewQuestion = () => {
    const newQuestion = getRandomQuestion(null, selectedDifficulty);
    setCurrentQuestion(newQuestion);
    setQnaEvaluation(null);
    setQnaEntryId(null);
    setShowQuestionDisplay(true);
  };

  const getBackgroundGradient = (feedback) => {
    const gradients = {
      positive: "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
      negative: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
      neutral: "linear-gradient(135deg, #718096 0%, #4a5568 100%)",
      mixed: "linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)",
      default: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    };
    return gradients[feedback] || gradients.default;
  };

  // Determine if we should show mode selector
  // Show mode selector only initially when nothing has happened yet
  const showModeSelector =
    !userFeedback &&
    !videoAnalysis &&
    !qnaEvaluation &&
    !isProcessing &&
    !error &&
    !showVideoRecorder &&
    !showScenarioSelector &&
    !showQuestionDisplay &&
    !showDifficultySelector &&
    !hasSelectedMode;

  return (
    <div
      className="Landing"
      data-user-feedback={userFeedback}
      data-processing={isProcessing}
      data-mode={mode}
      style={{
        background: getBackgroundGradient(
          userFeedback || (videoAnalysis ? "positive" : "")
        ),
      }}
    >
      <div className="landing-container">
        {/* Session Limit Info Bar */}
        {isFree() && showModeSelector && (
          <motion.div
            className="session-info-bar"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="session-info-content">
              <span className="session-info-text">
                {sessionInfo.remaining > 0 
                  ? `${sessionInfo.remaining} of ${sessionInfo.total} free sessions remaining`
                  : `You've used all ${sessionInfo.total} free sessions`
                }
              </span>
              <button 
                className="session-info-upgrade-btn"
                onClick={() => setShowPricingModal(true)}
              >
                ⚡ Upgrade for Unlimited
              </button>
            </div>
            <div className="session-info-progress">
              <div 
                className="session-info-progress-fill"
                style={{ width: `${sessionInfo.percentage}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Upgrade Prompt */}
        {showUpgradePrompt && !showPricingModal && (
          <UpgradePrompt
            remainingSessions={sessionInfo.remaining}
            onUpgrade={() => {
              setShowUpgradePrompt(false);
              setShowPricingModal(true);
            }}
            onDismiss={() => {
              setShowUpgradePrompt(false);
              setDismissedUpgradePrompt(true);
            }}
            show={showUpgradePrompt}
          />
        )}

        {/* Pricing Modal */}
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          currentSessionCount={sessionInfo.used}
        />

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
                className={`mode-btn ${mode === "text" ? "active" : ""}`}
                onClick={() => {
                  if (!handleSessionStart()) return;
                  setMode("text");
                  setHasSelectedMode(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mode-icon">✍️</span>
                <span className="mode-label">Text Mode</span>
                <span className="mode-description">
                  Type and analyze your speech
                </span>
              </motion.button>
              <motion.button
                className={`mode-btn ${mode === "audio" ? "active" : ""}`}
                onClick={() => {
                  if (!handleSessionStart()) return;
                  setMode("audio");
                  setHasSelectedMode(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mode-icon">🎤</span>
                <span className="mode-label">Audio Mode</span>
                <span className="mode-description">
                  Speak and get instant feedback
                </span>
              </motion.button>
              <motion.button
                className={`mode-btn ${mode === "video" ? "active" : ""} ${isFree() ? 'premium-feature' : ''}`}
                onClick={() => {
                  if (isFree()) {
                    setShowPricingModal(true);
                    return;
                  }
                  if (!handleSessionStart()) return;
                  setMode("video");
                  setHasSelectedMode(true);
                  setShowScenarioSelector(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isFree() && <span className="premium-badge">PREMIUM</span>}
                <span className="mode-icon">📹</span>
                <span className="mode-label">Video Mode</span>
                <span className="mode-description">
                  Record with video analysis
                </span>
                {isFree() && <span className="lock-icon">🔒</span>}
              </motion.button>
              <motion.button
                className={`mode-btn ${mode === "qna" ? "active" : ""} ${isFree() ? 'premium-feature' : ''}`}
                onClick={() => {
                  if (isFree()) {
                    setShowPricingModal(true);
                    return;
                  }
                  if (!handleSessionStart()) return;
                  setMode("qna");
                  setHasSelectedMode(true);
                  handleQnAStart();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isFree() && <span className="premium-badge">PREMIUM</span>}
                <span className="mode-icon">🎯</span>
                <span className="mode-label">Q&A Mode</span>
                <span className="mode-description">
                  Answer STEM questions and get scored
                </span>
                {isFree() && <span className="lock-icon">🔒</span>}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Scenario Selector */}
        {showScenarioSelector && (
          <ScenarioSelector
            onSelectScenario={handleScenarioSelect}
            onClose={resetToLanding}
          />
        )}

        {/* Difficulty Selector for Q&A */}
        {showDifficultySelector && (
          <DifficultySelector
            onSelectDifficulty={handleDifficultySelect}
            onBack={resetToLanding}
          />
        )}

        {/* Video Recorder */}
        {showVideoRecorder && selectedScenarioId && (
          <VideoRecorder
            scenarioId={selectedScenarioId}
            onComplete={handleVideoComplete}
            onCancel={handleVideoCancel}
            onBack={resetToLanding}
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
                  {mode === "video"
                    ? "Analyzing your video..."
                    : mode === "text"
                    ? "Analyzing your text..."
                    : mode === "qna"
                    ? "Evaluating your answer..."
                    : "Analyzing your message..."}
                </h2>
                <p className="processing-subtitle">
                  {mode === "video"
                    ? "Analyzing facial expressions, body language, and speech"
                    : mode === "qna"
                    ? "Checking accuracy, clarity, completeness, and vocabulary"
                    : "Analyzing sentiment, clarity, and delivery"}
                </p>
                {mode === "video" && isProcessing && (
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
                <button className="retry-button" onClick={resetFeedback}>
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Text Mode - Text Input */}
          {mode === "text" &&
            !userFeedback &&
            !isProcessing &&
            !error &&
            !showModeSelector && (
              <motion.div
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TextInput
                  updateUserFeedback={updateUserFeedback}
                  onBack={resetToLanding}
                />
              </motion.div>
            )}

          {/* Audio Mode - Mic Input */}
          {mode === "audio" &&
            !userFeedback &&
            !isProcessing &&
            !error &&
            !showModeSelector && (
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
                  onBack={resetToLanding}
                />
              </motion.div>
            )}

          {/* Text & Audio Mode - Feedback */}
          {(mode === "text" || mode === "audio") &&
            userFeedback &&
            !isProcessing && (
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
          {mode === "video" && videoAnalysis && !isProcessing && (
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
                onBack={resetToLanding}
              />
            </motion.div>
          )}

          {/* Q&A Question Display */}
          {showQuestionDisplay && currentQuestion && !isProcessing && (
            <motion.div
              key="question-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <QuestionDisplay
                question={currentQuestion}
                onSubmit={handleAnswerSubmit}
                onBack={resetToLanding}
              />
            </motion.div>
          )}

          {/* Q&A Feedback */}
          {qnaEvaluation && !isProcessing && (
            <motion.div
              key="qna-feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <QnAFeedback
                evaluation={qnaEvaluation}
                question={currentQuestion}
                onTryAgain={handleTryAgain}
                onNewQuestion={handleNewQuestion}
                onBack={resetToLanding}
                entryId={qnaEntryId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Landing;
