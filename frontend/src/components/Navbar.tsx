import React from 'react';
import '../styles/navbar.css'; 
import { Link } from 'react-router-dom';
const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">Your Logo</a>
      </div>
      <div className="navbar-links">
        <Link to="/">login</Link>
        <Link to="/todos">todos</Link>
        <Link to="/register">signup</Link>
        
      </div>
    </nav>
  );
}

export default Navbar;
