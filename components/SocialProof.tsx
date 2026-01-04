"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for fill effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "center center"],
  });

  // Section entry animation
  const { scrollYProgress: entryProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.5"],
  });

  const entryOpacity = useTransform(entryProgress, [0, 0.5], [0, 1]);

  // Text fill animations - staggered
  const line1Fill = useTransform(scrollYProgress, [0, 0.4], [0, 100]);
  const line2Fill = useTransform(scrollYProgress, [0.2, 0.6], [0, 100]);
  const line3Fill = useTransform(scrollYProgress, [0.4, 0.8], [0, 100]);

  const lines = [
    { text: "DON'T JUST", fill: line1Fill },
    { text: "TAKE OUR", fill: line2Fill },
    { text: "WORD FOR IT", fill: line3Fill },
  ];

  return (
    <motion.section
      ref={sectionRef}
      className="relative py-32 md:py-40 bg-[#0a0a0c] overflow-hidden"
      style={{
        opacity: entryOpacity,
      }}
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(154,123,60,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div ref={containerRef} className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Hollow text with fill effect */}
        <div className="flex flex-col items-center text-center space-y-2 md:space-y-4">
          {lines.map((line, index) => (
            <div key={index} className="relative overflow-hidden">
              {/* Hollow stroke text (background) */}
              <h2
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight uppercase"
                style={{
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.25)",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {line.text}
              </h2>

              {/* Filled text with clip mask */}
              <motion.h2
                className="absolute inset-0 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight uppercase"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #b89a5e 50%, #9a7b3c 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  clipPath: useTransform(line.fill, (v) => `inset(0 ${100 - v}% 0 0)`),
                }}
              >
                {line.text}
              </motion.h2>

              {/* Glow effect on the fill edge */}
              <motion.div
                className="absolute top-0 bottom-0 w-1 pointer-events-none"
                style={{
                  left: useTransform(line.fill, (v) => `${v}%`),
                  background: "linear-gradient(to bottom, transparent, rgba(184,154,94,0.8), transparent)",
                  filter: "blur(4px)",
                  opacity: useTransform(line.fill, (v) => (v > 0 && v < 100 ? 1 : 0)),
                }}
              />
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <motion.div
          className="flex justify-center gap-6 mt-16"
          style={{
            opacity: useTransform(scrollYProgress, [0.6, 1], [0, 1]),
            y: useTransform(scrollYProgress, [0.6, 1], [30, 0]),
          }}
        >
          {/* Animated line */}
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-[#b89a5e] to-transparent"
            style={{
              width: useTransform(scrollYProgress, [0.7, 1], [0, 200]),
            }}
          />
        </motion.div>

        {/* Scroll indicator arrow pointing down */}
        <motion.div
          className="flex justify-center mt-12"
          style={{
            opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]),
          }}
        >
          <motion.svg
            className="w-6 h-6 text-[#b89a5e]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#b89a5e]"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </motion.section>
  );
}
