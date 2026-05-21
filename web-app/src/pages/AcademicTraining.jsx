import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Cpu, Activity, FileText, Award, ChevronRight, GraduationCap, Beaker, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const LABS = [
  {
    id: 'lab-qcm',
    title: 'Lab 1: QCM Sensor Calibration & Characterization',
    subtitle: 'Frequency Sweeps & Hardware Interfacing',
    description: 'Learn the fundamentals of Quartz Crystal Microbalance (QCM) sensors. Students perform frequency sweeps from 8MHz to 12MHz, interface with ESP32 microcontrollers, and capture real-time resonance behavior.',
    icon: <Cpu className="w-6 h-6" />,
    duration: '3 hours',
    topics: ['Serial communication (UART)', 'Resonance tracking', 'Hardware noise reduction']
  },
  {
    id: 'lab-biomarker',
    title: 'Lab 2: Biomarker Binding Kinetics (EGFR)',
    subtitle: 'Target Biomarker Isolation & Detection',
    description: 'Simulate molecular diagnostic binding experiments. Apply functionalized cell-free DNA to active gold sensor surfaces, observe real-time amplitude changes, and determine biomarker presence.',
    icon: <Beaker className="w-6 h-6" />,
    duration: '4 hours',
    topics: ['Gold surface functionalization', 'Antigen-antibody binding', 'Threshold-based detection']
  },
  {
    id: 'lab-signal',
    title: 'Lab 3: Advanced Signal Processing & Splines',
    subtitle: 'Noise Analysis & Curve Smoothing',
    description: 'Focus on the digital signal processing pipeline. Implement polynomial regression for baseline estimation and Savitzky-Golay filtering. Fit Univariate Splines to determine peak frequencies.',
    icon: <Activity className="w-6 h-6" />,
    duration: '3 hours',
    topics: ['Savitzky-Golay filtering', 'Baseline correction models', 'Spline peak interpolation']
  }
];

const COURSES = [
  {
    id: 'course-intro',
    level: 'Beginner',
    levelColor: 'bg-emerald-100 text-emerald-700 border-emerald-200/50',
    title: 'Introduction to Biosensors & Surface Science',
    duration: '4 weeks (8 credits)',
    description: 'An introductory course covering the physics behind QCM resonance, molecular interactions on gold substrates, and basic measurement instrumentation.',
    skills: ['QCM Physics', 'Surface Science basics', 'Basic laboratory safety']
  },
  {
    id: 'course-instrument',
    level: 'Intermediate',
    levelColor: 'bg-blue-100 text-blue-700 border-blue-200/50',
    title: 'Medical Diagnostic Instrumentation',
    duration: '6 weeks (12 credits)',
    description: 'Deep dive into hardware interfacing. Learn to build ESP32-based frequency controllers, configure serial protocols, and structure responsive desktop UI frameworks.',
    skills: ['ESP32 microcontrollers', 'Web Serial API / UART', 'UI/UX for diagnostics']
  },
  {
    id: 'course-data',
    level: 'Advanced',
    levelColor: 'bg-purple-100 text-purple-700 border-purple-200/50',
    title: 'Quantitative Biosignal Analysis',
    duration: '5 weeks (10 credits)',
    description: 'A mathematical approach to diagnostic noise reduction. Apply advanced filters, regression curves, and spline interpolations to real-time clinical biosignals.',
    skills: ['Signal processing maths', 'Data regression models', 'Noise analysis']
  }
];

const BACKGROUNDS = [
  { id: 'biology', label: 'Biology & Life Sciences', recommend: 'lab-biomarker', course: 'course-intro' },
  { id: 'engineering', label: 'Electrical & Computer Engineering', recommend: 'lab-qcm', course: 'course-instrument' },
  { id: 'maths', label: 'Signal Processing & Applied Mathematics', recommend: 'lab-signal', course: 'course-data' }
];

