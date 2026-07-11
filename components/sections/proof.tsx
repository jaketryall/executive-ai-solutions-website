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
         page scrolls — the visitor rides the post-click journey. Pan ends
         where the image runs out: frame shows w/1.9 of a 1.544w image,
         so the travel is ~66% of the image height. */
      const tour = q("[data-tour]")[0] as HTMLElement;
      const dashCard = q("[data-anim='result']")[0] as HTMLElement;
      if (tour) {
        gsap.fromTo(
          tour,
          { yPercent: 0 },
          {
            yPercent: -46.9,
            ease: "none",
            scrollTrigger: {
              // the ride waits until the dashboard card has been read, then
              // runs until the frame leaves
              trigger: dashCard ?? flag,
              start: "bottom 80%",
              endTrigger: flag,
              end: "bottom 12%",
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
      <div className="wrap grid gap-fib-5 pb-fib-6 pt-fib-6 md:grid-cols-[38fr_62fr]">
        {/* ── the story column: what happened, in reading order ── */}
        <div className="flex min-w-0 flex-col gap-fib-4">
          <header data-anim="head">
            <h2 className="t-display-lg">Where the click lands</h2>
            <p className="mt-fib-3 text-ink/70">
              That ad above is real. This is the page it lands on: designed,
              built, and tracked by us for Desert Wings Flight School.
            </p>
          </header>

          {/* the result — PLACEHOLDER values, see tracking list at top */}
          <div data-anim="result">
            <ArtifactFrame
              variant="card"
              tone="ink"
              label="Results from the ads dashboard (placeholder values)"
              bodyClassName="p-fib-4!"
            >
              <p className="t-meta text-paper/50">From their ads dashboard</p>
              <div className="mt-fib-3 flex flex-col gap-fib-3">
                {METRICS.map((m) => (
                  <div key={m.label} className="flex items-baseline gap-fib-2">
                    <p className="t-num w-[86px] shrink-0 font-display text-[2.1rem] font-extrabold leading-none tracking-[-0.03em] text-paper">
                      {m.value}
                    </p>
                    <p className="text-[0.9375rem] leading-[1.35] text-paper/60">
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
            className="flex flex-1 flex-col justify-between rounded-panel bg-panel/70 p-fib-4"
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

        {/* ── the landing, tall and commanding: the tour rides your scroll ── */}
        <div data-anim="flagship" className="relative min-w-0">
          <ArtifactFrame
            variant="chrome"
            tone="ink"
            url="desertwingsflightschool.com"
            label="The Desert Wings homepage the ad lands on, designed and built by us"
            bodyClassName="p-0! pt-0!"
          >
            <div className="overflow-hidden" style={{ aspectRatio: "1.22" }}>
              <Image
                data-tour
                src="/work/dw-tour.jpg"
                alt="Scrolling through the Desert Wings homepage the ad lands on"
                width={2880}
                height={4446}
                sizes="(min-width: 821px) 60vw, 92vw"
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
      </div>
    </section>
  );
}
