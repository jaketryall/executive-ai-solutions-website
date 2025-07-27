"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const useCases = [
  {
    title: "Customer Service AI",
    description: "Automated support that significantly reduces support workload, available 24/7.",
    metrics: "Higher automation",
    category: "Operations",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Real Estate Automations",
    description: "AI-powered lead qualification and property matching systems.",
    metrics: "More qualified leads",
    category: "Real Estate",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "AI-powered Landing Pages",
    description: "AI-powered landing pages optimized for conversions.",
    metrics: "Better conversions",
    category: "Marketing",
    color: "from-orange-500/20 to-red-500/20",
  },
];

export default function UseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Removed scroll-based animations for performance

  return (
    <section ref={ref} id="use-cases" className="pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-dark-blue overflow-hidden border-t border-blue-900/30">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 bg-circuit-pattern opacity-50 pointer-events-none" />
      
      {/* Animated dots overlay */}
      <div className="absolute inset-0 bg-animated-dots pointer-events-none" />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 pointer-events-none" />
      
      {/* Static gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-4 sm:mb-8 text-white text-gradient-shine"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Use Cases
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-zinc-400 font-light"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            See how AI transforms different industries.
          </motion.p>
        </motion.div>

        <div className="space-y-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              style={{ 
                transformPerspective: 1000
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
              onMouseMove={() => {
                if (hoveredIndex !== index) {
                  setHoveredIndex(index);
                }
              }}
            >
              {/* Background glow effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${useCase.color} rounded-2xl blur-xl pointer-events-none`}
                animate={{
                  opacity: hoveredIndex === index ? 0.2 : 0,
                }}
                transition={{ duration: 0.4 }}
              />
              
              <div className="relative rounded-xl sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 bg-black/40 backdrop-blur-md border border-blue-500/10 hover:border-blue-500/20 overflow-hidden">
                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-[-2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg" />
                </motion.div>
                
                {/* Content container */}
                <div className="relative bg-black/80 rounded-xl p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white">
                        {useCase.title}
                      </h3>
                      <span className="text-xs sm:text-sm text-zinc-300 bg-blue-900/20 border border-blue-500/20 px-2 sm:px-3 py-1 rounded-full">
                        {useCase.category}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
                      {useCase.description}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                    <div className="text-left sm:text-right">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-white">
                        {useCase.metrics}
                      </div>
                      <div className="text-xs sm:text-sm text-zinc-500 mt-1">
                        potential
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}