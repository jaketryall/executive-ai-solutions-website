"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/work";

/* §03 · THE PROOF — three cards, and the site itself is the evidence

   This replaced the swiped highlights gallery (2026-09-06). The swiper
   showed one case at a time and put the other two behind a swipe — the
   show-don't-gate rule broken on the one section whose job is showing —
   and its heading promised numbers only one of the three cases can pay.
   What the room really has is three real scroll-throughs of live client
   sites, so the card plays the site: they can see what we did without
   opening the case, and the case is one tap away if they want it.

   THE CARD is itsjay's: near-black frame, the cover in a well, the client
   and its meta on a strip under it. THE HOVER is itsjay's too — a blurred
   veil drops over the cover and the clip rises out of a horizontal centre
   slit and plays. Focus opens it as well. Touch never sees it: the cover
   stays, and the tap goes to the case, which is the whole story anyway.

   THE ROW is Lando's full-bleed single-token grid (one --gap for margin and
   gutter, same-shape cards, one persistent badge each, a hover that changes
   ONLY the image and the frame colour). The entrance is scrubbed through
   the engine, two rates, then dead still — see the stylesheet.

   IT GROWS BY ITSELF. One card per real client project, straight off
   PROJECTS — add a case with a cover and a clip to lib/work.ts and it gets
   a card. Our own case is filtered out: a proof section counting the
   agency's own site among its client results is marking its own homework. */

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
  const gridRef = useRef<HTMLOListElement>(null);

  /* the clip plays only while the card is under the cursor (or focused),
     and rewinds when it leaves, so every hover is the site from the top.
     A hover rig is a no-op on touch, and the play is motion — both skipped. */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (
      !window.matchMedia("(hover: hover)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const offs: (() => void)[] = [];
    for (const card of grid.querySelectorAll<HTMLAnchorElement>(".dr-pf-card")) {
      const v = card.querySelector("video");
      if (!v) continue;
      const on = () => {
        void v.play().catch(() => {});
      };
      const off = () => {
        v.pause();
        v.currentTime = 0;
      };
      card.addEventListener("mouseenter", on);
      card.addEventListener("mouseleave", off);
      card.addEventListener("focus", on);
      card.addEventListener("blur", off);
      offs.push(() => {
        card.removeEventListener("mouseenter", on);
        card.removeEventListener("mouseleave", off);
        card.removeEventListener("focus", on);
        card.removeEventListener("blur", off);
      });
    }
    return () => offs.forEach((f) => f());
  }, []);

  if (!cases.length) return null;

  return (
    <section className="dr-proof" aria-labelledby="dr-proof-h">
      <header className="dr-proof-head wrap">
        {/* the one triggered vocabulary (law 11), same as §04's opener */}
        <span className="t-label dr-proof-kicker" data-wipe>
          Proof
        </span>
        <h2 className="dr-proof-h" id="dr-proof-h" data-wipe data-wipe-delay="150">
          The sites we built, and what they have done since.
        </h2>
      </header>

      {/* DECLARES its window; the engine fills in --sp (law 11: the
          structure is scrubbed, only the text above is triggered). The
          window opens at the viewport's bottom edge — pre-rolled, law 4 —
          and is spent by the time the grid's top is 62% up, so the row is
          flush and still before it reaches the reading zone. */}
      <ol
        className="dr-proof-grid"
        ref={gridRef}
        data-sp
        data-sp-from="1"
        data-sp-to="0.62"
        data-sp-lerp="0.1"
      >
        {cases.map((p) => (
          <li key={p.slug} className="dr-pf">
            <Link href={`/work/${p.slug}`} className="dr-pf-card">
              <span className="dr-pf-well">
                <Image
                  src={p.cover.src}
                  alt={p.cover.alt}
                  width={p.cover.width}
                  height={p.cover.height}
                  sizes="(max-width: 1099px) 92vw, 33vw"
                />
                {p.clip && (
                  <>
                    <span className="dr-pf-veil" aria-hidden />
                    <span className="dr-pf-demo" aria-hidden>
                      <video
                        muted
                        loop
                        playsInline
                        preload="none"
                        poster={p.clip.poster}
                      >
                        <source src={p.clip.src} type="video/mp4" />
                      </video>
                    </span>
                  </>
                )}
                {/* the one persistent badge: the category slot, the way the
                    reference's cards carry a season or a price — the same
                    kind of fact on every card, so the row scans as a set */}
                <span className="dr-pf-badge">{p.kind}</span>
              </span>

              <span className="dr-pf-foot">
                <span className="dr-pf-client">{p.client}</span>
                <span className="t-label dr-pf-meta">
                  {p.sector} · {p.year}
                </span>
              </span>

              <span className="dr-pf-line">
                {p.results?.story ?? caption(p.lede)}
              </span>

              {/* numbers only where there are real ones — a case without a
                  measured result says what was built, which is true,
                  rather than reach for a number that is not */}
              {p.results?.metrics?.length ? (
                <>
                  <dl className="dr-pf-stats">
                    {p.results.metrics.map((m) => (
                      <div key={m.label}>
                        <dt>{m.value}</dt>
                        <dd>{m.label}</dd>
                      </div>
                    ))}
                  </dl>
                  <span className="t-label dr-pf-window">{p.results.window}</span>
                </>
              ) : p.listLine ? (
                /* the same slot, the same register, a true sentence instead
                   of a number — "$0/mo in platform fees", "books and bills
                   itself" — so the row does not read as one card with a
                   result and two with a hole */
                <>
                  <span className="dr-pf-fact">{p.listLine}</span>
                  <span className="t-label dr-pf-window">{p.status}</span>
                </>
              ) : null}

              <span className="dr-pf-open">
                Read the case
                <i aria-hidden>→</i>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
