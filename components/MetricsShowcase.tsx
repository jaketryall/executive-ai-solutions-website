"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function MetricsShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0066ff]/5 to-black" />
      <div className="absolute left-0 top-1/2 w-1/3 h-1/3 bg-gradient-to-r from-[#0066ff]/10 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Section Label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <span className="text-[#0066ff] text-lg font-medium">//</span>
            <span className="text-zinc-400 text-lg font-light">About Us</span>
            <span className="text-[#0066ff] text-lg font-medium">//</span>
          </motion.div>

          {/* Main Content */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 max-w-5xl mx-auto"
          >
            We&apos;re a <span className="text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-400 bg-clip-text">cutting-edge AI studio</span> helping 
            startups, enterprises, and growing businesses{" "}
            <span className="text-transparent bg-gradient-to-r from-cyan-400 to-[#0066ff] bg-clip-text">transform operations</span> with 
            intelligent automation{" "}
            <span className="text-zinc-400 font-light italic">on demand.</span>
          </motion.h2>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.a
              href="#services"
              className="inline-flex items-center px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-full hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Why Choose Us
              <svg className="ml-3 w-4 h-4 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}