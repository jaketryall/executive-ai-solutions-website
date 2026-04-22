"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

const DESKTOP_MIN_WIDTH_PX = 768;
const ANCHOR_WAIT_MAX_FRAMES = 60;

/**
 * Seam 3 — Manifesto → Testimonials.
 *
 * Just fades the "Proof" kicker in. Testimonials already owns the
 * headline SplitText reveal internally (words + mask), and ProofCard
 * owns the card + metric animations — this seam only adds the one
 * beat the upstream sections don't cover.
 *
 * Anchors:
 *   [data-seam-enter="seam-3"]  — Testimonials section root
 *   [data-seam-proof-kicker]    — the "Proof" kicker
 */
export default function Seam3ManifestoToTestimonials() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.innerWidth < DESKTOP_MIN_WIDTH_PX) return;

    let cancelled = false;
    let rafId = 0;
    let frames = 0;
    let ctx: gsap.Context | null = null;

    const tryStart = () => {
      if (cancelled) return;
      const enterEl = document.querySelector<HTMLElement>('[data-seam-enter="seam-3"]');
      const kicker = document.querySelector<HTMLElement>("[data-seam-proof-kicker]");
      if (!enterEl || !kicker) {
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
