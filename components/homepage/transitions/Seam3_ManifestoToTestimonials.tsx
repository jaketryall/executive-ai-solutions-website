"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

const DESKTOP_MIN_WIDTH_PX = 768;
const ANCHOR_WAIT_MAX_FRAMES = 60;

/**
 * Seam 3 — Manifesto → Testimonials.
 *
 * Beats:
 *  1. The "Proof" kicker fades in
 *  2. "What clients say after launch." SplitText chars rise into place
 *
 * The 3 proof cards already have their own scroll reveals in ProofCard
 * (animated metric counters); we don't double-animate them here.
 *
 * Anchors:
 *   [data-seam-exit="seam-3"]  — Manifesto section root
 *   [data-seam-enter="seam-3"] — Testimonials section root
 *   [data-seam-proof-kicker]   — the "Proof" kicker
 *   [data-seam-proof-title]    — the headline h2
 */
export default function Seam3ManifestoToTestimonials() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.innerWidth < DESKTOP_MIN_WIDTH_PX) return;

    let cancelled = false;
    let rafId = 0;
    let frames = 0;
    let ctx: gsap.Context | null = null;
    const splitsToRevert: InstanceType<typeof SplitText>[] = [];

    const tryStart = () => {
      if (cancelled) return;
      const exitEl = document.querySelector<HTMLElement>('[data-seam-exit="seam-3"]');
      const enterEl = document.querySelector<HTMLElement>('[data-seam-enter="seam-3"]');
      const kicker = document.querySelector<HTMLElement>("[data-seam-proof-kicker]");
      const title = document.querySelector<HTMLElement>("[data-seam-proof-title]");
      if (!exitEl || !enterEl || !kicker || !title) {
        if (frames++ < ANCHOR_WAIT_MAX_FRAMES) rafId = requestAnimationFrame(tryStart);
        return;
      }

      ctx = gsap.context(() => {
        gsap.fromTo(
          kicker,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: enterEl,
              start: "top 85%",
              end: "top 65%",
              scrub: 0.5,
            },
          }
        );

        const split = SplitText.create(title, { type: "chars", mask: "chars" });
        splitsToRevert.push(split);
        gsap.set(split.chars, { yPercent: 110 });
        gsap.to(split.chars, {
          yPercent: 0,
          stagger: 0.015,
          ease: "appleOut",
          scrollTrigger: {
            trigger: enterEl,
            start: "top 70%",
            end: "top 40%",
            scrub: 0.5,
          },
        });
      });
    };

    tryStart();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      splitsToRevert.forEach((s) => s.revert());
      ctx?.revert();
    };
  }, []);

  return null;
}
