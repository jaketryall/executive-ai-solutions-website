"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

const DESKTOP_MIN_WIDTH_PX = 768;
const ANCHOR_WAIT_MAX_FRAMES = 60;

/**
 * Seam 2 — Capabilities → Manifesto.
 *
 * Beats:
 *  1. The Manifesto kicker ("The Manifesto") fades in
 *  2. The horizontal rule grows scaleX 0 → 1 (same vocabulary as Seam 1)
 *
 * The manifesto's existing SplitText reveal on `.m-lead` / `.m-punch`
 * continues to fire on its own scroll-in; this seam just adds the
 * editorial rule and kicker as connective tissue.
 *
 * Anchors:
 *   [data-seam-exit="seam-2"]  — Capabilities section root
 *   [data-seam-enter="seam-2"] — Manifesto section root
 *   [data-seam-kicker]         — "The Manifesto" kicker
 *   [data-seam-rule-2]         — the horizontal rule
 */
export default function Seam2CapabilitiesToManifesto() {
  useEffect(() => {
    const applyFinal = () => {
      const rule = document.querySelector<HTMLElement>("[data-seam-rule-2]");
      if (rule) rule.style.transform = "scaleX(1)";
      const kicker = document.querySelector<HTMLElement>("[data-seam-kicker]");
      if (kicker) kicker.style.opacity = "1";
    };
    if (prefersReducedMotion()) return applyFinal();
    if (window.innerWidth < DESKTOP_MIN_WIDTH_PX) return applyFinal();

    let cancelled = false;
    let rafId = 0;
    let frames = 0;
    let ctx: gsap.Context | null = null;

    const tryStart = () => {
      if (cancelled) return;
      const exitEl = document.querySelector<HTMLElement>('[data-seam-exit="seam-2"]');
      const enterEl = document.querySelector<HTMLElement>('[data-seam-enter="seam-2"]');
      const rule = document.querySelector<HTMLElement>("[data-seam-rule-2]");
      const kicker = document.querySelector<HTMLElement>("[data-seam-kicker]");
      if (!exitEl || !enterEl || !rule || !kicker) {
        if (frames++ < ANCHOR_WAIT_MAX_FRAMES) rafId = requestAnimationFrame(tryStart);
        return;
      }

      ctx = gsap.context(() => {
        gsap.fromTo(
          kicker,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: enterEl,
              start: "top 85%",
              end: "top 60%",
              scrub: 0.5,
            },
          }
        );

        gsap.to(rule, {
          scaleX: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: enterEl,
            start: "top 75%",
            end: "top 50%",
            scrub: 0.5,
          },
        });
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
