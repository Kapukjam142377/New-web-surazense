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

      <footer className="bg-[#4fb0da] text-white py-16 px-6 lg:px-12 mt-auto w-full">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          
          {/* Column 1: Brand & Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-1 rounded w-12 h-12 flex items-center justify-center shadow-sm">
                <img src="/logo.png" alt="Surazense Logo" className="w-[85%] h-[85%] object-contain" />
              </div>
              <span className="text-2xl font-medium tracking-tight">Surazense</span>
            </div>
            <p className="text-white/90 text-[14px] leading-relaxed mb-8 max-w-[280px]">
              We're all about boosting health system with our biosensor tech and are working to make better biosensors for detecting cancer
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-5">
              <a href="#" className="text-white/90 hover:text-white transition-colors hover:-translate-y-0.5 transform"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg></a>
              <a href="#" className="text-white/90 hover:text-white transition-colors hover:-translate-y-0.5 transform"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg></a>
              <a href="#" className="text-white/90 hover:text-white transition-colors hover:-translate-y-0.5 transform"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg></a>
              <a href="#" className="text-white/90 hover:text-white transition-colors hover:-translate-y-0.5 transform"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg></a>
            </div>
          </div>

          {/* Column 2: Pages */}
          <div>
            <h3 className="text-[17px] font-bold mb-6 text-white tracking-wide">Pages</h3>
            <ul className="space-y-4">
              <li><Link to="/how-it-works" className="text-white/80 hover:text-white transition-colors text-[14px]">Home it work</Link></li>
              <li><Link to="/pricing" className="text-white/80 hover:text-white transition-colors text-[14px]">Pricing</Link></li>
              <li><Link to="/blog" className="text-white/80 hover:text-white transition-colors text-[14px]">Blog</Link></li>
              <li><Link to="/demo" className="text-white/80 hover:text-white transition-colors text-[14px]">Demo</Link></li>
            </ul>
          </div>

          {/* Column 3: Service */}
          <div>
            <h3 className="text-[17px] font-bold mb-6 text-white tracking-wide">Service</h3>
            <ul className="space-y-4">
              <li><Link to="/service/shopify" className="text-white/80 hover:text-white transition-colors text-[14px]">Shopify</Link></li>
              <li><Link to="/service/wordpress" className="text-white/80 hover:text-white transition-colors text-[14px]">WordPress</Link></li>
              <li><Link to="/service/ui-ux" className="text-white/80 hover:text-white transition-colors text-[14px]">UI/UX Design</Link></li>
            </ul>
          </div>

          {/* Column 4: Map */}
          <div className="flex flex-col pr-4">
            <h3 className="text-[17px] font-bold mb-6 text-white tracking-wide">Maps Location</h3>
            <div className="w-full bg-white/10 overflow-hidden aspect-[1.4] flex items-center justify-center relative cursor-pointer group shadow-sm">
               {/* Map Image Area - Will show fallback text if image is missing */}
               <div className="absolute inset-0 flex items-center justify-center p-4 text-center z-0">
                  <span className="text-sm text-white/80 font-medium">Please add 'footer-map.jpg' to public folder</span>
               </div>
               <img src="/footer-map.jpg" alt="Map Location" className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.style.opacity='0' }} />
            </div>
          </div>

        </div>
        
        {/* Copyright (Bonus: Not in image but good practice) */}
        <div className="max-w-[1200px] mx-auto mt-16 pt-6 border-t border-white/20 text-center text-white/50 text-xs">
           <p>© {new Date().getFullYear()} Surazense Biosensors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
