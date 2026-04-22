"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ease } from "@/lib/motion";

// Low-ceremony section divider for paper-to-paper beats.
// Draws a hairline across, scrubs in a mono chapter label + optional marquee phrase,
// then exits as the next section takes over.
export default function ChapterMarker({
  num,
  label,
  tone = "light",
  marquee,
}: {
  num: string;
  label: string;
  tone?: "light" | "dark";
  marquee?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 20%"],
  });

  const lineScale = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.0, 0.5], [18, 0]);
  const labelOpacity = useTransform(scrollYProgress, [0.0, 0.4], [0, 1]);

  const fg = tone === "dark" ? "rgba(243,241,238,0.55)" : "var(--taupe)";
  const line = tone === "dark" ? "rgba(243,241,238,0.14)" : "rgba(26,24,22,0.12)";
  const bg = tone === "dark" ? "var(--ink-soft)" : "var(--paper)";

  return (
    <div
      ref={ref}
      className="relative px-6 md:px-12 lg:px-24 py-12 md:py-16"
      style={{ background: bg }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* The line + markers */}
        <div className="relative flex items-center gap-6">
          {/* Left dot */}
          <motion.span
            initial={false}
            style={{ opacity: labelOpacity }}
            className="w-1.5 h-1.5 rounded-full shrink-0"
            aria-hidden
          >
            <span className="block w-full h-full rounded-full" style={{ background: fg }} />
          </motion.span>

          {/* Num + label */}
          <motion.div
            style={{ y: labelY, opacity: labelOpacity }}
            className="flex items-center gap-4 shrink-0"
          >
            <span className="font-mono text-[11px] tabular-nums" style={{ color: fg }}>
              {num}
            </span>
            <span className="text-[11px] uppercase tracking-[0.3em]" style={{ color: fg }}>
              {label}
            </span>
          </motion.div>

          {/* Hairline */}
          <motion.div
            style={{ scaleX: lineScale, transformOrigin: "left center" }}
            className="h-px flex-1"
            aria-hidden
          >
            <div className="h-full w-full" style={{ background: line }} />
          </motion.div>

          {/* Right marker */}
          <motion.span
            initial={false}
            style={{ opacity: labelOpacity, rotate: useTransform(scrollYProgress, [0, 1], [-35, 0]) }}
            className="shrink-0"
            aria-hidden
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H9M17 7V15" />
            </svg>
          </motion.span>
        </div>

        {/* Optional kinetic phrase */}
        {marquee && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: 0.2, ease: ease.expoOut }}
            className="mt-5 text-[12px] italic tracking-tight"
            style={{ color: fg }}
          >
            {marquee}
          </motion.p>
        )}
      </div>
    </div>
  );
}
