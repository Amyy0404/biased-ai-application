import React, { useEffect } from "react";
import "../Styles/ModePage.css";

const ModePage = () => {
  useEffect(() => {
    document.body.className = "mode-body"; 
    return () => {
      document.body.className = ""; 
    };
  }, []);

  return (
    <div>
      <h1 className="mode-title">Mode Page</h1>
      <p className="mode-text">Welcome to the Mode Page.</p>
    </div>
  );
};

export default ModePage;