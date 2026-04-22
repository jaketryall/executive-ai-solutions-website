"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Dark ink color — matches Contact section's background.
const INK_COLOR = "#0a0908";

// Tab geometry (% of viewport). Narrow + tallish gives the tab a clear
// domed silhouette as it peeks above the card's top edge.
const TAB_WIDTH_PCT = 13;
const TAB_HEIGHT_PCT = 6;

/**
 * Seam 4 — Ink Flood.
 *
 * Scroll-driven transition between <Testimonials /> (cream) and <Contact />
 * (dark). A dark card with rounded top corners and a domed tab rises from
 * the bottom of the viewport — like a dashboard drawer pulling up.
 *
 * Rendered as two sibling fixed-position divs sharing the ink color:
 *   - Card body: full width, animates `top` 100% → 0%, rounded top corners.
 *   - Tab: narrow dome centered above the card, animates in lockstep.
 *
 * Two divs (not a single clip-path polygon) because CSS clip-path can't
 * smoothly curve, and the design calls for real rounded corners.
 *
 * Anchors queried at mount:
 *   [data-seam-exit="seam-4"]  — Testimonials section root
 *   [data-seam-enter="seam-4"] — Contact desktop section root
 *
 * See design spec:
 *   docs/superpowers/specs/2026-04-21-gsap-section-transitions-design.md
 */
export default function Seam4InkFlood() {
  const cardRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const exitEl = document.querySelector<HTMLElement>('[data-seam-exit="seam-4"]');
    const enterEl = document.querySelector<HTMLElement>('[data-seam-enter="seam-4"]');
    const cardEl = cardRef.current;
    const tabEl = tabRef.current;
    if (!exitEl || !enterEl || !cardEl || !tabEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: exitEl,
        start: "bottom 80%",
        endTrigger: enterEl,
        end: "top 30%",
        scrub: 0.5,
        onUpdate: (self) => {
          // Card's top edge rises from 100% (below viewport) to 0% (full coverage).
          const cardTop = 100 - self.progress * 100;
          // Tab sits TAB_HEIGHT_PCT above the card's top edge at all times.
          const tabTop = cardTop - TAB_HEIGHT_PCT;
          cardEl.style.top = `${cardTop}%`;
          tabEl.style.top = `${tabTop}%`;
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Tab — domed silhouette rising above the card's top edge.
          border-radius: 999px on top corners = full semicircle dome;
          20px on bottom corners = gentle curve where tab meets card. */}
      <div
        ref={tabRef}
        aria-hidden
        className="pointer-events-none"
        style={{
          position: "fixed",
          top: `${100 - TAB_HEIGHT_PCT}%`,
          left: `${(100 - TAB_WIDTH_PCT) / 2}%`,
          width: `${TAB_WIDTH_PCT}%`,
          height: `${TAB_HEIGHT_PCT}%`,
          backgroundColor: INK_COLOR,
          borderRadius: "999px 999px 20px 20px",
          willChange: "top",
          zIndex: 15,
        }}
      />
      {/* Card body — spans full width, rises from 100% to 0%. Always
          anchored to the viewport bottom via `bottom: 0`, so its visible
          height grows as `top` decreases. Rounded top corners; flat bottom. */}
      <div
        ref={cardRef}
        aria-hidden
        className="pointer-events-none"
        style={{
          position: "fixed",
          top: "100%",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: INK_COLOR,
          borderRadius: "32px 32px 0 0",
          willChange: "top",
          zIndex: 15,
        }}
      />
    </>
  );
}
