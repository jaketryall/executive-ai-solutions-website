"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

const DESKTOP_MIN_WIDTH_PX = 768;
const ANCHOR_WAIT_MAX_FRAMES = 60;

/**
 * Seam 5 — Contact → Footer.
 *
 * Both sections are dark; this is the quietest seam on the page. The
 * three footer columns stagger in as the footer approaches the
 * viewport. A small but satisfying close.
 *
 * Anchors:
 *   [data-seam-enter="seam-5"]  — Footer root
 *   [data-seam-footer-grid]     — the 3-column footer grid
 */
export default function Seam5ContactToFooter() {
  useEffect(() => {
    const applyFinal = () => {
      const grid = document.querySelector<HTMLElement>("[data-seam-footer-grid]");
      if (!grid) return;
      const cols = grid.children;
      Array.from(cols).forEach((col) => {
        (col as HTMLElement).style.opacity = "1";
        (col as HTMLElement).style.transform = "translateY(0)";
      });
    };
    if (prefersReducedMotion()) return applyFinal();
    if (window.innerWidth < DESKTOP_MIN_WIDTH_PX) return applyFinal();

    let cancelled = false;
    let rafId = 0;
    let frames = 0;
    let ctx: gsap.Context | null = null;

    const tryStart = () => {
      if (cancelled) return;
      const enterEl = document.querySelector<HTMLElement>('[data-seam-enter="seam-5"]');
      const grid = document.querySelector<HTMLElement>("[data-seam-footer-grid]");
      if (!enterEl || !grid) {
        if (frames++ < ANCHOR_WAIT_MAX_FRAMES) rafId = requestAnimationFrame(tryStart);
        return;
      }

      ctx = gsap.context(() => {
        const cols = Array.from(grid.children) as HTMLElement[];
        gsap.fromTo(
          cols,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: enterEl,
              start: "top 90%",
              end: "top 60%",
              scrub: 0.5,
            },
          }
        );
      });
    };

    tryStart();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, []);

  return null;
}
