"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface ShineButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
}

export default function ShineButton({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: ShineButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  // Create a rounded rect path
  const createRoundedRectPath = (w: number, h: number, r: number) => {
    if (w === 0 || h === 0) return "";
    const radius = Math.min(r, w / 2, h / 2);
    return `
      M ${radius} 0
      L ${w - radius} 0
      Q ${w} 0 ${w} ${radius}
      L ${w} ${h - radius}
      Q ${w} ${h} ${w - radius} ${h}
      L ${radius} ${h}
      Q 0 ${h} 0 ${h - radius}
      L 0 ${radius}
      Q 0 0 ${radius} 0
      Z
    `;
  };

  const path = createRoundedRectPath(dimensions.width, dimensions.height, dimensions.height / 2);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated shine line traveling around the border */}
      {dimensions.width > 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id={`shineGrad-${dimensions.width}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="35%" stopColor="rgba(255, 200, 150, 0.5)" />
              <stop offset="50%" stopColor="rgba(255, 220, 180, 1)" />
              <stop offset="65%" stopColor="rgba(255, 200, 150, 0.5)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="shineGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Static border */}
          <path
            d={path}
            fill="none"
            stroke="rgba(63, 63, 70, 0.3)"
            strokeWidth="1"
          />

          {/* Animated shine segment */}
          <motion.path
            d={path}
            fill="none"
            stroke={`url(#shineGrad-${dimensions.width})`}
            strokeWidth="2"
            filter="url(#shineGlow)"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{
              strokeDashoffset: isHovered ? [0, -1000] : 0,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{
              strokeDashoffset: {
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: { duration: 0.2 },
            }}
            style={{
              strokeDasharray: "60 1000",
            }}
          />
        </svg>
      )}

      {/* Button background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: variant === "primary" ? "#ffffff" : "#9a7b3c",
        }}
        animate={{
          backgroundColor: isHovered
            ? variant === "primary" ? "#9a7b3c" : "#7d6230"
            : variant === "primary" ? "#ffffff" : "#9a7b3c",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* The actual link */}
      <Link
        href={href}
        className={`relative z-10 inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full transition-colors duration-300 ${
          variant === "primary"
            ? isHovered ? "text-white" : "text-black"
            : "text-white"
        }`}
        {...linkProps}
      >
        {children}
      </Link>
    </div>
  );
}
