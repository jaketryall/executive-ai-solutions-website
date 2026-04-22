"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";
import { ease } from "@/lib/motion";

// Three beliefs — each one dominates the stage individually. Rhythm
// varies deliberately: a declarative, a two-word punch, and a long
// reflection. Different shapes prevent the section from reading as a
// bullet list.
const CARDS = [
  {
    num: "01",
    kicker: "Motion",
    title: "Motion is a feature, not a coat of paint.",
    body:
      "Animation carries meaning — hierarchy, causality, feedback. I design motion into the interface from the first sketch, not on top of it at the end.",
    dark: true,
  },
  {
    num: "02",
    kicker: "Shipping",
    title: "Ship wet.",
    body:
      "Polish is a veil. I'd rather hand off something alive and half-dry than something perfect and brittle. The next fix gets made Monday.",
    dark: false,
  },
  {
    num: "03",
    kicker: "Restraint",
    title: "The hardest skill is deletion.",
    body:
      "Good design engineering is knowing what to cut — and having the spine to cut it, today, before anyone gets attached. Everything you keep pays rent.",
    dark: true,
  },
];

// Scroll-pinned section. Instead of fanning three cards, each belief takes the
// stage in full, with a giant outlined numeral shifting behind it. No quiet
// header rail — the numeral IS the header.
export default function Promise() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 180, damping: 34, mass: 0.5 });

  return (
    <>
      {/* The sticky stage lives in its OWN container so PostStage doesn't collide with it. */}
      <section
        ref={sectionRef}
        className="relative"
        style={{ height: "320vh", background: "var(--paper)" }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Stage progress={p} />
        </div>
      </section>
      <PostStage />
    </>
  );
}

