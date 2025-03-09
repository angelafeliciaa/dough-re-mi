import { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import LyricsDisplay from "./LyricsDisplay";

const Karaoke = () => {
    const [lyrics, setLyrics] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        console.log("Trying to fetch lyrics...");
        fetch("/songs/espresso/clip-lyrics-data.json")
            .then((res) => res.json())
            .then((data) => {
                console.log("Lyrics JSON loaded: ", data);
                setLyrics(data.lyrics);
            })
            .catch(error => console.error("Error loading lyrics: ", error));
    }, []);

    return (
        <div>
            <AudioPlayer onTimeUpdate={setCurrentTime} />
            <LyricsDisplay lyrics={lyrics} currentTime={currentTime} />
        </div>
    );
};

export default Karaoke;
