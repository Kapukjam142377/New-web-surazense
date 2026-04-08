import React from 'react';

export default function Contacts() {
  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem', fontSize: '2rem' }}>Contacts</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
        Get in touch with our team for inquiries and support.
        (Space to add a contact form, maps, and info here in the future.)
      </p>
    </div>
  );
}
