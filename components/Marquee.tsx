"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const phrases = [
  "Web Design",
  "Development",
  "Branding",
  "UI/UX",
  "E-Commerce",
  "SEO",
  "Performance",
  "Conversion",
];

export default function Marquee() {
  return (
    <div className="relative py-6 bg-[#0a0a0a] border-y border-zinc-800 overflow-hidden">
      <div className="flex">
        {/* First set */}
        <motion.div
          className="flex shrink-0 items-center"
          animate={{ x: [0, "-50%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...phrases, ...phrases].map((phrase, index) => (
            <div key={index} className="flex items-center shrink-0">
              <span className="text-xl md:text-2xl font-medium text-white whitespace-nowrap px-6 md:px-10">
                {phrase}
              </span>
              <span className="text-[#2563eb] text-lg">✦</span>
            </div>
          ))}
          {[...phrases, ...phrases].map((phrase, index) => (
            <div key={`dup-${index}`} className="flex items-center shrink-0">
              <span className="text-xl md:text-2xl font-medium text-white whitespace-nowrap px-6 md:px-10">
                {phrase}
              </span>
              <span className="text-[#2563eb] text-lg">✦</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}

// Scroll-reactive huge text marquee
export function GiantMarquee() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-800, 0]);
  const smoothX1 = useSpring(x1, { damping: 50, stiffness: 100 });
  const smoothX2 = useSpring(x2, { damping: 50, stiffness: 100 });

  const words = ["DESIGN", "DEVELOP", "DELIVER", "DOMINATE"];

  return (
    <div ref={containerRef} className="relative py-16 md:py-24 overflow-hidden bg-[#0a0a0f]">
      {/* First row */}
      <motion.div style={{ x: smoothX1 }} className="flex whitespace-nowrap mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            {words.map((word, j) => (
              <span
                key={j}
                className="text-[clamp(5rem,18vw,14rem)] font-bold mx-4 md:mx-8"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "2px rgba(255,255,255,0.15)",
                }}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Second row */}
      <motion.div style={{ x: smoothX2 }} className="flex whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            {words.map((word, j) => (
              <span
                key={j}
                className="text-[clamp(5rem,18vw,14rem)] font-bold text-white/3 mx-4 md:mx-8"
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

