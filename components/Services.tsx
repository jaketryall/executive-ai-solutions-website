"use client";

import { motion, useScroll, AnimatePresence, useMotionValueEvent, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ShineButton from "./ShineButton";
import AnimatedLogoSVG from "./AnimatedLogoSVG";

// Smooth easing curves
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ============================================
// SERVICE DATA
// ============================================
const services = [
  {
    id: 0,
    number: "01",
    title: ["Brand", "Identity"],
    description: "Crafting bold, memorable brand identities from logos to full brand guidelines that set you apart.",
    tags: ["Logo Design", "Color Systems", "Typography", "Brand Guidelines"],
    color: "gold",
    accent: "#9a7b3c",
  },
  {
    id: 1,
    number: "02",
    title: ["Web", "Design"],
    description: "High-performance websites with stunning visuals and seamless user experiences that convert.",
    tags: ["Custom Design", "Responsive", "Motion Design", "SEO-Ready"],
    color: "gold",
    accent: "#7d6230",
  },
  {
    id: 2,
    number: "03",
    title: ["UI/UX", "Design"],
    description: "Intuitive digital experiences designed to enhance engagement and maximize conversions.",
    tags: ["User Research", "Wireframing", "Prototyping", "Testing"],
    color: "amber",
    accent: "#f59e0b",
  },
  {
    id: 3,
    number: "04",
    title: ["Develop", "ment"],
    description: "Clean, scalable code that brings designs to life with modern technologies and best practices.",
    tags: ["Next.js", "React", "CMS Integration", "Deployment"],
    color: "orange",
    accent: "#ea580c",
  },
];


// ============================================
// SHOWCASE COMPONENTS
// ============================================

// Logo path for animations
const LOGO_PATH = "M818.41,570.38c15.05,0,19.94-12.01,19.94-32.84v-44.63c0-14.1-1.3-32.55-19.56-32.55H685.46c-8.01,0-12.19,7.43-14.91,14.56l-59.58,173.38c-2.14,5.61-7.02,7.55-12.88,7.55H402.05c-52,0-94.75-39.61-99.71-90.3V416.41c0-38.13,22.95-70.91,55.79-85.25c-35.32-15.72-56.3-50.36-56.31-86.68v-90.87c0-51.94,42.11-94.05,94.05-94.05c0.98,0,1.95,0.01,2.93,0.05h198.9c7.92,0,14.33,6.42,14.33,14.33c0,1.58-0.26,3.1-0.73,4.52c-7.43,22.16-14.95,44.26-22.55,66.31c-2.58,7.48-10.4,8.88-18.22,8.88c-0.04,0-0.08-0.03-0.12-0.04H425.71c-16.19,2.06-27.84,16.3-26.91,32.35v59.32c0,14.92,12.03,27.03,26.91,27.17c42.5,0.39,84.92,0,127.25,0c9.09,0,17.05,6.72,14.46,14.2c-0.97,2.8-2.05,5.45-3.43,9.44l-19.75,57.05c-3.13,9.04-13.06,10.33-22.03,10.33c-0.57,0-0.5,0-0.98,0h-74.16c-24.87,0-45.04,20.16-45.04,45.04c0,2.87,0,5.62,0,7.91v117.45c-0.09,15.01-3.55,31.7,23.66,31.7h96.52c12.17,0,16.56-6.09,22.04-22.04c0.25-0.72,0.48-1.25,0.64-1.71L703.6,78.46c2.76-8.03,5.58-18.86,14.58-18.86h129.22c52.12,0,94.43,42.03,94.88,94.04v158.93c0,7.91-6.42,14.33-14.33,14.33c-0.38,0-0.75-0.01-1.12-0.04h-72.63c-8.28,0-15.09-6.25-15.99-14.29V185.96c0-20.35-16.5-36.86-36.86-36.86c-6.61,0-17.46,2.65-20.81,12.59c-17.05,50.53-68.21,202.14-68.21,202.14c-0.87,2.57,0.37,6.21,3.08,6.21c1.21,0,1.99,0,3.02,0l119.78,0.04c52.82,0,104.07,39.42,104.07,89.65v105.82c0,52.41-42.48,94.89-94.89,94.89c-0.65,0-1.3-0.01-1.95-0.02h-127c-7.23,0-18.16,0.71-14.19-12.3l21.22-69.45c1.6-5.23,6.53-8.53,11.75-8.29";

// ============================================
// PROFESSIONAL MOTION DESIGN SYSTEM
// ============================================

// Master easing curves
const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
  gentle: [0.4, 0, 0.2, 1] as const,
  morph: [0.65, 0, 0.35, 1] as const,
};

// Typography styles
const fontStyles = [
  { fontFamily: "Inter, sans-serif", fontWeight: 800, letterSpacing: "0.02em", label: "Modern Sans" },
  { fontFamily: "Georgia, serif", fontWeight: 400, letterSpacing: "0.08em", fontStyle: "italic", label: "Classic Serif" },
  { fontFamily: "system-ui, sans-serif", fontWeight: 300, letterSpacing: "0.18em", label: "Light Extended" },
  { fontFamily: "'Courier New', monospace", fontWeight: 600, letterSpacing: "0.12em", label: "Technical Mono" },
];

