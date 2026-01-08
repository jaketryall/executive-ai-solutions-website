"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// The actual logo path from the SVG file
const LOGO_PATH = "M397.53,408.07c11.3,0,14.98-9.02,14.98-24.68v-33.53c0-10.6-0.98-24.45-14.7-24.45H297.64c-6.02,0-9.16,5.59-11.2,10.94l-44.77,130.27c-1.61,4.22-5.27,5.67-9.68,5.67H84.69c-39.07,0-71.19-29.76-74.92-67.85V292.38c0-28.65,17.24-53.28,41.92-64.05c-26.54-11.81-42.3-37.84-42.31-65.13V94.93c0-39.03,31.64-70.66,70.66-70.66c0.74,0,1.47,0.01,2.2,0.03h149.44c5.95,0,10.77,4.82,10.77,10.77c0,1.19-0.19,2.33-0.55,3.4c-5.58,16.65-11.23,33.26-16.94,49.82c-1.94,5.62-7.81,6.67-13.69,6.67c-0.03,0-0.06-0.02-0.09-0.03H102.47c-12.16,1.54-20.92,12.25-20.22,24.31v44.57c0,11.21,9.04,20.31,20.22,20.41c31.94,0.29,63.81,0,95.61,0c6.83,0,12.81,5.05,10.87,10.67c-0.73,2.1-1.54,4.09-2.58,7.09l-14.84,42.87c-2.35,6.79-9.81,7.76-16.55,7.76c-0.43,0-0.38,0-0.73,0h-55.72c-18.69,0-33.84,15.15-33.84,33.84c0,2.15,0,4.22,0,5.95v88.25c-0.07,11.28-2.66,23.82,17.78,23.82h72.52c9.14,0,12.45-4.57,16.56-16.56c0.19-0.54,0.36-0.94,0.48-1.28L311.27,38.46c2.07-6.04,4.19-14.17,10.96-14.17h97.09c39.16,0,70.95,31.58,71.29,70.66v119.41c0,5.95-4.82,10.77-10.77,10.77c-0.28,0-0.56-0.01-0.84-0.03h-54.57c-6.22,0-11.34-4.7-12.01-10.73v-95.14c0-15.29-12.4-27.69-27.69-27.69c-4.97,0-13.12,1.99-15.63,9.46c-12.81,37.97-51.25,151.88-51.25,151.88c-0.65,1.93,0.28,4.67,2.31,4.67c0.91,0,1.5,0,2.27,0l89.99,0.03c39.69,0,78.19,29.62,78.19,67.36v79.51c0,39.38-31.92,71.3-71.3,71.3c-0.49,0-0.98,0-1.47-0.02h-95.43c-5.43,0-13.65,0.53-10.66-9.24l15.94-52.18c1.2-3.93,4.9-6.41,8.83-6.23H397.53z";

export default function MaintenancePage() {
  const [mounted, setMounted] = useState(false);
  const [drawComplete, setDrawComplete] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Mark drawing complete after animation finishes
    const timer = setTimeout(() => setDrawComplete(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 bg-[#0a0908] flex items-center justify-center"
      style={{ overflow: "hidden" }}
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255, 200, 150, 0.08) 0%, transparent 50%)`,
        }}
      />

      {/* Infinite scrolling background text */}
      <div className="absolute inset-0 flex items-center pointer-events-none" style={{ overflow: "hidden" }}>
        <div
          className="flex whitespace-nowrap will-change-transform"
          style={{
            animation: "marquee-left 25s linear infinite",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-[12vw] md:text-[10vw] font-black select-none mx-8"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px rgba(255, 200, 150, 0.05)",
              }}
            >
              EXECUTIVE AI SOLUTIONS
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        {/* Logo with animated path drawing effect */}
        <motion.div
          className="relative mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Soft glow behind logo */}
          <motion.div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, rgba(255, 200, 150, 0.2) 0%, transparent 70%)`,
              filter: "blur(80px)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: drawComplete ? 0.6 : 0.2,
              scale: drawComplete ? 1 : 0.9,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
          />

          {/* The animated SVG logo */}
          <svg
            viewBox="0 0 500 500"
            className="w-[280px] md:w-[400px] lg:w-[450px] h-auto"
            style={{
              filter: drawComplete ? "drop-shadow(0 0 30px rgba(255, 200, 150, 0.2))" : "none",
            }}
          >
            {/* Drawing stroke animation */}
            <motion.path
              d={LOGO_PATH}
              stroke="rgba(255, 200, 150, 1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1 }}
              transition={{
                pathLength: {
                  duration: 3.5,
                  ease: [0.65, 0, 0.35, 1],
                },
              }}
            />

            {/* Fill that fades in after stroke completes */}
            <motion.path
              d={LOGO_PATH}
              fill="rgba(255, 200, 150, 1)"
              stroke="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: drawComplete ? 1 : 0 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
            />
          </svg>
        </motion.div>

        {/* Undergoing Maintenance text */}
        <motion.p
          className="text-xs uppercase tracking-[0.3em] mb-4"
          style={{ color: "rgba(255, 200, 150, 0.6)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: drawComplete ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          Undergoing Maintenance
        </motion.p>

        {/* Coming Soon text */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center tracking-[-0.02em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: drawComplete ? 1 : 0, y: drawComplete ? 0 : 20 }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          COMING SOON
        </motion.h1>

        {/* Subtle tagline */}
        <motion.p
          className="mt-6 text-white/40 text-base md:text-lg tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: drawComplete ? 1 : 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Something extraordinary is on the way
        </motion.p>
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%)",
        }}
      />
    </div>
  );
}
