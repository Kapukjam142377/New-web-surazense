import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SolutionOption3 from '../components/SolutionOption3';

export default function Home() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const productImages = [
    '/x-zense-101.jpg', // Main device image
    '/x-zense-view2.jpg', // View 2
  ];

  const solutionSteps = [
    { num: 1, title: "Patient Visit", desc: "Local clinic or hospital check-in", icon: <path d="M3 21h18 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16 M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4 M10 9h4 M12 7v4" strokeLinecap="round" strokeLinejoin="round" /> },
    { num: 2, title: "Blood Extraction", desc: "Routine minimum invasive collection", icon: <><path d="m18 2 4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="m17 7 3-3" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" strokeLinecap="round" strokeLinejoin="round"/><path d="m9 11 4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="m5 19-3 3" strokeLinecap="round" strokeLinejoin="round"/><path d="m14 4 6 6" strokeLinecap="round" strokeLinejoin="round"/></> },
    { num: 3, title: "Cell-free DNA", desc: "Isolating target biomarker elements", icon: <><path d="M9 2v17.5A2.5 2.5 0 0 0 11.5 22A2.5 2.5 0 0 0 14 19.5V2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.5 2h7" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 9H9" strokeLinecap="round" strokeLinejoin="round"/></> },
    { num: 4, title: "Measurement", desc: "X-ZENSE 101 automated analysis", icon: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="2" y1="20" x2="22" y2="20" strokeLinecap="round" strokeLinejoin="round"/></> }
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
      <section className="flex items-center min-h-[calc(100vh-80px)] relative w-full m-0 py-16 flex-col lg:flex-row lg:px-0 bg-gradient-to-b from-sky-50/60 via-white to-white overflow-hidden">

        {/* Ambient Mesh Gradients Glow (for white balance) */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute top-0 left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-sky-200/50 rounded-full blur-[140px] pointer-events-none z-0"
        ></motion.div>

        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-indigo-200/40 rounded-full blur-[140px] pointer-events-none z-0"
        ></motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="flex-none w-full lg:w-1/2 px-6 py-12 lg:py-0 lg:pl-[max(3rem,calc((100%-1200px)/2))] lg:pr-16 z-10 box-border text-center lg:text-left flex flex-col items-center lg:items-start max-w-full"
        >



          <motion.h1
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
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
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
            className="text-lg lg:text-xl text-slate-500 mb-12 leading-relaxed max-w-[540px]"
          >
            We're all about boosting health systems with our biosensor tech and are working to make better biosensors for detecting cancer.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            <Link to="/products" className="bg-accent text-white px-8 py-4 rounded-full font-semibold text-[15px] transition-all hover:bg-accent-hover hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(2,132,199,0.35)] min-w-[200px] flex justify-center items-center">
              Explore Technology
            </Link>
            <Link to="/about" className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full font-semibold text-[15px] transition-all hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-sm min-w-[160px] flex justify-center items-center">
              Learn More
            </Link>
          </motion.div>
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

      </section>

      <section className="w-full bg-slate-50/40 border-t border-slate-50 py-24 px-6 lg:px-12 relative overflow-hidden">
        {/* Living background blob floating animation */}
        <motion.div
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
        ></motion.div>

        {/* Extra decorative blob on the left */}
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4 pointer-events-none"
        ></motion.div>

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
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 bg-white/60 backdrop-blur-xl rounded-[40px] p-8 lg:p-14 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-200/60 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(2,132,199,0.12)] hover:-translate-y-2"
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

      {/* Applications Section */}
      <section className="w-full bg-white py-24 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >

            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
              Wide range of applications
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Our sensory technology is engineered to meet the demanding requirements of diverse research fields.
            </p>
          </motion.div>

          {/* 5-Column Single Row Grid Layout */}
          <style>
            {`
               @keyframes floatUpDown {
                 0% { transform: translateY(0px); }
                 50% { transform: translateY(-8px); }
                 100% { transform: translateY(0px); }
               }
               .animate-float-wave {
                 animation: floatUpDown 5s ease-in-out infinite;
               }
             `}
          </style>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 w-full max-w-[1200px] mx-auto"
          >

            <AppCard
              index={0}
              title="Material Science"
              desc="Analyzing surface properties with extreme precision."
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.3 14.8a10 10 0 0 0-14.6-5.6"></path><path d="M4.7 14.8a10 10 0 0 0 14.6-5.6"></path><path d="M9.2 4.7a10 10 0 0 0-5.6 14.6"></path><path d="M14.8 19.3a10 10 0 0 0 5.6-14.6"></path></svg>}
            />
            <AppCard
              index={1}
              title="Biochemistry"
              desc="Molecular diagnostics and tracking viral particles."
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5l2 2" /><path d="M17 5l-2 2" /><path d="M5 19l2-2" /><path d="M17 19l-2-2" /><rect x="7" y="7" width="10" height="10" rx="2" /><circle cx="10" cy="10" r="1.5" /><circle cx="14" cy="14" r="1.5" /><path d="M14 10h.01" /><path d="M10 14h.01" /></svg>}
            />
            <AppCard
              index={2}
              title="Drug Discovery"
              desc="Instantaneous binding kinetics and compound verification."
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 4.5a3.53 3.53 0 0 0-5 0v0a3.53 3.53 0 0 0 0 5l8 8a3.53 3.53 0 0 0 5 0v0a3.53 3.53 0 0 0 0-5l-8-8z" /><path d="M12 18l3-3" /><path d="M15 21l3-3" /><line x1="16.5" x2="7.5" y1="7.5" y2="16.5" /></svg>}
            />
            <AppCard
              index={3}
              title="Nanotech"
              desc="Sub-micron particle detection supporting micro-processors."
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>}
            />
            <AppCard
              index={4}
              title="Environmental"
              desc="Resilient sensing arrays for toxin and ecological monitoring."
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line><polyline points="5 10 9 10 12 5 15 14 18 10 21 10"></polyline></svg>}
            />
          </motion.div>
        </div>
      </section>

      {/* Dynamic 4-Step Solution Section */}
      <section className="w-full bg-white py-20 px-6 md:px-8 border-t border-slate-100 overflow-hidden">
        <div className="max-w-[1100px] mx-auto flex flex-col items-center">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">
              Solution
            </h2>
            <p className="text-[15px] text-slate-500 max-w-xl mx-auto leading-relaxed">
              <strong>4 Steps to Rapid Diagnosis.</strong> A streamlined, fast, and highly accurate cancer screening process powered by advanced biosensor technology.
            </p>
          </motion.div>

          {/* Chosen Solution Layout: Circular Hub Orbit */}
          <div className="w-full py-4">
             <SolutionOption3 steps={solutionSteps} />
          </div>
        </div>
      </section>

      {/* Partnerships / Distributors Section */}
      <section className="w-full bg-white py-24 overflow-hidden border-b border-slate-100">
        <div className="text-center mb-20 px-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.7 }}
          >

            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
              Strategic Partners & Distributors
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              We collaborate with globally recognized technology institutions and exclusive distributors to deliver state-of-the-art sensor solutions.
            </p>
          </motion.div>
        </div>

        {/* Infinite Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex w-full max-w-[100vw] overflow-hidden py-4 group"
        >
          {/* Gradient Fades for Marquee Edges */}
          <div className="absolute left-0 top-0 w-16 md:w-48 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-16 md:w-48 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <style>
            {`
               @keyframes smoothMarquee {
                 0% { transform: translateX(0%); }
                 100% { transform: translateX(-50%); }
               }
               .animate-smooth-marquee {
                 animation: smoothMarquee 30s linear infinite;
                 will-change: transform;
               }
               .group:hover .animate-smooth-marquee {
                 animation-play-state: paused;
               }
             `}
          </style>

          <div className="flex items-center w-max animate-smooth-marquee">
            {/* We MUST render exactly 2 sets for the -50% trick to work flawlessly without stuttering */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="w-[220px] md:w-[340px] flex-shrink-0 flex items-center justify-center px-6 md:px-10">
                  <img
                    src="/partner-1.png"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/partner-1.jpg'; }}
                    alt="Thai Synchrotron"
                    className="h-20 md:h-24 max-w-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer object-center"
                  />
                </div>
                <div className="w-[220px] md:w-[340px] flex-shrink-0 flex items-center justify-center px-6 md:px-10">
                  <img
                    src="/partner-2.png"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/partner-2.jpg'; }}
                    alt="UPES"
                    className="h-16 md:h-20 max-w-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer object-center"
                  />
                </div>
                <div className="w-[220px] md:w-[340px] flex-shrink-0 flex items-center justify-center px-6 md:px-10">
                  <img
                    src="/partner-3.png"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/partner-3.jpg'; }}
                    alt="Neanic"
                    className="h-24 md:h-28 max-w-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer object-center"
                  />
                </div>
                <div className="w-[220px] md:w-[340px] flex-shrink-0 flex items-center justify-center px-6 md:px-10">
                  <img
                    src="/partner-4.png"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/partner-4.jpg'; }}
                    alt="Suranaree"
                    className="h-24 md:h-28 max-w-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer object-center"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Awards & Events Section */}
      <section className="w-full bg-slate-50/60 py-24 px-6 lg:px-12 border-t border-slate-100">
        <div className="max-w-[1200px] mx-auto space-y-20">
          
          {/* Awards Sub-section */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Awards</h3>
              <div className="w-[40px] h-[4px] bg-[#2D9CDB] rounded-full shadow-sm"></div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { title: "National Innovation Award", src: "/award-1.jpg" },
                { title: "Best MedTech Startup", src: "/award-2.jpg" },
                { title: "Excellence in Research", src: "/award-3.jpg" }
              ].map((item, idx) => (
                <GridPhotoCard key={idx} title={item.title} src={item.src} />
              ))}
            </motion.div>
          </div>

          {/* Events Sub-section */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Events</h3>
              <div className="w-[40px] h-[4px] bg-[#2D9CDB] rounded-full shadow-sm"></div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { title: "Global Health Expo", src: "/event-1.png" },
                { title: "Medical Tech Conference", src: "/event-2.png" },
                { title: "Synchrotron Symposium", src: "/event-3.png" }
              ].map((item, idx) => (
                <GridPhotoCard key={idx} title={item.title} src={item.src} />
              ))}
            </motion.div>
          </div>

        </div>
      </section>
    </>
  );
}

