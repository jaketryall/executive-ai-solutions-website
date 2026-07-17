"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";
import { whenArrived } from "@/components/anim/arrival";

/* The hero — the SearchKings shape (Jake, 2026-07-16): NO mockup here.
   The demos live where the choosing happens — one per service card below,
   one per service-page phone — so the hero is just the claim, the one
   action, the quiet audit path, and the de-risk line. (The old search
   enactment lives in git history at 6ac2517 if it's ever wanted back.)

   The statement keeps the rolling industry mirror: it cycles for organic
   visitors and locks to ?i= for labeled traffic (ads + reopened build links —
   same param the builder reads). Outcome leads, industry follows. */
const ROLL_PAIRS = [
  { out: "More customers", who: "for local business" },
  { out: "More students", who: "for flight schools" },
  { out: "More bookings", who: "for restaurants" },
  { out: "More jobs", who: "for the trades" },
];
const ROLL_LOCK: Record<string, number> = {
  flight: 1,
  restaurant: 2,
  trades: 3,
  other: 0,
};

// layout effect so the ?i= lock commits BEFORE first paint
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Hero() {
  const root = useRef<HTMLElement>(null!);
  const [locked, setLocked] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const i = new URLSearchParams(window.location.search).get("i");
    if (i && ROLL_LOCK[i] !== undefined) setLocked(ROLL_LOCK[i]);
  }, []);

  const ariaPair = ROLL_PAIRS[locked ?? 0];

  useGSAP(
    (context) => {
      const q = gsap.utils.selector(root);
      const navEl = document.querySelector(".site-nav");

      if (reducedMotion()) {
        gsap.set([navEl, ...q("[data-anim]")], { autoAlpha: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        return;
      }

      /* ── Title sequence: the statement is the protagonist; the CTA
         resolves it; the de-risk line lands last. ── */
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE_STRUCTURE } });
      tl.fromTo(
        navEl,
        { autoAlpha: 0, y: -16 },
        { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "transform" },
        0.05
      )
        // track A — the eyebrow sets the category, the statement rises
        .fromTo(
          q("[data-anim='eyebrow']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.1
        )
        .fromTo(
          q("[data-anim='statement']"),
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 1.0, stagger: 0.12 },
          0.22
        );


      tl
        // the resolve — the sequence lands on the one action
        .fromTo(
          q("[data-anim='ctas']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.95
        )
        .fromTo(
          q("[data-anim='proofrow']"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, ease: EASE_UI },
          1.15
        );

      // fonts measurable AND the route-transition sheet landed
      Promise.all([document.fonts.ready, whenArrived()]).then(() => {
        if (!root.current) return;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            tl.play();
            ScrollTrigger.refresh();
          })
        );
      });

      /* ── the rolling industry mirror — the hero's one living element.
         Organic visitors see the outcome line cycle through industries;
         ?i= traffic stays locked to its own. Governed: in-view + visible
         tab only, and the h1 height is locked to the longest pair so the
         CTA row never jumps. ── */
      if (locked === null) {
        const out = q("[data-roll-out]")[0] as HTMLElement;
        const who = q("[data-roll-who]")[0] as HTMLElement;
        const h1 = q("[data-anim='statement']")[0] as HTMLElement;
        if (out && who && h1) {
          // pair 0 is the longest — lock its height before cycling
          h1.style.minHeight = `${h1.offsetHeight}px`;
          let idx = 0;
          const roll = gsap.timeline({ repeat: -1, paused: true });
          roll
            .to({}, { duration: 3.8 })
            .to([out, who], {
              yPercent: -55,
              autoAlpha: 0,
              duration: 0.4,
              ease: EASE_UI,
              stagger: 0.06,
            })
            .call(() => {
              idx = (idx + 1) % ROLL_PAIRS.length;
              out.textContent = ROLL_PAIRS[idx].out;
              who.textContent = `${ROLL_PAIRS[idx].who}.`;
            })
            .fromTo(
              [out, who],
              { yPercent: 55, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.5,
                ease: EASE_UI,
                stagger: 0.06,
              }
            );
          const sync = () => {
            const st = ScrollTrigger.getById("hero-roll");
            const on = (st?.isActive ?? true) && !document.hidden;
            (on ? roll.play() : roll.pause());
          };
          ScrollTrigger.create({
            id: "hero-roll",
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            onToggle: sync,
          });
          document.addEventListener("visibilitychange", sync);
          context.add(() => () =>
            document.removeEventListener("visibilitychange", sync)
          );
          sync();
        }
      }

      /* ── exit parallax (not a pin): the statement lifts slightly faster
         than the scroll as the hero leaves ── */
      gsap.to(q(".hero-left"), {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root, dependencies: [locked], revertOnUpdate: true }
  );

  return (
    <section id="top" ref={root} className="hero relative">
      {/* the SearchKings hero: CENTERED — claim, one action, the quiet
          audit path, the de-risk line. No mockup; the services cards
          directly below carry the demos. */}
      <div className="hero-in wrap relative z-10 flex min-h-[72svh] flex-col items-center justify-center pb-fib-6 pt-[120px] text-center md:pt-fib-6">
        {/* ── the statement (outcome leads, industry follows) ── */}
        <div className="hero-left flex flex-col items-center">
          <p data-anim="eyebrow" className="t-meta uppercase text-ink/70">
            Full-funnel ads agency
          </p>
          {/* the two-tone statement (the signature): bright outcome, dim
              continuation IN the same sentence. The dim clause stays five
              words — that's what lets the whole thing hold display size
              without reading as a wall (the eyebrow + the ad demo carry the
              specifics) */}
          <h1
            data-anim="statement"
            className="t-statement t-statement--hero mx-auto mt-fib-2 max-w-[24ch] text-balance"
            aria-label={`${ariaPair.out} ${ariaPair.who}. We run the whole click.`}
          >
            {/* the visual text swaps on the roll; the aria-label above is
                the stable sentence screen readers get */}
            <span aria-hidden>
              <span className="text-ink">
                <span data-roll-out className="inline-block">
                  {ariaPair.out}
                </span>{" "}
                <span data-roll-who className="inline-block">
                  {ariaPair.who}.
                </span>
              </span>{" "}
              {/* the two-tone goes SearchKings: the second clause wears the
                  click color instead of a dim — accent IS the click */}
              <span className="text-accent">We run the whole click.</span>
            </span>
          </h1>

          <div data-anim="ctas" className="mt-fib-3 flex flex-wrap items-center justify-center gap-fib-3">
            <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
            {/* the quiet path for the undecided — the give, one scroll away */}
            <a href="#site-check" className="u-link text-ink/70">
              Not sure yet? Run the free audit
            </a>
          </div>

          {/* the de-risk row (SearchKings' move, our facts): answers the
              objection's shape before it forms. Holds this slot until real
              client marks earn back the facepile. */}
          <p data-anim="proofrow" className="t-meta mt-fib-4 text-ink/60">
            No lock-in &middot; Fixed quote in 2 days &middot; You own
            everything
          </p>
        </div>

      </div>
    </section>
  );
}
