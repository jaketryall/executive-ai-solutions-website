"use client";

import { motion, useScroll, useTransform, useMotionValue, MotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSound } from "./SoundManager";
import { TransitionLink } from "@/components/PageTransition";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Animated letter for the main title - GSAP controlled
function TitleLetter({
  letter,
  index,
  isMuted = false,
  className = "",
}: {
  letter: string;
  index: number;
  isMuted?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`work-title-letter inline-block ${className}`}
      data-index={index}
      style={{
        color: isMuted ? "rgba(255, 255, 255, 0.2)" : "white",
        opacity: 0,
        transform: "translateY(40px)",
      }}
    >
      {letter}
    </span>
  );
}

// Work items with cinematic descriptions
export const workItems = [
  {
    slug: "desert-wings",
    title: "DESERT WINGS",
    category: "Flight School",
    image: "/Celestial Laptop Mockup.webp",
    year: "2025",
    tagline: "Where pilots are born",
    description: "A premium digital presence for Arizona's newest flight school.",
    result: "7+",
    resultLabel: "programs featured",
    color: "#2a3f5f",
    warmColor: "rgba(255, 200, 150, 0.15)",
  },
  {
    slug: "riled-up",
    title: "RILED UP",
    category: "Pickleball Coaching",
    image: "/Celestial iPhone Mockup.webp",
    year: "2025",
    tagline: "Stop losing to players you should beat",
    description: "A results-driven coaching platform for pickleball players.",
    result: "3x",
    resultLabel: "booking rate",
    color: "#2d3f2a",
    warmColor: "rgba(200, 255, 150, 0.15)",
  },
  {
    slug: "wings-n-wheels",
    title: "WINGS N WHEELS",
    category: "Detailing",
    image: "/Rubber iPhone Mockup.webp",
    year: "2025",
    tagline: "Restored to showroom glory",
    description: "Premium detailing for aircraft, autos, and marine vessels.",
    result: "2000+",
    resultLabel: "vehicles detailed",
    color: "#2d2d3f",
    warmColor: "rgba(180, 200, 255, 0.15)",
  },
  {
    slug: "adventure-air",
    title: "ADVENTURE AIR",
    category: "Gyrocopter Tours",
    image: "/Elegant Black Laptop Mockup.webp",
    year: "2025",
    tagline: "See Arizona from above",
    description: "Thrilling gyrocopter tours over Arizona's landscapes.",
    result: "Soaring",
    resultLabel: "bookings",
    color: "#3f2d1f",
    warmColor: "rgba(255, 180, 120, 0.15)",
  },
];

