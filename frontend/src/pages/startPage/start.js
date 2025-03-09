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


function Start() {
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");

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

  const handleGameSubmit = () => {
    
  }

  const handleStartClick = () => {
    setStarted(true); // Switch to name entry form
  };

  const handleNameChange = (e) => {
    setName(e.target.value); // Update name as user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      alert(`Welcome, ${name}! Let the singing begin!`);
    } else {
      alert("Please enter your name before starting!");
    }
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
            {/* Displaying Title and Start Button */}
            <h1 className="game-title">Dough-Re-Mi</h1>
            <div className="start-button" onClick={handleStartClick}>
              <span>Start</span>
              <img src={cdIcon || "/placeholder.svg"} alt="CD Icon" className="cd-icon" />
            </div>
          </>
        ) : (
          // Name Entry Form displayed after Start button click
          <div className="name-entry-container">
            <h2>Please enter your name:</h2>
            <form onSubmit={handleSubmit} className="name-form">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className="name-input"
                onSubmit={handleGameSubmit}
              />
              <button type="submit" className="start-button">
                Start Singing
                <img
            src={cdIcon}
            alt="cd"
            className="bakery-item"
          />
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
