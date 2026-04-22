"use client";

// Single-shot registration + signature eases used across the site.
// Importing this module has the side effect of registering the plugins and
// defining the CustomEases — it's safe to import repeatedly (guarded so
// repeat imports / HMR don't double-register or redefine).

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

declare global {
  // eslint-disable-next-line no-var
  var __gsapSetupDone: boolean | undefined;
}

if (typeof window !== "undefined" && !globalThis.__gsapSetupDone) {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

  // Apple-cubic — the default ease for every scroll-driven reveal on the
  // homepage. Matches the curve Apple uses on product pages: slow-start,
  // snap to final, long settle.
  CustomEase.create("appleOut", "0.16, 1, 0.3, 1");
  // Snappier variant for exit transitions — gets things off-screen quickly
  // without feeling abrupt.
  CustomEase.create("appleSnap", "0.76, 0, 0.24, 1");

  globalThis.__gsapSetupDone = true;
}

export { gsap, ScrollTrigger, SplitText, CustomEase };