// Flying project card - Editorial magazine style with bold typography
function FlyingProjectCard({
  project,
  index,
  containerRef,
}: {
  project: (typeof workItems)[0];
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { play } = useSound();

  // Stagger the starting positions
  const startOffset = index * 0.12;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Multi-layer parallax
  const settlePoint = startOffset + 0.25;
  const exitPoint = Math.min(startOffset + 0.55, 1);

  const cardY = useTransform(
    scrollYProgress,
    [startOffset, settlePoint, exitPoint],
    ["100vh", "0vh", "-100vh"]
  );

  // Image parallax - starts at 0 to avoid gaps at top
  const imageY = useTransform(
    scrollYProgress,
    [startOffset, settlePoint, exitPoint],
    ["0%", "-5%", "-12%"]
  );

  // Scale for entry
  const cardScale = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.15, startOffset + 0.4, exitPoint],
    [0.9, 1, 1, 0.95]
  );

  // Subtle rotation
  const cardRotate = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.12],
    [2, 0]
  );

  // Card opacity
  const fadeOutStart = Math.min(startOffset + 0.4, 0.85);
  const fadeOutEnd = Math.min(startOffset + 0.5, 0.95);
  const cardOpacity = useTransform(
    scrollYProgress,
    [0, startOffset, startOffset + 0.05, fadeOutStart, fadeOutEnd],
    [0, 0, 1, 1, 0]
  );

  // Alternating positions
  const isLeft = index % 2 === 0;
  const xPosition = isLeft ? "5%" : "45%";

  return (
    <motion.div
      ref={cardRef}
      className="fixed w-[50vw] max-w-2xl pointer-events-auto"
      style={{
        y: cardY,
        scale: cardScale,
        rotate: cardRotate,
        opacity: cardOpacity,
        left: xPosition,
        top: "10vh",
        zIndex: 10 + index,
      }}
    >
      <TransitionLink href={`/work/${project.slug}`}>
        <motion.div
          className="group relative cursor-pointer"
          onMouseEnter={() => {
            setIsHovered(true);
            play("hover", { volume: 0.06 });
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main card */}
          <div className="relative overflow-hidden rounded-xl">
            {/* Full-bleed image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#0a0a0a]">
              <motion.div
                className="absolute inset-0"
                style={{ y: imageY }}
              >
                <div className="absolute -inset-[8%]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out"
                    style={{
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                    }}
                    sizes="50vw"
                    priority={index < 2}
                  />
                </div>
              </motion.div>

              {/* Dark gradient overlay - stronger on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: isHovered
                    ? "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)",
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Content overlay */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                {/* Category tag - always visible with rounded corners */}
                <motion.div
                  className="mb-auto pt-2"
                  animate={{
                    opacity: isHovered ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span
                    className="inline-block text-xs uppercase tracking-[0.2em] font-medium px-3 py-1.5 rounded-md"
                    style={{
                      color: accentColor,
                      background: "rgba(0, 0, 0, 0.5)",
                      backdropFilter: "blur(8px)",
                      border: `1px solid rgba(255, 200, 150, 0.15)`,
                    }}
                  >
                    {project.category}
                  </span>
                </motion.div>

                {/* Title - hidden by default, reveals on hover */}
                <motion.h3
                  className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-[-0.03em] leading-[0.95] mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 20,
                  }}
                  transition={{ duration: 0.4, delay: 0.02, ease: "easeOut" }}
                >
                  {project.title}
                </motion.h3>

                {/* Tagline - hidden by default */}
                <motion.p
                  className="text-white/70 text-sm md:text-base max-w-sm mb-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 15,
                  }}
                  transition={{ duration: 0.3, delay: 0.06, ease: "easeOut" }}
                >
                  {project.description}
                </motion.p>

                {/* View button - hidden by default */}
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 15,
                  }}
                  transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: accentColor }}
                  >
                    View Project
                  </span>
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: accentColor,
                    }}
                    animate={{
                      scale: isHovered ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                      animate={{ x: isHovered ? 2 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </motion.svg>
                  </motion.div>
                </motion.div>
              </div>

              {/* Hover border accent */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  border: `2px solid ${accentColor}`,
                  opacity: 0,
                }}
                animate={{
                  opacity: isHovered ? 0.5 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Subtle shadow */}
          <div
            className="absolute -inset-4 -z-10 rounded-2xl transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse at center, ${project.warmColor.replace("0.15", "0.15")} 0%, transparent 70%)`,
              filter: "blur(30px)",
              opacity: isHovered ? 1 : 0.4,
            }}
          />
        </motion.div>
      </TransitionLink>
    </motion.div>
  );
}

// Individual letter component for scroll-linked reveal
function RevealLetter({
  letter,
  scrollYProgress,
  revealAt,
  className,
}: {
  letter: string;
  scrollYProgress: MotionValue<number>;
  revealAt: number;
  className: string;
}) {
  // Letters start visible, dip down as you scroll, then return
  // No opacity change - just position
  const y = useTransform(
    scrollYProgress,
    [0, revealAt, revealAt + 0.04, revealAt + 0.08],
    ["0%", "0%", "12%", "0%"]
  );

  return (
    <motion.span className={`inline-block ${className}`} style={{ y }}>
      {letter}
    </motion.span>
  );
}

// Transitional statement with staggered letters
function TransitionStatement({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const statement = "Now let's build yours";
  const letters = statement.split("");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Statement appears after cards fade out, stays visible until Services covers it
  const containerOpacity = useTransform(
    scrollYProgress,
    [0.7, 0.85],
    [0, 1]
  );

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ opacity: containerOpacity, zIndex: 15 }}
    >
      <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
        {letters.map((letter, index) => {
          // Stagger each letter's appearance
          const letterStart = 0.72 + index * 0.008;
          const letterEnd = letterStart + 0.05;

          return (
            <TransitionLetter
              key={index}
              letter={letter}
              scrollYProgress={scrollYProgress}
              start={letterStart}
              end={letterEnd}
            />
          );
        })}
      </h3>
    </motion.div>
  );
}

