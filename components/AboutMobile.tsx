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

export default function AboutMobile() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <section ref={ref} className="py-20 px-6 bg-black relative overflow-hidden">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      
      {/* Multi-layer animated background */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-purple-950/20" />
        
        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-10 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 25, 0],
            scale: [1, 1.2, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -25, -50, 0],
            scale: [1, 1.1, 1.2, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated particles - reduced for mobile */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => {
            const seed = i * 137.5;
            const left = ((seed * 7) % 100);
            const top = ((seed * 13) % 100);
            const xMove1 = ((seed * 17) % 100) - 50;
            const xMove2 = ((seed * 23) % 100) - 50;
            const yMove1 = ((seed * 29) % 100) - 50;
            const yMove2 = ((seed * 31) % 100) - 50;
            const duration = ((seed * 37) % 20) + 30;
            
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  x: [0, xMove1, xMove2, 0],
                  y: [0, yMove1, yMove2, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto relative">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
          animate={isInView ? { 
            opacity: 1, 
            x: 0,
            filter: "blur(0px)"
          } : { 
            opacity: 0, 
            x: -50,
            filter: "blur(10px)"
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-light text-white overflow-hidden">
            <span className="text-gradient-shine inline-block">About Executive AI</span>
          </h2>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          {/* Dynamic content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={hoveredIndex ?? 'default'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h3 className="text-xl sm:text-2xl font-light text-white mb-3">
                {hoveredIndex !== null ? stats[hoveredIndex].title : defaultContent.title}
              </h3>
              
              <p className="text-base text-zinc-400 font-light leading-relaxed px-4">
                {hoveredIndex !== null ? stats[hoveredIndex].description : defaultContent.description}
              </p>
            </motion.div>
          </AnimatePresence>
          
          {/* Animated line */}
          <motion.div
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full overflow-hidden mt-6 mx-auto max-w-xs relative"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            style={{ transformOrigin: "left" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 1.5,
                delay: prefersReducedMotion ? 0 : 0.6,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>

        {/* Stats grid - 2x2 for mobile */}
        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 30,
                filter: "blur(10px)"
              }}
              animate={isInView ? { 
                opacity: 1, 
                scale: 1, 
                y: 0,
                filter: "blur(0px)"
              } : { 
                opacity: 0, 
                scale: 0.8, 
                y: 30,
                filter: "blur(10px)"
              }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.6, 
                delay: prefersReducedMotion ? 0 : 0.4 + index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              onTouchStart={() => setHoveredIndex(index)}
              onTouchEnd={() => setTimeout(() => setHoveredIndex(null), 300)}
              className="relative group"
            >
              {/* Animated glow background */}
              <motion.div
                className={`absolute -inset-2 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl`}
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 0.4 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Card with floating animation */}
              <motion.div 
                className="relative glass-card rounded-xl p-6 h-full min-h-[120px] flex items-center justify-center backdrop-blur-xl border border-white/10"
                animate={{
                  y: hoveredIndex === index ? -5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center w-full">
                  <div className={`text-lg font-light bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Principles */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.8,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="mt-16 pt-8"
        >
          <motion.h3 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.9,
              ease: "easeOut"
            }}
            className="text-xl font-light mb-8 text-white text-center"
          >
            Core Principles
          </motion.h3>
          
          {/* Carousel container */}
          <div className="relative overflow-hidden py-4">
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? {
                opacity: 1,
                x: ["50px", "-50%"],
              } : { opacity: 0, x: 50 }}
              transition={{
                opacity: { duration: 0.6, delay: 1 },
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1.1,
                },
              }}
            >
              {/* Double the principles for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-4 flex-shrink-0">
                  {[
                    { text: "Practical over theoretical" },
                    { text: "Results over promises" },
                    { text: "Simple over complex" },
                    { text: "Action over analysis" },
                    { text: "Speed over perfection" },
                    { text: "Data over opinions" }
                  ].map((principle) => (
                    <div
                      key={`${setIndex}-${principle.text}`}
                      className="glass-card rounded-lg p-4 text-center flex-shrink-0 min-w-[200px]"
                    >
                      <p className="text-sm text-zinc-300 whitespace-nowrap">
                        {principle.text}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
            
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black to-transparent pointer-events-none z-10 opacity-50" />
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black to-transparent pointer-events-none z-10 opacity-50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}