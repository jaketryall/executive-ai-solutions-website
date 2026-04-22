"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import HoverText from "@/components/ui/HoverText";
import { ease } from "@/lib/motion";

const ROW = [
  { k: "Next opening", v: "Q3 2026" },
  { k: "Slots", v: "2 available" },
  { k: "Typical engagement", v: "4 – 10 weeks" },
  { k: "Working from", v: "Rocklin, CA" },
];

export default function Availability() {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <section
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ backgroundColor: "var(--ink-soft)", color: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="pulse-dot w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#19c37d", color: "#19c37d" }}
              />
              <span
                className="text-[11px] uppercase tracking-[0.3em]"
                style={{ color: "rgba(229,225,219,0.55)" }}
              >
                Availability
              </span>
            </div>
            <h3
              className="font-display font-semibold leading-[1] text-balance mb-10"
              style={{
                color: "var(--paper)",
                fontSize: "clamp(2.4rem, 6vw, 6rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Taking two new projects this summer.
            </h3>
            <p className="text-base md:text-lg leading-relaxed max-w-lg" style={{ color: "rgba(229,225,219,0.65)" }}>
              Most engagements run 4–10 weeks, start with a single working call, and
              end with a living site you actually want to ship. If that sounds like
              your next project, let's talk.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: ease.expoOut }}
              className="mt-10"
            >
              <MagneticButton as="link" href="/contact" strength={18} childStrength={8}>
                <span
                  onMouseEnter={() => setCtaHovered(true)}
                  onMouseLeave={() => setCtaHovered(false)}
                  className="group inline-flex items-center gap-2 h-12 pl-6 pr-2 rounded-full press"
                  style={{ background: "var(--paper)", color: "var(--ink)" }}
                >
                  <HoverText text="Start a project" trigger={ctaHovered} className="text-sm font-medium tracking-tight" />
                  <span
                    className="relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ background: "var(--ink)", color: "var(--paper)" }}
                  >
                    <motion.span
                      animate={{ x: ctaHovered ? 24 : 0, opacity: ctaHovered ? 0 : 1 }}
                      transition={{ duration: 0.4, ease: ease.expoOut }}
                      className="absolute"
                    >
                      <Arrow />
                    </motion.span>
                    <motion.span
                      animate={{ x: ctaHovered ? 0 : -24, opacity: ctaHovered ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: ease.expoOut }}
                      className="absolute"
                    >
                      <Arrow />
                    </motion.span>
                  </span>
                </span>
              </MagneticButton>
            </motion.div>
          </div>

          <div className="md:col-span-5">
            <dl
              className="rounded-[24px] overflow-hidden divide-y"
              style={{ border: "1px solid rgba(229,225,219,0.10)" }}
            >
              {ROW.map((r, i) => (
                <StatRow key={r.k} {...r} index={i} />
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatRow({ k, v, index }: { k: string; v: string; index: number }) {
  const [h, setH] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.06, ease: ease.expoOut }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="relative flex items-center justify-between px-6 py-5 cursor-default"
      style={{ borderColor: "rgba(229,225,219,0.08)" }}
    >
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: h ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
        style={{ background: "rgba(229,225,219,0.04)" }}
      />
      <motion.span
        animate={{ scaleY: h ? 1 : 0 }}
        transition={{ duration: 0.5, ease: ease.expoOut }}
        className="absolute left-0 top-0 bottom-0 w-0.5 origin-center"
        style={{ background: "var(--paper)" }}
      />
      <dt
        className="relative text-[12px] uppercase tracking-[0.18em]"
        style={{ color: "rgba(229,225,219,0.5)" }}
      >
        {k}
      </dt>
      <motion.dd
        animate={{ x: h ? -6 : 0 }}
        transition={{ duration: 0.4, ease: ease.expoOut }}
        className="relative text-[15px]"
        style={{ color: "var(--paper)" }}
      >
        {v}
      </motion.dd>
    </motion.div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
