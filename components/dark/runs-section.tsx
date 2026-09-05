"use client";

import { useEffect, useRef } from "react";

/* §04 · HOW IT RUNS
   The whole path is visible at once and NOTHING here is scroll-jacked.
   That is the settled position on this section (2026-07-06): a visitor
   deciding whether to call you wants reassurance, not a ride — being able
   to see all four steps in a single glance IS the reassurance.

   Copy is the shipped site's, verbatim, because it is real and already
   approved. Only the expression is new.

   THE LAYOUT: four steps standing on four steps. Equal panels in a row
   are the shape of a MENU — four peers, pick one — and a process is an
   order, not a menu. So the panels climb a tread each, on a rail the
   light walks left to right. Still one glance, still no scroll-jack.

   THE SIGNATURE: four artifacts, not one stage. Each step owns a small
   working demo and runs it once, on its own arrival — a shared morphing
   stage was tried and lost, because one stage means three of the four
   steps are always showing someone else's moment. All four rest in their
   FINISHED state, so no-JS and reduced-motion read the completed story
   rather than an empty box. */

const STEPS = [
  {
    n: "01",
    title: "The call",
    meta: "Day 1",
    copy: "Twenty minutes on your business, your customers, and what winning looks like. You get a fixed quote within two days.",
    demo: "call",
  },
  {
    n: "02",
    title: "The design",
    meta: "Weeks 1–2",
    copy: "You see real pages in your brand, not wireframes. We iterate until you'd happily put it on a billboard.",
    demo: "design",
  },
  {
    n: "03",
    title: "The build",
    meta: "Weeks 2–4",
    copy: "Hand-coded, fast, and search-ready from day one. No page builders, nothing you'll outgrow.",
    demo: "build",
  },
  {
    n: "04",
    title: "The growth",
    meta: "From launch",
    copy: "Launch is the start. SEO, Google Ads, and AI automation keep the site earning its keep.",
    demo: "growth",
  },
] as const;

/* 01 · twenty minutes of voice. The bars carry a fixed per-bar delay so the
   pulse reads as speech travelling left to right, not as a row blinking. */
function DemoCall() {
  return (
    <span className="dr-demo dr-demo-call" aria-hidden>
      {Array.from({ length: 13 }, (_, i) => (
        <i key={i} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </span>
  );
}

/* 02 · real pages, not wireframes: the blocks arrive out of true and settle
   onto the grid. */
function DemoDesign() {
  return (
    <span className="dr-demo dr-demo-design" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <i key={i} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </span>
  );
}

/* 03 · the build log: rows land one after another and the last one stays lit. */
function DemoBuild() {
  return (
    <span className="dr-demo dr-demo-build" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </span>
  );
}

/* 04 · launch is the start — the line keeps going up after it. */
function DemoGrowth() {
  return (
    <span className="dr-demo dr-demo-growth" aria-hidden>
      <svg viewBox="0 0 120 44" preserveAspectRatio="none">
        {/* pathLength normalises the line to 1 unit so the draw-on works
            off a dasharray of 1 — it is an SVG ATTRIBUTE, not a CSS
            property, and setting it in the stylesheet silently does
            nothing (which renders the line as 1px dashes) */}
        <path pathLength={1} d="M2 40 L26 33 L50 30 L74 19 L98 11 L118 3" />
      </svg>
    </span>
  );
}

const DEMOS = {
  call: DemoCall,
  design: DemoDesign,
  build: DemoBuild,
  growth: DemoGrowth,
} as const;

export default function RunsSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>(".dr-run"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cards.forEach((c) => c.classList.add("is-in"));
      return;
    }
    /* one-way: a demo that replays every time the card re-enters turns the
       section into a flicker on the way back up */
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -14% 0px", threshold: 0 }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section className="dr-runs" ref={ref} aria-labelledby="dr-runs-h">
      <div className="wrap">
        {/* the header SPANS. Kicker hard left, the reassurance hard
            right, on one baseline — the staircase climbs into the top
            right of this section, and a header hugging the left corner
            left that whole quadrant empty. */}
        <header className="dr-runs-head">
          <div className="dr-runs-band">
            <span className="t-label dr-runs-kicker">How it runs</span>
            <p className="dr-runs-sub">Fixed quote up front, no surprises after.</p>
          </div>
          <h2 className="dr-runs-lead" id="dr-runs-h">
            Four steps from the first call to a site that earns.
          </h2>
        </header>

        {/* DECLARES its window; the engine fills in --sp. No scroll code
            lives in this file — the whole section is now two attributes
            and a stylesheet rule. */}
        <ol
          className="dr-runs-grid"
          data-sp
          data-sp-from="1.15"
          data-sp-to="0.05"
          /* chase the target rather than snapping to it — the second
             smoothing layer, matching the reference's own lerp constant */
          data-sp-lerp="0.1"
        >
          {STEPS.map((s, i) => {
            const Demo = DEMOS[s.demo];
            return (
              <li
                key={s.n}
                className="dr-run"
                style={{ "--i": i } as React.CSSProperties}
              >
                {/* the tread this step stands on, and the riser up to
                    the next. Two spans and no measurement: the geometry
                    is all in the stylesheet, and the last step's riser
                    is dropped by :last-child rather than by a flag. */}
                <span className="dr-run-rail" aria-hidden>
                  <i className="dr-run-tread" />
                  <i className="dr-run-riser" />
                </span>

                <span className="dr-run-top">
                  <span className="dr-run-n">{s.n}</span>
                  <span className="t-label dr-run-meta">{s.meta}</span>
                </span>
                <Demo />
                <h3 className="dr-run-title">{s.title}</h3>
                <p className="dr-run-copy">{s.copy}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
