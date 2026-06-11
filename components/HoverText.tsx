"use client";

// Letter-stagger "swap" — the visible label slides up, an identical copy
// slides in from below. Used everywhere: nav links, CTA labels, chips.

import { motion } from "motion/react";
import { useState } from "react";
import { ease } from "@/lib/motion";

export default function HoverText({
  text,
  className,
  trigger,
  stagger = 0.022,
}: {
  text: string;
  className?: string;
  /** Parent-controlled hover (so you can nest inside a group). If omitted, manages its own. */
  trigger?: boolean;
  stagger?: number;
}) {
  const [local, setLocal] = useState(false);
  const hovered = trigger ?? local;
  const letters = Array.from(text);

  return (
    <span
      // font-kerning off so the per-letter layers measure exactly like the
      // invisible sizing run (kerning pairs vanish when letters are split)
      className={`relative inline-flex overflow-hidden [font-kerning:none] ${className ?? ""}`}
      onMouseEnter={trigger === undefined ? () => setLocal(true) : undefined}
      onMouseLeave={trigger === undefined ? () => setLocal(false) : undefined}
    >
      <span className="invisible whitespace-pre">{text}</span>

      <span className="absolute inset-0 flex">
        {letters.map((c, i) => (
          <motion.span
            key={`top-${i}`}
            initial={{ y: 0 }}
            animate={{ y: hovered ? "-110%" : "0%" }}
            transition={{ duration: 0.45, delay: i * stagger, ease: ease.expoOut }}
            className="whitespace-pre"
          >
            {c === " " ? " " : c}
          </motion.span>
        ))}
      </span>

      <span className="absolute inset-0 flex">
        {letters.map((c, i) => (
          <motion.span
            key={`bot-${i}`}
            initial={{ y: "110%" }}
            animate={{ y: hovered ? "0%" : "110%" }}
            transition={{ duration: 0.45, delay: i * stagger, ease: ease.expoOut }}
            className="whitespace-pre"
          >
            {c === " " ? " " : c}
          </motion.span>
        ))}
      </span>
    </span>
  );
}
