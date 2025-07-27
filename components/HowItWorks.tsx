"use client";

import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import HowItWorksMobile from "./HowItWorksMobile";

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

function StepCard({ step, index, progress }: { step: typeof steps[0], index: number, progress: any }) {
  // Calculate individual step progress with overlap for smoother transitions
  const stepStart = 0.1 + (index * 0.25); // Start at 10% progress, then space each card more
  const stepEnd = stepStart + 0.2; // 20% duration for each step
  
  const stepProgress = useTransform(progress, [stepStart, stepEnd], [0, 1]);
  const smoothProgress = useSpring(stepProgress, { stiffness: 100, damping: 30 });
  
  // Animations based on scroll
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.95]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
  const rotateY = useTransform(smoothProgress, [0, 0.5, 1], [-90, 0, 0]);
  const z = useTransform(smoothProgress, [0, 0.5, 1], [-200, 0, -50]);
  
  // Glow intensity based on progress
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.5, 0.1]);
  
  // Number counter animation
  const [displayNumber, setDisplayNumber] = useState("00");
  
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (value) => {
      if (value > 0.2) {
        setDisplayNumber(step.number);
      } else {
        setDisplayNumber("00");
      }
    });
    return unsubscribe;
  }, [smoothProgress, step.number]);

  return (
    <motion.div
      className="relative z-30"
      style={{
        scale,
        opacity,
        rotateY,
        z,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${step.bgColor} rounded-3xl blur-3xl`}
        style={{ opacity: glowOpacity }}
      />
      
      <div className="relative glass-card rounded-3xl p-10 backdrop-blur-xl border border-white/10 h-full flex flex-col">
        {/* Animated number */}
        <motion.div className="mb-8">
          <span className={`text-7xl lg:text-8xl font-light text-transparent bg-gradient-to-br ${step.color} bg-clip-text`}>
            {displayNumber}
          </span>
        </motion.div>
        
        {/* Content with staggered reveal */}
        <motion.h3 
          className="text-3xl font-light mb-6 text-white"
          style={{
            opacity: useTransform(smoothProgress, [0.3, 0.5], [0, 1]),
            y: useTransform(smoothProgress, [0.3, 0.5], [20, 0]),
          }}
        >
          {step.title}
        </motion.h3>
        
        <motion.p 
          className="text-zinc-400 text-lg font-light leading-relaxed flex-1"
          style={{
            opacity: useTransform(smoothProgress, [0.4, 0.6], [0, 1]),
            y: useTransform(smoothProgress, [0.4, 0.6], [20, 0]),
          }}
        >
          {step.description}
        </motion.p>
        
        {/* Progress indicator */}
        <motion.div className="mt-8 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${step.color}`}
            style={{
              scaleX: smoothProgress,
              transformOrigin: "left",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();
  
  // Use window scroll instead of section scroll
  const { scrollY } = useScroll();
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  
  // Calculate section dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        // Get absolute position from document top
        const rect = ref.current.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        setSectionTop(absoluteTop);
        setSectionHeight(ref.current.offsetHeight);
      }
    };
    
    // Initial calculation after mount
    updateDimensions();
    
    // Recalculate after a delay to ensure all sections are rendered
    const timer = setTimeout(updateDimensions, 500);
    
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Store window height to avoid SSR issues
  const [windowHeight, setWindowHeight] = useState(0);
  
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate scroll progress manually
  const scrollYProgress = useTransform(scrollY, (value) => {
    if (sectionHeight === 0 || windowHeight === 0) return 0;
    
    // Start when section top reaches top 25% of viewport
    // This delays animation start until section is prominently visible
    const sectionScrollStart = sectionTop - (windowHeight * 0.25);
    
    // End after scrolling through the full section height
    const sectionScrollEnd = sectionTop + sectionHeight - windowHeight;
    
    if (value < sectionScrollStart) return 0;
    if (value > sectionScrollEnd) return 1;
    
    return (value - sectionScrollStart) / (sectionScrollEnd - sectionScrollStart);
  });
  
  
  // Background parallax - start at 0 and move down slightly
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // Connection line drawing - delayed start to appear after cards
  const pathLength = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.75, 0.85], [0, 1, 1, 0]);

  // Floating particles opacity
  const particleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  
  // Additional transforms used in the component
  const ctaOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.75, 0.85], [50, 0]);

  // Render mobile version on mobile devices
  if (isMobile) {
    return <HowItWorksMobile />;
  }

  return (
    <section ref={ref} id="how-it-works" className="relative bg-zinc-950" style={{ height: '350vh' }}>
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />
      
      {/* Sticky container - ensure no parent overflow issues */}
      <div className="sticky-container" style={{ height: '100vh' }}>
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: bgY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
          
          {/* Floating particles */}
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: particleOpacity,
            }}
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
                initial={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 23) % 100}%`,
                }}
                animate={{
                  x: [0, 30, -15, 0],
                  y: [0, -30, 20, 0],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop",
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Content container */}
        <div ref={containerRef} className="relative h-full flex flex-col px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
            {/* Header - Fixed at top */}
            <motion.div
              ref={headerRef}
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-4 text-white">
                <span className="text-gradient-shine">Process</span>
              </h2>
              <p className="text-lg text-zinc-600 font-light">
                Three steps to transform your business with AI automation and high-converting landing pages
              </p>
            </motion.div>
            
            {/* Centered content area */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-full">
                {/* Connection line SVG - positioned behind cards with proper z-index */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="process-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
                      </linearGradient>
                      
                      {/* Animated gradient for flow effect */}
                      <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <motion.stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity="0"
                          animate={{
                            stopOpacity: [0, 0.8, 0],
                            offset: ["0%", "100%", "100%"]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        <motion.stop
                          offset="10%"
                          stopColor="#8b5cf6"
                          stopOpacity="0"
                          animate={{
                            stopOpacity: [0, 0.8, 0],
                            offset: ["10%", "110%", "110%"]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </linearGradient>
                    </defs>
                    
                    {/* Base line */}
                    <motion.line
                      x1="10"
                      y1="50"
                      x2="90"
                      y2="50"
                      stroke="url(#process-gradient)"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                      style={{
                        pathLength,
                        opacity: pathOpacity,
                      }}
                    />
                    
                    {/* Animated flow line */}
                    <motion.line
                      x1="10"
                      y1="50"
                      x2="90"
                      y2="50"
                      stroke="url(#flow-gradient)"
                      strokeWidth="2"
                      style={{
                        pathLength,
                        opacity: pathOpacity,
                        filter: "blur(4px)"
                      }}
                    />
                  </svg>
                </div>

                {/* Steps container - elevated with higher z-index */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-20">
                  {steps.map((step, index) => (
                    <StepCard key={step.number} step={step} index={index} progress={scrollYProgress} />
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button - Centered between cards and progress bar */}
            <motion.div
              className="mt-20 mb-32 text-center"
              style={{
                opacity: ctaOpacity,
                y: ctaY,
              }}
            >
              <a href="#contact">
                <motion.button 
                  className="relative text-white border border-zinc-700 px-8 py-4 rounded-full font-light text-base overflow-hidden group"
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

        {/* Progress indicator */}
        <motion.div className="absolute bottom-6 left-10 right-10 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
            style={{
              scaleX: scrollYProgress,
              transformOrigin: "left",
            }}
          />
        </motion.div>
        
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
    </section>
  );
}

