"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/work";
import { Roll } from "@/components/room/nav";

/* §03 · THE WORK — Cosmos's card, Apple's step, on scroll

   SUPERSEDES the three-card proof row (proof-section.tsx, 0050b34 →
   29ae1d2). Jake, looking at both references: "i really like that
   shrinking entrance … i like the card in the middle … i prefer apple's
   highlight section feel, on scroll, horizontal … no neighbours peeking
   … the year and niche on the sides, the little see work pill on the
   image … when i hover on that pill the See work text should go up and
   See work in a different colour should come underneath it."

   THE LAYOUT is Cosmos's works section, measured live
   (decodes/cosmos-works.md §2): one centred 3:2 well at a time, 20px
   radius, a glass label 32px inside the image's top, YEAR / NICHE on the
   page's outer measure at the card's mid-height — not on the card's own
   (narrower) width, exactly as Cosmos's `.works_infos` sits on its wider
   `.container-large` while `.works_card` is centred inside it.

   THE ENTRANCE is Cosmos's settle (§3 of the same decode): the wrap
   scales 1.10→1, the image 1.20→1, independently — the well clips the
   surplus so the picture is always oversized inside its frame and simply
   relaxes into it. Cosmos runs this as one card arrives and PINS while
   the next deals on top of it (a real `position: sticky` stack, replayed
   both directions). We do not have their vertical list — Apple's
   horizontal step (below) already claims the scroll axis — so the same
   settle is measured off THE CARD'S OWN scroll position instead of a
   sticky hand-off: `--ap` runs 1 → 0.27 as the card's top crosses the
   fold down to 27% of viewport height. That range, not 1→0, is
   deliberate: Cosmos's whole 736px settle happens while the card is
   still on screen (their card pins at `top: 128px`, well inside the
   viewport), so ours has to finish while the card is still visible too —
   a track that ran to 0 would still be settling once the card was
   already centred and readable, which is exactly the "finishing late"
   failure the room's own About section hit once already (decisions.md,
   2026-09-08). THE DECK — Cosmos's next card literally dealing on top of
   the settled one — is NOT taken (Jake: "i dont like their effect of the
   deck coming up"); Apple's step replaces it.

   THE STEP is Apple's highlights gallery, turned from a click/autoplay
   carousel into a scroll-scrubbed one (decodes/apple-highlights.md §2):
   one card fills the frame at a time, neighbours never peek (Jake's own
   requirement — Apple's actually DO peek 70px each side; ours pin to
   0/100vw instead), and the advance is their measured
   cubic-bezier(.42,0,.58,1) — visually ease-in-out — with a dwell before
   and after so a card is simply THERE for a beat, not perpetually mid-
   transition. Apple's curve is a deterministic 1000ms tween per click;
   ours is scrubbed, so the same shape is re-expressed as a function of
   scroll fraction: `--wp` runs 0 → 1 across each window and the
   stylesheet turns that into a smoothstep (s²(3−2s), the standard
   ease-in-out-shaped polynomial) so dwell (0–.3), slide (.3–.7) and
   dwell (.7–1) read the same as Apple's timing curve without a duration
   to tune. --steps windows are summed into one `--rx` (the rail's
   translate, in units of "cards"), so N cards need only N−1 windows and
   the formula does not change if a case is added or removed from
   lib/work.ts.

   THE STAGE is the room's own sticky-pin-without-a-library pattern
   (room.css `.dr-runs-stage`/`.dr-runs-pin`, decisions.md 2026-09-06):
   a tall stage, a sticky panel inside it, one declared window on the
   stage's own top edge driving everything downstream — never a pin
   library, never a second measurement pass.

   THE PILL has the hover Cosmos's own label lacks entirely (decode §5:
   "there is no hover effect on these cards at all") — Jake asked for
   one: the room's own per-letter Roll (components/room/nav.tsx), the
   second copy tinted with --work-see-alt so "See work" rolls up and a
   differently-coloured "See work" rises in behind it, on the pill, not
   the whole card. NO backdrop-filter on the pill (2026-09-06 law:
   "nothing composited at rest inside a translating card") — the frost is
   a blurred COPY of the project's own poster/cover under an ink tint, so
   it reads as glass without ever re-sampling a live layer while the card
   is still moving through its entrance.

   THE CLIPS ARE NOT IN THE CARDS. lib/work.ts's `clip`s are the 600×600
   roster clips used elsewhere on the homepage; upscaled into an ~800px
   well they would soften badly, so the pill's thumbnail is the clip's
   poster frame (a still) and the well itself always shows the cover
   photograph. Per-project cuts sized for this well are future work. */

const OURS = "executive-ai-solutions"; // same filter + same reason as the retired file's comment
const STEP = 0.55; // svh of scroll per card change — one window, Apple's dwell/slide/dwell shape

export default function WorkSection() {
  const cases = PROJECTS.filter((p) => p.slug !== OURS && p.cover);
  const n = cases.length;
  if (!n) return null;
  const steps = n - 1;

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

      {/* THE STAGE declares the whole pinned travel on its own top edge:
          0 at the fold, one more 0.55vh window per card after the first.
          `--wp` feeds `.dr-work-rail`'s own --t below — one number drives
          the rail's translate AND every card's arrival marker. Chased at
          the room's default 0.1: the STRUCTURE (which card is centred)
          should follow scroll input the way everything else in the room
          does, unlike the entrance settle below, which is measured off
          the card's own geometry and wants Cosmos's snappier chase. */}
      <div
        className="dr-work-stage"
        data-sp
        data-sp-edge="top"
        data-sp-from="0"
        data-sp-to={String(-steps * STEP)}
        data-sp-var="--wp"
        data-sp-lerp="0.1"
      >
        <div className="dr-work-pin">
          <ol className="dr-work-rail">
            {cases.map((p, i) => (
              <li className="dr-work-item" key={p.slug} style={{ "--i": i } as CSSProperties}>
                {/* THE CARD owns `--ap`, Cosmos's settle, measured off the
                    CARD'S OWN top (1 at the fold, 0.27 at 27% of viewport
                    height — not 0, so the whole 1.10/1.20 relax happens
                    while the card is still visible, the way Cosmos's does
                    inside their own sticky stack). Chased at 0.35: Cosmos's
                    measured per-frame retention (~35–40% of the remaining
                    distance closed a frame, converged by ~300ms) — much
                    snappier than the room's default 0.1 (Lando's rate),
                    because this is a settle happening in place, not a
                    structural position following the scrollbar. */}
                <Link
                  href={`/work/${p.slug}`}
                  className="dr-work-card"
                  aria-label={`${p.listName} — see work`}
                  data-sp
                  data-sp-from="1"
                  data-sp-to="0.27"
                  data-sp-var="--ap"
                  data-sp-lerp="0.35"
                >
                  <span className="dr-work-wrap">
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
                  </span>
                </Link>

                {/* YEAR / NICHE ride the page's own outer measure (`.wrap`),
                    not the card's narrower width — Cosmos's own
                    `.works_infos` does the same against `.container-large`
                    while `.works_card` sits centred and smaller inside it.
                    `--i` (set on this <li>) and `--rx` (set on the rail
                    above) both inherit down to this row: opacity is the
                    CUBE of how close this card's index is to the rail's
                    current position — Apple's caption fade (decode §2:
                    opacity ≈ progress³), so the pair is only readable on
                    the centred card and near-invisible mid-slide. */}
                <div className="dr-work-infos wrap">
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
    </section>
  );
}
