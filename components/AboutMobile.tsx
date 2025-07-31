"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMobile";

const stats = [
  { 
    label: "Unlimited Automation Potential", 
    color: "from-blue-500 to-cyan-500",
    title: "Transform Your Operations",
    description: "Deploy intelligent automation across every aspect of your business. From customer service to data processing, our AI solutions adapt to your unique needs."
  },
  { 
    label: "Always-On Intelligence", 
    color: "from-purple-500 to-pink-500",
    title: "24/7 AI Workforce",
    description: "Your AI employees never sleep. They work around the clock, handling tasks, responding to customers, and keeping your business running smoothly."
  },
  { 
    label: "Boundless Productivity", 
    color: "from-orange-500 to-red-500",
    title: "Amplify Your Team",
    description: "Empower your human workforce with AI assistants that handle repetitive tasks, freeing them to focus on creative and strategic work."
  },
  { 
    label: "Infinite Scalability", 
    color: "from-green-500 to-emerald-500",
    title: "Grow Without Limits",
    description: "Scale your operations instantly. Add AI workers in minutes, not months. Handle 10x the workload without 10x the overhead."
  },
];

const defaultContent = {
  title: "We deploy AI that works",
  description: "No theory, no hype—just practical solutions that deliver results. Founded by an entrepreneur who understands real business challenges, I bridge the gap between cutting-edge AI and practical applications. Our AI employees enhance your workforce, automate repetitive tasks, and scale without limits."
};

// Separate component for each stat card with individual scroll animations
function StatCard({ stat, index, onTap, isActive }: {
  stat: typeof stats[0];
  index: number;
  onTap: () => void;
  isActive: boolean;
}) {
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { 
    once: true,
    margin: "-10%"
  });
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      animate={isCardInView ? { 
        opacity: 1
      } : { 
        opacity: 0
      }}
      transition={{ 
        duration: 0.2,
        delay: index * 0.05
      }}
      onClick={onTap}
      className="relative group cursor-pointer"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Card - simplified with no glow effect */}
      <div 
        className={`relative glass-card rounded-xl p-6 h-full min-h-[120px] flex items-center justify-center backdrop-blur-sm transition-colors duration-150 ${
          isActive 
            ? 'bg-black/60 border-2' 
            : 'bg-black/40 border border-white/10'
        } ${isActive ? `border-${stat.color.split(' ')[0].split('-')[1]}-500/60` : ''}`}
      >
        <div className="text-center w-full">
          <div className={`text-lg font-light bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.label}
          </div>
          {/* Tap indicator */}
          <div className="text-xs mt-2 h-4">
            {!isActive && (
              <span className="text-zinc-500">Tap to explore</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutMobile() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <section className="py-20 px-6 bg-black relative overflow-hidden">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      
      {/* Simplified static background for better performance */}
      <div 
        className="absolute inset-0"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-purple-950/20" />
        
        {/* Static mesh gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
          }}
        />
        
        {/* Static orbs - smaller and more subtle */}
        <div className="absolute top-10 -left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-lg" />
        <div className="absolute bottom-10 -right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-lg" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Title */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0 }}
          animate={isTitleInView ? { 
            opacity: 1
          } : { 
            opacity: 0
          }}
          transition={{ 
            duration: 0.2
          }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-light text-white overflow-hidden">
            <span className="text-gradient-shine inline-block">About Executive AI</span>
          </h2>
        </motion.div>

        {/* Main content */}
        <div className="mb-8">
          {/* Dynamic content with fixed height container */}
          <div className="relative h-[240px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredIndex ?? 'default'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center absolute inset-0 flex flex-col justify-center"
              >
                <h3 className="text-xl sm:text-2xl font-light text-white mb-3">
                  {hoveredIndex !== null ? stats[hoveredIndex].title : defaultContent.title}
                </h3>
                
                <p className="text-base text-zinc-400 font-light leading-relaxed px-4">
                  {hoveredIndex !== null ? stats[hoveredIndex].description : defaultContent.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Static line for better performance */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-6 mx-auto max-w-xs" />
        </div>

        {/* Stats grid - 2x2 for mobile */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              onTap={() => setHoveredIndex(hoveredIndex === index ? null : index)}
              isActive={hoveredIndex === index}
            />
          ))}
        </div>

        {/* Core Principles */}
        <div className="mt-16 pt-8">
          <h3 className="text-xl font-light mb-8 text-white text-center">
            Core Principles
          </h3>
          
          {/* Draggable carousel container */}
          <div className="relative overflow-hidden py-4 -mx-6 px-6">
            <motion.div
              className="flex gap-4 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -800, right: 0 }}
              dragElastic={0.2}
              dragMomentum={true}
              dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
              whileTap={{ cursor: "grabbing" }}
            >
              {[
                { text: "Practical over theoretical" },
                { text: "Results over promises" },
                { text: "Simple over complex" },
                { text: "Action over analysis" },
                { text: "Speed over perfection" },
                { text: "Data over opinions" }
              ].map((principle, index) => (
                <motion.div
                  key={principle.text}
                  className="glass-card rounded-lg p-4 text-center flex-shrink-0 min-w-[200px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="text-sm text-zinc-300 whitespace-nowrap">
                    {principle.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}