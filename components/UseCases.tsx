"use client";

import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const useCases = [
  {
    title: "Flight School CRM",
    description: "Automated student management and scheduling for aviation training centers.",
    metrics: "50% time saved",
    category: "Education",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Real Estate Automations",
    description: "AI-powered lead qualification and property matching systems.",
    metrics: "3x more leads",
    category: "Real Estate",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "AI-powered Landing Pages",
    description: "Dynamic, personalized pages that adapt to each visitor.",
    metrics: "2x conversions",
    category: "Marketing",
    color: "from-orange-500/20 to-red-500/20",
  },
];

export default function UseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light mb-8 text-white">
            <span className="text-gradient-shine">Use Cases</span>
          </h2>
          <p className="text-xl text-zinc-600 font-light">
            See how AI transforms different industries.
          </p>
        </motion.div>

        <div className="space-y-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              {/* Background glow effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${useCase.color} rounded-2xl blur-xl`}
                animate={{
                  opacity: hoveredIndex === index ? 0.2 : 0,
                }}
                transition={{ duration: 0.4 }}
              />
              
              <div className="relative glass-card rounded-2xl p-8 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl lg:text-3xl font-light text-white">
                        {useCase.title}
                      </h3>
                      <span className="text-sm text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded-full">
                        {useCase.category}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-2xl">
                      {useCase.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-4xl font-light text-white">
                        {useCase.metrics}
                      </div>
                      <div className="text-sm text-zinc-500 mt-1">
                        potential
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: hoveredIndex === index ? 10 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" className="text-zinc-400"/>
                      </svg>
                    </motion.div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <motion.div className="mt-6 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${useCase.color}`}
                    initial={{ width: "0%" }}
                    animate={{ width: hoveredIndex === index ? "100%" : "0%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}