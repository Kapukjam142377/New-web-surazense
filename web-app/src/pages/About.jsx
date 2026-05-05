import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Shield, Activity, Users } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function About() {
  const teamMembers = [
    { name: "Dr.Thita", role: "Director\nPhD-Material Engineering\nB. Eng.(Hons) Ceramic Engineering", image: "/member12.png" },
    { name: "Weerasak", role: "Operation manager", image: "/member.png", position: "object-[center_35%]" },
    { name: "Adisak", role: "Engineering manager\nB. Eng. (Hons) & M Eng.\nElectronic engineering", image: "/member5.png", scaleClass: "scale-110", hoverScaleClass: "group-hover:scale-[1.15]" },
    { name: "Pimpaya", role: "Marketing manager\nBMgt. (Hons) Concentration: Entrepreneurship", image: "/member1.png" },
    { name: "Dr. Soodkhet", role: "Advisor\nPhD - MaterialScience & Engineering,\nM. Eng. Nuclear Technology,\nB. Eng. Industrial Engineering", image: "/member11.png" },
    { name: "Dr. Sanong", role: "Advisor\nPhD - Pathobiology, Cert. Molecular Diagnosis\n(Automatic in situ and Immunostaining)", image: "/member6.png", scaleClass: "scale-110", hoverScaleClass: "group-hover:scale-[1.15]" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* About Us Section */}
      <section className="pt-32 pb-24 relative overflow-hidden bg-slate-50">
        {/* Light Parallax Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.15]"
            style={{ backgroundImage: "url('/ภาพการทำงานของ software-1.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
          <div className="absolute top-0 left-0 right-0 h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent z-0"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <div className="mb-16 md:mb-24">
              <motion.div variants={fadeIn} className="flex items-center gap-4 mb-8">
                <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-blue-600 uppercase tracking-widest">About Us</h2>
              </motion.div>
              
              {/* Main Statement */}
              <motion.div variants={fadeIn} className="max-w-5xl">
                <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
                  We discovered that the majority of cancer patients died because the disease is recognized at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">final stage.</span>
                </h3>
                <div className="border-l-4 border-blue-500 pl-6 py-2">
                  <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light">
                    The primary factors are long diagnostic and distance transportation – difficulty in reaching the main hospital. We provide a specific cancer detection instrument with a rapid response time, accessibility for people in rural areas, and can able to interconnect with telemedicine.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Split Content */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
              <motion.div variants={fadeIn} className="space-y-6">
                <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                  Our Purpose
                </h4>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We are SuraZense team, we would like to help underprivileged people and small remote hospitals to detect an earlier stage of cancer. This could lead to the reduction of death rate due to cancer if the patients can be treated earlier.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="space-y-6">
                <h4 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm">2</span>
                  Our Background & Technology
                </h4>
                <p className="text-lg text-slate-600 leading-relaxed">
                  SuraZense founded by university instructors and students. SuraZense in the start-up phase (3 years established), collaborated in public and private organizations as Udonthani cancer hospital, Suanaree university of technology hospital, Suratec Co., Ltd., etc. our core technology is to develop a cost-effective and portable immunoassay (specific or non-specific) detector based on an innovative piezoelectric sensor. In these cases, SuraZense provided its expertise in the development of the immunoassay process and new generations of mass sensors based on quartz crystal microbalance with higher sensitivity. The principle of the device, which is used to provide the change of electrical signal of the sensor for monitoring biomarker detection.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The experts and innovators driving the future of biomolecular sensing at Surazense.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative w-48 h-48 md:w-56 md:h-56 mb-6 overflow-hidden rounded-full border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full"></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 ${member.scaleClass || 'scale-100'} ${member.hoverScaleClass || 'group-hover:scale-105'} ${member.position || 'object-top'}`}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</h3>
                <p className="text-sky-600 font-medium mt-1 whitespace-pre-line leading-snug">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid md:grid-cols-2 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="glass-panel relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-200/60 bg-white/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <Target className="w-12 h-12 text-blue-600 mb-6 relative z-10" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4 relative z-10">Our Mission</h2>
              <p className="text-slate-600 text-lg leading-relaxed relative z-10">
                To empower researchers, clinicians, and industries with unparalleled real-time insights into biomolecular interactions. We strive to make high-precision QCM sensor technology accessible, intuitive, and seamlessly integrated into modern workflows.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="glass-panel relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-200/60 bg-white/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <Activity className="w-12 h-12 text-sky-500 mb-6 relative z-10" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4 relative z-10">Our Vision</h2>
              <p className="text-slate-600 text-lg leading-relaxed relative z-10">
                To become the global standard in real-time biochemical monitoring. By bridging the gap between advanced hardware and intelligent software, we envision a world where critical data is always instantaneous, accurate, and actionable.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Value 1 */}
            <motion.div variants={fadeIn} className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Precision</h3>
              <p className="text-slate-600">
                Uncompromising accuracy in every data point. We build tools that professionals can trust for their most critical analyses.
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div variants={fadeIn} className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6 text-sky-500">
                <Lightbulb className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Innovation</h3>
              <p className="text-slate-600">
                Continuously pushing the boundaries of what's possible in sensor technology and data visualization.
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div variants={fadeIn} className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Reliability</h3>
              <p className="text-slate-600">
                Enterprise-grade stability. Our systems are designed to perform consistently under demanding environments.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>


    </div>
  );
}
