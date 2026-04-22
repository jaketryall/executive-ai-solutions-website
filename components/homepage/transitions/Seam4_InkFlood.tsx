"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Dark ink color — matches Contact section's background.
const INK_COLOR = "#0a0908";

// Tab geometry (% of viewport). The tab is a trapezoidal silhouette —
// wider at its base (where it merges into the card's top edge), tapering
// inward toward a softly rounded top edge. Kept short so it reads as a
// small deliberate gesture, not a full dome.
const TAB_WIDTH_PCT = 14;
const TAB_HEIGHT_PCT = 3.5;

/**
 * SVG path for the trapezoidal tab.
 *
 * viewBox is 0..100 in both axes and `preserveAspectRatio="none"` stretches
 * the path to fit the host div. That means the path coordinates are in
 * "percent of the tab's own box."
 *
 *   (0,100) ────────────────────── (100,100)   ← base (merges into card)
 *           \                    /
 *            \                  /
 *    (24,10)  ╲                ╱  (76,10)      ← sides taper inward
 *              Q 24 0, 34 0           Q 76 0, 66 0  ← rounded top corners
 *             (34,0) ─────── (66,0)               ← top edge
 */
const TAB_PATH = "M 0 100 L 24 10 Q 24 0 34 0 L 66 0 Q 76 0 76 10 L 100 100 Z";

/**
 * Seam 4 — Ink Flood.
 *
 * Scroll-driven transition between <Testimonials /> (cream) and <Contact />
 * (dark). A dark card with rounded top corners and a trapezoidal tab rise
 * together from the bottom of the viewport — like a dashboard drawer being
 * pulled up by its handle.
 *
 * Rendered as two sibling fixed-position elements sharing the ink color:
 *   - Card body: a div. Full width. Animates `top` 100% → 0%. Rounded top corners.
 *   - Tab: a div containing an inline SVG path (for real trapezoidal angles
 *     with softly rounded top corners, which CSS border-radius cannot produce).
 *     Animates in lockstep with the card.
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
  const cleanupRef = useRef<(() => void) | null>(null);

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

      // Beat 1 — Proof card compression (early in the seam range).
      // Cards scaleY 1 → 0.6 and skewX 0 → -4 as the ink tab and card
      // begin rising. Reads as "ink pressing the cards down."
      const proofCards = exitEl.querySelectorAll<HTMLElement>("[data-proof-card]");
      if (proofCards.length > 0) {
        gsap.to(proofCards, {
          scaleY: 0.6,
          skewX: -4,
          transformOrigin: "center bottom",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: exitEl,
            start: "bottom 80%",
            end: "bottom 50%",
            scrub: 0.5,
          },
        });
      }

      // Beat 4 — Form field underline reveal.
      // Each <span data-seam-underline> scaleX 0 → 1, staggered, so underlines
      // draw themselves in left-to-right as Contact enters the viewport.
      const underlines = enterEl.querySelectorAll<HTMLElement>("[data-seam-underline]");
      if (underlines.length > 0) {
        gsap.to(underlines, {
          scaleX: 1,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: enterEl,
            start: "top 70%",
            end: "top 30%",
            scrub: 0.5,
          },
        });
      }

      // Beat 5 — Form labels type in via SplitText chars + mask.
      // Each <label data-seam-label> gets its chars split; chars yPercent
      // 110 → 0 staggered so labels appear to rise into place.
      const labels = enterEl.querySelectorAll<HTMLElement>("[data-seam-label]");
      const labelSplits: InstanceType<typeof SplitText>[] = [];
      labels.forEach((label, i) => {
        const split = SplitText.create(label, { type: "chars", mask: "chars" });
        labelSplits.push(split);
        gsap.set(split.chars, { yPercent: 110 });
        gsap.to(split.chars, {
          yPercent: 0,
          stagger: 0.02,
          ease: "appleOut",
          scrollTrigger: {
            trigger: enterEl,
            start: `top ${60 - i * 4}%`,
            end: `top ${30 - i * 4}%`,
            scrub: 0.5,
          },
        });
      });

      // SplitText wraps the label's text in <span> elements; gsap.context
      // handles the tweens, but SplitText's DOM wrapping needs explicit revert.
      cleanupRef.current = () => labelSplits.forEach((s) => s.revert());
    });

    return () => {
      cleanupRef.current?.();
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* Tab — trapezoidal silhouette rendered as inline SVG so the sides
          can taper inward (impossible with border-radius alone). */}
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
          willChange: "top",
          zIndex: 15,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <path d={TAB_PATH} fill={INK_COLOR} />
        </svg>
      </div>

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
