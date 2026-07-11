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

function PersonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-[14px] w-[14px]">
      <circle cx="10" cy="6.5" r="3.4" />
      <path d="M10 11.4c-3.6 0-6.1 1.9-6.6 4.8-.1.5.3.9.8.9h11.6c.5 0 .9-.4.8-.9-.5-2.9-3-4.8-6.6-4.8Z" />
    </svg>
  );
}

const AV_TINTS = ["bg-accent/70 text-paper", "bg-ink/70 text-paper", "bg-accent-bright/50 text-ink"];

/* ═══ PLACEHOLDER TRACKING — Jake is collecting three real quotes ═══
   Swap each QUOTES entry (text + name) as they land. Card 1 shares the DW
   voice with the proof section until his real band quote arrives; cards 2-3
   are sector-generic slots (no invented business names). ═══ */
const QUOTES = [
  {
    text: "The phone started ringing the week the ads went live.",
    name: "Owner, Desert Wings Flight School",
  },
  {
    text: "I finally know what a lead costs me, and it keeps going down.",
    name: "Owner, local trades company",
  },
  {
    text: "The ads bring people in, the site books them, I see all of it.",
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

      // the witnesses join after the claim has landed
      gsap.fromTo(
        q("[data-anim='quote']"),
        { autoAlpha: 0, y: 21, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.16,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 45%", once: true },
        }
      );
      // and breathe at their own rates while the section is on screen
      (q("[data-drift]") as HTMLElement[]).forEach((el) => {
        gsap.to(el, {
          yPercent: parseFloat(el.dataset.drift || "0"),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  const card = (i: number, extra: string) => (
    <figure
      key={QUOTES[i].name}
      data-anim="quote"
      data-drift={i % 2 === 0 ? "-4" : "3"}
      className={`pb-quote ${extra}`}
    >
      <blockquote>
        <p className="text-[0.9375rem] leading-[1.5] text-ink/70">
          &ldquo;{QUOTES[i].text}&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-fib-2 flex items-center gap-[8px]">
        <span className={`pb-av ${AV_TINTS[i]}`}>
          <PersonIcon />
        </span>
        <span className="t-meta text-ink/45">{QUOTES[i].name}</span>
      </figcaption>
    </figure>
  );

  return (
    <section ref={root} data-pcta-hide className="relative overflow-x-clip">
      <div className="wrap relative flex min-h-[96svh] flex-col items-center justify-center py-fib-7 text-center">
        {/* the claim — full contrast, dead center */}
        <p data-anim="price" className="t-display-lg max-w-[16ch] text-balance">
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

        {/* the witnesses — quieter, floating around the claim (desktop);
            they join AFTER the price lands and drift at their own rates */}
        <div className="hidden lg:block" aria-hidden="false">
          {card(0, "pb-quote--tl")}
          {card(1, "pb-quote--tr")}
          {card(2, "pb-quote--bl")}
        </div>
      </div>

      {/* mobile / tablet: the witnesses stack under the claim */}
      <div className="wrap grid gap-fib-3 pb-fib-6 sm:grid-cols-3 lg:hidden">
        {QUOTES.map((quo) => (
          <figure
            key={quo.name}
            data-anim="quote"
            className="rounded-panel bg-panel/60 p-fib-4"
          >
            <blockquote>
              <p className="text-[0.9375rem] leading-[1.5] text-ink/70">
                &ldquo;{quo.text}&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-fib-2 flex items-center gap-[8px]">
              <span className={`pb-av ${AV_TINTS[QUOTES.indexOf(quo)]}`}>
                <PersonIcon />
              </span>
              <span className="t-meta text-ink/45">{quo.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
