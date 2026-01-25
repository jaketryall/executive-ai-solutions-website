"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Cinematic warm color palette
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Letter component that fills one at a time
function ScrollFillLetter({
  letter,
  index,
  totalLetters,
  scrollYProgress,
}: {
  letter: string;
  index: number;
  totalLetters: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each letter gets its own slice of the scroll progress - compressed for faster fill
  const letterSlice = 0.3 / totalLetters;
  const fillStart = 0.15 + index * letterSlice;
  const fillEnd = fillStart + letterSlice * 2.5; // Overlap for smooth flow

  const opacity = useTransform(
    scrollYProgress,
    [fillStart, fillEnd],
    [0.15, 1]
  );

  return (
    <motion.span
      style={{ opacity }}
    >
      {letter}
    </motion.span>
  );
}

export default function AboutSnippet() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Main text - split into words, then letters
  const mainText =
    "We design websites that convert, build tools that scale, and craft strategies that get you found.";
  const words = mainText.split(" ");

  // Calculate total letters for animation timing
  const totalLetters = mainText.replace(/ /g, "").length;

  // Scroll-driven entrance animations - delayed to start when section is more visible
  const labelOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.2, 0.35], [20, 0]);

  const textOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.25, 0.4], [40, 0]);

  return (
    <section
      ref={containerRef}
      className="relative pt-24 md:pt-32 lg:pt-40 pb-40 md:pb-48 lg:pb-72 bg-black"
      style={{ marginBottom: "-8px", position: "relative", zIndex: 2 }}
    >
      {/* Dark background - warm charcoal */}
      <div
        className="absolute inset-0"
        style={{
          background: "#050404",
        }}
      />

      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255, 200, 150, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Wide subtle warmth spread across bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-72 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(12, 9, 7, 0.5) 40%, #0a0806 100%)",
        }}
      />

      {/* Very subtle warm tint */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(255, 180, 120, 0.04) 50%, rgba(255, 180, 120, 0.06) 100%)",
        }}
      />

      {/* Corner fill - extends below section to show through Work's rounded corners */}
      <div
        className="absolute -bottom-16 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #0a0806 0%, #0a0806 100%)",
        }}
      />

      <motion.div
        className="relative max-w-5xl mx-auto px-6 md:px-12 text-center"
      >
        {/* Small label */}
        <motion.p
          className="text-xs uppercase tracking-[0.3em] mb-8"
          style={{ color: accentColorMuted, opacity: labelOpacity, y: labelY }}
        >
          What We Do
        </motion.p>

        {/* Main statement with scroll-fill effect - one letter at a time */}
        <motion.h2
          className="text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.4] tracking-[-0.02em] text-white"
          style={{ opacity: textOpacity, y: textY }}
        >
          {(() => {
            let letterIndex = 0;
            return words.map((word, wordIndex) => (
              <span key={wordIndex}>
                <span style={{ whiteSpace: "nowrap" }}>
                  {word.split("").map((letter) => {
                    const currentIndex = letterIndex++;
                    return (
                      <ScrollFillLetter
                        key={currentIndex}
                        letter={letter}
                        index={currentIndex}
                        totalLetters={totalLetters}
                        scrollYProgress={scrollYProgress}
                      />
                    );
                  })}
                </span>
                {wordIndex < words.length - 1 && " "}
              </span>
            ));
          })()}
        </motion.h2>
      </motion.div>
    </section>
  );
}
