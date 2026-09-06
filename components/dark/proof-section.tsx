"use client";

import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/work";
import { HighlightsGallery, type Highlight } from "@/components/ui/highlights-gallery";

/* §03 · THE PROOF — the highlights gallery, swiped
   Reusing components/ui/highlights-gallery.tsx rather than rebuilding it:
   the caption physics there are already the decoded Apple pattern (signed
   distance parallax so text enters in the direction of the swipe, cubic
   opacity falloff, native scroll-snap with the browser as the tween, rAF
   only while on screen). The dark room only re-skins it.

   THE TEXT IS OUT OF THE CARDS. On the artwork it was white type over a
   client's own headline, hero photo and buttons — three of these covers
   are busy and one is light-on-light, and no scrim fixes text that is
   competing with somebody else's design. Outside, it sits on the room's
   own black and is simply readable. The physics did not change: the same
   elements move by the same distance function, in a new parent.

   IT GROWS BY ITSELF. One card per real client project, straight off
   PROJECTS — add a case to lib/work.ts and it gets a card, and the dots
   and the swipe extent follow because they read the same array.

   Our own case is filtered out: it is in PROJECTS because /work lists it,
   but a proof section counting the agency's own site among its client
   results is marking its own homework. */

const OURS = "executive-ai-solutions";

/* A case without a results block has no `story` line, and listName is an
   abbreviation — "AAHG" reads as a caption the way a filename does. The
   lede's opening sentence is already written and already approved. */
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
      <Image
        src={p.cover.src}
        alt={p.cover.alt}
        width={p.cover.width}
        height={p.cover.height}
        sizes="(max-width: 820px) 92vw, min(87.5vw, 1160px)"
      />
    ),
    detail: (
      <div className="dr-hl-detail">
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

        <p className="dr-hl-when">
          <span className="t-label">
            {p.results?.window ?? `${p.status} · ${p.year}`}
          </span>
          <Link className="dr-hl-open" href={`/work/${p.slug}`}>
            Read the case
            <i aria-hidden>→</i>
          </Link>
        </p>
      </div>
    ),
  }));

  return (
    <HighlightsGallery
      className="dr-hlg"
      captionsOutside
      eyebrow="Proof"
      /* the one triggered vocabulary (law 11), same as §04's opener */
      eyebrowProps={{ "data-wipe": "" }}
      headingProps={{ "data-wipe": "", "data-wipe-delay": "150" }}
      heading="The sites we built, and what they have done since."
      label="Client work"
      items={items}
    />
  );
}
