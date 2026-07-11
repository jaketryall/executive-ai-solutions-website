"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";

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

/* Hear it from the owners — post-decision reassurance for the hesitators
   who scrolled past the form. Three peer cards on the calm canvas, one
   register before the FAQ answers the rest. */
export function OwnerQuotes() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, y: 0 });
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
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
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
          scrollTrigger: { trigger: root.current, start: "top 66%", once: true },
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative">
      <div className="wrap py-fib-6 md:py-fib-7">
        <h2 data-anim="head" className="t-display-lg max-w-[18ch]">
          Hear it from the owners
        </h2>
        <div className="mt-fib-5 grid gap-fib-3 md:grid-cols-3">
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
