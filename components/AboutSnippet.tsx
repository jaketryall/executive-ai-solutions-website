"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Cinematic warm color palette
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Word component that fills as you scroll
function ScrollFillWord({
  word,
  index,
  totalWords,
  scrollYProgress,
}: {
  word: string;
  index: number;
  totalWords: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Calculate when this word should start and end filling
  // Start filling right after the paragraph appears and complete while still on screen
  const scrollRange = 0.25;
  const wordDuration = scrollRange / totalWords;
  const wordStart = 0.18 + index * wordDuration;
  const wordEnd = wordStart + wordDuration * 0.95;

  const fillProgress = useTransform(
    scrollYProgress,
    [wordStart, wordEnd],
    [0, 100]
  );

  return (
    <span className="relative inline-block">
      {/* Background text (muted) */}
      <span className="text-white/20">{word}</span>

      {/* Foreground text (fills with scroll) */}
      <motion.span
        className="absolute inset-0 text-white overflow-hidden"
        style={{
          clipPath: useTransform(fillProgress, (v) => `inset(0 ${100 - v}% 0 0)`),
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function AboutSnippet() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end start"],
  });

  // Parallax effect - gentler
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -20]);

  // Title animation - scroll-driven reveal from underneath (starts first)
  const titleY = useTransform(scrollYProgress, [0, 0.1], [40, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Paragraph container animation - slides up after title completes
  const paragraphY = useTransform(scrollYProgress, [0.08, 0.2], [50, 0]);
  const paragraphOpacity = useTransform(scrollYProgress, [0.08, 0.2], [0, 1]);

  // Line animation - comes in last
  const lineScale = useTransform(scrollYProgress, [0.18, 0.3], [0, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0.18, 0.3], [0, 1]);

  // Main text - split into words
  const mainText = "We design websites that convert, build tools that scale, and craft strategies that get you found.";
  const words = mainText.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-48 md:py-64 overflow-hidden"
      style={{ zIndex: 5 }}
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255, 200, 150, 0.03) 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <motion.div
        className="relative max-w-5xl mx-auto px-6 md:px-12 text-center"
        style={{ y }}
      >
        {/* Small label with reveal from underneath */}
        <div className="overflow-hidden mb-8">
          <motion.p
            className="text-xs uppercase tracking-[0.3em]"
            style={{
              color: accentColorMuted,
              y: titleY,
              opacity: titleOpacity,
            }}
          >
            What We Do
          </motion.p>
        </div>

        {/* Main statement with scroll-fill effect */}
        <div className="overflow-hidden">
          <motion.h2
            className="text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.4] tracking-[-0.02em]"
            style={{
              y: paragraphY,
              opacity: paragraphOpacity,
            }}
          >
            {words.map((word, index) => (
              <span key={index}>
                <ScrollFillWord
                  word={word}
                  index={index}
                  totalWords={words.length}
                  scrollYProgress={scrollYProgress}
                />
                {index < words.length - 1 && " "}
              </span>
            ))}
          </motion.h2>
        </div>

        {/* Decorative line */}
        <motion.div
          className="mt-16 mx-auto w-px h-16 origin-top"
          style={{
            background: `linear-gradient(to bottom, ${accentColorMuted}, transparent)`,
            scaleY: lineScale,
            opacity: lineOpacity,
          }}
        />
      </motion.div>
    </section>
  );
}
