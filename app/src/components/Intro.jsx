import "../styles/Intro.css";
import React, { useState, useEffect, useCallback } from "react";
import Typewriter from "typewriter-effect";
import { INTRO_DURATION } from "../constants";

const Intro = ({ closeIntro, playAudio }) => {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const start = () => {
    setStarted(true);
  };

  const skipIntro = useCallback(() => {
    sessionStorage.setItem("intro-done", "1");
    closeIntro();
  }, [closeIntro]);

  const typeOut = (typewriter) => {
    playAudio();
    
    // Show skip option after 3 seconds
    setTimeout(() => setShowSkip(true), 3000);
    
    // Progress tracking
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (INTRO_DURATION / 100));
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(progressInterval);
      sessionStorage.setItem("intro-done", "1");
      closeIntro();
    }, INTRO_DURATION);

    typewriter
      .changeDeleteSpeed(30)
      .typeString("Hi there! 👋")
      .pauseFor(800)
      .deleteAll()
      .typeString("Let's make you sound more impressive.")
      .pauseFor(1000)
      .deleteAll()
      .pauseFor(300)
      .typeString("Ready to try? 🎤")
      .pauseFor(500)
      .deleteAll()
      .pauseFor(200)
      .typeString("Let's begin!")
      .start();
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !started) {
        start();
      } else if (e.key === 'Escape' && started) {
        skipIntro();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [started, skipIntro]);

  return (
    <div className="intro-container">
      {!started && (
        <div className="intro-start-section">
          <div className="intro-title">
            <h1>Welcome to Impression</h1>
            <p>Transform your voice into something extraordinary</p>
          </div>
          <button 
            className="start-intro-btn" 
            onClick={start}
            onKeyDown={(e) => e.key === 'Enter' && start()}
            tabIndex={0}
            aria-label="Start the introduction"
          >
            <span className="btn-text">Let's Begin</span>
            <span className="btn-icon">→</span>
          </button>
          <div className="keyboard-hint">
            Press <kbd>Enter</kbd> to start
          </div>
        </div>
      )}
      
      {started && (
        <div className="intro-content">
          <div className="typewriter-container">
            <Typewriter onInit={typeOut} />
          </div>
          
          {showSkip && (
            <button 
              className="skip-btn" 
              onClick={skipIntro}
              onKeyDown={(e) => e.key === 'Enter' && skipIntro()}
              tabIndex={0}
              aria-label="Skip introduction"
            >
              Skip Intro
            </button>
          )}
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {Math.round(progress)}% complete
            </div>
          </div>
        </div>
      )}

      <div className="attributions">
        {started && (
          <div className="music-attribution">
            <p>Music by Bensound.com/free-music-for-videos</p>
            <p>License code: MWP1GJNIFJP7CSE6</p>
          </div>
        )}
        <div className="gif-attribution">
          GIF by{" "}
          <a 
            href="https://pixabay.com/users/susan-lu4esm-7009216/?utm_source=link-attribution&utm_medium=referral&utm_campaign=animation&utm_content=6839"
            target="_blank"
            rel="noopener noreferrer"
          >
            Susan Cipriano
          </a>{" "}
          from{" "}
          <a 
            href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=animation&utm_content=6839"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pixabay
          </a>
        </div>
      </div>
    </div>
  );
};

export default Intro;
