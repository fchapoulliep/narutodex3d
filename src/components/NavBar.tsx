/**
 * Importing React and the NavBar CSS.
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

/**
 * NavBar component renders the navigation bar for the NarutoDex 3D application.
 * It includes links to the Home, About, and Contact pages.
 *
 * @component
 * @example
 * return (
 *   <NavBar />
 * )
 */
const NavBar: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav id="navbar">
      <div className="navbar-naruto">
        <Link to="/">Back to the NarutoDex</Link>
        <div className="navbar-time">{time}</div>
        <a
          href="https://fchapoulliep.github.io/portfolio/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Creator's portfolio
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
