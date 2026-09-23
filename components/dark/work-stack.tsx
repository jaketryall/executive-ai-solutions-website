"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/work";
import { Roll } from "@/components/room/nav";

/* §03 · THE WORK, ONE AT A TIME (trial `?v=stack`, 2026-09-23 — Jake:
   "i like proof, but the card layout has to change i really like the
   info pill on the work that cosmos has, maybe we do a bigger one and
   include the info they have somehow" → "i kinda want users to see
   everything one at a time, i dont want them to have to decide where to
   look").

   COSMOS'S, measured (design-dna/decodes/cosmos-works.md): one card per
   project, each item `position: sticky; top: 0`, the next dealt on top
   of the last in DOM order; as an item arrives its card-wrap settles
   1.10 → 1 and its image 1.20 → 1 over one screen of scroll, CHASED (a
   per-frame retention of ~.63 — converged ~300ms after the scroll
   stops), scale only, nothing else ever moves; the pill top-centre, 32px
   in, name + "See work"; YEAR and NICHE in the margins below. No hover.

   OURS: the same stack and the same settle (the engine's --st, lerp .37
   = Cosmos's retention), a card larger than theirs (Jake: "a bigger
   one" — 82vw up to 1180px, the covers' own 16:10, capped by the
   screen's height), and the pill carrying the margins' facts inside it:
   Year, Niche, Built. One case fills the screen at a time, so there is
   never a choice of where to look. The phone drops the pin and the
   settle, as Cosmos's does. */
export default function WorkStack({ cases }: { cases: Project[] }) {
  return (
    <ol className="dr-stack" aria-label="Selected work">
      {cases.map((p, k) => (
        /* the clock is on the ITEM, not the card: the card is centred
           below the rail, so its own top never reaches 0 and a window on
           it stopped at .89 (measured); the item's top reaches 0 exactly
           as it pins, so the settle completes as the card lands */
        <li
          className="dr-stack-item"
          key={p.slug}
          style={{ "--k": k } as CSSProperties}
          data-sp
          data-sp-edge="top"
          data-sp-from="1"
          data-sp-to="0"
          data-sp-var="--st"
          data-sp-lerp="0.37"
        >
          <div className="dr-stack-wrap">
            <Link href={`/work/${p.slug}`} className="dr-stack-card" aria-label={`${p.listName}, ${p.sector} — see the case`}>
              <span className="dr-stack-well">
                <Image
                  className="dr-stack-img"
                  src={p.cover.src}
                  alt={p.cover.alt}
                  fill
                  sizes="(max-width: 900px) 92vw, 1180px"
                  priority={k === 0}
                />
              </span>
              <span className="dr-stack-pill" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="dr-stack-thumb" src={p.clip?.poster ?? p.cover.src} alt="" width={52} height={52} loading="lazy" />
                <span className="dr-stack-name">{p.listName}</span>
                {(
                  [
                    ["Year", p.year],
                    ["Niche", p.sector],
                    ["Built", p.kind],
                  ] as const
                ).map(([key, v]) => (
                  <span className="dr-stack-meta" key={key}>
                    <i className="dr-stack-sep" />
                    <span className="dr-stack-k">{key}</span>
                    <span className="dr-stack-v">{v}</span>
                  </span>
                ))}
                <i className="dr-stack-sep" />
                <span className="dr-stack-see">
                  <Roll label="See work" />
                </span>
              </span>
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
