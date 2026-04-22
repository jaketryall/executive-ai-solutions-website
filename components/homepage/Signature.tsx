"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger, DrawSVGPlugin } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Hand-styled "—Jake" path. Approximate scribble — refine later if a more
// hand-written feel is desired. The SVG viewBox is 100x40 so the path
// stays proportionally aligned regardless of the rendered width.
const SIGNATURE_PATH = "M5 25 Q 12 18 18 22 T 30 24 Q 38 16 44 22 L 52 18 Q 60 26 68 20 M 75 14 L 95 30 M 75 28 L 95 14";

export default function Signature({ width = 140 }: { width?: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!pathRef.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: groupRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (reduce) {
            gsap.set(pathRef.current, { drawSVG: "0% 100%" });
            return;
          }
          gsap.fromTo(
            pathRef.current,
            { drawSVG: "0% 0%" },
            { drawSVG: "0% 100%", duration: 1.2, ease: "power2.inOut" },
          );
        },
      });
    }, groupRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={groupRef}
      viewBox="0 0 100 40"
      style={{ width, height: width * 0.4, overflow: "visible" }}
      aria-label="Jake signature"
    >
      <path
        ref={pathRef}
        d={SIGNATURE_PATH}
        fill="none"
        stroke="#1a1816"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
