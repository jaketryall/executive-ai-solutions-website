"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSound } from "./SoundManager";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Work items with cinematic descriptions
export const workItems = [
  {
    title: "DESERT WINGS",
    category: "Aviation",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    url: "#",
    year: "2024",
    tagline: "Where luxury meets the horizon",
    description: "A complete digital transformation for a premium charter service, replacing dated systems with an experience as refined as the journey itself.",
    result: "340% increase in bookings",
    color: "#2a3f5f",
    warmColor: "rgba(255, 200, 150, 0.12)",
  },
  {
    title: "MERIDIAN",
    category: "Consulting",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    url: "#",
    year: "2024",
    tagline: "Presence that commands the room",
    description: "Crafting an executive digital presence that reflects the caliber of counsel within. Every interaction designed to build trust.",
    result: "87% more qualified leads",
    color: "#3d2c1f",
    warmColor: "rgba(255, 180, 120, 0.15)",
  },
  {
    title: "APEX",
    category: "Design Studio",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    url: "#",
    year: "2023",
    tagline: "Art demands attention",
    description: "An immersive gallery experience for a creative studio, letting their work speak through considered presentation.",
    result: "4.2x project inquiries",
    color: "#2d1f3d",
    warmColor: "rgba(255, 190, 140, 0.12)",
  },
  {
    title: "VERTEX",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    url: "#",
    year: "2023",
    tagline: "Clarity in complexity",
    description: "Distilling sophisticated technology into an experience that resonates. Making the complex feel intuitive.",
    result: "156% more demos",
    color: "#1f2d3d",
    warmColor: "rgba(255, 200, 160, 0.12)",
  },
];