const teamMembers = [
  { name: "Dr.Thita", role: "Director\nPhD-Material Engineering\nB. Eng.(Hons) Ceramic Engineering", image: "/member12.png" },
  { name: "Weerasak", role: "Operation manager", image: "/member.png", position: "object-[center_35%]" },
  { name: "Adisak", role: "Engineering manager\nB. Eng. (Hons) & M Eng.\nElectronic engineering", image: "/member5.png", scaleClass: "scale-110", hoverScaleClass: "group-hover:scale-[1.15]" },
  { name: "Pimpaya", role: "Marketing manager\nBMgt. (Hons) Concentration: Entrepreneurship", image: "/member1.png" },
  { name: "Dr. Soodkhet", role: "Advisor\nPhD - MaterialScience & Engineering,\nM. Eng. Nuclear Technology,\nB. Eng. Industrial Engineering", image: "/member11.png" },
  { name: "Dr. Sanong", role: "Advisor\nPhD - Pathobiology, Cert. Molecular Diagnosis\n(Automatic in situ and Immunostaining)", image: "/member6.png", scaleClass: "scale-110", hoverScaleClass: "group-hover:scale-[1.15]" },
];

const LAB_GALLERY_IMAGES = [
  {
    id: 1,
    title: 'Medical / Engineer Training',
    description: 'Bridging biomedical diagnostic techniques with high-precision engineering and electronics.',
    category: 'Medical / Engineering',
    image: '/lab-gallery-1.jpg',
    fallbackColor: 'from-blue-600/20 to-sky-500/20',
    gridClass: 'md:col-span-2 md:row-span-2 min-h-[320px] md:min-h-[460px]'
  },
  {
    id: 2,
    title: 'LABORATORY TRAINING',
    description: 'Hands-on training sessions focusing on biosensing principles, mechanics, and workflows.',
    category: 'Lab Practice',
    image: '/lab-gallery-2.jpg',
    fallbackColor: 'from-indigo-600/20 to-purple-500/20',
    gridClass: 'md:col-span-1 md:row-span-1 min-h-[220px]'
  },
  {
    id: 3,
    title: 'PROJECT DEVELOPMENT',
    description: 'Developing instrumentation systems, calibrating sensor sweeps, and creating desktop interfaces.',
    category: 'Development',
    image: '/lab-gallery-3.jpg',
    fallbackColor: 'from-sky-600/20 to-emerald-500/20',
    gridClass: 'md:col-span-1 md:row-span-1 min-h-[220px]'
  },
  {
    id: 4,
    title: 'SCIENTIFIC RESEARCH',
    description: 'Applying signal processing algorithms, spline calculations, and filtering models to active biosensor diagnostics.',
    category: 'Research & Data',
    image: '/lab-gallery-4.jpg',
    fallbackColor: 'from-violet-600/20 to-pink-500/20',
    gridClass: 'md:col-span-3 md:row-span-1 min-h-[220px]'
  }
];

