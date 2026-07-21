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
   full walk lives on the service pages. PURE TYPE (Jake, 2026-07-17,
   "how would apple do it" → option 2): quiet solid numerals lead the
   cards; no icons, no imagery — for a section whose message is "this
   is easy," the restraint IS the design. (The day's earlier takes —
   artifact tiles, icon chips — live at 3da36af / e946ea5.) */
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
    // WHITE: part of the back act's single white run (proof is the page's
    // one gray chapter).
    <section
      ref={root}
      data-nav="light"
      className="relative flex flex-col justify-center bg-white py-fib-6 md:min-h-[96svh]"
    >
      <div className="wrap">
        {/* TRYING (Jake, 2026-07-17): the whole band rides one light-gray
            card — a gray field on the white run, white step cards popping
            inside it (white objects on gray, per the object rule) */}
        <div className="rounded-panel bg-panel px-fib-3 py-fib-5 md:px-fib-5 md:py-fib-6">
          {/* concrete beats reassuring (copy audit 2026-07-21): "easy" is
              every agency's word; the numbers are the promise */}
          <h2 data-anim="steps-title" className="t-display-lg text-center">
            Three steps. Two-day quote.
          </h2>
          <div className="mt-fib-5">
            <ProcessCards steps={STEPS} anim="steps-card" numeralLead />
          </div>
        </div>
      </div>
    </section>
  );
}
