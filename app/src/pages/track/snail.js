import React from 'react';
import snailImage from '../../assets/characters/snail.png';

const Snail = () => {
  return (
    <div className="character-container">
      <img src={snailImage} alt="Snail" className="character-image" />
      <div className="text-bubble">Good job!</div>
    </div>
  );
};

export default Snail;
