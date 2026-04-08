import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="hero-section">
      <div className="badge">Next-Generation QCM Technology</div>
      <h1 className="hero-title">
        Advanced Biosensors for <span>Precise Analytics</span>
      </h1>
      <p className="hero-subtitle">
        Surazense provides enterprise-grade Quartz Crystal Microbalance (QCM) monitoring systems for highly sensitive molecular detection and continuous clinical workflows.
      </p>
      <div className="hero-cta">
        <Link to="/dashboard" className="btn-primary btn-large">Launch Dashboard</Link>
        <Link to="/about" className="btn-outline btn-large">Learn More</Link>
      </div>
    </div>
  );
}
