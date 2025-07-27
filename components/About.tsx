"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    description: "No theory, no hype—just practical solutions that deliver results. Founded by entrepreneurs who understand real business challenges, we bridge the gap between cutting-edge AI and practical applications. Our AI employees enhance your workforce, automate repetitive tasks, and scale without limits."
  };

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Multi-layer animated background */}
      <div className="absolute inset-0">
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
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 50, 0],
            y: [0, 50, 100, 0],
            scale: [1, 1.2, 1.1, 1],
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, -100, 0],
            y: [0, -100, -50, 0],
            scale: [1, 1.1, 1.2, 1],
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            // Use deterministic values based on index instead of Math.random()
            const seed = i * 137.5; // Prime number for better distribution
            const left = ((seed * 7) % 100);
            const top = ((seed * 13) % 100);
            const xMove1 = ((seed * 17) % 200) - 100;
            const xMove2 = ((seed * 23) % 200) - 100;
            const yMove1 = ((seed * 29) % 200) - 100;
            const yMove2 = ((seed * 31) % 200) - 100;
            const duration = ((seed * 37) % 30) + 40;
            
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
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Title - Left aligned */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="mb-20"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white">
            <span className="text-gradient-shine">About Executive AI</span>
          </h2>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 1.5, delay: 1.8 }}
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
                  <h3 className="text-2xl lg:text-3xl font-light text-white mb-3 h-[40px] flex items-start">
                    {hoveredIndex !== null ? stats[hoveredIndex].title : defaultContent.title}
                  </h3>
                  
                  <p className="text-lg text-zinc-400 font-light leading-relaxed">
                    {hoveredIndex !== null ? stats[hoveredIndex].description : defaultContent.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Animated line */}
            <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full overflow-hidden mt-8"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 1.5, delay: 2.2 }}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5, rotateY: -30 }}
                animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0, scale: 0.5, rotateY: -30 }}
                exit={{ opacity: 0, scale: 0.5, rotateY: 30 }}
                transition={{ 
                  duration: 1.5, 
                  delay: 2.0 + index * 0.2,
                  type: "spring",
                  stiffness: 80
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="relative group perspective-1000"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Animated glow background */}
                <motion.div
                  className={`absolute -inset-4 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 0.4 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Floating animation for card */}
                <motion.div 
                  className="relative glass-card rounded-xl p-8 h-full flex items-center justify-center backdrop-blur-xl border border-white/10"
                  animate={{
                    y: hoveredIndex === index ? -5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <div className={`text-xl lg:text-2xl font-light bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Principles - Moved back to bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 1.2, delay: 2.5 }}
          className="mt-24 border-t border-zinc-900 pt-16"
        >
          <motion.h3 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 1.0, delay: 2.7 }}
            className="text-2xl font-light mb-12 text-white text-center"
          >
            Core Principles
          </motion.h3>
          
          {/* Carousel container */}
          <div className="relative overflow-hidden py-4">
            <motion.div
              className="flex gap-8"
              initial={{ opacity: 0 }}
              animate={isInView ? {
                opacity: 1,
                x: ["0%", "-50%"],
              } : { opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1.0, delay: 2.9 },
                x: {
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 3.2,
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
      </div>
    </section>
  );
}