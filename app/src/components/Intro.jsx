import React from "react";
import Typewriter from "typewriter-effect";

const Intro = () => {
  return (
    <Typewriter
      onInit={(typewriter) => {
        typewriter
          .changeDeleteSpeed(50)
          .typeString("Hi ,")
          .pauseFor(500)
          .deleteAll()
          .typeString("Let's help you sound more impressive.")
          .deleteAll()
          .pauseFor(250)
          .typeString("Try it.")
          .start();
      }}
    />
  );
};

export default Intro;
