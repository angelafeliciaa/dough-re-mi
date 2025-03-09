import React, { useState, useEffect } from 'react';
import trackImage from '../../assets/pastryicons/racetrack.png';
import Car from './car.js'; 
import Car2 from './car2.js';
import Snail from './snail.js';
import Fish from './fish.js';
import './game.css';

const Graphic = ({ realtimeScore, player1Score, player2Score }) => {
  // Dynamic character and message based on score
  const [character, setCharacter] = useState("snail");
  const [text, setText] = useState("Good job!");

  // Initial positions of the cars
  const initialCar1Position = 110;
  const initialCar2Position = 10;
  const maxPosition = 1000; // Max track length

  // Car movement based on score
  const [car1Position, setCar1Position] = useState(initialCar1Position);
  const [car2Position, setCar2Position] = useState(initialCar2Position);

  // Update character and message based on `realtimeScore`
  useEffect(() => {
    if (player1Score || player2Score > 30) {
      setCharacter("snail");
      setText("🔥 Amazing performance!");
    } else if (player1Score || player2Score > 20) {
      setCharacter("snail");
      setText("👍 Good job!");
    } else {
      setCharacter("fish");
      setText("😐 Keep practicing!");
    }
  }, [player1Score, player2Score]);

  // Move cars based on scores
  useEffect(() => {
    const newCar1Position = initialCar1Position + player1Score * 15;
    const newCar2Position = initialCar2Position + player2Score * 15;

    setCar1Position(Math.min(newCar1Position, maxPosition));
    setCar2Position(Math.min(newCar2Position, maxPosition));
  }, [player1Score, player2Score]);

  return (
    <div className="game-container">
      <img src={trackImage} alt="Track" className="center-image" />

      {/* Render cars based on their score-driven positions */}
      <Car position={car1Position} />
      <Car2 position={car2Position} />

      {/* Display character reaction */}
      <div className="character-container">
        {character === "snail" ? <Snail /> : <Fish />}
        <div className="text-bubble">{text}</div>
      </div>
    </div>
  );
};

export default Graphic;
