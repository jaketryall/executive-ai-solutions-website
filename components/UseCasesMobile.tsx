"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef } from "react";

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

// Separate component for each card to handle individual scroll animations
function UseCaseCard({ useCase, index, hoveredIndex, setHoveredIndex }: {
  useCase: typeof useCases[0];
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}) {
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { 
    once: false, 
    margin: "-20%",
    amount: 0.3
  });
  
  return (
    <motion.div
      ref={cardRef}
      key={useCase.title}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isCardInView ? { 
        opacity: 1, 
        y: 0,
        scale: 1
      } : { 
        opacity: 0, 
        y: 50,
        scale: 0.9
      }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1]
      }}
      onTouchStart={() => setHoveredIndex(index)}
      onTouchEnd={() => setHoveredIndex(null)}
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
      
      <div className="relative rounded-2xl p-6 transition-all duration-300 bg-black/40 backdrop-blur-md border border-blue-500/10 overflow-hidden">
        {/* Animated border glow - always visible on mobile with animation */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute inset-[-2px] rounded-2xl opacity-60"
            animate={{
              background: [
                "linear-gradient(0deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)",
                "linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)",
                "linear-gradient(180deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)",
                "linear-gradient(270deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)",
                "linear-gradient(360deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)",
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              filter: "blur(8px)",
            }}
          />
          {/* Extra glow on touch */}
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.div
                className="absolute inset-[-4px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  filter: "blur(12px)",
                }}
              />
            )}
          </AnimatePresence>
        </div>
        
        {/* Content container */}
        <div className="relative bg-black/80 rounded-xl p-6">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl font-light text-white flex-1">
                {useCase.title}
              </h3>
              <span className="text-xs text-zinc-300 bg-blue-900/20 border border-blue-500/20 px-3 py-1 rounded-full whitespace-nowrap">
                {useCase.category}
              </span>
            </div>
            
            {/* Description */}
            <p className="text-zinc-400 text-base font-light leading-relaxed">
              {useCase.description}
            </p>
            
            {/* Metrics */}
            <div className="mt-4">
              <div className="text-3xl font-light text-white">
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
  );
}

export default function UseCasesMobile() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div className="space-y-6">
      {useCases.map((useCase, index) => (
        <UseCaseCard
          key={useCase.title}
          useCase={useCase}
          index={index}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      ))}
    </div>
  );
}