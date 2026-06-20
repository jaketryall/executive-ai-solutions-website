"use client";

// Work — the conversion engine. The bordered frame fills the screen and grows
// in (scroll-linked) as the section rises, then the content staggers in just
// behind it. A two-column masonry of big, full-bleed OFF+BRAND-scale cards
// (label overlaid on the visual) scrolls past a sticky headline; the columns
// drift at dual speeds and each mockup parallaxes within its frame. Everything
// is scroll-linked GPU transform — no per-frame layout reads (jank), no
// invalidateOnRefresh on the reveal (flash).

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PillCTA from "./PillCTA";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// TODO(owner): confirm client names + outcome lines, and swap these stand-in
// device mockups for real per-project screenshots of each client site.
// `aspect` varies per card so the two columns read as a masonry (OFF+BRAND).
const WORKS = [
  {
    title: "Riled Up Pickleball",
    outcome: "Coaching platform that books itself — sessions, schedule, client CRM.",
    category: "Web app · Bookings",
    image: "/custom-dashboard-mockup.webp",
    aspect: "aspect-[5/4]",
  },
  {
    title: "Desert Wings",
    outcome: "A flight school site that turns curiosity into discovery flights.",
    category: "Flight school · Web design",
    image: "/Elegant Black Laptop Mockup.webp",
    aspect: "aspect-[4/5]",
  },
  {
    title: "Wings N Wheels",
    outcome: "Premium detailing brand with a quote pipeline that fills itself.",
    category: "Local service · Web design",
    image: "/Celestial Laptop Mockup.webp",
    aspect: "aspect-[5/4]",
  },
  {
    title: "AZ Gyro Tours",
    outcome: "Tourism site selling the thrill before the booking.",
    category: "Tourism · Web design",
    image: "/Rubber iPhone Mockup.webp",
    aspect: "aspect-[4/5]",
  },
];

const HEADLINE = ["Proof,", "not promises"];

