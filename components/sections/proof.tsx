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

      // the big media never sits static: contained one-plane parallax
      const shot = q("[data-proof-parallax]")[0] as HTMLElement;
      if (shot) {
        gsap.fromTo(
          shot,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: flag,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    },
    { scope: root }
  );

  return (
    <section id="proof" ref={root} className="relative z-10 -mt-fib-4 rounded-t-[24px] bg-canvas">
      <div className="wrap pb-fib-6 pt-fib-6">
        {/* band 1 · header — the hero's search surface hangs over the right */}
        <header data-anim="head" className="max-w-[46ch]">
          <h2 className="t-display-lg">Where the click lands</h2>
          <p className="mt-fib-3 text-ink/70">
            That ad above is real. This is the page it lands on: designed,
            built, and tracked by us for Desert Wings Flight School.
          </p>
        </header>

        {/* band 2 · the landing — full width, the section's one big moment */}
        <div data-anim="flagship" className="mt-fib-5">
          <ArtifactFrame
            variant="chrome"
            tone="ink"
            url="desertwingsflightschool.com"
            label="The Desert Wings homepage the ad lands on, designed and built by us"
            bodyClassName="p-0! pt-0!"
          >
            <div className="overflow-hidden rounded-[10px]" style={{ aspectRatio: "1.9" }}>
              <Image
                data-proof-parallax
                src="/hero/dw-hero.jpg"
                alt="The Desert Wings Flight School homepage the ad lands on"
                width={1200}
                height={800}
                sizes="(min-width: 821px) 82vw, 92vw"
                className="block h-full w-full scale-[1.09] object-cover object-top"
              />
            </div>
          </ArtifactFrame>
        </div>

        {/* band 3 · the result + the voice, side by side */}
        <div className="mt-fib-3 grid gap-fib-3 md:grid-cols-2">
          <div data-anim="result">
            <ArtifactFrame
              variant="card"
              tone="ink"
              label="Results from the ads dashboard (placeholder values)"
              bodyClassName="p-fib-4! h-full"
            >
              <p className="t-meta text-paper/50">From their ads dashboard</p>
              <div className="mt-fib-4 grid gap-fib-3 sm:grid-cols-3">
                {METRICS.map((m) => (
                  <div key={m.label} className="min-w-0">
                    <p className="t-num font-display text-[clamp(2.2rem,3.4vw,3rem)] font-extrabold leading-none tracking-[-0.03em] text-paper">
                      {m.value}
                    </p>
                    <p className="mt-fib-1 text-[0.9375rem] leading-[1.4] text-paper/60">
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
            className="flex flex-col justify-between rounded-panel bg-panel/70 p-fib-4"
          >
            <blockquote>
              <p className="text-[1.25rem] leading-[1.55] text-ink/85">
                &ldquo;{QUOTE.text}&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-fib-4 flex flex-wrap items-baseline justify-between gap-fib-2">
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
