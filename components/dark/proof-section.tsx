"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProject } from "@/lib/work";

/* §03 · THE PROOF
   IMAGE-led, where §01 is card-led and §02 is type-led. Three sections,
   three registers, one room.

   ONE client, because one client is what we have real numbers for.
   lib/work.ts carries results for desert-wings and nothing else, and the
   note above them is explicit that they are build-scoped — the site's own
   page views and the leads its form converts, with no credit taken for
   traffic the client's people earned. A proof section that padded itself
   out with invented figures for the other two would undo the point of
   having a proof section. */

export default function ProofSection() {
  const ref = useRef<HTMLElement>(null);
  const p = getProject("desert-wings");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fig = el.querySelector<HTMLElement>(".dr-pf-media");
    if (!fig) return;

    if (still) {
      el.style.setProperty("--p", "1");
      el.classList.add("is-in");
      return;
    }

    /* THE PRINT COMES UP.
       This is a dark room, so the proof DEVELOPS: the site arrives flat and
       underexposed and gains its light as it rises through the frame. Pure
       f(scroll) recomputed per frame — never a tween fired at a threshold —
       so scrubbing back up runs it backwards exactly, and landing mid-page
       shows the right frame instead of an unplayed one. */
    let frame = 0;
    const draw = () => {
      frame = 0;
      const b = fig.getBoundingClientRect();
      /* 0 when the media's top is still a fifth of a screen below the fold,
         1 once it has climbed to the two-thirds line. Written off the
         element's own box so it survives the page growing beneath it. */
      const from = innerHeight * 1.02;
      const to = innerHeight * 0.42;
      const raw = (from - b.top) / (from - to);
      el.style.setProperty("--p", String(Math.max(0, Math.min(1, raw))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    draw();

    /* the surrounding type uses the same one-way reveal as §02 — added,
       never removed, because a reveal that un-reveals reads as a bug */
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -18% 0px", threshold: 0 }
    );
    el.querySelectorAll(".dr-reveal").forEach((r) => io.observe(r));

    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* backdrop is optional on the Project type, and the section is nothing
     without the image — so it gates on both rather than asserting */
  if (!p?.results || !p.backdrop) return null;
  const r = p.results;
  const bg = p.backdrop;

  return (
    <section className="dr-pf" ref={ref} aria-labelledby="dr-pf-h">
      <div className="wrap">
        {/* the HEADER stays on the canvas. §02 is a card and so is this
            section's evidence, and two cards stacked with nothing between
            them read as one long panel with a seam. The bare header IS the
            gap. It also sorts the hierarchy: the card holds the proof — the
            screen, the numbers, the window they cover — and the claim about
            it sits outside, unframed. */}
        <header className="dr-pf-head dr-reveal">
          <span className="t-label dr-pf-kicker">Proof</span>
          <h2 className="dr-pf-lead" id="dr-pf-h">
            {r.story}
          </h2>
          <p className="dr-pf-meta">
            {p.client} · {p.sector} · {p.year}
          </p>
        </header>
        {/* the evidence rides the same card the hero's work rows do — same
            corner, same surface. §01 lists who we did it for; this is one of
            those rows opened up. */}
        <div className="dr-pf-card">

        <figure className="dr-pf-media">
          <Image
            src={bg.src}
            alt={bg.alt}
            width={bg.width}
            height={bg.height}
            sizes="(max-width: 900px) 100vw, 1290px"
          />
        </figure>

        <div className="dr-pf-foot">
          {/* the numbers are the section's point, so they take the loudest
              register on the page — louder than the story above them */}
          <dl className="dr-pf-metrics dr-reveal">
            {r.metrics.map((m, i) => (
              <div key={m.label} style={{ "--row": i } as React.CSSProperties}>
                <dt>{m.value}</dt>
                <dd>{m.label}</dd>
              </div>
            ))}
          </dl>

          <div className="dr-pf-note dr-reveal" style={{ "--row": 2 } as React.CSSProperties}>
            {/* a number without a window is marketing; a number with one is
                a report */}
            <span className="t-label dr-pf-window">{r.window}</span>
            <p>{r.did}</p>
            <Link className="dr-pf-open" href={`/work/${p.slug}`}>
              Read the case
              <i aria-hidden>→</i>
            </Link>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
