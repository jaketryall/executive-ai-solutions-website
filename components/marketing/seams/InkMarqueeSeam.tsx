"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// A tall kinetic divider for ink-to-ink beats.
// Two counter-rotating marquee rows (infinite CSS animation) whose overall
// container skews slightly based on scroll velocity — so the type feels like
// it's physically dragging the transition along.
export default function InkMarqueeSeam({
  topWords,
  bottomWords,
}: {
  topWords: string[];
  bottomWords: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"],
  });

  const skew = useTransform(scrollYProgress, [0, 0.5, 1], [-2, 0, 2]);

  return (
    <section
      ref={ref}
      className="relative py-12 md:py-16 overflow-hidden"
      style={{ background: "var(--ink-soft)" }}
    >
      <motion.div style={{ skewY: skew }} className="space-y-3">
        {/* Top row — scrolls left */}
        <div className="flex overflow-hidden">
          <div className="flex whitespace-nowrap will-change-transform kinetic-row-1" style={{ gap: "2.5rem" }}>
            {[...Array(3)].map((_, set) =>
              topWords.map((w, i) => (
                <span
                  key={`t-${set}-${i}`}
                  className="inline-flex items-center gap-10 font-display font-semibold shrink-0"
                  style={{
                    color: "var(--paper)",
                    fontSize: "clamp(2.4rem, 7vw, 7rem)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  <span>{w}</span>
                  <Star />
                </span>
              ))
            )}
          </div>
        </div>

        {/* Bottom row — scrolls right (outline style) */}
        <div className="flex overflow-hidden">
          <div className="flex whitespace-nowrap will-change-transform kinetic-row-2" style={{ gap: "2.5rem" }}>
            {[...Array(3)].map((_, set) =>
              bottomWords.map((w, i) => (
                <span
                  key={`b-${set}-${i}`}
                  className="inline-flex items-center gap-10 font-display font-semibold shrink-0"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(243,241,238,0.45)",
                    fontSize: "clamp(2.4rem, 7vw, 7rem)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  <span>{w}</span>
                  <Star outline />
                </span>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Star({ outline = false }: { outline?: boolean }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      className="shrink-0 opacity-70"
      style={{ transform: "rotate(6deg)" }}
    >
      <path
        d="M20 2v10l7-7-3 9 10-3-9 3 7 7H22l3 9-7-7v10l-7-7 3-9H4l9-3-3-9 7 7V2z"
        stroke={outline ? "rgba(243,241,238,0.35)" : "rgba(243,241,238,0.7)"}
        strokeWidth={outline ? 1 : 0}
        fill={outline ? "none" : "rgba(243,241,238,0.7)"}
      />
    </svg>
  );
}
