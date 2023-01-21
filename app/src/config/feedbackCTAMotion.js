export const feedbackCTAMotionConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    default: {
      duration: 1,
      ease: [0, 0.3, 0.7, 1]
    },
    scale: {
      type: "spring",
      damping: 5,
      stiffness: 100,
      restDelta: 0.001
    }
  }
};
