"use client";

// The signature "pill inside a pill" CTA — magnetic pill, letter-swap label,
// and an inner circle whose arrow slides out right while a twin slides in
// from the left on hover. Requires tokens.css (.press/.focus-ring + palette).
//
// Variants used historically: hero (h-11, w-8 circle, ±20 arrow travel),
// navbar (h-10, w-7 circle, ±18 travel).
//
// Written against framer-motion v12. Under the `motion` package, change the
// import to "motion/react" (API identical).

import { useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import HoverText from "./HoverText";
import { ease } from "./motion";

export default function PillCTA({
  label = "Start a project",
  href = "/contact",
  invert = false,
  onClick,
}: {
  label?: string;
  href?: string;
  /** invert: paper pill with ink circle (for dark surfaces) */
  invert?: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const bg = invert ? "var(--paper)" : "var(--ink)";
  const fg = invert ? "var(--ink)" : "var(--paper)";

  return (
    <MagneticButton as="link" href={href} onClick={onClick} strength={12} childStrength={5}>
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative inline-flex items-center gap-2 h-11 pl-5 pr-2 rounded-full press focus-ring"
        style={{ background: bg, color: fg }}
      >
        <HoverText
          text={label}
          trigger={hovered}
          className="text-[13px] font-medium tracking-tight"
        />
        <span
          className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
          style={{ background: fg, color: bg }}
        >
          <motion.span
            animate={{ x: hovered ? 20 : 0, opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.35, ease: ease.expoOut }}
            className="absolute"
          >
            <Arrow />
          </motion.span>
          <motion.span
            animate={{ x: hovered ? 0 : -20, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35, ease: ease.expoOut }}
            className="absolute"
          >
            <Arrow />
          </motion.span>
        </span>
      </span>
    </MagneticButton>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
