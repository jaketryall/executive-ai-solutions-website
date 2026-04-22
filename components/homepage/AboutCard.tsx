"use client";

import { motion } from "framer-motion";
import { cardHoverVariants } from "@/lib/microInteractions";

export default function AboutCard() {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className="rounded-2xl p-6 flex items-center gap-6 flex-wrap"
      style={{
        backgroundColor: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(26,24,22,0.08)",
      }}
    >
      {/* Avatar / mark */}
      <div
        className="rounded-xl flex items-center justify-center font-black"
        style={{
          width: 80,
          height: 80,
          backgroundColor: "#1a1816",
          color: "#e5e1db",
          fontFamily: "var(--font-inter)",
          fontSize: "1.75rem",
          letterSpacing: "-0.04em",
        }}
      >
        JR
      </div>

      {/* Identity */}
      <div className="flex-1 min-w-[200px]">
        <p className="font-black tracking-tight" style={{ fontFamily: "var(--font-inter)", fontSize: "1.25rem", color: "#1a1816", lineHeight: 1.1 }}>
          Jake Ryall
        </p>
        <p className="text-sm mt-1" style={{ color: "rgba(26,24,22,0.6)" }}>
          Designer & Developer · Rocklin, CA
        </p>
      </div>

      {/* Status pill */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: "rgba(120,115,108,0.12)",
            border: "1px solid rgba(120,115,108,0.3)",
          }}
        >
          <motion.span
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, backgroundColor: "#1a1816" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "#1a1816" }}>
            Available Q3 2026
          </span>
        </div>
      </div>
    </motion.div>
  );
}
