"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { generateInkPath } from "./_shared/inkPath";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Seam 4 — Ink Flood.
 *
 * Sits between <Testimonials /> and <Contact /> in the homepage. Renders a
 * single fixed-position ink layer whose `clip-path` animates on scroll to
 * reveal a wavy dark tide rising over the cream page, carrying the user
 * from Testimonials into Contact.
 *
 * See design spec: docs/superpowers/specs/2026-04-21-gsap-section-transitions-design.md
 */
export default function Seam4InkFlood() {
  const inkRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    // Intentionally empty — animation wiring lands in Task 5.
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
        zIndex: 15,
      }}
    />
  );
}
