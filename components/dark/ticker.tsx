"use client";

import { useEffect, useRef } from "react";

/* THE TICKER — one runner for every running line on the page (step 2 of
   design-dna/lando-ground-plan.md, 2026-09-23 — Jake: "go to step 2").

   WHAT HIS IS, measured (decodes/lando-census-2026-09-22.json): right
   after his hero, two rows of big type run in opposite directions behind
   his portrait — the largest at-rest reading on his page after the hero
   itself (4.3 / 8.1 / 4.3% of the frame at y 450 / 900 / 1350). They
   drift on their own, reverse with the direction you last scrolled, and
   are pushed a little further by the scroll itself (grammar §2.13).

   THIS: N rows, each a track of four identical sets (enough to cover any
   screen at the widest set), one JS-written translate per row per frame:
     x = base + offset
     base   = the drift, `speed` px/s, its sign latched to the last scroll
              direction — it never jumps, it only turns around
     offset = ±`reach` of the viewport's width, crossing 0 when the band
              is at the middle of the screen — the scroll's own push
   Odd rows run the other way. The speed is Jake's standing ~21px/s ("read
   at a glance, never chased", the strip's marquee) and the space is the
   separator — no dots (his call on the same marquee).

   IT ONLY RUNS WHILE IT IS ON SCREEN and the tab is visible. Reduced
   motion: the rows simply stand where they are. aria-hidden — the words
   are said properly elsewhere (the statement's own sentence). */
export default function Ticker({
  rows,
  className = "",
  speed = 21,
  reach = 0.1,
}: {
  rows: string[][];
  className?: string;
  speed?: number;
  reach?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const tracks = Array.from(root.querySelectorAll<HTMLElement>(".dr-tick-track"));
    if (!tracks.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let setW: number[] = [];
    let top = 0;
    let h = 0;
    const measure = () => {
      setW = tracks.map((t) => (t.firstElementChild as HTMLElement | null)?.offsetWidth || 1);
      let y = 0;
      let e: HTMLElement | null = root;
      while (e) {
        y += e.offsetTop;
        e = e.offsetParent as HTMLElement | null;
      }
      top = y;
      h = root.offsetHeight;
    };
    measure();
    document.fonts?.ready.then(measure);

    let t = 0;
    let dir = 1;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;
    let onScreen = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const y = window.scrollY;
      if (y !== lastY) dir = y > lastY ? 1 : -1;
      lastY = y;
      t += speed * dt * dir;
      const vh = window.innerHeight;
      const vw = document.documentElement.clientWidth;
      const p = Math.max(-1, Math.min(1, (top + h / 2 - y - vh / 2) / vh));
      const s = t - p * reach * vw;
      for (let i = 0; i < tracks.length; i++) {
        const w = setW[i];
        const m = ((s % w) + w) % w;
        tracks[i].style.transform = `translate3d(${i % 2 ? m - w : -m}px,0,0)`;
      }
    };
    const start = () => {
      if (raf || !onScreen || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) start();
      else stopLoop();
    });
    io.observe(root);
    const onVis = () => (document.hidden ? stopLoop() : start());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    window.addEventListener("resize", measure);

    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", measure);
    };
  }, [speed, reach]);

  return (
    <div className={`dr-tick ${className}`} ref={ref} aria-hidden>
      {rows.map((items, i) => (
        <div className="dr-tick-row" key={i}>
          <div className="dr-tick-track">
            {[0, 1, 2, 3].map((k) => (
              <div className="dr-tick-set" key={k}>
                {items.map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
