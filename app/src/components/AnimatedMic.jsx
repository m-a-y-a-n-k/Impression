import React, { useEffect, useState } from "react";
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
      stopAudio();
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

  const useTextOption = () => {
    setUseText(true);
  }

  useEffect(() => {
    if (!listening) {
      setListen(false);
    }
  }, [listening]);

  useEffect(() => {
    listen && stopAudio();
    !listen && playAudio();
  }, [listen, stopAudio, playAudio])

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

  if (micNotSupported || useText) {
    return (
      <MicNotSupport
        updateUserFeedback={updateUserFeedback}
        explicitMode={useText}
        setImplicitMode={() => setUseText(false)}
      />
    );
  }

  return (
    <div className="speech-input-banner">
      <h1><img src={impressionLogo} alt="impression logo" width={36} height={36} /> Welcome , Let's make you sound <em><strong>Impressive</strong></em>.</h1>
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
      {!listen && <p>Tap the Mic</p>}
      {!listen && (<div className="use-text-intead" onClick={useTextOption}>
        <p>Can't use Mic? Go with <strong>Text</strong> instead</p>
      </div>)}
    </div>
  );
};
export default AnimatedMic;
