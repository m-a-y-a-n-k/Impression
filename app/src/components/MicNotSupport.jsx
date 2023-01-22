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
      if(explicitMode){
        setRtcIssue("explicit");
        return ;
      }
 
      if (!DetectRTC.isWebRTCSupported) {
        setRtcIssue("browser");
        return ;
      } 
      if (!DetectRTC.isWebsiteHasMicrophonePermissions) {
        setRtcIssue("permission");
        return ;
      } 
      if (!DetectRTC.hasMicrophone) {
        setRtcIssue("device");
        return ;
      }
    };

    getRTCProblem();
  }, [explicitMode]);

  const { feedback, hint } = micSupportConfig[rtcIssue] || {};

  return (
    <div className="mic-support-container">
      {feedback && <h3 className="feedback">{feedback}</h3>}
      {hint && (
        <p 
          className="hint" 
          data-explicit={explicitMode} 
          onClick={() => {
            if(explicitMode){
              setImplicitMode();
            }
          }}
        >
          {hint}
        </p>
      )}
      <Textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
        placeholder="Resize from bottom right corner for more space"
        size="large"
        resize="both"
        style={{
          backgroundColor: "rgb(4, 3, 31)",
          color: text ? "white" : "rgb(175, 173, 209)",
          fontSize: "0.6em",
          padding: "12px 0 0 12px",
          border: "none",
          minWidth: 300,
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
