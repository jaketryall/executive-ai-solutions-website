"use client";

import { useRef, useEffect, useLayoutEffect, ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

// Custom wrap function to avoid external dependency
function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

interface ScrollVelocityProps {
  children: string;
  baseVelocity?: number;
  className?: string;
  direction?: "left" | "right";
}

// Infinite scrolling text that responds to scroll velocity
export function VelocityText({
  children,
  baseVelocity = 2,
  className = "",
  direction = "left",
}: ScrollVelocityProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const directionFactor = useRef<number>(direction === "left" ? -1 : 1);

  // Wrap value between -20% and -45% for seamless loop
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Reverse direction based on scroll direction
    if (velocityFactor.get() < 0) {
      directionFactor.current = direction === "left" ? 1 : -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = direction === "left" ? -1 : 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  // Repeat text 4 times for seamless loop
  const repeatedText = Array(4)
    .fill(children)
    .map((text, i) => (
      <span key={i} className="inline-block whitespace-nowrap mr-8">
        {text}
      </span>
    ));

  return (
    <div className="overflow-hidden">
      <motion.div className={`flex whitespace-nowrap ${className}`} style={{ x }}>
        {repeatedText}
      </motion.div>
    </div>
  );
}

// Parallax element that moves based on scroll velocity
interface VelocityParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "vertical" | "horizontal";
}

export function VelocityParallax({
  children,
  className = "",
  speed = 0.5,
  direction = "vertical",
}: VelocityParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 30,
    stiffness: 200,
  });

  const transform = useTransform(smoothVelocity, [-1000, 1000], [-50 * speed, 50 * speed]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={direction === "vertical" ? { y: transform } : { x: transform }}
    >
      {children}
    </motion.div>
  );
}

// Skew element based on scroll velocity
interface VelocitySkewProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function VelocitySkew({ children, className = "", intensity = 1 }: VelocitySkewProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300,
  });

  const skewY = useTransform(smoothVelocity, [-1000, 1000], [5 * intensity, -5 * intensity]);

  return (
    <motion.div className={className} style={{ skewY }}>
      {children}
    </motion.div>
  );
}

// Scale element based on scroll velocity
interface VelocityScaleProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function VelocityScale({ children, className = "", intensity = 0.1 }: VelocityScaleProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300,
  });

  const scale = useTransform(
    smoothVelocity,
    [-1000, 0, 1000],
    [1 - intensity, 1, 1 + intensity]
  );

  return (
    <motion.div className={className} style={{ scale }}>
      {children}
    </motion.div>
  );
}

// Opacity fade based on scroll velocity
interface VelocityFadeProps {
  children: ReactNode;
  className?: string;
  fadeOnFast?: boolean;
}

export function VelocityFade({ children, className = "", fadeOnFast = true }: VelocityFadeProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const absVelocity = useTransform(scrollVelocity, (v) => Math.abs(v));
  const smoothVelocity = useSpring(absVelocity, {
    damping: 50,
    stiffness: 300,
  });

  const opacity = useTransform(smoothVelocity, [0, 500], fadeOnFast ? [1, 0.3] : [0.3, 1]);

  return (
    <motion.div className={className} style={{ opacity }}>
      {children}
    </motion.div>
  );
}

// Letter spacing that expands/contracts with scroll velocity
interface VelocityLetterSpacingProps {
  children: string;
  className?: string;
  intensity?: number;
}

export function VelocityLetterSpacing({
  children,
  className = "",
  intensity = 0.05,
}: VelocityLetterSpacingProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const absVelocity = useTransform(scrollVelocity, (v) => Math.abs(v));
  const smoothVelocity = useSpring(absVelocity, {
    damping: 50,
    stiffness: 300,
  });

  const letterSpacing = useTransform(smoothVelocity, [0, 1000], [0, intensity]);

  return (
    <motion.span className={className} style={{ letterSpacing: useTransform(letterSpacing, (v) => `${v}em`) }}>
      {children}
    </motion.span>
  );
}

// Combined kinetic text section with multiple velocity effects
interface KineticSectionProps {
  lines: string[];
  className?: string;
  baseVelocity?: number;
}

export function KineticSection({ lines, className = "", baseVelocity = 3 }: KineticSectionProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      {lines.map((line, index) => (
        <VelocityText
          key={index}
          baseVelocity={baseVelocity * (index % 2 === 0 ? 1 : -0.8)}
          direction={index % 2 === 0 ? "left" : "right"}
          className="text-[8vw] md:text-[6vw] font-black uppercase tracking-tight text-white/10"
        >
          {line}
        </VelocityText>
      ))}
    </div>
  );
}

// Horizontal scroll section driven by vertical scroll
interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <div ref={containerRef} className={`relative h-[300vh] ${className}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="flex h-full" style={{ x }}>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

// Scroll progress indicator
interface ScrollProgressProps {
  className?: string;
  color?: string;
}

export function ScrollProgress({ className = "", color = "#00f0ff" }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-[2px] origin-left z-50 ${className}`}
      style={{
        scaleX,
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }}
    />
  );
}

// Export the main component
export default VelocityText;
