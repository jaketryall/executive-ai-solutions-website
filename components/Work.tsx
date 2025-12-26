"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Animated button with staggered text reveal
function AnimatedButton({
  text,
  href,
  showArrow = false,
}: {
  text: string;
  href: string;
  showArrow?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  const getDelay = (index: number) => {
    const baseDelay = 0.03;
    const acceleration = 0.82;
    let delay = 0;
    for (let i = 0; i < index; i++) {
      delay += baseDelay * Math.pow(acceleration, i);
    }
    return delay;
  };

  return (
    <motion.a
      href={href}
      className="group inline-flex items-center justify-center gap-4 px-8 py-4 bg-white text-[#0a0a0a] font-medium rounded-full hover:bg-zinc-100 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      data-cursor="Let's Talk"
    >
      <span className="inline-flex items-center relative">
        {characters.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden relative"
            style={{
              height: "1.2em",
              lineHeight: "1.2em",
            }}
          >
            <motion.span
              className="inline-block"
              animate={{
                y: isHovered ? "-110%" : "0%",
              }}
              transition={{
                duration: 0.3,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            <motion.span
              className="inline-block absolute left-0 top-0"
              animate={{
                y: isHovered ? "0%" : "110%",
              }}
              transition={{
                duration: 0.3,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
      {showArrow && (
        <motion.span
          className="inline-block"
          animate={isHovered ? { x: 4 } : { x: 0 }}
          transition={{
            duration: 0.25,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          →
        </motion.span>
      )}
    </motion.a>
  );
}

export const workItems = [
  {
    title: "Desert Wings",
    category: "Aviation",
    description:
      "A modern, conversion-focused website for Arizona's premier flight training academy.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80",
    url: "https://www.desertwingsflightschool.com",
    results: "3x increase in student inquiries",
    year: "2024",
    size: "large",
  },
  {
    title: "Meridian",
    category: "Consulting",
    description:
      "Professional consulting firm website emphasizing trust and expertise.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
    url: "#",
    results: "40% improvement in lead quality",
    year: "2024",
    size: "medium",
  },
  {
    title: "Apex Interiors",
    category: "Design",
    description:
      "Elegant portfolio showcasing luxury interior design projects.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
    url: "#",
    results: "Featured in Design Weekly",
    year: "2023",
    size: "medium",
  },
  {
    title: "Northside",
    category: "Healthcare",
    description:
      "Modern healthcare platform focused on patient experience.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80",
    url: "#",
    results: "50% faster booking",
    year: "2023",
    size: "large",
  },
];

// Scrolling Content Cards Component
function ScrollingContentCards({
  scrollYProgress,
  activeIndex,
}: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  activeIndex: number;
}) {
  // Cards scroll continuously through the full scroll range
  const containerY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(workItems.length - 1) * 100}%`]
  );

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ y: containerY }}
    >
      {workItems.map((project, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={project.title}
            className="h-screen flex items-center justify-center px-12 shrink-0"
          >
            <motion.div
              className="max-w-lg"
              animate={{
                opacity: isActive ? 1 : 0.3,
                scale: isActive ? 1 : 0.95,
                filter: isActive ? "blur(0px)" : "blur(2px)",
              }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Category & Year */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-mono text-[#2563eb]">
                  0{index + 1}
                </span>
                <span className="w-8 h-px bg-zinc-700" />
                <span className="text-xs text-zinc-400 uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="text-xs text-zinc-600">{project.year}</span>
              </div>

              {/* Title */}
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 tracking-tight">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                {project.description}
              </p>

              {/* Result badge with glow */}
              <motion.div
                className="inline-flex items-center gap-3 px-4 py-2 bg-zinc-900/80 backdrop-blur-sm rounded-full border border-zinc-800 mb-8 relative"
                animate={{
                  borderColor: isActive ? "rgba(37, 99, 235, 0.4)" : "rgb(39, 39, 42)",
                  boxShadow: isActive ? "0 0 20px rgba(37, 99, 235, 0.15)" : "none",
                }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className={`w-2 h-2 rounded-full bg-[#2563eb] ${
                    isActive ? "animate-pulse" : ""
                  }`}
                  style={{
                    boxShadow: isActive ? "0 0 10px rgba(37, 99, 235, 0.5)" : "none",
                  }}
                />
                <span className="text-sm text-white font-medium">
                  {project.results}
                </span>
              </motion.div>

              {/* CTA */}
              <div>
                <Link
                  href={project.url}
                  target={project.url.startsWith("http") ? "_blank" : undefined}
                  rel={
                    project.url.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group inline-flex items-center gap-3 text-white"
                  data-cursor="View Project"
                >
                  <span className="text-lg font-medium group-hover:text-[#60a5fa] transition-colors duration-300">View Project</span>
                  <motion.div
                    className="relative w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-[#2563eb] group-hover:border-[#2563eb] transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: "0 0 0 0 rgba(37, 99, 235, 0)",
                    }}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-full bg-[#2563eb] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                    <svg
                      className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 17L17 7M17 7H7M17 7V17"
                      />
                    </svg>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}

// 3D Preview Card Component
function PreviewCard({
  project,
  index,
}: {
  project: (typeof workItems)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for tilt (subtle)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  // Glare effect position
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), {
    stiffness: 300,
    damping: 30,
  });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="relative w-full max-w-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ perspective: 1000 }}
    >
      {/* Floating project number behind card */}
      <motion.div
        className="absolute -left-8 -bottom-8 pointer-events-none select-none z-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span
          className="text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-zinc-800/50 to-transparent leading-none"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.05)" }}
        >
          0{index + 1}
        </span>
      </motion.div>

      {/* The 3D Card */}
      <motion.div
        className="relative aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl shadow-black/50"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Show iframe for external URLs, image otherwise */}
        {project.url.startsWith("http") ? (
          <iframe
            src={project.url}
            className="absolute inset-0 w-full h-full bg-white border-0"
            title={`Preview of ${project.title}`}
            loading="lazy"
          />
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Subtle gradient overlay for non-iframe */}
        {!project.url.startsWith("http") && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}

        {/* 3D Glare effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.4 : 0,
            background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.25) 0%, transparent 50%)`,
          }}
        />

        {/* Card border glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none"
          style={{
            boxShadow: isHovered
              ? "inset 0 0 0 1px rgba(37, 99, 235, 0.5), 0 0 60px rgba(37, 99, 235, 0.25), 0 0 120px rgba(37, 99, 235, 0.1)"
              : "inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 30px rgba(37, 99, 235, 0.05)",
            transition: "box-shadow 0.4s ease",
          }}
        />

        {/* Ambient glow behind card */}
        <motion.div
          className="absolute -inset-4 rounded-3xl pointer-events-none -z-10"
          animate={{
            opacity: isHovered ? 0.6 : 0.2,
          }}
          transition={{ duration: 0.4 }}
          style={{
            background: "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Category badge */}
        <motion.div
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white/80 border border-white/10">
            {project.category}
          </span>
        </motion.div>

        {/* View indicator on hover */}
        <motion.div
          className="absolute top-4 right-4 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-10 h-10 rounded-full bg-[#2563eb] flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 17L17 7M17 7H7M17 7V17"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track which card is active based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Cards spread across the full scroll range
      const index = Math.min(
        Math.floor(latest * workItems.length),
        workItems.length - 1
      );
      if (index >= 0) {
        setActiveIndex(index);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative"
      style={{ height: `${(workItems.length + 1) * 100}vh` }}
    >
      {/* Gradient background - base layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]" />

        {/* Top gradient blending from hero */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[60vh] opacity-40"
          style={{
            background: `conic-gradient(from 90deg at 60% 40%,
              transparent 0deg,
              #0a1628 60deg,
              #0066ff 120deg,
              #00a8ff 180deg,
              #0066ff 240deg,
              #0a1628 300deg,
              transparent 360deg
            )`,
            filter: "blur(120px)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(37, 99, 235, 0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Fixed ambient glows - always visible behind content */}
      <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
        {/* Floating blue orb - left side */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #2563eb 0%, transparent 70%)",
            filter: "blur(80px)",
            left: "-10%",
            top: "20%",
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating purple orb - right side */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            filter: "blur(80px)",
            right: "-5%",
            top: "40%",
          }}
          animate={{
            y: [0, 40, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Cyan accent glow - bottom center */}
        <motion.div
          className="absolute w-[800px] h-[400px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(ellipse, #06b6d4 0%, transparent 70%)",
            filter: "blur(100px)",
            left: "20%",
            bottom: "5%",
          }}
          animate={{
            x: [0, 50, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Two Column Sticky Layout - with header integrated */}
      <div ref={stickyRef} className="sticky top-0 h-screen flex z-10">
        {/* Section header - positioned at top left within sticky */}
        <div className="absolute top-8 left-0 right-0 z-20 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-12 h-px bg-zinc-700 origin-left"
              />
              <span className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
                Selected Work
              </span>
            </motion.div>
          </div>
        </div>
        {/* Left Column - 3D Preview Card */}
        <div className="w-1/2 h-full relative flex flex-col items-center justify-center px-12">
          {/* Featured Projects title above card */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight mb-8 text-center"
          >
            Featured{" "}
            <span className="font-serif italic text-[#2563eb]">projects</span>
          </motion.h2>

          {/* Progress indicator */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
            {workItems.map((_, i) => (
              <motion.div
                key={i}
                className="relative"
                animate={{
                  scale: i === activeIndex ? 1 : 0.8,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i === activeIndex ? "bg-[#2563eb]" : "bg-zinc-700"
                  }`}
                />
                {i === activeIndex && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -inset-1 border border-[#2563eb] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* 3D Card Preview */}
          <AnimatePresence mode="wait">
            <PreviewCard
              key={activeIndex}
              project={workItems[activeIndex]}
              index={activeIndex}
            />
          </AnimatePresence>
        </div>

        {/* Center divider line */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[60%] w-px bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />

        {/* Right Column - Continuously Scrolling Cards */}
        <div className="w-1/2 h-full relative overflow-hidden">
          {/* Intro text that fades as you scroll */}
          <motion.div
            className="absolute top-8 right-12 text-right z-10"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
            }}
          >
            <p className="text-zinc-400 text-sm max-w-xs">
              Crafting digital experiences that drive real results
            </p>
          </motion.div>

          <ScrollingContentCards
            scrollYProgress={scrollYProgress}
            activeIndex={activeIndex}
          />
        </div>
      </div>

    </section>
  );
}

// Stats section as a separate export to place after Work in page.tsx
export function WorkStats() {
  return (
    <div className="relative z-20 bg-[#0a0a0a] py-32">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 border-t border-zinc-800"
          >
            {[
              { value: "50+", label: "Projects Delivered" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "2x", label: "Average ROI" },
              { value: "14", label: "Days Avg. Delivery" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-semibold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 lg:px-24 mt-20"
      >
        <div className="max-w-7xl mx-auto flex justify-center">
          <AnimatedButton href="#contact" text="Start Your Project" showArrow />
        </div>
      </motion.div>
    </div>
  );
}
