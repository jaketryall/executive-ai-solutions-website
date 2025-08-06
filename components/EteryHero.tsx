"use client";

import { motion } from "framer-motion";

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

        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          {/* Floating website preview cards behind metrics */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative"
            >
              {/* Main website card */}
              <div className="w-[600px] h-[400px] bg-gradient-to-br from-[#0066ff]/10 to-[#0066ff]/5 rounded-2xl border border-[#0066ff]/20 backdrop-blur-sm transform rotate-3 translate-x-20 translate-y-10">
                <div className="p-6">
                  <div className="h-3 w-32 bg-[#0066ff]/20 rounded mb-3" />
                  <div className="h-2 w-48 bg-zinc-800/20 rounded mb-6" />
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-zinc-800/10 rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Secondary floating card */}
              <div className="absolute -top-10 -left-20 w-[300px] h-[200px] bg-gradient-to-br from-cyan-400/10 to-[#0066ff]/10 rounded-xl border border-cyan-400/20 backdrop-blur-sm transform -rotate-6">
                <div className="p-4">
                  <div className="h-2 w-20 bg-cyan-400/20 rounded mb-2" />
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-zinc-800/20 rounded" />
                    <div className="h-1.5 w-4/5 bg-zinc-800/20 rounded" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
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