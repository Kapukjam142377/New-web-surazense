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
        <div className="nav-links" style={{ gap: '1.25rem', flexWrap: 'wrap' }}>
          <Link to="/" className={`nav-link ${isActive('/')}`}>HOME</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About us</Link>
          <Link to="/products" className={`nav-link ${isActive('/products')}`}>Products</Link>
          <Link to="/services" className={`nav-link ${isActive('/services')}`}>Services</Link>
          <Link to="/technology" className={`nav-link ${isActive('/technology')}`}>Technology</Link>
          <Link to="/collaboration" className={`nav-link ${isActive('/collaboration')}`}>Collaboration</Link>
          <Link to="/news" className={`nav-link ${isActive('/news')}`}>News</Link>
          <Link to="/contacts" className={`nav-link ${isActive('/contacts')}`}>Contacts</Link>
          <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>
          <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 700 }}>EN / TH</button>
          <Link to="/login" className="nav-cta">Login</Link>
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
