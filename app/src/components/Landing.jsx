import "../styles/Landing.css";
import { useState } from "react";
import AnimatedMic from "./AnimatedMic";
import FeedBack from "./Feedback";
import compendium from "compendium-js";

const Landing = ({ playAudio, stopAudio }) => {
  const [userFeedback, setUserFeedback] = useState("");

  const updateUserFeedback = (transcript) => {
    let analysis = compendium.analyse(transcript, null, [
      "entities",
      "negation",
      "type",
      "numeric"
    ]);

    const sentiment = analysis[0].profile.label;
    setUserFeedback(sentiment);
  };

  const resetFeedback = () => {
    setUserFeedback("");
  };

  return (
    <div className="Landing" data-user-feedback={userFeedback}>
      {/* <Locale />   */}
      {!userFeedback && <AnimatedMic updateUserFeedback={updateUserFeedback} playAudio={playAudio} stopAudio={stopAudio} />}
      {userFeedback && (
        <FeedBack userFeedback={userFeedback} resetFeedback={resetFeedback} />
      )}
    </div>
  );
};

export default Landing;
