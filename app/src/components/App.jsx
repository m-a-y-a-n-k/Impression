import "../styles/App.css";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Intro from "./Intro";
import Landing from "./Landing";
import Progress from "./Progress";
import ThemePicker from "./ThemePicker";
import LanguageSelector from "./LanguageSelector";
import InstallPrompt from "./InstallPrompt";
import OfflineIndicator from "./OfflineIndicator";
import ErrorBoundary from "./ErrorBoundary";
import UserMenu from "./UserMenu";
import Login from "./Login";
import Checkout from "./Checkout";
import { useSiteAudio } from "../hooks/useSiteAudio";
import { SubscriptionProvider } from "../contexts/SubscriptionContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function MainApp() {
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

function AppContent() {
  const { currentUser, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading Impression...</p>
      </div>
    );
  }

  // Show login if not authenticated
  if (!currentUser) {
    return <Login />;
  }

  // Show main app when authenticated with routing
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
