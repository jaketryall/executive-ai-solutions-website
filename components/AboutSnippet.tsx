"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
  // Words fill during the pinned portion (roughly 0.3 to 0.7 of scroll progress)
  const fillStart = 0.25;
  const fillEnd = 0.7;
  const fillRange = fillEnd - fillStart;
  const wordDuration = fillRange / totalWords;
  const wordStart = fillStart + index * wordDuration;
  const wordEnd = wordStart + wordDuration * 1.4;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the entire container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Content fades out as it leaves
  const contentOpacity = useTransform(scrollYProgress, [0.8, 0.95], [1, 0]);

  // Main text - split into words
  const mainText = "We design websites that convert, build tools that scale, and craft strategies that get you found.";
  const words = mainText.split(" ");

  // GSAP ScrollTrigger for pinning at center
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !pinRef.current || !contentRef.current) return;

      // Fade in content as it enters viewport
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Pin when content reaches center of viewport
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        pinSpacing: false,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{ height: "250vh", zIndex: 5 }}
    >
      {/* Pinned content container */}
      <div
        ref={pinRef}
        className="h-screen flex items-center justify-center"
      >
        <motion.div
          ref={contentRef}
          className="relative max-w-5xl mx-auto px-6 md:px-12 text-center"
          style={{ opacity: contentOpacity }}
        >
          {/* Small label */}
          <p
            className="text-xs uppercase tracking-[0.3em] mb-8"
            style={{ color: accentColorMuted }}
          >
            What We Do
          </p>

          {/* Main statement with scroll-fill effect */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.4] tracking-[-0.02em]">
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
          </h2>
        </motion.div>
      </div>
    </div>
  );
}
