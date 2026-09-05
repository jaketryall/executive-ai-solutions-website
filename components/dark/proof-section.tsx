"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/work";

/* §03 · THE PROOF — A LEDGER, NOT A CARD
   §02 is a card and §04 is four of them, and a card between them made
   three panels in a row. This one has no container at all: each entry is
   a full-bleed band, the client's screen running off the page edge, the
   numbers at display scale opposite it. The room shows through the whole
   way, which a card was blocking.

   IT GROWS BY ITSELF. The entries are every project that HAS a results
   block — not a hand-picked one — so adding numbers to a case in
   lib/work.ts adds it here and removing them removes it. Sides alternate
   off the index, so a second entry mirrors the first without anyone
   choosing that, and the section renders nothing at all if the roster
   ever holds no measured work.

   THE SIGNATURE, per entry: the print develops. This is a dark room, so
   the proof arrives underexposed and gains its light as it rises. Pure
   f(scroll), recomputed per frame off each figure's own box, so scrubbing
   back up runs it backwards exactly. */

export default function ProofSection() {
  const ref = useRef<HTMLElement>(null);

  /* every case that can actually show a number, in roster order. No slug
     is named here on purpose — this is a view of the data, not a
     hand-maintained copy of part of it. */
  const entries = PROJECTS.filter((p) => p.results?.metrics?.length && p.backdrop);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const figs = Array.from(el.querySelectorAll<HTMLElement>(".dr-pf-media"));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (still) {
      figs.forEach((f) => f.style.setProperty("--p", "1"));
      el.querySelectorAll(".dr-reveal").forEach((r) => r.classList.add("is-in"));
      return;
    }

    let frame = 0;
    const draw = () => {
      frame = 0;
      figs.forEach((fig) => {
        const b = fig.getBoundingClientRect();
        /* 0 while the print is still below the fold, 1 once it has climbed
           to the upper third. Written off the element's own box, so it
           still resolves when entries are added above it. */
        const from = innerHeight * 1.02;
        const to = innerHeight * 0.42;
        const raw = (from - b.top) / (from - to);
        fig.style.setProperty("--p", String(Math.max(0, Math.min(1, raw))));
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    draw();

    // added, never removed: a reveal that un-reveals reads as a bug
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -16% 0px", threshold: 0 }
    );
    el.querySelectorAll(".dr-reveal").forEach((r) => io.observe(r));

    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [entries.length]);

  // nothing measured yet is a reason to show nothing, not an empty frame
  if (!entries.length) return null;

  return (
    <section className="dr-pf" ref={ref} aria-labelledby="dr-pf-h">
      <div className="wrap">
        <header className="dr-pf-head dr-reveal">
          <span className="t-label dr-pf-kicker">Proof</span>
          <h2 className="dr-pf-lead" id="dr-pf-h">
            {entries.length === 1
              ? "One client, and the numbers their site actually earned."
              : "The clients, and the numbers their sites actually earned."}
          </h2>
        </header>
      </div>

      <ol className="dr-pf-list">
        {entries.map((p, i) => {
          const r = p.results!;
          const bg = p.backdrop!;
          return (
            <li
              key={p.slug}
              className="dr-pf-entry"
              /* the side flips off the INDEX, so a second entry mirrors the
                 first without anyone deciding that it should */
              data-side={i % 2 ? "left" : "right"}
            >
              <figure className="dr-pf-media">
                <Image
                  src={bg.src}
                  alt={bg.alt}
                  width={bg.width}
                  height={bg.height}
                  sizes="(max-width: 900px) 100vw, 58vw"
                />
              </figure>

              <div className="dr-pf-body dr-reveal">
                <p className="dr-pf-meta">
                  {p.client} · {p.sector} · {p.year}
                </p>
                <h3 className="dr-pf-story">{r.story}</h3>

                <dl className="dr-pf-metrics">
                  {r.metrics.map((m) => (
                    <div key={m.label}>
                      <dt>{m.value}</dt>
                      <dd>{m.label}</dd>
                    </div>
                  ))}
                </dl>

                {/* a number without a window is marketing; a number with
                    one is a report */}
                <span className="t-label dr-pf-window">{r.window}</span>

                <Link className="dr-pf-open" href={`/work/${p.slug}`}>
                  Read the case
                  <i aria-hidden>→</i>
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
