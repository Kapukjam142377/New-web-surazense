import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex items-center min-h-[calc(100vh-80px)] relative w-full m-0 py-16 flex-col lg:flex-row lg:px-0">
      
      <div className="flex-none w-full lg:w-1/2 px-6 py-12 lg:py-0 lg:pl-[max(3rem,calc((100%-1200px)/2))] lg:pr-16 z-10 box-border text-center lg:text-left flex flex-col items-center lg:items-start max-w-full">
        
        <div className="inline-flex items-center justify-center bg-blue-50 border border-blue-100 text-accent px-5 py-2 rounded-full text-[13px] tracking-wide font-bold mb-8 shadow-sm">
          Surazense Innovation
        </div>
        
        <h1 
          className="font-extrabold mb-5 leading-[1.05] tracking-tight uppercase flex flex-col items-center lg:items-start z-20"
          style={{ fontSize: 'clamp(2.25rem, 3vw, 52px)', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.4))' }}
        >
          <span className="whitespace-nowrap">
            <span className="text-slate-900">Sensor</span>{' '}
            <span className="text-slate-700">Technology</span>
          </span>
          <span className="whitespace-nowrap mt-1 lg:mt-3">
            <span className="text-slate-400">for</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-sky-400">Diagnostic</span>
          </span>
        </h1>
        
        <p className="text-lg lg:text-xl text-slate-500 mb-12 leading-relaxed max-w-[540px]">
          We're all about boosting health systems with our biosensor tech and are working to make better biosensors for detecting cancer.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link to="/products" className="bg-accent text-white px-8 py-4 rounded-full font-semibold text-[15px] transition-all hover:bg-accent-hover hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(2,132,199,0.35)] min-w-[200px] flex justify-center items-center">
            Explore Technology
          </Link>
          <Link to="/about" className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full font-semibold text-[15px] transition-all hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-sm min-w-[160px] flex justify-center items-center">
            Learn More
          </Link>
        </div>
      </div>
      
      <div className="relative w-full lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 h-[50vh] lg:h-[auto] lg:min-h-full order-first lg:order-last overflow-hidden rounded-b-[40px] lg:rounded-none lg:rounded-tl-[64px] lg:rounded-bl-[64px] shadow-[-20px_0_50px_rgba(0,0,0,0.06)]">
        <img 
          src="/sensor-hero.png" 
          alt="Surazense QCM Sensor" 
          className="w-full h-full object-cover animate-sway hover:scale-110 transition-transform duration-[1.5s] ease-out" 
        />
      </div>
      
    </div>
  );
}
