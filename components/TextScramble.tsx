"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "framer-motion";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  scrambleOnHover?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const CHARS = "!<>-_\\/[]{}—=+*^?#";

export default function TextScramble({
  text,
  className = "",
  delay = 0,
  speed = 30,
  scrambleOnHover = false,
  as: Component = "span",
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState("");
  const [isScrambling, setIsScrambling] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isScrambling]);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const timer = setTimeout(() => {
        scramble();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay, scramble]);

  const handleMouseEnter = () => {
    if (scrambleOnHover && !isScrambling) {
      scramble();
    }
  };

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ minHeight: "1em" }}
    >
      {displayText || (isInView ? "" : text)}
    </Component>
  );
}
