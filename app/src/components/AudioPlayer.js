import { useEffect, useRef, useState } from "react";
import "../pages/track/game.css";
import "./AudioPlayer.css";

const AudioPlayer = ({ onTimeUpdate }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false); // Track button click

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            onTimeUpdate(audio.currentTime);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
    }, [onTimeUpdate]);

    const handlePlay = () => {
        audioRef.current.play();
        setIsPlaying(true); // Hide button after click
    };

    return (
        <div className="game-container">
            <audio ref={audioRef} src="/songs/espresso/clip-instrumental.mp3" />
            {!isPlaying && ( // Hide button when isPlaying is true
                <button className="record-button" onClick={handlePlay}>
                    Start Karaoke
                </button>
            )}
        </div>
    );
};

export default AudioPlayer;
