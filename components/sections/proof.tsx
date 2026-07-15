"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";
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
    (context) => {
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
          duration: 0.6,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        }
      );

      /* loop governance: each row's tour runs only in view + tab visible */
      const loops: gsap.core.Timeline[] = [];
      const inView = new Map<gsap.core.Timeline, boolean>();
      const sync = () => {
        loops.forEach((l) =>
          inView.get(l) && !document.hidden ? l.play() : l.pause()
        );
      };
      document.addEventListener("visibilitychange", sync);
      context.add(() => () =>
        document.removeEventListener("visibilitychange", sync)
      );

      /* per-row: the whole card lands as ONE object (work + receipts share
         a surface now, so they share an entrance) */
      (q("[data-proj]") as HTMLElement[]).forEach((row) => {
        gsap.fromTo(
          row,
          { autoAlpha: 0, scale: 0.98, y: 34 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 1.15,
            ease: EASE_STRUCTURE,
            scrollTrigger: { trigger: row, start: "top 75%", once: true },
          }
        );

        /* the TOUR, self-scrolling (the services-02 loop): glide down the
           page, hold, ease back, repeat — running only while the card is on
           screen and the tab is visible. Travel is MEASURED (window vs image
           height) and re-read every cycle via repeatRefresh, so any aspect
           at any viewport ends exactly where the page runs out; short images
           simply don't move. */
        const tour = row.querySelector("[data-tour]") as HTMLElement | null;
        if (tour) {
          const win = tour.parentElement as HTMLElement;
          const travel = () =>
            -Math.max(0, 1 - win.offsetHeight / tour.offsetHeight) * 100;
          const loop = gsap.timeline({ repeat: -1, paused: true, repeatRefresh: true });
          loop
            .to({}, { duration: 1.4 }) // present the page's own hero first
            .to(tour, { yPercent: travel, duration: 15, ease: "none" })
            .to({}, { duration: 0.9 })
            .to(tour, { yPercent: 0, duration: 2.4, ease: EASE_STRUCTURE })
            .to({}, { duration: 1.1 });
          loops.push(loop);
          ScrollTrigger.create({
            trigger: row,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              inView.set(loop, self.isActive);
              sync();
            },
          });
        }
      });
    },
    { scope: root }
  );

  return (
    <section
      id="proof"
      ref={root}
      // CHAPTER ONE continues (apple-grammar.md §1): the proof rides the
      // same ink the hero landed on — flat dark-2, invisible seam; the ONE
      // flip to light happens at the price beat below
      className="relative bg-[var(--color-dark-2)] text-paper"
    >
      <div className="pb-fib-7 pt-fib-6">
        {/* ── the claim: title left, support right — the header row spans the
            card's full width so the big card below doesn't orphan it ── */}
        <header
          data-anim="head"
          className="wrap flex flex-col justify-between gap-fib-3 md:flex-row md:items-end"
        >
          <h2 className="t-display-lg">Where the click lands</h2>
          <p className="max-w-[38ch] text-paper/70 md:text-right">
            That ad above is real. These are the pages our clicks land on:
            designed, built, and tracked by us.
          </p>
        </header>

        {/* ── one row per project: Lesse's card — dark, image left with
            rounded corners, the receipts straight on the card ── */}
        {rows.map((p) => {
          const img = p.tour ?? p.cover;
          const [hero, ...rest] = p.results!.metrics;
          return (
            <article
              key={p.slug}
              data-proj
              data-anim="proj"
              className="dark-chapter proof-card mx-[8px] mt-fib-4 grid gap-fib-3 rounded-panel p-fib-2 md:mx-[13px] md:mt-fib-5 md:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] md:gap-fib-4 md:p-fib-2"
            >
              {/* the work — rounded image, left, riding the scroll */}
              <div className="relative min-w-0">
                <div className="aspect-square overflow-hidden rounded-frame md:aspect-4/3">
                  <Image
                    data-tour
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(min-width: 821px) 55vw, 92vw"
                    className="block h-auto w-full"
                  />
                </div>
                {/* the ad, pinned to its page — only when the copy is real */}
                {p.results!.ad && (
                  <div className="proof-ad-chip" aria-hidden>
                    <p className="g-sponsored">Sponsored</p>
                    <p className="g-url">{p.urlLabel}</p>
                    <p className="proof-ad-chip-title">{p.results!.ad.title}</p>
                  </div>
                )}
              </div>

              {/* the receipts — text straight on the dark card */}
              <div className="flex min-h-0 min-w-0 flex-col p-fib-2 md:py-fib-3 md:pl-0 md:pr-fib-3">
                <div className="flex flex-wrap items-center gap-fib-2">
                  <span className="chip">{p.sector}</span>
                  <span className="t-meta text-paper/45">{p.year}</span>
                </div>
                <h3 className="t-display-lg mt-fib-3 text-paper">{p.client}</h3>

                {/* the hero number, then the receipts cluster — the smalls
                    were one whispered meta line and the column's middle sat
                    empty (Jake, 2026-07-15); now each supporting number gets
                    the iPhone spec-cluster treatment: value + label pairs
                    under a hairline */}
                <p className="t-num mt-fib-4 font-display text-[3.2rem] font-extrabold leading-none tracking-[-0.03em] text-paper">
                  {hero.value}
                </p>
                <p className="mt-fib-1 text-paper/65">{hero.label}</p>
                {rest.length > 0 && (
                  <div className="mt-fib-4 grid max-w-[360px] grid-cols-2 gap-fib-3 border-t border-paper/10 pt-fib-3">
                    {rest.map((m) => (
                      <div key={m.label}>
                        <p className="t-num font-display text-[1.55rem] font-bold leading-none tracking-[-0.02em] text-paper">
                          {m.value}
                        </p>
                        <p className="t-meta mt-fib-1 text-paper/50">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
