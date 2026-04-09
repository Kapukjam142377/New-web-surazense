import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const productImages = [
    '/x-zense-101.jpg', // Main device image
    '/x-zense-view2.jpg', // View 2
  ];

  const nextSlide = () => setCurrentIdx((prev) => (prev + 1) % productImages.length);
  const prevSlide = () => setCurrentIdx((prev) => (prev - 1 + productImages.length) % productImages.length);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % productImages.length);
    }, 10000); // Auto-slide every 10 seconds
    
    // Cleanup interval on unmount
    return () => clearInterval(slideInterval);
  }, [productImages.length]);
  
  return (
    <>
      <div className="flex items-center min-h-[calc(100vh-80px)] relative w-full m-0 py-16 flex-col lg:flex-row lg:px-0">

        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-none w-full lg:w-1/2 px-6 py-12 lg:py-0 lg:pl-[max(3rem,calc((100%-1200px)/2))] lg:pr-16 z-10 box-border text-center lg:text-left flex flex-col items-center lg:items-start max-w-full"
        >

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
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="relative w-full lg:absolute lg:right-0 lg:top-0 lg:bottom-0 lg:w-1/2 h-[50vh] lg:h-[auto] lg:min-h-full order-first lg:order-last overflow-hidden rounded-b-[40px] lg:rounded-none lg:rounded-tl-[64px] lg:rounded-bl-[64px] shadow-[-20px_0_50px_rgba(0,0,0,0.06)]"
        >
          <img
            src="/sensor-hero.png"
            alt="Surazense QCM Sensor"
            className="w-full h-full object-cover animate-sway hover:scale-110 transition-transform duration-[1.5s] ease-out"
          />
        </motion.div>

      </div>

      <section className="w-full bg-slate-50 border-t border-slate-100 py-24 px-6 lg:px-12 relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-100 rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">Featured Products</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Discover the state-of-the-art biosensor technology designed to deliver unprecedented accuracy and seamless clinical workflows.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 bg-white/60 backdrop-blur-xl rounded-[40px] p-8 lg:p-14 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-200/60 transition-transform duration-500 hover:shadow-[0_20px_60px_rgba(2,132,199,0.08)] hover:-translate-y-1"
          >

            <div className="w-full lg:w-1/2 rounded-[28px] overflow-hidden bg-white flex flex-col items-center justify-center p-8 lg:p-12 shadow-sm border border-slate-100 relative min-h-[450px]">
              <div className="absolute inset-0 bg-white"></div>

              {/* Active Image */}
              <div className="relative z-10 w-full flex-1 flex items-center justify-center mb-8">
                <img
                  key={currentIdx} /* Key ensures re-render animation if needed */
                  src={productImages[currentIdx]}
                  alt={`X-ZENSE 101 view ${currentIdx + 1}`}
                  className="w-full h-auto max-h-[350px] max-w-[480px] object-contain transition-transform duration-[1s] ease-[cubic-bezier(0.2,0.8,0.2,1)] mix-blend-darken hover:scale-105"
                />
              </div>

              {/* Slider Controls */}
              <div className="relative z-10 flex items-center gap-6 mt-auto">
                <button onClick={prevSlide} className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-accent hover:border-accent hover:shadow transition-all group/btn cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:-translate-x-0.5 transition-transform"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                <div className="flex gap-2.5">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-2.5 rounded-full outline-none transition-all duration-300 cursor-pointer ${currentIdx === idx ? 'w-8 bg-accent' : 'w-2.5 bg-slate-200 hover:bg-slate-300'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button onClick={nextSlide} className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-accent hover:border-accent hover:shadow transition-all group/btn cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-0.5 transition-transform"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
              <div className="inline-block bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 self-center lg:self-start border border-sky-200">
                Flagship System
              </div>

              <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">X-ZENSE 101</h3>

              <p className="text-xl text-slate-500 mb-10 leading-relaxed font-light">
                The complete diagnostic package including our core hardware device and intuitive software monitoring suite. Engineered for extreme precision in detecting mass variations down to the molecular level.
              </p>

              <ul className="space-y-4 mb-10 text-left">
                <li className="flex items-center gap-4 text-slate-700 font-medium text-lg">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-md flex-shrink-0">✓</div>
                  Advanced QCM sensing technology
                </li>
                <li className="flex items-center gap-4 text-slate-700 font-medium text-lg">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-md flex-shrink-0">✓</div>
                  Enterprise software suite included
                </li>
                <li className="flex items-center gap-4 text-slate-700 font-medium text-lg">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-md flex-shrink-0">✓</div>
                  Seamless clinical dashboard integration
                </li>
              </ul>

              <div className="self-center lg:self-start mt-2">
                <Link to="/technology" className="bg-slate-900 text-white px-8 py-4 rounded-full font-semibold text-[15px] transition-all hover:bg-accent hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(2,132,199,0.3)] inline-flex items-center gap-3">
                  Explore X-ZENSE 101
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>

          </motion.div>

        </div>
      </section>
    </>
  );
}
