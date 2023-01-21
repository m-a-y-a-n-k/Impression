import "../styles/index.css";
import { useEffect, useState } from "react";
import Intro from "./Intro";
import { INTRO_DURATION } from "../constants";
import Landing from "./Landing";

export default function App() {
  const fetchIntroStatus = () =>
    sessionStorage.getItem("intro-done") ? false : true;

  const [showIntro, setShowIntro] = useState(fetchIntroStatus);

  useEffect(() => {
    setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("intro-done", "1");
    }, INTRO_DURATION);
  }, []);

  return (
    <div className="App">
      {showIntro && <Intro />}
      {!showIntro && <Landing />}
    </div>
  );
}
