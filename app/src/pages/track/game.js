import React, { useState, useEffect } from 'react';
import PlayerRecorder from '../../PlayerRecorder';
import "./game.css"
import Karaoke from '../../components/Karaoke';
import Graphic from './graphic'

const Game = () => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, results
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [songData, setSongData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  // Store microphone stream globally to reuse between players
  const [microphoneStream, setMicrophoneStream] = useState(null);
  const [realtimeScore, setRealtimeScore] = useState(0);


  const [player1Name, setPlayer1Name] = useState(localStorage.getItem('playerName1') || 'Player 1');
  const [player2Name, setPlayer2Name] = useState(localStorage.getItem('playerName2') || 'Player 2');
  
  // trying
  // Load song data on component mount
  useEffect(() => {
    const loadSongData = async () => {
      try {
        // In a real app, this would be a fetch call to load song data
        const response = await fetch('/songs/espresso/clip-lyrics-data.json');
        const data = await response.json();
        setSongData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading song data:', error);
        // Fallback to sample data for testing
        setSongData({
          title: "Test Song",
          artist: "Test Artist",
          vocalsUrl: "/songs/test-vocals.mp3",
          instrumentalIntro: 0, // Default to 0 if not specified
          lyrics: [
            {
              text: "This is the first line of the song",
              startTime: 0,
              endTime: 5,
              duration: 5
            },
            {
              text: "This is the second line of the song",
              startTime: 6,
              endTime: 11,
              duration: 5
            }
          ]
        });
        setIsLoading(false);
      }
    };

    loadSongData();
    
    // Clean up any audio on unmount
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
      // Clean up the microphone stream when the component unmounts
      if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Request microphone access when the game starts
  const initializeMicrophone = async () => {
    if (!microphoneStream) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicrophoneStream(stream);
        return stream;
      } catch (error) {
        console.error('Error accessing microphone:', error);
        return null;
      }
    }
    return microphoneStream;
  };

  // Play the current line's audio section
  const playCurrentLineAudio = () => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }
    
    // Create new audio element
    const audio = new Audio(songData.vocalsUrl);
    setCurrentAudio(audio);
    
    // Get current line timing
    const currentLine = songData.lyrics[currentLineIndex];
    
    // Set time to the start of this line
    audio.currentTime = currentLine.startTime;
    
    // Play the audio
    audio.play();
    
    // Stop when the line is finished
    setTimeout(() => {
      audio.pause();
    }, currentLine.duration * 1000);
  };

  // Handle realtime score updates
  const handleRealtimeScoreUpdate = (score) => {
    setRealtimeScore(score);
  };

  // Handle score calculation for the current player
  const handleScoreCalculated = (score) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
    }
    
    // Update the score for the current player
    if (currentPlayer === 1) {
      setPlayer1Score(prevScore => prevScore + score);
    } else {
      setPlayer2Score(prevScore => prevScore + score - 16);
    }

    // Move to next line or end game
    if (currentLineIndex >= songData.lyrics.length - 1) {
      // Game is over
      setGameState('results');
    } else {
      // Move to next line and switch players immediately without delay
      setCurrentLineIndex(prevIndex => prevIndex + 1);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
    
    // Reset realtime score for the new player
    // setRealtimeScore(0);
  };

  // Automatically initialize game when component mounts
  useEffect(() => {
    const initializeGame = async () => {
      // Initialize microphone
      await initializeMicrophone();
      // Start the game
      setGameState('playing');
      setCurrentPlayer(1);
      setCurrentLineIndex(0);
      setPlayer1Score(0);
      setPlayer2Score(0);
    };

    // Run the game initialization
    initializeGame();
  }, []);

  // Get current player name
  const getCurrentPlayerName = () => {
    return currentPlayer === 1 ? player1Name : player2Name;
  };

  if (isLoading) {
    return <div className="loading">Loading song data...</div>;
  }

  return (
    <div className="game-container-outer">
          <div className="">
          <Graphic 
             realtimeScore={realtimeScore} 
             player1Score={player1Score} 
             player2Score={player2Score} 
           />
            <div className="game-info">
              <div className="player-scores">
                <div className={`player-score ${currentPlayer === 1 ? 'active' : ''}`}>
                  {player1Name} : {player1Score}
                </div>
                <div className={`player-score ${currentPlayer === 2 ? 'active' : ''}`}>
                  {player2Name} : {player2Score}
                </div>
              </div>
            </div>
            
            <PlayerRecorder
              key={`player-${currentPlayer}-line-${currentLineIndex}`}
              playerName={getCurrentPlayerName()} // Use the current player's actual name
              lineText={songData.lyrics[currentLineIndex].text}
              originalVocalsUrl={songData.vocalsUrl}
              lineDuration={songData.lyrics[currentLineIndex].duration || 
                          (songData.lyrics[currentLineIndex].endTime - 
                           songData.lyrics[currentLineIndex].startTime)}
              onScoreCalculated={handleScoreCalculated}
              onRealtimeScoreUpdate={handleRealtimeScoreUpdate}
              microphoneStream={microphoneStream}
              autoStart={currentLineIndex > 0} // Auto-start for all lines except the first
            />
          </div>

          <Karaoke />

        {gameState === 'results' && (
          <div className="results-screen">
            <h2>Game Over!</h2>
            
            <div className="final-scores">
              <div className="final-score">
                <h3>{player1Name}</h3>
                <div className="score">{player1Score}</div>
              </div>
              
              <div className="final-score">
                <h3>{player2Name}</h3>
                <div className="score">{player2Score}</div>
              </div>
            </div>
            
            <div className="winner-announcement">
              {player1Score > player2Score
                ? `${player1Name} wins!`
                : player2Score > player1Score
                  ? `${player2Name} wins!`
                  : "It's a tie!"}
            </div>
            
          </div>
        )}
    </div>
  
  );
};

export default Game;


