import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import trackImage from "../../assets/pastryicons/racetrack.png";
import Car from "./car.js";
import Car2 from "./car2.js";
import Snail from "./snail.js";
import Fish from "./fish.js";
import "./game.css";

const Graphic = ({ realtimeScore, player1Score, player2Score }) => {
  // Dynamic character and message based on score
  const [character, setCharacter] = useState("snail");
  const [text, setText] = useState("Good job!");

  // Initial positions remain fixed
  const initialCar1Position = 20;
  const initialCar2Position = -40;
  const maxPosition = 1000;

  // Car movement state
  const [car1Position, setCar1Position] = useState(initialCar1Position);
  const [car2Position, setCar2Position] = useState(initialCar2Position);

  // Update character and message based on `realtimeScore`
  useEffect(() => {
    let randomText = "";

    if (player1Score > 30 || player2Score > 30) {
      setCharacter("snail");
      randomText = ["Amazing!", "Ok Sabrina!!", "Singer of the year!"][
        Math.floor(Math.random() * 3)
      ];
    } else if (player1Score > 20 || player2Score > 20) {
      setCharacter("snail");
      randomText = ["Amazing!", "Ok Sabrina!!", "Singer of the year!"][
        Math.floor(Math.random() * 3)
      ];
    } else {
      setCharacter("fish");
      randomText = [
        "Are you even singing the right song?",
        "Ummm... I would reevaluate a singing career",
        "Good try...",
      ][Math.floor(Math.random() * 3)];
    }

    setText(randomText);
  }, [player1Score, player2Score]);

  // Move cars based on scores
  useEffect(() => {
    setCar1Position(Math.min(initialCar1Position + player1Score * 15, maxPosition));
    setCar2Position(Math.min(initialCar2Position + player2Score * 15, maxPosition));
  }, [player1Score, player2Score]);

  return (
    <div className="game-container">
      <img src={trackImage} alt="Track" className="center-image" />

      {/* Animate Car 1 movement */}
      <motion.div
        animate={{ x: car1Position }}
        transition={{ type: "tween", duration: 1 }}
        className="car-container"
        style={{ position: "absolute", left: initialCar1Position }}
      >
        <Car />
      </motion.div>

      {/* Animate Car 2 movement */}
      <motion.div
        animate={{ x: car2Position }}
        transition={{ type: "tween", duration: 1 }}
        className="car-container"
        style={{ position: "absolute", left: initialCar2Position }}
      >
        <Car2 />
      </motion.div>

      {/* Display character reaction */}
      <div className="character-container">
        {character === "snail" ? <Snail /> : <Fish />}
        <div className="text-bubble">{text}</div>
      </div>
    </div>
  );
};

export default Graphic;
