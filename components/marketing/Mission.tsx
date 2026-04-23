"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { useIsomorphicLayoutEffect } from "@/lib/motion/primitives";

// The manifesto sentence, tokenised by word. `filled` words render in
// solid ink; `outlined` words render as stroke-only and get their fill
// swept in by a scroll-scrubbed clip-path animation.
const WORDS: Array<{ text: string; filled: boolean }> = [
  { text: "Motion", filled: true },
  { text: "is", filled: false },
  { text: "a", filled: false },
  { text: "feature,", filled: true },
  { text: "not", filled: false },
  { text: "decoration.", filled: true },
];

type Stat = { value: string; legend: string; oxblood?: boolean };
const STATS: Stat[] = [
  { value: "3×", legend: "Shipped this quarter" },
  { value: "2", legend: "Person team" },
  { value: "$0", legend: "Ad spend", oxblood: true },
];

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const manifesto = manifestoRef.current;
    if (!section || !manifesto) return;

    const ctx = gsap.context(() => {
      const sweeps = gsap.utils.toArray<HTMLElement>(
        manifesto.querySelectorAll("[data-fill-sweep]")
      );
      if (!sweeps.length) return;

      // Reduced motion: snap all outlined words to filled immediately, no scrub.
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(sweeps, { clipPath: "inset(0 0% 0 0)" });
        return;
      }

      // Initial state: filled overlay fully clipped (nothing visible).
      gsap.set(sweeps, { clipPath: "inset(0 100% 0 0)" });

      // Master scrubbed timeline — drives each word's sweep in sequence
      // across ~40vh of scroll.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: manifesto,
          start: "top 78%",
          end: "top 38%",
          scrub: 0.6,
        },
      });

      const step = 1 / sweeps.length;
      sweeps.forEach((el, i) => {
        tl.to(
          el,
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            duration: step * 1.35, // slight overlap into the next word
          },
          i * step * 0.85
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="paper"
      className="relative"
      style={{
        background: "var(--paper)",
        minHeight: "90vh",
        paddingInline: "clamp(1.5rem, 6vw, 6rem)",
      }}
    >
      <div className="max-w-[1400px] mx-auto w-full pt-10 md:pt-14 flex flex-col min-h-[90vh]">
        {/* Corner label */}
        <div
          className="font-mono uppercase"
          style={{
            color: "var(--taupe)",
            fontSize: "10px",
            letterSpacing: "0.22em",
          }}
        >
          05 · Mission · SKU EAS/2026/Q2 · In Transit
        </div>

        {/* Manifesto — occupies ~70% of the section, left-aligned, vertically centered */}
        <div className="flex-1 flex items-center py-16 md:py-24">
          <h2
            ref={manifestoRef}
            className="font-display font-black leading-[1.02]"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(3rem, 8vw, 8rem)",
              letterSpacing: "-0.04em",
              maxWidth: "18ch",
            }}
          >
            {WORDS.map((w, i) => (
              <span key={i}>
                {w.filled ? (
                  <FilledWord text={w.text} />
                ) : (
                  <OutlinedWord text={w.text} />
                )}
                {i < WORDS.length - 1 && " "}
              </span>
            ))}
          </h2>
        </div>

        {/* Hairline divider — draws from left on scroll-enter */}
        <motion.div
          aria-hidden
          className="w-full h-px origin-left"
          style={{ background: "rgba(26,24,22,0.15)" }}
          initial={{ scaleX: 0 }}
          animate={statsInView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
        />

        {/* Stats row */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-10 md:py-14"
        >
          {STATS.map((s, i) => (
            <StatCard key={i} stat={s} delay={0.15 + i * 0.1} inView={statsInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FilledWord({ text }: { text: string }) {
  return (
    <span className="inline-block" style={{ color: "var(--ink)" }}>
      {text}
    </span>
  );
}

// Outlined word: renders stroke-only on top, with a filled duplicate layered
// BEHIND, clipped to `inset(0 100% 0 0)` at rest. Scroll sweep animates the
// clip to `inset(0 0% 0 0)`, left-to-right, filling the interior of the letters.
function OutlinedWord({ text }: { text: string }) {
  return (
    <span className="relative inline-block align-baseline">
      {/* Behind: filled copy, clipped to 0 at rest */}
      <span
        aria-hidden
        data-fill-sweep
        className="absolute inset-0 pointer-events-none"
        style={{
          color: "var(--ink)",
          clipPath: "inset(0 100% 0 0)",
          willChange: "clip-path",
        }}
      >
        {text}
      </span>
      {/* Front: outlined (transparent fill + ink stroke) */}
      <span
        className="relative"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.5px var(--ink)",
        }}
      >
        {text}
      </span>
    </span>
  );
}

// Stat card — rises in on scroll, lifts on hover with a legend underline draw.
function StatCard({
  stat,
  delay,
  inView,
}: {
  stat: Stat;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      className="flex flex-col gap-3 cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay }}
      whileHover="hover"
    >
      <motion.div
        variants={{ hover: { y: -4 } }}
        transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
      >
        <CountUp
          value={stat.value}
          duration={1600}
          className="font-display font-black leading-none tabular-nums"
          style={{
            color: stat.oxblood ? "var(--oxblood)" : "var(--ink)",
            fontSize: "clamp(3rem, 6vw, 5rem)",
            letterSpacing: "-0.04em",
          }}
        />
      </motion.div>
      <div className="flex flex-col gap-1">
        <span
          className="font-mono uppercase"
          style={{
            color: "var(--taupe)",
            fontSize: "11px",
            letterSpacing: "0.18em",
          }}
        >
          {stat.legend}
        </span>
        <motion.span
          aria-hidden
          className="h-px origin-left"
          style={{ background: stat.oxblood ? "var(--oxblood)" : "var(--ink)" }}
          initial={{ scaleX: 0 }}
          variants={{ hover: { scaleX: 1 } }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>
    </motion.div>
  );
}
