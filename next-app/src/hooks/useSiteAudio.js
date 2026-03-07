import { useState } from "react";
const INTRO_AUDIO_FILE = "/assets/anewbeginning.mp3";

export const useSiteAudio = () => {
    const [audio] = useState(new Audio(INTRO_AUDIO_FILE));

    const handlePlayAudio = async () => {
        try {
            audio.loop = true;  // Enable looping
            await audio.play();
        } catch (audioError) {
            console.error("Audio Play Error", audioError);
        }
    };

    const handleStopAudio = () => {
        audio.pause();
        audio.currentTime = 0;
    }

    return { handlePlayAudio, handleStopAudio }
}