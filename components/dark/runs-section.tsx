"use client";

/* §04 · HOW IT RUNS
   The whole path is visible at once and NOTHING here is scroll-jacked.
   That is the settled position on this section (2026-07-06): a visitor
   deciding whether to call you wants reassurance, not a ride — being able
   to see all four steps in a single glance IS the reassurance.

   Copy is the shipped site's, verbatim, because it is real and already
   approved. Only the expression is new.

   THE GROUND is light now, not black: a room uncovered by a curtain
   lift off §03 (see proof-section.tsx), not a body flip — that stays
   the page's one true flip, on §05.

   THE LAYOUT: one ruled slab, four cells. Equal panels in a row used
   to read as a MENU — four peers, pick one — until the order was moved
   off the geometry and onto the numbers, the dates and one ruled line
   that lights 01→04 as the slab arrives (the staircase this replaced,
   each panel a tread higher, was retired on Jake's call, 2026-09-06:
   "the staircase thing is ugly"). Still one glance, still no
   scroll-jack: the slab arrives once, then nothing moves with scroll.

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
  return (
    <section className="dr-runs" aria-labelledby="dr-runs-h">
      <div className="wrap">
        {/* the header SPANS: kicker hard left, the reassurance hard
            right, on one baseline, so the right quadrant is not empty. */}
        <header className="dr-runs-head">
          {/* the one triggered vocabulary (law 11): kicker, then the
              lead, then the reassurance — each a declaration, all the
              same gesture. data-wipe-at="0.86" (not the engine's default
              top-90%): the header's own top sits at ~.9vh under the
              curtain-lift padding, clearing the hem at p≈.1 — .45 left
              it uncovered but blank until p≈.76 (graded 2026-09-06); .86
              fires the instant it clears (p≈.16, ~26px of daylight),
              never under the sheet, never a blank beat on the plate. */}
          <div className="dr-runs-band">
            <span className="t-label dr-runs-kicker" data-wipe data-wipe-at="0.86">
              How it runs
            </span>
            <p className="dr-runs-sub" data-wipe data-wipe-delay="450" data-wipe-at="0.86">
              Fixed quote up front, no surprises after.
            </p>
          </div>
          <h2 className="dr-runs-lead" id="dr-runs-h" data-wipe data-wipe-delay="150" data-wipe-at="0.86">
            Four steps from the first call to a site that earns.
          </h2>
        </header>

        {/* DECLARES its window; the engine fills in --sp. No scroll code
            lives in this file — the whole section is now two attributes
            and a stylesheet rule. The slab is already there when the
            curtain lifts off it, so its own window opens LATE — once
            the room is uncovered — and is spent by the time its top is
            35% of the way up, so the line has walked 01→04 and settled
            while the section is still low on the screen (laws 6/7 —
            the still beat). */}
        <ol
          className="dr-runs-grid"
          data-sp
          data-sp-from="0.7"
          data-sp-to="0.35"
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
                /* the card itself is scrubbed off --sp; this fires the
                   demo inside it, once, on the engine's clock — one-way,
                   because a demo that replays on the way back up turns
                   the section into a flicker */
                data-once
                /* fires right after the uncover, a slight ripple
                   left→right rather than all four at once */
                data-once-at={(0.62 - i * 0.02).toFixed(2)}
              >
                <span className="dr-run-top">
                  <span className="dr-run-n">{s.n}</span>
                  <span className="t-label dr-run-meta">{s.meta}</span>
                </span>
                {/* the ruled line under the station row — geometry lives in the stylesheet */}
                <i className="dr-run-rail" aria-hidden />
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
