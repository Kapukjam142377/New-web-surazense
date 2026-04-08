import React from 'react';

export default function About() {
  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '2rem' }}>About us</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
        Pioneering the future of real-time biomolecular interactions.
        (Space to add company history, mission, and team details here in the future.)
      </p>
    </div>
  );
}
