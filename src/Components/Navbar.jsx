import React from "react";
import { NavLink } from "react-router-dom";
import "../Styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink 
        to="/" 
        end
        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
      >
        Home
      </NavLink>
      <NavLink 
        to="/about" 
        className={({ isActive }) => isActive ? "nav-link active" : "nav-link faded"}
      >
        About
      </NavLink>
    </nav>
  );
};

export default Navbar;

