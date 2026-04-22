"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { TransitionLink } from "@/components/PageTransition";
import { cardHoverVariants, tweenCounter, prefersReducedMotion } from "@/lib/microInteractions";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type ProofItem = {
  metricPrefix: string;
  metricValue: number;
  metricSuffix: string;
  metricLabel: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  year: string;
  slug: string;
};

export default function ProofCard({ item, featured = false }: { item: ProofItem; featured?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !valRef.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (reduce) {
            valRef.current!.textContent = item.metricValue.toString();
            return;
          }
          // tweenCounter return value isn't stored — it's safe because this tween is
          // created inside gsap.context(), so ctx.revert() in cleanup will kill it.
          tweenCounter(valRef.current!, item.metricValue, { duration: 1.4 });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [item.metricValue]);

  return (
    <TransitionLink
      href={`/work/${item.slug}`}
      className="group block"
      aria-label={`Read case study for ${item.company}`}
    >
      <motion.div
        ref={ref}
        data-proof-card
        variants={cardHoverVariants}
        initial="rest"
        whileHover="hover"
        className={`rounded-2xl p-8 flex flex-col cursor-pointer min-h-[320px] md:min-h-[380px] ${featured ? "md:scale-[1.02]" : ""}`}
        style={{
          backgroundColor: "rgba(255,255,255,0.5)",
          border: featured
            ? "1.5px solid rgba(120,115,108,0.5)"
            : "1px solid rgba(26,24,22,0.08)",
        }}
      >
        {/* Metric */}
        <div className="mb-6">
          <p
            className="font-black tracking-tight"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(2.75rem, 4.5vw, 4rem)",
              color: "#1a1816",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            <span>{item.metricPrefix}</span>
            <span ref={valRef}>0</span>
            <span>{item.metricSuffix}</span>
          </p>
          <p
            className="text-xs uppercase tracking-[0.2em] mt-2"
            style={{ color: "#78736c" }}
          >
            {item.metricLabel}
          </p>
        </div>

        {/* Quote */}
        <p
          className="flex-1 mb-6"
          style={{ color: "rgba(26,24,22,0.8)", fontSize: "0.95rem", lineHeight: 1.55 }}
        >
          &ldquo;{item.quote}&rdquo;
        </p>

        {/* Attribution */}
        <div
          className="flex items-center justify-between gap-4 pt-4"
          style={{ borderTop: "1px solid rgba(26,24,22,0.08)" }}
        >
          <div>
            <p className="text-sm font-semibold" style={{ color: "#1a1816" }}>
              {item.name}
            </p>
            <p className="text-xs" style={{ color: "#78736c" }}>
              {item.role} · {item.company} · {item.year}
            </p>
          </div>
        </div>

        {/* "View case study" indicator — visual affordance only, card is the link */}
        <div className="inline-flex items-center gap-2 mt-4 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "#1a1816" }}>
          <span className="relative">
            View case study
            <span className="absolute left-0 -bottom-0.5 h-px bg-current w-0 group-hover:w-full transition-all duration-300 ease-out" />
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </motion.div>
    </TransitionLink>
  );
}
