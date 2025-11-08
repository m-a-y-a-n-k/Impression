import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import "../styles/AnimatedMic.css";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import _debounce from "lodash/debounce";
import { micMotionConfig } from "../config/micMotion";
import MicNotSupport from "./MicNotSupport";
import impressionLogo from "../assets/impression.webp";

const AnimatedMic = ({ updateUserFeedback, playAudio, stopAudio }) => {
  const [listen, setListen] = useState(false);
  const [useText, setUseText] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const processedTranscriptRef = useRef("");
  const debouncedUpdateRef = useRef(null);

  const {
    listening,
    finalTranscript,
    interimTranscript,
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
    resetTranscript
  } = useSpeechRecognition();

  const handleToggleListen = async (on) => {
    try {
      setError(null);
      if (on) {
        stopAudio();
        setShowTranscript(true);
        await SpeechRecognition.startListening({
          continuous: true,
          interimResults: true,
          language: 'en-US'
        });
      } else {
        SpeechRecognition.stopListening();
        setShowTranscript(false);
      }
    } catch (err) {
      setError('Failed to start speech recognition. Please try again.');
      console.error('Speech recognition error:', err);
    }
  };

  const toggleListen = () => {
    setListen((off) => {
      const on = !off;
      handleToggleListen(on);
      return on;
    });
  };

  const useTextOption = () => {
    setUseText(true);
  }

  useEffect(() => {
    if (!listening) {
      setListen(false);
      setIsProcessing(false);
    }
  }, [listening]);

  useEffect(() => {
    listen && stopAudio();
    !listen && playAudio();
  }, [listen, stopAudio, playAudio]);

  useEffect(() => {
    if (interimTranscript || finalTranscript) {
      setShowTranscript(true);
    }
  }, [interimTranscript, finalTranscript]);

  // Create debounced function once using useRef
  useEffect(() => {
    debouncedUpdateRef.current = _debounce((transcript) => {
      // Only process if this transcript hasn't been processed yet
      if (transcript && transcript !== processedTranscriptRef.current) {
        processedTranscriptRef.current = transcript;
        setIsProcessing(true);
        updateUserFeedback(transcript);
        resetTranscript();
        setShowTranscript(false);
        // Note: setIsProcessing(false) will be handled by Landing component
      }
    }, 500);

    return () => {
      if (debouncedUpdateRef.current) {
        debouncedUpdateRef.current.cancel();
      }
    };
  }, [updateUserFeedback, resetTranscript]);

  // Handle transcript finished
  useEffect(() => {
    const transcriptFinished = finalTranscript.length > 0 && interimTranscript === "";
    
    if (transcriptFinished && debouncedUpdateRef.current) {
      // Only process if this transcript hasn't been processed yet
      if (finalTranscript !== processedTranscriptRef.current) {
        debouncedUpdateRef.current(finalTranscript);
      }
    }
  }, [finalTranscript, interimTranscript]);

  // Reset processed transcript when listening stops
  useEffect(() => {
    if (!listening && !listen) {
      processedTranscriptRef.current = "";
    }
  }, [listening, listen]);

  const micNotSupported =
    !browserSupportsSpeechRecognition || !isMicrophoneAvailable;

  if (micNotSupported || useText) {
    const handleImplicitMode = () => {
      setUseText(false);
    }
    return (
      <MicNotSupport
        updateUserFeedback={updateUserFeedback}
        explicitMode={useText}
        setImplicitMode={handleImplicitMode}
      />
    );
  }

  const getStatusText = () => {
    if (error) return "Error occurred";
    if (isProcessing) return "Processing...";
    if (listen) return "Listening...";
    return "Tap the Mic";
  };

  const getStatusIcon = () => {
    if (error) return "⚠️";
    if (isProcessing) return "⏳";
    if (listen) return "🎤";
    return "🎤";
  };

  return (
    <div className="speech-input-banner">
      <motion.div 
        className="header-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>
          <img src={impressionLogo} alt="impression logo" width={36} height={36} /> 
          Welcome, Let's make you sound <em><strong>Impressive</strong></em>.
        </h1>
      </motion.div>

      {error && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => setError(null)}
          >
            Try Again
          </button>
        </motion.div>
      )}

      <motion.div
        layout
        className="mic-container"
        data-listen={listen}
        data-processing={isProcessing}
        data-error={!!error}
        initial={micMotionConfig.initial}
        animate={micMotionConfig.animate}
        transition={micMotionConfig.transition}
      >
        <motion.div
          className="wrap"
          onClick={toggleListen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          role="button"
          tabIndex={0}
          aria-label={listen ? "Stop listening" : "Start listening"}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleListen();
            }
          }}
        >
          <div className="mic" data-listen={listen} data-processing={isProcessing}>
            <div className="mic-icon">
              {getStatusIcon()}
            </div>
            {listen && (
              <div className="pulse-ring"></div>
            )}
            {isProcessing && (
              <div className="processing-spinner"></div>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="status-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="status-text">{getStatusText()}</p>
          
          {showTranscript && (interimTranscript || finalTranscript) && (
            <motion.div 
              className="transcript-display"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="transcript-content">
                <span className="final-text">{finalTranscript}</span>
                <span className="interim-text">{interimTranscript}</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {!listen && !isProcessing && !error && (
        <motion.div 
          className="use-text-intead" 
          onClick={useTextOption}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <p>Can't use Mic? Go with <strong>Text</strong> instead</p>
        </motion.div>
      )}
    </div>
  );
};
export default AnimatedMic;
