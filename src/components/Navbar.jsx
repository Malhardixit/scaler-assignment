import React from "react";
import "../styles/navbar.css";

function Navbar() {
  function CustomLink({ href, children, ...props }) {
    const path = window.location.pathname;
    return (
      <li className={path === href ? "active" : ""}>
        <a href={href} {...props}>
          {children}
        </a>
      </li>
    );
  }
  return (
    <>
      <nav className="nav">
        <a href="/" className="title">
          Interview Scheduler
        </a>
        <ul className="nav-links">
          <CustomLink href="/">Home</CustomLink>
          <CustomLink href="/schedule">Schedule</CustomLink>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
