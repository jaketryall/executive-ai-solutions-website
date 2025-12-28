"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

type CursorVariant = "default" | "text" | "link" | "button" | "card" | "drag";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [hoverText, setHoverText] = useState("View");

  // Direct motion values - no spring, instant response
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Enhanced hover detection
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for data-cursor attribute for custom text
      const cursorElement = target.closest('[data-cursor]');
      if (cursorElement) {
        const cursorText = cursorElement.getAttribute('data-cursor');
        const cursorType = cursorElement.getAttribute('data-cursor-type') as CursorVariant | null;
        setHoverText(cursorText || "View");
        setVariant(cursorType || "link");
        return;
      }

      // Check for card elements
      const isCard = target.closest('[data-card], .card-hover');
      if (isCard) {
        setVariant("card");
        setHoverText("Explore");
        return;
      }

      // Check for draggable elements
      const isDraggable = target.closest('[data-draggable]');
      if (isDraggable) {
        setVariant("drag");
        setHoverText("Drag");
        return;
      }

      // Check for buttons
      const isButton = target.closest('button, [role="button"], .btn');
      if (isButton) {
        const buttonText = isButton.getAttribute('data-cursor') || "Click";
        setHoverText(buttonText);
        setVariant("button");
        return;
      }

      // Check for links
      const isLink = target.closest('a');
      if (isLink) {
        const linkText = isLink.getAttribute('data-cursor') || "View";
        setHoverText(linkText);
        setVariant("link");
        return;
      }

      // Check for inputs
      const isInput = target.closest('input, textarea, select');
      if (isInput) {
        setVariant("text");
        return;
      }

      // Default state
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

  const isExpanded = variant === "link" || variant === "button" || variant === "card" || variant === "drag";
  const showText = variant === "link" || variant === "button" || variant === "card" || variant === "drag";

  // Variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case "card":
        return "bg-[#2563eb] text-white";
      case "drag":
        return "bg-zinc-900 text-white border border-zinc-700";
      case "button":
        return "bg-white text-black";
      default:
        return "bg-white text-black";
    }
  };

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[99999]"
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
        {/* Default cursor dot */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isExpanded ? 0 : 1,
            opacity: isExpanded ? 0 : 1,
          }}
          transition={{ duration: 0.05 }}
        >
          <div className="w-2.5 h-2.5 bg-white rounded-full mix-blend-difference" />
        </motion.div>

        {/* Expanded cursor with text */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: showText ? 1 : 0.5,
            opacity: showText ? 1 : 0,
          }}
          transition={{ duration: 0.05 }}
        >
          <div
            className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg ${getVariantStyles()}`}
          >
            {hoverText}
          </div>
        </motion.div>
      </motion.div>

    </>
  );
}
