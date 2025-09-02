import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/ModePage.css";

const ModePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = "mode-body"; 
    return () => {
      document.body.className = ""; 
    };
  }, []);

  const handleAnxiousStudent = () => {
    navigate("/main"); 
  };

  return (
    <div className="mode-page-container">

      <h1 className="mode-title">select <br></br> your learner mode</h1>

      <div className="mode-page-layer" aria-hidden="true">
      </div>

      <div className="mode-container">
        <button 
          className="anxious-student-btn"
          onClick={handleAnxiousStudent}
        >
          [anxious student]
        </button>
        <p className="mode-description">
          Click here to explore tips and tools for students who feel overwhelmed or anxious.
        </p>
      </div>
    </div>
  );
};

export default ModePage;
