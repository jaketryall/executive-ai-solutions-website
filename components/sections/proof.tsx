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
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 75%", toggleActions: "play none none none" },
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

      /* the receipts roll in on MECHANICAL ODOMETERS (B12, Jake's preferred
         stat reveal): one value drives every wheel; the ones wheel spins
         continuously, higher wheels only roll during the carry window
         near a wrap (C0=0.9 so arbitrary finals never rest part-rolled),
         power3.out (a natural-1.0 ease — expo clamps and snaps), and an
         exact integer render on complete. Targets here are < 1000 (no
         comma wheels needed). SSR text stays for no-JS/reduced-motion;
         the wheel DOM only replaces it on this armed path. */
      const C0 = 0.9;
      const C1 = 0.99;
      const countEls = q("[data-count]") as HTMLElement[];
      countEls.forEach((el) => {
        /* STUCK-AT-ZERO FIX (Jake, 2026-07-18): the wheels REPLACE the
           element's text, so a re-mount (Fast Refresh, strict) used to
           re-parse the wheel digits as a garbage target, bail on the
           >=1000 guard, and leave dead wheels at 0. The original value
           lives on the element now; every mount parses THAT and
           rebuilds fresh. */
        const original = el.dataset.countFull ?? el.textContent ?? "";
        el.dataset.countFull = original;
        const m = original.match(/^([^\d]*)(\d+)(.*)$/);
        if (!m) return;
        const [, pre, num, suf] = m;
        const target = parseInt(num, 10);
        if (!Number.isFinite(target) || target >= 1000) return;
        const places = num.length;
        el.textContent = "";
        if (pre) el.append(pre);
        const wheels: HTMLElement[] = [];
        for (let i = 0; i < places; i++) {
          const od = document.createElement("span");
          od.className = "od";
          const strip = document.createElement("span");
          strip.className = "ods";
          // 0–9 plus a duplicate 0: the 9→0 wrap rolls forward, never back
          strip.innerHTML = "01234567890"
            .split("")
            .map((d) => `<span>${d}</span>`)
            .join("");
          od.append(strip);
          el.append(od);
          wheels.push(strip);
        }
        if (suf) el.append(suf);
        const render = (v: number, snap = false) =>
          wheels.forEach((s, i) => {
            const k = places - 1 - i;
            const place = 10 ** k;
            const base = Math.floor(v / place) % 10;
            const fl = (v % place) / place;
            const frac = snap
              ? 0
              : k === 0
                ? v % 1
                : Math.min(1, Math.max(0, (fl - C0) / (C1 - C0)));
            s.style.transform = `translateY(${-(base + frac)}em)`;
          });
        render(0);
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => render(proxy.v),
          onComplete: () => render(target, true),
        });
      });
      // cleanup: hand the plain text back so the next mount starts clean
      context.add(() => () => {
        countEls.forEach((el) => {
          if (el.dataset.countFull) el.textContent = el.dataset.countFull;
        });
      });

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
            scrollTrigger: { trigger: row, start: "top 75%", toggleActions: "play none none none" },
          }
        );

        /* the TOUR, self-scrolling (the services-02 loop): glide down the
           page, hold, ease back, repeat — running only while the card is on
           screen and the tab is visible. Travel is MEASURED (window vs image
           height) and re-read every cycle via repeatRefresh, so any aspect
           at any viewport ends exactly where the page runs out; short images
           simply don't move. */
        // two captures ship (desktop page / phone view); animate the one
        // the breakpoint is actually displaying
        const tour = (Array.from(
          row.querySelectorAll("[data-tour]")
        ) as HTMLElement[]).find((t) => t.offsetHeight > 0) ?? null;
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
      data-nav="light"
      // TWO-GROUND SYSTEM (Jake, 2026-07-17: "apple only rotates 2 colors
      // really") — the ink STAGE retires after one day; stages don't wear
      // radii AND stages don't wear drama. Proof opens the gray back act
      // (canvas #f5f5f7, running through price/steps/faq to the steel
      // closer); the darkness lives in the OBJECTS — the receipt cards
      // glow against the quiet gray, the original Lesse form.
      className="relative bg-canvas text-ink"
    >
      <div className="pb-fib-7 pt-fib-6">
        {/* ── the claim: title left, support right — the header row spans the
            card's full width so the big card below doesn't orphan it ── */}
        <header
          data-anim="head"
          className="wrap flex flex-col justify-between gap-fib-3 md:flex-row md:items-end"
        >
          {/* copy audit 2026-07-21: "Where the click lands" read as poetry
              to a cold visitor — the proof section should announce proof */}
          <h2 className="t-display-lg">The work, and the numbers</h2>
          <p className="max-w-[38ch] text-ink/70 md:text-right">
            The ad you watched climb the search is real. These are the pages
            our clicks land on: designed, built, and tracked by us.
          </p>
        </header>

        {/* ── one row per project: Lesse's card — dark, image left with
            rounded corners, the receipts straight on the card ── */}
        {rows.map((p) => {
          const img = p.tour ?? p.cover;
          /* a desktop-page capture squeezed to 348px is texture, not proof —
             phones get the phone capture (legible at full card width, and
             tall enough that the tour loop still travels) */
          const mob = p.phones?.[0];
          const metrics = p.results!.metrics.slice(0, 2);
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
                    className={`block h-auto w-full ${mob ? "hidden md:block" : ""}`}
                  />
                  {mob && (
                    <Image
                      data-tour
                      src={mob.src}
                      alt={mob.alt}
                      width={mob.width}
                      height={mob.height}
                      sizes="92vw"
                      className="block h-auto w-full md:hidden"
                    />
                  )}
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

              {/* the receipts — the viral-sma editorial interior (2026-07-17):
                  narrative story leads, client name demotes to meta, exactly
                  TWO time-qualified stats. Fewer numbers, harder landing. */}
              <div className="flex min-h-0 min-w-0 flex-col p-fib-2 md:py-fib-3 md:pl-0 md:pr-fib-3">
                <div className="flex flex-wrap items-center gap-fib-2">
                  <span className="chip">{p.sector}</span>
                  <span className="t-meta text-paper/45">{p.year}</span>
                </div>
                <h3 className="mt-fib-3 font-display text-[2rem] font-bold leading-[1.15] tracking-[-0.02em] text-paper">
                  {p.results!.story}
                </h3>
                <p className="t-meta mt-fib-2 text-paper/45">{p.client}</p>

                {/* the middle: WHAT WE DID (the viral order — title, the
                    work, then results below it) */}
                <p className="mt-fib-3 max-w-[46ch] text-[0.9375rem] leading-normal text-paper/70">
                  {p.results!.did}
                </p>

                {/* the stats are the section's POINT, so they get the card's
                    loudest register (display-tier 56px — bigger than the
                    story title) and isolation air: in viral's version your
                    eye goes straight to the numbers because nothing near
                    them competes (Jake, 2026-07-17) */}
                {/* stack on mobile, 2-up on desktop (2026-08-08): the fixed
                    2-col + 56px broke once the values grew from "3x"/"$38"
                    to "1,000+"/"Dozens" — 6-char values wrapped mid-number
                    in the narrow phone columns. Full width on mobile, a
                    size that fits the desktop 2-up, and nowrap so a number
                    never splits after its first digit. */}
                <div className="mt-fib-5 grid max-w-[440px] grid-cols-1 gap-fib-4 border-t border-paper/10 pt-fib-4 sm:grid-cols-2">
                  {metrics.map((m) => (
                    <div key={m.label} className="min-w-0">
                      <p
                        data-count
                        className="t-num font-display text-[2.75rem] font-extrabold leading-none tracking-[-0.03em] whitespace-nowrap text-paper"
                      >
                        {m.value}
                      </p>
                      {/* bold label (Jake's viral catch): numeral + label
                          read as one emphatic unit, not a number with a
                          whispered caption */}
                      <p className="mt-fib-2 text-[0.9375rem] font-semibold leading-snug text-paper/80">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
                {/* the qualifier — numbers without a timeframe are marketing;
                    numbers with one are a report */}
                <p className="t-meta mt-fib-2 text-paper/45">
                  {p.results!.window}
                </p>

                {/* no quote on the card (the viral order ends at results;
                    the owner's words live on the witness card one section
                    down — this also killed the duplicate-quote problem) */}
                <Link
                  href={`/work/${p.slug}`}
                  className="u-link t-meta mt-auto self-start pt-fib-4 text-paper/80"
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
