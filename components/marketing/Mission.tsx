"use client";

import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

const BELIEFS = [
  {
    num: "01",
    title: "We ship wet",
    body: "Polish is a veil. We'd rather hand off something alive and half-dry than perfect and brittle. The next fix gets made Monday.",
  },
  {
    num: "02",
    title: "Motion is a feature, not a coat of paint",
    body: "Animation carries meaning — hierarchy, causality, feedback. We design it in from the first sketch, not on top of it at the end.",
  },
  {
    num: "03",
    title: "The hardest skill is deletion",
    body: "Good design engineering is knowing what to cut — and having the spine to cut it, today, before anyone gets attached. Everything you keep pays rent.",
  },
];

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 md:mb-24">
          <SectionHeader sectionRef={sectionRef} number="05" name="Mission" sku="EAS/2026/Q2" progress={progress} />
        </div>

        <div className="grid gap-14 md:gap-20 max-w-[64ch]">
          {BELIEFS.map((b) => (
            <article key={b.num} data-reveal>
              <div
                className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3"
                style={{ color: "var(--taupe)" }}
              >
                {b.num} ·
              </div>
              <h3
                className="font-display font-black leading-[1.1] mb-4"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                {b.title}
                <span style={{ color: "var(--oxblood)" }}>.</span>
              </h3>
              <p
                className="leading-[1.55]"
                style={{ color: "var(--ink)", opacity: 0.78, fontSize: "16px" }}
              >
                {b.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