// Color palettes
const colorSchemes = [
  { primary: "#ffffff", secondary: "#b89a5e", accent: "#9a7b3c" },
  { primary: "#b89a5e", secondary: "#ffffff", accent: "#7d6230" },
  { primary: "#f5f0e6", secondary: "#9a7b3c", accent: "#5c4521" },
  { primary: "#e8dcc8", secondary: "#7d6230", accent: "#b89a5e" },
];

// Brand Identity Showcase - Clean phase-based animation
function BrandShowcase({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0); // Forces fresh animation on phase change

  // Phase timing
  const phaseDurations = [3200, 2200, 5500, 5000]; // draw, hold, typography, colors

  // Phase orchestration
  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setFontIndex(0);
      setColorIndex(0);
      setAnimationKey((k) => k + 1);
      return;
    }

    const timer = setTimeout(() => {
      const nextPhase = (phase + 1) % 4;
      setPhase(nextPhase);
      if (nextPhase === 0) {
        setAnimationKey((k) => k + 1); // Reset animation when looping back
      }
    }, phaseDurations[phase]);

    return () => clearTimeout(timer);
  }, [isActive, phase]);

  // Typography cycling during phase 2
  useEffect(() => {
    if (phase !== 2) return;
    const interval = setInterval(() => {
      setFontIndex((prev) => (prev + 1) % fontStyles.length);
    }, 1300);
    return () => clearInterval(interval);
  }, [phase]);

  // Color cycling during phase 3
  useEffect(() => {
    if (phase !== 3) return;
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colorSchemes.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [phase]);

  const currentFont = fontStyles[fontIndex];
  const currentColors = colorSchemes[colorIndex];

  // Animation durations
  const drawDuration = 2.8;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative w-[420px] h-[380px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.8, ease: ease.out }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Ambient glow */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184, 154, 94, 0.4) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: phase === 0 ? 0.3 : phase === 1 ? 0.6 : 0.4,
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ========== LOGO SVG - Phases 0 & 1 ========== */}
          <motion.div
            className="absolute"
            animate={{
              scale: phase <= 1 ? 1 : 0.6,
              opacity: phase <= 1 ? 1 : 0,
              y: phase <= 1 ? 0 : -40,
            }}
            transition={{ duration: 0.8, ease: ease.morph }}
          >
            <svg
              viewBox="280 40 680 640"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[240px] h-[150px]"
              style={{ overflow: "visible" }}
            >
              {/* Background glow - follows the stroke */}
              <motion.path
                key={`glow-${animationKey}`}
                d={LOGO_PATH}
                fill="none"
                stroke="#b89a5e"
                strokeWidth="16"
                strokeLinecap="square"
                strokeLinejoin="round"
                style={{ filter: "blur(15px)" }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  phase === 0
                    ? { pathLength: 1, opacity: 0.4 }
                    : phase === 1
                    ? { pathLength: 1, opacity: [0.4, 0.6, 0.4] }
                    : { pathLength: 1, opacity: 0 }
                }
                transition={
                  phase === 0
                    ? { pathLength: { duration: drawDuration, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.5 } }
                    : phase === 1
                    ? { opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" } }
                    : { opacity: { duration: 0.5 } }
                }
              />

              {/* Main stroke path - draws in phase 0 */}
              <motion.path
                key={`stroke-${animationKey}`}
                d={LOGO_PATH}
                fill="none"
                stroke="url(#brandStrokeGradient)"
                strokeWidth="4"
                strokeLinecap="square"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={
                  phase === 0
                    ? { pathLength: 1, opacity: 1 }
                    : phase === 1
                    ? { pathLength: 1, opacity: 0 }
                    : { pathLength: 1, opacity: 0 }
                }
                transition={
                  phase === 0
                    ? { pathLength: { duration: drawDuration, ease: [0.65, 0, 0.35, 1] } }
                    : { opacity: { duration: 0.6, ease: "easeOut" } }
                }
              />

              {/* Fill layer - fades in during last part of phase 0, stays through phase 1 */}
              <motion.path
                key={`fill-${animationKey}`}
                d={LOGO_PATH}
                fill="#ffffff"
                stroke="none"
                initial={{ opacity: 0 }}
                animate={
                  phase === 0
                    ? { opacity: 1 }
                    : phase === 1
                    ? { opacity: 1 }
                    : { opacity: 0 }
                }
                transition={
                  phase === 0
                    ? { opacity: { duration: 0.8, delay: drawDuration - 0.6, ease: [0.4, 0, 0.2, 1] } }
                    : { opacity: { duration: 0.5 } }
                }
              />

              {/* Shimmer sweep - only in phase 1 */}
              {phase === 1 && (
                <motion.path
                  d={LOGO_PATH}
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="3"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1], opacity: [0, 0.6, 0] }}
                  transition={{
                    duration: 1.5,
                    delay: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                    repeat: Infinity,
                    repeatDelay: 0.3,
                  }}
                />
              )}

              {/* Gradient definition */}
              <defs>
                <linearGradient id="brandStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b89a5e" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#b89a5e" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* ========== TEXT CONTAINER - Morphs in from logo ========== */}
          <motion.div
            className="absolute flex flex-col items-center"
            animate={{
              scale: phase >= 2 ? 1 : 0.7,
              opacity: phase >= 2 ? 1 : 0,
              y: phase >= 2 ? 0 : 30,
            }}
            transition={{ duration: 0.8, ease: ease.morph }}
          >
            {/* Text display - font morphs in phase 2, colors morph in phase 3 */}
            <div className="relative flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase === 3 ? "colors" : fontIndex}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: ease.out }}
                >
                  <motion.div
                    className="text-[34px] text-center leading-none"
                    style={{
                      fontFamily: currentFont.fontFamily,
                      fontWeight: currentFont.fontWeight,
                      letterSpacing: currentFont.letterSpacing,
                      fontStyle: currentFont.fontStyle || "normal",
                    }}
                    animate={{
                      color: phase === 3 ? currentColors.primary : "#ffffff",
                    }}
                    transition={{ duration: 0.5, ease: ease.gentle }}
                  >
                    EXECUTIVE
                  </motion.div>
                  <motion.div
                    className="text-[26px] text-center mt-2 leading-none"
                    style={{
                      fontFamily: currentFont.fontFamily,
                      fontWeight: currentFont.fontWeight,
                      letterSpacing: currentFont.letterSpacing,
                      fontStyle: currentFont.fontStyle || "normal",
                    }}
                    animate={{
                      color: phase === 3 ? currentColors.secondary : "#b89a5e",
                    }}
                    transition={{ duration: 0.5, ease: ease.gentle, delay: 0.05 }}
                  >
                    AI SOLUTIONS
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Label - morphs between font name and color swatches */}
            <motion.div
              className="mt-8 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {phase === 2 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={fontIndex}
                    className="px-4 py-1.5 rounded-full border border-zinc-700/60 bg-zinc-900/80"
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: ease.out }}
                  >
                    <span className="text-[11px] text-zinc-400 uppercase tracking-[0.15em] font-medium">
                      {currentFont.label}
                    </span>
                  </motion.div>
                </AnimatePresence>
              )}

              {phase === 3 && (
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="w-8 h-8 rounded-lg"
                    animate={{
                      backgroundColor: currentColors.primary,
                      boxShadow: `0 4px 20px ${currentColors.primary}40`,
                    }}
                    transition={{ duration: 0.4, ease: ease.gentle }}
                  />
                  <motion.div
                    className="w-4 h-0.5 rounded-full"
                    animate={{ backgroundColor: currentColors.accent }}
                    transition={{ duration: 0.4, ease: ease.gentle }}
                  />
                  <motion.div
                    className="w-8 h-8 rounded-lg"
                    animate={{
                      backgroundColor: currentColors.secondary,
                      boxShadow: `0 4px 20px ${currentColors.secondary}40`,
                    }}
                    transition={{ duration: 0.4, ease: ease.gentle, delay: 0.05 }}
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Phase progress indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 0.7 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {["Draw", "Logo", "Type", "Color"].map((label, i) => (
            <motion.div
              key={label}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md"
              animate={{
                backgroundColor: phase === i ? "rgba(184, 154, 94, 0.2)" : "transparent",
                opacity: phase === i ? 1 : 0.4,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                animate={{
                  backgroundColor: phase >= i ? "#b89a5e" : "#3f3f46",
                  scale: phase === i ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              <span
                className="text-[9px] font-medium tracking-wide"
                style={{ color: phase === i ? "#b89a5e" : "#52525b" }}
              >
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Web Design Showcase - Responsive design morphing between devices
function WebShowcase({ isActive }: { isActive: boolean }) {
  const [deviceIndex, setDeviceIndex] = useState(0);
  const devices = ["desktop", "tablet", "mobile"] as const;

  // Cycle through devices
  useEffect(() => {
    if (!isActive) {
      setDeviceIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setDeviceIndex((prev) => (prev + 1) % 3);
    }, 3500);

    return () => clearInterval(interval);
  }, [isActive]);

  const device = devices[deviceIndex];

  // Device dimensions that morph
  const dimensions = {
    desktop: { width: 380, height: 260, padding: 16 },
    tablet: { width: 300, height: 280, padding: 14 },
    mobile: { width: 180, height: 320, padding: 12 },
  };

  const current = dimensions[device];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, ease: ease.out }}
      >
        {/* Browser/Device Frame - morphs between sizes */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "#0f0f14",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          animate={{
            width: current.width,
            height: current.height,
            boxShadow: [
              "0 25px 80px rgba(125, 98, 48, 0.25)",
              "0 30px 100px rgba(125, 98, 48, 0.35)",
              "0 25px 80px rgba(125, 98, 48, 0.25)",
            ],
          }}
          transition={{
            width: { duration: 0.8, ease: ease.morph },
            height: { duration: 0.8, ease: ease.morph },
            boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {/* Browser Chrome - morphs */}
          <motion.div
            className="flex items-center gap-2 border-b border-white/5"
            animate={{
              padding: device === "mobile" ? "8px 10px" : "10px 14px",
            }}
            transition={{ duration: 0.6, ease: ease.morph }}
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    backgroundColor: ["#ff5f57", "#febc2e", "#28c840"][i],
                  }}
                  animate={{
                    width: device === "mobile" ? 6 : 8,
                    height: device === "mobile" ? 6 : 8,
                    opacity: device === "mobile" ? 0.6 : 0.8,
                  }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: ease.morph }}
                />
              ))}
            </div>
            <motion.div
              className="flex-1 bg-white/5 rounded-md flex items-center justify-center"
              animate={{
                height: device === "mobile" ? 16 : 20,
                opacity: device === "mobile" ? 0 : 1,
              }}
              transition={{ duration: 0.5, ease: ease.morph }}
            >
              <span className="text-[9px] text-zinc-500">yourbrand.com</span>
            </motion.div>
          </motion.div>

          {/* Content - morphs layout */}
          <motion.div
            className="space-y-2"
            animate={{ padding: current.padding }}
            transition={{ duration: 0.6, ease: ease.morph }}
          >
            {/* Nav */}
            <motion.div
              className="flex items-center justify-between"
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="rounded-md bg-gradient-to-br from-amber-500 to-orange-500"
                  animate={{
                    width: device === "mobile" ? 16 : 20,
                    height: device === "mobile" ? 16 : 20,
                  }}
                  transition={{ duration: 0.5, ease: ease.morph }}
                />
                <motion.div
                  className="bg-white rounded"
                  animate={{
                    width: device === "mobile" ? 30 : 40,
                    height: device === "mobile" ? 4 : 6,
                  }}
                  transition={{ duration: 0.5, ease: ease.morph }}
                />
              </div>
              <motion.div
                className="flex gap-2"
                animate={{ opacity: device === "mobile" ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-6 h-1 bg-zinc-700 rounded" />
                ))}
              </motion.div>
            </motion.div>

            {/* Hero text */}
            <motion.div
              className="py-2"
              animate={{
                paddingTop: device === "mobile" ? 8 : 12,
                paddingBottom: device === "mobile" ? 8 : 12,
              }}
              transition={{ duration: 0.5, ease: ease.morph }}
            >
              <motion.div
                className="bg-white rounded mb-1.5"
                animate={{
                  width: device === "desktop" ? 140 : device === "tablet" ? 120 : 100,
                  height: device === "mobile" ? 6 : 8,
                }}
                transition={{ duration: 0.5, ease: ease.morph }}
              />
              <motion.div
                className="bg-white/70 rounded mb-2"
                animate={{
                  width: device === "desktop" ? 180 : device === "tablet" ? 150 : 80,
                  height: device === "mobile" ? 5 : 7,
                }}
                transition={{ duration: 0.5, delay: 0.05, ease: ease.morph }}
              />
              <motion.div
                className="bg-zinc-600 rounded mb-3"
                animate={{
                  width: device === "desktop" ? 100 : device === "tablet" ? 90 : 60,
                  height: 4,
                }}
                transition={{ duration: 0.5, delay: 0.1, ease: ease.morph }}
              />
              <motion.div
                className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                animate={{
                  width: device === "mobile" ? 60 : 80,
                  height: device === "mobile" ? 20 : 24,
                }}
                transition={{ duration: 0.5, ease: ease.morph }}
              />
            </motion.div>

            {/* Cards grid - morphs layout */}
            <motion.div
              className="grid gap-2"
              animate={{
                gridTemplateColumns: device === "mobile" ? "1fr" : "repeat(3, 1fr)",
              }}
              transition={{ duration: 0.6, ease: ease.morph }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                  animate={{
                    padding: device === "mobile" ? 8 : 10,
                    opacity: device === "mobile" && i > 0 ? 0 : 1,
                    height: device === "mobile" && i > 0 ? 0 : "auto",
                    marginTop: device === "mobile" && i > 0 ? -8 : 0,
                  }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: ease.morph }}
                >
                  <div className="w-4 h-4 rounded bg-amber-500/20 mb-2" />
                  <div className="w-full h-1 bg-zinc-600 rounded mb-1" />
                  <div className="w-3/4 h-1 bg-zinc-700 rounded" />
                </motion.div>
              ))}
            </motion.div>

            {/* Image area */}
            <motion.div
              className="rounded-lg bg-gradient-to-br from-amber-500/15 to-orange-500/15 border border-amber-500/20 flex items-center justify-center"
              animate={{
                height: device === "desktop" ? 50 : device === "tablet" ? 60 : 70,
              }}
              transition={{ duration: 0.5, ease: ease.morph }}
            >
              <svg className="w-5 h-5 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)",
              backgroundSize: "250% 100%",
            }}
            animate={{ backgroundPosition: ["200% 0%", "-100% 0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Device Switcher */}
        <motion.div
          className="flex justify-center gap-3 mt-5"
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {devices.map((d, i) => (
            <motion.div
              key={d}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md"
              animate={{
                backgroundColor: deviceIndex === i ? "rgba(125, 98, 48, 0.2)" : "transparent",
                opacity: deviceIndex === i ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="rounded-full"
                animate={{
                  width: 6,
                  height: 6,
                  backgroundColor: deviceIndex === i ? "#9a7b3c" : "#3f3f46",
                  scale: deviceIndex === i ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              <span
                className="text-[9px] font-medium tracking-wide capitalize"
                style={{ color: deviceIndex === i ? "#9a7b3c" : "#52525b" }}
              >
                {d}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// UI/UX Showcase - Polished morphing UI components
function UIUXShowcase({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState(0);
  const phases = ["Card", "Buttons", "Form", "Dashboard"] as const;

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, 3500);

    return () => clearInterval(interval);
  }, [isActive]);

  // Refined easing for UI elements
  const uiEase = [0.4, 0, 0.2, 1] as const;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, ease: ease.out }}
      >
        {/* Main card container */}
        <motion.div
          className="relative w-[340px] h-[260px] rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #18181b 0%, #0c0c0f 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          animate={{
            boxShadow: [
              "0 20px 60px rgba(245, 158, 11, 0.12), 0 8px 24px rgba(0,0,0,0.4)",
              "0 28px 80px rgba(245, 158, 11, 0.18), 0 12px 32px rgba(0,0,0,0.5)",
              "0 20px 60px rgba(245, 158, 11, 0.12), 0 8px 24px rgba(0,0,0,0.4)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Subtle inner glow */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.15) 0%, transparent 60%)",
            }}
          />

          {/* Element 1 - Primary morphing element */}
          <motion.div
            className="absolute overflow-hidden"
            style={{
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
            animate={{
              x: [20, 20, 20, 20][phase],
              y: [20, 20, 20, 20][phase],
              width: [300, 300, 300, 145][phase],
              height: [100, 52, 52, 110][phase],
              borderRadius: [16, 26, 10, 16][phase],
              background: [
                "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(234,88,12,0.08) 100%)",
                "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                "linear-gradient(135deg, #27272a 0%, #18181b 100%)",
                "linear-gradient(135deg, #27272a 0%, #1f1f23 100%)",
              ][phase],
            }}
            transition={{ duration: 0.7, ease: uiEase }}
          >
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.div
                  key="image-placeholder"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </motion.div>
                    <span className="text-[10px] text-zinc-500 font-medium">Featured Image</span>
                  </div>
                </motion.div>
              )}
              {phase === 1 && (
                <motion.div
                  key="button-primary"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-white text-sm font-semibold tracking-wide">Get Started</span>
                  <motion.div
                    className="absolute inset-0 rounded-[26px]"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  />
                </motion.div>
              )}
              {phase === 2 && (
                <motion.div
                  key="input-field"
                  className="absolute inset-0 flex items-center px-4"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <svg className="w-4 h-4 text-zinc-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-zinc-400 text-sm">Enter your email...</span>
                  <motion.div
                    className="w-[2px] h-4 bg-amber-400 ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </motion.div>
              )}
              {phase === 3 && (
                <motion.div
                  key="stat-card-1"
                  className="absolute inset-0 flex flex-col justify-center p-5"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Revenue</span>
                  </div>
                  <span className="text-2xl font-bold text-white mb-1">$24.5k</span>
                  <span className="text-xs text-emerald-400 font-medium">+12.5% from last month</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Element 2 - Secondary morphing element */}
          <motion.div
            className="absolute overflow-hidden"
            animate={{
              x: [20, 20, 20, 175][phase],
              y: [132, 80, 80, 20][phase],
              width: [200, 300, 300, 145][phase],
              height: [14, 52, 52, 110][phase],
              borderRadius: [7, 26, 10, 16][phase],
              background: [
                "rgba(255,255,255,0.85)",
                "rgba(255,255,255,0.04)",
                "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                "linear-gradient(135deg, #27272a 0%, #1f1f23 100%)",
              ][phase],
              boxShadow: [
                "none",
                "inset 0 0 0 1px rgba(255,255,255,0.1)",
                "0 4px 16px rgba(245,158,11,0.3)",
                "0 4px 16px rgba(0,0,0,0.2)",
              ][phase],
            }}
            transition={{ duration: 0.7, ease: uiEase }}
          >
            <AnimatePresence mode="wait">
              {phase === 1 && (
                <motion.div
                  key="button-secondary"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-zinc-300 text-sm font-medium">Learn More</span>
                </motion.div>
              )}
              {phase === 2 && (
                <motion.div
                  key="submit-btn"
                  className="absolute inset-0 flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-white text-sm font-semibold">Subscribe</span>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.div>
              )}
              {phase === 3 && (
                <motion.div
                  key="stat-card-2"
                  className="absolute inset-0 flex flex-col justify-center p-5"
                  style={{ border: "1px solid rgba(245,158,11,0.2)" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Users</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-400 mb-1">1,847</span>
                  <span className="text-xs text-emerald-400 font-medium">+8.2% this week</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Element 3 - Tertiary morphing element */}
          <motion.div
            className="absolute overflow-hidden"
            animate={{
              x: [20, 20, 20, 20][phase],
              y: [156, 140, 140, 140][phase],
              width: [140, 300, 116, 300][phase],
              height: [12, 52, 48, 100][phase],
              borderRadius: [6, 26, 24, 12][phase],
              background: [
                "rgba(113,113,122,0.8)",
                "rgba(245,158,11,0.08)",
                "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)",
                "rgba(39,39,42,0.4)",
              ][phase],
              boxShadow: phase === 2 ? "0 4px 16px rgba(234,88,12,0.3)" : "none",
            }}
            transition={{ duration: 0.7, ease: uiEase }}
          >
            <AnimatePresence mode="wait">
              {phase === 1 && (
                <motion.div
                  key="button-outline"
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ border: "1px solid rgba(245,158,11,0.4)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-amber-400 text-sm font-medium">Contact Us</span>
                </motion.div>
              )}
              {phase === 2 && (
                <motion.div
                  key="skip-btn"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-white text-xs font-semibold">Skip for now</span>
                </motion.div>
              )}
              {phase === 3 && (
                <motion.div
                  key="chart-area"
                  className="absolute inset-0 flex items-end justify-between px-4 pb-3 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="absolute top-3 left-4 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Weekly Activity</div>
                  {[28, 45, 32, 58, 42, 75, 52].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-6 rounded-t-md"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: ease.out }}
                      style={{
                        background: i === 5
                          ? "linear-gradient(to top, #9a7b3c, #b89a5e)"
                          : "rgba(255,255,255,0.08)",
                        boxShadow: i === 5 ? "0 0 12px rgba(184,154,94,0.4)" : "none",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Element 4 - Accent/detail element */}
          <motion.div
            className="absolute overflow-hidden"
            animate={{
              x: [20, 20, 144, 20][phase],
              y: [178, 200, 140, 20][phase],
              width: [80, 145, 176, 0][phase],
              height: [12, 44, 48, 0][phase],
              borderRadius: [6, 22, 24, 0][phase],
              background: [
                "rgba(63,63,70,0.8)",
                "rgba(63,63,70,0.4)",
                "linear-gradient(135deg, #27272a 0%, #18181b 100%)",
                "transparent",
              ][phase],
              opacity: phase === 3 ? 0 : 1,
            }}
            transition={{ duration: 0.7, ease: uiEase }}
          >
            <AnimatePresence mode="wait">
              {phase === 1 && (
                <motion.div
                  key="icon-btn"
                  className="absolute inset-0 flex items-center justify-center gap-2"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-zinc-400 text-xs">Help</span>
                </motion.div>
              )}
              {phase === 2 && (
                <motion.div
                  key="checkbox"
                  className="absolute inset-0 flex items-center justify-center gap-3 px-4"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <motion.div
                    className="w-5 h-5 rounded-md bg-amber-500 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3, ease: ease.out }}
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <span className="text-zinc-400 text-xs">I agree to terms</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Floating accent dots - only in certain phases */}
          {phase === 0 && (
            <>
              <motion.div
                className="absolute w-2 h-2 rounded-full bg-amber-500/60"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [240, 280, 300],
                  y: [180, 160, 140],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute w-1.5 h-1.5 rounded-full bg-orange-500/50"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [260, 290, 310],
                  y: [200, 185, 170],
                }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}

          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.015) 45%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.015) 55%, transparent 60%)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPosition: ["150% 0%", "-50% 0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Phase indicator - refined */}
        <motion.div
          className="flex justify-center gap-2 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {phases.map((label, i) => (
            <motion.div
              key={label}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
              animate={{
                backgroundColor: phase === i ? "rgba(245, 158, 11, 0.12)" : "transparent",
                opacity: phase === i ? 1 : 0.4,
              }}
              transition={{ duration: 0.35 }}
            >
              <motion.div
                className="rounded-full"
                animate={{
                  width: phase === i ? 8 : 6,
                  height: phase === i ? 8 : 6,
                  backgroundColor: phase === i ? "#f59e0b" : "#3f3f46",
                }}
                transition={{ duration: 0.35 }}
              />
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{ color: phase === i ? "#f59e0b" : "#52525b" }}
              >
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Development Showcase - Live coding animation with deploy pipeline
function DevShowcase({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState(0);
  const [typedLines, setTypedLines] = useState(0);
  const phases = ["code", "build", "deploy"] as const;

  // Phase cycling
  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setTypedLines(0);
      return;
    }

    const phaseDurations = [4000, 2500, 3000];
    const timer = setTimeout(() => {
      setPhase((prev) => (prev + 1) % 3);
      if (phase === 2) setTypedLines(0);
    }, phaseDurations[phase]);

    return () => clearTimeout(timer);
  }, [isActive, phase]);

  // Typing animation for code phase
  useEffect(() => {
    if (!isActive || phase !== 0) return;

    const totalLines = 7;
    if (typedLines >= totalLines) return;

    const timer = setTimeout(() => {
      setTypedLines((prev) => prev + 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [isActive, phase, typedLines]);

  const currentPhase = phases[phase];

  const codeLines = [
    { num: 1, content: <><span className="text-[#ff7b72]">export default</span> <span className="text-[#d2a8ff]">function</span> <span className="text-[#ffa657]">Home</span>() {"{"}</> },
    { num: 2, content: <span className="text-[#8b949e]">{"  return ("}</span> },
    { num: 3, content: <>{"    "}<span className="text-[#7ee787]">&lt;main</span> <span className="text-[#79c0ff]">className</span>=<span className="text-[#a5d6ff]">"flex flex-col"</span><span className="text-[#7ee787]">&gt;</span></> },
    { num: 4, content: <>{"      "}<span className="text-[#7ee787]">&lt;Hero</span> <span className="text-[#7ee787]">/&gt;</span></> },
    { num: 5, content: <>{"      "}<span className="text-[#7ee787]">&lt;Services</span> <span className="text-[#7ee787]">/&gt;</span></> },
    { num: 6, content: <>{"    "}<span className="text-[#7ee787]">&lt;/main&gt;</span></> },
    { num: 7, content: <>{"}"}</> },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, ease: ease.out }}
      >
        {/* Main container */}
        <motion.div
          className="relative w-[380px] rounded-2xl overflow-hidden"
          style={{
            background: "#0d1117",
            border: "1px solid rgba(48, 54, 61, 0.8)",
          }}
          animate={{
            boxShadow: [
              "0 25px 80px rgba(234, 88, 12, 0.15)",
              "0 30px 100px rgba(234, 88, 12, 0.25)",
              "0 25px 80px rgba(234, 88, 12, 0.15)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#30363d]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: ["#ff5f57", "#febc2e", "#28c840"][i] }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  />
                ))}
              </div>
              <motion.div
                className="flex items-center gap-2 px-2 py-0.5 rounded bg-[#1c2128]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-[10px] text-[#8b949e] font-mono">page.tsx</span>
              </motion.div>
            </div>
            <motion.div
              className="px-2 py-0.5 rounded text-[9px] font-medium"
              animate={{
                backgroundColor: phase === 0 ? "rgba(136, 46, 224, 0.2)" : phase === 1 ? "rgba(245, 158, 11, 0.2)" : "rgba(34, 197, 94, 0.2)",
                color: phase === 0 ? "#a78bfa" : phase === 1 ? "#fbbf24" : "#4ade80",
              }}
              transition={{ duration: 0.3 }}
            >
              {currentPhase.toUpperCase()}
            </motion.div>
          </div>

          {/* Content area */}
          <AnimatePresence mode="wait">
            {/* Code Phase */}
            {phase === 0 && (
              <motion.div
                key="code"
                className="p-4 font-mono text-[11px] leading-5 h-[200px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {codeLines.map((line, i) => (
                  <motion.div
                    key={line.num}
                    className="flex"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i < typedLines ? 1 : 0.2, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <span className="text-[#6e7681] w-6 select-none">{line.num}</span>
                    <span>{line.content}</span>
                    {i === typedLines - 1 && (
                      <motion.span
                        className="inline-block w-[2px] h-4 bg-orange-400 ml-0.5"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Build Phase */}
            {phase === 1 && (
              <motion.div
                key="build"
                className="p-4 font-mono text-[10px] h-[200px] flex flex-col justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {[
                  { text: "▶ Building application...", delay: 0 },
                  { text: "  ✓ Compiled successfully", delay: 0.4, color: "#4ade80" },
                  { text: "  ✓ Type checking passed", delay: 0.8, color: "#4ade80" },
                  { text: "  ✓ Linting completed", delay: 1.2, color: "#4ade80" },
                  { text: "▶ Optimizing bundle...", delay: 1.6 },
                  { text: "  ✓ Bundle size: 142kb", delay: 2.0, color: "#4ade80" },
                ].map((line, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: line.delay, duration: 0.3 }}
                    style={{ color: line.color || "#8b949e" }}
                  >
                    {line.text}
                    {i === 0 && (
                      <motion.div
                        className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: 2, ease: "linear" }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Deploy Phase */}
            {phase === 2 && (
              <motion.div
                key="deploy"
                className="p-4 h-[200px] flex flex-col items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Success animation */}
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, ease: ease.out }}
                >
                  <motion.svg
                    className="w-8 h-8 text-green-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                  </motion.svg>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-green-400 font-medium text-sm mb-1">Deployed Successfully</div>
                  <div className="text-zinc-500 text-xs font-mono">yourbrand.com</div>
                </motion.div>

                {/* Particles */}
                {[...Array(6)].map((_, i) => {
                  const angle = (i / 6) * Math.PI * 2;
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-green-400"
                      initial={{ x: 0, y: 0, opacity: 0 }}
                      animate={{
                        x: Math.cos(angle) * 60,
                        y: Math.sin(angle) * 60,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          className="flex justify-center gap-2 mt-5"
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            { name: "Next.js", color: "#ffffff" },
            { name: "React", color: "#61dafb" },
            { name: "TypeScript", color: "#3178c6" },
            { name: "Tailwind", color: "#38bdf8" },
          ].map((tech, i) => (
            <motion.div
              key={tech.name}
              className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50 flex items-center gap-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tech.color }}
                animate={{
                  boxShadow: phase === 2 ? [`0 0 0 0 ${tech.color}00`, `0 0 8px 2px ${tech.color}40`, `0 0 0 0 ${tech.color}00`] : "none",
                }}
                transition={{ duration: 1.5, repeat: phase === 2 ? Infinity : 0, delay: i * 0.2 }}
              />
              <span className="text-[9px] text-zinc-400 font-medium">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Phase indicator */}
        <motion.div
          className="flex justify-center gap-3 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
        >
          {phases.map((p, i) => (
            <motion.div
              key={p}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md"
              animate={{
                backgroundColor: phase === i ? "rgba(234, 88, 12, 0.15)" : "transparent",
                opacity: phase === i ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="rounded-full"
                animate={{
                  width: 6,
                  height: 6,
                  backgroundColor: phase === i ? "#ea580c" : "#3f3f46",
                  scale: phase === i ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              <span
                className="text-[9px] font-medium tracking-wide capitalize"
                style={{ color: phase === i ? "#ea580c" : "#52525b" }}
              >
                {p}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ============================================
// SERVICE CONTENT ITEM
// ============================================
function ServiceContent({
  service,
  index,
  isActive
}: {
  service: typeof services[0];
  index: number;
  isActive: boolean;
}) {
  const colorMap: Record<string, string> = {
    gold: "text-[#b89a5e]",
    amber: "text-[#9a7b3c]",
    orange: "text-orange-500",
  };

  return (
    <motion.div
      className="min-h-screen flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full">
        <motion.span
          className={`${colorMap[service.color]} text-sm font-mono mb-4 block`}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          {service.number}
        </motion.span>
        <div className="overflow-hidden mb-6">
          <motion.h3
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight"
            initial={{ y: 80 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.1 }}
          >
            {service.title[0]}
          </motion.h3>
          <motion.h3
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight"
            initial={{ y: 80 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
          >
            {service.title[1]}
          </motion.h3>
        </div>
        <motion.p
          className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: smoothEase, delay: 0.4 }}
        >
          {service.description}
        </motion.p>
        <div className="flex flex-wrap gap-3">
          {service.tags.map((tag, i) => (
            <motion.span
              key={tag}
              className="px-4 py-2 rounded-full text-sm border border-zinc-800 text-zinc-400"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: smoothEase }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN SERVICES COMPONENT
// ============================================
export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Update active index based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(3, Math.floor(latest * 4));
    setActiveIndex(index);
  });

  const showcases = [
    <BrandShowcase key="brand" isActive={activeIndex === 0} />,
    <WebShowcase key="web" isActive={activeIndex === 1} />,
    <UIUXShowcase key="uiux" isActive={activeIndex === 2} />,
    <DevShowcase key="dev" isActive={activeIndex === 3} />,
  ];

  return (
    <section
      id="services"
      className="relative bg-[#111114]"
    >
      {/* Section header */}
      <div className="relative pt-24 pb-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[#b89a5e] text-sm font-medium tracking-wider uppercase mb-3"
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

      {/* Sticky scroll container */}
      <div ref={containerRef} className="relative">
        <div className="flex">
          {/* Left - Scrolling content */}
          <div className="w-full lg:w-1/2 px-6 md:px-12 lg:px-20">
            {services.map((service, index) => (
              <ServiceContent
                key={service.id}
                service={service}
                index={index}
                isActive={activeIndex === index}
              />
            ))}
          </div>

          {/* Right - Sticky showcase (hidden on mobile) */}
          <div className="hidden lg:block w-1/2 relative">
            <div className="sticky top-0 h-screen flex items-center justify-center pr-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  className="relative flex items-center justify-center"
                  style={{ width: 420, height: 400 }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: smoothEase }}
                >
                  {showcases[activeIndex]}
                </motion.div>
              </AnimatePresence>

              {/* Progress indicators */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                {services.map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    animate={{
                      scale: activeIndex === i ? 1.5 : 1,
                      backgroundColor: activeIndex === i ? "#9a7b3c" : "#3f3f46",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Show showcase inline for each section */}
        <div className="lg:hidden">
          {services.map((_, index) => (
            <div key={index} className="h-[50vh] flex items-center justify-center px-6">
              {index === 0 && <BrandShowcase isActive={true} />}
              {index === 1 && <WebShowcase isActive={true} />}
              {index === 2 && <UIUXShowcase isActive={true} />}
              {index === 3 && <DevShowcase isActive={true} />}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-20 text-center">
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
          <ShineButton href="#contact">
            Start Your Project
            <span>→</span>
          </ShineButton>
        </motion.div>
      </div>
    </section>
  );
}
