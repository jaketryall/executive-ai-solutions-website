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

// Desktop-only threshold — matches Contact's `hidden md:block` breakpoint.
// Below this width the enter-anchor section is `display: none`, so scroll
// triggers would measure a zero-height target and the seam would collapse.
const DESKTOP_MIN_WIDTH_PX = 768;

// Dynamic imports mean <Contact /> may not have mounted by the time this
// component's effect runs. Poll for the anchor via requestAnimationFrame
// up to this many frames before giving up (roughly 1s at 60fps).
const ANCHOR_WAIT_MAX_FRAMES = 60;

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
 * Desktop only: the [data-seam-enter] anchor lives inside a `hidden md:block`
 * section. On mobile the seam no-ops (off-screen at rest, no listeners).
 *
 * See design spec:
 *   docs/superpowers/specs/2026-04-21-gsap-section-transitions-design.md
 */
export default function Seam4InkFlood() {
  const cardRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    // Apply off-screen rest state so the tab/card don't flash on mount
    // (before the ScrollTrigger's first onUpdate) and so reduced-motion
    // and mobile viewers see nothing stray.
    const parkOffscreen = () => {
      if (tabRef.current) tabRef.current.style.top = "-10%";
      if (cardRef.current) cardRef.current.style.top = "100%";
    };

    // Reduced motion: park the shapes off-screen and reveal the form
    // underlines (which otherwise stay invisible at scaleX(0)).
    if (prefersReducedMotion()) {
      parkOffscreen();
      const enterEl = document.querySelector<HTMLElement>(
        '[data-seam-enter="seam-4"]'
      );
      if (enterEl) {
        const underlines = enterEl.querySelectorAll<HTMLElement>(
          "[data-seam-underline]"
        );
        underlines.forEach((u) => {
          u.style.transform = "scaleX(1)";
        });
      }
      return;
    }

    // Mobile: the enter-anchor section is display:none below md, which
    // would collapse the scroll range. Park the shapes and bail.
    if (window.innerWidth < DESKTOP_MIN_WIDTH_PX) {
      parkOffscreen();
      return;
    }

    // Closure-scoped cleanup handles. Set only if the anchor-wait loop
    // successfully resolves both anchors before ANCHOR_WAIT_MAX_FRAMES.
    let cancelled = false;
    let rafId = 0;
    let frames = 0;
    let ctx: gsap.Context | null = null;
    const labelSplits: InstanceType<typeof SplitText>[] = [];

    // Anchor-wait loop. Contact and Seam4InkFlood are both dynamically
    // imported; Seam4's chunk can resolve before Contact's does. We retry
    // the anchor query per-frame until both exist or we time out.
    const tryStart = () => {
      if (cancelled) return;
      const exitEl = document.querySelector<HTMLElement>(
        '[data-seam-exit="seam-4"]'
      );
      const enterEl = document.querySelector<HTMLElement>(
        '[data-seam-enter="seam-4"]'
      );
      const cardEl = cardRef.current;
      const tabEl = tabRef.current;

      if (!exitEl || !enterEl || !cardEl || !tabEl) {
        if (frames++ < ANCHOR_WAIT_MAX_FRAMES) {
          rafId = requestAnimationFrame(tryStart);
        }
        return;
      }

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: exitEl,
          start: "bottom 80%",
          endTrigger: enterEl,
          end: "top 30%",
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            // Card's top edge rises from 100% (below viewport) to 0% (full coverage).
            const cardTop = 100 - p * 100;
            // Tab sits TAB_HEIGHT_PCT above the card's top edge at all times.
            const tabTop = cardTop - TAB_HEIGHT_PCT;
            cardEl.style.top = `${cardTop}%`;
            tabEl.style.top = `${tabTop}%`;
            // Dissolve the ink at the end of the scrub — once the card fully
            // floods the viewport, fade it out so Contact's content (sitting
            // underneath at a lower z-index) becomes visible. Without this
            // fade the ink stays pinned at opacity 1 and permanently obscures
            // the form once the user scrolls past the trigger's end.
            const alpha = p < 0.9 ? 1 : Math.max(0, 1 - (p - 0.9) / 0.1);
            cardEl.style.opacity = `${alpha}`;
            tabEl.style.opacity = `${alpha}`;
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
      });
    };

    tryStart();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      // SplitText's DOM wrapping must be reverted before ctx.revert() kills
      // the tweens, otherwise gsap's inlined transforms linger on nodes
      // that are about to be unwrapped.
      labelSplits.forEach((s) => s.revert());
      ctx?.revert();
    };
  }, []);

  return (
    <>
      {/* Tab — trapezoidal silhouette rendered as inline SVG so the sides
          can taper inward (impossible with border-radius alone). Sits at
          zIndex 16 so any sub-pixel gap between tab base and card top is
          hidden by the card painting over it. */}
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
          zIndex: 16,
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
