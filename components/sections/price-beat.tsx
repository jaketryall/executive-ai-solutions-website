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
import { PersonIcon } from "@/components/ui/person-icon";
// the ONE set of client voices (placeholders tracked in lib/quotes.ts),
// shared with the service-page price beats
import { QUOTES, AV_TINTS } from "@/lib/quotes";

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

      /* the entrance BUDGET: one guided beat (the claim), everything else
         rides with it — by the time the section centers, it's readable.
         (Jake: entrances must guide attention, never delay comprehension.) */
      const tl = gsap.timeline({
        defaults: { ease: EASE_STRUCTURE },
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });
      tl.fromTo(
        q("[data-anim='price']"),
        { autoAlpha: 0, y: 21 },
        { autoAlpha: 1, y: 0, duration: 0.6 }
      ).fromTo(
        [...q("[data-anim='line']"), ...q("[data-anim='act']")],
        { autoAlpha: 0, y: 13 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE_UI, stagger: 0.08 },
        "-=0.4"
      );

      // the witnesses still join AFTER the claim (that sequencing is the
      // point), just without making anyone wait for it
      gsap.fromTo(
        q("[data-anim='quote']"),
        { autoAlpha: 0, y: 21, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 58%", once: true },
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
    <section
      ref={root}
      data-pcta-hide
      // THE FLIP: chapter two (paper) rises over the ink run as a rounded
      // sheet — the page's one ground change, on our own grammar
      className="relative z-10 -mt-fib-4 overflow-x-clip rounded-t-panel bg-canvas"
    >
      <div className="wrap relative flex min-h-[96svh] flex-col items-center justify-center py-fib-7 text-center">
        {/* the claim — full contrast, dead center */}
        {/* a <p>, not a heading — it shares the h1's statement register so the
            page's two claim peaks (hero, price) sit above every section h2 */}
        <p data-anim="price" className="t-statement t-statement--hero max-w-[26ch] text-balance">
          Sites from <span className="text-accent">$2.5k</span>.
          <br className="hidden md:block" /> Ads managed from{" "}
          <span className="text-accent">$500/mo</span>.
        </p>
        <p data-anim="line" className="mt-fib-3 max-w-[44ch] text-ink/70">
          Your exact number takes 60 seconds. No call, no email, no
          obligation.
        </p>
        <div data-anim="act" className="mt-fib-4">
          <CTA href="#estimate" label="Price my project" tone="ink" />
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
