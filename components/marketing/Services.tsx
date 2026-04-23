"use client";

import { useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";
import { motion } from "framer-motion";

const SERVICES = [
  {
    num: "01",
    title: "Marketing sites that actually convert.",
    body: "Not a pretty brochure — a tight, fast, measured site that turns the traffic you're already paying for into booked calls.",
    meta: "4–6 weeks · from $12k",
    stack: ["Next.js", "TypeScript", "Tailwind", "Sanity"],
  },
  {
    num: "02",
    title: "Custom CRMs that replace five tabs.",
    body: "Your ops manager stops juggling Google Sheets, Calendly, and three inboxes. One tool, built for exactly how you work.",
    meta: "6–10 weeks · from $18k",
    stack: ["Next.js", "Postgres", "Supabase", "Stripe"],
  },
  {
    num: "03",
    title: "AI voice receptionists that stop the lead bleed.",
    body: "Answers every inbound call 24/7, qualifies, books, and hands you a transcript. Most of our clients recover the cost in 60 days.",
    meta: "4–6 weeks · from $15k",
    stack: ["Vapi", "OpenAI", "Twilio", "Next.js"],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 md:mb-24">
          <SectionHeader sectionRef={sectionRef} number="06" name="Services" sku="EAS/2026/Q2" progress={progress} />
          <h3
            className="font-display font-black leading-[0.96] text-balance max-w-[22ch] mt-10"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
              letterSpacing: "-0.04em",
            }}
            data-reveal
          >
            What we <span style={{ color: "var(--oxblood)" }}>ship.</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.num}
              data-reveal
              data-service
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="p-8 md:p-10 rounded-[20px] cursor-pointer"
              style={{
                background: "var(--paper-warm)",
                border: "1px solid rgba(26,24,22,0.08)",
              }}
              animate={{ y: hovered === i ? -6 : 0 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
              <div
                className="font-mono text-[11px] uppercase tracking-[0.2em] mb-4"
                style={{ color: "var(--oxblood)" }}
              >
                {s.num}
              </div>
              <h4
                className="font-display font-black leading-[1.05] mb-4"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                {s.title}
              </h4>
              <p
                className="leading-[1.55] mb-6"
                style={{ color: "var(--ink)", opacity: 0.75, fontSize: "14.5px" }}
              >
                {s.body}
              </p>
              <div
                className="font-mono text-[11px] uppercase tracking-[0.18em] mb-5 font-bold"
                style={{ color: "var(--ink)" }}
              >
                {s.meta}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {s.stack.map((t, ti) => (
                  <motion.span
                    key={t}
                    initial={false}
                    animate={{
                      y: hovered === i ? 0 : 2,
                      opacity: hovered === i ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.3, delay: ti * 0.04, ease: [0.19, 1, 0.22, 1] }}
                    className="text-[11px] px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(26,24,22,0.06)",
                      color: "var(--ink)",
                      border: "1px solid rgba(26,24,22,0.08)",
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
