import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage.jsx";
import AboutPage from "./Pages/AboutPage.jsx";
import ModePage from "./Pages/ModePage.jsx";
import MainPage from "./Pages/MainPage.jsx";
import MainPageADHD from "./Pages/MainPageADHD.jsx";          
import MainPageDyslexia from "./Pages/MainPageDyslexia.jsx";  
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import "./Styles/global.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/mode" element={<ModePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/main-adhd" element={<MainPageADHD />} />          
        <Route path="/main-dyslexia" element={<MainPageDyslexia />} />   
        <Route path="/dashboard" element={<AdminDashboard />} /> 
      </Routes>
    </Router>
  );
};

export default App;
