import { motion } from "framer-motion";
import { feebackTextConfig } from "../config/feedbackText";
import { feedbackCTAMotionConfig } from "../config/feedbackCTAMotion";
import "../styles/Feedback.css";

export default function FeedBack({ userFeedback, resetFeedback }) {
  const customFeedback = feebackTextConfig[userFeedback].feedback;
  const customCTAText = feebackTextConfig[userFeedback].ctaText;

  return (
    <>
      {customFeedback && <p>{customFeedback}</p>}
      {customCTAText && (<motion.div
        className="feedback-btn"
        data-user-feedback={userFeedback}
        onClick={() => {
          resetFeedback();
        }}
        initial={feedbackCTAMotionConfig.initial}
        animate={feedbackCTAMotionConfig.animate}
        transition={feedbackCTAMotionConfig.transition}
      >
        <p>{customCTAText}</p>
      </motion.div>)}
    </>
  );
}
