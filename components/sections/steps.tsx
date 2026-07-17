"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";
import { ProcessCards } from "@/components/ui/process-cards";

/* The home page keeps only the SHAPE of the process — three beats, one
   viewport (the SearchKings "getting started is easy" compressed). The
   full walk lives on the service pages. */
const STEPS = [
  {
    name: "The call",
    body: "Twenty minutes on your goals. A fixed quote in writing, two days later.",
  },
  {
    name: "The build",
    body: "Ads, landing page, follow-up — designed and wired as one funnel.",
  },
  {
    name: "Live in weeks",
    body: "Leads start landing, tracked to the dollar. You own everything.",
  },
];

export function Steps() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        q("[data-anim]"),
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: EASE_STRUCTURE,
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        }
      );
    },
    { scope: root }
  );

  return (
    // full-viewport band (Jake, 2026-07-17): the section owns its screen —
    // one idea per viewport, same register as the price beat's 96svh above.
    // WHITE: the zebra alternation lasted an hour — bands ≈ 1 viewport +
    // a flip every band meant a seam was always on screen. The back act
    // is now one white run (price → steps → faq) with proof as the page's
    // single gray chapter; sections separate the way services does — long
    // runs, strong heads, each section's own object family.
    <section
      ref={root}
      data-nav="light"
      className="relative flex flex-col justify-center bg-white py-fib-6 md:min-h-[96svh]"
    >
      <div className="wrap">
        <h2 data-anim="steps-title" className="t-display-lg text-center">
          Getting started is easy
        </h2>
        <div className="mt-fib-4">
          <ProcessCards steps={STEPS} anim="steps-card" />
        </div>
      </div>
    </section>
  );
}
