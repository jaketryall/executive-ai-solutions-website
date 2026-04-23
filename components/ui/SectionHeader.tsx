"use client";

import { RefObject } from "react";
import { motion } from "framer-motion";
import { useSectionStatus, SectionStatus } from "@/lib/hooks/useSectionStatus";

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  number: string;           // "02"
  name: string;             // "Selected Work"
  sku?: string;             // "EAS/2026/Q2"
  progress?: number;        // 0..1 from useScrub, for oxblood rule fill
  showRule?: boolean;       // default true
};

const STATUS_LABEL: Record<SectionStatus, string> = {
  queued: "Queued",
  "in-transit": "In transit",
  delivered: "Delivered",
};

export default function SectionHeader({
  sectionRef,
  number,
  name,
  sku = "EAS/2026",
  progress = 0,
  showRule = true,
}: Props) {
  const status = useSectionStatus(sectionRef);

  return (
    <div className="w-full" data-reveal>
      <div className="flex items-center gap-3 md:gap-4 flex-wrap">
        {/* Tracking tag: oxblood lead + cream body */}
        <div className="inline-flex items-stretch rounded-[4px] overflow-hidden border border-[var(--oxblood)]">
          <div
            className="px-2.5 py-1 font-mono text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase"
            style={{ background: "var(--oxblood)", color: "var(--paper)" }}
          >
            {number}
          </div>
          <div
            className="px-2.5 py-1 font-mono text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase"
            style={{ color: "var(--ink)", background: "var(--paper)", borderLeft: "1px solid var(--oxblood)" }}
          >
            {name}
          </div>
        </div>

        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--taupe)]">
          SKU · {sku}
        </span>

        <span className="flex-1" />

        {/* Status indicator */}
        <motion.span
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold inline-flex items-center gap-2"
          style={{ color: status === "delivered" ? "var(--taupe)" : "var(--oxblood)" }}
        >
          {status === "in-transit" && (
            <span
              className="w-[7px] h-[7px] rounded-full"
              style={{ background: "var(--oxblood)", animation: "ox-pulse 2s infinite" }}
            />
          )}
          {status === "delivered" && (
            <span style={{ color: "var(--taupe)" }}>✓</span>
          )}
          {STATUS_LABEL[status]}
        </motion.span>
      </div>

      {showRule && (
        <div className="mt-4 h-[2px] w-full relative overflow-hidden" aria-hidden>
          <div className="absolute inset-0" style={{ background: "rgba(26,24,22,0.14)" }} />
          <div
            className="absolute inset-y-0 left-0 transition-none"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(to right, var(--oxblood) 0%, var(--oxblood) calc(100% - 12px), transparent 100%)",
            }}
          />
        </div>
      )}
    </div>
  );
}
