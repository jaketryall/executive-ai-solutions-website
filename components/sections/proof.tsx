"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";
import { ArtifactFrame } from "@/components/ui/artifact";

/* ═══ PLACEHOLDER TRACKING LIST — swap before launch ═══
   1. METRICS.value ×3 below (obviously-round placeholders, not real data)
   2. QUOTE.text + permission from the owner
   The browser-frame page and the ad card docked above are real Desert
   Wings surfaces from day one. ═══ */

const METRICS = [
  /* PLACEHOLDER — swap with real Desert Wings data */
  { value: "3x", label: "more discovery-flight bookings" },
  { value: "$38", label: "cost per lead" },
  { value: "90", label: "days to get there" },
];

/* PLACEHOLDER — swap with the real owner quote (with permission) */
const QUOTE = {
  text: "The phone started ringing the week the ads went live, and the new site actually books people instead of just looking good.",
  name: "Owner, Desert Wings Flight School",
};

/* The proof — the click, landed. BANDS, not columns (the same horizontal
   rhythm as the approach and funnel sections): the hero's search surface
   hangs over the section's top right (the click), then the landing page
   runs full width (the payoff), then the result and the client's voice
   sit side by side. One idea per band. */
export function Proof() {
  const root = useRef<HTMLElement>(null!);

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

      // the flagship lands heavy (mass); the result panels snap in after
      const flag = q("[data-anim='flagship']")[0];
      gsap.fromTo(
        flag,
        { autoAlpha: 0, scale: 0.97, y: 34 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 1.15,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: flag, start: "top 78%", once: true },
        }
      );
      gsap.fromTo(
        q("[data-anim='result']"),
        { autoAlpha: 0, y: 21, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          stagger: 0.12,
          scrollTrigger: {
            trigger: q("[data-anim='result']")[0],
            start: "top 80%",
            once: true,
          },
        }
      );

      /* the TOUR: the stitched landing page pans inside the frame as OUR
         page scrolls — the visitor rides the post-click journey. Travel is
         MEASURED (window vs image height), so any frame aspect at any
         viewport ends the pan exactly where the page runs out. */
      const tour = q("[data-tour]")[0] as HTMLElement;
      if (tour) {
        const win = tour.parentElement as HTMLElement;
        gsap.fromTo(
          tour,
          { yPercent: 0 },
          {
            yPercent: () => -(1 - win.offsetHeight / tour.offsetHeight) * 100,
            ease: "none",
            scrollTrigger: {
              // starts only once the frame has fully presented — the visitor
              // sees the page's own hero intact before the ride begins
              trigger: flag,
              start: "top 38%",
              end: "bottom 25%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    },
    { scope: root }
  );

  return (
    <section id="proof" ref={root} className="relative z-10 -mt-fib-4 rounded-t-[24px] bg-canvas">
      <div className="wrap pb-fib-7 pt-fib-6">
        {/* ── beat 1: the claim (the hero's card falls past the empty right) ── */}
        <header data-anim="head" className="max-w-[52ch]">
          <h2 className="t-display-lg">Where the click lands</h2>
          <p className="mt-fib-3 text-ink/70">
            That ad above is real. This is the page it lands on: designed,
            built, and tracked by us for Desert Wings Flight School.
          </p>
        </header>

        {/* ── beat 2: THE WORK — full width, commanding; this is the object
            that has to justify the price beat waiting one scroll below ── */}
        <div data-anim="flagship" className="relative mt-fib-4">
          <ArtifactFrame
            variant="chrome"
            tone="ink"
            url="desertwingsflightschool.com"
            label="The Desert Wings homepage the ad lands on, designed and built by us"
            bodyClassName="p-0! pt-0!"
          >
            <div className="aspect-square overflow-hidden md:aspect-video">
              <Image
                data-tour
                src="/work/dw-tour.jpg"
                alt="Scrolling through the Desert Wings homepage the ad lands on"
                width={2880}
                height={4446}
                sizes="(min-width: 821px) 1280px, 92vw"
                className="block h-auto w-full"
              />
            </div>
          </ArtifactFrame>
          {/* the ad, pinned to its page (compact echo of the hero artifact) */}
          <div className="proof-ad-chip" aria-hidden>
            <p className="g-sponsored">Sponsored</p>
            <p className="g-url">desertwingsflightschool.com</p>
            <p className="proof-ad-chip-title">
              Desert Wings Flight School | Learn to Fly at Falcon Field
            </p>
          </div>
        </div>

        {/* ── beat 3: the receipts — the number and the voice, side by side ── */}
        <div className="mt-fib-4 grid gap-fib-3 md:grid-cols-2">
          {/* PLACEHOLDER values — see tracking list at top */}
          <div data-anim="result" className="min-w-0">
            <ArtifactFrame
              variant="card"
              tone="ink"
              label="Results from the ads dashboard (placeholder values)"
              bodyClassName="p-fib-4! h-full"
            >
              <p className="t-meta text-paper/50">From their ads dashboard</p>
              <div className="mt-fib-4 grid grid-cols-3 gap-fib-3">
                {METRICS.map((m) => (
                  <div key={m.label} className="min-w-0">
                    <p className="t-num font-display text-[2.1rem] font-extrabold leading-none tracking-[-0.03em] text-paper">
                      {m.value}
                    </p>
                    <p className="mt-fib-1 text-[0.875rem] leading-[1.35] text-paper/60">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </ArtifactFrame>
          </div>

          {/* PLACEHOLDER quote — swap with the real one before launch */}
          <figure
            data-anim="result"
            className="flex min-w-0 flex-col justify-between rounded-panel bg-panel/70 p-fib-4"
          >
            <blockquote>
              <p className="text-[1.0625rem] leading-[1.55] text-ink/80">
                &ldquo;{QUOTE.text}&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-fib-3 flex flex-wrap items-baseline justify-between gap-fib-2">
              <span className="t-meta text-ink/50">{QUOTE.name}</span>
              <a href="/work" className="u-link t-meta">
                See all work
              </a>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
