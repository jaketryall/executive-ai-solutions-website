"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showGlow?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export default function AnimatedLogo({
  size = "lg",
  showGlow = true,
  autoPlay = true,
  className = "",
}: AnimatedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  const sizeMap = {
    sm: { width: 80, height: 45 },
    md: { width: 160, height: 90 },
    lg: { width: 320, height: 180 },
    xl: { width: 640, height: 360 },
  };

  const { width, height } = sizeMap[size];

  useEffect(() => {
    if (isInView && autoPlay) {
      controls.start("visible");
    }
  }, [isInView, autoPlay, controls]);

  // Floating particles around the logo
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = Math.max(width, height) * 0.6;
    return {
      x: Math.round(Math.cos(angle) * radius),
      y: Math.round(Math.sin(angle) * radius),
      delay: i * 0.1,
      size: 2 + Math.random() * 4,
    };
  });

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow background */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        >
          {/* Primary glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: width * 1.5,
              height: height * 1.5,
              background: "radial-gradient(circle, rgba(154, 123, 60, 0.3) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
            animate={{
              scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1],
              opacity: isHovered ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Secondary pulse glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: width * 2,
              height: height * 2,
              background: "radial-gradient(circle, rgba(184, 154, 94, 0.15) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.div>
      )}

      {/* Floating particles */}
      {showGlow && isInView && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 rounded-full bg-[#b89a5e]"
              style={{
                width: particle.size,
                height: particle.size,
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: [0, particle.x * 0.5, particle.x, particle.x * 0.5, 0],
                y: [0, particle.y * 0.5, particle.y, particle.y * 0.5, 0],
                opacity: [0, 0.8, 0.4, 0.8, 0],
                scale: [0, 1, 0.6, 1, 0],
              }}
              transition={{
                duration: 6,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Rotating ring */}
      {showGlow && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: width * 1.3,
            height: height * 1.3,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: "blur(0.5px)" }}
          >
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b89a5e" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#9a7b3c" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#b89a5e" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <ellipse
              cx="50"
              cy="50"
              rx="48"
              ry="28"
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="0.5"
              strokeDasharray="8 4"
            />
          </svg>
        </motion.div>
      )}

      {/* Logo container with effects */}
      <motion.div
        className="relative"
        style={{ width, height }}
        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
        animate={
          isInView
            ? {
                opacity: 1,
                scale: 1,
                rotateY: 0,
              }
            : { opacity: 0, scale: 0.8, rotateY: -30 }
        }
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          scale: 1.05,
          rotateY: 5,
          rotateX: -5,
        }}
      >
        {/* Metallic shimmer overlay */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-lg"
          style={{
            background: `linear-gradient(
              105deg,
              transparent 40%,
              rgba(255, 255, 255, 0.1) 45%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0.1) 55%,
              transparent 60%
            )`,
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: isHovered
              ? ["200% 0%", "-200% 0%"]
              : ["200% 0%", "-200% 0%"],
          }}
          transition={{
            duration: isHovered ? 1 : 3,
            repeat: Infinity,
            repeatDelay: isHovered ? 0 : 2,
            ease: "easeInOut",
          }}
        />

        {/* The actual logo image */}
        <Image
          src="/Executive Ai Solutions logo with shadow.svg"
          alt="Executive AI Solutions"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />

        {/* Bronze tint overlay for metallic effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background: "linear-gradient(135deg, rgba(184, 154, 94, 0.1) 0%, transparent 50%, rgba(92, 69, 33, 0.1) 100%)",
          }}
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Bottom reflection */}
      {showGlow && (
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2"
          style={{
            width: width * 0.8,
            height: 4,
            background: "linear-gradient(90deg, transparent, rgba(184, 154, 94, 0.4), transparent)",
            filter: "blur(4px)",
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      )}
    </div>
  );
}
