"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
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

  // Stagger the starting positions
  const startOffset = index * 0.15;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Multi-layer parallax - different speeds for different elements
  // Cards fly up from below at different rates
  const cardY = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.4, 1],
    ["120vh", "0vh", "-100vh"]
  );

  // Image moves slower than card (parallax within card)
  const imageY = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.4, 1],
    ["30%", "0%", "-20%"]
  );

  // Title flies faster (whoosh effect)
  const titleX = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.3, startOffset + 0.5],
    ["-100%", "0%", "0%"]
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.25, startOffset + 0.6, startOffset + 0.75],
    [0, 1, 1, 0]
  );

  // Scale and rotation for dramatic entry
  const cardScale = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.3, startOffset + 0.6, 1],
    [0.8, 1, 1, 0.9]
  );

  const cardRotate = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.3],
    [5, 0]
  );

  // Glow intensity based on position
  const glowOpacity = useTransform(
    scrollYProgress,
    [startOffset + 0.2, startOffset + 0.4, startOffset + 0.6],
    [0, 1, 0]
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
        left: xPosition,
        top: "15vh",
        zIndex: 10 + index,
      }}
    >
      <TransitionLink href={`/work/${project.slug}`}>
        <div
          className="group relative cursor-pointer"
          onMouseEnter={() => {
            setIsHovered(true);
            play("hover", { volume: 0.06 });
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Glow layer - moves independently */}
          <motion.div
            className="absolute -inset-20 -z-10 rounded-3xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${project.warmColor} 0%, transparent 70%)`,
              filter: "blur(40px)",
              opacity: glowOpacity,
            }}
          />

          {/* Main card */}
          <div className="relative overflow-hidden rounded-xl aspect-[16/10]">
            {/* Background image with parallax */}
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-xl"
              style={{ y: imageY, scale: 1.2 }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover rounded-xl"
                sizes="50vw"
              />
            </motion.div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

            {/* Hover color wash */}
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: project.warmColor.replace("0.15", "0.3") }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.2 : 0 }}
              transition={{ duration: 0.3 }}
            />

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
  const startOffset = index * 0.15 + 0.1;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Title flies across screen
  const x = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.2, startOffset + 0.4],
    direction === "left" ? ["100vw", "0vw", "-100vw"] : ["-100vw", "0vw", "100vw"]
  );

  const opacity = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.15, startOffset + 0.3, startOffset + 0.4],
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
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Track when section is in viewport to show/hide fixed elements
  // Use scroll position check: only show when Work section top is at or above viewport top
  useEffect(() => {
    if (!sectionRef.current || isMobile) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      // Only show fixed elements when:
      // 1. Section top has scrolled past the viewport top (sectionTop <= 0)
      // 2. Section bottom is still below viewport top (sectionBottom > 0)
      const shouldShow = sectionTop <= 0 && sectionBottom > 0;
      setIsInView(shouldShow);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Center title fades as you scroll
  const centerTitleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 1, 1, 0]);
  const centerTitleScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);

  // Scroll indicator opacity
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 0.3, 0.3, 0]);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isMobile || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate the center title letters
      const titleLetters = document.querySelectorAll(".center-title-letter");
      gsap.set(titleLetters, { y: "100%", opacity: 0 });

      gsap.to(titleLetters, {
        y: "0%",
        opacity: 1,
        stagger: 0.05,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      });

      // Decorative elements animation
      gsap.fromTo(
        ".work-decor-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative bg-black"
      style={{
        zIndex: 5,
        // Height determines scroll length - more height = more scroll time for animations
        height: isMobile ? "auto" : "400vh",
      }}
    >
      {/* Desktop Layout - Fixed elements only visible when section is in view */}
      {!isMobile && isInView && (
        <>
          {/* Fixed center title */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: centerTitleOpacity,
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
                className="text-sm uppercase tracking-[0.4em] mb-8"
                style={{ color: accentColorMuted }}
              >
                Selected Work
              </p>

              {/* Big centered title */}
              <h2 className="text-[18vw] font-black leading-[0.8] tracking-[-0.04em]">
                <span className="block overflow-hidden">
                  {"THE".split("").map((letter, i) => (
                    <span key={i} className="inline-block overflow-hidden">
                      <span className="center-title-letter inline-block text-white">
                        {letter}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="block overflow-hidden">
                  {"PROOF".split("").map((letter, i) => (
                    <span key={i} className="inline-block overflow-hidden">
                      <span className="center-title-letter inline-block text-white/15">
                        {letter}
                      </span>
                    </span>
                  ))}
                </span>
              </h2>

              {/* Decorative lines */}
              <div className="flex items-center justify-center gap-8 mt-8">
                <div
                  className="work-decor-line h-px w-24 origin-right"
                  style={{
                    background: `linear-gradient(to left, ${accentColorMuted}, transparent)`,
                  }}
                />
                <span className="text-white/20 text-sm tracking-widest">
                  {workItems.length} PROJECTS
                </span>
                <div
                  className="work-decor-line h-px w-24 origin-left"
                  style={{
                    background: `linear-gradient(to right, ${accentColorMuted}, transparent)`,
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
