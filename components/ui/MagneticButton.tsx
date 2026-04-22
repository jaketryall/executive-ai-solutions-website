"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, ReactNode } from "react";
import Link from "next/link";
import { TransitionLink } from "@/components/PageTransition";

type Common = {
  children: ReactNode;
  className?: string;
  /** How far the button drifts toward the cursor, in px. */
  strength?: number;
  /** Also magnetically offset children relative to the root (parallax). */
  childStrength?: number;
  onClick?: () => void;
  ariaLabel?: string;
  style?: React.CSSProperties;
};
type AsButton = Common & { as?: "button"; type?: "submit" | "button"; disabled?: boolean };
type AsLink = Common & { as: "link"; href: string; transition?: boolean; external?: boolean };

type Props = AsButton | AsLink;

export default function MagneticButton(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const strength = props.strength ?? 22;
  const childStrength = props.childStrength ?? 10;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 18, mass: 0.4 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);
  const csx = useSpring(cx, springConfig);
  const csy = useSpring(cy, springConfig);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const distX = (relX / (rect.width / 2)) * strength;
    const distY = (relY / (rect.height / 2)) * strength;
    x.set(distX);
    y.set(distY);
    cx.set(distX * (childStrength / strength));
    cy.set(distY * (childStrength / strength));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
    cx.set(0);
    cy.set(0);
  };

  const Inner = (
    <motion.div
      style={{ x: csx, y: csy }}
      className="relative will-change-transform inline-flex items-center"
    >
      {props.children}
    </motion.div>
  );

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy, ...props.style }}
      className={`relative inline-flex will-change-transform ${props.className ?? ""}`}
    >
      {Inner}
    </motion.div>
  );

  if (props.as === "link") {
    if (props.external) {
      return (
        <a href={props.href} target="_blank" rel="noopener noreferrer" aria-label={props.ariaLabel} className="inline-flex">
          {content}
        </a>
      );
    }
    if (props.transition === false) {
      return (
        <Link href={props.href} onClick={props.onClick} aria-label={props.ariaLabel} className="inline-flex">
          {content}
        </Link>
      );
    }
    return (
      <TransitionLink href={props.href} onClick={props.onClick} aria-label={props.ariaLabel} className="inline-flex">
        {content}
      </TransitionLink>
    );
  }

  return (
    <button
      type={(props as AsButton).type ?? "button"}
      disabled={(props as AsButton).disabled}
      onClick={props.onClick}
      aria-label={props.ariaLabel}
      className="inline-flex bg-transparent border-0 p-0"
    >
      {content}
    </button>
  );
}
