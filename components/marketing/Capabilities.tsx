"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ease } from "@/lib/motion";

const CAPS = [
  {
    num: "01",
    name: "Interfaces",
    desc: "Production-grade web apps with design taste — dashboards, marketing sites, internal tools.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind"],
  },
  {
    num: "02",
    name: "Motion",
    desc: "Scroll choreography, micro-interactions, and hero pieces that earn the attention they ask for.",
    stack: ["GSAP", "Framer Motion", "Lenis", "WebGL"],
  },
  {
    num: "03",
    name: "Systems",
    desc: "Design systems, token architectures, and reusable motion primitives that scale across teams.",
    stack: ["Figma", "Tokens Studio", "Storybook", "Radix"],
  },
];

export default function Capabilities() {
  return (
    <section
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ backgroundColor: "var(--ink-soft)", color: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section header — bold, no quiet rail. */}
        <div className="mb-20 md:mb-28">
          <h3
            className="font-display font-semibold leading-[0.98] text-balance max-w-[18ch]"
            style={{
              color: "var(--paper)",
              fontSize: "clamp(2.4rem, 6vw, 6rem)",
              letterSpacing: "-0.045em",
            }}
          >
            What I do, and where the line is.
          </h3>
        </div>

        {/* Three tall cards, each anchored by a monumental outlined numeral. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {CAPS.map((c, i) => (
            <CapCard key={c.num} {...c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CapCard({
  num,
  name,
  desc,
  stack,
  index,
}: {
  num: string;
  name: string;
  desc: string;
  stack: string[];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: ease.expoOut }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-[28px] overflow-hidden"
      style={{
        background: "linear-gradient(175deg, rgba(243,241,238,0.035) 0%, rgba(243,241,238,0.0) 70%)",
        border: "1px solid rgba(243,241,238,0.10)",
        minHeight: "clamp(420px, 48vw, 560px)",
      }}
    >
      {/* Monumental outlined numeral — the visual anchor of the card. */}
      <motion.span
        aria-hidden
        animate={{ x: hovered ? -8 : 0, y: hovered ? -4 : 0 }}
        transition={{ duration: 0.8, ease: ease.expoOut }}
        className="pointer-events-none absolute font-display font-semibold select-none leading-none"
        style={{
          left: "-0.08em",
          bottom: "-0.18em",
          fontSize: "clamp(15rem, 22vw, 26rem)",
          letterSpacing: "-0.08em",
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(243,241,238,0.22)",
          whiteSpace: "nowrap",
        }}
      >
        {num}
      </motion.span>

      {/* Top-right meta */}
      <div className="absolute top-7 right-7 z-10 flex items-center gap-2">
        <span
          className="w-1 h-1 rounded-full"
          style={{ background: "rgba(243,241,238,0.65)" }}
        />
        <span
          className="font-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ color: "rgba(243,241,238,0.55)" }}
        >
          {num}
        </span>
      </div>

      <div className="relative z-10 p-8 md:p-10 h-full flex flex-col">
        {/* Title */}
        <motion.h4
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.7, ease: ease.expoOut }}
          className="font-display font-semibold mt-auto mb-4"
          style={{
            color: "var(--paper)",
            fontSize: "clamp(2.2rem, 3.8vw, 3.6rem)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {name}
        </motion.h4>

        {/* Description */}
        <p
          className="text-[14px] md:text-[15px] leading-[1.55] mb-8 max-w-[36ch]"
          style={{ color: "rgba(243,241,238,0.68)" }}
        >
          {desc}
        </p>

        {/* Stack chips + learn hint */}
        <div className="flex items-end justify-between gap-4 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {stack.map((s) => (
              <span
                key={s}
                className="text-[11px] tracking-tight px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(243,241,238,0.06)",
                  color: "rgba(243,241,238,0.85)",
                  border: "1px solid rgba(243,241,238,0.08)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <motion.span
            animate={{ opacity: hovered ? 1 : 0.4, x: hovered ? 0 : -4 }}
            transition={{ duration: 0.5, ease: ease.expoOut }}
            className="shrink-0 text-[11px] tracking-tight"
            style={{ color: "rgba(243,241,238,0.75)" }}
            aria-hidden
          >
            ↗
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
