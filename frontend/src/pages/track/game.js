import React from 'react';
import trackImage from '../../assets/pastryicons/racetrack.png';
import "./game.css"

const Game = () => {
  return (
    <div className="game-container">
      <img src={trackImage} alt="Track Image" className="center-image" />
    </div>
  );
};

export default Game;
