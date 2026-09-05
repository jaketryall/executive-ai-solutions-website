"use client";

import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/work";
import { HighlightsGallery, type Highlight } from "@/components/ui/highlights-gallery";

/* §03 · THE PROOF — the highlights gallery, swiped
   Reusing components/ui/highlights-gallery.tsx rather than rebuilding it:
   the caption physics there are already the decoded Apple pattern (signed
   distance parallax, cubic opacity falloff, native scroll-snap, rAF only
   while on screen), and a second copy would drift from it. The dark room
   only re-skins it.

   IT GROWS BY ITSELF, which is the point of a carousel here. One card per
   real client project, straight off PROJECTS — add a case to lib/work.ts
   and it gets a card, remove it and the card goes, and the dots and the
   swipe extent follow because they are derived from the same array.

   Our OWN case is filtered out. It sits in PROJECTS because /work lists
   it, but a proof section that counts the agency's own site among its
   client results is marking its own homework.

   Numbers appear on the cards that HAVE them. lib/work.ts carries a
   results block for desert-wings and nothing else, and the note above it
   is explicit that those figures are build-scoped. A card without numbers
   shows what was actually built instead of inventing a statistic to match
   its neighbours. */

const OURS = "executive-ai-solutions";

/* A case without a results block has no `story` line, and listName is an
   abbreviation — "AAHG" reads as a caption the way a filename does. The
   lede's opening sentence is already written, already approved, and
   already a statement about that client, so it stands in. */
function caption(lede: string) {
  const i = lede.indexOf(". ");
  return i === -1 ? lede : lede.slice(0, i + 1);
}

export default function ProofSection() {
  const cases = PROJECTS.filter((p) => p.slug !== OURS && p.cover);
  if (!cases.length) return null;

  const items: Highlight[] = cases.map((p) => ({
    key: p.slug,
    caption: p.results?.story ?? caption(p.lede),
    fill: true,
    media: (
      <>
        <Image
          src={p.cover.src}
          alt={p.cover.alt}
          width={p.cover.width}
          height={p.cover.height}
          sizes="(max-width: 820px) 92vw, min(87.5vw, 1160px)"
        />

        <div className="dr-hl-foot">
          <p className="dr-hl-who">
            {p.client} · {p.sector} · {p.year}
          </p>

          {p.results?.metrics?.length ? (
            <dl className="dr-hl-stats">
              {p.results.metrics.map((m) => (
                <div key={m.label}>
                  <dt>{m.value}</dt>
                  <dd>{m.label}</dd>
                </div>
              ))}
            </dl>
          ) : (
            /* no measured result yet — say what was built, which is true,
               rather than reach for a number that is not */
            <p className="dr-hl-kind">{p.kind}</p>
          )}

          <span className="dr-hl-when">
            {p.results?.window ?? `${p.status} · ${p.year}`}
          </span>

          <Link className="dr-hl-open" href={`/work/${p.slug}`}>
            Read the case
            <i aria-hidden>→</i>
          </Link>
        </div>
      </>
    ),
  }));

  return (
    <HighlightsGallery
      className="dr-hlg"
      eyebrow="Proof"
      heading="The sites we built, and what they have done since."
      label="Client work"
      items={items}
    />
  );
}
