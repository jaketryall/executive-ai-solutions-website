"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";
import { generateInkPath } from "./_shared/inkPath";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Seam 4 — Ink Flood.
 *
 * Scroll-driven transition between <Testimonials /> (cream) and <Contact />
 * (dark). A wavy ink tide rises from the bottom of the viewport via an
 * animated clip-path on a fixed-position layer.
 *
 * Anchors queried at mount:
 *   [data-seam-exit="seam-4"]  — Testimonials section root
 *   [data-seam-enter="seam-4"] — Contact desktop section root
 *
 * See design spec:
 *   docs/superpowers/specs/2026-04-21-gsap-section-transitions-design.md
 */
export default function Seam4InkFlood() {
  const inkRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const exitEl = document.querySelector<HTMLElement>('[data-seam-exit="seam-4"]');
    const enterEl = document.querySelector<HTMLElement>('[data-seam-enter="seam-4"]');
    const inkEl = inkRef.current;
    if (!exitEl || !enterEl || !inkEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: exitEl,
        start: "bottom 80%",
        endTrigger: enterEl,
        end: "top 30%",
        scrub: 0.5,
        onUpdate: (self) => {
          inkEl.style.clipPath = generateInkPath(self.progress);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={inkRef}
      aria-hidden
      className="pointer-events-none"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#0a0908",
        clipPath: generateInkPath(0),
        willChange: "clip-path",
        zIndex: 15,
      }}
    />
  );
}
