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
import { ArtifactFrame } from "@/components/ui/artifact";
import { whenArrived } from "@/components/anim/arrival";

/* The hero — "the search". Overlap-and-bleed: the outcome statement commands
   the left zone; the right zone ENACTS the concept — a Google search types
   itself and the client's real ad assembles under it. That ad card physically
   overhangs the hero→proof seam (fib-55) and is the element that docks into
   the proof section on first scroll. Parallel tracks: the headline mask-rise
   starts at t~0 (it is the LCP and the 3-second hook), the search enactment
   runs concurrently, and the sequence resolves on the CTA.

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

/* static proof chips (the old marquee, retired to glanceable rest — prices a
   buyer can read in one second, no motion) */
const CHIPS = [
  "Ads managed from $500/mo",
  "Sites from $2.5k",
  "Fixed quote in 2 days",
  "Hand-coded, no templates",
];

const QUERY = "flight school near me";

/* PLACEHOLDER — swap with the real Desert Wings ad, verbatim from Google Ads
   (real headline + real description). The display URL is already real. */
const AD = {
  url: "desertwingsflightschool.com",
  title: "Desert Wings Flight School | Learn to Fly at Falcon Field",
  desc: "Discovery flights and PPL through CFI training in Mesa, AZ. Book your first lesson today.",
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

  const rollPairs = locked !== null ? [ROLL_PAIRS[locked]] : ROLL_PAIRS;
  const ariaPair = ROLL_PAIRS[locked ?? 0];

  useGSAP(
    (context) => {
      const q = gsap.utils.selector(root);
      const navEl = document.querySelector(".site-nav");
      const typeEl = q(".g-q")[0] as HTMLElement;
      const adEl = q("[data-ad]")[0] as HTMLElement;
      const searchCard = q("[data-dock-card]")[0] as HTMLElement;

      // revisits skip the enactment — the ad is already a known fact
      const seen = sessionStorage.getItem("eas-hero-seen") === "1";

      if (reducedMotion()) {
        gsap.set([navEl, ...q("[data-anim]")], { autoAlpha: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        if (typeEl) typeEl.textContent = QUERY;
        gsap.set([searchCard, adEl], { autoAlpha: 1, y: 0 });
        return; // static: assembled search, first roll pair resting
      }

      /* ── the paired roll — a character wave through both lines: the old
         pair's letters exit up staggered, the new pair's rise from below
         through the same mask, the industry line trailing the outcome line
         by a beat. Starts after the entrance lands, pauses off-screen. ── */
      const rollLines = q(".h1-roll--pair") as HTMLElement[];
      let entranceDone = false;
      let inView = false;
      let roll: gsap.core.Timeline | undefined;
      if (rollLines.length && rollLines[0].children.length > 1) {
        const n = rollLines[0].children.length;
        const HOLD = 3.2;
        const LAG = 0.14;
        const rollTl = gsap.timeline({ paused: true, repeat: -1 });
        roll = rollTl;
        rollLines.forEach((line, li) => {
          const words = Array.from(line.children) as HTMLElement[];
          words.forEach((w, wi) => {
            if (wi > 0) gsap.set(w.children, { yPercent: 115 });
            gsap.set(w, { autoAlpha: 1 });
          });
          for (let k = 1; k <= n; k++) {
            const t = k * HOLD + li * LAG;
            const out = words[k - 1].children;
            const inn = words[k % n].children;
            rollTl
              // force3D:false keeps glyphs 2D — composited letters can slip
              // the clip mid-tween
              .to(
                out,
                { yPercent: -115, duration: 0.45, ease: EASE_UI, stagger: 0.02, force3D: false },
                t
              )
              .set(out, { yPercent: 115 }, t + 0.45 + 0.02 * out.length)
              .fromTo(
                inn,
                { yPercent: 115 },
                {
                  yPercent: 0,
                  duration: 0.75,
                  ease: EASE_STRUCTURE,
                  stagger: 0.02,
                  force3D: false,
                  immediateRender: false, // the wrap tween must not pre-render
                },
                t + 0.18
              );
          }
        });
      }
      const sync = () => {
        const on = entranceDone && inView && !document.hidden;
        if (roll) (on ? roll.play() : roll.pause());
      };
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          inView = self.isActive;
          sync();
        },
      });
      document.addEventListener("visibilitychange", sync);
      context.add(() => () => document.removeEventListener("visibilitychange", sync));

      /* ── Title sequence: PARALLEL tracks. The statement is the protagonist
         and starts immediately; the search enactment is the concurrent
         secondary action; the CTA resolves the sequence; chips land last. ── */
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE_STRUCTURE } });
      tl.fromTo(
        navEl,
        { autoAlpha: 0, y: -16 },
        { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "transform" },
        0.05
      )
        // track A — the protagonist rises at t~0
        .fromTo(
          q(".hero-h1 .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 1.05, stagger: 0.09 },
          0.1
        )
        .fromTo(
          q("[data-anim='support']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.85
        )
        // track B — the enactment, concurrent
        .fromTo(
          searchCard,
          { autoAlpha: 0, y: 21, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.75 },
          0.2
        );

      if (seen) {
        // revisit: the ad is already assembled, no typing
        if (typeEl) typeEl.textContent = QUERY;
        tl.set(adEl, { autoAlpha: 1, y: 0 }, 0.2);
      } else {
        const typeState = { n: 0 };
        tl.to(
          typeState,
          {
            n: QUERY.length,
            duration: 0.7,
            // diegetic typing: constant character rate, not an easing choice
            ease: "none",
            snap: { n: 1 },
            onUpdate: () => {
              if (typeEl) typeEl.textContent = QUERY.slice(0, typeState.n);
            },
          },
          0.45
        ).fromTo(
          adEl,
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          1.15
        );
      }

      tl
        // the resolve — the sequence lands on the one action
        .fromTo(
          q("[data-anim='ctas']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          1.35
        )
        .fromTo(
          q("[data-anim='chips']"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5, ease: EASE_UI },
          1.55
        )
        .call(() => {
          entranceDone = true;
          sessionStorage.setItem("eas-hero-seen", "1");
          sync();
        });

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

      /* ── exit parallax (not a pin): the statement lifts slightly faster
         than the scroll as the hero leaves; the ad card holds its ground for
         the dock (step-3 scrub takes it the rest of the way). ── */
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
      {/* grid ratio matches the proof section exactly (62/38) so the ad card
          column and the proof anchor zone share the same edges — the straddle
          lands flush, not "almost" */}
      <div className="hero-in wrap relative z-10 grid min-h-[92svh] items-center gap-fib-5 pb-0 pt-[120px] md:grid-cols-[62fr_38fr] md:pt-fib-6">
        {/* ── left zone: the statement (outcome leads, industry follows) ── */}
        <div className="hero-left">
          <h1
            className="hero-h1 t-display-xl t-display-xl--hero"
            aria-label={`${ariaPair.out} ${ariaPair.who}. We run the ads and build the page they land on.`}
          >
            <span aria-hidden>
              <span className="mask-line">
                <span className="mask-inner mask-inner--block">
                  <span className="h1-roll h1-roll--pair text-accent">
                    {rollPairs.map((p, wi) => (
                      <span key={`${p.out}-${wi}`} className="h1-roll-word">
                        {[...p.out].map((c, ci) => (
                          <span key={ci} className="rc">
                            {c === " " ? " " : c}
                          </span>
                        ))}
                      </span>
                    ))}
                  </span>
                </span>
              </span>
              <span className="mask-line">
                <span className="mask-inner mask-inner--block">
                  <span className="h1-roll h1-roll--pair">
                    {rollPairs.map((p, wi) => (
                      <span key={`${p.who}-${wi}`} className="h1-roll-word">
                        {[...p.who].map((c, ci) => (
                          <span key={ci} className="rc">
                            {c === " " ? " " : c}
                          </span>
                        ))}
                      </span>
                    ))}
                  </span>
                </span>
              </span>
            </span>
          </h1>

          <p
            data-anim="support"
            className="mt-fib-3 max-w-[40ch] text-[1.0625rem] leading-[1.55] text-ink/70"
          >
            We run the ads. We build the page they land on. One team,
            accountable for the whole click.
          </p>

          <div data-anim="ctas" className="mt-fib-3 flex flex-wrap items-center gap-fib-2">
            <CTA href="#estimate" label="Get an instant estimate" tone="ink" />
            <a href="#builder" className="u-link t-meta py-fib-2">
              Build your site in 60 seconds
            </a>
          </div>

          <div data-anim="chips" className="mt-fib-4 flex flex-wrap gap-fib-1">
            {CHIPS.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* ── right zone: the enactment. The card overhangs the seam (fib-55
            desktop / fib-21 mobile) — the overlap IS the layout, and the
            step-3 scrub docks it into the proof section's anchor slot. ── */}
        <div
          data-dock-card
          className="relative z-20 -mb-fib-3 md:-mb-fib-5 md:self-end"
        >
          <ArtifactFrame
            variant="card"
            tone="paper"
            label={`Google search for ${QUERY}, showing the Desert Wings Flight School ad`}
            className="ad-artifact"
          >
            <div className="g-search" aria-hidden>
              <svg viewBox="0 0 16 16" fill="none" className="g-glass">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="g-q" />
              <span className="g-caret" />
            </div>
            <div data-ad className="g-ad" aria-hidden>
              <p className="g-sponsored">Sponsored</p>
              <p className="g-url">{AD.url}</p>
              <p className="g-title">{AD.title}</p>
              <p className="g-desc">{AD.desc}</p>
            </div>
          </ArtifactFrame>
        </div>
      </div>
    </section>
  );
}
