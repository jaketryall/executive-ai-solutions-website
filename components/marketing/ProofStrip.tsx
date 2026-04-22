"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * Compact proof strip — three metric cards with context. Sits in the ink
 * territory between the InkMarqueeSeam and Availability, re-installing
 * the conversion spine the audit flagged as missing. Dark-on-dark typography
 * so it reads as punctuation, not another full section.
 */
const ITEMS = [
  {
    metric: "+40%",
    label: "discovery bookings, week 1",
    client: "Desert Wings — Flight School",
  },
  {
    metric: "2×",
    label: "booked calls in 30 days",
    client: "Riled Up — Coaching",
  },
  {
    metric: "6 wk",
    label: "start to launch",
    client: "Wings N Wheels — Detailing",
  },
];

export default function ProofStrip() {
  return (
    <section
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24"
      style={{ backgroundColor: "var(--ink-soft)", color: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-baseline justify-between mb-12 md:mb-16">
          <p
            className="text-[11px] uppercase tracking-[0.3em]"
            style={{ color: "rgba(229,225,219,0.45)" }}
          >
            04 · Proof
          </p>
          <p
            className="text-[12px]"
            style={{ color: "rgba(229,225,219,0.35)" }}
          >
            What the last three launches did in their first month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.client}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: ease.expoOut }}
              className="flex flex-col"
            >
              <p
                className="font-display font-semibold leading-[0.9] mb-4"
                style={{
                  color: "var(--paper)",
                  fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                {item.metric}
              </p>
              <p
                className="text-sm mb-2"
                style={{ color: "rgba(229,225,219,0.75)" }}
              >
                {item.label}
              </p>
              <p
                className="text-[12px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(229,225,219,0.4)" }}
              >
                {item.client}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
