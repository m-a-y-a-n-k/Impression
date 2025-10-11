import "../styles/App.css";
import { useState } from "react";
import Intro from "./Intro";
import Landing from "./Landing";
import { useSiteAudio } from "../hooks/useSiteAudio";

export default function App() {
  const fetchIntroStatus = () =>
    sessionStorage.getItem("intro-done") ? false : true;

  const [showIntro, setShowIntro] = useState(fetchIntroStatus);

  const handleCloseIntro = () => {
    setShowIntro(false);
  };

  const { handlePlayAudio, handleStopAudio } = useSiteAudio();

  return (
    <div className="App">
      {showIntro && (
        <Intro closeIntro={handleCloseIntro} playAudio={handlePlayAudio} />
      )}
      {!showIntro && (
        <Landing playAudio={handlePlayAudio} stopAudio={handleStopAudio} />
      )}
    </div>
  );
}
