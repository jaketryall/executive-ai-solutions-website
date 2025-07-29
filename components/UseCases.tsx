"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useIsMobile, useReducedMotion } from "@/hooks/useMobile";
import dynamic from "next/dynamic";

const UseCasesMobile = dynamic(() => import("./UseCasesMobile"), {
  loading: () => <div className="py-16 px-4 bg-zinc-900 min-h-screen" />,
  ssr: false
});

const useCases = [
  {
    title: "Customer Service AI",
    description: "Reduce support workload by 80% with intelligent AI agents handling customer inquiries 24/7.",
    metrics: "80% Less Support Work",
    category: "Operations",
    color: "from-blue-500/20 to-cyan-500/20",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Real Estate Automation",
    description: "Qualify leads instantly and match properties automatically with AI-powered systems.",
    metrics: "5x More Qualified Leads",
    category: "Real Estate",
    color: "from-purple-500/20 to-pink-500/20",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "AI Landing Pages",
    description: "Create high-converting pages optimized for maximum engagement and conversions.",
    metrics: "3x Better Conversions",
    category: "Marketing",
    color: "from-orange-500/20 to-red-500/20",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    gradient: "from-orange-500 to-red-500",
  },
];

export default function UseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMobile = useIsMobile(1024);
  const prefersReducedMotion = useReducedMotion();
  
  // Scroll-based opacity transitions
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.75, 0.9], [0, 1, 1, 0]);

  return (
    <section ref={ref} id="use-cases" className="pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-dark-blue overflow-hidden">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      
      {/* Animated dots overlay */}
      <div className="absolute inset-0 bg-animated-dots pointer-events-none" />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 pointer-events-none" />
      
      {/* Static gradient orbs - reduced size and opacity */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-purple-500/5 rounded-full blur-2xl" />
      
      <motion.div 
        className="max-w-7xl mx-auto relative"
        style={{ opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 sm:mb-16 lg:mb-20"
          style={{ opacity: titleOpacity }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-4 sm:mb-8 text-white text-gradient-shine text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Use Cases
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-zinc-400 font-light text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            See how AI transforms different industries.
          </motion.p>
        </motion.div>

        {/* Mobile view - custom animated version */}
        {isMobile ? (
          <motion.div 
            style={{ opacity: cardsOpacity }}
          >
            <UseCasesMobile />
          </motion.div>
        ) : (
          /* Desktop view - keep existing design */
          <motion.div 
            className="space-y-6"
            style={{ opacity: cardsOpacity }}
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.5, 
                  delay: prefersReducedMotion ? 0 : index * 0.1,
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
              >
                {/* Background glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${useCase.color} rounded-2xl blur-xl pointer-events-none`}
                  animate={{
                    opacity: hoveredIndex === index ? 0.2 : 0,
                  }}
                  transition={{ duration: 0.4 }}
                />
                
                <div className="relative rounded-2xl p-8 transition-all duration-300 bg-black/40 backdrop-blur-md border border-blue-500/10 hover:border-blue-500/20 overflow-hidden">
                  {/* Animated border glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-[-2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg" />
                  </motion.div>
                  
                  {/* Content container */}
                  <div className="relative bg-black/80 rounded-xl p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-3xl font-light text-white">
                            {useCase.title}
                          </h3>
                          <span className="text-sm text-zinc-300 bg-blue-900/20 border border-blue-500/20 px-3 py-1 rounded-full">
                            {useCase.category}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-2xl">
                          {useCase.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-light text-white">
                          {useCase.metrics}
                        </div>
                        <div className="text-sm text-zinc-500 mt-1">
                          potential
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}