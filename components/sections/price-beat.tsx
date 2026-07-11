"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";

/* ═══ PLACEHOLDER TRACKING — Jake is collecting three real quotes ═══
   Swap each QUOTES entry (text + name) as they land. Card 1 shares the DW
   voice with the proof section until his real band quote arrives; cards 2-3
   are sector-generic slots (no invented business names). ═══ */
const QUOTES = [
  {
    text: "The phone started ringing the week the ads went live, and the new site actually books people instead of just looking good.",
    name: "Owner, Desert Wings Flight School",
  },
  {
    text: "I finally know what a lead costs me. Every month there is one number, and it keeps going down.",
    name: "Owner, local trades company",
  },
  {
    text: "We stopped guessing. The ads bring people in, the site books them, and I can see all of it.",
    name: "Owner, family restaurant",
  },
];

/* The price beat — the cognitive-ease rail's second answer. After proof, the
   brain's next reflex is "what would this cost ME?", and leaving it hanging
   poisons every section below with defensive skimming. One viewport, zero
   inputs, zero reading decisions: the numbers, one line, one action.
   (The page's second and last centered moment.) */
export function PriceBeat() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: EASE_STRUCTURE },
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
      tl.fromTo(
        q("[data-anim='price']"),
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.9 }
      )
        .fromTo(
          q("[data-anim='line']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE_UI },
          "-=0.35"
        )
        .fromTo(
          q("[data-anim='act']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE_UI },
          "-=0.25"
        );

      gsap.fromTo(
        q("[data-anim='qhead']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: q("[data-anim='qhead']")[0], start: "top 80%", once: true },
        }
      );
      gsap.fromTo(
        q("[data-anim='quote']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: q("[data-anim='quote']")[0], start: "top 78%", once: true },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} data-pcta-hide className="relative">
      <div className="wrap flex min-h-[88svh] flex-col items-center justify-center py-fib-6 text-center">
        <p data-anim="price" className="t-display-lg text-balance">
          Sites from <span className="text-accent">$2.5k</span>. Ads managed
          from <span className="text-accent">$500/mo</span>.
        </p>
        <p data-anim="line" className="mt-fib-3 max-w-[44ch] text-ink/70">
          Your exact number takes 60 seconds. No call, no email, no
          obligation.
        </p>
        <div data-anim="act" className="mt-fib-4">
          <CTA href="#estimate" label="Get an instant estimate" tone="ink" />
        </div>
      </div>

      {/* the evidence, right against the price */}
      <div className="wrap pb-fib-7">
        <p data-anim="qhead" className="t-title--lg font-display font-bold">
          Hear it from the owners
        </p>
        <div className="mt-fib-4 grid gap-fib-3 md:grid-cols-3">
          {QUOTES.map((quo) => (
            <figure
              key={quo.name}
              data-anim="quote"
              className="flex flex-col justify-between rounded-panel bg-panel/70 p-fib-4"
            >
              <blockquote>
                <p className="text-[1.0625rem] leading-[1.55] text-ink/80">
                  &ldquo;{quo.text}&rdquo;
                </p>
              </blockquote>
              <figcaption className="t-meta mt-fib-4 text-ink/50">
                {quo.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
