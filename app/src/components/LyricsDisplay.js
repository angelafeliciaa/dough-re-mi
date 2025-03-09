const LyricsDisplay = ({ lyrics, currentTime }) => {
    if (!lyrics || lyrics.length === 0) return <p>Loading lyrics...</p>;

    return (
        <div style={{ textAlign: "center", fontSize: "30px", fontWeight: "bold" }}>
            {lyrics.map((line, index) => {
                const isActive = currentTime >= line.startTime && currentTime <= line.endTime;
                const isPlayerA = index % 2 === 0; // Player A sings even lines
                const color = isActive ? "#d666e3" : isPlayerA ? "#ff87c3" : "#7cb2f2";

                return (
                    <p key={index} style={{ color: color, transition: "color 0.3s ease-in-out" }}>
                        {line.text}
                    </p>
                );
            })}
        </div>
    );
};

export default LyricsDisplay;
