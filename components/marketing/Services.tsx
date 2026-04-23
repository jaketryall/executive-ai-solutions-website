"use client";

import { useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { useIsomorphicLayoutEffect } from "@/lib/motion/primitives";

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

// Per-card deck offsets: all cards start visually collapsed toward center.
// Card 0 (left col): pulled rightward (+x %) so it overlaps center.
// Card 1 (center): stays near its natural position, slight scale/opacity.
// Card 2 (right col): pulled leftward (-x %) so it overlaps center.
const DECK_OFFSETS = [
  { x: "28%",  y: 24, rotation: -7,  scale: 0.88 },
  { x: "0%",   y: 0,  rotation: 1,   scale: 0.91 },
  { x: "-28%", y: 24, rotation: 7,   scale: 0.88 },
] as const;

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { progress } = useSectionReveal(sectionRef);
  const [hovered, setHovered] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        grid.querySelectorAll("[data-service-card]")
      );
      if (cards.length !== 3) return;

      // Snap cards into their stacked "deck" starting positions.
      // GSAP owns the OUTER article transform; Framer owns the INNER div hover lift.
      cards.forEach((card, i) => {
        const o = DECK_OFFSETS[i];
        gsap.set(card, {
          x: o.x,
          y: o.y,
          rotation: o.rotation,
          scale: o.scale,
          opacity: 0,
          transformOrigin: "center bottom",
        });
      });

      // Scroll-scrubbed deal-out: cards fan to their natural grid positions.
      // Using a timeline so we can stagger within scrub.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 20%",
          scrub: 0.8,
        },
      });

      // Stagger via timeline position parameter so each card starts 12% into
      // the overall scrub range after the previous one, giving a cascading deal feel.
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            x: "0%",
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            ease: "expo.out",
            duration: 1,
          },
          i * 0.15   // stagger offset in timeline seconds (scrub normalises this)
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 md:mb-24">
          <SectionHeader
            sectionRef={sectionRef}
            number="06"
            name="Services"
            sku="EAS/2026/Q2"
            progress={progress}
          />
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

        {/* perspective enables future rotationY depth on cards */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
          style={{ perspective: "1400px" }}
        >
          {SERVICES.map((s, i) => (
            // Outer article: owned by GSAP for the deal-in transform.
            // No Framer animate props here — avoids transform conflict.
            <article
              key={s.num}
              data-service-card
              data-service
              data-reveal
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="rounded-[20px] cursor-pointer"
              style={{
                background: "var(--paper-warm)",
                border: "1px solid rgba(26,24,22,0.08)",
                willChange: "transform, opacity",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Inner div: owned by Framer for the hover-lift. Clean separation. */}
              <motion.div
                className="p-8 md:p-10"
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
                      transition={{
                        duration: 0.3,
                        delay: ti * 0.04,
                        ease: [0.19, 1, 0.22, 1],
                      }}
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
              </motion.div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
