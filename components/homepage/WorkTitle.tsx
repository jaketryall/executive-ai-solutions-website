"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const text = "SELECTED WORK";

export default function WorkTitle() {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll("[data-char]")
      );

      gsap.fromTo(
        chars,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0,
          ease: "power3.out",
          stagger: 0.025,
          scrollTrigger: {
            trigger: container,
            start: "top 30%",
            end: "top 0%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      data-bg="cream"
      className="hidden md:flex items-center justify-center"
      style={{ height: "70vh" }}
    >
      <div
        className="font-black tracking-tight text-center"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "clamp(3rem, 8vw, 9rem)",
          lineHeight: "83%",
          letterSpacing: "-0.03em",
          whiteSpace: "nowrap" as const,
          color: "#1a1714",
        }}
      >
        <span style={{ display: "block", overflow: "hidden", clipPath: "polygon(0 -5%, 0 105%, 100% 105%, 100% -5%)" }}>
          {text.split("").map((char, i) => (
            <span
              key={i}
              data-char
              style={{
                display: "inline-block",
                willChange: "transform",
                opacity: 0,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
