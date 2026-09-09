"use client";

/* §04 · HOW IT RUNS
   The whole path is visible at once and NOTHING here is scroll-jacked.
   That is the settled position on this section (2026-07-06): a visitor
   deciding whether to call you wants reassurance, not a ride — being able
   to see all four steps in a single glance IS the reassurance.

   Copy is the shipped site's, verbatim, because it is real and already
   approved. Only the expression is new.

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

export const STEPS = [
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
   pulse reads as speech travelling left to right, not as a row blinking.

   41 BARS, NOT 13. The well is ~540px wide on a desktop card, and 13 bars
   spread across it by `space-between` sat ~30px apart — a barcode, not a
   waveform. 41 puts the gaps at roughly twice the bar width, which is
   what an audio meter actually looks like. Prime, so the 13-step height
   cycle in the stylesheet never lands in phase with the ends and the
   pattern does not read as tiled. */
export function DemoCall() {
  return (
    <span className="dr-demo dr-demo-call" aria-hidden>
      {Array.from({ length: 41 }, (_, i) => (
        <i key={i} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </span>
  );
}

/* 02 · real pages, not wireframes — so the blocks have to compose a PAGE.
   Four of them: a hero band across the top, a headline and a CTA under it,
   one line of body. Laid out as four equal bars they read as a WIREFRAME,
   which is the one thing this step's copy promises you will not get. They
   still arrive out of true and settle onto the grid. */
function DemoDesign() {
  return (
    <span className="dr-demo dr-demo-design" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <i key={i} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </span>
  );
}

/* 03 · the build log: rows land one after another and the last one stays
   lit. Each row carries its own leading marker (drawn in the row's own
   background, not in the DOM) — without it, five grey bars of ragged
   width are a LOADING SKELETON, which reads as "this card failed to
   render" rather than as a build running. */
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

/* ONE CARD BODY, TWO PLACEMENTS. 01 is rendered against the floor and
   02-04 inside the track, so the markup has to come from one place or the
   anchor and the rail will drift the first time either is edited. */
function StepFace({ s }: { s: (typeof STEPS)[number] }) {
  const Demo = DEMOS[s.demo];
  return (
    <>
      <span className="dr-run-top">
        <span className="dr-run-n">{s.n}</span>
        <span className="t-label dr-run-meta">{s.meta}</span>
      </span>
      {/* the ruled line under the station row — geometry lives in the stylesheet */}
      <i className="dr-run-rail" aria-hidden />
      {/* THE WELL — a little screen recessed into the card, so the artifact
          reads as something being SHOWN rather than as decoration floating
          on a panel. The frame is the constant across all four; only what
          is inside it changes. Geometry in the stylesheet. */}
      <span className="dr-run-well">
        <Demo />
      </span>
      <h3 className="dr-run-title">{s.title}</h3>
      <p className="dr-run-copy">{s.copy}</p>
    </>
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
    /* the ground is not this section's job — see .dr-flip in page.tsx,
       which owns it for the whole back half */
    <section className="dr-runs" aria-labelledby="dr-runs-h">
      {/* THE STAGE is tall; the panel inside it is stuck to the viewport
          and the four steps slide sideways across it as you scroll down.

          ⚠ THIS SUPERSEDES a decision Jake made himself (2026-07-06,
          decisions.md): §04 showed the whole path in ONE GLANCE with no
          scroll-jack, because "a visitor deciding whether to call wants
          reassurance, not a ride". A horizontal pin is exactly the ride
          that was rejected — you can no longer see step 4 while reading
          step 1, and the section now takes ~3 screens of scroll instead
          of one. It is here because he asked to SEE it
          ("turn the process section in to a horizontal scroll like the
          lando site"); if it does not earn the cost, the previous state
          is one revert away. */}
      {/* THE WINDOW LIVES ON THE STAGE, not on the track. The track is
          inside the sticky panel, so its own rect stops travelling the
          moment the pin engages — measured there, --sp pegged to 1 the
          instant the section arrived and the four steps were already
          slid off. The stage is the only box in here that actually moves
          through the viewport, so it is the only honest ruler; --sp
          inherits down to the track from here. */}
      <div
        className="dr-runs-stage"
        data-sp
        data-sp-from="0"
        data-sp-to="-2"
        data-sp-lerp="0.1"
      >
      <div className="dr-runs-pin">
      <div className="wrap">
        {/* THE CARD IS THE BACKGROUND CHANGE (Jake, 2026-09-07: "we need a
            big card … for the background change or something … it needs a
            cool scroll reveal entrance and some sort of background
            change"). §05 below already flips the PAGE ground void →
            surface-2, so doing that here would be the same trick twice in
            a row (law 1). Instead an object arrives and takes the frame:
            a big lit panel, header and all four steps inside it, so that
            when it is centred you are looking at a different ground than
            the void without the room itself ever changing. Still dark —
            a light room mid-page was rejected on sight (decisions.md).

            ONE WINDOW FOR THE WHOLE SECTION. The scrub used to live on
            the <ol>; it lives here now and --sp INHERITS down, so the
            card's rise, the grid's settle and the four cells' stagger are
            all the same number. The card cannot arrive out of step with
            what is written on it, because there is only one clock. */}
        <div className="dr-runs-card">
        {/* the header SPANS: kicker hard left, the reassurance hard
            right, on one baseline, so the right quadrant is not empty. */}
        <header className="dr-runs-head">
          {/* the one triggered vocabulary (law 11): kicker, then the
              lead, then the reassurance — each a declaration, all the
              same gesture, fired once by the engine at top 90% */}
          <div className="dr-runs-band">
            <span className="t-label dr-runs-kicker" data-wipe>
              How it runs
            </span>
            <p className="dr-runs-sub" data-wipe data-wipe-delay="450">
              Fixed quote up front, no surprises after.
            </p>
          </div>
          <h2 className="dr-runs-lead" id="dr-runs-h" data-wipe data-wipe-delay="150">
            Four steps from the first call to a site that earns.
          </h2>
        </header>

        {/* DECLARES its window; the engine fills in --sp. No scroll code
            lives in this file — the whole section is now two attributes
            and a stylesheet rule. The window is an ARRIVAL, not the
            viewport's whole travel: it opens as the grid enters and is
            spent by the time its top is 62% of the way up, so the flight
            is whole while it is still low on the screen and the scroll
            has nothing left to move (laws 6/7 — the still beat). */}
        {/* ── THE FLOOR ── the anchor and the rail share it. 01 is NOT in
            the track: it is placed against the floor's left edge and stays
            there for the whole section, and 02→04 travel across and pass
            BEHIND it. The track carries a left pad the width of the anchor
            plus a gap, so 02 begins beside 01 rather than under it. */}
        <div className="dr-runs-floor">
        <ol className="dr-runs-grid">
          {STEPS.slice(1).map((s, j) => {
            const i = j + 1;
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
                /* each fires as it reaches the slot beside the anchor,
                   so a demo never runs on a card that is still off-screen
                   or already sliding behind 01 */
                data-once-at={(0.86 - i * 0.08).toFixed(2)}
              >
                <StepFace s={s} />
              </li>
            );
          })}
        </ol>
        {/* THE ANCHOR — step 01, held against the floor's left edge for the
            whole section. It is last in the DOM so it paints over the rail
            without needing a stacking context of its own; the cards that
            pass behind it are opaque, so the overlap reads as dealing. */}
        <div className="dr-run dr-run--anchor" data-once data-once-at="0.98">
          <StepFace s={STEPS[0]} />
        </div>
        </div>
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}
