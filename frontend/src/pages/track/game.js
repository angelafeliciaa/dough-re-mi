import React from 'react';
import trackImage from '../../assets/pastryicons/racetrack.png';
import Car from '/Users/amycao/Desktop/dough-re-mi/frontend/src/pages/track/car.js'; 
import Car2 from '/Users/amycao/Desktop/dough-re-mi/frontend/src/pages/track/car2.js';
import "./game.css";

const Game = () => {
  return (
    <div className="game-container">
      <img src={trackImage} alt="Track" className="center-image" />
      <Car />
      <Car2 />
    </div>
  );
};

export default Game;
