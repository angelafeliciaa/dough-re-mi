const LyricsDisplay = ({ lyrics, currentTime }) => {
    return (
        <div>
            {lyrics.map((lyric, index) => (
                <p
                    key={index}
                    style={{
                        color: currentTime >= lyric.startTime && currentTime <= lyric.endTime ? "blue" : "purple",
                        fontSize: currentTime >= lyric.startTime && currentTime <= lyric.endTime ? "24px" : "18px",
                        transition: "color 0.3s ease-in-out",
                    }}
                >
                    {lyric.text}
                </p>
            ))}
        </div>
    );
};

export default LyricsDisplay;
