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
// Continuous fluid morphing UI showcase
// ============================================

// Fluid morphing component - elements continuously transform into each other
function FluidMorphingShowcase({ isInView }: { isInView: boolean }) {
  const [phase, setPhase] = useState(0);

  // Continuous animation loop
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 100);
    }, 50); // 20fps for smooth animation

    return () => clearInterval(interval);
  }, [isInView]);

  // Calculate morph progress (0-1) for different elements
  const cycleLength = 400; // Total frames for one complete cycle
  const morphProgress = (phase * 5) % cycleLength;

  // Each element has its own phase in the cycle
  const getElementProgress = (offset: number) => {
    const adjusted = (morphProgress + offset) % cycleLength;
    return adjusted / cycleLength;
  };

  // Easing function for smooth morphing
  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Breathing/pulsing effect
  const breathe = Math.sin(phase * 0.05) * 0.5 + 0.5;

  // Rotation for the whole container
  const containerRotation = Math.sin(phase * 0.02) * 5;

  return (
    <div
      className="relative h-[400px] md:h-[500px] flex items-center justify-center"
      style={{ perspective: "1200px" }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 30% 40%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 30% 40%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Main morphing container */}
      <motion.div
        className="relative w-80 h-80 md:w-96 md:h-96"
        style={{
          transformStyle: "preserve-3d",
          rotateY: containerRotation,
          rotateX: Math.sin(phase * 0.015) * 3,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: smoothEase }}
      >
        {/* Central morphing shape */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 180 + breathe * 40,
            height: 180 + breathe * 40,
          }}
        >
          {/* Primary morphing blob */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-sm border border-white/10"
            animate={{
              borderRadius: [
                "60% 40% 30% 70% / 60% 30% 70% 40%",
                "30% 60% 70% 40% / 50% 60% 30% 60%",
                "40% 60% 60% 40% / 70% 30% 60% 40%",
                "60% 40% 30% 70% / 60% 30% 70% 40%",
              ],
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.05, 0.95, 1.02, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Secondary morphing layer */}
          <motion.div
            className="absolute inset-2 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 backdrop-blur-sm"
            animate={{
              borderRadius: [
                "40% 60% 70% 30% / 40% 50% 60% 50%",
                "70% 30% 50% 50% / 30% 30% 70% 70%",
                "50% 50% 30% 70% / 50% 70% 30% 50%",
                "40% 60% 70% 30% / 40% 50% 60% 50%",
              ],
              rotate: [360, 270, 180, 90, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Inner glow core */}
          <motion.div
            className="absolute inset-8 bg-gradient-to-br from-purple-400/40 to-blue-400/40 blur-sm"
            animate={{
              borderRadius: [
                "50% 50% 50% 50%",
                "60% 40% 60% 40%",
                "40% 60% 40% 60%",
                "50% 50% 50% 50%",
              ],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Orbiting UI elements that morph as they move */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const orbitProgress = getElementProgress(i * 66);
          const angle = orbitProgress * Math.PI * 2;
          const radius = 130 + Math.sin(phase * 0.03 + i) * 20;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.6; // Elliptical orbit
          const z = Math.sin(angle) * 50;
          const scale = 0.7 + (Math.sin(angle) + 1) * 0.2;
          const opacity = 0.4 + (Math.sin(angle) + 1) * 0.3;

          // Morph between different shapes based on position
          const morphPhase = (orbitProgress * 3) % 1;
          const isButton = morphPhase < 0.33;
          const isCard = morphPhase >= 0.33 && morphPhase < 0.66;

          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                x: x - 30,
                y: y - 20,
                z,
                scale,
                opacity,
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                className="relative"
                animate={{
                  width: isButton ? 80 : isCard ? 60 : 40,
                  height: isButton ? 36 : isCard ? 50 : 40,
                  borderRadius: isButton ? 18 : isCard ? 12 : 20,
                  backgroundColor: isButton
                    ? `hsla(${220 + i * 20}, 70%, 55%, 0.9)`
                    : isCard
                    ? `hsla(${260 + i * 15}, 60%, 20%, 0.8)`
                    : `hsla(${280 + i * 25}, 70%, 60%, 0.8)`,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                  boxShadow: `0 10px 40px hsla(${250 + i * 20}, 70%, 50%, 0.3)`,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Inner content that morphs */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center overflow-hidden"
                  animate={{
                    opacity: isButton ? 1 : 0.5,
                  }}
                >
                  {isButton && (
                    <motion.div
                      className="w-8 h-1 bg-white/60 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  {isCard && (
                    <motion.div className="space-y-1 px-2 w-full">
                      <motion.div
                        className="h-1 bg-white/30 rounded-full"
                        animate={{ width: ["0%", "80%"] }}
                        transition={{ duration: 0.4 }}
                      />
                      <motion.div
                        className="h-1 bg-white/20 rounded-full"
                        animate={{ width: ["0%", "60%"] }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      />
                    </motion.div>
                  )}
                  {!isButton && !isCard && (
                    <motion.div
                      className="w-4 h-4 rounded-full bg-white/40"
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => {
          const particleProgress = getElementProgress(i * 33);
          const floatY = Math.sin(phase * 0.04 + i * 0.5) * 30;
          const floatX = Math.cos(phase * 0.03 + i * 0.7) * 20;

          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                left: `${15 + (i * 7) % 70}%`,
                top: `${10 + (i * 11) % 80}%`,
                x: floatX,
                y: floatY,
                background: `hsla(${250 + i * 15}, 70%, 60%, ${0.3 + particleProgress * 0.4})`,
                boxShadow: `0 0 10px hsla(${250 + i * 15}, 70%, 60%, 0.5)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Connecting lines between elements */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0.3)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0.3)" />
            </linearGradient>
          </defs>
          {[0, 1, 2].map((i) => {
            const progress1 = getElementProgress(i * 66);
            const progress2 = getElementProgress((i + 1) * 66);
            const angle1 = progress1 * Math.PI * 2;
            const angle2 = progress2 * Math.PI * 2;
            const radius = 130;
            const cx = 192; // Center x (half of container)
            const cy = 192; // Center y

            return (
              <motion.path
                key={`line-${i}`}
                d={`M ${cx + Math.cos(angle1) * radius} ${cy + Math.sin(angle1) * radius * 0.6}
                    Q ${cx} ${cy}
                    ${cx + Math.cos(angle2) * radius} ${cy + Math.sin(angle2) * radius * 0.6}`}
                stroke="url(#lineGradient)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1.3,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Subtle label */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-zinc-600 text-xs uppercase tracking-widest"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Fluid Interface Design
      </motion.div>
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

            {/* Right - Fluid morphing UI showcase */}
            <FluidMorphingShowcase isInView={isInView} />
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
