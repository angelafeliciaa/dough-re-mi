import React from 'react';
import fishImage from '../../assets/characters/fish.png';

const Fish = () => {
  return (
    <div className="character-container">
      <img src={fishImage} alt="Fish" className="character-image" />
      <div className="text-bubble">That's bad!</div>
    </div>
  );
};

export default Fish;
