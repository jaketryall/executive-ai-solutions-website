"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Snap from "lenis/snap";
import type Lenis from "lenis";
import { PROJECTS } from "@/lib/work";
import { Roll } from "@/components/room/nav";
import { onLenis } from "@/components/anim/lenis-store";

/* §03 · THE WORK, v2 — THE GALLERY.

   SUPERSEDES the pinned strip of the same day (ec708b7, one card centred
   in its own viewport-wide item, a dwell/slide/dwell shape per window).
   Jake, shown its frames: "this feels very weird" → slide or stop? "both"
   → "no i want to find some sort of way to do the horizontal." The
   frames named the actual fault: mid-slide the leaving and arriving
   cards sat 700px apart across bare canvas (a void), the slide itself
   spent only 162px of scroll dragging 1440px sideways (a flick, not a
   scrub), and the dwells before/after were dead time — nothing on
   screen was doing anything.

   v2 keeps the hold (a card is worth being still for) but rebuilds what
   fills it, Apple's way: a FIXED, CLIPPED 3:2 frame (Cosmos's well)
   holds a CONTIGUOUS strip of every site, 20px apart (Apple's own gap,
   decodes/apple-highlights.md §1) — there is no void, because the
   leaving and arriving cards are touching, edge to edge, inside one
   window. The strip is scrubbed CONTINUOUSLY — `--rx` = wp × steps, no
   dwell/slide/dwell shape this time (law 11: the STRUCTURE is scrubbed)
   — at ~1.4:1 (0.7svh of scroll per card at 1440×736; 826px of strip
   per 630px of scroll ≈ 1.31:1 at 1440×900), so the strip never goes
   through a flick: it moves exactly as fast as the wheel does, the
   whole time.

   THE SNAP is the landing Apple's own carousel has (decode §2: a
   deterministic ~1000ms cubic-bezier(.42,0,.58,1) tween, visually
   ease-in-out) — when the scroll STOPS, `lenis/snap` (proximity, 260px,
   250ms debounce) eases the scroll position the rest of the way onto
   the nearest card on that same curve. This is Lenis moving the SCROLL
   POSITION, not a tween on the strip itself — the strip stays a pure
   function of scroll throughout (law 11 again: the scrub is ours, the
   landing is theirs), so scrubbing backwards through a snapped position
   still runs it backwards exactly. CSS scroll-snap was not used because
   Lenis already owns the wheel on desktop (smooth-scroll.tsx) and a
   second thing trying to own the same input fights it.

   Lenis is reached through `components/anim/lenis-store.ts`
   (setLenis/onLenis) rather than a React context — the root layout owns
   the one instance, and a context would mean plumbing it through every
   layout in between for a single section that wants to read it.

   Apple's PAGER sits under the frame: dots, the current one stretching
   to a 48px bar as its card lands, scrubbed off the same `--rx` a click
   already uses to move the strip. YEAR / NICHE are FIXED on the page's
   own outer measure at the frame's mid-height (unchanged from v1:
   Cosmos's `.works_infos` sits on their wider `.container-large` while
   `.works_card` is centred and narrower inside it) — three sets
   overlapping and crossfading on the CUBE of their card's arrival
   (Apple's own caption opacity curve, §2 of the decode). They are fixed
   rather than riding the strip because Apple's captions don't travel
   with the card either — only the incoming/outgoing pair ever
   crossfades; everything else is simply off.

   THE ENTRANCE is still Cosmos's settle (decode §3: wrap 1.10→1, image
   1.20→1, independently, chased at 0.35 — their measured per-frame
   retention, ≈35–40% of the remaining distance closed a frame) — but it
   now runs ONCE, measured off the FRAME's own top as the whole section
   arrives, not per card: the frame never leaves the screen once the
   gallery starts scrubbing, so there is nothing left for a per-card
   settle to do.

   Phone + reduced motion: the column, 1:1 cards (Cosmos's own phone),
   8px gaps, a static per-card YEAR/NICHE row (`.dr-work-meta`) since the
   fixed desktop infos have nothing left to crossfade against once the
   cards are stacked — and no Snap: there is no Lenis instance on touch
   at all (smooth-scroll.tsx is desktop-only), so there is nothing to
   hand one to. */

const OURS = "executive-ai-solutions"; // same filter + same reason as v1's comment
const STEP = 0.7; // svh of scroll per card change — 764px of strip per 515px of scroll ≈ 1.48:1 at 1440×736

