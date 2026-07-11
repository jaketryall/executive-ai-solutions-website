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
    </section>
  );
}
