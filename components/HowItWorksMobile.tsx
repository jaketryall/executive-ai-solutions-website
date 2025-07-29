"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Book a Strategy Call",
    description: "Tell us about your business goals. We'll identify where AI automation can save time and how a high-converting landing page can accelerate growth.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/20 to-cyan-500/20",
  },
  {
    number: "02",
    title: "Get Your Custom Roadmap",
    description: "Receive a tailored plan for AI automation implementation and/or landing page design, with clear milestones for your chosen services.",
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-500/20 to-pink-500/20",
  },
  {
    number: "03",
    title: "Deploy & Scale",
    description: "Launch your AI workforce and/or new landing page with our support. Start small, measure results, and scale what delivers real business impact.",
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-500/20 to-red-500/20",
  },
];

// Separate component for each step card with individual scroll animations
function StepCard({ step, index }: {
  step: typeof steps[0];
  index: number;
}) {
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { 
    once: true,
    margin: "-20%",
    amount: 0.3
  });
  
  return (
    <motion.div
      ref={cardRef}
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
      className="relative"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Step card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 backdrop-blur-xl border border-white/10">
        {/* Step number */}
        <div className="flex flex-col items-center text-center mb-4">
          <span className={`text-5xl sm:text-6xl font-light text-transparent bg-gradient-to-br ${step.color} bg-clip-text mb-4`}>
            {step.number}
          </span>
          <div className="w-full">
            <h3 className="text-xl sm:text-2xl font-light mb-3 text-white text-center">
              {step.title}
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed text-center">
              {step.description}
            </p>
          </div>
        </div>
        
        {/* Progress bar - static gradient on mobile */}
        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-6">
          <div
            className={`h-full bg-gradient-to-r ${step.color}`}
          />
        </div>
      </div>
      
      {/* Connection line (except for last item) */}
      {index < steps.length - 1 && (
        <div className="relative w-1 h-16 mx-auto mt-6">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-700 to-zinc-600 rounded-full" />
        </div>
      )}
    </motion.div>
  );
}

export default function HowItWorksMobile() {
  const headerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-50px" });

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-zinc-950 relative overflow-hidden">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />

      <div className="relative px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            ref={headerRef}
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transform: 'translateZ(0)' }}
          >
            <h2 className="text-4xl sm:text-5xl font-light mb-4 text-white">
              <span className="text-gradient-shine">Process</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 font-light max-w-2xl mx-auto px-4">
              Three steps to transform your business with AI automation and high-converting landing pages
            </p>
          </motion.div>
          
          {/* Steps */}
          <div className="space-y-6 sm:space-y-8">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                index={index}
              />
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            ref={ctaRef}
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transform: 'translateZ(0)' }}
          >
            <a href="#contact">
              <motion.button 
                className="relative text-white border border-zinc-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-light text-sm sm:text-base overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Start the conversation →</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
    </section>
  );
}