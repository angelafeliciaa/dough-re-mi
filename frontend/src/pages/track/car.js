import React from 'react';
import raceCarImage from '../../assets/characters/racecar.png'; // Update the path to your image file

const Car = () => {
  return (
    <div className="car-container">
      <img src={raceCarImage} alt="Race Car" className="car-image" />
    </div>
  );
};

export default Car;
