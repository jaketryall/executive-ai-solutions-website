"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ease } from "@/lib/motion";

// Letter-stagger "swap" — the visible label slides up, an identical copy slides in from below.
// Used everywhere: nav links, CTA labels, filter chips.
export default function HoverText({
  text,
  className,
  trigger,
  stagger = 0.022,
}: {
  text: string;
  className?: string;
  /** Parent-controlled hover (so you can nest inside group/magnetic). If omitted, manages its own. */
  trigger?: boolean;
  stagger?: number;
}) {
  const [local, setLocal] = useState(false);
  const hovered = trigger ?? local;
  const letters = Array.from(text);

  return (
    <span
      className={`relative inline-flex overflow-hidden ${className ?? ""}`}
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
            {c === " " ? " " : c}
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
            {c === " " ? " " : c}
          </motion.span>
        ))}
      </span>
    </span>
  );
}
