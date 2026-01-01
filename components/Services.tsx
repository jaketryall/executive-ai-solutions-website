"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

// Smooth easing curves
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

// Reusable animated text component with stagger
function AnimatedText({
  children,
  className = "",
  delay = 0
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: smoothEase }}
    >
      {children}
    </motion.span>
  );
}

// Animated tag/pill component with hover
function AnimatedTag({
  children,
  delay = 0,
  variant = "dark"
}: {
  children: string;
  delay?: number;
  variant?: "dark" | "light";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.span
      ref={ref}
      className={`px-4 py-2 rounded-full text-sm cursor-default ${
        variant === "dark"
          ? "border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
          : "border border-zinc-300 text-zinc-600 bg-white hover:border-zinc-400 hover:bg-zinc-50"
      } transition-colors duration-300`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: smoothEase }}
      whileHover={{ y: -2 }}
    >
      {children}
    </motion.span>
  );
}

// ============================================
// SERVICE 1: BRAND IDENTITY
// Typography-focused with animated letters
// ============================================
function BrandIdentitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center relative bg-[#0a0a0a] overflow-hidden py-20"
    >
      {/* Giant animated typography background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className="text-[20vw] md:text-[15vw] font-black text-zinc-900 uppercase leading-none select-none whitespace-nowrap"
          style={{ x: useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]) }}
        >
          BRAND
        </motion.div>
      </div>

      {/* Floating letters */}
      <div className="absolute inset-0 pointer-events-none">
        {["A", "B", "C", "D"].map((letter, i) => (
          <motion.span
            key={letter}
            className="absolute text-6xl md:text-8xl font-black text-blue-500/10"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
              y: useTransform(scrollYProgress, [0, 1], [50 * (i + 1), -50 * (i + 1)]),
              rotate: useTransform(scrollYProgress, [0, 1], [0, 15 * (i % 2 === 0 ? 1 : -1)]),
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Content */}
      <motion.div
        ref={contentRef}
        className="relative z-10 px-6 md:px-12 lg:px-20 w-full"
        style={{ y }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <div>
              <motion.span
                className="text-blue-500 text-sm font-mono mb-4 block"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: smoothEase }}
              >
                01
              </motion.span>
              <div className="overflow-hidden mb-6">
                <motion.h3
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight"
                  initial={{ y: 100 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: smoothEase, delay: 0.1 }}
                >
                  Brand
                </motion.h3>
                <motion.h3
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight"
                  initial={{ y: 100 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
                >
                  Identity
                </motion.h3>
              </div>
              <motion.p
                className="text-xl text-zinc-400 leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: smoothEase, delay: 0.4 }}
              >
                Crafting bold, memorable brand identities from logos to full brand guidelines that set you apart.
              </motion.p>
              <div className="flex flex-wrap gap-3">
                {["Logo Design", "Color Systems", "Typography", "Brand Guidelines"].map((item, i) => (
                  <AnimatedTag key={item} delay={0.5 + i * 0.1} variant="dark">
                    {item}
                  </AnimatedTag>
                ))}
              </div>
            </div>

            {/* Right - Visual showcase */}
            <div className="relative h-[400px] md:h-[500px]">
              {/* Stacked logo cards */}
              <motion.div
                className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center cursor-pointer"
                style={{
                  rotate: useTransform(scrollYProgress, [0.2, 0.8], [-5, 5]),
                  y: useTransform(scrollYProgress, [0.2, 0.8], [0, -20]),
                }}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.8, ease: smoothEase, delay: 0.3 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <span className="text-6xl md:text-8xl font-black text-white">Ex</span>
              </motion.div>
              <motion.div
                className="absolute top-20 right-20 w-48 h-48 md:w-64 md:h-64 bg-blue-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-xl shadow-blue-600/20"
                style={{
                  rotate: useTransform(scrollYProgress, [0.2, 0.8], [5, -5]),
                  y: useTransform(scrollYProgress, [0.2, 0.8], [0, 20]),
                }}
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: smoothEase, delay: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <span className="text-6xl md:text-8xl font-black text-white">Ai</span>
              </motion.div>
              <motion.div
                className="absolute top-40 right-40 w-48 h-48 md:w-64 md:h-64 bg-zinc-800 rounded-2xl border border-zinc-700 flex items-center justify-center cursor-pointer"
                style={{
                  rotate: useTransform(scrollYProgress, [0.2, 0.8], [-3, 3]),
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: smoothEase, delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// SERVICE 2: WEB DESIGN
// Browser mockup with floating elements
// ============================================
function WebDesignSection() {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center relative bg-[#f5f5f0] overflow-hidden py-20"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <motion.div
        ref={contentRef}
        className="relative z-10 px-6 md:px-12 lg:px-20 w-full"
        style={{ y }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Browser mockup */}
            <div className="relative order-2 lg:order-1">
              <motion.div
                className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 cursor-pointer"
                style={{
                  rotateY: useTransform(scrollYProgress, [0.2, 0.8], [-5, 5]),
                  transformPerspective: 1000,
                }}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Browser bar */}
                <div className="bg-zinc-100 px-4 py-3 flex items-center gap-2 border-b border-zinc-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md px-3 py-1.5 text-xs text-zinc-400 border border-zinc-200">
                      yourwebsite.com
                    </div>
                  </div>
                </div>
                {/* Browser content */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-zinc-900 to-zinc-800 h-[300px] md:h-[350px] relative overflow-hidden">
                  <motion.div
                    className="h-8 w-32 bg-white/10 rounded mb-4"
                    initial={{ opacity: 0, width: 0 }}
                    animate={isInView ? { opacity: 1, width: 128 } : {}}
                    transition={{ duration: 0.6, delay: 0.5, ease: smoothEase }}
                  />
                  <motion.div
                    className="h-4 w-48 bg-white/5 rounded mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6, ease: smoothEase }}
                  />
                  <motion.div
                    className="h-4 w-40 bg-white/5 rounded mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7, ease: smoothEase }}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className={`h-20 rounded ${i === 1 ? 'bg-blue-500/20' : 'bg-white/5'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: smoothEase }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-xl shadow-lg flex items-center justify-center cursor-pointer"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [20, -20]),
                  rotate: useTransform(scrollYProgress, [0, 1], [0, 10]),
                }}
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, ease: smoothEase, delay: 0.4 }}
                whileHover={{ scale: 1.1, rotate: 15 }}
              >
                <span className="text-white text-2xl">✦</span>
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-zinc-900 rounded-xl shadow-lg flex items-center justify-center cursor-pointer"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [-20, 20]),
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, ease: smoothEase, delay: 0.5 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <span className="text-white text-xl">◇</span>
              </motion.div>
            </div>

            {/* Right - Info */}
            <div className="order-1 lg:order-2">
              <motion.span
                className="text-blue-600 text-sm font-mono mb-4 block"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: smoothEase }}
              >
                02
              </motion.span>
              <div className="overflow-hidden mb-6">
                <motion.h3
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 uppercase tracking-tight"
                  initial={{ y: 100 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: smoothEase, delay: 0.1 }}
                >
                  Web
                </motion.h3>
                <motion.h3
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 uppercase tracking-tight"
                  initial={{ y: 100 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
                >
                  Design
                </motion.h3>
              </div>
              <motion.p
                className="text-xl text-zinc-600 leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: smoothEase, delay: 0.4 }}
              >
                High-performance websites with stunning visuals and seamless user experiences that convert.
              </motion.p>
              <div className="flex flex-wrap gap-3">
                {["Custom Design", "Responsive", "Motion Design", "SEO-Ready"].map((item, i) => (
                  <AnimatedTag key={item} delay={0.5 + i * 0.1} variant="light">
                    {item}
                  </AnimatedTag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// SERVICE 3: UI/UX DESIGN
// True element morphing - shapes transform into each other
// ============================================

function MorphingUIShowcase({ isInView }: { isInView: boolean }) {
  const [phase, setPhase] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Cycle through phases
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setPhase((prev) => (prev + 1) % 4);
        setIsTransitioning(false);
      }, 800);
    }, 3500);

    return () => clearInterval(interval);
  }, [isInView]);

  // Container inner dimensions: 300x240 with 16px padding = 268x208 usable area
  // Element configs: [phase0, phase1, phase2, phase3] for each property
  const elements = [
    {
      // Element 0: Hero element - image area → primary button → email input → logo
      id: 0,
      x: [0, 34, 4, 0],
      y: [0, 16, 0, 0],
      width: [268, 200, 260, 32],
      height: [90, 44, 40, 32],
      borderRadius: [12, 22, 8, 8],
      bg: ["rgba(139,92,246,0.15)", "linear-gradient(90deg, #8b5cf6, #3b82f6)", "rgba(39,39,42,0.8)", "linear-gradient(135deg, #8b5cf6, #3b82f6)"],
      border: ["1px solid rgba(139,92,246,0.3)", "none", "1px solid rgba(113,113,122,0.5)", "none"],
      shadow: ["none", "0 8px 32px rgba(139,92,246,0.4)", "none", "0 4px 20px rgba(139,92,246,0.3)"],
    },
    {
      // Element 1: Title → secondary button → password input → nav item
      id: 1,
      x: [0, 34, 4, 46],
      y: [104, 68, 52, 0],
      width: [160, 200, 260, 70],
      height: [14, 44, 40, 24],
      borderRadius: [4, 22, 8, 6],
      bg: ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.08)", "rgba(39,39,42,0.8)", "rgba(255,255,255,0.1)"],
      border: ["none", "1px solid rgba(255,255,255,0.15)", "1px solid rgba(139,92,246,0.5)", "1px solid rgba(255,255,255,0.1)"],
      shadow: ["none", "none", "0 0 0 2px rgba(139,92,246,0.2)", "none"],
    },
    {
      // Element 2: Price tag → ghost button → submit button → stat card 1
      id: 2,
      x: [0, 34, 4, 0],
      y: [130, 120, 104, 44],
      width: [60, 200, 260, 128],
      height: [22, 44, 44, 64],
      borderRadius: [6, 22, 8, 10],
      bg: ["#8b5cf6", "transparent", "linear-gradient(90deg, #8b5cf6, #3b82f6)", "rgba(39,39,42,0.5)"],
      border: ["none", "1px solid rgba(139,92,246,0.5)", "none", "1px solid rgba(255,255,255,0.05)"],
      shadow: ["0 4px 12px rgba(139,92,246,0.3)", "none", "0 6px 24px rgba(139,92,246,0.35)", "none"],
    },
    {
      // Element 3: Rating → hidden → hidden → stat card 2
      id: 3,
      x: [148, 268, 268, 140],
      y: [130, 208, 208, 44],
      width: [56, 0, 0, 128],
      height: [14, 0, 0, 64],
      borderRadius: [7, 0, 0, 10],
      bg: ["rgba(255,255,255,0.2)", "transparent", "transparent", "rgba(139,92,246,0.1)"],
      border: ["none", "none", "none", "1px solid rgba(139,92,246,0.3)"],
      shadow: ["none", "none", "none", "none"],
    },
    {
      // Element 4: Icon in image → hidden → indicator dot → chart area
      id: 4,
      x: [114, 268, 240, 0],
      y: [30, 208, 64, 120],
      width: [36, 0, 14, 268],
      height: [36, 0, 14, 56],
      borderRadius: [8, 0, 7, 8],
      bg: ["linear-gradient(135deg, #8b5cf6, #3b82f6)", "transparent", "rgba(139,92,246,0.2)", "rgba(39,39,42,0.3)"],
      border: ["none", "none", "none", "none"],
      shadow: ["0 4px 16px rgba(139,92,246,0.4)", "none", "none", "none"],
    },
  ];

  return (
    <div
      className="relative h-[400px] md:h-[500px] flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-50"
        animate={{
          background: [
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 60%)",
            "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 60%)",
          ],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main container */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: smoothEase }}
        style={{
          width: 300,
          height: 240,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Background card that morphs */}
        <motion.div
          className="absolute inset-0 bg-zinc-900/90 backdrop-blur-xl overflow-hidden"
          animate={{
            borderRadius: [16, 20, 12, 16][phase],
            boxShadow: isTransitioning
              ? "0 30px 100px rgba(139, 92, 246, 0.4)"
              : "0 25px 80px rgba(139, 92, 246, 0.25)",
          }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />

        {/* Morphing elements */}
        {elements.map((el) => (
          <motion.div
            key={el.id}
            className="absolute"
            animate={{
              x: el.x[phase] + 16,
              y: el.y[phase] + 16,
              width: el.width[phase],
              height: el.height[phase],
              borderRadius: el.borderRadius[phase],
              opacity: el.width[phase] === 0 ? 0 : 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1], // Smooth acceleration/deceleration
            }}
            style={{
              background: el.bg[phase],
              border: el.border[phase],
              boxShadow: el.shadow[phase],
            }}
          >
            {/* Inner content for specific phases */}
            <AnimatePresence mode="wait">
              {/* Primary button text */}
              {el.id === 0 && phase === 1 && (
                <motion.span
                  key="btn-text"
                  className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  Get Started
                </motion.span>
              )}
              {/* Email placeholder */}
              {el.id === 0 && phase === 2 && (
                <motion.div
                  key="email"
                  className="absolute inset-0 flex flex-col justify-center px-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <span className="text-[10px] text-zinc-500 mb-1">Email</span>
                  <span className="text-zinc-400 text-sm">hello@example.com</span>
                </motion.div>
              )}
              {/* Secondary button text */}
              {el.id === 1 && phase === 1 && (
                <motion.span
                  key="learn-text"
                  className="absolute inset-0 flex items-center justify-center text-white/80 font-medium text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 }}
                >
                  Learn More
                </motion.span>
              )}
              {/* Password input */}
              {el.id === 1 && phase === 2 && (
                <motion.div
                  key="password"
                  className="absolute inset-0 flex flex-col justify-center px-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  <span className="text-[10px] text-zinc-500 mb-1">Password</span>
                  <span className="text-zinc-500 text-sm">••••••••</span>
                </motion.div>
              )}
              {/* Ghost button text */}
              {el.id === 2 && phase === 1 && (
                <motion.span
                  key="contact-text"
                  className="absolute inset-0 flex items-center justify-center text-purple-400 font-medium text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  Contact Us
                </motion.span>
              )}
              {/* Submit button text */}
              {el.id === 2 && phase === 2 && (
                <motion.span
                  key="submit-text"
                  className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  Sign In
                </motion.span>
              )}
              {/* Stat card 1 content */}
              {el.id === 2 && phase === 3 && (
                <motion.div
                  key="stat1"
                  className="absolute inset-0 flex flex-col justify-center px-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <span className="text-[10px] text-zinc-500">Revenue</span>
                  <span className="text-white font-bold">$24.5k</span>
                </motion.div>
              )}
              {/* Stat card 2 content */}
              {el.id === 3 && phase === 3 && (
                <motion.div
                  key="stat2"
                  className="absolute inset-0 flex flex-col justify-center px-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  <span className="text-[10px] text-purple-400">Growth</span>
                  <span className="text-purple-400 font-bold">+42%</span>
                </motion.div>
              )}
              {/* Chart bars */}
              {el.id === 4 && phase === 3 && (
                <motion.div
                  key="chart"
                  className="absolute inset-0 flex items-end justify-around px-2 pb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {[35, 55, 40, 70, 50, 85, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-5 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        background: i === 5 ? "linear-gradient(to top, #8b5cf6, #3b82f6)" : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </motion.div>
              )}
              {/* Indicator dot inner */}
              {el.id === 4 && phase === 2 && (
                <motion.div
                  key="dot"
                  className="absolute inset-2 rounded-full bg-purple-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[16px] overflow-hidden"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 55%, transparent 60%)",
            backgroundSize: "250% 100%",
          }}
          animate={{ backgroundPosition: ["200% 0%", "-100% 0%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* Phase indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.button
            key={i}
            className="relative"
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setPhase(i);
                setIsTransitioning(false);
              }, 100);
            }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={{
                scale: phase === i ? 1.5 : 1,
                backgroundColor: phase === i ? "#8b5cf6" : "#3f3f46",
              }}
              transition={{ duration: 0.3 }}
            />
            {phase === i && (
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-500/30"
                initial={{ scale: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Labels */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            className="text-zinc-500 text-xs uppercase tracking-widest whitespace-nowrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.6, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {["Product Card", "Call to Action", "Sign In Form", "Dashboard"][phase]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function UIUXSection() {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center relative bg-[#0a0a0a] overflow-hidden py-20"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: smoothEase }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: smoothEase, delay: 0.2 }}
        />
      </div>

      {/* Content */}
      <motion.div
        ref={contentRef}
        className="relative z-10 px-6 md:px-12 lg:px-20 w-full"
        style={{ y }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <div>
              <motion.span
                className="text-purple-500 text-sm font-mono mb-4 block"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: smoothEase }}
              >
                03
              </motion.span>
              <div className="overflow-hidden mb-6">
                <motion.h3
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight"
                  initial={{ y: 100 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: smoothEase, delay: 0.1 }}
                >
                  UI/UX
                </motion.h3>
                <motion.h3
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight"
                  initial={{ y: 100 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
                >
                  Design
                </motion.h3>
              </div>
              <motion.p
                className="text-xl text-zinc-400 leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: smoothEase, delay: 0.4 }}
              >
                Intuitive digital experiences designed to enhance engagement and maximize conversions.
              </motion.p>
              <div className="flex flex-wrap gap-3">
                {["User Research", "Wireframing", "Prototyping", "Testing"].map((item, i) => (
                  <AnimatedTag key={item} delay={0.5 + i * 0.1} variant="dark">
                    {item}
                  </AnimatedTag>
                ))}
              </div>
            </div>

            {/* Right - Morphing UI showcase */}
            <MorphingUIShowcase isInView={isInView} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// SERVICE 4: DEVELOPMENT
// Code/terminal aesthetic
// ============================================
function DevelopmentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const codeLines = [
    { indent: 0, content: "const website = {", color: "text-purple-400" },
    { indent: 1, content: "framework: 'Next.js',", color: "text-zinc-400" },
    { indent: 1, content: "styling: 'Tailwind CSS',", color: "text-zinc-400" },
    { indent: 1, content: "animations: 'Framer Motion',", color: "text-zinc-400" },
    { indent: 1, content: "deploy: async () => {", color: "text-blue-400" },
    { indent: 2, content: "await vercel.deploy();", color: "text-emerald-400" },
    { indent: 2, content: "return '🚀 Live!';", color: "text-emerald-400" },
    { indent: 1, content: "}", color: "text-blue-400" },
    { indent: 0, content: "};", color: "text-purple-400" },
  ];

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center relative bg-[#0d1117] overflow-hidden py-20"
    >
      {/* Matrix-like background effect - using deterministic pattern */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-500 font-mono text-xs"
            style={{
              left: `${i * 5}%`,
              top: 0,
              y: useTransform(scrollYProgress, [0, 1], [0, 200 + i * 20]),
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j}>{(i + j) % 2 === 0 ? "1" : "0"}</div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        ref={contentRef}
        className="relative z-10 px-6 md:px-12 lg:px-20 w-full"
        style={{ y }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Code editor */}
            <div className="order-2 lg:order-1">
              <motion.div
                className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden shadow-2xl cursor-pointer"
                style={{
                  rotateY: useTransform(scrollYProgress, [0.2, 0.8], [5, -5]),
                  transformPerspective: 1000,
                }}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Editor header */}
                <div className="bg-[#21262d] px-4 py-3 flex items-center gap-3 border-b border-[#30363d]">
                  <div className="flex gap-1.5">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-[#f85149]"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.4, type: "spring" }}
                    />
                    <motion.div
                      className="w-3 h-3 rounded-full bg-[#f0883e]"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.5, type: "spring" }}
                    />
                    <motion.div
                      className="w-3 h-3 rounded-full bg-[#3fb950]"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.6, type: "spring" }}
                    />
                  </div>
                  <motion.span
                    className="text-[#8b949e] text-sm font-mono"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.5, ease: smoothEase }}
                  >
                    website.config.ts
                  </motion.span>
                </div>
                {/* Code content */}
                <div className="p-6 font-mono text-sm">
                  {codeLines.map((line, i) => (
                    <motion.div
                      key={i}
                      className="flex"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.6 + i * 0.08, ease: smoothEase }}
                    >
                      <span className="text-[#6e7681] w-8 select-none">{i + 1}</span>
                      <motion.span
                        style={{ paddingLeft: `${line.indent * 1.5}rem` }}
                        className={line.color}
                        whileHover={{ x: 4, color: "#ffffff" }}
                        transition={{ duration: 0.2 }}
                      >
                        {line.content}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating tech badges */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                {["Next.js", "React", "TypeScript", "Node.js"].map((tech, i) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-full text-xs text-[#8b949e] font-mono cursor-pointer"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 1.2 + i * 0.1, ease: smoothEase }}
                    whileHover={{ y: -3, scale: 1.05, borderColor: "#3fb950", color: "#3fb950" }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Right - Info */}
            <div className="order-1 lg:order-2">
              <motion.span
                className="text-emerald-500 text-sm font-mono mb-4 block"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: smoothEase }}
              >
                04
              </motion.span>
              <div className="overflow-hidden mb-6">
                <motion.h3
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight"
                  initial={{ y: 100 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: smoothEase, delay: 0.1 }}
                >
                  Develop
                </motion.h3>
                <motion.h3
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight"
                  initial={{ y: 100 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
                >
                  ment
                </motion.h3>
              </div>
              <motion.p
                className="text-xl text-[#8b949e] leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: smoothEase, delay: 0.4 }}
              >
                Clean, scalable code that brings designs to life with modern technologies and best practices.
              </motion.p>
              <div className="flex flex-wrap gap-3">
                {["Next.js", "React", "CMS Integration", "Deployment"].map((item, i) => (
                  <motion.span
                    key={item}
                    className="px-4 py-2 border border-[#30363d] rounded-full text-sm text-[#8b949e] cursor-pointer transition-colors duration-300 hover:border-emerald-500/50 hover:text-emerald-400"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: smoothEase }}
                    whileHover={{ y: -2 }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// MAIN SERVICES COMPONENT
// ============================================
export default function Services() {
  return (
    <section id="services" className="relative">
      {/* Section header */}
      <div className="bg-[#0a0a0a] py-32 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-blue-500 text-sm font-medium tracking-wider uppercase mb-4"
        >
          What We Do
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase"
        >
          Services
        </motion.h2>
      </div>

      {/* Individual service sections */}
      <BrandIdentitySection />
      <WebDesignSection />
      <UIUXSection />
      <DevelopmentSection />

      {/* Bottom CTA */}
      <div className="bg-[#0a0a0a] py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to elevate your brand?
          </h3>
          <p className="text-zinc-500 text-lg mb-8 max-w-md mx-auto">
            Every project includes unlimited revisions and 30 days of support.
          </p>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300"
          >
            Start Your Project
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
