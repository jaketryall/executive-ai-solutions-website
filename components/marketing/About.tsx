"use client";

import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/motion/primitives";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PARAGRAPHS = [
  "EAS is a two-person studio. I design and build. My partner handles ops, client comms, and edits the copy that would otherwise sound like me at a dinner party.",
  "We started because every agency quote we saw in 2023 was a slide deck priced like software. So we started pricing software like software — and telling operators what it actually costs before they had to book a call.",
  "We use Claude Code and a handful of custom agents as engineering multipliers, which is how a two-person studio ships at the speed we do. AI isn't the product. It's the reason we can hit the timelines we quote.",
  "We only take two projects a quarter. The next slot opens in Q3 2026. If the estimator number fits, send us a note. If it doesn't, we'll tell you who to call.",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    const paragraphs = paragraphsRef.current;
    if (!section || !wordmark || !paragraphs) return;

    const ctx = gsap.context(() => {
      // Wordmark parallax: scale + y drift + opacity crescendo — scrub-linked
      gsap.fromTo(
        wordmark,
        { scale: 0.88, y: 60, opacity: 0.08 },
        {
          scale: 1.12,
          y: -60,
          opacity: 0.18,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );

      // Paragraph word reveal — each paragraph independently triggered
      const paraEls = gsap.utils.toArray<HTMLElement>(
        paragraphs.querySelectorAll("[data-about-para]")
      );

      const splits = paraEls.map((el) =>
        SplitText.create(el, { type: "words,lines", mask: "lines" })
      );

      splits.forEach((split, i) => {
        gsap.set(split.words, { yPercent: 110, opacity: 0 });
        gsap.to(split.words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.022,
          ease: "expo.out",
          scrollTrigger: {
            trigger: paraEls[i],
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Signature reveals last
      const signature = paragraphs.querySelector("[data-about-signature]");
      if (signature) {
        gsap.from(signature, {
          opacity: 0,
          y: 20,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: {
            trigger: signature,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      }

      return () => splits.forEach((s) => s.revert());
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ background: "var(--paper)" }}
    >
      {/* Giant outlined EAS wordmark — parallax anchor, sits behind content */}
      <span
        ref={wordmarkRef}
        aria-hidden
        className="absolute select-none pointer-events-none font-black leading-none"
        style={{
          fontSize: "clamp(14rem, 30vw, 28rem)",
          letterSpacing: "-0.055em",
          color: "transparent",
          WebkitTextStroke: "1.5px var(--oxblood)",
          top: "50%",
          right: "-2%",
          transform: "translate(0, -50%)",
          zIndex: 0,
          willChange: "transform, opacity",
        }}
      >
        EAS
      </span>

      <div className="relative max-w-[1400px] mx-auto" style={{ zIndex: 1 }}>
        <div className="mb-16">
          <SectionHeader
            sectionRef={sectionRef}
            number="09"
            name="About"
            sku="EAS/2026/Q2"
            progress={progress}
          />
        </div>

        <div ref={paragraphsRef} className="max-w-[58ch] space-y-6">
          {PARAGRAPHS.map((p, i) => (
            <p
              key={i}
              data-about-para
              className="leading-[1.55]"
              style={{ color: "var(--ink)", opacity: 0.85, fontSize: "17px" }}
            >
              {p}
            </p>
          ))}

          <div
            data-about-signature
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
