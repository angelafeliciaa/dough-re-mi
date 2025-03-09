// import React, { useState, useEffect } from 'react';
// import trackImage from '../../assets/pastryicons/racetrack.png';
// import Car from './car.js'; 
// import Car2 from './car2.js';
// import Snail from './snail.js';
// import Fish from './fish.js';
// import './game.css';

// const Game = () => {
//   const [character, setCharacter] = useState("snail");
//   const [text, setText] = useState("Good job!");

//   // Starting positions of the cars
//   const initialCar1Position = 380;
//   const initialCar2Position = 270;

//   // Maximum position the cars can reach
//   const maxPosition = 1000; // Adjust this value based on the width of your screen or game area

//   // Track the position of the cars
//   const [car1Position, setCar1Position] = useState(initialCar1Position);
//   const [car2Position, setCar2Position] = useState(initialCar2Position);

//   // Change character and text every 15 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (character === "snail") {
//         setCharacter("fish");
//         setText("That's bad");
//       } else {
//         setCharacter("snail");
//         setText("Good job!");
//       }
//     }, 15000); // 15000 milliseconds = 15 seconds

//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, [character]);

//   // Handle keydown events to move cars
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "d" && car1Position < maxPosition) {
//         setCar1Position((prevPosition) => prevPosition + 10); // Increment Car 1 position by 10 units
//       } else if (event.key === "a" && car2Position < maxPosition) {
//         setCar2Position((prevPosition) => prevPosition + 10); // Increment Car 2 position by 10 units
//       }
//     };

//     // Add event listener for keydown events
//     window.addEventListener("keydown", handleKeyDown);

//     // Cleanup the event listener on component unmount
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [car1Position, car2Position]); // Add positions to dependencies to check the current state

//   return (
//     <div className="game-container">
//       <img src={trackImage} alt="Track" className="center-image" />
      
//       {/* Render the cars at their respective positions */}
//       <Car position={car1Position} />
//       <Car2 position={car2Position} />

//       {/* Show either Snail or Fish depending on the character state */}
//       {character === "snail" ? (
//         <div className="character-container">
//           <Snail />
//           <div className="text-bubble">{text}</div>
//         </div>
//       ) : (
//         <div className="character-container">
//           <Fish />
//           <div className="text-bubble">{text}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Game;

