"use client";

import { useEffect } from "react";

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
 *  4. Capabilities' title reveals via SplitText mask
 *
 * Renders nothing — this component is a logic-only seam that queries
 * and animates existing DOM elements in Hero and Capabilities.
 *
 * Anchors queried at mount (wired in Task 4):
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
    // Animation wiring lands in Task 4.
  }, []);

  // Seam 1 has no visual of its own — it animates existing DOM.
  return null;
}
