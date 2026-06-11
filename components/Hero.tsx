"use client";

// Hero — one bold statement of what we do, sitting in space. The work
// speaks next (the box right below); this just has to say it straight.

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PillCTA from "./PillCTA";
import AutoVideo from "./AutoVideo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// Pill-shaped video token living inside the headline — work visible in the
// first three seconds without giving up the statement. Stretches on hover,
// clicks through to the work box.
function HeadChip({ startAt }: { startAt: number }) {
  return (
    <a
      href="#work"
      aria-label="See the work"
      className="group/chip inline-flex align-middle mx-[0.1em] -translate-y-[0.06em] h-[0.62em] w-[1.2em] hover:w-[1.7em] rounded-full overflow-hidden border border-(--line) bg-ink relative transition-all duration-500 focus-ring"
      style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
    >
      <AutoVideo
        src="/final-comp.mp4"
        poster="/video-poster.webp"
        startAt={startAt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/chip:scale-110"
      />
    </a>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance — one composed beat.
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to(".hero-line", { y: 0, duration: 1.1, stagger: 0.09 }, 0.15).to(
          "[data-hero-fade]",
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 },
          0.55,
        );

        // Scroll parallax — each statement line drifts at its own rate.
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
          .to('[data-line-cell="2"]', { yPercent: -10 }, 0);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-line, [data-hero-fade]", { clearProps: "all" });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[92svh] flex flex-col px-5 md:px-10 pt-28 pb-14"
    >
      {/* The statement — centered in the space */}
      <div className="my-auto flex flex-col items-center text-center">
        <div data-hero-fade className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <p className="micro text-(--fg-muted)">
            Executive AI Solutions — premium web design
          </p>
          <span className="hidden md:block h-px w-12 bg-(--line)" aria-hidden />
          <span className="inline-flex items-center gap-2.5 h-9 pl-1.5 pr-4 rounded-full border border-(--line) bg-(--surface)">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-oxblood/10">
              <span className="w-1.5 h-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
            </span>
            <span className="micro text-(--fg)">2 spots left for July</span>
          </span>
        </div>

        <h1 className="mt-8 max-w-5xl font-bold tracking-[-0.04em] leading-[1.04] text-[clamp(2.5rem,6.2vw,5.5rem)]">
          <span data-line-cell={0} className="block">
            <span className="hero-line-mask">
              <span className="hero-line">
                We design, build and
                <HeadChip startAt={4} />
              </span>
            </span>
          </span>
          <span data-line-cell={1} className="block">
            <span className="hero-line-mask">
              <span className="hero-line">
                automate
                <HeadChip startAt={20} />
                websites
              </span>
            </span>
          </span>
          <span data-line-cell={2} className="block">
            <span className="hero-line-mask">
              <span className="hero-line">
                that book clients<span className="text-oxblood">.</span>
              </span>
            </span>
          </span>
        </h1>

        <div data-hero-fade className="mt-9 flex items-center justify-center gap-7">
          <PillCTA label="Start a project" href="#contact" />
          <a
            href="#work"
            className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-tight focus-ring"
          >
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
    </section>
  );
}
