"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";
import Signature from "./Signature";
import AboutCard from "./AboutCard";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const reduce = prefersReducedMotion();
    const splits: InstanceType<typeof SplitText>[] = [];

    const ctx = gsap.context(() => {
      const lead = sectionRef.current!.querySelector<HTMLElement>(".m-lead");
      const punch = sectionRef.current!.querySelector<HTMLElement>(".m-punch");

      [lead, punch].forEach((el, i) => {
        if (!el) return;
        const split = SplitText.create(el, { type: "words", mask: "words" });
        splits.push(split);
        gsap.set(split.words, { yPercent: 110 });
        gsap.to(split.words, {
          yPercent: 0,
          duration: reduce ? 0 : 0.8,
          stagger: 0.04,
          ease: "appleOut",
          delay: i * 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });
      });
    }, sectionRef);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      data-bg="cream"
      data-seam-enter="seam-2"
      data-seam-exit="seam-3"
      className="py-32 px-6"
      style={{ backgroundColor: "#f3f1ee" }}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Kicker */}
        <p data-seam-kicker className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-8" style={{ color: "#78736c" }}>
          The Manifesto
        </p>
        {/* Seam 2's horizontal rule — grows scaleX 0→1 as Capabilities
            transitions into Manifesto. suppressHydrationWarning because
            GSAP mutates transform before Manifesto's subtree hydrates. */}
        <div
          data-seam-rule-2
          suppressHydrationWarning
          className="h-px w-full mb-8 origin-center scale-x-0"
          style={{ background: "rgba(26,24,22,0.12)" }}
        />

        {/* Mantra */}
        <div className="mb-12">
          <p
            className="m-lead font-medium tracking-tight"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              color: "rgba(26,24,22,0.55)",
              lineHeight: 1.05,
            }}
          >
            I don&apos;t ship pretty.
          </p>
          <h2
            className="m-punch font-black tracking-tight"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "#1a1816",
              lineHeight: 1.05,
              marginTop: "0.5rem",
            }}
          >
            I ship results.
          </h2>
        </div>

        {/* Drop-cap paragraph */}
        <p
          className="manifesto-body"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
            lineHeight: 1.65,
            color: "rgba(26,24,22,0.75)",
            maxWidth: 720,
            marginBottom: "2.5rem",
          }}
        >
          <span
            style={{
              float: "left",
              fontFamily: "var(--font-inter)",
              fontSize: "3.5em",
              lineHeight: 0.85,
              fontWeight: 900,
              paddingRight: "0.12em",
              paddingTop: "0.05em",
              color: "#78736c",
            }}
          >
            B
          </span>
          eautiful sites that don&apos;t convert are portfolio pieces, not businesses. I work with founders and operators who need their site to do real work — bring in leads, qualify them, close them. Every section I build defends its place against that bar. If it doesn&apos;t move the metric, it doesn&apos;t ship.
        </p>

        {/* Signature */}
        <div className="flex justify-end mb-16">
          <Signature />
        </div>

        {/* About card */}
        <AboutCard />
      </div>
    </section>
  );
}
