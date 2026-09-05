"use client";

import { useEffect } from "react";

/* THE SCROLL ENGINE — one loop, one measurement pass, N effects.
   Modelled on how landonorris.com does it, decoded rather than guessed:
   there, a section DECLARES what it wants in data attributes
   (`data-h-color-from="dark-green"`), and one generic engine resolves it,
   computes progress, and writes the result every frame. Adding an effect
   there is two attributes, not new code. That is the part worth copying —
   not any single effect.

   Before this, the dark room ran FOUR scroll listeners and FIVE rAF loops,
   each independently calling getBoundingClientRect on its own elements.
   Every one of those measurements happens in the same frame anyway, so
   they were paying for the same layout read several times over.

   WHAT IT WRITES, and nothing more:
     --sp   0 → 1, this element's progress through its declared window
     --spx  the same progress in pixels of viewport travel

   It deliberately does NOT animate anything. The engine produces INPUTS;
   the stylesheet turns them into motion with calc(). That split is what
   keeps every effect in this room a pure function of scroll position —
   scrub backwards and it runs backwards exactly, land mid-page and the
   frame is already right, because there is no state to be out of sync. */

type Track = {
  el: HTMLElement;
  /** viewport fraction where progress reads 0 (1 = the fold, 0 = the top) */
  from: number;
  /** viewport fraction where progress reads 1 */
  to: number;
  /** which edge of the element is measured against those marks */
  edge: "top" | "bottom";
  /** custom property to write the 0→1 value into */
  varName: string;
};

const num = (v: string | null, fallback: number) => {
  const n = v === null ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

function read(el: HTMLElement): Track {
  return {
    el,
    from: num(el.getAttribute("data-sp-from"), 1),
    to: num(el.getAttribute("data-sp-to"), 0),
    edge: el.getAttribute("data-sp-edge") === "bottom" ? "bottom" : "top",
    varName: el.getAttribute("data-sp-var") || "--sp",
  };
}

export function useScrollEngine(deps: unknown[] = []) {
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sp]")
    );
    if (!nodes.length) return;

    const tracks = nodes.map(read);

    if (still) {
      // resolved, not mid-flight: reduced motion gets the finished frame
      tracks.forEach((t) => t.el.style.setProperty(t.varName, "1"));
      return;
    }

    let frame = 0;
    const draw = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const t of tracks) {
        const b = t.el.getBoundingClientRect();
        const mark = t.edge === "top" ? b.top : b.bottom;
        const from = vh * t.from;
        const to = vh * t.to;
        // guard a zero-length window rather than dividing by it
        const span = from - to;
        const p = span === 0 ? 1 : (from - mark) / span;
        const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
        t.el.style.setProperty(t.varName, String(clamped));
        t.el.style.setProperty(`${t.varName}x`, `${clamped * vh}px`);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    draw();

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
