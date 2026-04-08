import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="main-layout">
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <img src="/logo.png" alt="Surazense Logo" style={{ height: '54px', objectFit: 'contain', margin: '-5px 0' }} />
          <span>Surazense</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About Us</Link>
          <Link to="/services" className={`nav-link ${isActive('/services')}`}>Services</Link>
          <Link to="/dashboard" className="nav-cta">Go to Dashboard</Link>
        </div>
      </nav>
      
      <main className="content-wrapper">
        {children}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Surazense Biosensors. All rights reserved.</p>
      </footer>
    </div>
  );
}
