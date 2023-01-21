import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/AnimatedMic.css";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import _debounce from "lodash/debounce";
import { micMotionConfig } from "../config/micMotion";
import MicNotSupport from "./MicNotSupport";

const AnimatedMic = ({ updateUserFeedback }) => {
  const [listen, setListen] = useState(false);

  const {
    listening,
    finalTranscript,
    interimTranscript,
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
    resetTranscript
  } = useSpeechRecognition();

  const handleToggleListen = (on) => {
    if (on) {
      SpeechRecognition.startListening();
    } else {
      SpeechRecognition.stopListening();
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
    }
  }, [listening]);

  const transcriptFinished =
    finalTranscript.length > 0 && interimTranscript === "";

  if (transcriptFinished) {
    const onTranscriptFinished = _debounce(() => {
      updateUserFeedback(finalTranscript);
      resetTranscript();
    }, 500);
    onTranscriptFinished();
  }

  const micNotSupported =
    !browserSupportsSpeechRecognition || !isMicrophoneAvailable;

  if (micNotSupported) {
    return <MicNotSupport updateUserFeedback={updateUserFeedback} />;
  }

  return (
    <div className="speech-input-banner">
      <motion.div
        layout
        className={"wrap"}
        data-listen={listen}
        onClick={toggleListen}
        initial={micMotionConfig.initial}
        animate={micMotionConfig.animate}
        transition={micMotionConfig.transition}
      >
        <div className={"mic"} data-listen={listen}></div>
      </motion.div>
      {!listen && <p>Tap Mic</p>}
    </div>
  );
};
export default AnimatedMic;
