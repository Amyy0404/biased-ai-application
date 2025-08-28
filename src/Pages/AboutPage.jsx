import React, { useEffect } from "react";
import "../Styles/AboutPage.css";

const AboutPage = () => {
  useEffect(() => {
    document.body.className = "about-body"; 
    return () => {
      document.body.className = ""; 
    };
  }, []);

  return (
    <div>
      <h1 className="about-title">About Page</h1>
      <p className="about-text">Welcome to the About Page.</p>
    </div>
  );
};

export default AboutPage;
