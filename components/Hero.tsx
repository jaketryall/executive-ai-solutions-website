"use client";

import { motion, useScroll, useTransform, MotionValue, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ShineButton from "./ShineButton";

// Smooth easing curve
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Staggered letter animation component
function AnimatedLetters({
  text,
  className = "",
  delay = 0
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span ref={ref} className={`inline-flex ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: smoothEase,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Work items for the grid - 4 per row, 3 rows
const workItems = [
  // Row 1
  {
    id: 1,
    title: "Desert Wings",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
  {
    id: 2,
    title: "Meridian",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    id: 3,
    title: "Apex Interiors",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    id: 4,
    title: "Northside",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  },
  // Row 2
  {
    id: 5,
    title: "Vertex Labs",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    id: 6,
    title: "CloudScale",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
  },
  {
    id: 7,
    title: "Elevate",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  },
  {
    id: 8,
    title: "Artisan",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  },
  // Row 3
  {
    id: 9,
    title: "Nomad",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
  {
    id: 10,
    title: "Harvest",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  },
  {
    id: 11,
    title: "Nexus",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  {
    id: 12,
    title: "Studio One",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  },
];

// Grid card component - simple, high quality
function GridCard({ item, index }: { item: typeof workItems[0]; index: number }) {
  return (
    <motion.div
      className="relative aspect-[4/3] rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.3 + index * 0.05,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      style={{
        boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover"
        sizes="300px"
      />
      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Subtle gold glow at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(154, 123, 60, 0.1), transparent)",
        }}
      />
    </motion.div>
  );
}

// Single row with parallax
function ParallaxRow({
  items,
  direction,
  scrollYProgress,
}: {
  items: typeof workItems;
  direction: "left" | "right";
  scrollYProgress: MotionValue<number>;
}) {
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? [0, -200] : [0, 200]
  );

  return (
    <motion.div
      className="flex gap-4 sm:gap-6 md:gap-8"
      style={{ x }}
    >
      {items.map((item, i) => (
        <div key={item.id} className="w-48 sm:w-56 md:w-72 flex-shrink-0">
          <GridCard item={item} index={i} />
        </div>
      ))}
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms for exit - text fades but grid continues
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  // Grid continues moving - doesn't fade as quickly
  const gridOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Split items into 3 rows
  const row1 = workItems.slice(0, 4);
  const row2 = workItems.slice(4, 8);
  const row3 = workItems.slice(8, 12);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
    >
      {/* Grid background with 3D perspective and alternating parallax */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center overflow-visible"
        style={{
          opacity: gridOpacity,
          y: gridY,
          perspective: "1200px",
        }}
      >

        <div
          ref={gridRef}
          style={{
            transform: "rotateX(30deg) rotateZ(-30deg) scale(1.5)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* 3 rows with alternating horizontal parallax */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
            <ParallaxRow items={row1} direction="left" scrollYProgress={scrollYProgress} />
            <ParallaxRow items={row2} direction="right" scrollYProgress={scrollYProgress} />
            <ParallaxRow items={row3} direction="left" scrollYProgress={scrollYProgress} />
          </div>

          {/* Ambient glow under the grid */}
          <div
            className="absolute -inset-64 -z-10"
            style={{
              background: "radial-gradient(ellipse at center, rgba(154, 123, 60, 0.2) 0%, transparent 60%)",
              filter: "blur(80px)",
            }}
          />
        </div>
      </motion.div>

      {/* Dark vignette overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse at center, rgba(10,10,10,0.7) 0%, #0a0a0a 70%)",
        }}
      />

      {/* Centered content */}
      <motion.div
        className="relative z-30 text-center px-6 pointer-events-none"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <motion.div style={{ y: textY }}>
          {/* Tagline - letter by letter */}
          <div className="text-zinc-500 text-sm md:text-base uppercase tracking-[0.3em] mb-6">
            <AnimatedLetters text="Web Design Studio" delay={0.8} />
          </div>

          {/* Main headline with staggered lines */}
          <h1 className="text-[clamp(2.5rem,10vw,7rem)] font-black leading-[1] tracking-tight mb-6 uppercase">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: smoothEase,
                }}
                className="text-white"
              >
                We Build Websites
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.45,
                  ease: smoothEase,
                }}
                className="text-white"
              >
                That{" "}
                <motion.span
                  className="inline-block text-metallic-gold"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: smoothEase }}
                >
                  Convert
                </motion.span>
              </motion.div>
            </div>
          </h1>

          {/* Subtext with staggered words */}
          <div className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-10">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: smoothEase }}
              className="inline-block"
            >
              Premium web design for ambitious brands.
            </motion.span>
            <br className="hidden md:block" />
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0, ease: smoothEase }}
              className="inline-block"
            >
              From concept to launch in 2 weeks.
            </motion.span>
          </div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.15, ease: smoothEase }}
          >
            <ShineButton href="#contact">
              Start a Project
            </ShineButton>

            <Link href="#work">
              <motion.button
                className="px-8 py-4 border border-zinc-700 text-white font-medium rounded-full hover:border-zinc-500 hover:bg-white/5 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Our Work
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{ opacity: heroOpacity }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-5 h-8 border border-zinc-700 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-1.5 bg-zinc-600 rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
