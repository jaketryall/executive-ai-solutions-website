import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/work";
import type { Project } from "@/lib/work";
import { Roll } from "@/components/room/nav";

/* §03 · THE WORK, v4 — LEOPARPEIX'S RAIL, ON SCROLL.

   Jake, shown https://www.leoparpeix.com/'s drag-driven project rail:
   "this drag work section … that's the feel I'm going for for the work
   section but activated on scroll instead of drag, the items have like
   vertical parallax and horizontal" → "go". SUPERSEDES v2, THE GALLERY
   (49850bb) — a fixed clipped well scrubbing one contiguous strip with a
   Lenis snap landing. Shown v2's frames, that idea didn't survive contact
   with a real reference: what Jake wanted was leoparpeix's OWN rail, one
   per project, not a shared filmstrip.

   The mechanism below is read from leoparpeix's own bundled code
   (design-dna/decodes/leoparpeix.md §13), not guessed off frames: Vue 3 +
   THREE, DOM proxies UNIFORM 72.569vw × 41.944vw (1.73:1, 20px gap), one
   rail per project. Their hand-driven drag (× 3, a 0.068 follow, a
   0.9/frame coast, a 0.055 snap once the drag force dies) becomes our
   SCROLL passage instead — no drag, no snap, no released gesture to land;
   scroll IS the input, continuously, the whole time.

   THE FORCE (scroll-engine.ts's new `data-sp-force` track) stands in for
   their drag force — attack 0.42 / release 0.065, THEIR two constants —
   saturating on OUR scroll-mark velocity (28px per 60fps frame) rather
   than their raw pointer delta. It drives the one thing their canvas does
   that a position alone cannot: the DEPTH SQUASH (CSS perspective +
   translateZ, room.css) — the only velocity-derived motion in this room,
   everything else here is position.

   THE TWO PARALLAXES (vertical = the block's own scroll passage,
   horizontal = each tile's screen position) are ported straight off
   their fragment shader onto the picture inside its frame — the frame
   itself never parallaxes, exactly as theirs never does either.

   All three numbers — the tile geometry, the two parallaxes, the depth
   math — live in room.css; this file only supplies the DOM and the
   per-project data the CSS reads through `--i`, `--n` and each shot.

   No pin (the block scrolls past like §02's rows), no snap (there is no
   released gesture to land), no per-card entrance settle (there is no
   arrival moment left to settle — the recession is already running the
   instant the block is on screen, so a separate settle has nothing to
   do). Phone + reduced motion: the finger's own rail, a native
   horizontal scroller with snap, no parallax, no depth — R1, nothing may
   move under reduced motion. */

const OURS = "executive-ai-solutions"; // same filter + same reason as v1/v2's comment

type Shot = { src: string; width: number; height: number; alt: string };

const LANDSCAPE_MIN = 1.4;

/* The exact three-more-than-the-cover picks per project (decisions
   2026-09-18 §03 v4) — real shots of that build, never a repeated cover.
   Resolved below against lib/work.ts's own fields (cover/demo/gallery),
   so there is no second copy of any image's width/height/alt anywhere —
   this is a lookup, not a new data file. A project not listed here (none
   currently) falls back to the general rule the picks above were made
   by: cover + the first three distinct landscape (≥1.4:1) figures out of
   demo/gallery, in that order, deduped by src. */
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

export default function WorkSection() {
  const cases = PROJECTS.filter((p) => p.slug !== OURS && p.cover);
  if (!cases.length) return null;

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

      {cases.map((p, k) => {
        const shots = shotsFor(p);
        const headingId = `dr-work-${p.slug}`;
        return (
          <article className="dr-work-block" key={p.slug} aria-labelledby={headingId}>
            {/* THE BAND declares its own passage — leoparpeix's rail is
                41.944vw tall ≈ 0.8vh of scroll at 1440×736, so −0.8 carries
                the rail's own top-to-bottom passage across the fold-to-60vh
                window (an approximation of their fixed geometry, not an
                exact one) — and its own FORCE, the depth squash's only
                input (data-sp-force="28", scroll-engine.ts, cited there). */}
            <div
              className="dr-work-band"
              style={{ "--n": shots.length } as CSSProperties}
              data-sp
              data-sp-edge="top"
              data-sp-from="1"
              data-sp-to="-0.8"
              data-sp-var="--bp"
              data-sp-lerp="0.1"
              data-sp-force="28"
            >
              <ol className="dr-work-rail">
                {shots.map((s, i) => (
                  <li className="dr-work-tile" key={s.src} style={{ "--i": i } as CSSProperties}>
                    <Link
                      href={`/work/${p.slug}`}
                      className="dr-work-card"
                      aria-label={`${p.listName} — see work`}
                    >
                      <span className="dr-work-well">
                        <Image
                          className="dr-work-img"
                          src={s.src}
                          alt={s.alt}
                          width={s.width}
                          height={s.height}
                          sizes="(max-width: 900px) 80vw, 73vw"
                          priority={k === 0 && i === 0}
                        />
                      </span>
                      {i === 0 && (
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
                      )}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {/* the info row — number, name + sector, year, scope, and the
                exit link. Renamed the heading class to .dr-work-title (the
                spec's own sketch reused .dr-work-name from the pill above,
                which would have let this rule's font-size/color win the
                cascade over the pill's and blown the pill's label up to
                body size — two different things, two different classes). */}
            <div className="dr-work-info wrap">
              <span className="t-label dr-work-num">{String(k + 1).padStart(2, "0")}</span>
              <h3 className="dr-work-title" id={headingId}>
                {p.listName} <span className="dr-work-type">{p.sector}</span>
              </h3>
              <span className="t-label dr-work-date">{p.year}</span>
              <span className="t-label dr-work-scope">{p.kind}</span>
              <Link className="dr-work-open" href={`/work/${p.slug}`}>
                See the case <i aria-hidden>→</i>
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}
