import React, { useState, useEffect } from "react";
import "./start.css";
import bread from "../../assets/pastryicons/bread.png";
import tart from "../../assets/pastryicons/pie.png";
import cookies from "../../assets/pastryicons/cookies.png";
import pancakes from "../../assets/pastryicons/pancake.png";
import donut from "../../assets/pastryicons/donut.png";
import pretzel from "../../assets/pastryicons/pretzel.png";
import cake from "../../assets/pastryicons/cake.png";
import cinnamonRoll from "../../assets/pastryicons/cinnamon.png";
import cdIcon from "../../assets/pastryicons/cd.png";
import trophyIcon from "../../assets/pastryicons/trophy.png";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const [started, setStarted] = useState(false);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const items = [
    { src: bread, alt: "Bread" },
    { src: tart, alt: "Tart" },
    { src: cookies, alt: "Cookies" },
    { src: pancakes, alt: "Pancakes" },
    { src: donut, alt: "Donut" },
    { src: pretzel, alt: "Pretzel" },
    { src: cake, alt: "Cake" },
    { src: cinnamonRoll, alt: "Cinnamon Roll" },
  ];

  const handleGameSubmit = (e) => {
    e.preventDefault();
    if (name1 && name2) {
      localStorage.setItem("playerName1", name1);
      localStorage.setItem("playerName2", name2);
      navigate("/game");
    } else {
      alert("Please enter your name before starting!");
    }
  };

  const handleStartClick = () => {
    setStarted(true);
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard"); // Navigates to leaderboard page
  };

  const handleName1Change = (e) => {
    setName1(e.target.value); // Update name as user types
  };

  const handleName2Change = (e) => {
    setName2(e.target.value); // Update name as user types
  };

  return (
    <div className="game-container">
      <div className="bakery-items top-items">
        {items.slice(0, 4).map((item, index) => (
          <img
            key={index}
            src={item.src || "/placeholder.svg"}
            alt={item.alt}
            className="bakery-item"
          />
        ))}
      </div>

      <div className="title-container">
        {!started ? (
          <>
            <h1 className="game-title">Dough-Re-Mi</h1>
            <div className="start-button" onClick={handleStartClick}>
              <span>Start</span>
              <img src={cdIcon || "/placeholder.svg"} alt="CD Icon" className="cd-icon" />
            </div>
            <div className="leaderboard-button" onClick={handleLeaderboardClick}>
              <span>Leaderboard</span>
              <img src={trophyIcon || "/placeholder.svg"} alt="Trophy Icon" className="cd-icon" />
            </div>
          </>
        ) : (
          <div className="name-entry-container">
            <h2>Please enter your name:</h2>
            <form onSubmit={handleGameSubmit} className="name-form">
              <input
                type="text"
                value={name1}
                onChange={handleName1Change}
                placeholder="Enter your name"
                className="name-input"
              />
              <input
                type="text"
                value={name2}
                onChange={handleName2Change}
                placeholder="Enter your name"
                className="name-input"
              />
              <button type="submit" className="start-button">
                Start Singing
                <img src={cdIcon} alt="cd" className="bakery-item" />
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="bakery-items bottom-items">
        {items.slice(4).map((item, index) => (
          <img
            key={index}
            src={item.src || "/placeholder.svg"}
            alt={item.alt}
            className="bakery-item"
          />
        ))}
      </div>
    </div>
  );
}

export default Start;
