"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Snap from "lenis/snap";
const SNAP_OFF = true; // 2026-09-20, see the effect below
import { PROJECTS } from "@/lib/work";
import type { Project } from "@/lib/work";
import { Roll } from "@/components/room/nav";
import { onLenis } from "@/components/anim/lenis-store";

/* §03 · THE WORK, v5 → THE RAIL STEPS (2026-09-19). Supersedes v5's own
   continuous scrub (caa3f58, "one row, sticky") on Jake's call: "can we
   go back to the work rail. im thinking i want it to be a little more
   of a controlled motion like it kinda makes you go one at a time."

   EVERYTHING BELOW THE PIN is v5's, UNCHANGED, and its own comments stay
   in place in room.css: THE TWO PARALLAXES and THE PILL are still
   leoparpeix.md §13's math and the 2026-09-06 no-backdrop-filter law.
   What changes is HOW `--bp` (the engine's own 0→1 across the whole
   pinned travel) turns into the rail's position — see room.css's
   `.dr-work-stage` comment (`--t`/`--s<i>`/`--e<i>`/`--rx`/`--sl`) for
   the map itself; this file only owns the PIN, the TRAVEL constant and
   the LANDING.

   THE PIN is unchanged from v5 (the room's own no-library trick,
   borrowed from §04's `.dr-runs-stage`/`.dr-runs-pin`): a tall
   `relative` wrapper (100svh + TRAVEL_SVH of extra scroll) holds a
   `sticky top: 0` panel.

   THE TRAVEL grows from v5's 360svh to 420svh: eight windows of 52.5svh
   each (nine tiles, `--n`−1 plateaus) so a dwell / smoothstepped slide /
   dwell shape has enough runway per window to read as a real hold and a
   real move rather than the old continuous ride compressed the same
   distance. `data-sp-to` below and the `--travel` custom property are
   BOTH derived from this one constant so they cannot silently disagree
   — the engine reads `data-sp-to` as a raw attribute string
   (scroll-engine.ts's `read()`, `el.getAttribute(...)`) and has no way
   to look at the element's own rendered CSS height to infer it.

   THE LANDING is v2's own Snap (`lenis/snap`, 49850bb: proximity,
   debounce, Apple's ease-in-out over 1s), lifted back — it was retired
   when v4 traded the gallery's released-drag feel for scroll-as-input,
   but a STEPPED rail is exactly the shape a snap belongs on again: the
   points sit at each plateau's document position (stage top + i/(n−1)
   of the travel), so scrolling to rest anywhere mid-slide eases the
   rest of the way onto the nearer plateau. This is Lenis moving the
   SCROLL POSITION — the rail stays a pure function of it throughout
   (law 11: the structure is scrubbed, only the landing tweens, and it
   tweens `scrollY`, never the rail's own transform). No snap on touch
   (no Lenis instance there — smooth-scroll.tsx is desktop-only) or
   under 900px (the media query at the end of room.css's §03 block puts
   the band back in the finger's own native, self-snapping scroller).

   THE INFO ROW is unchanged from v5: three rows absolutely stacked
   under the band, crossfading to whichever project is under the centre
   off the stage's `--idx` (now the stepped `--rx`, not the old
   continuous `bp × (n−1)`) — see room.css's `.dr-work-info` comment. */

const OURS = "executive-ai-solutions"; // same filter + same reason as v1/v2/v4's comment
const SHOTS_PER_PROJECT = 3; // cover + two — down from v4's up-to-4, so three cases make one nine-tile rail
const TRAVEL_SVH = 420; // the pinned band's scroll travel, in svh — 8 windows of 52.5svh (see file header)

// Apple's own step curve: CSS ease-in-out over ~1s (decodes/apple-highlights.md
// §3) — this is the SNAP's landing only, never the scrub, which stays f(scroll).
const stepEase = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

type Shot = { src: string; width: number; height: number; alt: string };

const LANDSCAPE_MIN = 1.4;

/* The exact three-more-than-the-cover picks per project (decisions
   2026-09-18 §03 v4) — real shots of that build, never a repeated cover.
   Resolved below against lib/work.ts's own fields (cover/demo/gallery),
   so there is no second copy of any image's width/height/alt anywhere —
   this is a lookup, not a new data file. A project not listed here (none
   currently) falls back to the general rule the picks above were made
   by: cover + the first three distinct landscape (≥1.4:1) figures out of
   demo/gallery, in that order, deduped by src. v5 only takes the first
   SHOTS_PER_PROJECT (3) of whichever list this resolves to. */
