"use client";

import { gsap } from "@/lib/gsap-setup";
import type { Variants } from "framer-motion";

/**
 * Animate a number from 0 (or `from`) to `target` over `duration` seconds.
 * Snaps to integers by default. Designed to fire once on viewport entry.
 */
export function tweenCounter(
  el: HTMLElement,
  target: number,
  opts: { duration?: number; from?: number; format?: (n: number) => string } = {},
) {
  const { duration = 1.2, from = 0, format = (n) => Math.round(n).toString() } = opts;
  const obj = { val: from };
  return gsap.to(obj, {
    val: target,
    duration,
    ease: "appleOut",
    onUpdate: () => {
      el.textContent = format(obj.val);
    },
  });
}

/**
 * Standard card hover variants — used by every interactive card on the page.
 * Pair with whileHover on a motion.div.
 */
export const cardHoverVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    y: -2,
    boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Standard tag/pill hover — fills with taupe at 12% opacity, lifts 1px.
 */
export const tagHoverVariants: Variants = {
  rest: {
    y: 0,
    backgroundColor: "rgba(120,115,108,0)",
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    y: -1,
    backgroundColor: "rgba(120,115,108,0.12)",
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Reduced-motion guard. Wrap any non-essential animation in this check.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
