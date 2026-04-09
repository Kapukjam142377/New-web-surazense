import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-accent font-semibold' 
      : 'text-slate-500 hover:text-accent font-medium';
  };

  const linkBaseClass = "text-[13px] tracking-wider uppercase transition-colors duration-200";

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-sky-100 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.03)] flex justify-between items-center px-6 py-3 lg:px-12 w-full">
        <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold text-accent no-underline tracking-tight">
          <img src="/logo.png" alt="Surazense Logo" className="h-[46px] object-contain" />
          <span>Surazense</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link to="/" className={`${linkBaseClass} ${isActive('/')}`}>Home</Link>
          <Link to="/about" className={`${linkBaseClass} ${isActive('/about')}`}>About us</Link>
          <Link to="/products" className={`${linkBaseClass} ${isActive('/products')}`}>Products</Link>
          <Link to="/services" className={`${linkBaseClass} ${isActive('/services')}`}>Services</Link>
          <Link to="/technology" className={`${linkBaseClass} ${isActive('/technology')}`}>Technology</Link>
          <Link to="/collaboration" className={`${linkBaseClass} ${isActive('/collaboration')}`}>Collaboration</Link>
          <Link to="/news" className={`${linkBaseClass} ${isActive('/news')}`}>News</Link>
          <Link to="/contacts" className={`${linkBaseClass} ${isActive('/contacts')}`}>Contacts</Link>
          
          <div className="w-[1px] h-5 bg-slate-200 mx-2"></div>
          
          <button className={`${linkBaseClass} text-slate-700 hover:text-accent cursor-pointer active:scale-95 transition-transform bg-transparent border-none p-0`}>
            EN / TH
          </button>
          
          <Link to="/login" className="bg-accent text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-[1px] hover:bg-accent-hover hover:shadow-[0_4px_12px_rgba(2,132,199,0.25)] active:translate-y-0 no-underline">
            Login
          </Link>
        </div>
      </nav>
      
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      <footer className="border-t border-slate-200 py-10 px-6 text-center text-slate-500 text-sm mt-auto bg-white">
        <p>© {new Date().getFullYear()} Surazense Biosensors. All rights reserved.</p>
      </footer>
    </div>
  );
}
