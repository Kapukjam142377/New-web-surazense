import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={
            <div className="glass-panel" style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
              <h2>About Surazense</h2>
              <p style={{ color: 'var(--text-muted)' }}>Pioneering the future of real-time biomolecular interactions.</p>
            </div>
          } />
          <Route path="/services" element={
            <div className="glass-panel" style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
              <h2>Our Services</h2>
              <p style={{ color: 'var(--text-muted)' }}>Target detection modules for EGFR and custom biomarkers.</p>
            </div>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