const SHOT_SRCS: Record<string, string[]> = {
  "desert-wings": [
    "/work/desert-wings-tall.png",
    "/work/desert-wings-fleet.png",
    "/work/live/dw-programs.jpg",
    "/work/desert-wings-team.png",
  ],
  aahg: [
    "/work/aahg-hero.jpg",
    "/work/aahg-programs.jpg",
    "/work/aahg-numbers.jpg",
    "/work/aahg-support.jpg",
  ],
  "riled-up": [
    "/work/riled-hero.jpg",
    "/work/riled-booking.jpg",
    "/work/riled-feature.jpg",
  ],
};

function shotsFor(p: Project): Shot[] {
  const pool: Shot[] = [p.cover, p.demo, ...p.gallery];
  const wanted = SHOT_SRCS[p.slug];
  if (wanted) {
    return wanted
      .map((src) => pool.find((s) => s.src === src))
      .filter((s): s is Shot => Boolean(s));
  }
  const seen = new Set<string>();
  return pool
    .filter((s) => {
      if (seen.has(s.src) || s.width / s.height < LANDSCAPE_MIN) return false;
      seen.add(s.src);
      return true;
    })
    .slice(0, 4);
}

type Tile = { shot: Shot; project: Project; k: number; first: boolean };

/* `paper` (trial, 2026-09-21 — Jake: "do work after the second section
   with white background flip like this site", landonorris.com): the
   room's --flip is scrubbed dark → light across the first third of this
   rail (the clock below, `--fp` on the root; room.css "PAPER" for the
   mixing and why a third), and Desert Wings — the one mid-tone case,
   whose shots read as mush on a mid-grey ground — goes LAST, so its
   pictures arrive in the light. The two dark cases lead, dark panels on
   the dark room turning to dark panels on paper. */
