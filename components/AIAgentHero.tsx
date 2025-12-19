"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

export default function AIAgentHero() {
  const [currentMetric, setCurrentMetric] = useState(0);
  
  const metrics = [
    { value: "40+ Hours", label: "Saved Weekly Per Client" },
    { value: "95%", label: "Error Reduction" },
    { value: "40-60%", label: "Cost Reduction" },
    { value: "10x", label: "Productivity Boost" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const floatingIcons = [
    // Top row
    { 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
      top: "5%", 
      left: "2%", 
      delay: 0 
    },
    { 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ), 
      top: "5%", 
      right: "2%", 
      delay: 0.2 
    },
    
    // Middle row
    { 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ), 
      top: "40%", 
      left: "-2%", 
      delay: 0.4 
    },
    { 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ), 
      top: "40%", 
      right: "-2%", 
      delay: 0.6 
    },
    
    // Bottom row
    { 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ), 
      top: "75%", 
      left: "2%", 
      delay: 0.8 
    },
    { 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ), 
      top: "75%", 
      right: "2%", 
      delay: 1 
    },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a] overflow-hidden flex items-center pb-0">
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0066ff]/5 to-transparent animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3">
              Cut Costs by<br />
              40-60% With<br />
              AI That Works
            </h1>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-zinc-700 rounded-full border-2 border-zinc-900" />
                <div className="w-8 h-8 bg-zinc-600 rounded-full border-2 border-zinc-900" />
                <div className="w-8 h-8 bg-zinc-700 rounded-full border-2 border-zinc-900" />
              </div>
              <p className="text-zinc-400 text-sm">
                Join <span className="text-white font-medium">200+ companies</span> already transforming with AI
              </p>
            </div>
            
            <p className="text-zinc-300 text-xl mb-4 max-w-xl">
              Automate 40+ hours of manual work every week. Handle expert-level tasks without hiring specialists. Scale instantly without adding headcount.
            </p>

            <p className="text-zinc-500 text-base mb-8 max-w-lg">
              Transform repetitive workflows into automated systems that run 24/7.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                className="px-8 py-4 bg-[#0066ff] text-white font-medium rounded-xl hover:bg-[#0052cc] transition-all duration-300 inline-flex items-center gap-3 group shadow-lg shadow-[#0066ff]/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Calculate Your ROI
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>

              <motion.button
                className="px-8 py-4 bg-zinc-900 text-white font-medium rounded-xl border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-300 inline-flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Free Assessment
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.button>
            </div>

            {/* Rotating Metrics */}
            <motion.div 
              className="mt-12 p-6 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0066ff]/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0066ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <motion.div
                    key={currentMetric}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-3xl font-bold text-white">{metrics[currentMetric].value}</p>
                    <p className="text-zinc-400 text-sm">{metrics[currentMetric].label}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:pl-24 xl:pl-32 2xl:pl-40"
          >
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 aspect-[4/5] lg:aspect-[3/4] min-h-[500px] lg:min-h-[600px] xl:min-h-[650px]">
              {/* Placeholder for person image - you can add an actual image here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-64 h-64 mx-auto mb-8 bg-gradient-to-br from-[#0066ff]/20 to-[#0066ff]/10 rounded-full flex items-center justify-center">
                    <svg className="w-32 h-32 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-zinc-400 text-base">Professional working relaxed while AI handles tasks</p>
                </div>
              </div>

              {/* Floating Icons Around Image */}
              {floatingIcons.map((item, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{ 
                    top: item.top, 
                    left: item.left, 
                    right: item.right 
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -10, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: item.delay },
                    scale: { duration: 0.5, delay: item.delay },
                    y: { duration: 3, repeat: Infinity, delay: item.delay }
                  }}
                >
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#0066ff]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-[#0066ff]/30 hover:bg-[#0066ff]/30 transition-all">
                    {React.cloneElement(item.icon, {
                      className: "w-7 h-7 text-white"
                    })}
                  </div>
                </motion.div>
              ))}

            </div>

            {/* Additional floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-[#0066ff]/10 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}