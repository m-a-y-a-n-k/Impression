import React from "react";
import Typewriter from "typewriter-effect";

const Intro = () => {
  return (
    <Typewriter
      onInit={(typewriter) => {
        typewriter
          .typeString("Hi ,")
          .pauseFor(500)
          .deleteAll()
          .typeString("Let's help you sound impressive")
          .deleteAll()
          .pauseFor(250)
          .typeString("Try it out")
          .start();
      }}
    />
  );
};

export default Intro;
