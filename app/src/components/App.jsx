import "../styles/App.css";
import { useState } from "react";
import Intro from "./Intro";
import Landing from "./Landing";
import Progress from "./Progress";
import ThemePicker from "./ThemePicker";
import InstallPrompt from "./InstallPrompt";
import OfflineIndicator from "./OfflineIndicator";
import { useSiteAudio } from "../hooks/useSiteAudio";

export default function App() {
  const fetchIntroStatus = () =>
    sessionStorage.getItem("intro-done") ? false : true;

  const [showIntro, setShowIntro] = useState(fetchIntroStatus);
  const [showProgress, setShowProgress] = useState(false);

  const handleCloseIntro = () => {
    setShowIntro(false);
  };

  const { handlePlayAudio, handleStopAudio } = useSiteAudio();

  return (
    <div className="App">
      <OfflineIndicator />
      {!showIntro && <ThemePicker />}
      {!showIntro && <InstallPrompt />}
      {showIntro && (
        <Intro closeIntro={handleCloseIntro} playAudio={handlePlayAudio} />
      )}
      {!showIntro && (
        <>
          <Landing playAudio={handlePlayAudio} stopAudio={handleStopAudio} />
          <button
            className="progress-toggle-btn"
            onClick={() => setShowProgress(true)}
            aria-label="View progress"
            title="View your progress"
          >
            <span className="progress-btn-icon">📊</span>
          </button>
          <Progress isOpen={showProgress} onClose={() => setShowProgress(false)} />
        </>
      )}
    </div>
  );
}
