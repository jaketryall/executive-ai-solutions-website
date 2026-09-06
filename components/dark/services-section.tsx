"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { QUOTES } from "@/lib/quotes";
import { PersonIcon } from "@/components/ui/person-icon";
import { PHONES } from "@/components/dark/service-phones";

/* §02 · THE FUNNEL
   THE LIGHTS COME ON. The one light section in a black room, and the only
   place the page inverts — which is exactly why it can carry the whole
   claim in one centred line instead of a header and a column.

   Everything is visible at rest — name, statement, and the PRICE. Nothing
   about a service sits behind a hover or a click, because the thing a
   visitor most wants to know is the thing most sites make you dig for.

   THE SIGNATURE (after icomat.co.uk's second section, decoded rather than
   guessed at): the statement arrives a word at a time as you scroll, and a
   scattered field of marks converges onto its grid behind it. Both are
   pure f(scroll) off ONE progress value, so the whole thing scrubs
   backwards exactly. Measured off the source: words ramp from 0.2 to 1
   left-to-right; the marks start ±300px out and settle to 0. */

const SAY = "The click, the page it lands on, and the follow-up after.";

/* the phones — one per stage, keyed by slug — live in service-phones.tsx:
   the click's won search, the landing on a phone, the follow-up thread.
   ONE client across all three (Desert Wings), on purpose: the list is
   the funnel, and the funnel is a story — their search won, their page,
   their booking. The roster is the hero's job; this is the demonstration. */

/* five columns of marks at the grid's own positions. The x/y each one
   travels FROM is its own, so the field converges from a scatter rather
   than sliding in as one block. */
