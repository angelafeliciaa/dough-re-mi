import { useEffect, useRef, useState } from "react";

const KaraokePlayer = () => {
    const [lyrics, setLyrics] = useState([]);
    const [currentLyric, setCurrentLyric] = useState("");
    const audioRef = useRef(null);

    useEffect(() => {
        fetch("./public/songs/espresso/clip-lyrics-data.json")
            .then((res) => res.json())
            .then((data) => {
                setLyrics(data.lyrics);
            });
    }, []);

    const startKaraoke = () => {
        if (audioRef.current) {
            audioRef.current.play();
            syncLyrics(audioRef.current);
        }
    };

    return (
        <div>
            <audio ref={audioRef} src="./public/songs/espresso/clip-instrumental.mp3" />
            <button onClick={startKaraoke}>Start Karaoke</button>
            <h2>{currentLyric}</h2>
        </div>
    );
};

export default KaraokePlayer;