// Horizontal Project Panel - Cinematic Style
function ProjectPanel({
  project,
  index,
}: {
  project: (typeof workItems)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { play } = useSound();

  return (
    <div
      className="project-panel relative w-screen h-screen flex items-center justify-center shrink-0 overflow-hidden"
      data-index={index}
    >
      {/* Warm ambient light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 100% 80% at 50% 30%, ${project.warmColor} 0%, transparent 60%)`,
        }}
      />

      {/* Massive outlined background text */}
      <div
        className="parallax-back absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <span
          className="text-[18vw] font-black tracking-[-0.04em] select-none"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.04)",
            WebkitTextFillColor: "transparent",
          }}
        >
          {project.title}
        </span>
      </div>

      {/* Content container */}
      <div
        className="parallax-front relative z-10 flex items-center gap-20 px-12 lg:px-24 max-w-7xl w-full"
        style={{ willChange: "transform" }}
      >
        {/* Left: Project info - Cinematic style */}
        <div className="flex-1 max-w-xl">
          {/* Number - large, warm accent */}
          <div className="flex items-center gap-6 mb-8">
            <span
              className="text-7xl md:text-9xl font-black"
              style={{ color: accentColorMuted }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div
              className="h-px flex-1 max-w-32"
              style={{ background: `linear-gradient(to right, ${accentColorMuted}, transparent)` }}
            />
          </div>

          {/* Category - elegant, not monospace */}
          <p
            className="text-sm uppercase tracking-[0.25em] mb-4"
            style={{ color: accentColorMuted }}
          >
            {project.category}
          </p>

          {/* Title */}
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-[-0.03em] mb-4">
            {project.title}
          </h2>

          {/* Tagline */}
          <p className="text-white/40 text-xl italic mb-8">
            {project.tagline}
          </p>

          {/* Description */}
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            {project.description}
          </p>

          {/* Result - warm accent */}
          <div className="mb-10">
            <p className="text-white/30 text-sm uppercase tracking-[0.2em] mb-2">
              The Result
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: accentColor }}
            >
              {project.result}
            </p>
          </div>

          {/* CTA Button - elegant */}
          <Link href={project.url}>
            <motion.button
              className="group inline-flex items-center gap-4 text-lg tracking-wide"
              style={{ color: accentColor }}
              whileHover={{ x: 8 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => play("hover", { volume: 0.06 })}
            >
              <span>View Project</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </motion.button>
          </Link>
        </div>

        {/* Right: Image - Cinematic presentation */}
        <div
          className="hidden lg:block flex-1 max-w-2xl"
          onMouseEnter={() => {
            setIsHovered(true);
            play("hover", { volume: 0.06 });
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm group cursor-pointer">
            {/* Warm ambient glow behind image */}
            <div
              className="absolute -inset-20 rounded-3xl pointer-events-none -z-10"
              style={{
                background: `radial-gradient(ellipse at center, ${project.warmColor.replace('0.12', '0.4')} 0%, transparent 60%)`,
                filter: "blur(80px)",
                opacity: isHovered ? 1 : 0.5,
                transform: isHovered ? "scale(1.15)" : "scale(1)",
                transition: "all 0.8s ease-out",
              }}
            />

            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="50vw"
            />

            {/* Cinematic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            {/* Letterbox bars on hover for cinematic feel */}
            <motion.div
              className="absolute top-0 left-0 right-0 bg-black"
              initial={{ height: 0 }}
              animate={{ height: isHovered ? 24 : 0 }}
              transition={{ duration: 0.4 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-black"
              initial={{ height: 0 }}
              animate={{ height: isHovered ? 24 : 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Year badge - elegant */}
            <div
              className="absolute top-8 right-8 text-sm tracking-widest"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {project.year}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Progress indicator - minimal, warm
function HorizontalProgress({ progress, isVisible }: { progress: number; isVisible: boolean }) {
  return (
    <div
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? "auto" : "none" }}
    >
      {/* Progress bar */}
      <div className="w-48 h-px bg-white/10 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(to right, ${accentColor}, ${accentColorMuted})`,
          }}
        />
      </div>

      {/* Dots */}
      <div className="flex gap-4">
        {workItems.map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-500"
            style={{
              backgroundColor: progress > i / workItems.length ? accentColor : "rgba(255,255,255,0.15)",
              transform: progress > i / workItems.length ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Mobile layout - Cinematic
function MobileWork() {
  const { play } = useSound();

  return (
    <div className="md:hidden">
      {/* Header */}
      <div className="px-6 pt-24 pb-16">
        <p
          className="text-sm uppercase tracking-[0.25em] mb-4"
          style={{ color: accentColorMuted }}
        >
          Selected Work
        </p>
        <h2 className="text-[15vw] font-black text-white leading-[0.85] tracking-[-0.03em]">
          THE
          <br />
          <span className="text-white/30">PROOF</span>
        </h2>
      </div>

      {workItems.map((project, index) => (
        <div
          key={project.title}
          className="min-h-screen flex flex-col justify-center px-6 py-20 relative overflow-hidden"
        >
          {/* Warm ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${project.warmColor} 0%, transparent 60%)`,
            }}
          />

          {/* Background number */}
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black pointer-events-none select-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.03)",
              WebkitTextFillColor: "transparent",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="relative z-10">
            {/* Number */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className="text-5xl font-black"
                style={{ color: accentColorMuted }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-8">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div
                className="absolute top-4 right-4 text-sm tracking-widest"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {project.year}
              </div>
            </div>

            {/* Category */}
            <p
              className="text-sm uppercase tracking-[0.25em] mb-3"
              style={{ color: accentColorMuted }}
            >
              {project.category}
            </p>

            {/* Title */}
            <h3 className="text-4xl font-black text-white tracking-[-0.02em] mb-3">
              {project.title}
            </h3>

            {/* Tagline */}
            <p className="text-white/40 text-lg italic mb-6">
              {project.tagline}
            </p>

            {/* Description */}
            <p className="text-white/60 text-base leading-relaxed mb-8">
              {project.description}
            </p>

            {/* Result */}
            <p
              className="text-xl font-bold"
              style={{ color: accentColor }}
            >
              {project.result}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Work() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isMobile || !containerRef.current || !wrapperRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const panels = container.querySelectorAll(".project-panel");
    const totalWidth = container.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      const horizontalTween = gsap.to(container, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 1.5,
          end: () => `+=${totalWidth * 0.85}`,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
          onEnter: () => setIsInView(true),
          onLeave: () => setIsInView(false),
          onEnterBack: () => setIsInView(true),
          onLeaveBack: () => setIsInView(false),
        },
      });

      // Intro panel animations
      const introPanel = container.querySelector(".intro-panel");
      if (introPanel) {
        const introContent = introPanel.querySelector(".intro-content");
        const introGlow = introPanel.querySelector(".intro-glow");
        const introLabel = introPanel.querySelector(".intro-label");
        const introTitleLines = introPanel.querySelectorAll(".intro-title-line");
        const introHint = introPanel.querySelector(".intro-hint");

        // Set initial states
        gsap.set([introLabel, introHint], { opacity: 0, y: 30 });
        gsap.set(introTitleLines, { opacity: 0, y: 60 });
        gsap.set(introGlow, { opacity: 0, scale: 0.8 });

        // Entrance animation timeline
        const introEnterTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        });

        introEnterTl
          .to(introGlow, { opacity: 1, scale: 1, duration: 0.5 })
          .to(introLabel, { opacity: 1, y: 0, duration: 0.3 }, "-=0.3")
          .to(introTitleLines, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, "-=0.2")
          .to(introHint, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2");

        // Exit animation - fade out and scale as scrolling to first project
        gsap.to(introContent, {
          opacity: 0,
          scale: 0.9,
          x: "-20%",
          ease: "power2.in",
          scrollTrigger: {
            trigger: introPanel,
            containerAnimation: horizontalTween,
            start: "center center",
            end: "right center",
            scrub: true,
          },
        });

        gsap.to(introGlow, {
          opacity: 0,
          scale: 1.2,
          ease: "power2.in",
          scrollTrigger: {
            trigger: introPanel,
            containerAnimation: horizontalTween,
            start: "center center",
            end: "right center",
            scrub: true,
          },
        });
      }

      panels.forEach((panel) => {
        const backLayer = panel.querySelector(".parallax-back");
        const frontLayer = panel.querySelector(".parallax-front");

        if (backLayer) {
          gsap.to(backLayer, {
            x: "20%",
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        }

        if (frontLayer) {
          gsap.to(frontLayer, {
            x: "-5%",
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="work"
      className="relative bg-black overflow-x-hidden"
      style={{ zIndex: 10, maxWidth: "100vw" }}
    >
      {/* Desktop: Horizontal Gallery */}
      {!isMobile && (
        <div
          ref={wrapperRef}
          className="hidden md:block relative overflow-hidden"
          style={{ height: "100vh", maxWidth: "100vw", overflowX: "hidden" }}
        >
          <div
            ref={containerRef}
            className="flex h-full"
            style={{ width: `${(workItems.length + 1) * 100}vw` }}
          >
            {/* Intro Panel */}
            <div className="intro-panel relative w-screen h-screen flex items-center justify-center shrink-0 overflow-hidden">
              {/* Warm ambient glow */}
              <div
                className="intro-glow absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 200, 150, 0.08) 0%, transparent 60%)`,
                }}
              />

              {/* Content */}
              <div className="intro-content relative z-10 text-center px-8">
                <p
                  className="intro-label text-sm md:text-base uppercase tracking-[0.3em] mb-8"
                  style={{ color: accentColorMuted }}
                >
                  Selected Work
                </p>
                <h2 className="intro-title text-[15vw] md:text-[12vw] font-black text-white leading-[0.85] tracking-[-0.04em]">
                  <span className="intro-title-line block">THE</span>
                  <span className="intro-title-line block text-white/30">PROOF</span>
                </h2>
                <p className="intro-hint text-white/30 text-lg mt-12 tracking-wide">
                  Scroll to explore →
                </p>
              </div>
            </div>

            {workItems.map((project, index) => (
              <ProjectPanel key={project.title} project={project} index={index} />
            ))}
          </div>

          <HorizontalProgress progress={scrollProgress} isVisible={isInView} />

          {/* Side labels - elegant */}
          <div
            className="fixed top-1/2 left-8 -translate-y-1/2 z-50 transition-opacity duration-300"
            style={{ opacity: isInView ? 1 : 0 }}
          >
            <span
              className="text-white/15 text-xs tracking-[0.3em] uppercase"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Selected Work
            </span>
          </div>

          <div
            className="fixed top-1/2 right-8 -translate-y-1/2 z-50 transition-opacity duration-300"
            style={{ opacity: isInView ? 1 : 0 }}
          >
            <span
              className="text-white/15 text-xs tracking-[0.3em] uppercase"
              style={{ writingMode: "vertical-rl" }}
            >
              Scroll to explore
            </span>
          </div>
        </div>
      )}

      {isMobile && <MobileWork />}
    </section>
  );
}
