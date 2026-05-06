import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, X, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Layout({ children }) {
  const location = useLocation();
  const { cartItems, removeFromCart, itemCount, cartTotal } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginSidebarOpen, setIsLoginSidebarOpen] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          {/* Products Dropdown */}
          <div className="relative group flex items-center">
            <Link to="/products" className={`${linkBaseClass} ${isActive('/products')} py-2`}>
              Products
            </Link>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[190px] invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50">
              <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-2 flex flex-col relative before:absolute before:content-[''] before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white">
                <Link to="/products" className="px-5 py-2.5 text-[14px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors">
                  Exploring Products
                </Link>
                <Link to="/products" className="px-5 py-2.5 text-[14px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors">
                  Research solution
                </Link>
                <Link to="/products" className="px-5 py-2.5 text-[14px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors">
                  Others
                </Link>
              </div>
            </div>
          </div>
          <Link to="/services" className={`${linkBaseClass} ${isActive('/services')}`}>Services</Link>
          <Link to="/technology" className={`${linkBaseClass} ${isActive('/technology')}`}>Technology</Link>
          <Link to="/collaboration" className={`${linkBaseClass} ${isActive('/collaboration')}`}>Collaboration</Link>
          <Link to="/news" className={`${linkBaseClass} ${isActive('/news')}`}>News</Link>
          <Link to="/contacts" className={`${linkBaseClass} ${isActive('/contacts')}`}>Contacts</Link>
          
          <div className="w-[1px] h-5 bg-slate-200 mx-2"></div>
          
          <button className={`${linkBaseClass} text-slate-700 hover:text-accent cursor-pointer active:scale-95 transition-transform bg-transparent border-none p-0`}>
            EN / TH
          </button>
          
          <div className="relative" ref={cartRef}>
            <button 
              id="global-cart-icon"
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative text-slate-600 hover:text-accent transition-colors flex items-center justify-center p-1 cursor-pointer bg-transparent border-none outline-none" 
              title="Shopping Cart"
            >
              <ShoppingCart className="w-[1.15rem] h-[1.15rem] stroke-[2.5px]" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 bg-red-500 rounded-full border-[1.5px] border-white text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
            
            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-100 py-4 px-5 z-50">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Your Cart</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{itemCount} items</span>
                </div>
                
                <div className="space-y-4 mb-5 max-h-[60vh] overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">Your cart is empty.</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center group">
                        <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300 stroke-[1.5px]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate" title={item.name}>{item.name}</p>
                          <p className="text-xs text-slate-500">{item.quantity} x ${item.price.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1 bg-transparent border-none cursor-pointer outline-none"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="pt-4 border-t border-slate-100 mb-5 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Subtotal</span>
                  <span className="text-lg font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
                
                <Link to="/checkout" onClick={() => setIsCartOpen(false)} className={`w-full block text-center py-2.5 rounded-xl font-bold text-sm transition-colors no-underline ${cartItems.length > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 text-slate-400 pointer-events-none'}`}>
                  Checkout
                </Link>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setIsLoginSidebarOpen(true)}
            className="bg-accent text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-[1px] hover:bg-accent-hover hover:shadow-[0_4px_12px_rgba(2,132,199,0.25)] active:translate-y-0 cursor-pointer border-none"
          >
            Login
          </button>
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

      {/* Login Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isLoginSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsLoginSidebarOpen(false)}
      />

      {/* Login Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-[400px] max-w-[100vw] bg-white z-[70] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
          isLoginSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome Back</h2>
          <button 
            onClick={() => setIsLoginSidebarOpen(false)}
            className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors bg-transparent border-none cursor-pointer outline-none"
          >
            <X className="w-5 h-5 stroke-[2.5px]" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent transition-colors" />
                <span className="text-slate-600 group-hover:text-slate-800 transition-colors font-medium">Remember me</span>
              </label>
              <a href="#" className="text-accent hover:text-accent-hover font-semibold no-underline transition-colors">Forgot password?</a>
            </div>
            
            <button type="button" className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-sky-200 hover:shadow-xl hover:-translate-y-[1px] mt-4 cursor-pointer border-none text-[15px]">
              Sign In
            </button>
            
            <div className="relative my-6 flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium uppercase tracking-wider">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            
            <button type="button" className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 cursor-pointer text-[15px]">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Google
            </button>
          </form>
          
          <p className="text-center text-slate-500 text-[15px] mt-8">
            Don't have an account? <a href="#" className="text-accent hover:text-accent-hover font-bold no-underline transition-colors ml-1">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
