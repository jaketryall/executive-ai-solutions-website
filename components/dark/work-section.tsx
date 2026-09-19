import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/work";
import type { Project } from "@/lib/work";
import { Roll } from "@/components/room/nav";

/* §03 · THE WORK, v5 — ONE ROW, STICKY. Supersedes v4's three blocks
   (6b3d1d1) on Jake's call, shown v4's frames: "okay so better i just
   want one row though sticky, that's good though".

   Everything v4 MEASURED still stands and is not re-derived here — the
   comments beside .dr-work-img, .dr-work-tile and .dr-work-pill in
   room.css are UNCHANGED (leoparpeix.md §13's two parallaxes, the
   `--force` depth squash, the pill/frost recipe). What changes is the
   SHAPE: nine shots (three cases × cover-plus-two) become ONE rail
   inside a `position: sticky` band, instead of three rails that scroll
   past one after another like §02's rows.

   THE PIN is the room's own no-library trick, borrowed from §04
   (`.dr-runs-stage` / `.dr-runs-pin`, room.css ~2147): a tall `relative`
   wrapper (100svh + TRAVEL_SVH of extra scroll) holds a `sticky top: 0`
   panel, so the panel holds still while the wrapper's own declared
   scroll window drives everything inside it. No pin library, same as
   the rest of the room.

   TRAVEL_SVH = 360 replaces v4's per-block "~0.8vh of passage" — with
   nine tiles sharing one rail instead of three separate 3-4-tile rails,
   the drift (8 pitches at 1440) needs a longer runway to still read as
   a ride and not a flick; 360svh keeps the same ≈3× drift-to-travel
   feel v4 measured (verified live against the pass criteria this step
   was built against, not assumed). `data-sp-to` below and the `--travel`
   custom property are BOTH derived from this one constant so they
   cannot silently disagree — the engine reads `data-sp-to` as a raw
   attribute string (scroll-engine.ts's `read()`, `el.getAttribute(...)`)
   and has no way to look at the element's own rendered CSS height to
   infer it, so there is no other way to keep the two in lock-step than
   sharing one source number.

   THE INFO ROW is new: instead of one row per block (v4), the three
   rows sit absolutely stacked under the one band and crossfade to
   whichever project is under the centre — see room.css's
   `.dr-work-info` comment for how `--c` (each row's own centre tile,
   written from here) and the stage's `--idx` decide which row is on
   top and clickable.

   No snap (scroll is the input, not a released drag), no per-card
   entrance settle (unchanged from v4 — the recession already animates
   arrival). Phone + reduced motion: the finger's own rail, unchanged
   from v4 (a native x-scroller with snap, no parallax, no depth), with
   the three info rows stacked in flow instead of crossfading. */

const OURS = "executive-ai-solutions"; // same filter + same reason as v1/v2/v4's comment
const SHOTS_PER_PROJECT = 3; // cover + two — down from v4's up-to-4, so three cases make one nine-tile rail
const TRAVEL_SVH = 360; // the pinned band's scroll travel, in svh — see file header for why this one number feeds both the CSS var and data-sp-to

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

export default function WorkSection() {
  const cases = PROJECTS.filter((p) => p.slug !== OURS && p.cover);
  if (!cases.length) return null;

  // ONE flat rail: each case's first SHOTS_PER_PROJECT shots, in project
  // order, each tile knowing its case index (k, for --c below) and
  // whether it's that case's first tile (the pill).
  const tiles: Tile[] = cases.flatMap((p, k) =>
    shotsFor(p)
      .slice(0, SHOTS_PER_PROJECT)
      .map((shot, i) => ({ shot, project: p, k, first: i === 0 }))
  );

  return (
    <section className="dr-work" aria-labelledby="dr-work-h">
      <header className="dr-work-head wrap">
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
        style={{ "--n": tiles.length, "--travel": `${TRAVEL_SVH}svh` } as CSSProperties}
        data-sp
        data-sp-edge="top"
        data-sp-from="0"
        data-sp-to={String(-(TRAVEL_SVH / 100))}
        data-sp-var="--bp"
        data-sp-lerp="0.1"
        data-sp-force="28"
      >
        <div className="dr-work-pin">
          <div className="dr-work-band">
            <ol className="dr-work-rail">
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
