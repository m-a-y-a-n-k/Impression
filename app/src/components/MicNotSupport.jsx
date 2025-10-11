import "../styles/MicNotSupport.css";
import { micSupportConfig } from "../config/micSupport";
import { useEffect, useState } from "react";
import DetectRTC from "detectrtc";
import { Textarea } from "@fluentui/react-components";
import { feedbackCTAMotionConfig } from "../config/feedbackCTAMotion";
import { motion } from "framer-motion";

const MicNotSupport = (props) => {
  const { updateUserFeedback, explicitMode = false, setImplicitMode } = props;
  const [rtcIssue, setRtcIssue] = useState("device");
  const [text, setText] = useState("");

  useEffect(() => {
    const getRTCProblem = () => {
      if (explicitMode) {
        setRtcIssue("explicit");
        return;
      }

      if (!DetectRTC.isWebRTCSupported) {
        setRtcIssue("browser");
        return;
      }
      if (!DetectRTC.isWebsiteHasMicrophonePermissions) {
        setRtcIssue("permission");
        return;
      }
      if (!DetectRTC.hasMicrophone) {
        setRtcIssue("device");
        return;
      }
    };

    getRTCProblem();
  }, [explicitMode]);

  const { feedback, hint, title, icon } =
    micSupportConfig[rtcIssue] || {};

  return (
    <div className="mic-support-container">
      <div className="mic-support-content">
        <div className="mic-support-header">
          {title && (
            <motion.div 
              className="title-section"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {icon && <span className="icon">{icon}</span>}
              <h2 className="title">{title}</h2>
            </motion.div>
          )}
          
          {feedback && (
            <motion.p 
              className="feedback"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {feedback}
            </motion.p>
          )}
          
          {hint && (
            <motion.p
              className="hint"
              data-explicit={explicitMode}
              onClick={() => {
                if (explicitMode) {
                  setImplicitMode();
                }
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={explicitMode ? { scale: 1.02 } : {}}
            >
              {hint}
            </motion.p>
          )}
        </div>

        <motion.div 
          className="textarea-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
            placeholder="Type your message here..."
            size="large"
            resize="both"
            className="custom-textarea"
          />
          <div className="textarea-footer">
            <span className="char-count">{text.length} characters</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mic-support-submit-btn"
        onClick={() => {
          if (text.trim()) {
            updateUserFeedback(text);
          }
        }}
        data-enabled={text.trim() ? "true" : "false"}
        initial={feedbackCTAMotionConfig.initial}
        animate={feedbackCTAMotionConfig.animate}
        transition={feedbackCTAMotionConfig.transition}
        whileHover={text.trim() ? { scale: 1.02 } : {}}
        whileTap={text.trim() ? { scale: 0.98 } : {}}
      >
        <span className="submit-text">Submit Message</span>
        <span className="submit-icon">📤</span>
      </motion.div>
    </div>
  );
};

export default MicNotSupport;
