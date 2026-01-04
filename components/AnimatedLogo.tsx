"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

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
        {/* The actual logo - inline SVG path without box */}
        <svg
          viewBox="280 40 680 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M818.41,570.38c15.05,0,19.94-12.01,19.94-32.84v-44.63c0-14.1-1.3-32.55-19.56-32.55H685.46c-8.01,0-12.19,7.43-14.91,14.56l-59.58,173.38c-2.14,5.61-7.02,7.55-12.88,7.55H402.05c-52,0-94.75-39.61-99.71-90.3V416.41c0-38.13,22.95-70.91,55.79-85.25c-35.32-15.72-56.3-50.36-56.31-86.68v-90.87c0-51.94,42.11-94.05,94.05-94.05c0.98,0,1.95,0.01,2.93,0.05h198.9c7.92,0,14.33,6.42,14.33,14.33c0,1.58-0.26,3.1-0.73,4.52c-7.43,22.16-14.95,44.26-22.55,66.31c-2.58,7.48-10.4,8.88-18.22,8.88c-0.04,0-0.08-0.03-0.12-0.04H425.71c-16.19,2.06-27.84,16.3-26.91,32.35v59.32c0,14.92,12.03,27.03,26.91,27.17c42.5,0.39,84.92,0,127.25,0c9.09,0,17.05,6.72,14.46,14.2c-0.97,2.8-2.05,5.45-3.43,9.44l-19.75,57.05c-3.13,9.04-13.06,10.33-22.03,10.33c-0.57,0-0.5,0-0.98,0h-74.16c-24.87,0-45.04,20.16-45.04,45.04c0,2.87,0,5.62,0,7.91v117.45c-0.09,15.01-3.55,31.7,23.66,31.7h96.52c12.17,0,16.56-6.09,22.04-22.04c0.25-0.72,0.48-1.25,0.64-1.71L703.6,78.46c2.76-8.03,5.58-18.86,14.58-18.86h129.22c52.12,0,94.43,42.03,94.88,94.04v158.93c0,7.91-6.42,14.33-14.33,14.33c-0.38,0-0.75-0.01-1.12-0.04h-72.63c-8.28,0-15.09-6.25-15.99-14.29V185.96c0-20.35-16.5-36.86-36.86-36.86c-6.61,0-17.46,2.65-20.81,12.59c-17.05,50.53-68.21,202.14-68.21,202.14c-0.87,2.57,0.37,6.21,3.08,6.21c1.21,0,1.99,0,3.02,0l119.78,0.04c52.82,0,104.07,39.42,104.07,89.65v105.82c0,52.41-42.48,94.89-94.89,94.89c-0.65,0-1.3-0.01-1.95-0.02h-127c-7.23,0-18.16,0.71-14.19-12.3l21.22-69.45c1.6-5.23,6.53-8.53,11.75-8.29"
            fill="#ffffff"
          />
        </svg>
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