function Stage({ progress }: { progress: MotionValue<number> }) {
  // Card beats: each card owns a window of progress for its enter / hold / exit.
  // Generous overlap at the seams so cards cross each other in the hand-off.
  const beats = CARDS.map((_, i) => {
    const span = 0.78 / CARDS.length; // distribute across first 78% of scroll
    const base = 0.04 + i * span;
    return {
      enterStart: base,
      holdStart: base + span * 0.28,
      holdEnd: base + span * 0.78,
      exitEnd: base + span * 1.0 + 0.04,
    };
  });

  // Stage release
  const stageY = useTransform(progress, [0.88, 1], [0, -80]);
  const stageOpacity = useTransform(progress, [0.88, 1], [1, 0]);

  // Counter that ticks through. Return annotated as number (not the narrow
  // `0 | 1 | 2` literal union TypeScript infers) so the MotionValue type
  // matches the generic `MotionValue<number>` signature Counter expects.
  const activeIndex = useTransform(progress, (v): number => {
    if (v < beats[1].enterStart) return 0;
    if (v < beats[2].enterStart) return 1;
    return 2;
  });

  return (
    <motion.div style={{ y: stageY, opacity: stageOpacity }} className="relative w-full h-full">
      {/* Giant background numeral — changes per card */}
      {CARDS.map((card, i) => (
        <BackgroundNumeral
          key={`num-${i}`}
          num={card.num}
          beat={beats[i]}
          progress={progress}
        />
      ))}

      {/* Counter — bold top-right, no rail */}
      <div className="absolute top-[max(6.5rem,11vh)] right-6 md:right-12 lg:right-24 z-30 flex items-end gap-4">
        <Counter active={activeIndex} />
      </div>

      {/* Bold top-left label — the section's actual title, replacing the old rail */}
      <div className="absolute top-[max(6.5rem,11vh)] left-6 md:left-12 lg:left-24 z-30">
        <h2
          className="font-display font-semibold"
          style={{
            color: "var(--ink)",
            fontSize: "clamp(1.1rem, 1.3vw, 1.35rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          What I believe.
        </h2>
        <p className="font-mono text-[11px] tabular-nums mt-1" style={{ color: "var(--taupe)" }}>
          three short entries
        </p>
      </div>

      {/* Card stack */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        {CARDS.map((c, i) => (
          <StageCard key={c.num} card={c} beat={beats[i]} progress={progress} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

// A massive outlined numeral sitting behind each card. Fades in at enter,
// holds while the card is on stage, fades out at exit. Subtle scroll-parallax
// so it never feels static.
function BackgroundNumeral({
  num,
  beat,
  progress,
}: {
  num: string;
  beat: { enterStart: number; holdStart: number; holdEnd: number; exitEnd: number };
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [beat.enterStart, beat.holdStart, beat.holdEnd, beat.exitEnd],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    progress,
    [beat.enterStart, beat.holdStart, beat.exitEnd],
    [1.1, 1, 0.98]
  );
  const y = useTransform(
    progress,
    [beat.enterStart, beat.exitEnd],
    [40, -60]
  );

  return (
    <motion.div
      aria-hidden
      style={{ opacity, scale, y }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
    >
      <span
        className="font-display font-semibold leading-none"
        style={{
          fontSize: "clamp(22rem, 58vw, 58rem)",
          letterSpacing: "-0.08em",
          color: "transparent",
          WebkitTextStroke: "2px rgba(26,24,22,0.22)",
          whiteSpace: "nowrap",
        }}
      >
        {num}
      </span>
    </motion.div>
  );
}

// Counter — shows the active card number in bold, plus the total in muted tabular-nums.
// The roll container is deliberately taller than 1em with extra vertical padding
// so mid-roll glyphs are fully inside the clipping box (no half-letters peeking).
function Counter({ active }: { active: MotionValue<number> }) {
  const labels = ["01", "02", "03"];
  const glyphSize = "clamp(1.8rem, 2.2vw, 2.4rem)";
  return (
    <div className="flex items-baseline gap-2">
      <div
        className="relative overflow-hidden"
        style={{
          width: "2.2ch",
          height: "1em",
          fontSize: glyphSize,
          lineHeight: 1,
        }}
      >
        {labels.map((l, i) => (
          <motion.span
            key={l}
            style={{
              y: useTransform(active, (v) => `${(i - v) * 100}%`),
              opacity: useTransform(active, (v) => (Math.abs(v - i) < 0.5 ? 1 : 0)),
            }}
            className="absolute left-0 top-0 font-display font-semibold tabular-nums"
          >
            <span
              style={{
                fontSize: glyphSize,
                letterSpacing: "-0.04em",
                color: "var(--ink)",
                lineHeight: 1,
              }}
            >
              {l}
            </span>
          </motion.span>
        ))}
      </div>
      <span
        className="font-mono tabular-nums"
        style={{ color: "var(--taupe)", fontSize: "0.8rem", letterSpacing: "0.06em" }}
      >
        / 03
      </span>
    </div>
  );
}

// One card — enters scaled down from below, holds at center, exits scaled up and fading.
function StageCard({
  card,
  beat,
  progress,
  index,
}: {
  card: (typeof CARDS)[number];
  beat: { enterStart: number; holdStart: number; holdEnd: number; exitEnd: number };
  progress: MotionValue<number>;
  index: number;
}) {
  const opacity = useTransform(
    progress,
    [beat.enterStart, beat.holdStart, beat.holdEnd, beat.exitEnd],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [beat.enterStart, beat.holdStart, beat.holdEnd, beat.exitEnd],
    [60, 0, 0, -60]
  );
  const scale = useTransform(
    progress,
    [beat.enterStart, beat.holdStart, beat.holdEnd, beat.exitEnd],
    [0.92, 1, 1, 1.04]
  );
  const rotate = index === 1 ? 0 : index === 0 ? -1.5 : 1.5;

  return (
    <motion.article
      style={{
        opacity,
        y,
        scale,
        rotate,
      }}
      className="absolute will-change-transform"
    >
      <div
        className="relative rounded-[28px] overflow-hidden grain"
        style={{
          width: "min(680px, 92vw)",
          background: card.dark
            ? "linear-gradient(160deg, var(--ink) 0%, var(--ink-soft) 100%)"
            : "linear-gradient(160deg, #ffffff 0%, var(--putty) 100%)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.5) inset, 0 40px 80px -35px rgba(26,24,22,0.40)",
          border: card.dark
            ? "1px solid rgba(243,241,238,0.08)"
            : "1px solid rgba(26,24,22,0.08)",
          color: card.dark ? "var(--paper)" : "var(--ink)",
        }}
      >
        <div className="p-10 md:p-14 lg:p-16">
          {/* Kicker row */}
          <div className="flex items-center gap-3 mb-10 md:mb-14">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: card.dark ? "var(--paper)" : "var(--ink)" }}
            />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.26em]"
              style={{
                color: card.dark ? "rgba(243,241,238,0.65)" : "rgba(26,24,22,0.65)",
              }}
            >
              {card.num} · {card.kicker}
            </span>
          </div>

          {/* Monumental title */}
          <h3
            className="font-display font-semibold text-balance"
            style={{
              fontSize: "clamp(1.9rem, 4.8vw, 4rem)",
              letterSpacing: "-0.045em",
              lineHeight: 1.02,
              marginBottom: "clamp(1.25rem, 2vw, 2rem)",
            }}
          >
            {card.title}
          </h3>

          {/* Body */}
          <p
            className="max-w-[52ch]"
            style={{
              fontSize: "clamp(0.95rem, 1.05vw, 1.05rem)",
              lineHeight: 1.6,
              color: card.dark ? "rgba(243,241,238,0.72)" : "rgba(26,24,22,0.72)",
            }}
          >
            {card.body}
          </p>

          {/* Foot rule */}
          <div className="mt-10 flex items-center justify-between">
            <div
              className="h-px flex-1"
              style={{
                background: card.dark ? "rgba(243,241,238,0.14)" : "rgba(26,24,22,0.14)",
              }}
            />
            <span
              className="font-mono tabular-nums pl-4"
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                color: card.dark ? "rgba(243,241,238,0.45)" : "rgba(26,24,22,0.45)",
              }}
            >
              jr / belief · {card.num}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// Post-stage: big pull quote + signature, no rule above it.
function PostStage() {
  return (
    <div
      className="relative px-6 md:px-12 lg:px-24"
      style={{
        paddingTop: "clamp(3rem, 6vw, 5rem)",
        paddingBottom: "clamp(6rem, 12vh, 10rem)",
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, ease: ease.expoOut }}
            className="col-span-12 md:col-span-8"
          >
            <p
              className="font-display font-medium text-balance"
              style={{
                color: "var(--ink)",
                fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)",
                lineHeight: 1.25,
                letterSpacing: "-0.025em",
              }}
            >
              Most of my time goes into the{" "}
              <em style={{ fontStyle: "italic", color: "var(--taupe)" }}>400ms</em> after
              a click — the hover, the handoff, the part other people think is done —
              because that's where trust gets built.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.9, delay: 0.15, ease: ease.expoOut }}
            className="col-span-12 md:col-span-3 md:col-start-10 self-end"
          >
            <div className="text-left md:text-right">
              <p className="text-[11px] uppercase tracking-[0.22em] mb-1" style={{ color: "var(--taupe)" }}>
                Signed
              </p>
              <p
                className="font-display font-semibold"
                style={{
                  fontSize: "clamp(1.1rem, 1.2vw, 1.3rem)",
                  letterSpacing: "-0.025em",
                  color: "var(--ink)",
                }}
              >
                Jake Ryall
              </p>
              <p className="font-mono text-[11px] mt-0.5" style={{ color: "var(--taupe)" }}>
                design engineer · rocklin, ca
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
