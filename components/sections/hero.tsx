"use client";

import { useRef } from "react";
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

// staggered indents zigzag the statement across the canvas — composed, not centered
const H1_LINES = [
  { text: "Websites", indent: "" },
  { text: "that win", indent: "md:pl-[min(11vw,160px)]" },
  { text: "customers", indent: "md:pl-[min(4vw,58px)]" },
];

// every claim is true today — swap in social icons here once the accounts exist
const TRUST = [
  "Live client work",
  "Hand-coded Next.js",
  "Google Ads + conversion tracking",
  "Local SEO from day one",
  "AI automation built in",
  "Projects from $2.5k",
];

export function Hero() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      // the nav lives OUTSIDE this scope — selector strings won't reach it
      const navEl = document.querySelector(".site-nav");

      if (reducedMotion()) {
        gsap.set([navEl, ...q("[data-anim]")], { autoAlpha: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        return;
      }

      // ── Title sequence (plays once fonts are ready; the gate kills FOUC) ──
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE_STRUCTURE } });
      tl.fromTo(
        navEl,
        { autoAlpha: 0, y: -16 },
        { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "transform" },
        0.05
      )
        // the protagonist: headline rises line by line
        .fromTo(
          q(".hero-h1 .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 1.05, stagger: 0.09 },
          0.2
        )
        // THE HOLD — the statement sits alone for a beat before the ask arrives
        .fromTo(
          q("[data-anim='ctas']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          "+=0.3"
        )
        .fromTo(
          q("[data-anim='ticker']"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8, ease: EASE_UI },
          "-=0.25"
        );

      document.fonts.ready.then(() => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            tl.play();
            ScrollTrigger.refresh();
          })
        );
      });
    },
    { scope: root }
  );

  return (
    <section id="top" ref={root} data-nav="light" className="hero relative overflow-hidden">
      {/* height leaves ~8–10rem of viewport 1 for the showreel's top edge (the peek) */}
      <div className="hero-in mx-auto flex min-h-[calc(100svh-10rem)] w-full max-w-[1280px] flex-col px-[21px] pb-[34px] pt-[110px] md:min-h-[calc(100svh-9rem)] md:justify-between md:px-[55px] md:pt-[121px]">
        {/* ── the statement (the only loud thing on screen — no paragraph under it) ── */}
        <h1 className="hero-h1 t-display-hero">
          {H1_LINES.map((line) => (
            <span key={line.text} className={`mask-line ${line.indent}`}>
              <span className="mask-inner">{line.text}</span>
            </span>
          ))}
        </h1>

        {/* ── the foot: ask left, live trust ticker right ── */}
        <div className="mt-[55px] flex flex-col gap-[34px] md:flex-row md:items-center md:justify-between">
          <div data-anim="ctas" className="flex shrink-0 flex-wrap items-center gap-[13px]">
            <CTA href="#estimate" label="Get an instant estimate" tone="ink" />
            <a href="#work" className="u-link t-meta py-[13px]">
              See the work
            </a>
          </div>
          <div
            data-anim="ticker"
            className="trust-ticker w-full md:w-[min(46vw,560px)]"
            aria-label="Every project includes: live client work, hand-coded Next.js, Google Ads and conversion tracking, local SEO from day one, AI automation, projects from $2.5k"
          >
            <div className="tt-track" aria-hidden>
              {[0, 1].map((set) => (
                <div key={set} className="tt-set">
                  {TRUST.map((t) => (
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
