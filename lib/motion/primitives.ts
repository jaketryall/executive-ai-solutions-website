"use client";

import { useLayoutEffect, useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — gsap package ships Flip.js (uppercase) but types/index.d.ts references flip.d.ts (lowercase); TS raises a spurious casing conflict on macOS
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
}

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ————————————————————————————————————————————————————————————————————————
// computeFanPositions — pure math for symmetric fan-spread of N cards
// ————————————————————————————————————————————————————————————————————————

export type FanPosition = {
  x: number;
  y: number;
  z: number;
  rotation: number;
  rotationY: number;
};

export type FanOptions = {
  count: number;
  spread: number; // total arc in degrees
  depth: number;  // max |z| for outermost card
  radius: number; // max |x| for outermost card
};

export function computeFanPositions(opts: FanOptions): FanPosition[] {
  const { count, spread, depth, radius } = opts;
  if (count <= 0) return [];
  if (count === 1) return [{ x: 0, y: 0, z: 0, rotation: 0, rotationY: 0 }];

  const half = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => {
    const t = (i - half) / half; // -1 ... +1 (symmetric around 0)
    return {
      x: t * radius,
      y: Math.abs(t) * 20,       // outer cards drift slightly down (arc bottom)
      z: -Math.abs(t) * depth,   // outer cards pull back from viewer
      rotation: t * (spread / 2),
      rotationY: t * 18,         // 3D tilt toward viewer for outer cards
    };
  });
}

// ————————————————————————————————————————————————————————————————————————
// useReveal — scroll-triggered stagger reveal
// ————————————————————————————————————————————————————————————————————————

type RevealOptions = {
  y?: number;
  stagger?: number;
  ease?: gsap.EaseFunction | string;
  start?: string;
  selector?: string; // child selector within ref
};

export function useReveal(
  ref: RefObject<HTMLElement | null>,
  opts: RevealOptions = {}
) {
  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const {
      y = 32,
      stagger = 0.06,
      ease = "expo.out",
      start = "top 85%",
      selector = "[data-reveal]",
    } = opts;

    const ctx = gsap.context(() => {
      const targets = ref.current!.querySelectorAll(selector);
      if (!targets.length) return;
      gsap.from(targets, {
        y,
        opacity: 0,
        stagger,
        duration: 0.9,
        ease,
        scrollTrigger: {
          trigger: ref.current,
          start,
        },
      });
    }, ref);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}

// ————————————————————————————————————————————————————————————————————————
// useScrub — bidirectional scroll-linked progress
// ————————————————————————————————————————————————————————————————————————

type ScrubOptions = {
  start?: string;
  end?: string;
  onUpdate: (progress: number) => void;
};

export function useScrub(
  ref: RefObject<HTMLElement | null>,
  opts: ScrubOptions
) {
  const { start = "top 70%", end = "bottom 30%", onUpdate } = opts;

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start,
        end,
        scrub: 0.5,
        onUpdate: (self) => onUpdate(self.progress),
      });
    }, ref);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, start, end, onUpdate]);
}

// ————————————————————————————————————————————————————————————————————————
// settle — micro-overshoot bounce after state change
// ————————————————————————————————————————————————————————————————————————

import { eases } from "@/lib/motion/eases";

export function settle(
  el: HTMLElement,
  { overshoot = 1.04, duration = 0.4 }: { overshoot?: number; duration?: number } = {}
) {
  gsap.fromTo(
    el,
    { scale: overshoot },
    { scale: 1, duration, ease: eases.processRule }
  );
}

// ————————————————————————————————————————————————————————————————————————
// Flip re-export — shared element transitions (used directly in callers)
// ————————————————————————————————————————————————————————————————————————

export { Flip };
