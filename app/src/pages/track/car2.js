import React from 'react';
import raceCarImage from '../../assets/characters/car2.png'; // Update the path to your image file

const Car2 = ({ position }) => {
  return (
    <div className="car-container1" style={{ left: `${position}px` }}>
      <img src={raceCarImage} alt="Race Car" className="car-image" />
    </div>
  );
};

export default Car2;
