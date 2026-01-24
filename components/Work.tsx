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

// Animated letter for the main title
function TitleLetter({
  letter,
  index,
  isVisible,
  isMuted = false,
}: {
  letter: string;
  index: number;
  isVisible: boolean;
  isMuted?: boolean;
}) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ color: isMuted ? "rgba(255, 255, 255, 0.2)" : "white" }}
    >
      {letter}
    </motion.span>
  );
}

// Work items with cinematic descriptions
export const workItems = [
  {
    slug: "desert-wings",
    title: "DESERT WINGS",
    category: "Flight School",
    image: "/Celestial Laptop Mockup.png",
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
    image: "/Celestial iPhone Mockup.png",
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
    image: "/Rubber iPhone Mockup.png",
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
    image: "/Elegant Black Laptop Mockup.png",
    year: "2025",
    tagline: "See Arizona from above",
    description: "Thrilling gyrocopter tours over Arizona's landscapes.",
    result: "Soaring",
    resultLabel: "bookings",
    color: "#3f2d1f",
    warmColor: "rgba(255, 180, 120, 0.15)",
  },
];

// Flying project card with multi-layer parallax
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

  // Stagger the starting positions - cards overlap each other
  // Tighter spacing (0.12) means next card enters while previous is still visible
  const startOffset = index * 0.12;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Multi-layer parallax - cards continuously move upward
  // Settle point is when card reaches center, exit completes at end of its animation window
  const settlePoint = startOffset + 0.25;
  const exitPoint = Math.min(startOffset + 0.55, 1); // Ensure we don't go past 1

  const cardY = useTransform(
    scrollYProgress,
    [startOffset, settlePoint, exitPoint],
    ["100vh", "0vh", "-100vh"]
  );

  // Image moves slower than card (parallax within card)
  const imageY = useTransform(
    scrollYProgress,
    [startOffset, settlePoint, exitPoint],
    ["30%", "0%", "-20%"]
  );

  // Title flies faster (whoosh effect)
  const titleX = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.15, startOffset + 0.3],
    ["-100%", "0%", "0%"]
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.1, startOffset + 0.35, startOffset + 0.45],
    [0, 1, 1, 0]
  );

  // Scale and rotation for dramatic entry
  const cardScale = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.15, startOffset + 0.4, exitPoint],
    [0.8, 1, 1, 0.9]
  );

  const cardRotate = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.15],
    [5, 0]
  );

  // Glow intensity based on position
  const glowOpacity = useTransform(
    scrollYProgress,
    [startOffset + 0.1, startOffset + 0.25, startOffset + 0.4],
    [0, 1, 0]
  );

  // Card opacity - fully hidden until scroll triggers it, then fades out before exit completes
  const fadeOutStart = Math.min(startOffset + 0.4, 0.85);
  const fadeOutEnd = Math.min(startOffset + 0.5, 0.95);
  const cardOpacity = useTransform(
    scrollYProgress,
    [0, startOffset, startOffset + 0.05, fadeOutStart, fadeOutEnd],
    [0, 0, 1, 1, 0]
  );

  // Alternating left/right positions
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
        top: "15vh",
        zIndex: 10 + index,
      }}
    >
      {/* Glow layer - outside the clipped container */}
      <motion.div
        className="absolute -inset-16 -z-10 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${project.warmColor.replace("0.15", "0.08")} 0%, transparent 60%)`,
          filter: "blur(30px)",
          opacity: glowOpacity,
        }}
      />

      <TransitionLink href={`/work/${project.slug}`}>
        <div
          className="group relative cursor-pointer"
          style={{ isolation: "isolate" }}
          onMouseEnter={() => {
            setIsHovered(true);
            play("hover", { volume: 0.06 });
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Card - clean mockup with hover reveal */}
          <div className="relative aspect-4/3 overflow-hidden rounded-xl">
            {/* Image wrapper for parallax */}
            <motion.div
              className="absolute inset-0"
              style={{ y: imageY }}
            >
              {/* Oversized image for parallax movement */}
              <div className="absolute -inset-[15%]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className={project.image.includes("Laptop") ? "object-contain" : "object-cover object-top"}
                  sizes="50vw"
                  priority={index < 2}
                />
              </div>
            </motion.div>

            {/* Gradient overlay - fades in on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)",
              }}
            />

            {/* Content - slides up on hover */}
            <motion.div
              className="absolute inset-0 p-6 flex flex-col justify-end"
              initial={false}
              animate={{
                y: isHovered ? 0 : 20,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div style={{ x: titleX, opacity: titleOpacity }}>
                <p
                  className="text-xs uppercase tracking-[0.3em] mb-2"
                  style={{ color: accentColor }}
                >
                  {project.category} • {project.year}
                </p>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-[-0.03em] mb-2">
                  {project.title}
                </h3>
                <p className="text-white/60 text-sm md:text-base max-w-md">
                  {project.tagline}
                </p>
              </motion.div>
            </motion.div>

            {/* View indicator - always visible, transforms on hover */}
            <motion.div
              className="absolute bottom-4 right-4 flex items-center gap-2 z-10 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              animate={{
                scale: isHovered ? 1.05 : 1,
                background: isHovered ? "rgba(255, 200, 150, 0.15)" : "rgba(0,0,0,0.5)",
                borderColor: isHovered ? "rgba(255, 200, 150, 0.3)" : "rgba(255,255,255,0.1)",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.span
                className="text-xs font-medium"
                animate={{ color: isHovered ? "rgba(255, 200, 150, 1)" : "rgba(255,255,255,0.7)" }}
                transition={{ duration: 0.3 }}
              >
                View
              </motion.span>
              <motion.span
                className="text-sm"
                style={{ color: accentColor }}
                animate={{ x: isHovered ? 3 : 0 }}
                transition={{ duration: 0.3 }}
              >
                →
              </motion.span>
            </motion.div>
          </div>
        </div>
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

// Flying title text that whooshes by
function FlyingTitle({
  text,
  index,
  containerRef,
  direction = "left",
}: {
  text: string;
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  direction?: "left" | "right";
}) {
  // Match card timing: each card starts 0.12 apart
  const startOffset = index * 0.12 + 0.05;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Title flies across screen - faster to match compressed timing
  const x = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.15, startOffset + 0.3],
    direction === "left" ? ["100vw", "0vw", "-100vw"] : ["-100vw", "0vw", "100vw"]
  );

  const opacity = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.08, startOffset + 0.22, startOffset + 0.3],
    [0, 0.15, 0.15, 0]
  );

  return (
    <motion.div
      className="fixed top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
      style={{
        x,
        opacity,
        zIndex: 5,
      }}
    >
      <span
        className="text-[20vw] font-black tracking-[-0.04em]"
        style={{
          WebkitTextStroke: "1px rgba(255,200,150,0.15)",
          WebkitTextFillColor: "transparent",
        }}
      >
        {text}
      </span>
    </motion.div>
  );
}

