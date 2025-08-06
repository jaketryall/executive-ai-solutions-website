"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function WhatWeOffer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0066ff]/10 to-black" />
      <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-gradient-to-l from-cyan-400/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute left-0 bottom-1/4 w-1/3 h-1/3 bg-gradient-to-r from-[#0066ff]/10 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
            What We{" "}
            <span className="text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-400 bg-clip-text">
              Build
            </span>{" "}
            - Websites that drive real results, enhanced with AI
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* AI-Powered Chatbots */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Mock Chatbot UI */}
            <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 relative overflow-hidden">
              <div className="space-y-4">
                {/* Chat messages */}
                <div className="flex justify-end">
                  <div className="bg-[#0066ff] text-white px-4 py-2 rounded-2xl rounded-br-md max-w-xs">
                    How can I help you today?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-2xl rounded-bl-md max-w-xs">
                    I need help with my order
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#0066ff] text-white px-4 py-2 rounded-2xl rounded-br-md max-w-xs flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>Typing...</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-zinc-500 mb-2">
                    <span>AI Processing</span>
                    <span>87%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="w-[87%] h-full bg-[#0066ff] rounded-full"></div>
                  </div>
                </div>
                {/* Play button */}
                <div className="flex justify-center pt-2">
                  <div className="w-10 h-10 bg-[#0066ff] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">AI-Enhanced Websites</h3>
              <p className="text-zinc-400 text-lg font-light leading-relaxed">
                Smart features like chatbots, search, and personalized content.
              </p>
            </div>
          </motion.div>

          {/* Blockchain Integration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Mock Blockchain UI */}
            <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 relative overflow-hidden">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0066ff]/20 rounded-2xl mb-4">
                  <div className="w-8 h-8 border-2 border-[#0066ff] rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">100%</div>
                <div className="text-[#0066ff] text-sm font-medium mb-4">Data transparency</div>
                
                {/* Network visualization */}
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <div className="w-3 h-3 bg-[#0066ff] rounded-full"></div>
                  <div className="w-8 h-px bg-[#0066ff]"></div>
                  <div className="w-3 h-3 bg-[#0066ff] rounded-full"></div>
                  <div className="w-8 h-px bg-[#0066ff]"></div>
                  <div className="w-3 h-3 bg-[#0066ff] rounded-full"></div>
                </div>
                
                {/* Icons */}
                <div className="flex justify-around">
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#0066ff] rounded"></div>
                  </div>
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#0066ff] rounded-full"></div>
                  </div>
                  <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#0066ff]"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Performance Optimization</h3>
              <p className="text-zinc-400 text-lg font-light leading-relaxed">
                Lightning-fast websites with AI-powered monitoring and optimization.
              </p>
            </div>
          </motion.div>

          {/* Lead Generation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-8"
          >
            {/* Mock Lead Gen UI */}
            <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 relative overflow-hidden">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="text-white font-medium">John Doe</div>
                  <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
                <div className="text-zinc-400 text-sm">President of Sales</div>
                
                {/* Progress bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span>Lead Score</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-[#0066ff] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span>Engagement</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="w-[78%] h-full bg-[#0066ff] rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Generate button */}
                <div className="flex justify-center pt-2">
                  <button className="bg-[#0066ff] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                    Generate Leads
                    <svg className="ml-2 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">SEO & Analytics</h3>
              <p className="text-zinc-400 text-lg font-light leading-relaxed">
                AI-powered SEO recommendations and user behavior insights.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Additional Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-16">
          
          {/* Target Audience Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-[#0066ff]/10 backdrop-blur-sm border border-[#0066ff]/20 rounded-2xl p-8"
          >
            <h4 className="text-xl font-bold text-white mb-4">We build for</h4>
            <div className="space-y-3">
              {["Small Businesses", "Startups", "E-commerce Brands", "SaaS Companies", "Agencies", "Enterprises"].map((audience, index) => (
                <div key={index} className="bg-[#0066ff]/20 text-[#0066ff] px-4 py-2 rounded-full text-center font-medium">
                  {audience}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image & Video Generation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
            className="space-y-8"
          >
            {/* Mock Image Gen UI */}
            <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-white font-medium mb-2">Generating image...</div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
                  <div className="w-3/4 h-full bg-[#0066ff] rounded-full"></div>
                </div>
                <button className="bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Generate
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Content Management</h3>
              <p className="text-zinc-400 text-lg font-light leading-relaxed">
                Easy content updates with AI writing and image generation tools.
              </p>
            </div>
          </motion.div>

          {/* AI Consultation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="space-y-8"
          >
            {/* Mock Analytics Chart */}
            <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#0066ff] text-sm font-medium">Growth</span>
                  <span className="text-[#0066ff] text-sm font-medium">Efficiency: 87%</span>
                </div>
                
                {/* Simple chart visualization */}
                <div className="flex items-end justify-between h-24 space-x-2">
                  {[40, 60, 35, 80, 55, 90, 70].map((height, index) => (
                    <div 
                      key={index}
                      className="bg-[#0066ff] rounded-t-sm flex-1"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Cost: 67%</span>
                  <span className="text-[#0066ff]">•</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">Custom Integrations</h3>
              <p className="text-zinc-400 text-lg font-light leading-relaxed">
                Connect your website with any API or third-party service.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA and Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-16 space-y-8"
        >
          <p className="text-xl lg:text-2xl text-zinc-300 font-light leading-relaxed max-w-4xl mx-auto">
            We build modern websites that leverage AI technology to help your business grow faster and smarter.
          </p>
          
          <motion.a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-zinc-100 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let&apos;s Talk
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}