function GalleryCard({ item }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
      }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.12)" }}
      className={`relative overflow-hidden rounded-[2rem] border border-slate-200/50 shadow-sm bg-slate-950 group cursor-pointer ${item.gridClass} transition-shadow duration-300`}
    >
      {/* Fallback elegant background when image is missing */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${item.fallbackColor} opacity-90 transition-opacity duration-500 z-0 flex flex-col items-center justify-center p-6 text-center`}>
        {imgErr && (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Beaker className="w-8 h-8 opacity-40 animate-pulse text-blue-500" />
            <span className="text-xs font-semibold text-slate-500 tracking-wider">Photo Placeholder</span>
            <span className="text-[10px] text-slate-500 font-mono bg-slate-900/40 px-2.5 py-1 rounded border border-slate-800">
              {item.image}
            </span>
          </div>
        )}
      </div>

      {!imgErr && (
        <img
          src={item.image}
          alt={item.title}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-90 transition-opacity duration-300 z-10"></div>

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-20 flex flex-col justify-end transform md:translate-y-8 md:group-hover:translate-y-0 transition-transform duration-300">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-1.5 inline-block">
          {item.category}
        </span>
        <h3 className="text-lg md:text-xl font-extrabold text-white leading-snug">
          {item.title}
        </h3>
        <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-75">
          {item.description}
        </p>
      </div>

      {/* Premium subtle glow overlay */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
    </motion.div>
  );
}

const CERTIFICATES = [
  {
    id: 1,
    title: "Biotechnology Training Certificate",
    recipient: "Cancer Biomarker Detection Lab Completion",
    image: "/certificate-1.png"
  },
  {
    id: 2,
    title: "Engineering Training Certificate",
    recipient: "ESP32 & QCM Interfacing Lab Completion",
    image: "/certificate-2.png"
  },
  {
    id: 3,
    title: "Medical Science Training Certificate",
    recipient: "Binding Kinetics & Assay Lab Completion",
    image: "/certificate-3.png"
  },
  {
    id: 4,
    title: "Biotechnology Advanced Certificate",
    recipient: "Cancer Biomarker Detection Lab Completion",
    image: "/certificate-4.png"
  },
  {
    id: 5,
    title: "Engineering Advanced Certificate",
    recipient: "ESP32 & QCM Interfacing Lab Completion",
    image: "/certificate-5.png"
  },
  {
    id: 6,
    title: "Medical Science Advanced Certificate",
    recipient: "Binding Kinetics & Assay Lab Completion",
    image: "/certificate-6.png"
  }
];

function CertificateCard({ cert }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative aspect-[1.414/1] rounded-xl overflow-hidden bg-slate-900 border border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 opacity-90 z-0 flex flex-col items-center justify-center p-4 text-center">
          {imgErr && (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Award className="w-8 h-8 text-sky-500/60 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-500 tracking-wider">Certificate Photo</span>
              <span className="text-[9px] text-slate-500 font-mono bg-slate-900/40 px-2 py-0.5 rounded border border-slate-800">
                {cert.image}
              </span>
            </div>
          )}
        </div>
        {!imgErr && (
          <img
            src={cert.image}
            alt={cert.title}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-103"
          />
        )}
      </div>

      <div className="mt-4 text-center">
        <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
          {cert.title}
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          {cert.recipient}
        </p>
      </div>
    </motion.div>
  );
}

export default function AcademicTraining() {
  const [selectedBackground, setSelectedBackground] = useState('biology');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const activeRec = BACKGROUNDS.find(b => b.id === selectedBackground);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 relative overflow-hidden">
      
      {/* Ambient Mesh Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="absolute top-0 right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-sky-200/40 rounded-full blur-[130px] pointer-events-none z-0"
      ></motion.div>
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] left-[-10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-indigo-200/30 rounded-full blur-[130px] pointer-events-none z-0"
      ></motion.div>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 md:pb-28 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Knowledge is Endless Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50/80 border border-blue-100/80 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-md shadow-blue-500/5 cursor-default hover:scale-[1.02] transition-transform duration-300"
          >
            <GraduationCap className="w-5 h-5 text-blue-600 animate-bounce" style={{ animationDuration: '3s' }} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Knowledge is endless
            </span>
          </motion.div>

          {/* Surazense Training Program */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-4 tracking-[-0.03em] leading-[1.05] uppercase max-w-5xl mx-auto drop-shadow-sm"
          >
            Surazense{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">
              training program
            </span>
          </motion.h1>

          {/* Laboratory and Academic Training Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight mb-8 leading-snug max-w-4xl mx-auto uppercase"
          >
            Laboratory <span className="text-blue-600 font-black">&</span> Academic Training
          </motion.h2>

          {/* Fields Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 mb-10"
          >
            {['Biotechnology', 'Medical Science', 'Engineering'].map((field, idx) => (
              <React.Fragment key={field}>
                <span className="text-xs md:text-sm font-extrabold text-slate-700 bg-white border border-slate-200/60 px-5 py-2.5 rounded-2xl shadow-sm hover:border-blue-500 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                  {field}
                </span>
                {idx < 2 && <span className="hidden sm:inline text-slate-300 text-lg font-light">•</span>}
              </React.Fragment>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-slate-500 max-w-4xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Workshop and Training powered by our <strong className="text-slate-850 font-bold border-b-2 border-blue-500/25">Surazense Team</strong>, in collaboration with advisors from the <strong className="text-slate-850 font-bold border-b-2 border-sky-500/25">Engineering Department</strong> and the <strong className="text-slate-850 font-bold border-b-2 border-indigo-500/25">Translational Medicine Department at Suranaree University</strong>, for an interactive lab demonstration tailored to participants and enthusiasts passionate about biology and biosensor technology. Discover how cutting-edge biosensor technology is revolutionizing cancer detection through real-world applications of biosensor for cancer biomarker detection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <a
              href="#labs"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-[15px] hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all text-center min-w-[180px]"
            >
              Explore Labs
            </a>
            <a
              href="#courses"
              className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full font-bold text-[15px] hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-center min-w-[180px]"
            >
              View Courses
            </a>
          </motion.div>
        </div>
      </div>

      {/* Medical / Engineer Training Gallery Section */}
      <section className="max-w-7xl mx-auto px-6 mb-28 relative z-10 scroll-mt-24">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>Medical / Engineer Training</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Laboratory Atmosphere & Activities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3"
          >
            Explore our state-of-the-art laboratory workshops combining medical biology with electronics and hardware engineering.
          </motion.p>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {LAB_GALLERY_IMAGES.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </motion.div>
      </section>



      {/* Student Certificates Section */}
      <section className="max-w-7xl mx-auto px-6 mb-28 relative z-10 scroll-mt-24">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
            <span>Student Achievements</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Student Certificates of Completion
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3"
          >
            Certifying hands-on proficiency in advanced molecular diagnostics, hardware interfacing, and quantitative biosignal analysis.
          </motion.p>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {CERTIFICATES.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </motion.div>
      </section>

      {/* Interactive Selector Widget */}
      <section className="max-w-5xl mx-auto px-6 mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 p-8 md:p-12 shadow-xl shadow-blue-950/5"
        >
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full mb-3 inline-block">
              Interactive Guide
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
              Find Your Ideal Path
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Select your academic background to see customized laboratory recommendations
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-center mb-10">
            {BACKGROUNDS.map(bg => (
              <button
                key={bg.id}
                onClick={() => setSelectedBackground(bg.id)}
                className={`px-6 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center cursor-pointer border ${
                  selectedBackground === bg.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-[1.02]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBackground}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-200/50"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                    <Beaker className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Lab</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {LABS.find(l => l.id === activeRec?.recommend)?.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {LABS.find(l => l.id === activeRec?.recommend)?.description}
                </p>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Course</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">
                    {COURSES.find(c => c.id === activeRec?.course)?.title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {COURSES.find(c => c.id === activeRec?.course)?.description}
                  </p>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group mt-auto"
                >
                  <span>Inquire for this syllabus</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Laboratories Section */}
      <section id="labs" className="max-w-7xl mx-auto px-6 mb-32 relative z-10 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hands-on Experimental Laboratories
          </h2>
          <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3">
            Real laboratory tasks that students can perform to gain command over advanced QCM hardware and biosensing interfaces.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {LABS.map(lab => (
            <motion.div
              key={lab.id}
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.06)" }}
              className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between transition-all duration-300 relative group"
            >
              <div>
                {/* Accent border on top hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-blue-100 transition-all duration-300">
                  {lab.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1 leading-snug group-hover:text-blue-600 transition-colors">
                  {lab.title}
                </h3>
                <span className="text-[13px] font-bold text-slate-400 block mb-4">
                  {lab.subtitle}
                </span>
                
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {lab.description}
                </p>

                <div className="border-t border-slate-100 pt-5 mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Key Skills Taught</span>
                  <ul className="space-y-2">
                    {lab.topics.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0">✓</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/50">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Duration</span>
                <span className="text-sm font-bold text-blue-600 bg-blue-50/60 px-3 py-1 rounded-full">{lab.duration}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Courses Curriculum Section */}
      <section id="courses" className="max-w-7xl mx-auto px-6 relative z-10 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Academic Courses & Curricula
          </h2>
          <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3">
            Structured study plans recommended for undergraduate and graduate syllabus integrations.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {COURSES.map(course => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.06)" }}
              className="bg-white border border-slate-100 rounded-[2.25rem] p-8 shadow-sm flex flex-col justify-between transition-all duration-300 relative"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${course.levelColor}`}>
                    {course.level}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{course.duration}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4 leading-snug">
                  {course.title}
                </h3>
                
                <p className="text-sm text-slate-500 mb-6 leading-relaxed font-light">
                  {course.description}
                </p>

                <div className="border-t border-slate-100 pt-5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Syllabus Competencies</span>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((s, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200/30">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100/50">
                <Link
                  to="/contacts"
                  className="w-full bg-slate-900 text-white hover:bg-blue-600 font-semibold py-3 rounded-xl transition-colors text-center text-sm inline-block shadow-sm"
                >
                  Request Syllabus Details
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white relative overflow-hidden z-10 mt-32 border-y border-slate-100">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
          >
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Our team is ready to support every student's journey
            </h2>
            <p className="text-base text-slate-500 max-w-2xl mx-auto font-medium">
              The experts and innovators driving the future of biomolecular sensing at Surazense.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative w-44 h-44 md:w-48 md:h-48 mb-6 overflow-hidden rounded-full border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full"></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 ${member.scaleClass || 'scale-100'} ${member.hoverScaleClass || 'group-hover:scale-105'} ${member.position || 'object-top'}`}
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</h3>
                <p className="text-blue-600 text-xs font-semibold mt-1 whitespace-pre-line leading-normal">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
