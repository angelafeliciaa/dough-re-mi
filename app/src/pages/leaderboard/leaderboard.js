import React, { useState, useEffect } from 'react';
import './leaderboard.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import flagImage from "../../assets/pastryicons/flags.png"; 
import cdIcon from "../../assets/pastryicons/cd.png";

const Leaderboard = () => {
  // Function to get leaderboard from localStorage or use initial data if not found
  const getLeaderboard = () => {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    if (leaderboard) { leaderboard.sort((a, b) => b.score - a.score); }
    return leaderboard;

    
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState(getLeaderboard()); // Initialize with the leaderboard from localStorage or default data

  const itemsPerPage = 4;
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);

  const currentItems = leaderboardData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const navigate = useNavigate(); 

  const handleStartOver = () => {

    navigate('/'); 
  };

  const handlePlayAgain= () => {

    navigate('/game'); 
  };

  return (
    <div className="leaderboard-container">

      <div className="header">
        <div className="flags">
          <div className="flag">
            <img
              src={flagImage}  
              alt="Flag"
              className="flag-image"
            />
          </div>
          <h1 className="title">Leaderboard</h1>
        </div>
      </div>

      {/* Leaderboard Entries */}
      <div className="entries">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div key={item.id} className="entry">
              <span className="rank">{item.id}</span>
              <span className="name">{item.name}</span>
              <span className="score">{item.score}</span>
            </div>
          ))
        ) : (
          <div className="no-items">No items to display</div>
        )}
      </div>


      {/* Navigation */}
      <div className="navigation">
        {/* Start Over button to navigate to start.js */}
        <div className="start-over-button" onClick={handleStartOver}>
          <span>Start Over</span>
          <img src={cdIcon || "/placeholder.svg"} alt="CD Icon" className="cd-icon" />
        </div>


        <div className="play-again-button" onClick={handlePlayAgain}>
          <span>Play Again</span>
          <img src={cdIcon || "/placeholder.svg"} alt="CD Icon" className="cd-icon" />
        </div>


      </div>
    </div>
  );
};

export default Leaderboard;
