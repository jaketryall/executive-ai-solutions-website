"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { workItems } from "./Work";

// Button with staggered text reveal on hover
function AnimatedButton({
  text,
  href,
  variant = "primary",
  showArrow = false,
}: {
  text: string;
  href: string;
  variant?: "primary" | "secondary";
  showArrow?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  const baseStyles = variant === "primary"
    ? "bg-white text-[#0a0a0a] hover:bg-zinc-100"
    : "border border-zinc-700 text-white hover:bg-white/5";

  const getDelay = (index: number) => {
    const baseDelay = 0.035;
    const acceleration = 0.82;
    let delay = 0;
    for (let i = 0; i < index; i++) {
      delay += baseDelay * Math.pow(acceleration, i);
    }
    return delay;
  };

  return (
    <motion.a
      href={href}
      className={`group inline-flex items-center justify-center gap-3 px-6 py-3 text-sm font-medium rounded-full transition-colors ${baseStyles}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
    >
      <span className="inline-flex items-center relative">
        {characters.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden relative"
            style={{
              height: "1.2em",
              lineHeight: "1.2em",
            }}
          >
            <motion.span
              className="inline-block"
              animate={{
                y: isHovered ? "-110%" : "0%",
              }}
              transition={{
                duration: 0.3,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            <motion.span
              className="inline-block absolute left-0 top-0"
              animate={{
                y: isHovered ? "0%" : "110%",
              }}
              transition={{
                duration: 0.3,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
      {showArrow && (
        <motion.span
          className="inline-block"
          animate={isHovered ? { x: 4 } : { x: 0 }}
          transition={{
            duration: 0.25,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          →
        </motion.span>
      )}
    </motion.a>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedWork, setSelectedWork] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  // Phone mockup scroll animations - these make it move!
  const phoneY = useTransform(scrollYProgress, [0, 0.6], [0, 200]);
  const phoneRotateY = useTransform(scrollYProgress, [0, 0.5], [-12, 0]);
  const phoneRotateX = useTransform(scrollYProgress, [0, 0.5], [3, 0]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.15]);

  // Work cards scroll animations
  const cardsX = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const cardsOpacity = useTransform(scrollYProgress, [0.3, 0.5], [1, 0]);

  const currentProject = workItems[selectedWork];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#0a0a0a] overflow-hidden"
    >
      {/* Content */}
      <motion.div
        className="relative z-10 min-h-screen flex items-center px-6 md:px-12 lg:px-16 py-24"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-4 items-center">

            {/* Left Column - Work Thumbnails (3D tilted right) */}
            <motion.div
              className="relative flex flex-col gap-2 lg:gap-3"
              style={{ x: cardsX, opacity: cardsOpacity }}
            >
              {/* Column label */}
              <motion.div
                className="flex items-center gap-3 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">
                  Selected Work
                </span>
                <div className="flex-1 h-px bg-zinc-800" />
              </motion.div>

              {/* Grid of work cards - 2 columns for more items */}
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                {workItems.map((work, index) => (
                  <motion.button
                    key={work.title}
                    onClick={() => setSelectedWork(index)}
                    className="group relative block text-left"
                    initial={{ opacity: 0, x: -30, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + index * 0.06 }}
                    style={{
                      perspective: "1000px",
                    }}
                  >
                    <motion.div
                      className={`relative overflow-hidden transition-all duration-300 ${
                        selectedWork === index
                          ? "shadow-lg shadow-[#2563eb]/30 ring-2 ring-[#2563eb]"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: "rotateY(8deg) rotateX(-2deg)",
                        borderRadius: "1rem",
                      }}
                      whileHover={{
                        rotateY: 4,
                        rotateX: -1,
                        scale: 1.05,
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={work.image}
                          alt={work.title}
                          fill
                          className="object-cover rounded-2xl"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl" />

                        {/* Project number badge */}
                        <div className="absolute top-2 left-2">
                          <span className="text-[9px] font-mono text-white/80 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-lg">
                            0{index + 1}
                          </span>
                        </div>

                        {/* Title - always visible */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <span className="text-[10px] font-medium text-white leading-tight line-clamp-1">
                            {work.title}
                          </span>
                          <span className="text-[8px] text-zinc-400 uppercase tracking-wider">
                            {work.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Center - Title & Info */}
            <div className="text-center px-4 lg:px-16 max-w-xl">
              {/* Studio badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center justify-center gap-4 mb-8"
              >
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-zinc-600" />
                <span className="text-zinc-400 text-[11px] uppercase tracking-[0.4em] font-medium">
                  Design Studio
                </span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-zinc-600" />
              </motion.div>

              {/* Main Title - Larger, more dramatic */}
              <div className="mb-10">
                <div className="overflow-hidden">
                  <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[0.9] tracking-[-0.02em]"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    Exceptional
                  </motion.h1>
                </div>
                <div className="overflow-hidden">
                  <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-[0.9] tracking-[-0.02em]"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <span className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] bg-clip-text text-transparent">Digital</span>
                  </motion.h1>
                </div>
                <div className="overflow-hidden">
                  <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[0.9] tracking-[-0.02em]"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    Experiences
                  </motion.h1>
                </div>
              </div>

              {/* Decorative element */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
                <div className="w-16 h-px bg-zinc-700" />
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
              </motion.div>

              {/* Selected Project Info - Better hierarchy */}
              <motion.div
                key={selectedWork}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-10"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-[10px] text-[#2563eb] uppercase tracking-[0.2em] font-semibold">
                    {currentProject.category}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
                    {currentProject.year}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight">
                  {currentProject.title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto mb-5">
                  {currentProject.description}
                </p>
                <motion.div
                  className="inline-flex items-center gap-2.5 px-4 py-2 bg-zinc-900/80 rounded-full border border-zinc-800/80 backdrop-blur-sm"
                  whileHover={{ borderColor: "rgba(37, 99, 235, 0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-xs text-zinc-300 font-medium">{currentProject.results}</span>
                </motion.div>
              </motion.div>

              {/* CTAs - More prominent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <AnimatedButton
                  href="#contact"
                  text="Start a Project"
                  variant="primary"
                  showArrow
                />
                <AnimatedButton
                  href="#work"
                  text="View All Work"
                  variant="secondary"
                />
              </motion.div>
            </div>

            {/* Right Column - Phone Mockup (3D tilted left) */}
            <div className="relative flex flex-col items-center lg:items-end gap-4">
              {/* Column label */}
              <motion.div
                className="flex items-center gap-3 w-full max-w-[280px] md:max-w-[300px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">
                  Preview
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  perspective: "1200px",
                }}
              >
                <motion.div
                  className="relative"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateY(-12deg) rotateX(3deg)",
                  }}
                  animate={{
                    rotateY: -12,
                    rotateX: 3,
                  }}
                >
                  {/* Phone Frame - More refined */}
                  <div className="relative w-[260px] md:w-[280px] h-[520px] md:h-[560px] bg-zinc-900 rounded-[2.5rem] p-2.5 shadow-2xl shadow-black/60">
                    {/* Phone bezel - subtle gradient */}
                    <div
                      className="absolute inset-0 rounded-[2.5rem] border border-zinc-700/50"
                      style={{
                        background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
                      }}
                    />

                    {/* Dynamic Island style notch */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-800" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    </div>

                    {/* Screen */}
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black">
                      {/* Project Preview in Phone */}
                      <motion.div
                        key={selectedWork}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={currentProject.image}
                          alt={currentProject.title}
                          fill
                          className="object-cover"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

                        {/* Project info on phone - refined */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 p-5"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                              {currentProject.category}
                            </p>
                          </div>
                          <h3 className="text-lg font-semibold text-white leading-tight">
                            {currentProject.title}
                          </h3>
                        </motion.div>
                      </motion.div>

                      {/* Status bar - refined */}
                      <div className="absolute top-7 left-5 right-5 flex justify-between items-center z-10">
                        <span className="text-[11px] text-white/90 font-semibold tracking-tight">9:41</span>
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            <div className="w-1 h-1 rounded-full bg-white/80" />
                            <div className="w-1 h-1 rounded-full bg-white/80" />
                            <div className="w-1 h-1 rounded-full bg-white/80" />
                            <div className="w-1 h-1 rounded-full bg-white/40" />
                          </div>
                          <div className="w-5 h-2.5 border border-white/80 rounded-sm ml-1">
                            <div className="w-3/4 h-full bg-white/80 rounded-sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone reflection */}
                    <div
                      className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%)",
                      }}
                    />
                  </div>

                  {/* Glow effect beneath phone */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[180px] h-[30px] bg-[#2563eb]/25 blur-2xl rounded-full" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[120px] h-[20px] bg-[#2563eb]/40 blur-xl rounded-full" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats ticker at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute bottom-0 left-0 right-0 border-t border-zinc-800/30 bg-gradient-to-t from-[#0a0a0a] to-[#0a0a0a]/90 backdrop-blur-md"
      >
        <div className="py-5 overflow-hidden">
          <motion.div
            className="flex items-center gap-12 whitespace-nowrap"
            animate={{ x: [0, -800] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(3)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-12">
                {[
                  { value: "50+", label: "Projects" },
                  { value: "98%", label: "Satisfaction" },
                  { value: "14", label: "Day Delivery" },
                  { value: "5★", label: "Reviews" },
                ].map((stat, i) => (
                  <div key={`${setIndex}-${i}`} className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">{stat.value}</span>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700 ml-6" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
