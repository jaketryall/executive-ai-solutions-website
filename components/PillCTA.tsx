"use client";

// The signature "pill inside a pill" CTA — letter-swap label and an inner
// circle whose arrow slides out right while a twin slides in from the left
// on hover. (Magnetic wrapper retired 2026-06 — owner's call.)

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import HoverText from "./HoverText";
import { ease } from "@/lib/motion";

const sizes = {
  default: { pill: "h-11 pl-5 pr-2 gap-2", circle: "w-8 h-8", travel: 20 },
  compact: { pill: "h-10 pl-4 pr-1.5 gap-2", circle: "w-7 h-7", travel: 18 },
} as const;

export default function PillCTA({
  label = "Start a project",
  href = "#contact",
  invert = false,
  size = "default",
  onClick,
}: {
  label?: string;
  href?: string;
  /** invert: paper pill with ink circle (for dark surfaces) */
  invert?: boolean;
  size?: keyof typeof sizes;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const bg = invert ? "var(--color-paper)" : "var(--color-ink)";
  const fg = invert ? "var(--color-ink)" : "var(--color-paper)";
  const s = sizes[size];

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative inline-flex items-center ${s.pill} rounded-full press focus-ring hover:-translate-y-0.5 transition-transform duration-300`}
      style={{ background: bg, color: fg }}
    >
      <HoverText
        text={label}
        trigger={hovered}
        className="text-[13px] font-medium tracking-tight"
      />
      <span
        className={`relative ${s.circle} rounded-full flex items-center justify-center overflow-hidden`}
        style={{ background: fg, color: bg }}
      >
        <motion.span
          animate={{ x: hovered ? s.travel : 0, opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.35, ease: ease.expoOut }}
          className="absolute"
        >
          <Arrow />
        </motion.span>
        <motion.span
          animate={{ x: hovered ? 0 : -s.travel, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: ease.expoOut }}
          className="absolute"
        >
          <Arrow />
        </motion.span>
      </span>
    </Link>
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