function WorkCard({ work }: { work: (typeof WORKS)[number] }) {
  return (
    <article data-work-reveal className="group relative overflow-hidden rounded-[28px] border border-(--line) bg-ink">
      {/* full-bleed visual; the oversized wrapper lets it parallax within the
          frame without revealing edges (hover-scale on the image so it never
          fights the parallax transform on the wrapper) */}
      <div className={`relative ${work.aspect}`}>
        <div data-card-img className="absolute inset-[-10%] will-change-transform">
          <Image
            src={work.image}
            alt={work.title}
            fill
            sizes="(max-width: 1024px) 90vw, 42vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
          />
        </div>
        {/* scrim keeps the overlaid label legible over any mockup */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink-deep/85 via-ink-deep/15 to-transparent"
        />
      </div>

      {/* label sits ON the visual: name always shown; details (category +
          outcome) expand in on hover; arrow bottom-right */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
        <div className="min-w-0">
          <h3 className="text-xl font-bold tracking-tight text-paper md:text-2xl">
            {work.title}
          </h3>
          <div
            className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100"
            style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
          >
            <div className="overflow-hidden">
              <p className="micro mt-2.5 text-paper/70">{work.category}</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-paper/65">
                {work.outcome}
              </p>
            </div>
          </div>
        </div>
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/30 text-paper transition-all duration-500 group-hover:border-paper group-hover:bg-paper group-hover:text-ink"
          style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </span>
      </div>
    </article>
  );
}

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const trigger = sectionRef.current;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance is scroll-LINKED (scrub), not a one-shot, and transform/clip
        // only — NO opacity fades, so the box and everything in it stay fully
        // visible the whole time. The content slides up (y) just behind the box.
        //
        // The dark box GROWS from a floating rounded card into a full-bleed panel
        // as the section rises, then clamps and scrolls on full-bleed. This is a
        // LAYOUT grow — animating the real inset (top/right/bottom/left) + radius
        // — NOT clip-path / transform / box-shadow. A layout grow re-rasterizes
        // the box into the page layer each frame, so it never becomes its own
        // compositor layer and there's no feathered edge to draw a 1px line under
        // ScrollSmoother on retina. No blur shadow (that re-render was the lag).
        // The `from` reads the rest inset off the element so it matches per
        // breakpoint (inset-6 mobile / inset-14 desktop) with no jump.
        const frame = trigger?.querySelector<HTMLElement>("[data-work-frame]");
        if (frame) {
          const gut = parseFloat(getComputedStyle(frame).top) || 0;
          gsap.fromTo(
            frame,
            { top: gut, right: gut, bottom: gut, left: gut, borderRadius: 40 },
            {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              borderRadius: 0,
              ease: "none",
              scrollTrigger: {
                trigger,
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        gsap.fromTo(
          "[data-work-reveal]",
          { y: 52 },
          {
            y: 0,
            ease: "none",
            stagger: 0.06,
            scrollTrigger: { trigger, start: "top 82%", end: "top 40%", scrub: 0.5 },
          },
        );

        // Per-card parallax — each mockup drifts within its oversized frame as
        // the section transits the viewport. Transform-only, scrubbed.
        gsap.fromTo(
          "[data-card-img]",
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // Desktop-only motion: the two columns + the sticky headline live here.
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Sticky headline: counter-translate it DOWN at scroll speed so it
          // stays docked while the cards scroll past, then release. (CSS sticky
          // doesn't survive ScrollSmoother's transformed content — same reason
          // the Services stack fakes its pin this way.)
          const sticky = trigger?.querySelector<HTMLElement>("[data-work-sticky]");
          const cards = trigger?.querySelector<HTMLElement>("[data-work-cards]");
          if (sticky && cards) {
            const dist = () => Math.max(0, cards.offsetHeight - sticky.offsetHeight);
            gsap.fromTo(
              sticky,
              { y: 0 },
              {
                y: dist,
                ease: "none",
                scrollTrigger: {
                  trigger: sticky,
                  start: "top 100px",
                  end: () => `+=${dist()}`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          // Dual-speed column drift — the two columns slide at slightly
          // different rates as the section transits, for masonry depth.
          gsap.fromTo(
            "[data-work-col-a]",
            { yPercent: 3 },
            {
              yPercent: -4,
              ease: "none",
              scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 1 },
            },
          );
          gsap.fromTo(
            "[data-work-col-b]",
            { yPercent: -3 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 1 },
            },
          );

          // ── STUDIO → WORK letter morph ────────────────────────────────────
          // The hero's bottom-right wordmark reads STUDIO; as this section rises
          // into view it morphs into WORK, letter by letter — each STUDIO glyph
          // rising up + out of its clip mask while the WORK glyph rises in from
          // under (transform-only, no opacity). The word lives in the HERO, so
          // it's queried from the document (NOT the useGSAP scope), and the
          // letters are driven by element refs. Only the inner letters get a
          // transform here (yPercent); the word's own y has no other authority
          // (its hero parallax drift was removed), so nothing fights. The word
          // moves at scroll speed, staying just ahead of the rising dark box
          // over the light hero, so the dark ink letters never go ink-on-ink.
          const morph = document.querySelector<HTMLElement>("[data-morph]");
          if (morph) {
            const outs = gsap.utils.toArray<HTMLElement>(
              morph.querySelectorAll("[data-morph-out]"),
            );
            const ins = gsap.utils.toArray<HTMLElement>(
              morph.querySelectorAll("[data-morph-in]"),
            );
            // One scrubbed timeline. STUDIO(6) leaves left→right; WORK(4) enters
            // aligned to STUDIO's trailing four slots (so S,T leave into nothing
            // and the right edge never shifts). No .from()/invalidateOnRefresh
            // on this one — the CSS rest state equals the tween start, so a
            // refresh can't flash.
            const swap = gsap.timeline({
              scrollTrigger: { trigger, start: "top 92%", end: "top 28%", scrub: 0.5 },
            });
            outs.forEach((el, i) => {
              swap.to(el, { yPercent: -100, ease: "none", duration: 1 }, i * 0.5);
            });
            // CSS pre-hides the WORK letters with translateY(100%) for a FOUC-safe
            // first paint. GSAP parses that as a px `y`, which would STACK with a
            // `yPercent` tween (the bug that left WORK doubly pushed down, never
            // rising in). Reset `y` to 0 so yPercent is the sole vertical channel,
            // then reveal yPercent 100 → 0.
            gsap.set(ins, { y: 0, yPercent: 100 });
            ins.forEach((el, i) => {
              swap.to(el, { yPercent: 0, ease: "none", duration: 1 }, (i + 2) * 0.5 + 0.15);
            });
          } else if (process.env.NODE_ENV !== "production") {
            console.warn("[morph] [data-morph] not found — STUDIO→WORK swap skipped");
          }
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      // Light-on-light: the page background is paper (continuing the hero), and
      // the work lives INSIDE a dark rounded box that floats on the paper. The
      // content wrapper below is zone-dark so its text/pills read light against
      // the box, while the paper margin around it stays the warm light tone.
      className="relative z-20 -mt-px bg-paper-warm p-3 text-(--fg) md:p-5"
    >
      {/* The dark box: a rounded ink-deep card inset from the paper at rest, that
          grows to full-bleed by animating its INSET (layout, not clip/transform —
          see globals .work-frame for why). rounded-[40px] + the inset are the
          rest/reduced-motion state; the grow drives them to 0. */}
      <div
        data-work-frame
        aria-hidden
        className="absolute inset-6 rounded-[40px] bg-ink-deep shadow-[0_4px_36px_rgba(14,13,12,0.34)] md:inset-14"
      />

      {/* Content — centred + capped for readability, revealed in timed beats
          inside the settled frame. */}
      <div className="zone-dark relative mx-auto max-w-[1900px] px-6 pb-14 pt-14 md:px-14 md:pb-20 md:pt-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* self-start so the column doesn't stretch — we measure its natural
              height to know how far to keep it docked. The reveal lives on an
              inner wrapper so the entrance transform never fights the sticky
              counter-translate on the header itself. */}
          <header data-work-sticky className="lg:col-span-3 lg:self-start">
            <div data-work-reveal>
              <p className="micro text-(--fg-faint)">Selected work — 2024 to now</p>
              <h2 className="mt-5 font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-[clamp(2.4rem,5.5vw,3.8rem)]">
                {HEADLINE.map((line, i) => (
                  <span key={line} className="block">
                    {line}
                    {i === HEADLINE.length - 1 && <span className="text-oxblood">.</span>}
                  </span>
                ))}
              </h2>
              <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-(--fg-muted)">
                Every build has one job: turn visitors into booked work.
                Here&rsquo;s what that looks like.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <PillCTA label="All work" href="#work" />
                <span className="micro tabular-nums text-(--fg-faint)">
                  {String(WORKS.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </header>

          {/* Two-column masonry of big full-bleed cards (OFF+BRAND) that the
              sticky headline scrolls alongside; one column drops down so the
              rows interlock. */}
          <div data-work-cards className="mt-14 lg:col-span-9 lg:mt-0">
            <div className="grid gap-5 md:gap-6 lg:grid-cols-2">
              <div data-work-col-a className="space-y-5 md:space-y-6">
                <WorkCard work={WORKS[0]} />
                <WorkCard work={WORKS[3]} />
              </div>
              <div data-work-col-b className="space-y-5 md:space-y-6 lg:pt-24">
                <WorkCard work={WORKS[1]} />
                <WorkCard work={WORKS[2]} />
              </div>
            </div>
          </div>
        </div>

        <div
          data-work-reveal
          className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-(--line) pt-10 lg:mt-16"
        >
          <div>
            <p className="micro text-(--fg-faint)">Next opening — July</p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              Your project could be here.
            </p>
          </div>
          <PillCTA label="Start a project" href="#contact" />
        </div>
      </div>
    </section>
  );
}
