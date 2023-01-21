import "../styles/MicNotSupport.css";
import { micSupportConfig } from "../config/micSupport";
import { useEffect, useState } from "react";
import DetectRTC from "detectrtc";
import { Textarea } from "@fluentui/react-components";
import { feedbackCTAMotionConfig } from "../config/feedbackCTAMotion";
import { motion } from "framer-motion";

const MicNotSupport = ({ updateUserFeedback }) => {
  const [rtcIssue, setRtcIssue] = useState("device");
  const [text, setText] = useState("");

  useEffect(() => {
    const getRTCProblem = () => {
      if (!DetectRTC.isWebRTCSupported) {
        setRtcIssue("browser");
      } else if (!DetectRTC.isWebsiteHasMicrophonePermissions) {
        setRtcIssue("permission");
      } else if (!DetectRTC.hasMicrophone) {
        setRtcIssue("device");
      }
    };

    getRTCProblem();
  }, []);

  const { feedback, hint } = micSupportConfig[rtcIssue] || {};

  return (
    <div className="mic-support-container">
      {feedback && <h3 className="feedback">{feedback}</h3>}
      {hint && <p className="hint">{hint}</p>}
      <Textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
        placeholder="Resize for more space"
        size="large"
        resize="both"
        style={{
          backgroundColor: "rgb(4, 3, 31)",
          color: text ? "white" : "rgb(175, 173, 209)",
          fontSize: "0.6em",
          padding: "12px 0 0 12px",
          border: "none"
        }}
      />
      <motion.div
        className="mic-support-submit-btn"
        onClick={() => {
          if (text) {
            updateUserFeedback(text);
          }
        }}
        data-enabled={text ? "true" : "false"}
        initial={feedbackCTAMotionConfig.initial}
        animate={feedbackCTAMotionConfig.animate}
        transition={feedbackCTAMotionConfig.transition}
      >
        <p>Submit</p>
      </motion.div>
    </div>
  );
};

export default MicNotSupport;