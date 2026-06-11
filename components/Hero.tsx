"use client";

// Hero — stacked-statement headline with the showreel card as centerpiece.
// Three transform layers on the card: scroll parallax (outer) → entrance
// (middle) → ambient float (inner), so the writes never fight each other.

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PillCTA from "./PillCTA";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const LINES = ["Websites", "that move", "people"];
const LINE_INDENTS = ["", "pl-[8vw]", "pl-[2vw]"];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance — one composed beat: lines, card, then meta together.
        gsap.set("[data-hero-entrance]", { y: 70, scale: 0.97 });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to(".hero-line", { y: 0, duration: 1.1, stagger: 0.09 }, 0.15)
          .to(
            "[data-hero-card]",
            { opacity: 1, duration: 0.9, ease: "power2.out" },
            0.45,
          )
          .to(
            "[data-hero-entrance]",
            { y: 0, scale: 1, duration: 1.3 },
            0.45,
          )
          .to(
            "[data-hero-fade]",
            { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 },
            0.65,
          );

        // Ambient float — starts once the entrance has landed.
        gsap.to("[data-hero-float]", {
          y: -10,
          duration: 3.6,
          delay: 1.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Scroll parallax — each line drifts at its own rate, card lags.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .to('[data-line-cell="0"]', { yPercent: -34 }, 0)
          .to('[data-line-cell="1"]', { yPercent: -20 }, 0)
          .to('[data-line-cell="2"]', { yPercent: -10 }, 0)
          .to("[data-hero-scroll]", { y: -70 }, 0);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-line, [data-hero-fade], [data-hero-card]", {
          clearProps: "all",
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-svh flex flex-col px-5 md:px-10 pt-28 pb-16 lg:pb-12"
    >
      {/* Eyebrow + scarcity */}
      <div data-hero-fade className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <p className="micro text-taupe">Premium web design — built to convert</p>
        <span className="hidden md:block h-px w-12 bg-ink/15" aria-hidden />
        <span className="inline-flex items-center gap-2.5 h-9 pl-1.5 pr-4 rounded-full border border-ink/10 bg-paper-warm">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-oxblood/10">
            <span className="w-1.5 h-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
          </span>
          <span className="micro text-ink">2 spots left for July</span>
        </span>
      </div>

      {/* Stacked statement */}
      <h1 className="mt-7 font-extrabold uppercase tracking-[-0.045em] leading-[0.92] text-[clamp(2.9rem,12.5vw,9.5rem)] lg:text-[clamp(2.9rem,min(10vw,16svh),9.5rem)]">
        {LINES.map((line, i) => (
          <span key={line} data-line-cell={i} className={`block ${LINE_INDENTS[i]}`}>
            <span className="hero-line-mask">
              <span className="hero-line">
                {line}
                {i === LINES.length - 1 && (
                  <span className="text-oxblood">.</span>
                )}
              </span>
            </span>
          </span>
        ))}
      </h1>

      {/* Description + CTAs — pinned to hero bottom on desktop */}
      <div className="mt-12 lg:mt-auto lg:pt-10 max-w-sm relative z-20">
        <p data-hero-fade className="text-[15px] leading-relaxed text-taupe">
          We design and build premium, conversion-led websites with motion you
          can feel. Strategy, design and build — one team, no hand-offs.
        </p>
        <div data-hero-fade className="mt-6 flex items-center gap-7">
          <PillCTA label="Start a project" href="#contact" />
          <a href="#work" className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-tight text-ink focus-ring">
            <span className="slot-link">
              <span className="slot-link-stack">
                <span className="slot-link-inner">See the work</span>
                <span className="slot-link-clone" aria-hidden>
                  See the work
                </span>
              </span>
            </span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-400 group-hover:translate-y-1"
              style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
              aria-hidden
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Showreel card cluster — the centerpiece */}
      <div
        data-hero-scroll
        className="relative mt-14 w-full lg:absolute lg:mt-0 lg:right-[4vw] lg:bottom-[12%] lg:w-[clamp(380px,35vw,560px)] z-10"
      >
        <div data-hero-card>
          <div data-hero-entrance>
            <div data-hero-float className="relative">
              {/* Deck peeks — the work, waiting behind the reel */}
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden border border-ink/10 bg-paper-warm rotate-[4.5deg] translate-x-5 translate-y-3"
                aria-hidden
              >
                <Image
                  src="/Celestial Laptop Mockup.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden border border-ink/10 bg-paper-warm -rotate-4 -translate-x-4 translate-y-5"
                aria-hidden
              >
                <Image
                  src="/custom-dashboard-mockup.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* The showreel */}
              <div className="relative aspect-16/10 rounded-[28px] overflow-hidden border border-ink/10 bg-ink-deep -rotate-2 shadow-[0_32px_80px_rgba(14,13,12,0.35)]">
                <video
                  src="/final-comp.mp4"
                  poster="/video-poster.webp"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute left-4 bottom-4 inline-flex items-center gap-2.5 h-8 px-3.5 rounded-full bg-ink-deep/70 backdrop-blur-sm text-paper">
                  <span className="w-1.5 h-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em]">
                    Showreel — &rsquo;26
                  </span>
                </span>
              </div>

              <p
                className="font-hand absolute -bottom-10 right-3 -rotate-4 text-2xl text-taupe select-none"
                aria-hidden
              >
                real client work ↑
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
