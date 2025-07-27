"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useMobile";

const useCases = [
  {
    title: "Customer Service AI",
    description: "Reduce support workload by 80% with intelligent AI agents handling customer inquiries 24/7.",
    metrics: "80",
    metricLabel: "Less Support Work",
    category: "Operations",
    color: "from-blue-500/20 to-cyan-500/20",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    gradient: "from-blue-500 to-cyan-500",
    particleColor: "rgb(59, 130, 246)",
  },
  {
    title: "Real Estate Automation",
    description: "Qualify leads instantly and match properties automatically with AI-powered systems.",
    metrics: "5",
    metricLabel: "More Qualified Leads",
    category: "Real Estate",
    color: "from-purple-500/20 to-pink-500/20",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    gradient: "from-purple-500 to-pink-500",
    particleColor: "rgb(168, 85, 247)",
  },
  {
    title: "AI Landing Pages",
    description: "Create high-converting pages that adapt to each visitor for maximum engagement.",
    metrics: "3",
    metricLabel: "Better Conversions",
    category: "Marketing",
    color: "from-orange-500/20 to-red-500/20",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    gradient: "from-orange-500 to-red-500",
    particleColor: "rgb(251, 146, 60)",
  },
];

interface CardProps {
  useCase: typeof useCases[0];
  index: number;
  isActive: boolean;
  onActivate: () => void;
}

function MetricCounter({ value, isActive }: { value: string; isActive: boolean }) {
  const [displayValue, setDisplayValue] = useState("0");
  
  useEffect(() => {
    if (!isActive) {
      setDisplayValue("0");
      return;
    }
    
    const targetValue = parseInt(value);
    const duration = 1500;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current).toString());
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value, isActive]);
  
  return <span>{displayValue}</span>;
}

function UseCaseCard({ useCase, index, isActive, onActivate }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Touch interaction
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  // Spring animations for smooth movement
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });
  
  // Holographic effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!cardRef.current || prefersReducedMotion) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) / 5);
    y.set((e.clientY - centerY) / 5);
    
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };
  
  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
    setMousePosition({ x: 0.5, y: 0.5 });
  };
  
  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-x-4 cursor-pointer"
      initial={{ y: 100, opacity: 0, scale: 0.9 }}
      animate={{
        y: isActive ? 0 : 60 + index * 30,
        opacity: 1,
        scale: isActive ? 1 : 0.95 - index * 0.02,
        zIndex: isActive ? 10 : 5 - index,
      }}
      exit={{ y: -100, opacity: 0, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 1000,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTap={onActivate}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card container with holographic effect */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${useCase.particleColor}40 0%, transparent 50%)`,
          }}
        />
        
        {/* Holographic shimmer */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage: `linear-gradient(135deg, transparent 20%, ${useCase.particleColor}20 40%, transparent 60%)`,
            backgroundSize: "200% 200%",
          }}
        />
        
        {/* Glass card content */}
        <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          {/* Top accent line */}
          <motion.div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${useCase.gradient}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isActive ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Icon and category */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className={`p-3 rounded-xl bg-gradient-to-r ${useCase.gradient}`}
              animate={{
                scale: isActive ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isActive ? Infinity : 0,
              }}
            >
              <div className="text-white">{useCase.icon}</div>
            </motion.div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              {useCase.category}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-light text-white mb-3">{useCase.title}</h3>
          
          {/* Description */}
          <p className="text-zinc-400 text-sm font-light leading-relaxed mb-6">
            {useCase.description}
          </p>
          
          {/* Animated metrics */}
          <div className="flex items-center gap-6">
            {/* Progress ring with number inside */}
            <motion.div 
              className="relative"
              animate={isActive ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: isActive ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <svg className="w-24 h-24">
                {/* Background circle */}
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                {/* Glow effect circle */}
                {isActive && (
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke={useCase.particleColor}
                    strokeWidth="3"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{
                      opacity: [0, 0.3, 0],
                      scale: [1, 1.2, 1.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    style={{
                      filter: "blur(4px)",
                    }}
                  />
                )}
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke={`url(#gradient-${index})`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isActive ? 0.8 : 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{
                    rotate: -90,
                    transformOrigin: "center",
                  }}
                />
                <defs>
                  <linearGradient id={`gradient-${index}`}>
                    <stop offset="0%" stopColor={useCase.particleColor} />
                    <stop offset="100%" stopColor={useCase.particleColor} stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Metric value centered in circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-light text-white">
                    <MetricCounter value={useCase.metrics} isActive={isActive} />
                    <span className="text-lg">x</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Metric label */}
            <div className="flex-1">
              <div className="text-sm text-zinc-400">{useCase.metricLabel}</div>
            </div>
          </div>
          
          {/* Particle effects on activation */}
          <AnimatePresence>
            {isActive && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: useCase.particleColor,
                      left: `${20 + i * 10}%`,
                      bottom: "20%",
                    }}
                    initial={{ y: 0, opacity: 1, scale: 0 }}
                    animate={{
                      y: -100,
                      opacity: 0,
                      scale: [0, 1.5, 0],
                      x: (i % 2 === 0 ? 1 : -1) * 30,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function UseCasesMobile() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const dragX = useMotionValue(0);
  
  // Auto-cycle through cards
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % useCases.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);
  
  // Swipe gesture handling
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (info.offset.x < -swipeThreshold && activeIndex < useCases.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };
  
  // Neural network background nodes
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 20 + (i % 4) * 25,
    y: 20 + Math.floor(i / 4) * 60,
  }));
  
  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Neural network background */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {/* Connection lines */}
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map((targetNode, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${targetNode.x}%`}
              y2={`${targetNode.y}%`}
              stroke="url(#neural-gradient)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 0.3, 0.3, 0],
              }}
              transition={{
                duration: 4,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))
        )}
        
        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="3"
            fill="rgb(59, 130, 246)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 1],
              opacity: [0, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
        
        <defs>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="rgb(168, 85, 247)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(251, 146, 60)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Card stack container with swipe gestures */}
      <motion.div 
        ref={containerRef} 
        className="relative h-full flex items-center justify-center"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
      >
        <AnimatePresence mode="popLayout">
          {useCases.map((useCase, index) => {
            const relativeIndex = (index - activeIndex + useCases.length) % useCases.length;
            if (relativeIndex > 2) return null; // Only show 3 cards at a time
            
            return (
              <UseCaseCard
                key={useCase.title}
                useCase={useCase}
                index={relativeIndex}
                isActive={index === activeIndex}
                onActivate={() => setActiveIndex(index)}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {useCases.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-8 bg-gradient-to-r from-blue-500 to-purple-500"
                : "bg-zinc-600"
            }`}
            aria-label={`Go to use case ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}