"use client";

// Final CTA — the closer before contact. The signature pill lives inside
// the headline itself: "READY WHEN / [Start a project →] YOU ARE."

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PillCTA from "./PillCTA";
import { replayEntrance } from "@/lib/scroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        replayEntrance(".hero-line", sectionRef.current!, {
          from: { y: "115%" },
          to: { y: 0, duration: 1.05, stagger: 0.12, ease: "expo.out" },
          start: "top 70%",
        });
        replayEntrance("[data-cta-meta]", sectionRef.current!, {
          from: { y: 24, opacity: 0 },
          to: { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
          start: "top 55%",
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Start a project"
      className="relative border-t border-(--line) px-5 md:px-10 pt-24 md:pt-32 pb-28 md:pb-36"
    >
      <p className="micro text-(--fg-faint)">Next opening — July</p>

      <h2
        data-lag="0.06"
        className="mt-7 font-extrabold uppercase tracking-[-0.045em] leading-[1.02] text-[clamp(2.6rem,8.5vw,7.5rem)]"
      >
        <span className="block">
          <span className="hero-line-mask">
            <span className="hero-line">Ready when</span>
          </span>
        </span>
        <span className="block">
          <span className="hero-line-mask">
            <span className="hero-line flex items-center gap-4 md:gap-7 flex-wrap">
              <PillCTA label="Start a project" href="#contact" size="mega" />
              <span>
                you are<span className="text-oxblood">.</span>
              </span>
            </span>
          </span>
        </span>
      </h2>

      <div
        data-cta-meta
        className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
      >
        <span className="inline-flex items-center gap-2.5 h-9 pl-1.5 pr-4 rounded-full border border-(--line) bg-(--surface)">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-oxblood/10">
            <span className="w-1.5 h-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
          </span>
          <span className="micro text-(--fg)">2 spots left for July</span>
        </span>
        <p className="max-w-sm text-[15px] leading-relaxed text-(--fg-muted)">
          Strategy call this week, design next, live within the month.
        </p>
        <a
          href="/faq"
          className="group inline-flex items-center gap-2 text-[13px] font-medium tracking-tight focus-ring"
        >
          <span className="slot-link">
            <span className="slot-link-stack">
              <span className="slot-link-inner">Questions first? Read the FAQ</span>
              <span className="slot-link-clone" aria-hidden>
                Questions first? Read the FAQ
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
            className="transition-transform duration-400 group-hover:translate-x-1"
            style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
            aria-hidden
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
