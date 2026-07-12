"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";
import { ArtifactFrame } from "@/components/ui/artifact";
import { PROJECTS } from "@/lib/work";

/* The proof — the click, landed. ONE ROW PER PROJECT, rendered straight from
   the roster (lib/work.ts): any project with `results` gets a row here, so
   growing the roster grows this section with zero layout work. Each row is
   one glance: the site (big, panning on scroll) + the receipts (one hero
   number, the smalls, the owner's voice). The price beat waits one scroll
   below — these rows are what make the number feel cheap.
   (Placeholder metrics/quotes are tracked in lib/work.ts.) */
export function Proof() {
  const root = useRef<HTMLElement>(null!);
  const rows = PROJECTS.filter((p) => p.results);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        q("[data-anim='head']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        }
      );

      /* per-row: the frame lands heavy, its receipts snap in after */
      (q("[data-proj]") as HTMLElement[]).forEach((row) => {
        const tl = gsap.timeline({
          defaults: { ease: EASE_STRUCTURE },
          scrollTrigger: { trigger: row, start: "top 75%", once: true },
        });
        tl.fromTo(
          row.querySelector("[data-anim='flagship']"),
          { autoAlpha: 0, scale: 0.97, y: 34 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 1.15 }
        ).fromTo(
          row.querySelector("[data-anim='result']"),
          { autoAlpha: 0, y: 21, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 },
          "-=0.7"
        );

        /* the TOUR: the captured page pans inside its frame as OUR page
           scrolls. Travel is MEASURED (window vs image height) so any
           aspect at any viewport ends exactly where the page runs out;
           short images simply don't pan. */
        const tour = row.querySelector("[data-tour]") as HTMLElement | null;
        if (tour) {
          const win = tour.parentElement as HTMLElement;
          gsap.fromTo(
            tour,
            { yPercent: 0 },
            {
              yPercent: () =>
                -Math.max(0, 1 - win.offsetHeight / tour.offsetHeight) * 100,
              ease: "none",
              scrollTrigger: {
                // starts once the frame has presented — the page's own hero
                // shows intact before the ride begins
                trigger: row,
                start: "top 38%",
                end: "bottom 25%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });
    },
    { scope: root }
  );

  return (
    <section id="proof" ref={root} className="relative z-10 -mt-fib-4 rounded-t-panel bg-canvas">
      <div className="wrap pb-fib-7 pt-fib-6">
        {/* ── the claim (the hero's card falls past the empty right) ── */}
        <header data-anim="head" className="max-w-[52ch]">
          <h2 className="t-display-lg">Where the click lands</h2>
          <p className="mt-fib-3 text-ink/70">
            That ad above is real. These are the pages our clicks land on:
            designed, built, and tracked by us.
          </p>
        </header>

        {/* ── one row per project: the work + its receipts, one glance ── */}
        {rows.map((p) => {
          const img = p.tour ?? p.cover;
          const [hero, ...rest] = p.results!.metrics;
          return (
            <article
              key={p.slug}
              data-proj
              className="mt-fib-4 grid gap-fib-3 md:grid-cols-[minmax(0,62fr)_minmax(0,38fr)]"
            >
              {/* the work — big, riding the scroll */}
              <div data-anim="flagship" className="relative min-w-0">
                <ArtifactFrame
                  variant="chrome"
                  tone="ink"
                  url={p.urlLabel}
                  label={`The ${p.client} page the ad lands on, designed and built by us`}
                  bodyClassName="p-0! pt-0!"
                >
                  <div className="aspect-square overflow-hidden md:aspect-4/3">
                    <Image
                      data-tour
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes="(min-width: 821px) 62vw, 92vw"
                      className="block h-auto w-full"
                    />
                  </div>
                </ArtifactFrame>
                {/* the ad, pinned to its page — only when the copy is real */}
                {p.results!.ad && (
                  <div className="proof-ad-chip" aria-hidden>
                    <p className="g-sponsored">Sponsored</p>
                    <p className="g-url">{p.urlLabel}</p>
                    <p className="proof-ad-chip-title">{p.results!.ad.title}</p>
                  </div>
                )}
              </div>

              {/* the receipts — one card, one glance */}
              <div data-anim="result" className="min-w-0">
                <ArtifactFrame
                  variant="card"
                  tone="ink"
                  label={`${p.client} results (placeholder values)`}
                  bodyClassName="p-fib-4! h-full"
                >
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="flex flex-wrap items-center gap-fib-2">
                      <span className="chip">{p.sector}</span>
                      <span className="t-meta text-paper/45">{p.year}</span>
                    </div>
                    <h3 className="t-title--lg mt-fib-3 text-paper">
                      {p.client}
                    </h3>

                    {/* the hero number, then the smalls */}
                    <p className="t-num mt-fib-4 font-display text-[3.2rem] font-extrabold leading-none tracking-[-0.03em] text-paper">
                      {hero.value}
                    </p>
                    <p className="mt-fib-1 text-paper/65">{hero.label}</p>
                    {rest.length > 0 && (
                      <p className="t-meta mt-fib-2 text-paper/45">
                        {rest.map((m) => `${m.value} ${m.label}`).join(" · ")}
                      </p>
                    )}

                    {p.results!.quote && (
                      <blockquote className="mt-auto pt-fib-4">
                        <p className="text-[0.9375rem] leading-[1.5] text-paper/70">
                          &ldquo;{p.results!.quote.text}&rdquo;
                        </p>
                        <p className="t-meta mt-fib-2 text-paper/45">
                          {p.results!.quote.name}
                        </p>
                      </blockquote>
                    )}

                    <Link
                      href={`/work/${p.slug}`}
                      className="u-link t-meta mt-fib-3 self-start text-paper/80"
                    >
                      See the full build
                    </Link>
                  </div>
                </ArtifactFrame>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
