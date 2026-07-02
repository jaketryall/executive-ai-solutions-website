"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, EASE_STRUCTURE, reducedMotion } from "@/components/anim/ease";

// Pill-in-pill CTA — the site's one signature control (nav, hero, estimator, submit).
// Outer pill + inner circle; on hover the arrow swaps inside the circle and the
// label rolls per-letter (fixed 0.16s cascade window so long labels stay snappy).

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 13 13 3M5.5 3H13v7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RollingLabel({ text }: { text: string }) {
  const chars = [...text];
  return (
    <span className="cta-label">
      <span style={{ visibility: "hidden", whiteSpace: "pre" }}>{text}</span>
      {[0, 1].map((row) => (
        <span key={row} className="row" data-row={row} aria-hidden>
          {chars.map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </span>
      ))}
    </span>
  );
}

type Tone = "accent" | "ink" | "paper";

export function CTA({
  href,
  label,
  tone = "accent",
  type,
  disabled,
  onClick,
  className = "",
}: {
  href?: string;
  label: string;
  tone?: Tone;
  type?: "submit" | "button";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null!);

  // Park row B one line below at rest (set in the same channel we tween — yPercent).
  useEffect(() => {
    const rowB = ref.current?.querySelector('.cta-label .row[data-row="1"]');
    if (rowB) gsap.set(rowB.children, { yPercent: 110 });
  }, []);

  const roll = (dir: "in" | "out") => {
    if (reducedMotion()) return;
    const rows = ref.current?.querySelectorAll(".cta-label .row");
    if (!rows || rows.length < 2) return;
    const a = rows[0].children;
    const b = rows[1].children;
    const n = a.length;
    const stag = (i: number) => (n > 1 ? (i / (n - 1)) * 0.16 : 0);
    if (dir === "in") {
      gsap.to(a, { yPercent: -110, duration: 0.42, ease: EASE_STRUCTURE, stagger: stag, overwrite: "auto" });
      gsap.to(b, { yPercent: 0, duration: 0.42, ease: EASE_STRUCTURE, stagger: stag, overwrite: "auto" });
    } else {
      gsap.to(a, { yPercent: 0, duration: 0.42, ease: EASE_STRUCTURE, stagger: stag, overwrite: "auto" });
      gsap.to(b, { yPercent: 110, duration: 0.42, ease: EASE_STRUCTURE, stagger: stag, overwrite: "auto" });
    }
  };

  const inner: ReactNode = (
    <>
      <RollingLabel text={label} />
      <span className="cta-dot" aria-hidden>
        <Arrow />
        <Arrow />
      </span>
    </>
  );

  const cls = `cta-pill cta-pill--${tone} ${className}`;
  const handlers = {
    onMouseEnter: () => roll("in"),
    onMouseLeave: () => roll("out"),
  };

  // the visible label lives in aria-hidden roll rows + a visibility:hidden
  // spacer, so the control needs an explicit accessible name
  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        aria-label={label}
        {...handlers}
        ref={ref as React.Ref<HTMLAnchorElement>}
        onClick={onClick}
      >
        {inner}
      </Link>
    );
  }
  return (
    <button
      type={type ?? "button"}
      className={cls}
      aria-label={label}
      disabled={disabled}
      {...handlers}
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
