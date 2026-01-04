"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// The logo path from Executive AI Solutions
const LOGO_PATH = "M818.41,570.38c15.05,0,19.94-12.01,19.94-32.84v-44.63c0-14.1-1.3-32.55-19.56-32.55H685.46c-8.01,0-12.19,7.43-14.91,14.56l-59.58,173.38c-2.14,5.61-7.02,7.55-12.88,7.55H402.05c-52,0-94.75-39.61-99.71-90.3V416.41c0-38.13,22.95-70.91,55.79-85.25c-35.32-15.72-56.3-50.36-56.31-86.68v-90.87c0-51.94,42.11-94.05,94.05-94.05c0.98,0,1.95,0.01,2.93,0.05h198.9c7.92,0,14.33,6.42,14.33,14.33c0,1.58-0.26,3.1-0.73,4.52c-7.43,22.16-14.95,44.26-22.55,66.31c-2.58,7.48-10.4,8.88-18.22,8.88c-0.04,0-0.08-0.03-0.12-0.04H425.71c-16.19,2.06-27.84,16.3-26.91,32.35v59.32c0,14.92,12.03,27.03,26.91,27.17c42.5,0.39,84.92,0,127.25,0c9.09,0,17.05,6.72,14.46,14.2c-0.97,2.8-2.05,5.45-3.43,9.44l-19.75,57.05c-3.13,9.04-13.06,10.33-22.03,10.33c-0.57,0-0.5,0-0.98,0h-74.16c-24.87,0-45.04,20.16-45.04,45.04c0,2.87,0,5.62,0,7.91v117.45c-0.09,15.01-3.55,31.7,23.66,31.7h96.52c12.17,0,16.56-6.09,22.04-22.04c0.25-0.72,0.48-1.25,0.64-1.71L703.6,78.46c2.76-8.03,5.58-18.86,14.58-18.86h129.22c52.12,0,94.43,42.03,94.88,94.04v158.93c0,7.91-6.42,14.33-14.33,14.33c-0.38,0-0.75-0.01-1.12-0.04h-72.63c-8.28,0-15.09-6.25-15.99-14.29V185.96c0-20.35-16.5-36.86-36.86-36.86c-6.61,0-17.46,2.65-20.81,12.59c-17.05,50.53-68.21,202.14-68.21,202.14c-0.87,2.57,0.37,6.21,3.08,6.21c1.21,0,1.99,0,3.02,0l119.78,0.04c52.82,0,104.07,39.42,104.07,89.65v105.82c0,52.41-42.48,94.89-94.89,94.89c-0.65,0-1.3-0.01-1.95-0.02h-127c-7.23,0-18.16,0.71-14.19-12.3l21.22-69.45c1.6-5.23,6.53-8.53,11.75-8.29";

interface AnimatedLogoProps {
  className?: string;
  width?: number;
  height?: number;
  drawDuration?: number;
  delay?: number;
}

export default function AnimatedLogo({
  className = "",
  width = 200,
  height = 120,
  drawDuration = 2.5,
  delay = 0.3,
}: AnimatedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [isDrawn, setIsDrawn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsDrawn(true);
      }, (delay + drawDuration) * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay, drawDuration]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative cursor-pointer ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <svg
        viewBox="280 40 680 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Background glow - pulses subtly */}
        <motion.path
          d={LOGO_PATH}
          fill="none"
          stroke="#b6bac5"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "blur(25px)" }}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={isInView ? {
            opacity: isHovered ? 0.4 : 0.15,
            pathLength: 1
          } : {}}
          transition={{
            pathLength: { duration: drawDuration, delay, ease: [0.65, 0, 0.35, 1] },
            opacity: { duration: 0.3 },
          }}
        />

        {/* Secondary glow layer */}
        <motion.path
          d={LOGO_PATH}
          fill="none"
          stroke="#b6bac5"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "blur(10px)" }}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={isInView ? {
            opacity: isHovered ? 0.5 : 0.25,
            pathLength: 1
          } : {}}
          transition={{
            pathLength: { duration: drawDuration, delay: delay + 0.1, ease: [0.65, 0, 0.35, 1] },
            opacity: { duration: 0.3 },
          }}
        />

        {/* Main stroke - draws in with gradient */}
        <motion.path
          d={LOGO_PATH}
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{
            pathLength: { duration: drawDuration, delay, ease: [0.65, 0, 0.35, 1] },
            opacity: { duration: 0.3, delay },
          }}
        />

        {/* Fill - fades in after stroke completes */}
        <motion.path
          d={LOGO_PATH}
          fill="url(#logoFillGradient)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: delay + drawDuration - 0.2,
            ease: "easeOut",
          }}
        />

        {/* Shimmer effect on hover */}
        {isDrawn && (
          <motion.path
            d={LOGO_PATH}
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isHovered ? {
              pathLength: [0, 1],
              opacity: [0, 0.8, 0],
            } : { pathLength: 0, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Gradients */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b6bac5" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b6bac5" />
          </linearGradient>
          <linearGradient id="logoFillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b6bac5" />
            <stop offset="100%" stopColor="#8a8f9e" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating particles on hover */}
      {isHovered && isDrawn && (
        <>
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 60;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#b6bac5]"
                style={{
                  width: 3,
                  height: 3,
                  left: "50%",
                  top: "50%",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.cos(angle) * radius,
                  y: Math.sin(angle) * radius,
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.08,
                  repeat: Infinity,
                  repeatDelay: 0.3,
                }}
              />
            );
          })}
        </>
      )}
    </motion.div>
  );
}
