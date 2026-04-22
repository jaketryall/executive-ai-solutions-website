"use client";

import { motion } from "framer-motion";
import { tagHoverVariants } from "@/lib/microInteractions";

// Static next-opening config for now. Could be sourced from Calendly later.
const NEXT_OPENING = "Jul 14";
const ALT_DATES = ["Jul 14", "Jul 21", "Jul 28"];

export default function AvailabilityWidget({ onPickDate }: { onPickDate?: (date: string) => void }) {
  return (
    <div
      className="rounded-xl p-4 mb-6"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <motion.span
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, backgroundColor: "#86efac" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(229,225,219,0.7)" }}>
            Next opening
          </span>
        </div>
        <span className="text-sm font-bold" style={{ color: "#e5e1db" }}>{NEXT_OPENING}</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {ALT_DATES.map((d) => (
          <motion.button
            key={d}
            type="button"
            onClick={() => onPickDate?.(d)}
            variants={tagHoverVariants}
            initial="rest"
            whileHover="hover"
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              color: "#e5e1db",
              border: "1px solid rgba(229,225,219,0.18)",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            {d}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