const MARKS = [
  { x: -300, dots: [-14, 0, 14] },
  { x: -150, dots: [-10, 0, 10] },
  { x: 0, dots: [-70, 70] },
  { x: 150, dots: [10, 0, -10] },
  { x: 300, dots: [14, 0, -14] },
];

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      el.style.setProperty("--sp", "1");
      el.querySelectorAll(".dr-svc-row").forEach((r) => r.classList.add("is-lit", "is-now"));
      return;
    }

    /* THE ONE PASS THAT CANNOT BE DECLARATIVE, and it is worth saying why
       rather than forcing it through the engine anyway.

       The engine writes ONE progress per element from ONE window. This
       pass needs neither: the spotlight is every ROW's own rect compared
       against one reading line, so rows of unequal height stay correct
       (they are not equal, the images made sure of that), and which row
       is lit depends on which rows sit above it — a relation between
       elements, which one-progress-per-element cannot say.

       Reframing it as index-based CSS would assume equal row heights and
       be wrong the first time a title wraps. So it stays measured, and
       §02 keeps exactly one hand-rolled listener instead of three. */
    const rows = Array.from(
      el.querySelectorAll<HTMLElement>(".dr-svc-list > li")
    );
    const vouch = el.querySelector<HTMLElement>(".dr-vouch");
    const ramp = (v: number) => String(Math.max(0, Math.min(1, v)));
    const lit = () => {
      const vh = innerHeight;

      /* THE SPOTLIGHT. One row is lit at a time: the last one whose top
         has crossed the reading line, 60% of the way down the viewport —
         about where the eye sits while it works down a list. Rows above
         it are READ (is-lit), the one under the line is NOW (is-now),
         rows below wait. This used to be a "travelling light" which,
         once the maths was followed through, sat still at ~92vh — so
         every row took ink the moment it was visible, at the bottom
         edge, and by the time it was read nothing was left to happen
         except the picture opening. That is where the eye went. Now the
         ink lands on the row you are looking at, and only that one. */
      const line = vh * 0.6;
      /* the ramp either side of the crossing — see --spot in dark.css */
      const r = vh * 0.18;
      const ease = (t: number) => t * t * (3 - 2 * t);
      let now: HTMLElement | null = null;
      for (const li of rows) {
        const { top, bottom } = li.getBoundingClientRect();
        /* each row's ARRIVAL, off the same rect — scrubbed, not
           triggered (law 11). Measured on the <li>, which never moves,
           and written there for the row inside to read: the row climbs
           on --rv, and a thing that moves cannot be its own ruler. The
           bottom 22% of the viewport (98% → 76%), so it is done before
           it is read; a later window was tried and read as late. */
        li.style.setProperty("--rv", ramp((vh * 0.98 - top) / (vh * 0.22)));
        /* THE SPOTLIGHT'S SIZE. 1 while the reading line is inside the
           row, ramping in as the top reaches the line and out as the
           bottom leaves it — the row grows as it enters the light and
           shrinks as it leaves, so each stage gets its own moment. The
           product of the two ramps, each centred on its crossing (+0.5),
           so a row is half grown exactly when it takes ink. */
        const grow = Math.max(0, Math.min(1, (line - top) / r + 0.5));
        const shrink = Math.max(0, Math.min(1, (bottom - line) / r + 0.5));
        li.style.setProperty("--spot", (ease(grow) * ease(shrink)).toFixed(3));
        const row = li.firstElementChild as HTMLElement | null;
        if (!row) continue;
        const on = top <= line;
        row.classList.toggle("is-lit", on);
        if (on) now = row;
      }
      for (const li of rows) {
        li.firstElementChild?.classList.toggle(
          "is-now",
          li.firstElementChild === now
        );
      }
      if (vouch) {
        const top = vouch.getBoundingClientRect().top;
        vouch.style.setProperty("--rv", ramp((vh * 0.98 - top) / (vh * 0.22)));
      }
    };
    let lframe = 0;
    const onLit = () => {
      if (!lframe) lframe = requestAnimationFrame(() => { lframe = 0; lit(); });
    };
    addEventListener("scroll", onLit, { passive: true });
    addEventListener("resize", onLit, { passive: true });
    lit();

    return () => {
      removeEventListener("scroll", onLit);
      removeEventListener("resize", onLit);
      if (lframe) cancelAnimationFrame(lframe);
    };
  }, []);

  const words = SAY.split(" ");

  /* the exit ramp: 0 when this section's bottom meets the fold, 1 when
     that bottom reaches the top. Measured from the section's own box,
     which never moves — the card inside it is what fades. */
  return (
    <section
      className="dr-svc"
      ref={ref}
      aria-labelledby="dr-svc-h"
      data-sp
      data-sp-edge="bottom"
      data-sp-from="1"
      data-sp-to="0"
      data-sp-var="--ep"
    >
      {/* the exit rides this, never .dr-svc itself — the section's own rect
          is what the exit progress is measured FROM, and a transformed
          element cannot be its own ruler */}
      {/* the card DECLARES its arrival window; the engine writes --ap and
          the three blocks inside read it at three different rates. Named
          --ap so it cannot collide with the --sp this section still
          computes by hand for the word ramp, or the --ep for its exit. */}
      <div
        className="dr-svc-in"
        data-sp
        data-sp-from="1"
        data-sp-to="0.35"
        data-sp-var="--ap"
        data-sp-lerp="0.1"
      >
      {/* the word ramp's window, declared. Lives on .dr-say rather than the
          section because that is the box it was always measured from — and
          --sp only ever needs to reach the words and the marks, both of
          which are inside it. */}
      <div className="dr-say" data-sp data-sp-from="0.92" data-sp-to="0.3">
        <div className="dr-marks" aria-hidden>
          {MARKS.map((m, i) => (
            <span key={i} className="dr-mark-col">
              {m.dots.map((d, j) => (
                <i
                  key={j}
                  style={
                    { "--dx": `${m.x}px`, "--dy": `${d}px` } as React.CSSProperties
                  }
                />
              ))}
            </span>
          ))}
        </div>

        {/* one word per span so each can carry its own place in the ramp.
            The sentence stays one readable string for a screen reader —
            the spans are inline and the spaces are real. */}
        <h2 className="dr-say-h" id="dr-svc-h">
          {words.map((w, i) => (
            <span
              key={i}
              className="dr-word"
              style={{ "--i": i, "--n": words.length } as React.CSSProperties}
            >
              {w}
            </span>
          ))}
        </h2>
      </div>

      <div className="wrap">
        <ul className="dr-svc-list">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="dr-svc-row">
                <span className="dr-svc-num" aria-hidden>
                  {s.stageIndex}
                </span>

                <span className="dr-svc-body">
                  <span className="t-label dr-svc-stage">{s.stage}</span>
                  {/* the two lines as AUTHORED. Joined into one line the
                      title was a 40px caption beside a moving picture; as
                      the block it was written to be it is the tallest
                      object in the row, and the row is about the service */}
                  <span className="dr-svc-title">
                    {s.title.map((line, i) => (
                      <Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </Fragment>
                    ))}
                  </span>
                  <span className="dr-svc-what">{s.label}</span>
                  <span className="dr-svc-price">{s.heroPrice}</span>
                </span>

                <i className="dr-svc-arrow" aria-hidden>
                  →
                </i>

                {/* THE PHONE. What this stage looks like in a customer's
                    hand — the shipped site's win frame, standing in a tray
                    the row crops it by. Still of its own accord: nothing on
                    it moves with the scroll or on hover (2026-09-06, "it
                    drags my eyes to it"); it only rides the row's own
                    spotlight growth. Decoration to a screen reader: the
                    row's text is the row's name. */}
                {/* a service added to lib/services.ts without a phone here
                    must render a row, not crash the page — the picture is
                    evidence, and evidence is allowed to be missing */}
                {PHONES[s.slug] && (
                  <div className="dr-svc-well" aria-hidden>
                    {PHONES[s.slug]}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Role-and-sector attribution with the repo's placeholder glyph,
            not a name and a face: lib/quotes.ts carries no real person and
            no exact business, so a photo would invent a customer. The slot
            is shaped for the real thing. */}
        <figure className="dr-vouch">
          <span className="dr-vouch-av" aria-hidden>
            <PersonIcon />
          </span>
          <span className="dr-vouch-body">
            <blockquote>{QUOTES[2].text}</blockquote>
            <figcaption>{QUOTES[2].name}</figcaption>
          </span>
        </figure>
      </div>
      </div>
    </section>
  );
}
