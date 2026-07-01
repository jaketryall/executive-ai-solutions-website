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
  default: {
    pill: "h-11 pl-5 pr-2 gap-2",
    circle: "w-8 h-8",
    travel: 20,
    label: "text-[13px]",
  },
  compact: {
    pill: "h-11 md:h-10 pl-4 pr-1.5 gap-2",
    circle: "w-7 h-7",
    travel: 18,
    label: "text-[13px]",
  },
  /** Oversized — lives inline inside display headlines (final CTA) */
  mega: {
    pill: "h-14 md:h-18 pl-7 md:pl-9 pr-2.5 md:pr-3 gap-3",
    circle: "w-10 h-10 md:w-13 md:h-13",
    travel: 26,
    label: "text-[15px] md:text-lg",
  },
} as const;

export default function PillCTA({
  label = "Start a project",
  href = "#contact",
  invert = false,
  size = "default",
  onClick,
  hovered: controlledHovered,
  onHoverChange,
}: {
  label?: string;
  href?: string;
  /** Default tracks the chromatic zone (auto-inverts in dark zones).
      invert: literal paper pill — only for permanently dark surfaces
      outside the zone system (e.g. the mobile menu overlay). */
  invert?: boolean;
  size?: keyof typeof sizes;
  onClick?: () => void;
  /** Controlled hover — lets a parent drive the swap (e.g. the nav's
      seam-split renders two synced copies of this pill). */
  hovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}) {
  const [local, setLocal] = useState(false);
  const hovered = controlledHovered ?? local;
  const bg = invert ? "var(--color-paper)" : "var(--fg)";
  const fg = invert ? "var(--color-ink)" : "var(--bg)";
  const s = sizes[size];

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => {
        setLocal(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setLocal(false);
        onHoverChange?.(false);
      }}
      className={`relative inline-flex items-center ${s.pill} rounded-full press focus-ring hover:-translate-y-0.5 transition-transform duration-300`}
      style={{ background: bg, color: fg }}
    >
      <HoverText
        text={label}
        trigger={hovered}
        className={`${s.label} font-medium tracking-tight`}
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
