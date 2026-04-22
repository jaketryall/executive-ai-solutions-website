"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";
import ProofCard, { type ProofItem } from "./ProofCard";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const proof: ProofItem[] = [
  {
    metricPrefix: "+",
    metricValue: 40,
    metricSuffix: "%",
    metricLabel: "Discovery flights",
    quote:
      "He nailed what we were trying to say about the flight school in the first round — new students started booking discovery flights through the site the week we launched.",
    name: "Michael Torres",
    role: "Owner",
    company: "Desert Wings",
    year: "2026",
    slug: "desert-wings",
  },
  {
    metricPrefix: "",
    metricValue: 2,
    metricSuffix: "×",
    metricLabel: "Booked calls",
    quote:
      "I'd been trying to describe my coaching for years. One conversation with Jake and the homepage read like it came out of my head. Conversions followed.",
    name: "Danny K.",
    role: "Founder",
    company: "Riled Up Coaching",
    year: "2025",
    slug: "riled-up",
  },
  {
    metricPrefix: "",
    metricValue: 6,
    metricSuffix: " wk",
    metricLabel: "Start to launch",
    quote:
      "Fast, opinionated, and he actually pushes back when something won't convert. That's rarer than it should be for someone shipping at this level.",
    name: "Sarah Lin",
    role: "Operations Lead",
    company: "Wings N Wheels",
    year: "2025",
    slug: "wings-n-wheels",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const reduce = prefersReducedMotion();
    const splits: InstanceType<typeof SplitText>[] = [];

    const ctx = gsap.context(() => {
      const titleEl = sectionRef.current!.querySelector<HTMLElement>(".proof-title");
      if (titleEl) {
        const split = SplitText.create(titleEl, { type: "words", mask: "words" });
        splits.push(split);
        gsap.set(split.words, { yPercent: 110 });
        gsap.to(split.words, {
          yPercent: 0,
          duration: reduce ? 0 : 0.7,
          stagger: 0.04,
          ease: "appleOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%" },
        });
      }
    }, sectionRef);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      data-seam-enter="seam-3"
      data-seam-exit="seam-4"
      data-bg="cream"
      className="py-32 px-6"
      style={{ backgroundColor: "#f3f1ee" }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p
            data-seam-proof-kicker
            className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4"
            style={{ color: "#78736c" }}
          >
            Proof
          </p>
          <h2
            data-seam-proof-title
            suppressHydrationWarning
            aria-label="What clients say after launch."
            className="proof-title font-black tracking-tight"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              lineHeight: 1.05,
              color: "#1a1816",
            }}
          >
            What clients say after launch.
          </h2>
          <p className="text-sm mt-4" style={{ color: "rgba(26,24,22,0.55)" }}>
            <span style={{ color: "#1a1816", fontWeight: 700 }}>5.0</span> avg rating across recent launches.
          </p>
        </div>

        {/* 3-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proof.map((item, i) => (
            <ProofCard key={item.slug} item={item} featured={i === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
