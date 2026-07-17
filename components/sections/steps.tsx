"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";
import { ProcessCards } from "@/components/ui/process-cards";

/* The home page keeps only the SHAPE of the process — three beats, one
   viewport (the SearchKings "getting started is easy" compressed). The
   full walk lives on the service pages. Each card opens with an
   animated ICON in a tinted chip (Jake, 2026-07-17, chosen over the
   artifact tiles): accent line icons that DRAW themselves as the cards
   land — pathLength=1 on every shape so the CSS dash sweep is
   unit-based; no-JS and reduced-motion see them complete. */
const icon = (shapes: React.ReactNode) => (
  <span className="step-chip">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="step-icon"
      aria-hidden
    >
      {shapes}
    </svg>
  </span>
);

const STEPS = [
  {
    name: "The call",
    body: "Twenty minutes on your goals. A fixed quote in writing, two days later.",
    demo: icon(
      <path
        pathLength={1}
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      />
    ),
  },
  {
    name: "The build",
    body: "Ads, landing page, follow-up — designed and wired as one funnel.",
    demo: icon(
      <>
        <rect pathLength={1} x="2.5" y="4" width="19" height="16" rx="2.5" />
        <line pathLength={1} x1="2.5" y1="9" x2="21.5" y2="9" />
        <path pathLength={1} d="M6.5 13.5h5M6.5 16.5h8" />
      </>
    ),
  },
  {
    name: "Live in weeks",
    body: "Leads start landing, tracked to the dollar. You own everything.",
    demo: icon(
      <>
        <polyline pathLength={1} points="3 17 9 11 13 15 21 7" />
        <polyline pathLength={1} points="15 7 21 7 21 13" />
      </>
    ),
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
      // the icons draw themselves as the cards land — CSS transition
      // driven by classes (the GSAP dashoffset tween snapped to its end
      // state instead of sweeping; a class toggle is deterministic).
      // No-JS never gets .steps-armed, so icons render complete.
      root.current.classList.add("steps-armed");
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 78%",
        onEnter: () => root.current.classList.add("steps-drawn"),
      });
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
