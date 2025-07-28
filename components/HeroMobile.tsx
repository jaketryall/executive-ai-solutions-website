"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useMobile";

export default function HeroMobile() {
  const [activeService, setActiveService] = useState<'automation' | 'landing'>('automation');
  const [animationKey, setAnimationKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  
  // Combined service cycling effect
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    let timer: NodeJS.Timeout;
    
    if (activeService === 'automation') {
      // Switch to landing pages after the pulse completes (around 6.4s)
      timer = setTimeout(() => {
        setActiveService('landing');
      }, 6400);
    } else if (activeService === 'landing') {
      // When on landing pages, switch back to automation after 8 seconds
      timer = setTimeout(() => {
        setActiveService('automation');
        setAnimationKey(prev => prev + 1); // Trigger new animation
      }, 8000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [activeService, prefersReducedMotion]);
  
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };
  
  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-black pt-24">
      {/* Gradient background - matching desktop */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-pink-600/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        
        {/* Decorative orbs */}
        <div className="absolute top-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern id=%22grid%22 width=%2260%22 height=%2260%22 patternUnits=%22userSpaceOnUse%22%3E%3Cpath d=%22M 60 0 L 0 0 0 60%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.03)%22 stroke-width=%221%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-50" />
      </div>
      
      
      {/* Content */}
      <div className="relative z-10 w-full px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Animated title */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="mb-8 text-center"
          >
            <motion.h1
              variants={titleVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-5xl sm:text-6xl font-light text-white mb-6"
            >
              We Build
              <span className="block relative mt-2 h-[1.5em]">
              <AnimatePresence mode="wait">
                {activeService === 'automation' ? (
                  <motion.span
                    key="automation"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 right-0 text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-500 bg-clip-text"
                  >
                    AI That Works
                  </motion.span>
                ) : (
                  <motion.span
                    key="landing"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 right-0 text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text"
                  >
                    Pages That Convert
                  </motion.span>
                )}
              </AnimatePresence>
              </span>
            </motion.h1>
          </motion.div>
          
          {/* Visual service card display - mobile optimized - moved right after title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative h-[400px] w-full mb-8"
          >
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                {activeService === 'automation' ? (
                  <motion.div
                    key="automation"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <div className="glass-card rounded-2xl p-6 h-full border border-[#0066ff]/20 bg-gradient-to-br from-[#0066ff]/10 to-transparent">
                      <div className="text-sm text-[#0066ff] mb-2 font-light">AI AUTOMATION</div>
                      <h3 className="text-xl text-white mb-4">Workflow Engine</h3>
                      
                      {/* Workflow visualization - mobile with cool desktop-like animation */}
                      <div className="relative h-48 bg-zinc-950 rounded-lg p-4 overflow-hidden flex items-center justify-center">
                        <motion.div 
                          key={`workflow-${animationKey}`}
                          className="flex items-center justify-between w-full px-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {/* Node 1: Data */}
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
                            className="flex flex-col items-center"
                          >
                            <div className="w-12 h-12 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center mb-1">
                              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                              </div>
                            </div>
                            <div className="text-[10px] text-zinc-400 text-center">Data</div>
                          </motion.div>
                          
                          {/* Connection line 1 */}
                          <div className="flex-1 relative mx-1 flex items-center h-12">
                            <div className="relative w-full h-0.5 flex items-center">
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                                className="absolute inset-0 bg-[#0066ff] origin-left"
                              />
                              <motion.div
                                initial={{ opacity: 0, left: "0%" }}
                                animate={{ opacity: 1, left: "calc(100% - 8px)" }}
                                transition={{ delay: 1.7, duration: 0.7 }}
                                className="absolute w-2 h-2 bg-[#60a5fa] rounded-full -top-1"
                              />
                            </div>
                          </div>
                          
                          {/* Node 2: Process */}
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 2.4, duration: 0.6, type: "spring" }}
                            className="flex flex-col items-center"
                          >
                            <div className="w-12 h-12 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center mb-1">
                              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                            </div>
                            <div className="text-[10px] text-zinc-400 text-center">Process</div>
                          </motion.div>
                          
                          {/* Connection line 2 */}
                          <div className="flex-1 relative mx-1 flex items-center h-12">
                            <div className="relative w-full h-0.5 flex items-center">
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 3.0, duration: 0.5 }}
                                className="absolute inset-0 bg-[#0066ff] origin-left"
                              />
                              <motion.div
                                initial={{ opacity: 0, left: "0%" }}
                                animate={{ opacity: 1, left: "calc(100% - 8px)" }}
                                transition={{ delay: 3.5, duration: 0.7 }}
                                className="absolute w-2 h-2 bg-[#60a5fa] rounded-full -top-1"
                              />
                            </div>
                          </div>
                          
                          {/* Node 3: AI */}
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 4.2, duration: 0.6, type: "spring" }}
                            className="flex flex-col items-center"
                          >
                            <div className="w-12 h-12 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center mb-1">
                              <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                              </div>
                            </div>
                            <div className="text-[10px] text-zinc-400 text-center">AI</div>
                          </motion.div>
                          
                          {/* Connection line 3 */}
                          <div className="flex-1 relative mx-1 flex items-center h-12">
                            <div className="relative w-full h-0.5 flex items-center">
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 4.8, duration: 0.5 }}
                                className="absolute inset-0 bg-[#0066ff] origin-left"
                              />
                              <motion.div
                                initial={{ opacity: 0, left: "0%" }}
                                animate={{ opacity: 1, left: "calc(100% - 8px)" }}
                                transition={{ delay: 5.3, duration: 0.7 }}
                                className="absolute w-2 h-2 bg-[#60a5fa] rounded-full -top-1"
                              />
                            </div>
                          </div>
                          
                          {/* Node 4: Output */}
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 5.2, duration: 0.5, type: "spring" }}
                            className="flex flex-col items-center"
                          >
                            <div className="w-12 h-12 bg-zinc-800 rounded-lg border border-zinc-700 flex items-center justify-center mb-1">
                              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            </div>
                            <div className="text-[10px] text-zinc-400 text-center">Output</div>
                          </motion.div>
                        </motion.div>
                        
                        {/* Pulse effect on completion */}
                        <motion.div
                          key={`pulse-${animationKey}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0.3, 0] }}
                          transition={{ delay: 5.7, duration: 0.7 }}
                          className="absolute inset-0 bg-gradient-to-r from-[#0066ff]/20 to-cyan-500/20 rounded-lg pointer-events-none"
                        />
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-14">
                        <div className="text-center">
                          <div className="text-xl font-light text-white">24/7</div>
                          <div className="text-xs text-zinc-500">Runtime</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-light text-white">100%</div>
                          <div className="text-xs text-zinc-500">Automated</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-light text-white">∞</div>
                          <div className="text-xs text-zinc-500">Scale</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="landing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <div className="glass-card rounded-2xl p-6 h-full border border-purple-600/20 bg-gradient-to-br from-purple-600/10 to-transparent">
                      <div className="text-sm text-purple-600 mb-2 font-light">LANDING PAGES</div>
                      <h3 className="text-xl text-white mb-4">AI Page Builder</h3>
                      
                      {/* Page preview animation */}
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <div className="h-full bg-zinc-900 border border-zinc-700 flex flex-col">
                          <div className="h-6 bg-zinc-800 flex items-center px-2 gap-1.5 flex-shrink-0">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                              <div className="w-2 h-2 rounded-full bg-yellow-500" />
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                          </div>
                          
                          <div className="flex-1 bg-black p-3 flex flex-col">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                              className="h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded mb-2"
                            />
                            
                            <div className="space-y-1">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "90%" }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="h-1.5 bg-zinc-700 rounded"
                              />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="h-1.5 bg-zinc-700 rounded"
                              />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="h-1.5 bg-zinc-700 rounded"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.9 }}
                                className="h-12 bg-purple-500/20 rounded"
                              />
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 1 }}
                                className="h-12 bg-pink-500/20 rounded"
                              />
                            </div>
                            
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 1.2 }}
                              className="mt-2 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center"
                            >
                              <span className="text-white text-xs font-medium">Get Started</span>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-14">
                        <div className="text-center">
                          <div className="text-xl font-light text-white">3x</div>
                          <div className="text-xs text-zinc-500">Faster</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-light text-white">AI</div>
                          <div className="text-xs text-zinc-500">Powered</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-light text-white">100%</div>
                          <div className="text-xs text-zinc-500">Custom</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Service pills - moved here before description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setActiveService('automation')}
                className={`px-6 py-3 rounded-full font-light transition-all whitespace-nowrap ${
                  activeService === 'automation'
                    ? 'bg-gradient-to-r from-[#0066ff] to-cyan-500 text-white scale-105'
                    : 'bg-zinc-900 text-zinc-400'
                }`}
              >
                AI Automation
              </button>
              <button
                onClick={() => setActiveService('landing')}
                className={`px-6 py-3 rounded-full font-light transition-all whitespace-nowrap ${
                  activeService === 'landing'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white scale-105'
                    : 'bg-zinc-900 text-zinc-400'
                }`}
              >
                Landing Pages
              </button>
            </div>
          </motion.div>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-lg text-zinc-400 mb-8 font-light leading-relaxed text-center"
          >
            Transform your business with AI automation and high-converting landing pages. Scale operations, increase conversions, work smarter.
          </motion.p>
          
          {/* Feature list - similar to desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="relative h-[100px] mb-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 space-y-3"
              >
                {activeService === 'automation' ? (
                  <>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-2 h-2 bg-[#0066ff] rounded-full animate-pulse" />
                      <span className="text-sm text-zinc-300">24/7 automated workflows</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                      <span className="text-sm text-zinc-300">Intelligent data processing</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-sm text-zinc-300">Scale without hiring</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                      <span className="text-sm text-zinc-300">AI-optimized for conversions</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                      <span className="text-sm text-zinc-300">Mobile-ready designs</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      <span className="text-sm text-zinc-300">Launch in hours, not weeks</span>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      
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
  );
}