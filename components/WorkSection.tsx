"use client";

// Work — the conversion engine. The bordered frame fills the screen and grows
// in (scroll-linked) as the section rises, then the content staggers in just
// behind it. A two-column masonry of big, full-bleed OFF+BRAND-scale cards
// (label overlaid on the visual) scrolls past a sticky headline; the columns
// drift at dual speeds and each mockup parallaxes within its frame. Everything
// is scroll-linked GPU transform — no per-frame layout reads (jank), no
// invalidateOnRefresh on the reveal (flash).

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

function WorkCard({ work }: { work: (typeof WORKS)[number] }) {
  return (
    <article data-card-in className="group relative overflow-hidden rounded-[28px] border border-(--line) bg-ink">
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
            // eager — these are held hidden then revealed on scroll; lazy-loading
            // made them fetch+decode ON the reveal frame, which was the stutter
            loading="eager"
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
  const [reelOpen, setReelOpen] = useState(false);
  // The STUDIO box (shape + reel + STUDIO→WORK morph) now lives in the Hero as a
  // self-contained card; this section just drives the morph as it rises into view.

  // Pre-decode the card images once they've loaded so the scroll-in reveal frame
  // does ZERO image work (the fetch+decode-on-reveal was the scroll stutter).
  useEffect(() => {
    sectionRef.current
      ?.querySelectorAll<HTMLImageElement>("[data-card-in] img")
      .forEach((img) => img.decode?.().catch(() => {}));
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const trigger = sectionRef.current;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The work region is a FULL-WIDTH dark panel (the section bg is ink-deep).
        // It rises into view over the hero's self-contained STUDIO box; the
        // STUDIO→WORK morph (below, desktop-only) fires while the box is still on
        // screen. Dark-on-(dark page) keeps these transforms edge-line-safe.
        gsap.fromTo(
          "[data-work-reveal]",
          { y: 52, opacity: 0 },
          {
            y: 0,
            opacity: 1,
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
          // ── PINNED MOMENT — the wordmark travels into the panel during a HELD
          // page-pin, so its motion is ONE constant speed with NO scroll-flow under
          // it. The hero-ride happens BEFORE the pin as ordinary scroll; then Work
          // reaches the top, the page PINS, the word glides from pocket to panel over
          // TRAVEL px of held scroll, the page releases, and the cards scroll past
          // the stuck panel.
          //   Sequence (heroEl scroll): 0–220 MORPH in place · 240–440 BLURB up ·
          //   then Work hits the top → PIN + one-speed travel → release → CARDS.
          const sticky = trigger?.querySelector<HTMLElement>("[data-work-sticky]");
          const cards = trigger?.querySelector<HTMLElement>("[data-work-cards]");
          const heroEl = document.querySelector<HTMLElement>("#top");
          const anchorWord = document.querySelector<HTMLElement>("[data-anchor-word]");
          const carry = trigger?.querySelector<HTMLElement>("[data-carry]");
          const carryWord = carry?.querySelector<HTMLElement>("[data-morph]");

          if (sticky && cards && heroEl && anchorWord && carry && carryWord && trigger) {
            const TRAVEL = 460; // px of HELD scroll the word travels over (one speed)

            // Lift = the natural pocket→panel document distance. Measured ONCE here,
            // BEFORE any pin exists, so it's un-transformed + scroll-independent (a
            // mid-section reload can't corrupt it).
            gsap.set(carry, { x: 0, y: 0 });
            const a0 = anchorWord.getBoundingClientRect();
            const c0 = carryWord.getBoundingClientRect();
            const dx = a0.right - c0.right;
            const dy = a0.top - c0.top;
            const place = (p: number) => gsap.set(carry, { x: dx, y: dy * (1 - p) });
            place(0); // start lifted into the hero pocket (rides the hero until the pin)

            // PINNED MOMENT — pin the whole section so the page holds; the word
            // glides pocket→panel at one constant (linear) speed driven by the pin.
            ScrollTrigger.create({
              trigger,
              start: "top top",
              end: `+=${TRAVEL}`,
              pin: true,
              pinSpacing: true,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => place(self.progress),
            });

            // STICKY — after the moment, hold the panel while the cards scroll past,
            // then release (counter-translate; CSS sticky can't survive the
            // smoother's transformed content).
            const dist = () => Math.max(0, cards.offsetHeight - sticky.offsetHeight);
            gsap.fromTo(
              sticky,
              { y: 0 },
              {
                y: dist,
                ease: "none",
                scrollTrigger: {
                  trigger: sticky,
                  start: "top 16%",
                  end: () => `+=${dist()}`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          // BLURB — paragraph + button fade up right after the morph and BEFORE
          // the carry slide, so they're read while the wordmark is still parked.
          const panelReveal = trigger?.querySelector<HTMLElement>("[data-panel-reveal]");
          if (heroEl && panelReveal) {
            gsap.fromTo(
              panelReveal,
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: { trigger: heroEl, start: "top top-=240", end: "top top-=440", scrub: 0.5 },
              },
            );
          }

          // CARDS — no entrance animation. They simply scroll into view (the
          // opacity/transform reveal on the big image grid was a compositing hitch
          // that jumped the whole frame, WORK text included). Eager-load + decode
          // (above) keep that natural scroll-in smooth.

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
          // under (transform-only, no opacity). The word lives in the HERO carry,
          // so it's queried from the document, and the letters are driven by refs.
          const morph = document.querySelector<HTMLElement>("[data-morph]");
          if (morph) {
            const outs = gsap.utils.toArray<HTMLElement>(
              morph.querySelectorAll("[data-morph-out]"),
            );
            const ins = gsap.utils.toArray<HTMLElement>(
              morph.querySelectorAll("[data-morph-in]"),
            );
            // One scrubbed timeline. STUDIO(6) leaves left→right; WORK(4) enters
            // aligned to STUDIO's trailing four slots. The CSS rest state equals
            // the tween start, so a refresh can't flash.
            const swap = gsap.timeline({
              // STUDIO→WORK morphs IN PLACE the instant you scroll (~220px) — the
              // wordmark itself doesn't travel here (the carry holds until 440), so
              // the only motion is the text changing + page scroll.
              scrollTrigger: heroEl
                ? { trigger: heroEl, start: "top top", end: "top top-=220", scrub: 0.5 }
                : { trigger, start: "top 92%", end: "top 28%", scrub: 0.5 },
            });
            outs.forEach((el, i) => {
              swap.to(el, { yPercent: -100, ease: "none", duration: 1 }, i * 0.5);
            });
            // CSS pre-hides the WORK letters with translateY(100%). GSAP parses that
            // as a px `y`, which would STACK with a yPercent tween — reset y to 0 so
            // yPercent is the sole vertical channel, then reveal yPercent 100 → 0.
            gsap.set(ins, { y: 0, yPercent: 100 });
            ins.forEach((el, i) => {
              swap.to(el, { yPercent: 0, ease: "none", duration: 1 }, (i + 2) * 0.5 + 0.15);
            });
          } else if (process.env.NODE_ENV !== "production") {
            console.warn("[morph] [data-morph] not found — STUDIO→WORK swap skipped");
          }
        },
      );

      // Mobile / reduced-motion fallback — the carry + morph above are desktop +
      // no-preference only. Snap the morph to its END state (WORK) so the Work
      // panel always reads WORK there. (The hero's mobile STUDIO is a separate
      // h1 wordmark.)
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        const morph = document.querySelector<HTMLElement>("[data-morph]");
        if (morph) {
          gsap.set(morph.querySelectorAll("[data-morph-out]"), { yPercent: -100 });
          gsap.set(morph.querySelectorAll("[data-morph-in]"), { y: 0, yPercent: 0 });
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      // NEW DIRECTION: the work region is now a FULL-WIDTH DARK panel (no more
      // light paper gutter + floating card). The section bg IS ink-deep and the
      // section is .zone-dark so its content reads light. The work box "moves up
      // into" the studio-box hero rather than growing from a card.
      className="zone-dark relative z-20 -mt-px bg-ink-deep p-3 text-(--fg) md:p-5"
    >
      {/* Content — centred + capped for readability, revealed in timed beats
          inside the settled frame. */}
      <div className="zone-dark relative mx-auto max-w-[1900px] px-6 pb-14 pt-14 md:px-14 md:pb-20 md:pt-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cards LEFT — two-column masonry that scrolls PAST the sticky panel;
              one column drops down so the rows interlock. */}
          <div data-work-cards className="lg:order-1 lg:col-span-8">
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

          {/* Sticky panel RIGHT — show reel + WORK wordmark + blurb + All-work.
              The reel/morph handed off from the hero lands here (Step 2 wires the
              STUDIO→WORK morph onto the wordmark). self-start so the column
              doesn't stretch; the reveal lives on an inner wrapper so the
              entrance transform never fights the sticky counter-translate. */}
          <aside
            data-work-sticky
            className="mt-14 lg:order-2 lg:col-span-4 lg:mt-0 lg:self-start"
          >
            {/* CARRY — reel + STUDIO→WORK morph travel here from the hero: while
                the hero is in view GSAP lifts this whole block UP into the hero's
                STUDIO slot, then slides it down into place as you scroll, morphing
                STUDIO→WORK on the way. ONE element, no duplicate. */}
            <div data-carry className="flex flex-col items-start gap-3 will-change-transform lg:items-end lg:text-right">
              <button
                type="button"
                onClick={() => setReelOpen(true)}
                aria-label="Watch the show reel"
                className="group focus-ring flex items-center gap-3"
              >
                <span className="relative block h-12 w-20 overflow-hidden rounded-lg border border-paper/15 shadow-lg shadow-ink-deep/40">
                  <video src="/final-comp.mp4" muted loop autoPlay playsInline aria-hidden className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </span>
                <span className="text-left">
                  <span className="micro block text-(--fg-faint)">Show reel</span>
                  <span className="text-sm font-semibold tracking-tight">Watch ↗</span>
                </span>
              </button>

              <span
                data-morph
                aria-hidden
                className="grid items-end justify-items-end font-black uppercase leading-[0.82] tracking-[-0.05em] text-paper text-[11vw] will-change-transform md:text-[clamp(4rem,7vw,8.5rem)]"
              >
                <span className="[grid-area:1/1] whitespace-nowrap">
                  {"STUDIO".split("").map((c, i) => (
                    <span key={`s${i}`} className="morph-mask">
                      <span data-morph-out className="morph-letter">{c}</span>
                    </span>
                  ))}
                </span>
                <span className="[grid-area:1/1] whitespace-nowrap">
                  {"WORK".split("").map((c, i) => (
                    <span key={`w${i}`} className="morph-mask">
                      <span data-morph-in className="morph-letter morph-letter-in">{c}</span>
                    </span>
                  ))}
                </span>
              </span>

              {/* blurb rides INSIDE the carry so it fades in directly under WORK
                  (and travels with it), instead of waiting alone at the panel home */}
              <div data-panel-reveal className="mt-3 flex flex-col items-start lg:items-end lg:text-left">
              <p className="max-w-xs text-[15px] leading-relaxed text-(--fg-muted) lg:ml-auto">
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
            </div>
          </aside>
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

      {/* show-reel lightbox — portaled to body so position:fixed survives the
          ScrollSmoother transform. Relocated here with the reel from the hero. */}
      {reelOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-ink-deep/92 p-6 backdrop-blur-sm"
            onClick={() => setReelOpen(false)}
          >
            <button
              type="button"
              onClick={() => setReelOpen(false)}
              aria-label="Close show reel"
              className="focus-ring absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 text-paper transition-colors hover:bg-paper/10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <video
              src="/final-comp.mp4"
              autoPlay
              controls
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-auto max-w-[92vw] rounded-2xl shadow-2xl"
            />
          </div>,
          document.body,
        )}
    </section>
  );
}
