// HomePage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomePageIcon from "../Images/HomePageIcon.png";
import "../Styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = "home-body";
    return () => {
      document.body.className = "";
    };
  }, []);

  const handleStartExperience = () => {
    navigate("/mode");
  };

  const handleLearnMore = () => {
    navigate("/about");
  };

  return (
    <div className="home-container">
      {/* Left side with mission content */}
      <div className="left-section">
        <div className="icon-circle">
          <img src={HomePageIcon} alt="Mission Icon" className="mission-icon" />
        </div>
        <h2 className="mission-heading">my <br></br> mission.</h2>
        <p className="mission-text">
          This project challenges the idea that Generative AI is neutral or inclusive. By
          highlighting how AI tools can overlook or misrepresent disabled and neurodiverse
          learners, we aim to promote more critical, equitable, and reflective uses of AI in
          education.
        </p>
      </div>

      {/* Right side with interactive elements */}
      <div className="right-section">
        <div className="aesthetic-lines">
          <span>//</span>
          <span>//</span>
          <span>//</span>
        </div>
        
        <div className="ai-text-container">
          <div className="inclusive-text">inclusive ai learning tool</div>
          <div className="parenthesis">)</div>
          
          <div className="question-text">
            "What does AI<br />
            miss when you<br />
            learn?"
          </div>
          
          <div className="parenthesis">))</div>
        </div>
        
        <div className="button-container">
          <button className="start-experience-btn" onClick={handleStartExperience}>
            [START EXPERIENCE]
          </button>
          <button className="learn-more-btn" onClick={handleLearnMore}>
            [LEARN MORE]
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
