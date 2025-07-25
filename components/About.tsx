"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Counter component for animated numbers
function Counter({ value, isInView, delay, className }: { value: number; isInView: boolean; delay: number; className: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const controls = animate(0, value, {
          duration: 2,
          onUpdate: (v) => setCount(Math.floor(v)),
        });
        return () => controls.stop();
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);
  
  return <span className={className}>{count}</span>;
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: 100, suffix: "+", label: "Automations created", color: "from-blue-500 to-cyan-500" },
    { value: 24, suffix: "/7", label: "Uptime", color: "from-purple-500 to-pink-500" },
    { value: 3, suffix: "x", label: "Productivity increase", color: "from-orange-500 to-red-500" },
    { value: 50, suffix: "%", label: "Time saved", color: "from-green-500 to-emerald-500" },
  ];

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-conic opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light mb-12 text-white">
            <span className="text-gradient-shine">About</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <p className="text-2xl lg:text-3xl font-light text-white leading-relaxed">
              We deploy AI that works. No theory, no hype—just practical solutions that deliver results.
            </p>
            
            <p className="text-lg text-zinc-500 font-light leading-relaxed">
              Founded by entrepreneurs who understand real business challenges, we bridge the gap between 
              cutting-edge AI and practical applications. Our AI employees enhance your workforce, 
              automate repetitive tasks, and scale without limits.
            </p>
            
            {/* Animated line */}
            <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={isInView ? { width: "100%" } : { width: "0%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="relative group"
              >
                {/* Glow background */}
                <motion.div
                  className={`absolute -inset-4 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                />
                
                <div className="relative glass-card rounded-xl p-6 hover-card-lift">
                  <motion.div className="flex items-baseline gap-1 mb-2">
                    <Counter
                      value={stat.value}
                      isInView={isInView}
                      delay={0.6 + index * 0.1}
                      className="text-4xl lg:text-5xl font-light text-white"
                    />
                    <span className={`text-3xl font-light bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.suffix}
                    </span>
                  </motion.div>
                  <div className="text-sm text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 border-t border-zinc-900 pt-16"
        >
          <h3 className="text-2xl font-light mb-12 text-white">Core Principles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { text: "Practical over theoretical" },
              { text: "Results over promises" },
              { text: "Simple over complex" },
              { text: "Action over analysis" }
            ].map((principle, index) => (
              <motion.div
                key={principle.text}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card rounded-lg p-6 text-center cursor-pointer group"
              >
                <p className="text-lg text-zinc-400 font-light group-hover:text-white transition-colors duration-300">
                  {principle.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}