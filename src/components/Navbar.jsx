import React from "react";
import "../styles/navbar.css";

function Navbar() {
  return (
    <>
      <nav className="nav">
        <a href="/" className="title">
          Interview Scheduler
        </a>
        <ul className="nav-links">
          <li className="active">
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/schedule">Schedule Interview</a>
          </li>

          <li>
            <a href="/edit">Edit Interview</a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
