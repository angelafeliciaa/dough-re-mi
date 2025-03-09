import { useEffect, useRef } from "react";
import '../pages/track/game.css'
import './AudioPlayer.css'
const AudioPlayer = ({ onTimeUpdate }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            onTimeUpdate(audio.currentTime);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
    }, [onTimeUpdate]);

    return (
        <div className="game-container">
            <audio ref={audioRef} src="/songs/espresso/clip-instrumental.mp3" />
            <button className="record-button" onClick={() => audioRef.current.play()}>Start Karaoke</button>
        </div>
    );
};

export default AudioPlayer;