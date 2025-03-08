const fs = require("fs");
const { LYRICS_FILE } = require("./config");

let lyrics = [];

function parseLRC() {
    const rawLyrics = fs.readFileSync(LYRICS_FILE, "utf8").split("\n");
    lyrics = rawLyrics.map((line) => {
        const match = line.match(/\[(\d+):(\d+\.\d+)](.*)/);
        if (!match) return null;
        const minutes = parseInt(match[1]);
        const seconds = parseFloat(match[2]);
        const timestamp = minutes * 60 + seconds;
        return { timestamp, text: match[3].trim() };
    }).filter(Boolean);
}

function getLyrics() {
    return lyrics;
}

parseLRC();

module.exports = { getLyrics };
