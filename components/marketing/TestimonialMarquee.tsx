"use client";

import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

const QUOTES = [
  { q: "They shipped what three agencies said wasn't possible.", by: "Adventure Air" },
  { q: "Built faster than my internal team estimated. Still running two years later.", by: "Wings N Wheels" },
  { q: "The estimator on their site gave me a number in 30 seconds. That's the kind of studio they are.", by: "Riled Up" },
];

export default function TestimonialMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto mb-12">
        <SectionHeader
          sectionRef={sectionRef}
          number="02"
          name="What clients say"
          sku="EAS/2026/Q2"
          progress={progress}
        />
      </div>

      <div className="relative overflow-hidden" data-reveal>
        <div className="flex gap-16 md:gap-24 marquee-track whitespace-nowrap">
          {[...QUOTES, ...QUOTES].map((q, i) => (
            <div key={i} className="flex items-baseline gap-6 shrink-0">
              <span
                className="font-display font-black"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                &ldquo;{q.q}&rdquo;
              </span>
              <span
                className="font-mono text-[12px] uppercase tracking-[0.18em]"
                style={{ color: "var(--taupe)" }}
              >
                &mdash; {q.by}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
