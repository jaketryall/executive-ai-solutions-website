"use client";

import { useRef, useState, useEffect, useLayoutEffect, ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Reveal types for different animation styles
type RevealType =
  | "blur-up"
  | "clip-left"
  | "clip-right"
  | "clip-up"
  | "clip-down"
  | "clip-center"
  | "scale-fade"
  | "parallax"
  | "mask-wipe"
  | "glitch";

interface ImageRevealProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  reveal?: RevealType;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  parallaxSpeed?: number;
  priority?: boolean;
}

// Blur-up reveal with progressive loading feel
function BlurUpReveal({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  delay = 0,
  duration = 1.2,
  once = true,
  threshold = 0.3,
  priority = false,
}: Omit<ImageRevealProps, "reveal" | "containerClassName" | "parallaxSpeed">) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ filter: "blur(20px)", scale: 1.1 }}
      animate={
        isInView && isLoaded
          ? { filter: "blur(0px)", scale: 1 }
          : { filter: "blur(20px)", scale: 1.1 }
      }
      transition={{
        duration,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className="object-cover"
        onLoad={() => setIsLoaded(true)}
        priority={priority}
      />
    </motion.div>
  );
}

// Clip-path reveal animations
function ClipReveal({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  delay = 0,
  duration = 1,
  once = true,
  threshold = 0.3,
  direction = "left",
  priority = false,
}: Omit<ImageRevealProps, "reveal" | "containerClassName" | "parallaxSpeed"> & {
  direction: "left" | "right" | "up" | "down" | "center";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getClipPath = () => {
    switch (direction) {
      case "left":
        return {
          hidden: "inset(0 100% 0 0)",
          visible: "inset(0 0% 0 0)",
        };
      case "right":
        return {
          hidden: "inset(0 0 0 100%)",
          visible: "inset(0 0 0 0%)",
        };
      case "up":
        return {
          hidden: "inset(100% 0 0 0)",
          visible: "inset(0% 0 0 0)",
        };
      case "down":
        return {
          hidden: "inset(0 0 100% 0)",
          visible: "inset(0 0 0% 0)",
        };
      case "center":
        return {
          hidden: "inset(50% 50% 50% 50%)",
          visible: "inset(0% 0% 0% 0%)",
        };
      default:
        return {
          hidden: "inset(0 100% 0 0)",
          visible: "inset(0 0% 0 0)",
        };
    }
  };

  const clipPath = getClipPath();

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="relative w-full h-full"
        initial={{ clipPath: clipPath.hidden }}
        animate={isInView ? { clipPath: clipPath.visible } : { clipPath: clipPath.hidden }}
        transition={{
          duration,
          delay,
          ease: [0.645, 0.045, 0.355, 1],
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className="object-cover"
          priority={priority}
        />
      </motion.div>
    </div>
  );
}

// Scale fade reveal
function ScaleFadeReveal({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.3,
  priority = false,
}: Omit<ImageRevealProps, "reveal" | "containerClassName" | "parallaxSpeed">) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{
          duration,
          delay,
          ease: [0.215, 0.61, 0.355, 1],
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className="object-cover"
          priority={priority}
        />
      </motion.div>
    </div>
  );
}

// Parallax image with scroll-linked movement
function ParallaxReveal({
  src,
  alt,
  width,
  height,
  fill = true,
  className = "",
  parallaxSpeed = 0.2,
  priority = false,
}: Omit<ImageRevealProps, "reveal" | "containerClassName" | "delay" | "duration" | "once" | "threshold">) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`${parallaxSpeed * -100}%`, `${parallaxSpeed * 100}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="relative w-full h-[120%] -top-[10%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className="object-cover"
          priority={priority}
        />
      </motion.div>
    </div>
  );
}

// Mask wipe with gradient reveal
function MaskWipeReveal({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  delay = 0,
  duration = 1.2,
  once = true,
  threshold = 0.3,
  priority = false,
}: Omit<ImageRevealProps, "reveal" | "containerClassName" | "parallaxSpeed">) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Gradient mask overlay */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(90deg, transparent 0%, black 50%, black 100%)",
        }}
        initial={{ x: "-100%" }}
        animate={isInView ? { x: "100%" } : { x: "-100%" }}
        transition={{
          duration,
          delay,
          ease: [0.645, 0.045, 0.355, 1],
        }}
      />

      {/* Cyan accent line */}
      <motion.div
        className="absolute inset-y-0 w-[2px] z-20"
        style={{
          background: "linear-gradient(180deg, transparent, #00f0ff, transparent)",
          boxShadow: "0 0 20px #00f0ff",
        }}
        initial={{ left: "0%" }}
        animate={isInView ? { left: "100%" } : { left: "0%" }}
        transition={{
          duration: duration * 0.8,
          delay: delay + 0.1,
          ease: [0.645, 0.045, 0.355, 1],
        }}
      />

      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: duration * 0.5,
          delay: delay + duration * 0.3,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className="object-cover"
          priority={priority}
        />
      </motion.div>
    </div>
  );
}

// Glitch reveal effect
function GlitchReveal({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  delay = 0,
  duration = 0.8,
  once = true,
  threshold = 0.3,
  priority = false,
}: Omit<ImageRevealProps, "reveal" | "containerClassName" | "parallaxSpeed">) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const [glitchPhase, setGlitchPhase] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      // Quick glitch sequence
      let phase = 0;
      const interval = setInterval(() => {
        phase++;
        setGlitchPhase(phase);
        if (phase >= 6) {
          clearInterval(interval);
          setGlitchPhase(0);
        }
      }, 60);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, delay]);

  const getGlitchTransform = () => {
    const transforms = [
      "translate(0, 0)",
      "translate(5px, -3px)",
      "translate(-5px, 2px)",
      "translate(3px, 5px)",
      "translate(-3px, -5px)",
      "translate(2px, 1px)",
      "translate(0, 0)",
    ];
    return transforms[glitchPhase] || "translate(0, 0)";
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* RGB split layers during glitch */}
      {glitchPhase > 0 && glitchPhase < 6 && (
        <>
          <motion.div
            className="absolute inset-0 mix-blend-screen opacity-70"
            style={{
              transform: "translate(-3px, 0)",
              filter: "url(#redChannel)",
            }}
          >
            <Image
              src={src}
              alt=""
              width={width}
              height={height}
              fill={fill}
              className="object-cover"
              style={{ filter: "grayscale(1) brightness(1.5)" }}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 mix-blend-screen opacity-70"
            style={{
              transform: "translate(3px, 0)",
              filter: "url(#blueChannel)",
            }}
          >
            <Image
              src={src}
              alt=""
              width={width}
              height={height}
              fill={fill}
              className="object-cover"
              style={{ filter: "grayscale(1) brightness(1.5)" }}
            />
          </motion.div>
        </>
      )}

      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
        animate={
          isInView
            ? { opacity: 1, clipPath: "inset(0 0 0% 0)", transform: getGlitchTransform() }
            : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
        }
        transition={{
          duration: glitchPhase > 0 ? 0.05 : duration,
          delay: glitchPhase > 0 ? 0 : delay,
          ease: glitchPhase > 0 ? "linear" : [0.645, 0.045, 0.355, 1],
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          className="object-cover"
          priority={priority}
        />
      </motion.div>

      {/* Scanline effect during glitch */}
      {glitchPhase > 0 && glitchPhase < 6 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
          }}
        />
      )}
    </div>
  );
}

// Main ImageReveal component - routes to correct implementation
export default function ImageReveal({
  src,
  alt,
  width,
  height,
  fill,
  className = "",
  containerClassName = "",
  reveal = "blur-up",
  delay = 0,
  duration = 1,
  once = true,
  threshold = 0.3,
  parallaxSpeed = 0.2,
  priority = false,
}: ImageRevealProps) {
  const commonProps = {
    src,
    alt,
    width,
    height,
    fill,
    className,
    delay,
    duration,
    once,
    threshold,
    priority,
  };

  const renderReveal = () => {
    switch (reveal) {
      case "blur-up":
        return <BlurUpReveal {...commonProps} />;

      case "clip-left":
        return <ClipReveal {...commonProps} direction="left" />;

      case "clip-right":
        return <ClipReveal {...commonProps} direction="right" />;

      case "clip-up":
        return <ClipReveal {...commonProps} direction="up" />;

      case "clip-down":
        return <ClipReveal {...commonProps} direction="down" />;

      case "clip-center":
        return <ClipReveal {...commonProps} direction="center" />;

      case "scale-fade":
        return <ScaleFadeReveal {...commonProps} />;

      case "parallax":
        return (
          <ParallaxReveal
            src={src}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            className={className}
            parallaxSpeed={parallaxSpeed}
            priority={priority}
          />
        );

      case "mask-wipe":
        return <MaskWipeReveal {...commonProps} />;

      case "glitch":
        return <GlitchReveal {...commonProps} />;

      default:
        return <BlurUpReveal {...commonProps} />;
    }
  };

  return <div className={containerClassName}>{renderReveal()}</div>;
}

// Export individual components for direct use
export {
  BlurUpReveal,
  ClipReveal,
  ScaleFadeReveal,
  ParallaxReveal,
  MaskWipeReveal,
  GlitchReveal,
};
