import "../styles/Intro.css";
import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import { INTRO_DURATION } from "../constants";

const Intro = ({ closeIntro, playAudio }) => {
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
  };

  const typeOut = (typewriter) => {
    playAudio();
    setTimeout(() => {
      sessionStorage.setItem("intro-done", "1");
      closeIntro();
    }, INTRO_DURATION);

    typewriter
      .changeDeleteSpeed(50)
      .typeString("Hi ,")
      .pauseFor(500)
      .deleteAll()
      .typeString("Let's make you sound more impressive.")
      .deleteAll()
      .pauseFor(250)
      .typeString("Try it.")
      .start();
  };

  return (
    <div className="intro-container">
      {!started && (
        <div className="start-intro-btn" onClick={start}>
          Let's Begin
        </div>
      )}
      {started && (
        <div>
          <Typewriter onInit={typeOut} />
        </div>
      )}

      {started && (
        <div className="music-attribution">
          <p>Music by Bensound.com/free-music-for-videos</p>
          <p>License code: MWP1GJNIFJP7CSE6</p>
        </div>
      )}
      <div className="gif-attribution">
        GIF by{" "}
        <a href="https://pixabay.com/users/susan-lu4esm-7009216/?utm_source=link-attribution&utm_medium=referral&utm_campaign=animation&utm_content=6839">
          Susan Cipriano
        </a>{" "}
        from{" "}
        <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=animation&utm_content=6839">
          Pixabay
        </a>
      </div>
    </div>
  );
};

export default Intro;
