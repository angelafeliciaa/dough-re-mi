import React from 'react';
import raceCarImage from '../../assets/characters/racecar.png'; // Update the path to your image file

const Car = ({ position }) => {
  return (
    <div className="car-container" style={{ left: `${position}px` }}>
      <img src={raceCarImage} alt="Race Car" className="car-image" />
    </div>
  );
};

export default Car;
