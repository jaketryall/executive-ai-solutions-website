"use client";

import { useRef, useLayoutEffect, useEffect, type RefObject } from "react";
import React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * useSplitTextReveal
 *
 * Implements the Lando Norris site's signature split-text animation.
 * Finds all [data-split-line] elements inside the container and animates
 * their [data-split-char] children from translateY(100%) to translateY(0)
 * when scrolled into view.
 *
 * @param containerRef - React ref to the container element
 */
export function useSplitTextReveal(containerRef: RefObject<HTMLElement | null>) {
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll("[data-split-line]")
      );

      lines.forEach((line) => {
        // Apply overflow hidden and clip-path to each line
        gsap.set(line, {
          overflow: "hidden",
          clipPath: "polygon(0 -2%, 0 94%, 100% 94%, 100% -2%)",
        });

        const chars = gsap.utils.toArray<HTMLElement>(
          line.querySelectorAll("[data-split-char]")
        );

        // Set initial state
        gsap.set(chars, { yPercent: 100 });

        // Animate chars when line scrolls into view
        gsap.to(chars, {
          yPercent: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });

      // Add inter-line stagger by offsetting each line's animation
      const allLineGroups = lines.map((line) =>
        gsap.utils.toArray<HTMLElement>(
          line.querySelectorAll("[data-split-char]")
        )
      );

      // Apply a cumulative delay based on line index for grouped text blocks
      let lineIndex = 0;
      lines.forEach((line, i) => {
        const chars = allLineGroups[i];
        if (chars.length === 0) return;

        // Check if this line shares a ScrollTrigger trigger point with the previous
        // (i.e., they are part of the same text block)
        const prevLine = lines[i - 1];
        if (prevLine) {
          const lineRect = line.getBoundingClientRect();
          const prevRect = prevLine.getBoundingClientRect();
          // If lines are close together vertically, treat as same block
          if (Math.abs(lineRect.top - prevRect.bottom) < 100) {
            lineIndex++;
          } else {
            lineIndex = 0;
          }
        }

        if (lineIndex > 0) {
          gsap.to(chars, {
            yPercent: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.02,
            delay: lineIndex * 0.15,
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          });
        }
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef]);
}

/**
 * SplitText
 *
 * Helper component that splits text into lines (by \n) and characters,
 * wrapping each in the appropriate data attributes for useSplitTextReveal.
 *
 * Each line is a block-level element with overflow hidden.
 * Each character is an inline-block span.
 */
interface SplitTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}

export function SplitText({
  text,
  className,
  style,
  as: Tag = "div",
}: SplitTextProps) {
  const lines = text.split("\n");

  return React.createElement(
    Tag,
    { className, style },
    lines.map((line, lineIndex) =>
      React.createElement(
        "span",
        {
          key: lineIndex,
          "data-split-line": "",
          style: {
            display: "block",
            overflow: "hidden",
          },
        },
        line.split("").map((char, charIndex) =>
          React.createElement(
            "span",
            {
              key: `${lineIndex}-${charIndex}`,
              "data-split-char": "",
              style: {
                display: "inline-block",
                willChange: "transform",
              },
            },
            char === " " ? "\u00A0" : char
          )
        )
      )
    )
  );
}
