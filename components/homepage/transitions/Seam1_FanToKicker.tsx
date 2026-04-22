"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

// Desktop-only — mobile renders MobileWork, which has no fan.
const DESKTOP_MIN_WIDTH_PX = 768;

// Capabilities is dynamically imported; poll for its anchor up to ~1s.
const ANCHOR_WAIT_MAX_FRAMES = 60;

/**
 * Seam 1 — Fan → Kicker.
 *
 * Scroll-driven transition between <Hero /> (ends with a fan of 4
 * project cards) and <Capabilities /> (opens with a kicker row +
 * horizontal rule + "Three things I ship for clients." headline).
 *
 * Beats:
 *  1. Fan cards un-rotate and converge toward the viewport floor
 *  2. Fan cards fade as Capabilities enters
 *  3. Capabilities' horizontal rule grows from scaleX 0 → 1 (center origin)
 *  4. Capabilities' title reveals via SplitText mask (Task 5)
 *
 * Renders nothing — this component is a logic-only seam that queries
 * and animates existing DOM elements in Hero and Capabilities.
 *
 * Anchors queried at mount:
 *   [data-seam-exit="seam-1"]            — Hero section root
 *   [data-seam-fan] .hero-fan-card       — fan cards inside Hero
 *   [data-seam-enter="seam-1"]           — Capabilities section root
 *   [data-seam-rule]                     — kicker rule inside Capabilities
 *   [data-seam-title]                    — headline inside Capabilities
 *
 * Desktop only. See design spec:
 *   docs/superpowers/specs/2026-04-21-gsap-section-transitions-design.md
 */
export default function Seam1FanToKicker() {
  useEffect(() => {
    // Reduced motion: skip the scroll-driven fall/fade; apply the kicker
    // rule's final state so Capabilities still looks complete.
    if (prefersReducedMotion()) {
      const rule = document.querySelector<HTMLElement>("[data-seam-rule]");
      if (rule) rule.style.transform = "scaleX(1)";
      return;
    }

    // Mobile: the fan doesn't exist (Hero's desktop layout only renders
    // the fan above the md breakpoint). Apply the final kicker rule state
    // and bail — mobile Capabilities shows the rule as normal.
    if (window.innerWidth < DESKTOP_MIN_WIDTH_PX) {
      const rule = document.querySelector<HTMLElement>("[data-seam-rule]");
      if (rule) rule.style.transform = "scaleX(1)";
      return;
    }

    // Anchor-wait loop. Capabilities is dynamically imported; the seam's
    // chunk can resolve before Capabilities' does. Retry per-frame until
    // anchors are in the DOM or the budget runs out.
    let cancelled = false;
    let rafId = 0;
    let frames = 0;
    let ctx: gsap.Context | null = null;
    const splitsToRevert: InstanceType<typeof SplitText>[] = [];

    const tryStart = () => {
      if (cancelled) return;
      const exitEl = document.querySelector<HTMLElement>('[data-seam-exit="seam-1"]');
      const enterEl = document.querySelector<HTMLElement>('[data-seam-enter="seam-1"]');
      const fanCards = document.querySelectorAll<HTMLElement>(
        "[data-seam-fan] .hero-fan-card"
      );
      const rule = document.querySelector<HTMLElement>("[data-seam-rule]");

      if (!exitEl || !enterEl || fanCards.length === 0 || !rule) {
        if (frames++ < ANCHOR_WAIT_MAX_FRAMES) {
          rafId = requestAnimationFrame(tryStart);
        }
        return;
      }

      ctx = gsap.context(() => {
        // Beat 1 — Fan cards un-rotate, translate toward the viewport
        // floor, and scale down. Scrubbed from Hero's release to the
        // point just before Capabilities' title reaches viewport.
        gsap.to(fanCards, {
          rotation: 0,
          x: 0,
          y: 150,
          scale: 0.6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: exitEl,
            start: "bottom 90%",
            endTrigger: enterEl,
            end: "top 70%",
            scrub: 0.5,
          },
        });

        // Beat 2 — Fan cards fade as Capabilities' top nears viewport.
        gsap.to(fanCards, {
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: enterEl,
            start: "top 90%",
            end: "top 60%",
            scrub: 0.5,
          },
        });

        // Beat 3 — Kicker rule grows from scaleX 0 to 1 (center origin).
        // Initial state is on the element via the Tailwind classes
        // `origin-center scale-x-0` (set in Task 1), so this tween only
        // needs to specify the target.
        gsap.to(rule, {
          scaleX: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: enterEl,
            start: "top 70%",
            end: "top 50%",
            scrub: 0.5,
          },
        });

        // Beat 4 — Headline SplitText mask reveal.
        // "Three things I ship for clients." chars rise from below via
        // yPercent 110 → 0 staggered. Triggered as the title enters
        // the viewport, slightly after the rule finishes growing.
        const title = document.querySelector<HTMLElement>("[data-seam-title]");
        if (title) {
          const split = SplitText.create(title, { type: "chars", mask: "chars" });
          splitsToRevert.push(split);
          gsap.set(split.chars, { yPercent: 110 });
          gsap.to(split.chars, {
            yPercent: 0,
            stagger: 0.015,
            ease: "appleOut",
            scrollTrigger: {
              trigger: enterEl,
              start: "top 65%",
              end: "top 35%",
              scrub: 0.5,
            },
          });
        }
      });
    };

    tryStart();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      // SplitText must revert before ctx.revert() kills the tweens —
      // otherwise GSAP's inlined transforms linger on char spans about
      // to be unwrapped. Same pattern as Seam 4.
      splitsToRevert.forEach((s) => s.revert());
      ctx?.revert();
    };
  }, []);

  return null;
}
