import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

// Single registration point for the whole app. Import gsap from here, never from "gsap".
gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, Observer, useGSAP);

// The two project curves (+ the one sanctioned loop). Referenced by name everywhere;
// a raw cubic-bezier string passed to gsap silently no-ops.
export const EASE_STRUCTURE = "eas-structure";
export const EASE_UI = "eas-ui";
export const EASE_LOOP = "eas-loop";

/* 2026-07-15: THE APPLE ENVELOPE, site-wide (Jake: "option 1 then lets
   roll it"). The original theatrical wind-up (0.62,0.05,0.10,1 — start
   slow, lunge late) was the v3 brand voice; it's retired. Structure now
   launches at full confidence and brakes long (power3.out's cubic) —
   the velocity shape we measured on Apple's own reveals. EASE_UI and
   EASE_LOOP are unchanged; §10's diegetic rule still holds. */
CustomEase.create(EASE_STRUCTURE, "M0,0 C0.215,0.61 0.355,1 1,1");
CustomEase.create(EASE_UI, "M0,0 C0.26,1 0.42,1 1,1");
CustomEase.create(EASE_LOOP, "M0,0 C0.42,0 0.58,1 1,1");

// Eased progress mapping for scrubbed value-fills (word-fill, grow, numeral fill):
// the tween ease stays "none" (scroll is the clock) but the VALUE runs through the curve.
export const structureEase = gsap.parseEase(EASE_STRUCTURE);

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mask-rise for `.mask-line > .mask-inner` elements. The CSS pre-hide uses
// transform:translateY(118%), which GSAP parses as a PIXEL y — so we must zero
// the y channel explicitly in the same tween or the element never surfaces.
export const maskRiseVars = {
  from: { yPercent: 118, y: 0 },
  to: { yPercent: 0, y: 0 },
};

export { gsap, ScrollTrigger, SplitText, Observer, useGSAP };
