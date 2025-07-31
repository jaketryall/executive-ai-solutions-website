"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useMobile";
import { useOptimizedAnimation } from "@/hooks/usePerformance";
import dynamic from "next/dynamic";

const HeroMobile = dynamic(() => import("./HeroMobile"), {
  loading: () => <div className="relative min-h-screen bg-black" />,
  ssr: false
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState<'automation' | 'landing'>('automation');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { enableParallax } = useOptimizedAnimation();
  
  // Parallax scroll - always call hook
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  
  // const y = useTransform(scrollYProgress, [0, 1], !enableParallax ? [0, 0] : [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Function to reset and start the interval
  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setActiveService(prev => prev === 'automation' ? 'landing' : 'automation');
    }, 8000); // 8 seconds to allow full animation to complete
  }, []);
  
  // Create callbacks for button clicks
  const handleAutomationClick = useCallback(() => {
    setActiveService('automation');
    resetInterval();
  }, [resetInterval]);
  
  const handleLandingClick = useCallback(() => {
    setActiveService('landing');
    resetInterval();
  }, [resetInterval]);
  
  // Set up auto-cycle on mount
  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetInterval]); // Include resetInterval in dependency array

  return (
    <>
      {/* Mobile Hero - shown below lg breakpoint */}
      <div className="lg:hidden">
        <HeroMobile />
      </div>

      {/* Desktop Hero - shown at lg breakpoint and above */}
      <section ref={sectionRef} className="hidden lg:flex relative min-h-screen items-start justify-center overflow-hidden bg-black pt-32">
      {/* Gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-pink-600/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        style={!prefersReducedMotion && enableParallax ? { opacity } : {}}
      >
        {/* Main content flex container */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center min-h-[calc(100vh-8rem)] lg:min-h-0 justify-center py-8 sm:py-4 lg:py-0">
          {/* Left side - Text content */}
          <div className="flex-1 max-w-2xl lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[5.5rem] xl:text-[6rem] font-light mb-24 sm:mb-32 text-white leading-tight text-center lg:text-left">
                We Build
                <span className="block relative mt-2 h-[1.5em]">
                  <AnimatePresence mode="wait">
                    {activeService === 'automation' ? (
                      <motion.span
                        key="automation"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-0 right-0 text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-500 bg-clip-text"
                      >
                        AI That Works
                      </motion.span>
                    ) : (
                      <motion.span
                        key="landing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-0 right-0 text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text"
                      >
                        Pages That Convert
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </h1>
              
              <p className="text-base xs:text-lg sm:text-xl text-zinc-400 mb-6 sm:mb-8 font-light leading-relaxed mt-4 text-center lg:text-left">
                Transform your business with AI automation and high-converting landing pages.{' '}
                <span className="hidden sm:inline">Scale operations, increase conversions, work smarter.</span>
                <span className="sm:hidden">Scale operations, work smarter.</span>
              </p>
              
              {/* Service toggles */}
              <div className="flex gap-2 xs:gap-3 sm:gap-4 mb-6 sm:mb-8 flex-wrap justify-center lg:justify-start">
                <button
                  onClick={handleAutomationClick}
                  className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-full font-light transition-all text-xs xs:text-sm sm:text-base touch-target ${
                    activeService === 'automation'
                      ? 'bg-gradient-to-r from-[#0066ff] to-cyan-500 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                  aria-pressed={activeService === 'automation'}
                  aria-label="View AI Automation services"
                >
                  AI Automation
                </button>
                <button
                  onClick={handleLandingClick}
                  className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-full font-light transition-all text-xs xs:text-sm sm:text-base touch-target ${
                    activeService === 'landing'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                  aria-pressed={activeService === 'landing'}
                  aria-label="View Landing Page creation services"
                >
                  Landing Pages
                </button>
              </div>
              
              {/* Feature list - fixed height container */}
              <div className="relative h-[90px] xs:h-[100px] sm:h-[120px] mb-6 sm:mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeService}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 space-y-3"
                  >
                    {activeService === 'automation' ? (
                      <>
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                          <div className="w-2 h-2 bg-[#0066ff] rounded-full" />
                          <span className="text-sm sm:text-base text-zinc-300">24/7 automated workflows</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                          <span className="text-sm sm:text-base text-zinc-300">Intelligent data processing</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm sm:text-base text-zinc-300">Scale without hiring</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                          <div className="w-2 h-2 bg-purple-600 rounded-full" />
                          <span className="text-sm sm:text-base text-zinc-300">AI-optimized for conversions</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                          <div className="w-2 h-2 bg-pink-500 rounded-full" />
                          <span className="text-sm sm:text-base text-zinc-300">Mobile-ready designs</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                          <span className="text-sm sm:text-base text-zinc-300">Launch in hours, not weeks</span>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          
          {/* Right side - Visual showcase - responsive */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[300px] sm:h-[400px] lg:h-[600px] w-full lg:w-[450px] xl:w-[500px] 2xl:w-[600px] mt-8 lg:mt-0 flex-shrink-0"
          >
            {/* Service card display */}
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                {activeService === 'automation' ? (
                  <motion.div
                    key="automation"
                    initial={{ opacity: 0, rotateY: 20, x: 100 }}
                    animate={{ opacity: 1, rotateY: 0, x: 0 }}
                    exit={{ opacity: 0, rotateY: -20, x: -100 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                    className="absolute inset-0"
                  >
                    <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 h-full border border-[#0066ff]/20 bg-gradient-to-br from-[#0066ff]/10 to-transparent">
                      <div className="text-xs sm:text-sm text-[#0066ff] mb-2 sm:mb-4 font-light">AI AUTOMATION</div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl text-white mb-4 sm:mb-6">Workflow Engine</h3>
                      
                      {/* AI Automation workflow visualization - simplified for mobile */}
                      <div className="relative h-40 sm:h-60 lg:h-80 bg-zinc-950 rounded-lg p-2 sm:p-4 overflow-hidden">
                        
                        <div className="relative h-full flex items-center justify-center">
                          {false ? (
                            // Simplified mobile visualization
                            <div className="grid grid-cols-2 gap-3 w-full">
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                                className="bg-zinc-800 rounded-lg p-3 border border-zinc-700"
                              >
                                <div className="w-8 h-8 bg-orange-500 rounded mb-2 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                  </svg>
                                </div>
                                <div className="text-xs text-zinc-400">Data</div>
                              </motion.div>
                              
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
                                className="bg-zinc-800 rounded-lg p-3 border border-zinc-700"
                              >
                                <div className="w-8 h-8 bg-blue-500 rounded mb-2 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                                <div className="text-xs text-zinc-400">Process</div>
                              </motion.div>
                              
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
                                className="bg-zinc-800 rounded-lg p-3 border border-zinc-700"
                              >
                                <div className="w-8 h-8 bg-purple-500 rounded mb-2 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </div>
                                <div className="text-xs text-zinc-400">AI</div>
                              </motion.div>
                              
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.4, ease: "easeOut" }}
                                className="bg-zinc-800 rounded-lg p-3 border border-zinc-700"
                              >
                                <div className="w-8 h-8 bg-green-500 rounded mb-2 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div className="text-xs text-zinc-400">Output</div>
                              </motion.div>
                            </div>
                          ) : (
                            // Desktop visualization
                            <div className="flex items-start justify-between w-full px-4 pt-8">
                            {/* Node 1: Data Collection */}
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                              className="flex flex-col items-center flex-shrink-0"
                            >
                              <div className="w-20 h-20 bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center mb-2">
                                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                  </svg>
                                </div>
                              </div>
                              <div className="text-xs text-zinc-400 text-center mt-2 h-10 flex flex-col items-center justify-center leading-tight">Data<br/>Collection</div>
                            </motion.div>
                            
                            <div className="flex-1 relative" style={{ marginTop: '40px' }}>
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 1.6, duration: 0.8 }}
                                className="absolute inset-x-0 h-0.5 bg-[#0066ff] origin-left"
                                style={{ top: '0' }}
                              />
                            </div>
                            
                            {/* Node 2: Processing */}
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 2.0, duration: 0.5, ease: "easeOut" }}
                              className="flex flex-col items-center flex-shrink-0"
                            >
                              <div className="w-20 h-20 bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center mb-2">
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="text-xs text-zinc-400 text-center mt-2 h-10 flex items-center justify-center">Processing</div>
                            </motion.div>
                            
                            <div className="flex-1 relative" style={{ marginTop: '40px' }}>
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 2.8, duration: 0.8 }}
                                className="absolute inset-x-0 h-0.5 bg-[#0066ff] origin-left"
                                style={{ top: '0' }}
                              />
                            </div>
                            
                            {/* Node 3: AI Analysis */}
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 3.2, duration: 0.5, ease: "easeOut" }}
                              className="flex flex-col items-center flex-shrink-0"
                            >
                              <div className="w-20 h-20 bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center mb-2">
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="text-xs text-zinc-400 text-center mt-2 h-10 flex flex-col items-center justify-center leading-tight">AI<br/>Analysis</div>
                            </motion.div>
                            
                            <div className="flex-1 relative" style={{ marginTop: '40px' }}>
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 4.0, duration: 0.8 }}
                                className="absolute inset-x-0 h-0.5 bg-[#0066ff] origin-left"
                                style={{ top: '0' }}
                              />
                            </div>
                            
                            {/* Node 4: Automated Output */}
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 4.4, duration: 0.5, ease: "easeOut" }}
                              className="flex flex-col items-center flex-shrink-0"
                            >
                              <div className="w-20 h-20 bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center mb-2">
                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="text-xs text-zinc-400 text-center mt-2 h-10 flex flex-col items-center justify-center leading-tight">Automated<br/>Output</div>
                            </motion.div>
                          </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="text-center">
                          <div className="text-2xl font-light text-white">24/7</div>
                          <div className="text-xs text-zinc-500">Workers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-light text-white">100%</div>
                          <div className="text-xs text-zinc-500">Automated</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-light text-white">∞</div>
                          <div className="text-xs text-zinc-500">Scale</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="landing"
                    initial={{ opacity: 0, rotateY: -20, x: -100 }}
                    animate={{ opacity: 1, rotateY: 0, x: 0 }}
                    exit={{ opacity: 0, rotateY: 20, x: 100 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                    className="absolute inset-0"
                  >
                    <div className="glass-card rounded-2xl p-8 h-full border border-purple-600/20 bg-gradient-to-br from-purple-600/10 to-transparent">
                      <div className="text-sm text-purple-600 mb-4 font-light">LANDING PAGES</div>
                      <h3 className="text-2xl text-white mb-6">AI Page Builder</h3>
                      
                      {/* Page preview animation */}
                      <div className="relative h-80 rounded-lg overflow-hidden">
                        <div className="h-full bg-zinc-900 border border-zinc-700 flex flex-col">
                          <div className="h-8 bg-zinc-800 flex items-center px-3 gap-2 flex-shrink-0">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500" />
                              <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                          </div>
                          
                          <div className="flex-1 bg-black p-3 flex flex-col">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                              className="h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded mb-3"
                            />
                            
                            <div className="space-y-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "90%" }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="h-2 bg-zinc-700 rounded"
                              />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="h-2 bg-zinc-700 rounded"
                              />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="h-2 bg-zinc-700 rounded"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mt-4">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="h-20 bg-purple-500/20 rounded"
                              />
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 1 }}
                                className="h-20 bg-pink-500/20 rounded"
                              />
                            </div>
                            
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 1.2 }}
                              className="mt-3 sm:mt-6 h-10 sm:h-12 lg:h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center"
                            >
                              <span className="text-white text-xs sm:text-sm font-medium">Get Started</span>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="text-center">
                          <div className="text-2xl font-light text-white">3x</div>
                          <div className="text-xs text-zinc-500">Faster</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-light text-white">AI</div>
                          <div className="text-xs text-zinc-500">Powered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-light text-white">100%</div>
                          <div className="text-xs text-zinc-500">Custom</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
            <rect x="1" y="1" width="22" height="38" rx="11" stroke="#0066ff" strokeWidth="2" opacity="0.5"/>
            <motion.rect
              x="10" y="8"
              width="4" height="8"
              rx="2"
              fill="#0066ff"
              animate={{ y: [8, 16, 8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
    </>
  );
}