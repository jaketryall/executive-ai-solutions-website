"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("View");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Check for hoverable elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for data-cursor attribute for custom text
      const cursorText = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      if (cursorText) {
        setIsHovering(true);
        setHoverText(cursorText);
        return;
      }

      // Check for links and buttons
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, [data-hoverable]');
      if (isInteractive) {
        setIsHovering(true);
        setHoverText("View");
      } else {
        setIsHovering(false);
      }
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
  }, [isVisible]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[99999]"
      style={{
        left: 0,
        top: 0,
        x: cursorPosition.x,
        y: cursorPosition.y,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Default cursor dot */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="w-3 h-3 bg-white rounded-full mix-blend-difference" />
      </motion.div>

      {/* Cursor ring (follows slightly behind) */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 0.5,
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="w-8 h-8 border border-white/30 rounded-full mix-blend-difference" />
      </motion.div>

      {/* Expanded cursor on hover */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: isHovering ? 1 : 0.5,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="bg-white text-black text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap shadow-lg">
          {hoverText}
        </div>
      </motion.div>
    </motion.div>
  );
}
