import React from 'react';

export default function Login() {
  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '2rem' }}>Login / Portal</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
        Sign into your Surazense account.
        (Space to add the authentication form here in the future.)
      </p>
    </div>
  );
}
