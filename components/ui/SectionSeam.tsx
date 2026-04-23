"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type SeamDirection = "paper-to-ink" | "ink-to-paper";

interface SectionSeamProps {
  direction: SeamDirection;
  toLabel: {
    num: string;
    name: string;
    era?: string;
  };
}

// Transition band between opposing-register sections. Linear gradient from
// source surface to target surface, with an oxblood hairline, "moving here"
// dot, and a mono-tracked label indicating the target. On scroll-enter the
// hairline draws from left, the dot pulses, and the label fades in.
export default function SectionSeam({ direction, toLabel }: SectionSeamProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const fromColor =
    direction === "paper-to-ink" ? "var(--paper)" : "var(--ink-deep)";
  const toColor =
    direction === "paper-to-ink" ? "var(--ink-deep)" : "var(--paper)";
  const labelColor =
    direction === "paper-to-ink" ? "var(--paper)" : "var(--ink)";

  const ease = [0.19, 1, 0.22, 1] as const;

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative w-full h-[18vh] md:h-[28vh]"
      style={{
        background: `linear-gradient(to bottom, ${fromColor} 0%, ${toColor} 100%)`,
      }}
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center gap-4 px-6 md:px-12 lg:px-24">
        {/* "Moving here" dot — pulses once on reveal */}
        <motion.span
          className="shrink-0 rounded-full"
          style={{ background: "var(--oxblood)", width: 8, height: 8 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: [0, 1.6, 1], opacity: 1 } : undefined}
          transition={{ duration: 0.7, ease, times: [0, 0.5, 1] }}
        />
        {/* Hairline — left segment, draws from left */}
        <motion.div
          className="flex-1 h-px origin-left"
          style={{ background: "var(--oxblood)", opacity: 0.6 }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
        />
        {/* Label — fades in after hairline draws */}
        <motion.span
          className="font-mono uppercase shrink-0"
          style={{
            color: labelColor,
            fontSize: "10px",
            letterSpacing: "0.22em",
          }}
          initial={{ opacity: 0, y: 4 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease, delay: 0.5 }}
        >
          → {toLabel.num} / {toLabel.name}
          {toLabel.era && (
            <span style={{ marginLeft: "12px", opacity: 0.7 }}>
              · {toLabel.era}
            </span>
          )}
        </motion.span>
        {/* Hairline — right segment, draws from right */}
        <motion.div
          className="flex-1 h-px origin-right"
          style={{ background: "var(--oxblood)", opacity: 0.6 }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
        />
      </div>
    </div>
  );
}
