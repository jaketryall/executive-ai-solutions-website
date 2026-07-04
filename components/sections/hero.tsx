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
import { Monogram } from "@/components/ui/monogram";

/* The hero — a centered statement with the work ORBITING it. The room isn't
   empty and the type isn't shouting: proof fills the space instead. Every
   floating card is a real artifact (live client shots, the actual quote
   ticket, the actual build report) — the pattern goes wrong only when the
   cards are stock. The statement keeps the rolling industry mirror: it
   cycles for organic visitors and locks to ?i= for labeled traffic (ads +
   reopened build links — same param the builder reads). */
/* the paired roll — industry AND outcome roll together, so the statement is
   a complete value prop on its own (no sub needed): "Websites that bring
   flight schools more students." Each pair is the audience + THEIR outcome. */
const ROLL_PAIRS = [
  { who: "local business", out: "more customers." },
  { who: "flight schools", out: "more students." },
  { who: "restaurants", out: "more bookings." },
  { who: "the trades", out: "more jobs." },
];
const ROLL_LOCK: Record<string, number> = {
  flight: 1,
  restaurant: 2,
  trades: 3,
  other: 0,
};

/* the trust marquee — proof and risk-killers a buyer can act on,
   not tech claims (a plumber doesn't convert on "Next.js") */
const PROOF = [
  "Projects from $2.5k",
  "Fixed quote in 2 days",
  "Live in about 4 weeks",
  "Live client: Desert Wings Flight School",
  "Hand-coded — no templates",
  "SEO + Google Ads from day one",
];

/* orbit geometry: [depth] drives the mouse parallax; rotation settles on
   entrance. Positions live here (not CSS) so the cards and their motion read
   as one system. Density is the message — the work bleeds off both side
   edges (negative offsets), and slight card-on-card overlaps are intentional
   (collage, not grid). All of it is real: live client pages + our own tools. */
type OrbitCard = {
  kind: "browser" | "phone" | "quote" | "report";
  img?: string;
  domain?: string;
  style: React.CSSProperties;
  r: number;
  depth: number;
  enter: { x: number; y: number };
};

/* Flip to true to bring the orbit back — the full card system below stays
   intact for the A/B. Current call: the peeking showreel is the imagery, and
   the statement gets the room. */
const SHOW_ORBIT = false;

/* The tilt SYSTEM (not scatter): every card leans toward the statement —
   top-left rotates clockwise (+), top-right counter-clockwise (−), mirrored
   at the bottom, and magnitude eases toward 0 near the vertical middle. So
   the whole field points at the words. `enter` is each card's outward vector:
   they converge into place from their own directions instead of all rising.
   `depth` (mouse parallax) is one sign for the whole field, scaled by card
   size — nearer/larger moves more, like a single plane of depth. */
const ORBIT: OrbitCard[] = [
  // left column — two cards and air between them (the middle band stays open)
  { kind: "browser", img: "/hero/dw-hero.jpg", domain: "desertwingsflightschool.com", style: { left: "-5%", top: "6%", width: "clamp(210px,22vw,330px)" }, r: 7, depth: -24, enter: { x: -44, y: -28 } },
  { kind: "browser", img: "/hero/dw-journey.jpg", domain: "desertwingsflightschool.com", style: { left: "-4%", bottom: "4%", width: "clamp(190px,18vw,280px)" }, r: -5, depth: -18, enter: { x: -44, y: 28 } },
  // right column — the phone, the light fleet page, one ink anchor
  { kind: "phone", img: "/hero/dw-mobile.jpg", style: { right: "-2%", top: "5%", width: "clamp(100px,10vw,145px)" }, r: -6, depth: -10, enter: { x: 40, y: -28 } },
  { kind: "browser", img: "/hero/dw-fleet.jpg", domain: "desertwingsflightschool.com", style: { right: "-6%", top: "38%", width: "clamp(200px,20vw,310px)" }, r: -3, depth: -20, enter: { x: 48, y: 0 } },
  { kind: "report", style: { right: "3%", bottom: "6%", width: "clamp(175px,15vw,230px)" }, r: 5, depth: -14, enter: { x: 34, y: 30 } },
];

