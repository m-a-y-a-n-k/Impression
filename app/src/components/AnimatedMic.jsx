import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "../styles/AnimatedMic.css";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import _debounce from "lodash/debounce";
import { micMotionConfig } from "../config/micMotion";
import { getSpeechRecognitionLang } from "../config/languageConfig";
import MicNotSupport from "./MicNotSupport";
import impressionLogo from "../assets/impression.webp";

const AnimatedMic = ({ updateUserFeedback, playAudio, stopAudio, onBack }) => {
  const { i18n, t } = useTranslation();
  const [listen, setListen] = useState(false);
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
        // Get the speech recognition language code based on current i18n language
        const speechLang = getSpeechRecognitionLang(i18n.language);
        await SpeechRecognition.startListening({
          continuous: true,
          interimResults: true,
          language: speechLang
        });
      } else {
        SpeechRecognition.stopListening();
        setShowTranscript(false);
      }
    } catch (err) {
      setError(t('errors.noMicrophone'));
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

  if (micNotSupported) {
    return (
      <MicNotSupport
        updateUserFeedback={updateUserFeedback}
        explicitMode={false}
        setImplicitMode={() => {}}
        onBack={onBack}
      />
    );
  }

  const getStatusText = () => {
    if (error) return t('errors.general');
    if (isProcessing) return t('feedback.analyzing');
    if (listen) return t('micInput.listening');
    return t('micInput.clickToStart');
  };

  const getStatusIcon = () => {
    if (error) return "⚠️";
    if (isProcessing) return "⏳";
    if (listen) return "🎤";
    return "🎤";
  };

  const handleHome = () => {
    // Stop listening if active
    if (listen && listening) {
      SpeechRecognition.stopListening();
      setListen(false);
      stopAudio();
    }
    // Call the onBack callback
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="speech-input-banner">
      {onBack && (
        <motion.button
          className="home-button"
          onClick={handleHome}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={t('feedback.home')}
          title={t('feedback.home')}
        >
          <span className="home-icon">🏠</span>
          <span className="home-text">{t('feedback.home')}</span>
        </motion.button>
      )}
      <motion.div 
        className="header-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>
          <img src={impressionLogo} alt={t('app.title')} width={36} height={36} /> 
          {t('intro.welcome')}
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
            {t('actions.tryAgain')}
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
          aria-label={listen ? t('micInput.stop') : t('micInput.clickToStart')}
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
    </div>
  );
};
export default AnimatedMic;
