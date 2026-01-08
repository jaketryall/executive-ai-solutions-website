"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type CursorVariant = "default" | "text" | "link" | "button" | "card";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Smooth spring for outer ring
  const springConfig = { damping: 25, stiffness: 300 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for card elements
      const isCard = target.closest('[data-card], .card-hover, .group');
      if (isCard && target.closest('a')) {
        setVariant("card");
        return;
      }

      // Check for buttons
      const isButton = target.closest('button, [role="button"]');
      if (isButton) {
        setVariant("button");
        return;
      }

      // Check for links
      const isLink = target.closest('a');
      if (isLink) {
        setVariant("link");
        return;
      }

      // Check for inputs
      const isInput = target.closest('input, textarea, select');
      if (isInput) {
        setVariant("text");
        return;
      }

      setVariant("default");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleElementHover);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, cursorX, cursorY]);

  const isExpanded = variant === "link" || variant === "button" || variant === "card";

  return (
    <>
      {/* Large outer ring - hollow circle with invert effect */}
      <motion.div
        className="fixed pointer-events-none z-[99999] hidden md:block"
        style={{
          left: 0,
          top: 0,
          x: ringX,
          y: ringY,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 mix-blend-difference"
          animate={{
            width: isExpanded ? 80 : 40,
            height: isExpanded ? 80 : 40,
            borderColor: variant === "card" ? "#00f0ff" : "#ffffff",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Inner dot - instant follow */}
      <motion.div
        className="fixed pointer-events-none z-[99999] hidden md:block"
        style={{
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
          animate={{
            width: isExpanded ? 8 : 6,
            height: isExpanded ? 8 : 6,
            scale: variant === "text" ? 2 : 1,
          }}
          transition={{ duration: 0.15 }}
        />

        {/* View text for cards - always rendered to avoid reconciliation issues */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold uppercase tracking-wider"
          animate={{
            opacity: variant === "card" ? 1 : 0,
            scale: variant === "card" ? 1 : 0.8
          }}
          transition={{ duration: 0.15 }}
          style={{ mixBlendMode: "difference" }}
        >
          View
        </motion.div>
      </motion.div>

      {/* Hide default cursor */}
      <style jsx global>{`
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
