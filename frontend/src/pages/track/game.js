import React, { useState, useEffect } from 'react';
import trackImage from '../../assets/pastryicons/racetrack.png';
import Car from './car.js'; 
import Car2 from './car2.js';
import Snail from './snail.js';
import Fish from './fish.js';
import './game.css';

const Game = () => {
  const [character, setCharacter] = useState("snail");
  const [text, setText] = useState("Good job!");

  // Change character and text every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (character === "snail") {
        setCharacter("fish");
        setText("That's bad");
      } else {
        setCharacter("snail");
        setText("Good job!");
      }
    }, 15000); // 15000 milliseconds = 15 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [character]);

  return (
    <div className="game-container">
      <img src={trackImage} alt="Track" className="center-image" />
      <Car />
      <Car2 />

      {/* Show either Snail or Fish depending on the character state */}
      {character === "snail" ? (
        <div className="character-container">
          <Snail />
          <div className="text-bubble">{text}</div>
        </div>
      ) : (
        <div className="character-container">
          <Fish />
          <div className="text-bubble">{text}</div>
        </div>
      )}
    </div>
  );
};

export default Game;
