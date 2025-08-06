"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
            From{" "}
            <span className="text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-400 bg-clip-text">
              automation
            </span>{" "}
            to creative{" "}
            <span className="text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-400 bg-clip-text">
              AI
            </span>
            , <span className="italic font-light">our services are</span>
            <br />
            <span className="italic font-light">designed to</span>{" "}
            <span className="text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-400 bg-clip-text">
              unlock what&apos;s next
            </span>
          </h2>
        </motion.div>

        {/* Asymmetrical Stats Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Side - 3D Visual + 20K Stat */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* 3D Glass Visual */}
            <div className="relative w-full max-w-md mx-auto lg:mx-0">
              <div className="aspect-square bg-gradient-to-br from-[#0066ff]/20 to-cyan-400/10 rounded-3xl backdrop-blur-sm border border-[#0066ff]/20 p-8 relative overflow-hidden">
                {/* Vertical lines pattern */}
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="flex space-x-4">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-1 bg-gradient-to-b from-[#0066ff]/40 to-transparent rounded-full"
                        style={{ height: `${60 + i * 20}%` }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Inner glass orb */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#0066ff]/30 via-cyan-400/20 to-transparent backdrop-blur-lg border border-[#0066ff]/30">
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-br from-white/30 to-transparent"></div>
                </div>
              </div>

              {/* 20K+ Projects Stat */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-8 -right-8 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 text-center shadow-2xl"
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">20K+</div>
                <div className="text-zinc-400 font-medium">Projects Completed</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Description + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-12"
          >
            {/* Description */}
            <div>
              <p className="text-xl lg:text-2xl text-zinc-300 font-light leading-relaxed">
                We create smart solutions that help brands move fast, work smarter, and grow to their full potential.
              </p>
            </div>

            {/* Floating Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* 130K+ Stat */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">130K+</div>
                <div className="text-zinc-400 font-medium">Audiences reached</div>
              </motion.div>

              {/* 24+ Awards Stat */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
                className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">24+</div>
                <div className="text-zinc-400 font-medium">Worldwide awards</div>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.a
                href="#contact"
                className="inline-flex items-center px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-zinc-100 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Now
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}