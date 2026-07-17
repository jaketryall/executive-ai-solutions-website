"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_UI,
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
    (context) => {
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

      // the hold — a bare pin; every animation lives on the master clock
      // below. NO anticipatePin: it pre-shifts the pinned element by scroll
      // velocity (a visible pop at engage) and Lenis's lerped scroll doesn't
      // have the native lag it exists to mask.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=100%",
        pin: q(".closer-stage")[0],
        invalidateOnRefresh: true,
      });

      /* ONE master scrubbed timeline across the whole section — approach
         (1 viewport) · hold (1.0, the pin) · exit (0.45) — durations in
         viewport units so the playhead maps 1:1 onto scroll. A single
         timeline means a single writer per property: the grow and shrink
         can never race each other during fast traversals (two separate
         scrubbed tweens on the same props CAN, mid-smoothing). */
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom 30%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // 1 · the approach — the card grows to full bleed a beat BEFORE the
      //     pin (0.88 of the approach ≈ 12vh early). With scrub smoothing the
      //     scale lags the scroll ~a third of a second, so ending at the pin
      //     itself meant the card's edges were still visible — and visibly
      //     hard-stopping — right at engage (the "snap"). Ending early, the
      //     boundary hits a true full-bleed wall: nothing on screen has edges
      //     left to snap, and the drift carries the motion through.
      tl.fromTo(
        card,
        { scale: 0.92, borderRadius: 24 },
        { scale: 1, borderRadius: 0, duration: 0.88 },
        0
      );

      // 2 · the read — ONE continuous drift across approach + hold, landing
      //     on the ask at release. Starts fully OFFSCREEN right (110vw) so
      //     the first words slide in during the approach. A single tween
      //     keeps the horizontal speed CONSTANT through the pin boundary —
      //     splitting it into approach/hold segments put a 3.6× speed jump
      //     exactly where the pin engages, which read as a snap.
      tl.fromTo(
        drift,
        { x: () => window.innerWidth * 1.1 },
        {
          x: () => -(drift.offsetWidth - card.clientWidth + pad()),
          duration: 2.0,
        },
        0
      );
      if (cta) {
        tl.fromTo(
          cta,
          { autoAlpha: 0, y: 21 },
          { autoAlpha: 1, y: 0, duration: 0.12 },
          1.88
        );
      }

      // 3 · the exit — the wall TRAVELS UP first (2.0→2.18, unscaled: just
      //     the page carrying it away), and only then folds into a card for
      //     the last stretch. Shrinking at the unpin itself read as an
      //     instant pop; the travel-first order lets the release breathe.
      //     y compensates the center-origin shrink so the bottom edge stays
      //     flush with the section end.
      tl.fromTo(
        card,
        { scale: 1, borderRadius: 0, y: 0 },
        {
          scale: 0.92,
          borderRadius: 24,
          y: () => card.offsetHeight * 0.04,
          duration: 0.35,
          immediateRender: false,
        },
        2.35
      );

      // the lean — the line skews with scroll velocity, so even the hold
      // feels alive the instant you move (and settles when you stop)
      const skewTo = gsap.quickTo(drift, "skewX", { duration: 0.4, ease: EASE_UI });
      let idle: ReturnType<typeof setTimeout>;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          skewTo(gsap.utils.clamp(-5, 5, self.getVelocity() / -400));
          clearTimeout(idle);
          idle = setTimeout(() => skewTo(0), 120);
        },
      });
      context.add(() => () => clearTimeout(idle));
    },
    { scope: root }
  );

  return (
    <section data-pcta-hide ref={root} data-nav="dark" aria-label="Start your project" className="relative mt-fib-6">
      {/* the pinned stage — one full viewport; the card's inset/radius live in
          the scale+radius tweens (reduced motion rests the inset card) */}
      <div className="closer-stage h-svh w-full motion-reduce:p-fib-1 md:motion-reduce:p-fib-2">
        {/* 1px overbleed on every side: the scale transform rounds to
            subpixels on retina, and without it the light footer layer
            beneath feathers through as a hairline under the full-bleed edge */}
        <div className="closer-card -ml-px -mt-px flex h-[calc(100%+2px)] w-[calc(100%+2px)] flex-col justify-center overflow-hidden will-change-transform motion-reduce:rounded-panel">
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
            <CTA href="/pricing#estimate" label="Price my project" tone="ink" />
          </div>
        </div>
      </div>
    </section>
  );
}
