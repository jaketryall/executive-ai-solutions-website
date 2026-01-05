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

// Enhanced work items with technical specs
export const workItems = [
  {
    title: "DESERT WINGS",
    category: "Aviation",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    url: "#",
    year: "2024",
    challenge: "Replacing a bloated WordPress theme with a lightning-fast custom engine",
    tech: ["Next.js", "GSAP", "Three.js"],
    roi: "340% increase in booking conversions",
    color: "#1a3a5c",
    lightColor: "rgba(26, 58, 92, 0.25)", // Deep blue glow
  },
  {
    title: "MERIDIAN",
    category: "Consulting",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    url: "#",
    year: "2024",
    challenge: "Creating an executive presence that commands premium pricing",
    tech: ["React", "Framer Motion", "Sanity CMS"],
    roi: "87% increase in qualified leads",
    color: "#3d2c1f",
    lightColor: "rgba(255, 180, 80, 0.15)", // Warm gold glow
  },
  {
    title: "APEX",
    category: "Design Studio",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    url: "#",
    year: "2023",
    challenge: "Showcasing creative work with immersive, gallery-like experience",
    tech: ["Next.js", "WebGL", "Custom Shaders"],
    roi: "4.2x increase in project inquiries",
    color: "#2d1f3d",
    lightColor: "rgba(128, 80, 200, 0.2)", // Purple glow
  },
  {
    title: "VERTEX",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    url: "#",
    year: "2023",
    challenge: "Communicating complex SaaS product with clarity and impact",
    tech: ["Next.js", "GSAP", "Lottie"],
    roi: "156% improvement in demo requests",
    color: "#1f2d3d",
    lightColor: "rgba(0, 200, 255, 0.18)", // Cyan tech glow
  },
];

// Horizontal Project Panel
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
      {/* Dynamic light source gradient - like Services */}
      <div
        className="project-light absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse 100% 80% at 50% 30%, ${project.lightColor} 0%, transparent 70%)`,
        }}
      />

      {/* Secondary glow layer for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 30% 50%, ${project.color}30 0%, transparent 60%)`,
        }}
      />

      {/* Accent glow on the right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 60% at 80% 60%, ${project.color}20 0%, transparent 50%)`,
        }}
      />

      {/* Massive outlined background text (parallax layer - slowest) */}
      <div
        className="parallax-back absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <span
          className="text-[30vw] font-black tracking-[-0.04em] select-none"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.06)",
            WebkitTextFillColor: "transparent",
          }}
        >
          {project.title}
        </span>
      </div>

      {/* Content container (parallax layer - fastest) */}
      <div
        className="parallax-front relative z-10 flex items-center gap-16 px-12 lg:px-20 max-w-7xl w-full"
        style={{ willChange: "transform" }}
      >
        {/* Left: Project info */}
        <div className="flex-1 max-w-lg">
          {/* Number badge */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[#00f0ff]/60 text-6xl md:text-8xl font-black">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#00f0ff]/30 to-transparent" />
          </div>

          {/* Category */}
          <p className="text-white/40 text-xs font-mono uppercase tracking-[0.3em] mb-3">
            {project.category}
          </p>

          {/* Title */}
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-[-0.02em] mb-6">
            {project.title}
          </h2>

          {/* Challenge */}
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            {project.challenge}
          </p>

          {/* Tech stack */}
          <div className="mb-6">
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
              Built with
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 border border-white/10 rounded-sm text-white/60 text-xs font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ROI */}
          <div className="mb-8">
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-2">
              The Result
            </p>
            <p className="text-[#00f0ff] text-xl font-bold">{project.roi}</p>
          </div>

          {/* CTA Button */}
          <Link href={project.url}>
            <motion.button
              className="group relative px-8 py-4 border border-white/20 rounded-sm overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => play("hover", { volume: 0.06 })}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
              <span className="relative text-white font-mono text-sm uppercase tracking-widest flex items-center gap-3">
                View Case Study
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>
        </div>

        {/* Right: Image */}
        <div
          className="hidden lg:block flex-1 max-w-2xl"
          onMouseEnter={() => {
            setIsHovered(true);
            play("hover", { volume: 0.06 });
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer">
            {/* Warm ambient glow behind image */}
            <div
              className="absolute -inset-16 rounded-3xl pointer-events-none -z-10"
              style={{
                background: `radial-gradient(ellipse at center, ${project.color}80 0%, ${project.color}40 40%, transparent 70%)`,
                filter: "blur(60px)",
                opacity: isHovered ? 1 : 0.6,
                transform: isHovered ? "scale(1.1)" : "scale(1)",
                transition: "all 0.6s ease-out",
              }}
            />

            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="50vw"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Hover scanlines */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.03) 2px, rgba(0,240,255,0.03) 4px)",
                }}
              />
            </motion.div>

            {/* Year badge */}
            <div className="absolute top-6 right-6 text-white/40 text-sm font-mono">
              {project.year}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Progress indicator
