"use client";

import { motion, useScroll, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import ShineButton from "./ShineButton";

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

// EA Logo SVG Component - accurate recreation of the Executive AI Solutions logo
function EALogo({ className, pathClassName }: { className?: string; pathClassName?: string }) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/*
        The logo is an interlocking E and A:
        - Left side: E with rounded left edge and 3 prongs (top, middle, bottom)
        - Right side: A that shares the vertical bar, with triangular cutout
        - The E's middle prong extends into the A's counter space
      */}
      <path
        className={pathClassName}
        d="
          M12 8
          C5.4 8 0 13.4 0 20
          L0 60
          C0 66.6 5.4 72 12 72
          L45 72
          L45 58
          L18 58
          L18 44
          L40 44
          L40 36
          L18 36
          L18 22
          L45 22
          L45 8
          L12 8
          Z

          M45 8
          L45 72
          L59 72
          L59 50
          L75 50
          L75 72
          L89 72
          L89 20
          C89 13.4 83.6 8 77 8
          L45 8
          Z

          M59 22
          L75 22
          L75 36
          L59 36
          L59 22
          Z
        "
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

// Brand Identity Showcase - Shape morphs into EA logo
function BrandShowcase({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      return;
    }

    // Phase timeline: 0 -> 1 -> 2 -> 3 -> loop back to 0
    const delays = [2500, 2500, 2500, 2500];

    const timeout = setTimeout(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, delays[phase]);

    return () => clearTimeout(timeout);
  }, [isActive, phase]);

  // Phase 0: Abstract shapes animate and converge
  // Phase 1: Shapes morph into EA logo
  // Phase 2: Typography reveals "EXECUTIVE AI SOLUTIONS"
  // Phase 3: Color palette with full brand lockup

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative w-[380px] h-[320px]"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        {/* Central canvas */}
        <div className="absolute inset-0 flex items-center justify-center">

          {/* Phase 0: Abstract shapes that will converge */}
          {phase === 0 && (
            <>
              {/* Floating circle */}
              <motion.div
                className="absolute w-16 h-16 rounded-full bg-amber-500/30"
                initial={{ x: -80, y: -60, scale: 0, opacity: 0 }}
                animate={{ x: -40, y: -30, scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: smoothEase }}
              />
              {/* Floating square */}
              <motion.div
                className="absolute w-12 h-12 rounded-lg bg-orange-500/30"
                initial={{ x: 80, y: 40, scale: 0, opacity: 0 }}
                animate={{ x: 50, y: 20, scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
              />
              {/* Floating rectangle */}
              <motion.div
                className="absolute w-20 h-8 rounded-md bg-yellow-500/30"
                initial={{ x: -60, y: 60, scale: 0, opacity: 0 }}
                animate={{ x: -30, y: 40, scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
              />
              {/* Center morphing shape */}
              <motion.div
                className="absolute bg-gradient-to-br from-amber-500 to-amber-600"
                initial={{ width: 20, height: 20, borderRadius: 100 }}
                animate={{
                  width: [20, 60, 40],
                  height: [20, 60, 60],
                  borderRadius: [100, 16, 12],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                }}
              />
            </>
          )}

          {/* EA Logo - appears in phase 1+ */}
          <motion.div
            className="absolute"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase >= 1 ? (phase >= 2 ? 0.7 : 1.2) : 0,
              opacity: phase >= 1 ? 1 : 0,
              y: phase >= 2 ? -50 : 0,
              x: phase >= 2 ? -60 : 0,
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Glow effect behind logo */}
            <motion.div
              className="absolute inset-0 blur-2xl"
              animate={{
                opacity: phase === 1 ? [0.3, 0.6, 0.3] : 0.2,
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <EALogo className="w-20 h-20 text-amber-500" />
            </motion.div>

            {/* Main logo with draw-in effect */}
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={phase >= 1 ? { clipPath: "inset(0 0% 0 0)" } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            >
              <EALogo className="w-20 h-20 text-white relative z-10" />
            </motion.div>
          </motion.div>

          {/* Typography - Phase 2+ */}
          <motion.div
            className="absolute flex flex-col items-start"
            animate={{
              opacity: phase >= 2 ? 1 : 0,
              x: phase >= 2 ? 10 : 0,
              y: phase >= 2 ? -50 : 0,
            }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            {/* EXECUTIVE */}
            <div className="flex">
              {"EXECUTIVE".split("").map((letter, i) => (
                <motion.span
                  key={`exec-${i}`}
                  className="text-white font-bold text-2xl tracking-wide"
                  initial={{ opacity: 0, y: 15 }}
                  animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{
                    duration: 0.4,
                    delay: phase >= 2 ? 0.3 + i * 0.03 : 0,
                    ease: smoothEase,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            {/* AI SOLUTIONS */}
            <div className="flex">
              {"AI SOLUTIONS".split("").map((letter, i) => (
                <motion.span
                  key={`ai-${i}`}
                  className="text-amber-400 font-bold text-2xl tracking-wide"
                  initial={{ opacity: 0, y: 15 }}
                  animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{
                    duration: 0.4,
                    delay: phase >= 2 ? 0.5 + i * 0.03 : 0,
                    ease: smoothEase,
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Color Palette - Phase 3 */}
          <motion.div
            className="absolute flex gap-3"
            style={{ bottom: 50 }}
            animate={{
              opacity: phase >= 3 ? 1 : 0,
              y: phase >= 3 ? 0 : 20,
            }}
            transition={{ duration: 0.6, ease: smoothEase }}
          >
            {[
              { color: "#b89a5e", name: "Gold" },
              { color: "#9a7b3c", name: "Bronze" },
              { color: "#7d6230", name: "Dark" },
              { color: "#5c4521", name: "Deep" },
            ].map((swatch, i) => (
              <motion.div
                key={swatch.color}
                className="flex flex-col items-center gap-2"
                initial={{ scale: 0, y: 20 }}
                animate={phase >= 3 ? { scale: 1, y: 0 } : { scale: 0, y: 20 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + i * 0.1,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <motion.div
                  className="w-10 h-10 rounded-xl"
                  style={{
                    backgroundColor: swatch.color,
                    border: swatch.color === "#fef3c7" ? "1px solid rgba(255,255,255,0.2)" : "none",
                    boxShadow: `0 4px 20px ${swatch.color}40`,
                  }}
                  animate={phase === 3 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.1, ease: "easeInOut" }}
                />
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider">{swatch.name}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Decorative particles during phase 0 */}
          {phase === 0 && (
            <>
              {[...Array(6)].map((_, i) => {
                const angle = i * 60 * Math.PI / 180;
                const x100 = Math.round(Math.cos(angle) * 100);
                const y100 = Math.round(Math.sin(angle) * 100);
                const x50 = Math.round(Math.cos(angle) * 50);
                const y50 = Math.round(Math.sin(angle) * 50);
                return (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-[#b89a5e]/50"
                    initial={{
                      x: x100,
                      y: y100,
                      scale: 0,
                    }}
                    animate={{
                      x: [x100, x50, 0],
                      y: [y100, y50, 0],
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
            </>
          )}
        </div>

        {/* Phase indicator */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {["Shapes", "Logo", "Typography", "Colors"].map((label, i) => (
            <motion.div
              key={label}
              className="flex items-center gap-1.5"
              animate={{ opacity: phase === i ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                animate={{
                  backgroundColor: phase === i ? "#9a7b3c" : "#3f3f46",
                  scale: phase === i ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-[9px] text-zinc-500">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Web Design Showcase - Shows a realistic website mockup in a browser
function WebShowcase({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        {/* Browser Window */}
        <motion.div
          className="relative w-[380px] rounded-2xl overflow-hidden"
          style={{
            background: "#0f0f14",
            boxShadow: "0 25px 80px rgba(212, 165, 55, 0.2)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div className="flex gap-1.5">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-red-500/80"
                initial={{ scale: 0 }}
                animate={isActive ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"
                initial={{ scale: 0 }}
                animate={isActive ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              />
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-green-500/80"
                initial={{ scale: 0 }}
                animate={isActive ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              />
            </div>
            <motion.div
              className="flex-1 h-5 bg-white/5 rounded-md flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <span className="text-[9px] text-zinc-500">yourbrand.com</span>
            </motion.div>
          </div>

          {/* Website Content */}
          <div className="p-4 space-y-3">
            {/* Navigation */}
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-500" />
                <span className="text-white text-xs font-medium">Brand</span>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-1.5 bg-zinc-700 rounded" />
                <div className="w-8 h-1.5 bg-zinc-700 rounded" />
                <div className="w-8 h-1.5 bg-zinc-700 rounded" />
              </div>
            </motion.div>

            {/* Hero Section */}
            <motion.div
              className="py-4"
              initial={{ opacity: 0, y: 10 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="w-32 h-2 bg-white rounded mb-2" />
              <div className="w-40 h-2 bg-white/80 rounded mb-3" />
              <div className="w-24 h-1.5 bg-zinc-600 rounded mb-4" />
              <div className="w-20 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              className="grid grid-cols-3 gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <div className="w-4 h-4 rounded bg-amber-500/20 mb-2" />
                  <div className="w-full h-1 bg-zinc-600 rounded mb-1" />
                  <div className="w-3/4 h-1 bg-zinc-700 rounded" />
                </div>
              ))}
            </motion.div>

            {/* Image Section */}
            <motion.div
              className="h-16 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Device Switcher */}
        <motion.div
          className="flex justify-center gap-2 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {[
            { label: "Desktop", active: true },
            { label: "Tablet", active: false },
            { label: "Mobile", active: false },
          ].map((device) => (
            <motion.div
              key={device.label}
              className={`px-3 py-1 rounded-full text-[10px] font-medium ${
                device.active
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-zinc-800/50 text-zinc-500 border border-zinc-700/50"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {device.label}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// UI/UX Showcase - Morphing UI components with smooth motion design transitions
function UIUXShowcase({ isActive }: { isActive: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Morphing UI elements - each transforms smoothly between phases
  // Phase 0: Card with image and text
  // Phase 1: Button group / CTA
  // Phase 2: Input form
  // Phase 3: Stats dashboard

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        {/* Main card container */}
        <motion.div
          className="relative w-[340px] h-[240px] rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
          animate={{
            boxShadow: [
              "0 25px 80px rgba(245, 158, 11, 0.2)",
              "0 30px 100px rgba(245, 158, 11, 0.3)",
              "0 25px 80px rgba(245, 158, 11, 0.2)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Element 1 - Header/Image area that morphs */}
          <motion.div
            className="absolute bg-gradient-to-br from-amber-500/20 to-orange-500/20"
            animate={{
              x: [16, 16, 16, 16][phase],
              y: [16, 16, 16, 16][phase],
              width: [308, 308, 308, 150][phase],
              height: [90, 48, 48, 100][phase],
              borderRadius: [12, 24, 8, 12][phase],
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Inner content morphs per phase */}
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.div
                  key="image"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-8 h-8 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </motion.div>
              )}
              {phase === 1 && (
                <motion.div
                  key="button-primary"
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white text-sm font-medium">Get Started</span>
                </motion.div>
              )}
              {phase === 2 && (
                <motion.div
                  key="input"
                  className="absolute inset-0 flex items-center px-4 bg-zinc-800/80 border border-zinc-600 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-zinc-400 text-sm">Enter your email...</span>
                </motion.div>
              )}
              {phase === 3 && (
                <motion.div
                  key="stat1"
                  className="absolute inset-0 flex flex-col justify-center p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Revenue</span>
                  <span className="text-xl font-bold text-white">$24.5k</span>
                  <span className="text-[10px] text-emerald-400">+12.5%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Element 2 - Text/Secondary element */}
          <motion.div
            className="absolute"
            animate={{
              x: [16, 16, 16, 174][phase],
              y: [118, 72, 72, 16][phase],
              width: [200, 308, 308, 150][phase],
              height: [12, 48, 48, 100][phase],
              borderRadius: [4, 24, 8, 12][phase],
              backgroundColor: [
                "rgba(255,255,255,0.9)",
                "rgba(255,255,255,0.08)",
                "rgba(245,158,11,1)",
                "rgba(39,39,42,0.5)",
              ][phase],
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <AnimatePresence mode="wait">
              {phase === 1 && (
                <motion.div
                  key="button-secondary"
                  className="absolute inset-0 flex items-center justify-center border border-zinc-600 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-zinc-300 text-sm">Learn More</span>
                </motion.div>
              )}
              {phase === 2 && (
                <motion.div
                  key="submit"
                  className="absolute inset-0 flex items-center justify-center rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-white text-sm font-medium">Subscribe</span>
                </motion.div>
              )}
              {phase === 3 && (
                <motion.div
                  key="stat2"
                  className="absolute inset-0 flex flex-col justify-center p-4 border border-amber-500/30 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Users</span>
                  <span className="text-xl font-bold text-amber-400">1,847</span>
                  <span className="text-[10px] text-emerald-400">+8.2%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Element 3 - Description/tertiary */}
          <motion.div
            className="absolute bg-zinc-600"
            animate={{
              x: [16, 16, 16, 16][phase],
              y: [140, 128, 128, 124][phase],
              width: [140, 308, 110, 308][phase],
              height: [10, 48, 44, 100][phase],
              borderRadius: [4, 24, 22, 8][phase],
              backgroundColor: [
                "rgba(113,113,122,1)",
                "rgba(245,158,11,0.15)",
                "rgba(245,158,11,1)",
                "rgba(39,39,42,0.3)",
              ][phase],
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <AnimatePresence mode="wait">
              {phase === 1 && (
                <motion.div
                  key="contact"
                  className="absolute inset-0 flex items-center justify-center border border-amber-500/50 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-amber-400 text-sm">Contact Us</span>
                </motion.div>
              )}
              {phase === 2 && (
                <motion.div
                  key="skip"
                  className="absolute inset-0 flex items-center justify-center rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-white text-xs font-medium">Skip for now</span>
                </motion.div>
              )}
              {phase === 3 && (
                <motion.div
                  key="chart"
                  className="absolute inset-0 flex items-end justify-around p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[30, 50, 35, 65, 45, 80, 55].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-4 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        background: i === 5 ? "linear-gradient(to top, #9a7b3c, #b89a5e)" : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Element 4 - Tags/small details */}
          <motion.div
            className="absolute"
            animate={{
              x: [16, 16, 134, 16][phase],
              y: [160, 184, 128, 16][phase],
              width: [80, 180, 190, 0][phase],
              height: [10, 40, 44, 0][phase],
              borderRadius: [4, 20, 22, 0][phase],
              backgroundColor: [
                "rgba(82,82,91,1)",
                "rgba(82,82,91,0.5)",
                "rgba(234,88,12,1)",
                "transparent",
              ][phase],
              opacity: phase === 3 ? 0 : 1,
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <AnimatePresence mode="wait">
              {phase === 2 && (
                <motion.div
                  key="terms"
                  className="absolute inset-0 flex items-center justify-center rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-white text-[10px]">No spam, ever</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 55%, transparent 60%)",
              backgroundSize: "250% 100%",
            }}
            animate={{ backgroundPosition: ["200% 0%", "-100% 0%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Phase indicator */}
        <motion.div
          className="flex justify-center gap-2 mt-5"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {["Card", "Buttons", "Form", "Dashboard"].map((label, i) => (
            <motion.div
              key={label}
              className="flex items-center gap-1.5"
              animate={{ opacity: phase === i ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                animate={{
                  backgroundColor: phase === i ? "#f59e0b" : "#3f3f46",
                  scale: phase === i ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-[9px] text-zinc-500">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Development Showcase - Shows a code editor with tech stack
function DevShowcase({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: smoothEase }}
      >
        {/* Code Editor */}
        <motion.div
          className="relative w-[380px] rounded-2xl overflow-hidden"
          style={{
            background: "#0d1117",
            boxShadow: "0 25px 80px rgba(234, 88, 12, 0.2)",
            border: "1px solid rgba(48, 54, 61, 0.8)",
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Editor Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#30363d]">
            <div className="flex gap-1.5">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-[#f85149]"
                initial={{ scale: 0 }}
                animate={isActive ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-[#f0883e]"
                initial={{ scale: 0 }}
                animate={isActive ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              />
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-[#3fb950]"
                initial={{ scale: 0 }}
                animate={isActive ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              />
            </div>
            <motion.span
              className="text-[10px] text-[#8b949e] font-mono ml-2"
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              page.tsx
            </motion.span>
          </div>

          {/* Code Content */}
          <div className="p-4 font-mono text-[11px] leading-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex">
                <span className="text-[#6e7681] w-6 select-none">1</span>
                <span><span className="text-[#ff7b72]">export default</span> <span className="text-[#d2a8ff]">function</span> <span className="text-[#ffa657]">Home</span>() {"{"}</span>
              </div>
              <div className="flex">
                <span className="text-[#6e7681] w-6 select-none">2</span>
                <span className="text-[#8b949e]">  return (</span>
              </div>
              <div className="flex">
                <span className="text-[#6e7681] w-6 select-none">3</span>
                <span>    <span className="text-[#7ee787]">&lt;main</span> <span className="text-[#79c0ff]">className</span>=<span className="text-[#a5d6ff]">"container"</span><span className="text-[#7ee787]">&gt;</span></span>
              </div>
              <div className="flex">
                <span className="text-[#6e7681] w-6 select-none">4</span>
                <span>      <span className="text-[#7ee787]">&lt;Hero</span> <span className="text-[#7ee787]">/&gt;</span></span>
              </div>
              <div className="flex">
                <span className="text-[#6e7681] w-6 select-none">5</span>
                <span>      <span className="text-[#7ee787]">&lt;Services</span> <span className="text-[#7ee787]">/&gt;</span></span>
              </div>
              <div className="flex">
                <span className="text-[#6e7681] w-6 select-none">6</span>
                <span>      <span className="text-[#7ee787]">&lt;Contact</span> <span className="text-[#7ee787]">/&gt;</span></span>
              </div>
              <div className="flex">
                <span className="text-[#6e7681] w-6 select-none">7</span>
                <span>    <span className="text-[#7ee787]">&lt;/main&gt;</span></span>
              </div>
              <div className="flex">
                <span className="text-[#6e7681] w-6 select-none">8</span>
                <span className="text-[#8b949e]">  );</span>
              </div>
              <div className="flex">
                <span className="text-[#6e7681] w-6 select-none">9</span>
                <span>{"}"}</span>
              </div>
            </motion.div>

            {/* Blinking cursor */}
            <motion.span
              className="inline-block w-[2px] h-3 bg-emerald-400 ml-6"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          className="flex justify-center gap-2 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { name: "Next.js", color: "#ffffff" },
            { name: "React", color: "#61dafb" },
            { name: "TypeScript", color: "#3178c6" },
            { name: "Tailwind", color: "#38bdf8" },
          ].map((tech) => (
            <motion.div
              key={tech.name}
              className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-zinc-700/50 flex items-center gap-1.5"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tech.color }} />
              <span className="text-[9px] text-zinc-400 font-medium">{tech.name}</span>
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
    <section id="services" className="relative bg-[#111114] rounded-t-[3rem] -mt-12 z-40 shadow-section-stack">

      {/* Section header */}
      <div className="relative pt-16 pb-4 text-center">
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
