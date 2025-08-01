"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
function UseCaseCard({ useCase }: {
  useCase: typeof useCases[0];
}) {
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { 
    once: true, // Changed to once: true for better performance
    margin: "-20%",
    amount: 0.3
  });
  
  return (
    <motion.div
      ref={cardRef}
      key={useCase.title}
      initial={{ opacity: 0, y: 30 }}
      animate={isCardInView ? { 
        opacity: 1, 
        y: 0
      } : { 
        opacity: 0, 
        y: 30
      }}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut"
      }}
      className="group relative"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Background glow effect - always visible on mobile */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${useCase.color} rounded-2xl pointer-events-none opacity-10`}
      />
      
      <div className="relative rounded-2xl p-6 transition-all duration-300 bg-black/40 backdrop-blur-md border border-blue-500/10 overflow-hidden">
        {/* Static border glow for better performance */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-[-2px] rounded-2xl opacity-60"
            style={{
              background: "linear-gradient(45deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)",
              filter: "blur(6px)",
            }}
          />
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
  
  return (
    <div className="space-y-6">
      {useCases.map((useCase) => (
        <UseCaseCard
          key={useCase.title}
          useCase={useCase}
        />
      ))}
    </div>
  );
}