export default function WorkSection({ paper = false }: { paper?: boolean }) {
  const cases = PROJECTS.filter((p) => p.slug !== OURS && p.cover);
  if (paper) {
    const dw = cases.findIndex((p) => p.slug === "desert-wings");
    if (dw >= 0) cases.push(...cases.splice(dw, 1));
  }

  // ONE flat rail: each case's first SHOTS_PER_PROJECT shots, in project
  // order, each tile knowing its case index (k, for --c below) and
  // whether it's that case's first tile (the pill).
  const tiles: Tile[] = cases.flatMap((p, k) =>
    shotsFor(p)
      .slice(0, SHOTS_PER_PROJECT)
      .map((shot, i) => ({ shot, project: p, k, first: i === 0 }))
  );
  const n = tiles.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);
  /* the two clocks' pinned ends are the band's own geometry, not a
     constant: while pinned its top sits at the pin's sticky offset plus
     its own offset inside the pin (175px at 1440x900 — the approach
     ends THERE, not at 0), and its bottom that much lower by its own
     height (where the exit begins). Both written as screen fractions on
     every resize. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const fit = () => {
      const band = rail.parentElement;
      const pin = band?.closest<HTMLElement>(".dr-work-pin");
      if (!band || !pin) return;
      const vh = window.innerHeight;
      const pinnedTop = (parseFloat(getComputedStyle(pin).top) || 0) + band.offsetTop;
      band.setAttribute("data-sp-to", (pinnedTop / vh).toFixed(4));
      rail.setAttribute("data-sp-from", ((pinnedTop + band.offsetHeight) / vh).toFixed(4));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // THE LANDING — see the file header. Hooks stay unconditional (n can
  // be 0 on a projects-less build) so the early `if (!n) return null`
  // below has to come AFTER this, not before it.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || n < 2) return;
    /* THE LANDING IS OFF (2026-09-20 — Jake: "just the horizontal
       parallax is fine and that way we dont have to do the one at a
       time thing too"): the rail is continuous again (room.css, --rx =
       --t), so there are no plateaus to land on. The snap stays written
       for the day it comes back; it never subscribes. */
    if (SNAP_OFF) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // under 900px the band is the finger's own native, self-snapping
    // scroller (room.css's §03 media query) — a second, JS snap here
    // would fight it, so this never subscribes at that width at all
    if (window.matchMedia("(max-width: 900px)").matches) return;

    let cleanup = () => {};
    const off = onLenis((lenis) => {
      cleanup();
      cleanup = () => {};
      if (!lenis) return; // touch: no Lenis, nothing to hand a snap

      const windowPx = ((TRAVEL_SVH / 100) * window.innerHeight) / (n - 1);
      const snap = new Snap(lenis, {
        type: "proximity",
        distanceThreshold: windowPx / 2 + 20, // half a window + 20px (~213 at 736)
        debounce: 250,
        duration: 1,
        easing: stepEase,
      });
      const removers: Array<() => void> = [];
      const place = () => {
        removers.splice(0).forEach((r) => r());
        // the stage never transforms — its own top is a stable document position
        const top = stage.getBoundingClientRect().top + window.scrollY;
        const travelPx = (TRAVEL_SVH / 100) * window.innerHeight;
        for (let i = 0; i < n; i++) {
          removers.push(snap.add(top + (i / (n - 1)) * travelPx));
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

  if (!cases.length) return null;

  return (
    <section className="dr-work" aria-labelledby="dr-work-h">
      <header
        className="dr-work-head wrap"
        data-sp
        data-sp-from="1"
        data-sp-to=".45"
        data-sp-var="--write"
      >
        {/* THE SCRAWL (trial `scrawl`, room.css — Lando's "Collabs"): the
            section's nickname hand-written in the accent, giant, tilted,
            BEHIND the formal head, and it WRITES ITSELF on scroll — a
            left-to-right clip driven by --write (0 with the head at the
            fold, 1 with it at 45% of the screen), so the pen is scroll.
            aria-hidden: the kicker below says the same word for readers. */}
        <span className="dr-work-scrawl" aria-hidden>Proof</span>
        {/* the one triggered vocabulary (law 11), same as every other section head */}
        <span className="t-label dr-work-kicker" data-wipe>
          Proof
        </span>
        <h2 className="dr-work-h" id="dr-work-h" data-wipe data-wipe-delay="150">
          The sites we built.
        </h2>
      </header>

      {/* THE STAGE declares the pinned travel (TRAVEL_SVH, both here and
          in --travel — see the file header for why one constant feeds
          both) and its own force track, the depth squash's only input
          (data-sp-force="28", scroll-engine.ts, cited there — unchanged
          from v4 bar which element it now lives on). */}
      <div
        className="dr-work-stage"
        ref={stageRef}
        style={{ "--n": n, "--travel": `${TRAVEL_SVH}svh` } as CSSProperties}
        data-sp
        data-sp-edge="top"
        data-sp-from="0"
        data-sp-to={String(-(TRAVEL_SVH / 100))}
        data-sp-var="--bp"
        data-sp-lerp="0.2" /* .2, not the room's .1: the chase is part of the swipe's delay (Jake, 2026-09-19); leoparpeix follows at .068 per frame on a 60fps clock — ours is the same order once the dwell is out of the way */
        /* data-sp-force="28" — the squash's input, off with the squash (2026-09-20) */
      >
        {/* THE PAPER CLOCK (trial, see the component's note): a point at
            the stage's top — the pin's own start — writing `--fp` 0 → 1 on
            the ROOT over the first 60% of the travel: 2.5 screens, which
            is Lando's own distance (his fade spans his whole rail, 2243px
            at 900 tall; a third of ours read fast — Jake: "make the fade
            slower like lando"). */}
        {paper && (
          <i
            className="dr-paper-clock"
            aria-hidden
            data-sp
            data-sp-edge="top"
            data-sp-from="0"
            data-sp-to={String(-(TRAVEL_SVH * 0.6) / 100)}
            data-sp-var="--fp"
            data-sp-target=".dr-root"
            data-sp-lerp="0.1"
            data-sp-step="0.03125"
          />
        )}
        <div className="dr-work-pin">
          {/* THE LIGHTS IN THE VOID (2026-09-21, Jake: "maybe even add blue
              glows somewhere"): three cyan lamps behind the rail, INSIDE
              the pin so they hold the screen with it for the whole
              travel — each coming and going on its own slow cycle
              (room.css, dr-lamp), one behind the head, one low left, one
              right, under the band. */}
          <div className="dr-lamps" aria-hidden>
            <i className="dr-lamp dr-lamp--1" />
            <i className="dr-lamp dr-lamp--2" />
            <i className="dr-lamp dr-lamp--3" />
          </div>
          {/* VERTICAL PARALLAX (2026-09-20 — Jake: "can we give the photos
              vertical parallax as well like when everything is moving
              vertically"): two more clocks, for the moments the band
              itself moves. --ap: the band's top from the fold to the top
              of the screen (0 → 1) — the approach, before the pin. --xp:
              the band's bottom from its pinned height to the top of the
              screen (0 → 1) — the exit, after the pin; its start is the
              band's own height as a fraction of the screen, written by
              the effect below on every resize. The pictures read
              `--vy = xp − (1 − ap)` (room.css): they trail the page's
              rise on the way in, and again on the way out. */}
          <div
            className="dr-work-band"
            data-sp
            data-sp-edge="top"
            data-sp-from="1"
            data-sp-to="0"
            data-sp-var="--ap"
          >
            <ol
              className="dr-work-rail"
              ref={railRef}
              data-sp
              data-sp-edge="bottom"
              data-sp-from="0.7"
              data-sp-to="0"
              data-sp-var="--xp"
              data-sp-target=".dr-work-band"
            >
              {tiles.map((t, i) => (
                <li
                  className="dr-work-tile"
                  key={`${t.project.slug}-${t.shot.src}`}
                  style={{ "--i": i } as CSSProperties}
                >
                  <Link
                    href={`/work/${t.project.slug}`}
                    className="dr-work-card"
                    aria-label={`${t.project.listName} — see work`}
                  >
                    <span className="dr-work-well">
                      <Image
                        className="dr-work-img"
                        src={t.shot.src}
                        alt={t.shot.alt}
                        width={t.shot.width}
                        height={t.shot.height}
                        sizes="(max-width: 900px) 80vw, 73vw"
                        priority={i === 0}
                      />
                    </span>
                    {t.first && (
                      <span
                        className="dr-work-pill"
                        style={
                          {
                            "--frost": `url(${t.project.clip?.poster ?? t.project.cover.src})`,
                          } as CSSProperties
                        }
                      >
                        {/* the case's number — shown only by trial `frost`
                            (room.css), where the pill becomes the tile's
                            frosted caption strip */}
                        <span className="dr-work-pill-num t-label" aria-hidden>
                          {String(cases.findIndex((p) => p.slug === t.project.slug) + 1).padStart(2, "0")}
                        </span>
                        {t.project.clip && (
                          <img
                            className="dr-work-thumb"
                            src={t.project.clip.poster}
                            alt=""
                            width={36}
                            height={36}
                            loading="lazy"
                          />
                        )}
                        <span className="dr-work-name">{t.project.listName}</span>
                        <i className="dr-work-sep" aria-hidden />
                        <span className="dr-work-see">
                          <Roll label="See work" />
                        </span>
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {/* THE INFO ROW — three rows absolutely stacked, crossfading to
              whichever case is under the centre (room.css's
              `.dr-work-info`: --c is this row's own centre tile index in
              the flat rail above). */}
          <div className="dr-work-infos wrap">
            {cases.map((p, k) => (
              <div
                className="dr-work-info"
                key={p.slug}
                style={{ "--c": k * SHOTS_PER_PROJECT + 1 } as CSSProperties}
              >
                <span className="t-label dr-work-num">{String(k + 1).padStart(2, "0")}</span>
                <h3 className="dr-work-title">
                  {p.listName} <span className="dr-work-type">{p.sector}</span>
                </h3>
                <span className="t-label dr-work-date">{p.year}</span>
                <span className="t-label dr-work-scope">{p.kind}</span>
                {/* THE LIVE LINK (2026-09-18): the one word that makes the
                    rail unfakeable — a site they can open in a new tab. The
                    case is the story; the live site is the proof. */}
                {p.url && (
                  <a className="dr-work-open dr-work-live" href={p.url} target="_blank" rel="noopener">
                    Live <i aria-hidden>↗</i>
                  </a>
                )}
                <Link className="dr-work-open" href={`/work/${p.slug}`}>
                  See the case <i aria-hidden>→</i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