function HorizontalProgress({ progress }: { progress: number }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
      {/* Progress bar */}
      <div className="w-48 h-px bg-white/10 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00f0ff] to-white"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Current section indicators */}
      <div className="flex gap-3">
        {workItems.map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full border border-white/30"
            animate={{
              backgroundColor:
                progress > i / workItems.length ? "#00f0ff" : "transparent",
              borderColor:
                progress > i / workItems.length
                  ? "#00f0ff"
                  : "rgba(255,255,255,0.3)",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

// Mobile layout
function MobileWork() {
  const { play } = useSound();

  return (
    <div className="md:hidden">
      {/* Header */}
      <div className="px-6 pt-20 pb-12">
        <p className="text-white/40 text-xs font-mono uppercase tracking-[0.3em] mb-4">
          Selected Work
        </p>
        <h2 className="text-[14vw] font-black text-white leading-[0.9] tracking-[-0.02em]">
          THE PROOF
        </h2>
      </div>

      {workItems.map((project, index) => (
        <div
          key={project.title}
          className="min-h-screen flex flex-col justify-center px-6 py-16 relative overflow-hidden"
        >
          {/* Light effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${project.color}30 0%, transparent 70%)`,
            }}
          />

          {/* Background text */}
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[35vw] font-black pointer-events-none select-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.04)",
              WebkitTextFillColor: "transparent",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="relative z-10">
            {/* Number */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[#00f0ff]/60 text-4xl font-black">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-6">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 right-4 text-white/40 text-xs font-mono">
                {project.year}
              </div>
            </div>

            {/* Category */}
            <p className="text-white/40 text-xs font-mono uppercase tracking-[0.3em] mb-2">
              {project.category}
            </p>

            {/* Title */}
            <h3 className="text-4xl font-black text-white tracking-[-0.02em] mb-4">
              {project.title}
            </h3>

            {/* Challenge */}
            <p className="text-white/50 text-base leading-relaxed mb-6">
              {project.challenge}
            </p>

            {/* Tech */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 border border-white/10 rounded-sm text-white/60 text-xs font-mono"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* ROI */}
            <p className="text-[#00f0ff] text-lg font-bold">{project.roi}</p>
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

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // Check for mobile
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
      // Main horizontal scroll
      const horizontalTween = gsap.to(container, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 1.5,
          end: () => `+=${totalWidth * 1.5}`,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // Parallax for each panel
      panels.forEach((panel) => {
        const backLayer = panel.querySelector(".parallax-back");
        const frontLayer = panel.querySelector(".parallax-front");

        // Back layer moves slowest (0.2x)
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

        // Front layer moves fastest (slight overshoot)
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
          {/* Panorama container */}
          <div
            ref={containerRef}
            className="flex h-full"
            style={{ width: `${workItems.length * 100}vw` }}
          >
            {workItems.map((project, index) => (
              <ProjectPanel key={project.title} project={project} index={index} />
            ))}
          </div>

          {/* Fixed progress indicator */}
          <HorizontalProgress progress={scrollProgress} />

          {/* Fixed side labels */}
          <div className="fixed top-1/2 left-8 -translate-y-1/2 z-50">
            <span
              className="text-white/20 text-xs font-mono tracking-widest uppercase"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Selected Work
            </span>
          </div>

          <div className="fixed top-1/2 right-8 -translate-y-1/2 z-50">
            <span
              className="text-white/20 text-xs font-mono tracking-widest uppercase"
              style={{ writingMode: "vertical-rl" }}
            >
              Scroll to explore
            </span>
          </div>
        </div>
      )}

      {/* Mobile layout */}
      {isMobile && <MobileWork />}
    </section>
  );
}
