import React from 'react';
import { Mail, Key } from 'lucide-react';

export default function Login() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(350px, 1fr)', minHeight: 'calc(100vh - 120px)', alignItems: 'center' }}>
      
      {/* ด้านซ้าย ปล่อยว่างไว้ตามที่ต้องการ */}
      <div className="login-left-placeholder"></div>

      {/* ด้านขวา กล่อง Login */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
        
        <div style={{ 
          background: '#eef8ff', 
          border: '2px solid #0284c7', 
          borderRadius: '20px', 
          padding: '2rem', 
          width: '100%', 
          maxWidth: '380px',
          boxShadow: '0 20px 40px rgba(2, 132, 199, 0.08)'
        }}>
          
          <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', color: '#111827', fontSize: '1.4rem', fontWeight: 700 }}>
            Login your account!
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Email Input */}
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={16} />
              <input 
                type="email" 
                placeholder="Email" 
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none', fontSize: '0.9rem', outline: 'none', color: '#333' }} 
              />
            </div>

            {/* Password Input */}
            <div style={{ position: 'relative' }}>
              <Key style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={16} />
              <input 
                type="password" 
                placeholder="Password" 
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none', fontSize: '0.9rem', outline: 'none', color: '#333' }} 
              />
            </div>

            {/* Password Re-enter (ตามรูป Mockup) */}
            <div style={{ position: 'relative' }}>
              <Key style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={16} />
              <input 
                type="password" 
                placeholder="Password" 
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none', fontSize: '0.9rem', outline: 'none', color: '#333' }} 
              />
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '0.5rem', marginBottom: '1rem' }}>
            <a href="#" style={{ color: '#111827', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}>Forgot password?</a>
          </div>

          <button style={{ 
            width: '100%', 
            padding: '0.8rem', 
            borderRadius: '8px', 
            border: 'none', 
            background: 'linear-gradient(to right, #7dd3fc, #38bdf8)', 
            color: 'white', 
            fontWeight: 600, 
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)'
          }}>
            Continue
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', color: '#64748b', fontSize: '0.8rem' }}>
            Sign in With
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
             {/* Facebook */}
             <div style={{ background: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
             </div>
             {/* Google */}
             <div style={{ background: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.827-.066-1.611-.189-2.39H12.24v4.534h6.452c-.28 1.458-1.085 2.693-2.32 3.52v2.93h3.753c2.196-2.023 3.46-5.006 3.46-8.594z"/><path fill="#34A853" d="M12.24 24c3.24 0 5.957-1.077 7.943-2.918l-3.753-2.93c-1.077.722-2.455 1.15-4.19 1.15-3.226 0-5.96-2.18-6.937-5.11H1.428v3.023C3.414 21.144 7.502 24 12.24 24z"/><path fill="#FBBC05" d="M5.303 14.192C5.056 13.47 4.918 12.698 4.918 11.9s.138-1.57.385-2.292V6.585H1.428A11.97 11.97 0 0 0 0 11.9c0 1.93.465 3.757 1.285 5.372l3.87-3.08z"/><path fill="#EA4335" d="M12.24 4.75c1.764 0 3.348.608 4.595 1.796l3.447-3.447C18.192 1.187 15.475 0 12.24 0 7.502 0 3.414 2.856 1.428 6.585l3.875 3.023C6.28 6.68 9.014 4.75 12.24 4.75z"/></svg>
             </div>
             {/* Apple */}
             <div style={{ background: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="black"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.099-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.641-.026 2.669-1.48 3.665-2.94 1.16-1.64 1.636-3.262 1.66-3.346-.039-.026-3.136-1.205-3.167-4.79-.026-3.003 2.455-4.457 2.57-4.526-1.402-2.05-3.585-2.28-4.364-2.316-2.091-.184-4.148 1.258-4.649 1.258zm-1.643-4.577c.866-1.04 1.455-2.494 1.295-3.948-1.246.052-2.766.83-3.663 1.871-.715.817-1.42 2.298-1.233 3.722 1.391.109 2.735-.595 3.601-1.645z"/></svg>
             </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#111827' }}>
            Dont have an account? <a href="#" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>Sign up</a>
          </div>

        </div>

      </div>
    </div>
  );
}