// Mobile layout
function MobileWork() {
  const { play } = useSound();

  return (
    <div className="md:hidden px-6 py-24">
      {/* Header */}
      <div className="mb-16 text-center">
        <p
          className="text-sm uppercase tracking-[0.25em] mb-4"
          style={{ color: accentColorMuted }}
        >
          Selected Work
        </p>
        <h2 className="text-[18vw] font-black text-white leading-[0.85] tracking-[-0.03em]">
          THE
          <br />
          <span className="text-white/20">PROOF</span>
        </h2>
      </div>

      {/* Project Cards */}
      <div className="space-y-10">
        {workItems.map((project, index) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
          >
            <TransitionLink href={`/work/${project.slug}`}>
              <div className="group relative">
                {/* Clean mockup image */}
                <div className="relative overflow-hidden rounded-xl aspect-4/3 mb-3">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={`${project.image.includes("Laptop") ? "object-contain" : "object-cover object-top"} transition-transform duration-700 group-active:scale-105`}
                    sizes="100vw"
                  />

                  {/* Subtle vignette */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.2) 100%)"
                  }} />

                  {/* View indicator */}
                  <div
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-300 group-active:scale-105"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="text-white/70 text-xs font-medium group-active:text-[rgba(255,200,150,1)] transition-colors">View</span>
                    <span className="text-sm transition-transform group-active:translate-x-0.5" style={{ color: accentColor }}>→</span>
                  </div>
                </div>

                {/* Content below image on mobile */}
                <div className="px-1">
                  <p
                    className="text-xs uppercase tracking-[0.2em] mb-1"
                    style={{ color: accentColor }}
                  >
                    {project.category} • {project.year}
                  </p>
                  <h3 className="text-xl font-black text-white tracking-[-0.02em] mb-0.5">
                    {project.title}
                  </h3>
                  <p className="text-white/50 text-sm">{project.tagline}</p>
                </div>
              </div>
            </TransitionLink>
          </motion.div>
        ))}
      </div>
    </div>
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

      // Start fading in only when the section top is near the viewport top
      // This ensures the title appears "inside" the Work section visually
      const fadeStart = viewportHeight * 0.1; // Start fading when section top is 10% down from viewport top
      const fadeEnd = -viewportHeight * 0.05; // Fully visible when section top is slightly above viewport

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

  // Center title only fades out at the end of the section, stays solid otherwise
  const centerTitleScrollOpacity = useTransform(scrollYProgress, [0, 0.6, 0.75], [1, 1, 0]);
  const centerTitleScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);

  // Title entrance uses stagger effect controlled by isInView state

  // Scroll indicator opacity
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 0.3, 0.3, 0]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animate decorative elements when they come into view
  useEffect(() => {
    if (isMobile || !isInView) return;

    // Small delay to ensure DOM elements are rendered
    const timer = setTimeout(() => {
      const workLabel = document.querySelector(".work-label");
      const workCount = document.querySelector(".work-count");
      const decorLines = document.querySelectorAll(".work-decor-line");

      // Animate label
      if (workLabel) {
        gsap.to(workLabel, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // Animate count
      if (workCount) {
        gsap.to(workCount, {
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power2.out",
        });
      }

      // Animate decorative lines
      if (decorLines.length > 0) {
        gsap.to(decorLines, {
          scaleX: 1,
          duration: 1,
          delay: 0.2,
          ease: "power2.out",
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isMobile, isInView]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-black rounded-t-[3rem] overflow-hidden"
      style={{
        zIndex: 10,
        boxShadow: "0 -50px 0 0 black",
        // Height determines scroll length - more height = more scroll time for animations
        height: isMobile ? "auto" : "500vh",
      }}
    >

      {/* Desktop Layout - Fixed elements with smooth entrance/exit */}
      {!isMobile && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          style={{ opacity: titleFadeOpacity, zIndex: 10 }}
        >
          {/* Fixed center title */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: centerTitleScrollOpacity,
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
              <h2 className="text-[18vw] font-black leading-[0.8] tracking-[-0.04em]">
                <span className="block">
                  {"THE".split("").map((letter, i) => (
                    <TitleLetter
                      key={`the-${i}`}
                      letter={letter}
                      index={i}
                      isVisible={isInView}
                    />
                  ))}
                </span>
                <span className="block">
                  {"PROOF".split("").map((letter, i) => (
                    <TitleLetter
                      key={`proof-${i}`}
                      letter={letter}
                      index={i + 3}
                      isVisible={isInView}
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

          {/* Flying title texts (background layer) */}
          {workItems.map((project, index) => (
            <FlyingTitle
              key={`title-${project.slug}`}
              text={project.title}
              index={index}
              containerRef={sectionRef}
              direction={index % 2 === 0 ? "left" : "right"}
            />
          ))}

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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
