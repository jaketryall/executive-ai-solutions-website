"use client";

// Single-shot registration + signature eases used across the site.
// Importing this module has the side effect of registering the plugins and
// defining the CustomEases — it's safe to import repeatedly (guarded so
// repeat imports / HMR don't double-register or redefine).

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — gsap package ships Flip.js (uppercase) but types/index.d.ts references flip.d.ts (lowercase); TS raises a spurious casing conflict on macOS
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

declare global {
  // eslint-disable-next-line no-var
  var __gsapSetupDone: boolean | undefined;
}

if (typeof window !== "undefined" && !globalThis.__gsapSetupDone) {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin, Flip, MotionPathPlugin);

  // Apple-cubic — the default ease for every scroll-driven reveal on the
  // homepage. Matches the curve Apple uses on product pages: slow-start,
  // snap to final, long settle.
  CustomEase.create("appleOut", "0.16, 1, 0.3, 1");
  // Snappier variant for exit transitions — gets things off-screen quickly
  // without feeling abrupt.
  CustomEase.create("appleSnap", "0.76, 0, 0.24, 1");

  globalThis.__gsapSetupDone = true;
}

export { gsap, ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin, Flip, MotionPathPlugin };
