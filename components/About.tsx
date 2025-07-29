"use client";

import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useIsMobile, useReducedMotion } from "@/hooks/useMobile";
import dynamic from "next/dynamic";

const AboutMobile = dynamic(() => import("./AboutMobile"), {
  loading: () => <div className="py-24 px-4 bg-black min-h-screen" />,
  ssr: false
});

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMobile = useIsMobile(1023);
  const prefersReducedMotion = useReducedMotion();
  
  // Scroll-based animations - always call hook
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

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
  
  // Parallax transforms - always create but conditionally use
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 1]);
  
  // Enhanced content opacity
  const mainContentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.8, 1, 1, 1]);
  const statsOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.75, 0.9], [0.8, 1, 1, 1]);

  return (
    <>
      {/* Mobile version - shown below lg breakpoint */}
      <div className="lg:hidden">
        <AboutMobile />
      </div>
      
      {/* Desktop version - shown at lg breakpoint and above */}
      <div className="hidden lg:block">
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      
      {/* Multi-layer animated background */}
      <motion.div 
        className="absolute inset-0"
        style={!isMobile ? { opacity } : {}}
      >
        {/* Base gradient with parallax */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-purple-950/20" 
          style={!isMobile ? { y: bgY } : {}}
        />
        
        {/* Animated mesh gradient - disabled on mobile */}
        {!isMobile && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              ]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {/* Floating orbs with parallax - reduced size and opacity */}
        <motion.div
          className="absolute top-20 -left-20 w-48 h-48 bg-blue-500/5 rounded-full blur-xl"
          style={!isMobile ? { y: orb1Y, transform: 'translateZ(0)' } : { transform: 'translateZ(0)' }}
          animate={{
            x: [0, 100, 50, 0],
            scale: [1, 1.2, 1.1, 1],
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-xl"
          style={!isMobile ? { y: orb2Y, transform: 'translateZ(0)' } : { transform: 'translateZ(0)' }}
          animate={{
            x: [0, -50, -100, 0],
            scale: [1, 1.1, 1.2, 1],
          }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        
        
        {/* Animated particles - reduced count and simplified */}
        {!isMobile && !prefersReducedMotion && (
          <div className="absolute inset-0">
            {[...Array(10)].map((_, i) => {
              // Use deterministic values based on index
              const seed = i * 137.5;
              const left = ((seed * 7) % 100);
              const top = ((seed * 13) % 100);
              const xMove = ((seed * 17) % 100) - 50;
              const yMove = ((seed * 23) % 100) - 50;
              const duration = ((seed * 37) % 20) + 30;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: 'translateZ(0)', // Force GPU acceleration
                  }}
                  animate={{
                    x: [0, xMove, 0],
                    y: [0, yMove, 0],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear", // Simpler easing
                  }}
                />
              );
            })}
          </div>
        )}
      </motion.div>

      <motion.div 
        className="max-w-7xl mx-auto relative"
        style={!isMobile ? { opacity: mainContentOpacity } : {}}
      >
        {/* Title - Center on mobile, left on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { 
            opacity: 1
          } : {}}
          transition={{ 
            duration: 0.5, 
            ease: "easeOut"
          }}
          className="mb-20 text-center lg:text-left"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white">
            <span className="text-gradient-shine inline-block">About Executive AI</span>
          </h2>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { 
              opacity: 1
            } : { 
              opacity: 0
            }}
            transition={{ 
              duration: 0.5, 
              delay: 0.1
            }}
            className="flex flex-col"
          >
            {/* Fixed height container for dynamic content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={hoveredIndex ?? 'default'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  <h3 className="text-2xl lg:text-3xl font-light text-white mb-3 h-[40px] flex items-start justify-center lg:justify-start text-center lg:text-left">
                    {hoveredIndex !== null ? stats[hoveredIndex].title : defaultContent.title}
                  </h3>
                  
                  <p className="text-lg text-zinc-400 font-light leading-relaxed text-center lg:text-left">
                    {hoveredIndex !== null ? stats[hoveredIndex].description : defaultContent.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Animated line */}
            <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full overflow-hidden mt-8 relative"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 0.3
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
                  delay: prefersReducedMotion ? 0 : 1.0,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 gap-8 lg:gap-12 auto-rows-fr"
            style={!isMobile ? { opacity: statsOpacity } : {}}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ 
                  opacity: 0
                }}
                animate={isInView ? { 
                  opacity: 1
                } : { 
                  opacity: 0
                }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.4, 
                  delay: prefersReducedMotion ? 0 : 0.2 + index * 0.1
                }}
                whileHover={{ 
                  scale: isMobile ? 1 : 1.02,
                  y: isMobile ? 0 : -5,
                  transition: { 
                    duration: 0.2,
                    ease: "easeOut"
                  }
                }}
                whileTap={{ scale: isMobile ? 0.98 : 1 }}
                className="relative group h-full touch-tap-highlight-transparent"
                onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                onTouchStart={() => isMobile && setHoveredIndex(index)}
                onTouchEnd={() => isMobile && setTimeout(() => setHoveredIndex(null), 300)}
              >
                {/* Animated glow background */}
                <motion.div
                  className={`absolute -inset-4 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 0.4 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Floating animation for card */}
                <motion.div 
                  className="relative glass-card rounded-xl p-8 h-full min-h-[160px] flex items-center justify-center backdrop-blur-xl border border-white/10"
                  animate={{
                    y: hoveredIndex === index ? -5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center w-full">
                    <div className={`text-xl lg:text-2xl font-light bg-gradient-to-r ${stat.color} bg-clip-text text-transparent break-words`}>
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Core Principles - Moved back to bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ 
            duration: 0.5, 
            delay: 0.4
          }}
          className="mt-24 pt-16"
        >
          <motion.h3 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ 
              duration: 0.8, 
              delay: 1.4,
              ease: "easeOut"
            }}
            className="text-2xl font-light mb-12 text-white text-center"
          >
            Core Principles
          </motion.h3>
          
          {/* Carousel container */}
          <div className="relative overflow-hidden py-4">
            <motion.div
              className="flex gap-8"
              initial={{ opacity: 0, x: 100 }}
              animate={isInView ? {
                opacity: 1,
                x: ["100px", "-50%"],
              } : { opacity: 0, x: 100 }}
              transition={{
                opacity: { duration: 0.8, delay: 1.6 },
                x: {
                  duration: isMobile ? 40 : 20,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1.8,
                },
              }}
            >
              {/* Double the principles for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-8 flex-shrink-0">
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
                      className="glass-card rounded-lg p-6 text-center flex-shrink-0 min-w-[280px]"
                    >
                      <p className="text-zinc-300 whitespace-nowrap">
                        {principle.text}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
            
            {/* Subtle gradient overlays - much smaller */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none z-10 opacity-50" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none z-10 opacity-50" />
          </div>
        </motion.div>
      </motion.div>
    </section>
      </div>
    </>
  );
}