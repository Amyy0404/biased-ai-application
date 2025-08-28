import React, { useEffect } from "react";
import "../Styles/MainPage.css";

const MainPage = () => {
  useEffect(() => {
    document.body.className = "main-body"; 
    return () => {
      document.body.className = ""; 
    };
  }, []);

  return (
    <div>
      <h1 className="main-title">Main Page</h1>
      <p className="main-text">Welcome to the Main Page.</p>
    </div>
  );
};

export default MainPage;