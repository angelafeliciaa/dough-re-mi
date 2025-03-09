import React, { useState, useEffect } from 'react';
import './leaderboard.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import flagImage from "../../assets/pastryicons/flags.png"; 
import cdIcon from "../../assets/pastryicons/cd.png";

const Leaderboard = () => {
  // Function to get leaderboard from localStorage or use initial data if not found
  const getLeaderboard = () => {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard || [
      { id: 1, name: 'Ayesha', score: 140 },
      { id: 2, name: 'Amy', score: 100 },
      { id: 3, name: 'Angela', score: 96 },
      { id: 4, name: 'Prajna', score: 69 },
      { id: 5, name: 'Sarah', score: 65 },
      { id: 6, name: 'Tina', score: 58 },
      { id: 7, name: 'Zoe', score: 52 },
      { id: 8, name: 'Mia', score: 45 },
    ];

    
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
        {currentItems.map((item) => (
          <div key={item.id} className="entry">
            <span className="rank">{item.id}</span>
            <span className="name">{item.name}</span>
            <span className="score">{item.score}</span>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="navigation">
        {/* Start Over button to navigate to start.js */}
        <div className="start-over-button" onClick={handleStartOver}>
          <span>Start Over</span>
          <img src={cdIcon || "/placeholder.svg"} alt="CD Icon" className="cd-icon" />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
