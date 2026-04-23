"use client";

import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { useIsomorphicLayoutEffect } from "@/lib/motion/primitives";

const QUOTES = [
  { q: "They shipped what three agencies said wasn't possible.", by: "Adventure Air" },
  { q: "Built faster than my internal team estimated. Still running two years later.", by: "Wings N Wheels" },
  { q: "The estimator on their site gave me a number in 30 seconds. That's the kind of studio they are.", by: "Riled Up" },
];

export default function TestimonialMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const marquee = marqueeRef.current;
    if (!section || !marquee) return;

    const ctx = gsap.context(() => {
      // Velocity-reactive skew via quickTo for spring-like smoothing
      const skewTo = gsap.quickTo(marquee, "skewY", { duration: 0.4, ease: "power3.out" });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const skew = gsap.utils.clamp(-4, 4, v / 800);
          skewTo(skew);
        },
      });

      return () => st.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ background: "var(--paper)" }}
    >
      {/* Giant oxblood opening quote — left anchor */}
      <span
        aria-hidden
        className="absolute select-none pointer-events-none font-display font-black leading-none"
        style={{
          fontSize: "clamp(16rem, 28vw, 30rem)",
          color: "transparent",
          WebkitTextStroke: "1.5px var(--oxblood)",
          opacity: 0.15,
          top: "50%",
          left: "-1%",
          transform: "translateY(-50%)",
          zIndex: 0,
          letterSpacing: "-0.05em",
        }}
      >
        &ldquo;
      </span>

      {/* Giant oxblood closing quote — right anchor */}
      <span
        aria-hidden
        className="absolute select-none pointer-events-none font-display font-black leading-none"
        style={{
          fontSize: "clamp(16rem, 28vw, 30rem)",
          color: "transparent",
          WebkitTextStroke: "1.5px var(--oxblood)",
          opacity: 0.15,
          top: "50%",
          right: "-1%",
          transform: "translateY(-50%)",
          zIndex: 0,
          letterSpacing: "-0.05em",
        }}
      >
        &rdquo;
      </span>

      {/* Section header — above marquee */}
      <div className="relative max-w-[1400px] mx-auto mb-12" style={{ zIndex: 2 }}>
        <SectionHeader
          sectionRef={sectionRef}
          number="02"
          name="What clients say"
          sku="EAS/2026/Q2"
          progress={progress}
        />
      </div>

      {/* Marquee row — scrolls past the fixed quote anchors */}
      <div
        ref={marqueeRef}
        className="relative overflow-hidden"
        style={{ zIndex: 1, willChange: "transform" }}
        data-reveal
      >
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
