"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { workItems } from "./Work";

// Character-by-character text reveal animation
function AnimatedText({
  text,
  delay = 0,
  className = "",
  staggerDelay = 0.03,
}: {
  text: string;
  delay?: number;
  className?: string;
  staggerDelay?: number;
}) {
  const characters = text.split("");

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      y: "100%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={child}
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// Button with staggered text reveal on hover - two-line text swap effect
function AnimatedButton({
  text,
  href,
  variant = "primary",
  showArrow = false,
}: {
  text: string;
  href: string;
  variant?: "primary" | "secondary";
  showArrow?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  const baseStyles = variant === "primary"
    ? "bg-white text-[#0a0a0a] hover:bg-zinc-100"
    : "border border-zinc-700 text-white hover:bg-white/5";

  // Calculate accelerating delay for each character
  const getDelay = (index: number, reverse: boolean = false) => {
    const baseDelay = 0.035;
    const acceleration = 0.82;
    let delay = 0;
    const charIndex = reverse ? (characters.length - 1 - index) : index;
    for (let i = 0; i < charIndex; i++) {
      delay += baseDelay * Math.pow(acceleration, i);
    }
    return delay;
  };

  return (
    <motion.a
      href={href}
      className={`group inline-flex items-center justify-center gap-3 px-8 py-4 font-medium rounded-full transition-colors ${baseStyles}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
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
            {/* Original text - slides up and out */}
            <motion.span
              className="inline-block"
              animate={{
                y: isHovered ? "-110%" : "0%",
              }}
              transition={{
                duration: 0.3,
                delay: getDelay(index, false),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            {/* Duplicate text - slides up from below */}
            <motion.span
              className="inline-block absolute left-0 top-0"
              animate={{
                y: isHovered ? "0%" : "110%",
              }}
              transition={{
                duration: 0.3,
                delay: getDelay(index, false),
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

// Work thumbnail component
function WorkThumbnail({
  item,
  index,
  onHover,
  onLeave,
  isHovered,
}: {
  item: (typeof workItems)[0];
  index: number;
  onHover: () => void;
  onLeave: () => void;
  isHovered: boolean;
}) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      data-cursor="View Project"
    >
      <Link
        href={item.url}
        target={item.url.startsWith("http") ? "_blank" : undefined}
        rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
      >
        <div className="relative w-[140px] h-[90px] md:w-[180px] md:h-[115px] rounded-xl overflow-hidden bg-zinc-900 shadow-2xl shadow-black/60">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <motion.div
            className="absolute inset-0 bg-[#2563eb]/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-sm font-medium">View →</span>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-xs md:text-sm font-medium text-white">{item.title}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms for different elements
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const subheadlineY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const thumbnailsY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const faviconY = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const faviconScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col bg-[#0a0a0a] overflow-x-clip overflow-y-visible"
    >
      {/* Fluid Gradient Background with Parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-[#0a0a0a]" />

        {/* Animated gradient blob 1 - Purple/Pink */}
        <motion.div
          className="absolute w-[120%] h-[120%] opacity-40"
          style={{
            background: `conic-gradient(from 180deg at ${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%,
              transparent 0deg,
              #1a0a2e 45deg,
              #2d1b4e 90deg,
              #4a1942 135deg,
              #1a0a2e 180deg,
              transparent 225deg,
              transparent 360deg
            )`,
            filter: "blur(80px)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated gradient blob 2 - Blue/Cyan */}
        <motion.div
          className="absolute w-full h-full opacity-40"
          style={{
            background: `conic-gradient(from 90deg at ${60 - mousePosition.x * 3}% ${40 + mousePosition.y * 3}%,
              transparent 0deg,
              #0a1628 60deg,
              #0066ff 120deg,
              #00a8ff 180deg,
              #0066ff 240deg,
              #0a1628 300deg,
              transparent 360deg
            )`,
            filter: "blur(100px)",
          }}
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated gradient blob 3 - Orange accent */}
        <motion.div
          className="absolute w-[80%] h-[80%] left-[10%] top-[10%] opacity-25"
          style={{
            background: `conic-gradient(from 270deg at ${45 + mousePosition.x * 4}% ${55 - mousePosition.y * 4}%,
              transparent 0deg,
              transparent 150deg,
              #3d1f0f 180deg,
              #ff6b35 210deg,
              #ff8c42 240deg,
              #3d1f0f 270deg,
              transparent 300deg,
              transparent 360deg
            )`,
            filter: "blur(90px)",
          }}
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        {/* Oversized Favicon with Parallax */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]"
          style={{ y: faviconY, scale: faviconScale }}
        >
          <div className="relative w-[70vw] h-[70vw] max-w-[700px] max-h-[700px]">
            <Image src="/favicon.png" alt="" fill className="object-contain" priority />
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content with Parallax */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-24"
        style={{ opacity: contentOpacity }}
      >
        {/* Tagline with staggered reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-8 h-px bg-zinc-600 origin-right"
          />
          <span className="text-zinc-500 text-xs uppercase tracking-[0.3em]">
            Web Design Studio
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-8 h-px bg-zinc-600 origin-left"
          />
        </motion.div>

        {/* Main Headline with character-by-character reveal */}
        <motion.h1
          style={{ y: headlineY }}
          className="text-5xl md:text-7xl lg:text-8xl font-medium text-white leading-[0.95] tracking-tight mb-8 max-w-5xl"
        >
          <AnimatedText text="We design websites" delay={0.4} staggerDelay={0.025} />
          <br />
          <AnimatedText
            text="that convert"
            delay={0.8}
            staggerDelay={0.03}
            className="text-zinc-500"
          />
        </motion.h1>

        {/* Subheadline with word-by-word reveal */}
        <motion.div
          style={{ y: subheadlineY }}
          className="text-zinc-400 text-lg md:text-xl max-w-xl mb-12 leading-relaxed"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Premium digital experiences for ambitious brands.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            From strategy to launch, we build sites that drive results.
          </motion.p>
        </motion.div>

        {/* CTAs with hover text animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{ y: ctaY }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <AnimatedButton
            href="#contact"
            text="Start a Project"
            variant="primary"
            showArrow
          />
          <AnimatedButton
            href="#work"
            text="View Work"
            variant="secondary"
          />
        </motion.div>

      </motion.div>

      {/* Hovered Work Background Image */}
      <AnimatePresence>
        {hoveredWork !== null && (
          <motion.div
            key={hoveredWork}
            className="absolute inset-0 z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={workItems[hoveredWork].image}
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <motion.div
              className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-white text-2xl font-medium">
                {workItems[hoveredWork].title}
              </p>
              <p className="text-white/60 text-sm mt-1">
                {workItems[hoveredWork].category}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Work Thumbnails at Bottom with Parallax */}
      <motion.div
        className="relative z-10 mt-8 md:mt-16"
        style={{ y: thumbnailsY, opacity: contentOpacity }}
      >
        <div className="pt-6 pb-8 md:pt-8 md:pb-12">
          <div className="flex justify-center items-end gap-3 md:gap-4 px-4 overflow-x-auto">
            {workItems.map((item, index) => (
              <WorkThumbnail
                key={item.title}
                item={item}
                index={index}
                onHover={() => setHoveredWork(index)}
                onLeave={() => setHoveredWork(null)}
                isHovered={hoveredWork === index}
              />
            ))}
          </div>
        </div>
      </motion.div>

    </section>
  );
}