// layout effect so the lock commits BEFORE first paint — with warm font
// caches a passive effect can lose the race against the title sequence
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Hero() {
  const root = useRef<HTMLElement>(null!);
  const [locked, setLocked] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const i = new URLSearchParams(window.location.search).get("i");
    if (i && ROLL_LOCK[i] !== undefined) setLocked(ROLL_LOCK[i]);
  }, []);

  // no wrap clone needed — words are stacked in place, the wave cycles them
  const rollPairs = locked !== null ? [ROLL_PAIRS[locked]] : ROLL_PAIRS;
  const ariaPair = ROLL_PAIRS[locked ?? 0];

  useGSAP(
    (context) => {
      const q = gsap.utils.selector(root);
      const navEl = document.querySelector(".site-nav");
      const cards = q(".orb-item") as HTMLElement[];

      if (reducedMotion()) {
        gsap.set([navEl, ...q("[data-anim]")], { autoAlpha: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        gsap.set(cards, { autoAlpha: 1 });
        return; // static: first roll word rests visible, cards rest settled
      }

      /* ── the paired roll — a character wave, not a line jump: the old
         pair's letters exit up staggered left→right, the new pair's rise
         from below through the same mask, and the outcome line trails the
         industry line by a beat. One wave passing through the statement.
         Words are stacked in place (absolute), so the cycle wraps without
         a clone. Starts after the entrance lands, pauses off-screen. ── */
      const rollLines = q(".h1-roll--pair") as HTMLElement[];
      let entranceDone = false;
      let inView = false;
      let roll: gsap.core.Timeline | undefined;
      // the who-window's per-word widths (em), measured once fonts are ready —
      // the width tweens read these lazily (function-based values), and em
      // units keep them honest through resize
      let whoEms: number[] = [];
      if (rollLines.length && rollLines[0].children.length > 1) {
        const n = rollLines[0].children.length;
        const HOLD = 3.2; // seconds each pair rests
        const LAG = 0.14; // the outcome line's trailing beat
        roll = gsap.timeline({ paused: true, repeat: -1 });
        rollLines.forEach((line, li) => {
          const isInline = line.classList.contains("h1-roll--inline");
          const words = Array.from(line.children) as HTMLElement[];
          // non-first words park their letters below the mask (CSS keeps the
          // words invisible for no-JS / reduced motion; autoAlpha releases them)
          words.forEach((w, wi) => {
            if (wi > 0) gsap.set(w.children, { yPercent: 115 });
            gsap.set(w, { autoAlpha: 1 });
          });
          for (let k = 1; k <= n; k++) {
            const t = k * HOLD + li * LAG;
            const out = words[k - 1].children;
            const inn = words[k % n].children;
            // the inline window re-sizes to the incoming word while the
            // letters swap, so the centered line re-seats itself smoothly
            if (isInline) {
              roll.to(
                line,
                { width: () => `${whoEms[k % n]}em`, duration: 0.6, ease: EASE_STRUCTURE },
                t + 0.1
              );
            }
            roll
              // force3D:false keeps the letters 2D — GPU-promoted glyphs can
              // slip the mask mid-tween (composited layers vs overflow:hidden)
              .to(
                out,
                { yPercent: -115, duration: 0.45, ease: "power2.in", stagger: 0.02, force3D: false },
                t
              )
              // once clear of the mask, re-park the old letters below for the next lap
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
                  // critical: the wrap tween (last→first) must NOT render its
                  // from-state at build time, or word 0 starts parked below
                  immediateRender: false,
                },
                t + 0.18
              );
          }
        });
      }
      const floats: gsap.core.Tween[] = [];
      const sync = () => {
        const on = entranceDone && inView && !document.hidden;
        if (roll) (on ? roll.play() : roll.pause());
        floats.forEach((f) => (on ? f.play() : f.pause()));
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

      // ── the idle float — each card breathes on its own period ──
      cards.forEach((card, i) => {
        floats.push(
          gsap.to(card, {
            y: `+=${9 + i * 3}`,
            duration: 3.6 + i * 0.65,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            paused: true,
          })
        );
      });

      // ── mouse parallax (x only — the float owns y), fine pointers only ──
      if (window.matchMedia("(pointer: fine)").matches && cards.length) {
        const xTos = cards.map((card, i) =>
          gsap.quickTo(card, "x", { duration: 0.9, ease: EASE_UI })
        );
        const onMove = (e: PointerEvent) => {
          const norm = (e.clientX / window.innerWidth) * 2 - 1; // -1 … 1
          ORBIT.forEach((o, i) => xTos[i]?.(norm * o.depth));
        };
        root.current.addEventListener("pointermove", onMove);
        context.add(() => () => root.current?.removeEventListener("pointermove", onMove));
      }

      // ── Title sequence (plays once fonts are ready; the gate kills FOUC) ──
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE_STRUCTURE } });
      tl.fromTo(
        navEl,
        { autoAlpha: 0, y: -16 },
        { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "transform" },
        0.05
      )
        .fromTo(
          q("[data-anim='eyebrow']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.15
        )
        // the protagonist: the statement rises line by line
        .fromTo(
          q(".hero-h1 .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 1.05, stagger: 0.09 },
          0.25
        )
        // the work converges around it — each card arrives from its own
        // outward direction, settling from a slightly deeper tilt
        .fromTo(
          cards,
          {
            autoAlpha: 0,
            x: (i) => ORBIT[i].enter.x,
            y: (i) => ORBIT[i].enter.y,
            scale: 0.92,
            rotation: (i) => ORBIT[i].r * 1.7,
          },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: (i) => ORBIT[i].r,
            duration: 0.95,
            stagger: 0.08,
          },
          "-=0.25"
        )
        .fromTo(
          q("[data-anim='ctas']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          "-=0.35"
        )
        .fromTo(
          q("[data-anim='ticker']"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8, ease: EASE_UI },
          "-=0.25"
        )
        .call(() => {
          entranceDone = true;
          sync();
        });

      document.fonts.ready.then(() => {
        // measure the who-words at their true (display-font) widths — the
        // roll's width tweens read these; visibility:hidden doesn't skew rects
        const whoWin = q(".h1-roll--inline")[0] as HTMLElement | undefined;
        if (whoWin) {
          const fs = parseFloat(getComputedStyle(whoWin).fontSize);
          whoEms = Array.from(whoWin.children).map(
            (w) => w.getBoundingClientRect().width / fs
          );
        }
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            tl.play();
            ScrollTrigger.refresh();
          })
        );
      });
    },
    { scope: root, dependencies: [locked], revertOnUpdate: true }
  );

  return (
    <section id="top" ref={root} data-nav="light" className="hero relative overflow-hidden">
      {/* ── the orbit — real artifacts floating around the statement. Needs
          real gutters: below ~1200px the cards collide with the centered
          statement, so tablets get the clean type-only hero. ── */}
      {SHOW_ORBIT && (
      <div className="pointer-events-none absolute inset-0 z-0 hidden min-[1200px]:block" aria-hidden>
        {ORBIT.map((o, i) => (
          <div key={i} className="orb-item" style={{ ...o.style, rotate: `${o.r}deg` }}>
            {o.kind === "browser" && (
              <div className="browser-card">
                <span className="browser-chrome">
                  <Monogram className="h-[13px] w-[13px] opacity-70" />
                  <span className="text-trim">{o.domain}</span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.img} alt="" className="block w-full" />
              </div>
            )}
            {o.kind === "phone" && (
              <div className="phone-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.img} alt="" />
              </div>
            )}
            {o.kind === "quote" && (
              <div className="rounded-[14px] bg-ink p-[18px] text-paper shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
                <Monogram className="h-[14px] w-[14px] opacity-80" />
                <p className="mt-[10px] text-[12px] text-paper/60">Your fixed quote</p>
                <p className="t-num mt-[2px] font-display text-[24px] font-[800] leading-none">
                  From $2,500
                </p>
                <p className="mt-[8px] text-[11px] leading-[1.45] text-paper/60">
                  In your inbox within two days.
                </p>
              </div>
            )}
            {o.kind === "report" && (
              <div className="rounded-[14px] bg-ink p-[16px] text-paper shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
                <p className="t-meta text-paper/55">Build report</p>
                <div className="mt-[11px] flex flex-col gap-[9px]">
                  <div className="sc-row">
                    <span className="sc-label">Performance</span>
                    <span className="sc-track"><span className="sc-fill" /></span>
                    <span className="sc-val t-num">100</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-label">SEO</span>
                    <span className="sc-track"><span className="sc-fill" /></span>
                    <span className="sc-val t-num">100</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-label">Load</span>
                    <span className="sc-track"><span className="sc-fill sc-fill--load" /></span>
                    <span className="sc-val t-num">0.4s</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}

      {/* height leaves ~8–10rem of viewport 1 for the showreel's top edge (the peek) */}
      <div className="hero-in relative z-10 mx-auto flex min-h-[calc(100svh-10rem)] w-full max-w-[1280px] flex-col items-center justify-center px-[21px] pb-[34px] pt-[105px] md:min-h-[calc(100svh-9rem)] md:pt-[110px]">
        {/* ── the category, small and plain — carries the full offer + the
            pricing promise, since the statement now carries the value ── */}
        <p data-anim="eyebrow" className="t-meta text-center text-ink/60">
          Websites, Google Ads &amp; AI — priced before we start
        </p>

        {/* ── the statement IS the value prop: lines 2 + 3 roll as a pair
            (industry + their outcome), so no sub paragraph is needed ── */}
        <h1
          className="hero-h1 t-display-xl t-display-xl--hero mt-[21px] text-center"
          aria-label={`Websites that bring ${ariaPair.who} ${ariaPair.out}`}
        >
          <span aria-hidden>
            {/* diamond silhouette: short / widest (bring + who) / mid (outcome) */}
            <span className="mask-line">
              <span className="mask-inner">Websites that</span>
            </span>
            <span className="mask-line">
              <span className="mask-inner">
                bring{" "}
                <span className="h1-roll h1-roll--pair h1-roll--inline">
                  {rollPairs.map((p, wi) => (
                    <span key={`${p.who}-${wi}`} className="h1-roll-word">
                      {[...p.who].map((c, ci) => (
                        <span key={ci} className="rc">
                          {c === " " ? " " : c}
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              </span>
            </span>
            <span className="mask-line">
              <span className="mask-inner mask-inner--block">
                {/* the payoff wears the accent — same steel as the CTA pill,
                    so the promised outcome points at the button that gets it */}
                <span className="h1-roll h1-roll--pair text-accent">
                  {rollPairs.map((p, wi) => (
                    <span key={`${p.out}-${wi}`} className="h1-roll-word">
                      {[...p.out].map((c, ci) => (
                        <span key={ci} className="rc">
                          {c === " " ? " " : c}
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </span>
        </h1>

        {/* ── the foot: the two asks, then proof a buyer can act on ── */}
        <div className="mt-[34px] flex w-full flex-col items-center gap-[21px]">
          <div data-anim="ctas" className="flex flex-wrap items-center justify-center gap-[13px]">
            <CTA href="#estimate" label="Get an instant estimate" tone="ink" />
            <a href="#builder" className="u-link t-meta py-[13px]">
              Build your site in 60 seconds
            </a>
          </div>
          <div
            data-anim="ticker"
            className="trust-ticker w-full md:w-[min(60vw,760px)]"
            aria-label="Projects from $2.5k, fixed quote in 2 days, live in about 4 weeks, live client Desert Wings Flight School, hand-coded with no templates, SEO and Google Ads from day one"
          >
            <div className="tt-track" aria-hidden>
              {[0, 1].map((set) => (
                <div key={set} className="tt-set">
                  {PROOF.map((t) => (
                    <span key={t}>
                      {t}
                      <Monogram />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