// Individual letter for the transition statement
function TransitionLetter({
  letter,
  scrollYProgress,
  start,
  end,
}: {
  letter: string;
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [30, 0]);

  return (
    <motion.span
      className="inline-block"
      style={{
        opacity,
        y,
        color: letter === " " ? "transparent" : "white",
      }}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}

// Mobile - Fullscreen immersive project section (Ray-Ban/Apple style)
function MobileWorkSection({
  project,
  index,
}: {
  project: (typeof workItems)[0];
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax for image - moves slower than scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);

  // Content reveals as you scroll into view
  const contentOpacity = useTransform(scrollYProgress, [0, 0.1, 0.7, 0.9], [0, 1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.1, 0.7, 0.9], [20, 0, 0, -40]);

  // Title dramatic reveal - starts earlier
  const titleScale = useTransform(scrollYProgress, [0.05, 0.2], [0.85, 1]);
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.18, 0.75, 0.9], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Full-bleed background image with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority={index < 2}
        />
      </motion.div>

      {/* Cinematic gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom,
              rgba(20,19,18,0.4) 0%,
              transparent 25%,
              transparent 40%,
              rgba(20,19,18,0.7) 70%,
              rgba(20,19,18,0.95) 100%
            )
          `,
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(20,19,18,0.4) 100%)",
        }}
      />

      {/* Floating index number - top right */}
      <motion.div
        className="absolute top-8 right-6 z-10"
        style={{ opacity: contentOpacity }}
      >
        <span
          className="text-[100px] font-black leading-none"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgba(255, 200, 150, 0.2)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>

      {/* Category pill - minimal, top left */}
      <motion.div
        className="absolute top-8 left-6 z-10"
        style={{ opacity: contentOpacity }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.25em] font-medium"
          style={{ color: accentColorMuted }}
        >
          {project.category}
        </span>
      </motion.div>

      {/* Main content - bottom aligned but pushed up */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-8 pb-32 z-10"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Large title with scale effect */}
        <motion.div style={{ scale: titleScale, opacity: titleOpacity }}>
          <h3 className="text-[12vw] font-black text-[#f5f0e8] tracking-[-0.03em] leading-[0.85] mb-4">
            {project.title}
          </h3>
        </motion.div>

        {/* Tagline */}
        <p
          className="text-lg font-light mb-6 max-w-[280px]"
          style={{ color: "rgba(245, 240, 232, 0.7)" }}
        >
          {project.tagline}
        </p>

        {/* Result stat - minimal */}
        <div className="flex items-baseline gap-3 mb-8">
          <span
            className="text-4xl font-black"
            style={{ color: accentColor }}
          >
            {project.result}
          </span>
          <span className="text-[#f5f0e8]/40 text-xs uppercase tracking-[0.15em]">
            {project.resultLabel}
          </span>
        </div>

        {/* CTA - clean, minimal */}
        <TransitionLink href={`/work/${project.slug}`}>
          <motion.div
            className="inline-flex items-center gap-4 group"
            whileTap={{ scale: 0.97 }}
          >
            <span
              className="text-sm uppercase tracking-[0.15em] font-medium"
              style={{ color: accentColor }}
            >
              View Project
            </span>
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-active:scale-90"
              style={{
                background: accentColor,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141312" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </span>
          </motion.div>
        </TransitionLink>
      </motion.div>

      {/* Scroll indicator on first section */}
      {index === 0 && (
        <motion.div
          className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#f5f0e8]/30">Scroll</span>
          <motion.div
            className="w-px h-8"
            style={{ background: `linear-gradient(to bottom, ${accentColorMuted}, transparent)` }}
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}
    </section>
  );
}

// Mobile layout - Cinematic full-bleed cards
function MobileWork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track active card based on scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.offsetWidth * 0.92 + 12;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(newIndex, workItems.length - 1));
  };

  return (
    <section className="md:hidden relative pt-10 pb-20">
      {/* Section header - more dramatic */}
      <div className="px-5 pb-8">
        <span
          className="text-[9px] uppercase tracking-[0.4em] block mb-3"
          style={{ color: accentColorMuted }}
        >
          Selected Work
        </span>
        <h2 className="text-[11vw] font-black text-[#f5f0e8] tracking-[-0.03em] leading-[0.9]">
          THE
          <br />
          <span style={{ color: "rgba(255, 200, 150, 0.9)" }}>PROOF</span>
        </h2>
      </div>

      {/* Horizontal swipable cards - larger, more cinematic */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
        }}
      >
        {workItems.map((project, index) => (
          <TransitionLink
            key={project.slug}
            href={`/work/${project.slug}`}
            className="shrink-0 w-[92vw] snap-center"
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${project.warmColor.replace("0.15", "0.4")} 0%, #0d0b0a 50%, #0a0806 100%)`,
              }}
              whileTap={{ scale: 0.985 }}
            >
              {/* Full image with cinematic overlay */}
              <div className="relative h-[52vh] min-h-[380px] max-h-[480px] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-center"
                  sizes="92vw"
                  priority={index < 2}
                />

                {/* Cinematic gradient overlays */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(to bottom,
                        rgba(10,8,6,0.3) 0%,
                        transparent 30%,
                        transparent 50%,
                        rgba(10,8,6,0.85) 80%,
                        rgba(10,8,6,0.98) 100%
                      )
                    `,
                  }}
                />

                {/* Vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 20%, rgba(10,8,6,0.4) 100%)",
                  }}
                />

                {/* Index number - dramatic outline */}
                <div className="absolute top-5 right-5 pointer-events-none">
                  <span
                    className="text-[80px] font-black leading-none"
                    style={{
                      color: "transparent",
                      WebkitTextStroke: "1.5px rgba(255, 200, 150, 0.25)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Category - floating pill */}
                <div className="absolute top-5 left-5">
                  <span
                    className="inline-block text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full backdrop-blur-md"
                    style={{
                      color: accentColor,
                      background: "rgba(10, 8, 6, 0.6)",
                      border: "1px solid rgba(255, 200, 150, 0.2)",
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Content overlay - positioned at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-[7vw] font-black text-[#f5f0e8] tracking-[-0.02em] leading-[1]">
                    {project.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          </TransitionLink>
        ))}
      </div>

      {/* Pagination - minimal line style */}
      <div className="flex justify-center items-center gap-3 mt-4 px-8">
        {workItems.map((_, index) => (
          <div
            key={index}
            className="h-[2px] rounded-full transition-all duration-500"
            style={{
              width: index === activeIndex ? "24px" : "8px",
              background: index === activeIndex ? accentColor : "rgba(255, 200, 150, 0.2)",
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Track when section is in viewport to show/hide fixed elements
  // We'll use a fade-in opacity value instead of binary show/hide
  const titleFadeOpacity = useMotionValue(0);

  useEffect(() => {
    if (!sectionRef.current || isMobile) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const viewportHeight = window.innerHeight;

      // Title appears as Work section approaches viewport
      const fadeStart = viewportHeight * 0.5; // Start fading when section top is 50% down viewport
      const fadeEnd = viewportHeight * 0.2; // Fully visible when section top is 20% down viewport

      if (sectionTop > fadeStart) {
        // Section hasn't scrolled enough yet
        setIsInView(false);
        titleFadeOpacity.set(0);
      } else if (sectionTop <= fadeStart && sectionTop > fadeEnd) {
        // In the fade zone - calculate opacity
        setIsInView(true);
        const progress = (fadeStart - sectionTop) / (fadeStart - fadeEnd);
        titleFadeOpacity.set(Math.min(1, Math.max(0, progress)));
      } else if (sectionBottom > 0) {
        // Fully in view
        setIsInView(true);
        titleFadeOpacity.set(1);
      } else {
        // Scrolled past
        setIsInView(false);
        titleFadeOpacity.set(0);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, titleFadeOpacity]);

  // Title scrolls in from below, then locks in center, then fades out at end
  const titleY = useTransform(scrollYProgress, [0, 0.06], [60, 0]);
  const titleEntryOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const titleExitOpacity = useTransform(scrollYProgress, [0.6, 0.75], [1, 0]);
  const centerTitleScale = useTransform(scrollYProgress, [0.08, 0.5, 1], [1, 1.05, 1.1]);

  // Ambient glow fade-in as you scroll into the section
  const warmGlowOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Title entrance uses stagger effect controlled by isInView state

  // Scroll indicator opacity
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 0.3, 0.3, 0]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll-driven title letter animation
  useEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const workLabel = document.querySelector(".work-label");
      const workCount = document.querySelector(".work-count");
      const decorLines = document.querySelectorAll(".work-decor-line");
      const titleLetters = document.querySelectorAll(".work-title-letter");

      if (!sectionRef.current) return;

      // Create scroll-driven timeline for title letters
      if (titleLetters.length > 0) {
        // Sequential stagger - each letter slightly after the previous
        titleLetters.forEach((letter, index) => {
          const staggerDelay = index * 0.008; // Small offset per letter

          gsap.to(letter, {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top ${45 - staggerDelay * 100}%`,
              end: `top ${20 - staggerDelay * 100}%`,
              scrub: 0.3,
            },
          });
        });
      }

      // Scroll-driven label animation
      if (workLabel) {
        gsap.to(workLabel, {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            end: "top 35%",
            scrub: 0.3,
          },
        });
      }

      // Scroll-driven decorative lines
      if (decorLines.length > 0) {
        gsap.to(decorLines, {
          scaleX: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 40%",
            end: "top 25%",
            scrub: 0.3,
          },
        });
      }

      // Scroll-driven count
      if (workCount) {
        gsap.to(workCount, {
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 35%",
            end: "top 20%",
            scrub: 0.3,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, isInView]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden"
      style={{
        zIndex: 10,
        marginTop: isMobile ? "-2rem" : "-3rem",
        height: isMobile ? "auto" : "500vh",
        background: isMobile
          ? "#0a0806"
          : "linear-gradient(180deg, #0a0806 0%, #0c0908 15%, #0e0b09 40%, #0c0908 70%, #12100e 90%, #151311 100%)",
      }}
    >
      {/* Ambient warm glows - desktop only */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background: "radial-gradient(ellipse 120% 80% at 50% 40%, rgba(255, 180, 120, 0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 20% 60%, rgba(255, 200, 150, 0.05) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 80% 70%, rgba(255, 160, 100, 0.04) 0%, transparent 50%)",
        }}
      />

      {/* Desktop Layout - Title scrolls in then becomes sticky */}
      {!isMobile && (
        <motion.div
          className="sticky top-0 h-screen pointer-events-none overflow-hidden"
          style={{ zIndex: 10 }}
        >
          {/* Title container - scrolls in from below, locks in center, fades out at end */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              y: titleY,
              opacity: titleExitOpacity,
              scale: centerTitleScale,
              zIndex: 1,
            }}
          >
            {/* Background ambient glow */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255, 200, 150, 0.06) 0%, transparent 60%)`,
              }}
            />

            <div className="text-center relative">
              {/* Label */}
              <p
                className="work-label text-sm uppercase tracking-[0.4em] mb-8"
                style={{ color: accentColorMuted, opacity: 0, transform: "translateY(20px)" }}
              >
                Selected Work
              </p>

              {/* Big centered title with letter animation */}
              <h2 className="text-[18vw] font-black leading-[0.8] tracking-[-0.02em]">
                <span className="block">
                  {"THE".split("").map((letter, i) => (
                    <TitleLetter
                      key={`the-${i}`}
                      letter={letter}
                      index={i}
                    />
                  ))}
                </span>
                <span className="block">
                  {"PROOF".split("").map((letter, i) => (
                    <TitleLetter
                      key={`proof-${i}`}
                      letter={letter}
                      index={i + 3}
                      isMuted
                    />
                  ))}
                </span>
              </h2>

              {/* Decorative lines */}
              <div className="flex items-center justify-center gap-8 mt-8">
                <div
                  className="work-decor-line h-px w-24 origin-right"
                  style={{
                    background: `linear-gradient(to left, ${accentColorMuted}, transparent)`,
                    transform: "scaleX(0)",
                  }}
                />
                <span
                  className="work-count text-white/20 text-sm tracking-widest"
                  style={{ opacity: 0 }}
                >
                  {workItems.length} PROJECTS
                </span>
                <div
                  className="work-decor-line h-px w-24 origin-left"
                  style={{
                    background: `linear-gradient(to right, ${accentColorMuted}, transparent)`,
                    transform: "scaleX(0)",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Flying project cards */}
          {workItems.map((project, index) => (
            <FlyingProjectCard
              key={project.slug}
              project={project}
              index={index}
              containerRef={sectionRef}
            />
          ))}

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{
              opacity: scrollIndicatorOpacity,
              zIndex: 2,
            }}
          >
            <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
            <motion.div
              className="w-px h-8"
              style={{ background: `linear-gradient(to bottom, ${accentColorMuted}, transparent)` }}
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

        </motion.div>
      )}

      {/* Transitional statement - outside fade wrapper so Services can scroll over it */}
      {!isMobile && isInView && (
        <TransitionStatement containerRef={sectionRef} />
      )}

      {/* Mobile Layout */}
      <MobileWork />
    </section>
  );
}
