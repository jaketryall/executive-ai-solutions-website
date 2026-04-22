"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { ease } from "@/lib/motion";

// The big transition between paper-toned sections and ink-toned sections.
// Pinned for ~150vh. As the user scrubs through:
//   1. A huge display word splits in from two directions + scales to meet center
//   2. Background color fades paper -> ink under a rising dark curtain
//   3. The word inverts (ink on paper) as it crosses the curtain edge
//   4. A tiny dial at the bottom reports the crossing like "paper → ink 42%"
// End state is pure ink, ready for Capabilities / Availability to take over.
export default function PaperToInkSeam({
  phrase = "What I do.",
  kicker = "02 · Capabilities",
}: {
  phrase?: string;
  kicker?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 180, damping: 28, mass: 0.35 });

  // Curtain rises from bottom. 0 = paper, 1 = fully ink.
  const curtainY = useTransform(smooth, [0.1, 0.75], ["100%", "0%"]);

  // Big word halves
  const leftX = useTransform(smooth, [0, 0.6], ["-50%", "0%"]);
  const rightX = useTransform(smooth, [0, 0.6], ["50%", "0%"]);
  const wordScale = useTransform(smooth, [0, 0.6, 0.95], [0.85, 1, 1.02]);
  const wordOpacity = useTransform(smooth, [0, 0.1, 0.85, 1], [0, 1, 1, 0.9]);

  // Meta
  const metaOpacity = useTransform(smooth, [0.05, 0.2, 0.85, 1], [0, 1, 1, 0.6]);
  const dialProgress = useTransform(smooth, [0.1, 0.75], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: "170vh", background: "var(--paper)" }}
    >
      {/* Sticky stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Paper stage */}
        <div className="absolute inset-0" style={{ background: "var(--paper)" }} />

        {/* Rising ink curtain */}
        <motion.div
          className="absolute inset-x-0 top-0 bottom-0"
          style={{
            y: curtainY,
            background:
              "linear-gradient(to bottom, var(--ink-soft) 0%, var(--ink-soft) 82%, rgba(20,18,16,0.0) 100%)",
          }}
          aria-hidden
        />

        {/* Hairline riding the curtain */}
        <motion.div
          className="absolute inset-x-6 md:inset-x-12 lg:inset-x-24 h-px"
          style={{
            y: curtainY,
            top: 0,
            background: "linear-gradient(to right, transparent, rgba(46,91,255,0.5), rgba(243,241,238,0.35), transparent)",
          }}
          aria-hidden
        />

        {/* Top kicker — always in front */}
        <motion.div
          style={{ opacity: metaOpacity }}
          className="absolute top-[max(6rem,14vh)] left-6 md:left-12 lg:left-24 right-6 md:right-12 lg:right-24 z-30 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="pulse-dot w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--signal)", color: "var(--signal)" }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] mix-blend-difference" style={{ color: "rgba(243,241,238,0.85)" }}>
              {kicker}
            </span>
          </div>
          <CrossingDial progress={dialProgress} />
        </motion.div>

        {/* Huge splitting word */}
        <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <motion.div
            style={{ scale: wordScale, opacity: wordOpacity }}
            className="relative flex items-center"
          >
            <SplitWord text={phrase} leftX={leftX} rightX={rightX} curtainY={curtainY} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SplitWord({
  text,
  leftX,
  rightX,
  curtainY,
}: {
  text: string;
  leftX: ReturnType<typeof useTransform<[number], string>>;
  rightX: ReturnType<typeof useTransform<[number], string>>;
  curtainY: ReturnType<typeof useTransform<[number], string>>;
}) {
  // Split into two halves by character index. We render the same word twice,
  // both clipped to their own half. Each half slides in from opposite sides.
  const half = Math.ceil(text.length / 2);
  const baseStyle: React.CSSProperties = {
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    fontWeight: 600,
    letterSpacing: "-0.05em",
    fontSize: "clamp(4rem, 18vw, 18rem)",
    lineHeight: 0.9,
  };

  return (
    <>
      {/* Left half: paper bg shows ink text */}
      <motion.div
        className="relative will-change-transform"
        style={{ x: leftX, clipPath: `inset(0 ${100 - (half / text.length) * 100}% 0 0)`, ...baseStyle, color: "var(--ink)" }}
        aria-hidden
      >
        {text}
      </motion.div>
      {/* Right half: layered on top */}
      <motion.div
        className="absolute inset-0 will-change-transform flex items-center justify-center"
        style={{ x: rightX }}
        aria-hidden
      >
        <span style={{ ...baseStyle, color: "var(--ink)", clipPath: `inset(0 0 0 ${(half / text.length) * 100}%)` }}>
          {text}
        </span>
      </motion.div>

      {/* Inverted paper copy that only shows over the ink curtain */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="absolute inset-0"
          style={{
            y: curtainY,
            transform: "translateY(0)",
          }}
        />
        <span style={{ ...baseStyle, color: "var(--paper)", mixBlendMode: "difference" }}>
          {text}
        </span>
      </motion.div>

      {/* Accessible label */}
      <span className="sr-only">{text}</span>
    </>
  );
}

// Tiny SVG dial that fills as the seam progresses
function CrossingDial({
  progress,
}: {
  progress: ReturnType<typeof useTransform<[number], number>>;
}) {
  const circ = 2 * Math.PI * 9; // r = 9
  const dashOffset = useTransform(progress, (v) => circ * (1 - v));

  return (
    <div className="flex items-center gap-3">
      <span
        className="font-mono text-[10px] tracking-[0.18em] mix-blend-difference"
        style={{ color: "rgba(243,241,238,0.75)" }}
      >
        paper → ink
      </span>
      <svg width="22" height="22" viewBox="0 0 22 22" className="mix-blend-difference">
        <circle cx="11" cy="11" r="9" stroke="rgba(243,241,238,0.25)" strokeWidth="1.2" fill="none" />
        <motion.circle
          cx="11"
          cy="11"
          r="9"
          stroke="rgba(243,241,238,0.95)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray={circ}
          style={{ strokeDashoffset: dashOffset, transform: "rotate(-90deg)", transformOrigin: "11px 11px" }}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
