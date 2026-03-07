"use client";

import { useState } from "react";
import Intro from "@/components/Intro";
import Landing from "@/components/Landing";
import Progress from "@/components/Progress";
import ThemePicker from "@/components/ThemePicker";
import LanguageSelector from "@/components/LanguageSelector";
import InstallPrompt from "@/components/InstallPrompt";
import OfflineIndicator from "@/components/OfflineIndicator";
import ErrorBoundary from "@/components/ErrorBoundary";
import UserMenu from "@/components/UserMenu";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSiteAudio } from "@/hooks/useSiteAudio";

function MainApp() {
  const fetchIntroStatus = () => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("intro-done") ? false : true;
    }
    return false;
  };

  const [showIntro, setShowIntro] = useState(fetchIntroStatus());
  const [showProgress, setShowProgress] = useState(false);

  const handleCloseIntro = () => {
    setShowIntro(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("intro-done", "true");
    }
  };

  const { handlePlayAudio, handleStopAudio } = useSiteAudio();

  return (
    <div className="App">
      <OfflineIndicator />
      <UserMenu />
      {!showIntro && <LanguageSelector />}
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

export default function Home() {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <MainApp />
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