// Apple's own step curve: CSS ease-in-out over ~1s (decodes/apple-highlights.md
// §3) — this is the SNAP's landing, not the scrub, which stays f(scroll).
const stepEase = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function WorkSection() {
  const cases = PROJECTS.filter((p) => p.slug !== OURS && p.cover);
  const n = cases.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // reduced motion never subscribes: no Snap, no chase — the CSS media
    // query alone puts the section in its resolved, still, column state
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    const off = onLenis((lenis) => {
      // kept for `go()` below, whether or not a snap gets built off it
      lenisRef.current = lenis;
      cleanup();
      cleanup = () => {};
      if (!lenis) return; // touch: no Lenis, no snap — the column has no scrub to land

      const snap = new Snap(lenis, {
        type: "proximity",
        distanceThreshold: 260,
        debounce: 250,
        duration: 1,
        easing: stepEase,
      });
      const removers: Array<() => void> = [];
      const place = () => {
        removers.splice(0).forEach((r) => r());
        // the stage never transforms — its own top is a stable document position
        const top = stage.getBoundingClientRect().top + window.scrollY;
        for (let i = 0; i < n; i++) {
          removers.push(snap.add(top + i * STEP * window.innerHeight));
        }
      };
      place();
      // the stage's document offset moves whenever anything above it reflows
      const ro = new ResizeObserver(place);
      ro.observe(document.body);
      cleanup = () => {
        ro.disconnect();
        removers.forEach((r) => r());
        snap.destroy();
      };
    });
    return () => {
      off();
      cleanup();
    };
  }, [n]);

  if (!n) return null;
  const steps = n - 1;

  const go = (i: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const top = stage.getBoundingClientRect().top + window.scrollY + i * STEP * window.innerHeight;
    const l = lenisRef.current;
    if (l) l.scrollTo(top, { duration: 1, easing: stepEase });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      className="dr-work"
      aria-labelledby="dr-work-h"
      style={{ "--n": n, "--steps": steps } as CSSProperties}
    >
      <header className="dr-work-head wrap">
        {/* the one triggered vocabulary (law 11), same as every other section head */}
        <span className="t-label dr-work-kicker" data-wipe>
          Proof
        </span>
        <h2 className="dr-work-h" id="dr-work-h" data-wipe data-wipe-delay="150">
          The sites we built.
        </h2>
      </header>

      {/* THE STAGE declares the whole pinned travel on its own top edge: 0 at the
          fold, one more 0.7vh window per card after the first. Chased at the
          room's default 0.1: the STRUCTURE (which card is centred) follows scroll
          input the way everything else in the room does. */}
      <div
        className="dr-work-stage"
        ref={stageRef}
        data-sp
        data-sp-edge="top"
        data-sp-from="0"
        data-sp-to={String(-steps * STEP)}
        data-sp-var="--wp"
        data-sp-lerp="0.1"
      >
        <div className="dr-work-pin">
          <div className="dr-work-gallery">
            {/* THE FRAME owns `--ap`, Cosmos's settle, measured off the FRAME's
                OWN top (1 at the fold, 0.27 at 27% of viewport height) — once,
                as the whole gallery arrives, not per card. Chased at 0.35:
                Cosmos's measured per-frame retention, snappier than the room's
                default 0.1 because this is a settle happening in place, not a
                structural position following the scrollbar. */}
            <div
              className="dr-work-frame"
              data-sp
              data-sp-from="1"
              data-sp-to="0.27"
              data-sp-var="--ap"
              data-sp-lerp="0.35"
            >
              <div className="dr-work-wrap">
                <ol className="dr-work-strip">
                  {cases.map((p, i) => (
                    <li className="dr-work-slide" key={p.slug} style={{ "--i": i } as CSSProperties}>
                      <Link
                        href={`/work/${p.slug}`}
                        className="dr-work-card"
                        aria-label={`${p.listName} — see work`}
                      >
                        <span className="dr-work-well">
                          <Image
                            className="dr-work-img"
                            src={p.cover.src}
                            alt={p.cover.alt}
                            width={p.cover.width}
                            height={p.cover.height}
                            sizes="(max-width: 900px) 92vw, 56vw"
                          />
                        </span>
                        <span
                          className="dr-work-pill"
                          style={
                            {
                              "--frost": `url(${p.clip?.poster ?? p.cover.src})`,
                            } as CSSProperties
                          }
                        >
                          {p.clip && (
                            <img
                              className="dr-work-thumb"
                              src={p.clip.poster}
                              alt=""
                              width={36}
                              height={36}
                              loading="lazy"
                            />
                          )}
                          <span className="dr-work-name">{p.listName}</span>
                          <i className="dr-work-sep" aria-hidden />
                          <span className="dr-work-see">
                            <Roll label="See work" />
                          </span>
                        </span>
                      </Link>

                      {/* the column's own YEAR/NICHE — the fixed desktop infos
                          below have nothing to crossfade against once cards are
                          stacked, so each card carries its own here instead;
                          hidden at ≥901px */}
                      <div className="dr-work-meta">
                        <span className="dr-work-info">
                          <span className="t-label">Year</span>
                          <span>{p.year}</span>
                        </span>
                        <span className="dr-work-info">
                          <span className="t-label">Niche</span>
                          <span>{p.sector}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* YEAR / NICHE ride the page's own outer measure (`.wrap`), not the
                frame's narrower width — Cosmos's own `.works_infos` does the same
                against `.container-large` while `.works_card` sits centred and
                smaller inside it. `--i` (set per set) and `--rx` (set on the
                stage, inherited down) together give each set the CUBE of its
                arrival — Apple's own caption fade — so only the centred set is
                readable and the rest are near-invisible mid-slide. */}
            <div className="dr-work-infos wrap" aria-live="polite">
              {cases.map((p, i) => (
                <div className="dr-work-info-set" key={p.slug} style={{ "--i": i } as CSSProperties}>
                  <span className="dr-work-info">
                    <span className="t-label">Year</span>
                    <span>{p.year}</span>
                  </span>
                  <span className="dr-work-info">
                    <span className="t-label">Niche</span>
                    <span>{p.sector}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Apple's pager: one dot per card, scrubbed on the same --rx a
                click already moves; click scrolls (via Lenis when it exists,
                native smooth scroll on touch — though the pager itself is
                hidden there, since the whole gallery is a column). */}
            <ol className="dr-work-pager" aria-label="Work">
              {cases.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    className="dr-work-dot"
                    style={{ "--i": i } as CSSProperties}
                    aria-label={`Show ${p.listName}`}
                    onClick={() => go(i)}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
