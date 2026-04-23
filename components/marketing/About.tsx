"use client";

import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

const PARAGRAPHS = [
  "EAS is a two-person studio. I design and build. My partner handles ops, client comms, and edits the copy that would otherwise sound like me at a dinner party.",
  "We started because every agency quote we saw in 2023 was a slide deck priced like software. So we started pricing software like software — and telling operators what it actually costs before they had to book a call.",
  "We use Claude Code and a handful of custom agents as engineering multipliers, which is how a two-person studio ships at the speed we do. AI isn't the product. It's the reason we can hit the timelines we quote.",
  "We only take two projects a quarter. The next slot opens in Q3 2026. If the estimator number fits, send us a note. If it doesn't, we'll tell you who to call.",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <SectionHeader sectionRef={sectionRef} number="09" name="About" sku="EAS/2026/Q2" progress={progress} />
        </div>

        <div className="max-w-[58ch] space-y-6">
          {PARAGRAPHS.map((p, i) => (
            <p
              key={i}
              data-reveal
              className="leading-[1.55]"
              style={{ color: "var(--ink)", opacity: 0.85, fontSize: "17px" }}
            >
              {p}
            </p>
          ))}

          <div
            data-reveal
            className="font-mono text-[11px] uppercase tracking-[0.22em] mt-10 font-bold"
            style={{ color: "var(--oxblood)" }}
          >
            — Jake Ryall, founder
          </div>
        </div>
      </div>
    </section>
  );
}
