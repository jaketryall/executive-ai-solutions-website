"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { workItems } from "./Work";

export default function HeroWorkTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Phone appears from where hero phone left off, then morphs to card
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.1, 0.5, 0.7], [0, 1, 1, 0]);
  const phoneRotateY = useTransform(scrollYProgress, [0, 0.3], [0, 0]);
  const phoneRotateX = useTransform(scrollYProgress, [0, 0.3], [0, 0]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.15, 0.5], [1.3, 1, 1.1]);
  const phoneWidth = useTransform(scrollYProgress, [0.15, 0.5], [280, 550]);
  const phoneHeight = useTransform(scrollYProgress, [0.15, 0.5], [560, 380]);
  const phoneBorderRadius = useTransform(scrollYProgress, [0.15, 0.5], [40, 20]);
  const phoneY = useTransform(scrollYProgress, [0, 0.5], [100, -50]);
  const phoneX = useTransform(scrollYProgress, [0, 0.2], [150, 0]); // Starts from right side

  // Text reveals
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.2, 0.4], [60, 0]);

  // Background elements
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Floating cards that appear around the morphing element
  const card1X = useTransform(scrollYProgress, [0.2, 0.5], [-200, -350]);
  const card1Y = useTransform(scrollYProgress, [0.2, 0.5], [100, -50]);
  const card1Opacity = useTransform(scrollYProgress, [0.2, 0.35, 0.6, 0.75], [0, 1, 1, 0]);
  const card1Rotate = useTransform(scrollYProgress, [0.2, 0.5], [15, 5]);

  const card2X = useTransform(scrollYProgress, [0.25, 0.55], [200, 320]);
  const card2Y = useTransform(scrollYProgress, [0.25, 0.55], [80, -80]);
  const card2Opacity = useTransform(scrollYProgress, [0.25, 0.4, 0.6, 0.75], [0, 1, 1, 0]);
  const card2Rotate = useTransform(scrollYProgress, [0.25, 0.55], [-12, -3]);

  // "Selected Work" text morphs in
  const headingScale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1]);
  const headingOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.85], [0, 1, 1, 0]);

  const currentProject = workItems[0];

  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh] bg-[#0a0a0a] overflow-hidden"
    >
      {/* Gradient background that fades in */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: bgOpacity }}
      >
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        {/* Floating side cards */}
        <motion.div
          className="absolute w-48 h-32 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          style={{
            x: card1X,
            y: card1Y,
            opacity: card1Opacity,
            rotate: card1Rotate,
            perspective: 1000,
          }}
        >
          <Image
            src={workItems[1].image}
            alt={workItems[1].title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] text-white/70 uppercase tracking-wider">
              {workItems[1].category}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="absolute w-44 h-28 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          style={{
            x: card2X,
            y: card2Y,
            opacity: card2Opacity,
            rotate: card2Rotate,
            perspective: 1000,
          }}
        >
          <Image
            src={workItems[2].image}
            alt={workItems[2].title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] text-white/70 uppercase tracking-wider">
              {workItems[2].category}
            </span>
          </div>
        </motion.div>

        {/* Main morphing element - Phone to Card */}
        <motion.div
          className="relative"
          style={{
            y: phoneY,
            x: phoneX,
            opacity: phoneOpacity,
            perspective: 1200,
          }}
        >
          <motion.div
            className="relative overflow-hidden bg-zinc-900 shadow-2xl shadow-black/60"
            style={{
              width: phoneWidth,
              height: phoneHeight,
              borderRadius: phoneBorderRadius,
              rotateY: phoneRotateY,
              rotateX: phoneRotateX,
              scale: phoneScale,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Phone bezel overlay - fades out as it morphs */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
              }}
            >
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              </div>

              {/* Phone border */}
              <div
                className="absolute inset-0 border border-zinc-700/50"
                style={{
                  borderRadius: "inherit",
                  background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, transparent 50%)",
                }}
              />
            </motion.div>

            {/* Content */}
            <Image
              src={currentProject.image}
              alt={currentProject.title}
              fill
              className="object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Project info - morphs from phone style to card style */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6"
              style={{
                opacity: useTransform(scrollYProgress, [0.3, 0.5], [1, 0]),
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9a7b3c]" />
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                  {currentProject.category}
                </p>
              </div>
              <h3 className="text-xl font-semibold text-white leading-tight">
                {currentProject.title}
              </h3>
            </motion.div>

            {/* Card-style info that fades in */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
              style={{
                opacity: useTransform(scrollYProgress, [0.35, 0.5], [0, 1]),
              }}
            >
              <span className="text-xs text-[#b89a5e] uppercase tracking-[0.3em] mb-4">
                {currentProject.category}
              </span>
              <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                {currentProject.title}
              </h3>
              <p className="text-zinc-400 text-sm max-w-xs">
                {currentProject.description}
              </p>
            </motion.div>

            {/* Blue glow effect */}
            <motion.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[200px] h-[40px] bg-[#9a7b3c]/30 blur-2xl rounded-full"
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0.5]),
              }}
            />
          </motion.div>
        </motion.div>

        {/* "Selected Work" heading that appears */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center"
          style={{
            opacity: headingOpacity,
            scale: headingScale,
            y: textY,
          }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-12 h-px bg-zinc-700" />
            <span className="text-xs text-zinc-500 uppercase tracking-[0.3em]">
              Our Portfolio
            </span>
            <div className="w-12 h-px bg-zinc-700" />
          </motion.div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight">
            Selected{" "}
            <span className="bg-gradient-to-r from-[#9a7b3c] to-[#b89a5e] bg-clip-text text-transparent">
              Work
            </span>
          </h2>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]),
          }}
        >
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
            Scroll to explore
          </span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-[#9a7b3c] to-transparent"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  );
}