// Highly credible, slim card with wave float and premium shadow
const AppCard = ({ icon, title, desc, index = 0 }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }}
    className="h-full"
  >
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(14,165,233,0.2), 0 10px 20px -5px rgba(14,165,233,0.1)" }}
      className={`bg-white p-5 lg:p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center cursor-pointer relative overflow-hidden group h-full transition-all duration-300 animate-float-wave`}
      style={{ animationDelay: `${index * 0.25}s` }}
    >
      <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="text-sky-500 bg-sky-50/50 rounded-2xl w-14 h-14 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-100 transition-transform duration-300 mb-5 relative z-10">
        {icon}
      </div>

      <h3 className="text-[16px] font-bold text-slate-800 leading-snug mb-2 tracking-tight group-hover:text-sky-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 text-[13px] leading-relaxed">
        {desc}
      </p>
    </motion.div>
  </motion.div>
);

// Photo Card for Awards & Events Grid
const GridPhotoCard = ({ title, src }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
    }}
    className="relative group rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] cursor-pointer aspect-[4/3] bg-slate-200"
  >
    <img 
      src={src} 
      // Using flagship product as fallback if image doesn't exist yet
      onError={(e) => { e.target.onerror = null; e.target.src = '/x-zense-view2.jpg'; }}
      alt={title} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
    />
    
    {/* Sliding Dark Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex items-end p-6">
      <h4 className="text-white font-semibold text-lg leading-snug w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-400 delay-75">
        {title}
      </h4>
    </div>
  </motion.div>
);


