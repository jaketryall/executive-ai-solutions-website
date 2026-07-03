"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";

/* The closer — one big rounded steel box, the page's single full-color
   surface (the accent is the click color everywhere else, and this panel IS
   the click). It fills the viewport at the card system's own inset, pins,
   and the oversized statement reads itself across the frame while you're
   held there — the whole sentence passes, landing on the ask, the pill
   arriving with it — then the box releases into the footer reveal.
   Reduced motion rests it with the statement wrapped and centered. */

export function Closer() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const card = q(".closer-card")[0] as HTMLElement;
      const drift = q("[data-drift]")[0] as HTMLElement;
      const cta = q("[data-anim='closer-cta']")[0] as HTMLElement;
      if (!card || !drift) return;

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        return; // CSS rests the box readable
      }

      const pad = () => Math.min(89, window.innerWidth * 0.06);

      // scroll is the clock: the read maps onto the pin (ease:"none" + scrub)
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=180%",
          pin: q(".closer-stage")[0],
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // the read — the FULL statement passes while the box is pinned and
      // fully visible (never mid-arrival), landing on the ask
      tl.fromTo(
        drift,
        { x: () => window.innerWidth * 0.3 },
        { x: () => -(drift.offsetWidth - card.clientWidth + pad()), duration: 0.85 },
        0
      );

      // the pill arrives as the ask lands
      if (cta) {
        tl.fromTo(
          cta,
          { autoAlpha: 0, y: 21 },
          { autoAlpha: 1, y: 0, duration: 0.12 },
          0.72
        );
      }
    },
    { scope: root }
  );

  return (
    <section ref={root} data-nav="dark" aria-label="Start your project" className="relative">
      {/* the pinned stage — one viewport, the box at the system's own inset */}
      <div className="closer-stage h-svh w-full p-fib-1 md:p-fib-2">
        <div className="closer-card flex h-full w-full flex-col justify-center overflow-hidden rounded-[24px]">
          {/* the statement — nowrap + wider than the frame so the pinned read
              has a story to tell; reduced motion wraps it centered */}
          <p
            data-drift
            className="t-display-drift w-max self-start whitespace-nowrap px-fib-3 will-change-transform motion-reduce:w-auto motion-reduce:self-center motion-reduce:whitespace-normal motion-reduce:px-fib-4 motion-reduce:text-center md:px-fib-5"
          >
            Your next customer is searching right now.{" "}
            <span className="text-accent-bright">Be what they find.</span>
          </p>

          <div data-anim="closer-cta" className="mt-fib-5 self-center md:mt-fib-6">
            <CTA href="#contact" label="Start your project" tone="ink" />
          </div>
        </div>
      </div>
    </section>
  );
}
