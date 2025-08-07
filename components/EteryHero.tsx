"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";

// Portfolio Showcase Component  
function PortfolioShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [45, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const [currentProject, setCurrentProject] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Auto-rotate projects
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentProject(prev => (prev + 1) % projects.length);
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentProject(prev => prev > 0 ? prev - 1 : projects.length - 1);
        setIsAutoPlaying(false);
      } else if (e.key === 'ArrowRight') {
        setCurrentProject(prev => (prev + 1) % projects.length);
        setIsAutoPlaying(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const projects = [
    {
      name: "Elite Construction Co.",
      type: "Construction Company",
      url: "eliteconstructionpro.com",
      image: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      description: "Full-service construction company website with project galleries and quote system",
      tech: ["Next.js", "TypeScript", "Tailwind", "Sanity CMS"],
      features: ["3D Project Gallery", "Instant Quote Calculator", "Client Portal", "Mobile Responsive"],
      stats: { visitors: "15K+/mo", conversion: "8.2%", speed: "99/100" },
      color: "#f39c12"
    },
    {
      name: "Velocity Digital Agency",
      type: "Marketing Agency",
      url: "velocitydigital.agency",
      image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: "Modern agency site with case studies, team showcase, and service packages",
      tech: ["React", "Node.js", "MongoDB", "Framer Motion"],
      features: ["Interactive Case Studies", "Real-time Chat", "CRM Integration", "Analytics Dashboard"],
      stats: { visitors: "25K+/mo", conversion: "6.5%", speed: "97/100" },
      color: "#667eea"
    },
    {
      name: "FreshBite Delivery",
      type: "Food Delivery Platform",
      url: "freshbite.delivery",
      image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      description: "Restaurant delivery platform with real-time tracking and multi-vendor support",
      tech: ["Next.js", "PostgreSQL", "Redis", "Stripe"],
      features: ["Live Order Tracking", "Multi-Restaurant Cart", "Loyalty Program", "Driver App"],
      stats: { visitors: "85K+/mo", conversion: "12.3%", speed: "95/100" },
      color: "#f5576c"
    },
    {
      name: "MedConnect Health",
      type: "Healthcare Portal",
      url: "medconnecthealth.com",
      image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      description: "Patient portal with appointment booking, telemedicine, and health records",
      tech: ["React", "Express", "PostgreSQL", "WebRTC"],
      features: ["Video Consultations", "Appointment Booking", "Secure Messaging", "E-Prescriptions"],
      stats: { visitors: "40K+/mo", conversion: "9.8%", speed: "98/100" },
      color: "#00f2fe"
    },
    {
      name: "PropertyPro Real Estate",
      type: "Real Estate Platform",
      url: "propertypro.estate",
      image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      description: "Real estate listings with virtual tours, mortgage calculator, and agent matching",
      tech: ["Vue.js", "Laravel", "MySQL", "Mapbox"],
      features: ["360° Virtual Tours", "AI Property Matching", "Mortgage Calculator", "Agent Dashboard"],
      stats: { visitors: "60K+/mo", conversion: "7.2%", speed: "96/100" },
      color: "#43e97b"
    },
    {
      name: "StreamLearn Academy",
      type: "E-Learning Platform",
      url: "streamlearn.academy",
      image: "linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)",
      description: "Online learning platform with live classes, course marketplace, and certificates",
      tech: ["Next.js", "Django", "PostgreSQL", "AWS"],
      features: ["Live Classes", "Interactive Quizzes", "Progress Tracking", "Certificate Generation"],
      stats: { visitors: "100K+/mo", conversion: "15.4%", speed: "94/100" },
      color: "#ff6b6b"
    },
    {
      name: "CryptoVault Exchange",
      type: "Crypto Trading Platform",
      url: "cryptovault.exchange",
      image: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      description: "Cryptocurrency exchange with advanced trading tools and wallet management",
      tech: ["React", "Node.js", "MongoDB", "Web3.js"],
      features: ["Real-time Trading", "Secure Wallets", "Advanced Charts", "Mobile App"],
      stats: { visitors: "150K+/mo", conversion: "4.5%", speed: "99/100" },
      color: "#2575fc"
    },
    {
      name: "EventHub Conference",
      type: "Event Management",
      url: "eventhub.conference",
      image: "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
      description: "Event registration and management platform with ticketing and networking features",
      tech: ["Vue.js", "FastAPI", "PostgreSQL", "Stripe"],
      features: ["QR Ticketing", "Attendee Networking", "Live Streaming", "Sponsor Portal"],
      stats: { visitors: "35K+/mo", conversion: "11.2%", speed: "97/100" },
      color: "#fc5c7d"
    }
  ];

  return (
    <div ref={containerRef} className="relative flex justify-center items-center min-h-[700px] py-12">
      {/* MacBook Pro M3 Device Frame - Pixel Perfect */}
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformPerspective: "1200px",
          transformStyle: "preserve-3d"
        }}
        className="relative"
      >
        {/* Generic Laptop Frame */}
        <div className="relative" style={{ width: 'min(1000px, 90vw)' }}>
          {/* Screen Assembly */}
          <div className="relative">
            {/* Screen Housing */}
            <div 
              className="relative rounded-2xl shadow-2xl"
              style={{
                background: 'linear-gradient(180deg, #1a1a1d 0%, #2d2d30 100%)',
                padding: '12px',
              }}
            >
              {/* Screen */}
              <div 
                className="relative bg-black rounded-xl overflow-hidden"
                style={{ aspectRatio: '16 / 10' }}
              >
                {/* Generic Browser Chrome */}
                <div className="bg-[#2d2d30] border-b border-zinc-700">
                  <div className="flex items-center gap-3 px-4 py-2">
                    {/* Browser Controls */}
                    <div className="flex items-center gap-2">
                      <button className="w-3 h-3 rounded-full bg-zinc-600 hover:bg-zinc-500" />
                      <button className="w-3 h-3 rounded-full bg-zinc-600 hover:bg-zinc-500" />
                      <button className="w-3 h-3 rounded-full bg-zinc-600 hover:bg-zinc-500" />
                    </div>
                    
                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* URL Bar */}
                    <div className="flex-1 bg-[#1d1d1f] rounded-lg px-3 py-1.5 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">https://{projects[currentProject].url}</span>
                    </div>
                    
                    {/* Refresh Button */}
                    <button className="text-gray-400 hover:text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Website Content */}
                <div className="relative h-[calc(100%-44px)] overflow-hidden bg-gray-900">
                  {/* Project Display */}
                  <motion.div
                    key={currentProject}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-full overflow-auto"
                    style={{ background: projects[currentProject].image }}
                  >
                    <div className="p-8 min-h-full flex flex-col">
                      {/* Main Project Card */}
                      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-white text-3xl font-bold mb-2">
                              {projects[currentProject].name}
                            </h3>
                            <p className="text-white/80 text-lg">{projects[currentProject].type}</p>
                          </div>
                          <div 
                            className="w-3 h-3 rounded-full animate-pulse"
                            style={{ backgroundColor: projects[currentProject].color }}
                          />
                        </div>
                        
                        <p className="text-white/70 mb-6">{projects[currentProject].description}</p>
                        
                        {/* Tech Stack */}
                        <div className="mb-6">
                          <h4 className="text-white/60 text-sm mb-2">Tech Stack</h4>
                          <div className="flex flex-wrap gap-2">
                            {projects[currentProject].tech.map((tech, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 bg-white/10 text-white/90 rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {projects[currentProject].features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-white/80 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-black/30 rounded-xl">
                          <div className="text-center">
                            <p className="text-white/60 text-xs mb-1">Traffic</p>
                            <p className="text-white font-bold text-lg">{projects[currentProject].stats.visitors}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/60 text-xs mb-1">Conversion</p>
                            <p className="text-white font-bold text-lg">{projects[currentProject].stats.conversion}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/60 text-xs mb-1">Performance</p>
                            <p className="text-white font-bold text-lg">{projects[currentProject].stats.speed}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
                        View Live Site →
                      </button>
                    </div>
                  </motion.div>

                  {/* Navigation Controls */}
                  <div className="absolute bottom-4 left-0 right-0 px-8">
                    <div className="flex items-center justify-between">
                      {/* Previous Button */}
                      <button
                        onClick={() => setCurrentProject(prev => prev > 0 ? prev - 1 : projects.length - 1)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {/* Project Counter */}
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-sm">{currentProject + 1}</span>
                        <span className="text-white/40">/</span>
                        <span className="text-white/60 text-sm">{projects.length}</span>
                      </div>
                      
                      {/* Next Button */}
                      <button
                        onClick={() => setCurrentProject(prev => prev < projects.length - 1 ? prev + 1 : 0)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Side text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute -left-48 top-1/2 -translate-y-1/2 hidden lg:block"
          >
            <p className="text-zinc-400 text-sm mb-2">Recent Work</p>
            <p className="text-white text-lg font-semibold">250+ Sites Built</p>
            <p className="text-zinc-500 text-sm mt-4">Click to explore →</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute -top-4 -right-4 bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-medium"
      >
        Live Projects
      </motion.div>
    </div>
  );
}

export default function EteryHero() {
  const metrics = [
    { label: "Sites Built", value: "250+", trend: "Custom & Platform Sites" },
    { label: "Client Satisfaction", value: "98%", trend: "5-Star Reviews" },
    { label: "Avg Page Speed", value: "<2s", trend: "Lightning Fast" },
    { label: "Uptime", value: "99.9%", trend: "Always Online" }
  ];

  return (
    <section className="bg-[#0a0a0a] relative overflow-hidden pb-24">
      {/* Blue flame effect background */}
      <div className="absolute inset-0">
        {/* Primary flame glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-t from-[#0066ff]/40 via-[#0066ff]/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-t from-[#0066ff]/60 via-[#0066ff]/30 to-transparent blur-2xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-t from-[#0099ff]/80 via-[#0066ff]/40 to-transparent blur-xl" />
        
        {/* Side flames */}
        <div className="absolute bottom-0 left-1/3 -translate-x-1/2 w-[300px] h-[400px] bg-gradient-to-t from-[#0066ff]/30 via-[#0066ff]/10 to-transparent blur-2xl rotate-12" />
        <div className="absolute bottom-0 right-1/3 translate-x-1/2 w-[300px] h-[400px] bg-gradient-to-t from-[#0066ff]/30 via-[#0066ff]/10 to-transparent blur-2xl -rotate-12" />
        
        {/* Cyan accent flames */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[300px] bg-gradient-to-t from-cyan-400/40 to-transparent blur-xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="w-2 h-2 bg-[#0066ff] rounded-full" />
          <span className="text-zinc-400 text-sm">Professional Website Development</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.9] mb-6"
        >
          Beautiful<br />
          Websites That<br />
          Drive Results
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 text-lg mb-12 max-w-md"
        >
          Custom-built websites tailored to your brand - designed to convert visitors into customers.
        </motion.p>

        {/* CTA Buttons and Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-8 mb-20"
        >
          {/* Get Started Button */}
          <motion.button
            className="px-8 py-4 bg-[#0066ff] text-white font-medium rounded-lg border border-[#0066ff] border-t-[#0099ff] shadow-lg shadow-black/30 hover:bg-[#0052cc] hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get started
          </motion.button>

          {/* Reviews */}
          <div className="flex items-center gap-4">
            {/* Customer Avatars */}
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066ff] to-cyan-400 border-2 border-[#0a0a0a] flex items-center justify-center text-white text-xs font-semibold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            
            <div className="text-sm">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-400">
                5 stars from <span className="text-white font-medium">5.4k+ reviews</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Showcase iPad */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mb-16"
        >
          <PortfolioShowcase />
        </motion.div>

        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative"
        >
          {/* Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-[#0d0d0d]/90 backdrop-blur-sm border border-zinc-800 border-t-zinc-700 rounded-2xl p-6 shadow-lg shadow-black/50"
              >
                {/* Icon placeholder */}
                <div className="w-10 h-10 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-5 h-5 bg-zinc-600 rounded" />
                </div>
                
                <h3 className="text-zinc-400 text-sm mb-2">{metric.label}</h3>
                <p className="text-white text-2xl font-bold mb-3">{metric.value}</p>
                
                <div className="flex items-center gap-2 text-xs">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <span className="text-zinc-500">{metric.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="#services"
            className="text-zinc-500 text-sm hover:text-[#0066ff] transition-colors"
          >
            https://executiveaisolutions.com
          </a>
        </motion.div>

        {/* Buy Template button - Fixed position */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button className="px-6 py-3 bg-[#0066ff] text-white font-medium rounded-lg hover:bg-[#0052cc] transition-colors shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  );
}