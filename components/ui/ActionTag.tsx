"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

type Verb = "VIEW" | "OPEN" | "EXPAND" | "SELECT" | "BOOK" | "COPY" | "OPEN ↗";

const SELECTORS: Array<{ match: string; verb: Verb }> = [
  { match: "[data-card]", verb: "VIEW" },
  { match: "[data-service]", verb: "OPEN" },
  { match: "[data-step]", verb: "EXPAND" },
  { match: "[data-pill]", verb: "SELECT" },
  { match: "[data-cta]", verb: "BOOK" },
  { match: 'a[href^="mailto:"]', verb: "COPY" },
  { match: 'a[target="_blank"]', verb: "OPEN ↗" },
];

export default function ActionTag() {
  const [verb, setVerb] = useState<Verb | null>(null);
  const [enabled, setEnabled] = useState(false);

  const x = useSpring(0, { stiffness: 300, damping: 25, mass: 0.4 });
  const y = useSpring(0, { stiffness: 300, damping: 25, mass: 0.4 });

  useEffect(() => {
    // Desktop-only; respect reduced-motion
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    setEnabled(mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX + 14);
      y.set(e.clientY + 14);

      // Find the tightest matching element under the cursor
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target) {
        setVerb(null);
        return;
      }
      for (const { match, verb } of SELECTORS) {
        if (target.closest(match)) {
          setVerb(verb);
          return;
        }
      }
      setVerb(null);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x, y, mixBlendMode: "difference" }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      aria-hidden
    >
      <motion.div
        initial={false}
        animate={{ opacity: verb ? 1 : 0, scale: verb ? 1 : 0.9 }}
        transition={{ duration: verb ? 0.18 : 0.12 }}
        className="inline-flex items-stretch rounded-[3px] overflow-hidden"
      >
        <span
          className="px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em] uppercase"
          style={{ background: "#7a1e27", color: "#e5e1db" }}
        >
          →
        </span>
        <span
          className="px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em] uppercase"
          style={{ background: "#e5e1db", color: "#1a1816" }}
        >
          {verb}
        </span>
      </motion.div>
    </motion.div>
  );
}
