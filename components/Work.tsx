"use client";

import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
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

// Work items with cinematic descriptions
export const workItems = [
  {
    slug: "desert-wings",
    title: "DESERT WINGS",
    category: "Aviation",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    year: "2024",
    tagline: "Where luxury meets the horizon",
    description: "A complete digital transformation for a premium charter service.",
    result: "340%",
    resultLabel: "increase in bookings",
    color: "#2a3f5f",
    warmColor: "rgba(255, 200, 150, 0.15)",
  },
  {
    slug: "meridian",
    title: "MERIDIAN",
    category: "Consulting",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    year: "2024",
    tagline: "Presence that commands the room",
    description: "Crafting an executive digital presence that reflects caliber.",
    result: "87%",
    resultLabel: "more qualified leads",
    color: "#3d2c1f",
    warmColor: "rgba(255, 180, 120, 0.18)",
  },
  {
    slug: "apex",
    title: "APEX",
    category: "Design Studio",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    year: "2023",
    tagline: "Art demands attention",
    description: "An immersive gallery experience for a creative studio.",
    result: "4.2x",
    resultLabel: "project inquiries",
    color: "#2d1f3d",
    warmColor: "rgba(255, 190, 140, 0.15)",
  },
  {
    slug: "vertex",
    title: "VERTEX",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    year: "2023",
    tagline: "Clarity in complexity",
    description: "Distilling sophisticated technology into intuitive experience.",
    result: "156%",
    resultLabel: "more demos booked",
    color: "#1f2d3d",
    warmColor: "rgba(255, 200, 160, 0.15)",
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
        className="absolute -inset-20 -z-10 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${project.warmColor} 0%, transparent 70%)`,
          filter: "blur(40px)",
          opacity: glowOpacity,
        }}
      />

      <TransitionLink href={`/work/${project.slug}`}>
        <div
          className="group relative cursor-pointer rounded-xl overflow-hidden"
          style={{ isolation: "isolate" }}
          onMouseEnter={() => {
            setIsHovered(true);
            play("hover", { volume: 0.06 });
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main card content */}
          <div className="relative aspect-16/10">
            {/* Image wrapper for parallax */}
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-xl"
              style={{ y: imageY }}
            >
              {/* Oversized image for parallax movement */}
              <div className="absolute -inset-[20%]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority={index < 2}
                />
              </div>
            </motion.div>


            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              {/* Flying title - comes from the side */}
              <motion.div style={{ x: titleX, opacity: titleOpacity }}>
                <p
                  className="text-xs uppercase tracking-[0.3em] mb-2"
                  style={{ color: accentColor }}
                >
                  {project.category} • {project.year}
                </p>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-[-0.03em] mb-2">
                  {project.title}
                </h3>
                <p className="text-white/50 text-sm md:text-base max-w-md">
                  {project.tagline}
                </p>
              </motion.div>

              {/* Result badge */}
              <motion.div
                className="absolute top-6 right-6 text-right"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <p
                  className="text-3xl md:text-4xl font-black"
                  style={{ color: accentColor }}
                >
                  {project.result}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-wider">
                  {project.resultLabel}
                </p>
              </motion.div>

              {/* View indicator */}
              <motion.div
                className="absolute bottom-6 right-6 flex items-center gap-2"
                animate={{ x: isHovered ? 8 : 0, opacity: isHovered ? 1 : 0.6 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white/60 text-sm">View Project</span>
                <motion.span
                  className="text-lg"
                  style={{ color: accentColor }}
                  animate={{ x: isHovered ? 4 : 0 }}
                >
                  →
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </TransitionLink>
    </motion.div>
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
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-active:scale-105 rounded-xl"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Result badge */}
                  <div className="absolute top-4 right-4 text-right">
                    <p
                      className="text-2xl font-black"
                      style={{ color: accentColor }}
                    >
                      {project.result}
                    </p>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">
                      {project.resultLabel}
                    </p>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p
                      className="text-xs uppercase tracking-[0.2em] mb-1"
                      style={{ color: accentColor }}
                    >
                      {project.category}
                    </p>
                    <h3 className="text-2xl font-black text-white tracking-[-0.02em]">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Info below */}
                <div className="flex items-center justify-between px-1">
                  <p className="text-white/50 text-sm">{project.tagline}</p>
                  <span
                    className="text-sm tracking-wide"
                    style={{ color: accentColorMuted }}
                  >
                    View →
                  </span>
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

      // Start fading in when the section is within 0.4 viewport height of entering
      // Fully visible when section top reaches 15% from top
      const fadeStart = viewportHeight * 0.4; // Start fading when section top is 0.4vh away
      const fadeEnd = viewportHeight * 0.15; // Fully visible when 15% from top

      if (sectionTop > fadeStart) {
        // Not yet in fade zone
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

  // Center title fades as you scroll through the section
  const centerTitleScrollOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 1, 1, 0]);
  const centerTitleScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);

  // Title entrance animation - slides down with fade (no harsh clip)
  const titleLineOneY = useTransform(titleFadeOpacity, [0, 1], ["-40%", "0%"]);
  const titleLineOneOpacity = useTransform(titleFadeOpacity, [0, 0.6], [0, 1]);
  const titleLineTwoY = useTransform(titleFadeOpacity, [0, 0.4, 1], ["-40%", "-40%", "0%"]);
  const titleLineTwoOpacity = useTransform(titleFadeOpacity, [0.3, 0.8], [0, 1]);

  // Combined opacity: fade-in (titleFadeOpacity) * fade-during-scroll (centerTitleScrollOpacity)
  const combinedTitleOpacity = useTransform(
    [titleFadeOpacity, centerTitleScrollOpacity],
    ([fadeIn, scrollOpacity]) => (fadeIn as number) * (scrollOpacity as number)
  );

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
      className="relative bg-black"
      style={{
        zIndex: 5,
        // Height determines scroll length - more height = more scroll time for animations
        // With 0.12 spacing, cards complete around 90% of scroll, so 300vh is sufficient
        height: isMobile ? "auto" : "300vh",
      }}
    >
      {/* Desktop Layout - Fixed elements only visible when section is in view */}
      {!isMobile && isInView && (
        <>
          {/* Fixed center title */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: combinedTitleOpacity,
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

              {/* Big centered title - slides in from top with fade */}
              <h2 className="text-[18vw] font-black leading-[0.8] tracking-[-0.04em]">
                <motion.span
                  className="block text-white"
                  style={{ y: titleLineOneY, opacity: titleLineOneOpacity }}
                >
                  THE
                </motion.span>
                <motion.span
                  className="block text-white/20"
                  style={{ y: titleLineTwoY, opacity: titleLineTwoOpacity }}
                >
                  PROOF
                </motion.span>
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
              zIndex: 20,
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
        </>
      )}

      {/* Mobile Layout */}
      <MobileWork />
    </section>
  );
}
