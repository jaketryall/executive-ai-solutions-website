"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

type Deliverable = "site" | "crm" | "voice";

type Service = {
  num: string;
  title: string;
  body: string;
  meta: string;
  stack: string[];
  deliverable: Deliverable;
};

const SERVICES: Service[] = [
  {
    num: "01",
    title: "Marketing sites that actually convert.",
    body: "Not a pretty brochure — a tight, fast, measured site that turns the traffic you're already paying for into booked calls.",
    meta: "4–6 weeks · from $12k",
    stack: ["Next.js", "TypeScript", "Tailwind", "Sanity"],
    deliverable: "site",
  },
  {
    num: "02",
    title: "Custom CRMs that replace five tabs.",
    body: "Your ops manager stops juggling Google Sheets, Calendly, and three inboxes. One tool, built for exactly how you work.",
    meta: "6–10 weeks · from $18k",
    stack: ["Next.js", "Postgres", "Supabase", "Stripe"],
    deliverable: "crm",
  },
  {
    num: "03",
    title: "AI voice receptionists that stop the lead bleed.",
    body: "Answers every inbound call 24/7, qualifies, books, and hands you a transcript. Most of our clients recover the cost in 60 days.",
    meta: "4–6 weeks · from $15k",
    stack: ["Vapi", "OpenAI", "Twilio", "Next.js"],
    deliverable: "voice",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const { progress } = useSectionReveal(sectionRef);
  const [activeIdx, setActiveIdx] = useState(0);

  // Active-index driver: rail item (i) becomes active when deliverable
  // viewport (i)'s top crosses ~30% of the viewport.
  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;

    const update = () => {
      const paneRect = pane.getBoundingClientRect();
      const vh = window.innerHeight;
      // Distance scrolled past pane's top, measured against the 30% marker.
      const distance = vh * 0.3 - paneRect.top;
      const idx = Math.max(
        0,
        Math.min(SERVICES.length - 1, Math.floor(distance / vh))
      );
      setActiveIdx(idx);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="ink-deep"
      data-nav-num="06"
      data-nav-name="SERVICES"
      className="relative"
      style={{ background: "var(--ink-deep)" }}
    >
      {/* Intro block */}
      <div className="px-6 md:px-12 lg:px-24 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-[1400px] mx-auto">
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
              color: "var(--paper)",
              fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
              letterSpacing: "-0.04em",
            }}
            data-reveal
          >
            What we <span style={{ color: "var(--oxblood)" }}>ship.</span>
          </h3>
        </div>
      </div>

      {/* Mobile — stacked cards, deliverable inline under each */}
      <div className="md:hidden px-6 pb-20 flex flex-col gap-16">
        {SERVICES.map((s, i) => (
          <MobileCard key={s.num} service={s} index={i} />
        ))}
      </div>

      {/* Desktop — sticky rail + scrolling deliverable pane */}
      <div className="hidden md:block px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-[2fr_3fr] gap-12 lg:gap-20">
          {/* Sticky left rail */}
          <aside className="sticky top-0 h-screen flex flex-col justify-center gap-10">
            {SERVICES.map((s, i) => (
              <RailItem
                key={s.num}
                service={s}
                active={activeIdx === i}
                aria-current={activeIdx === i}
              />
            ))}
          </aside>

          {/* Right pane — 3 full-viewport blocks stacked */}
          <div ref={paneRef} className="flex flex-col">
            {SERVICES.map((s, i) => (
              <DeliverableViewport
                key={s.num}
                service={s}
                index={i}
                active={activeIdx === i}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tech-stack row — below the sticky section */}
      <div className="hidden md:block px-12 lg:px-24 pt-14 pb-24">
        <div className="max-w-[1400px] mx-auto">
          <div
            className="pt-10 flex flex-wrap items-center gap-x-10 gap-y-5"
            style={{ borderTop: "1px solid rgba(243,241,238,0.1)" }}
          >
            {SERVICES.map((s, i) => (
              <div key={s.num} className="flex items-center gap-3">
                <span
                  className="font-mono uppercase"
                  style={{
                    color: "rgba(243,241,238,0.35)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                  }}
                >
                  {s.num}
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {s.stack.map((t) => (
                    <span
                      key={t}
                      className="font-mono uppercase"
                      style={{
                        color: "rgba(243,241,238,0.7)",
                        fontSize: "10px",
                        letterSpacing: "0.16em",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        border: "1px solid rgba(243,241,238,0.12)",
                        background: "rgba(243,241,238,0.03)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {i < SERVICES.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden lg:inline-block h-4 w-px"
                    style={{ background: "rgba(243,241,238,0.15)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Rail item ────────────────────────────────────────────────────────────────
function RailItem({ service, active }: { service: Service; active: boolean }) {
  return (
    <article
      className="relative"
      aria-current={active ? "step" : undefined}
      style={{ minHeight: "8rem" }}
    >
      <div className="flex items-start gap-5 lg:gap-7">
        <motion.div
          className="font-display font-black leading-none shrink-0"
          animate={{
            color: active ? "var(--oxblood)" : "rgba(243,241,238,0.3)",
          }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          style={{
            fontSize: "clamp(3rem, 5vw, 4.5rem)",
            letterSpacing: "-0.045em",
          }}
        >
          {service.num}
        </motion.div>
        <div className="flex-1 min-w-0 pt-1">
          <motion.h4
            className="font-display font-bold leading-[1.1] mb-3"
            animate={{
              color: active ? "var(--paper)" : "rgba(243,241,238,0.6)",
            }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            style={{
              fontSize: "clamp(1.25rem, 1.55vw, 1.5rem)",
              letterSpacing: "-0.025em",
            }}
          >
            {service.title}
          </motion.h4>
          <div
            className="font-mono uppercase"
            style={{
              color: "rgba(243,241,238,0.55)",
              fontSize: "11px",
              letterSpacing: "0.18em",
            }}
          >
            {service.meta}
          </div>
        </div>
      </div>

      {/* Oxblood underline — extends from 40px to full width when active */}
      <motion.div
        className="mt-4 h-[2px]"
        style={{ background: "var(--oxblood)", transformOrigin: "left center" }}
        initial={false}
        animate={{
          width: active ? "100%" : "40px",
          opacity: active ? 1 : 0.45,
        }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      />
    </article>
  );
}

// ─── Deliverable viewport (desktop) ──────────────────────────────────────────
function DeliverableViewport({
  service,
  index,
  active,
}: {
  service: Service;
  index: number;
  active: boolean;
}) {
  return (
    <div
      data-deliverable-idx={index}
      className="h-screen flex items-center"
    >
      <BrowserFrame service={service} active={active} />
    </div>
  );
}

// ─── Browser chrome frame ────────────────────────────────────────────────────
function BrowserFrame({
  service,
  active,
}: {
  service: Service;
  active: boolean;
}) {
  const address =
    service.deliverable === "site"
      ? "desertwings.com"
      : service.deliverable === "crm"
      ? "app.rileduppickleball.com"
      : "+1 (928) 555-0134";

  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0.35, scale: active ? 1 : 0.97 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="relative w-full rounded-[16px] overflow-hidden"
      style={{
        aspectRatio: "4 / 3",
        background: "rgba(229,225,219,0.03)",
        border: "1px solid rgba(243,241,238,0.08)",
        boxShadow: "0 40px 100px -40px rgba(0,0,0,0.8)",
      }}
    >
      {/* Chrome bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid rgba(243,241,238,0.06)" }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "rgba(243,241,238,0.18)" }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "rgba(243,241,238,0.18)" }}
        />
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: "rgba(243,241,238,0.18)" }}
        />
        <div
          className="flex-1 mx-4 px-3 py-1 rounded-md font-mono text-[11px] tracking-tight"
          style={{
            background: "rgba(243,241,238,0.05)",
            color: "rgba(243,241,238,0.55)",
          }}
        >
          {address}
        </div>
      </div>

      {/* Deliverable mock */}
      <div className="relative" style={{ height: "calc(100% - 45px)" }}>
        {service.deliverable === "site" && <DeliverableSite active={active} />}
        {service.deliverable === "crm" && <DeliverableCRM active={active} />}
        {service.deliverable === "voice" && (
          <DeliverableVoice active={active} />
        )}
      </div>
    </motion.div>
  );
}

// ─── Deliverable: Marketing site ──────────────────────────────────────────────
function DeliverableSite({ active }: { active: boolean }) {
  const [leads, setLeads] = useState(0);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!active || hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    let current = 0;
    const target = 47;
    const id = window.setInterval(() => {
      current += 1;
      setLeads(current);
      if (current >= target) window.clearInterval(id);
    }, 40);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="absolute inset-0">
      <Image
        src="/Celestial Laptop Mockup.webp"
        alt="Marketing site mock"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 60vw"
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: active ? 1 : 0.4, y: active ? 0 : 10 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-full"
        style={{
          background: "rgba(14,13,12,0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(243,241,238,0.12)",
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: "#4ade80",
            boxShadow: "0 0 12px rgba(74,222,128,0.6)",
          }}
        />
        <div className="flex items-baseline gap-2">
          <span
            className="font-display font-black tabular-nums"
            style={{ color: "var(--paper)", fontSize: "1.5rem" }}
          >
            {leads}
          </span>
          <span
            className="font-mono uppercase"
            style={{
              color: "rgba(243,241,238,0.6)",
              fontSize: "10px",
              letterSpacing: "0.18em",
            }}
          >
            leads booked today
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Deliverable: CRM ─────────────────────────────────────────────────────────
function DeliverableCRM({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0">
      <Image
        src="/custom-dashboard-mockup.webp"
        alt="Custom CRM interface"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 60vw"
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: active ? 1 : 0.4, y: active ? 0 : 10 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="absolute top-6 left-6 flex items-center gap-3 px-4 py-3 rounded-full"
        style={{
          background: "rgba(14,13,12,0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(243,241,238,0.12)",
        }}
      >
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{
                opacity: active ? (i === 2 ? 1 : 0.2) : 1,
                scale: active ? (i === 2 ? 1 : 0.6) : 1,
              }}
              transition={{ delay: active ? 0.6 + i * 0.08 : 0, duration: 0.5 }}
              className="inline-block"
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background:
                  active && i === 2
                    ? "var(--oxblood)"
                    : "rgba(243,241,238,0.5)",
              }}
            />
          ))}
        </div>
        <span
          className="font-mono uppercase"
          style={{
            color: "rgba(243,241,238,0.6)",
            fontSize: "10px",
            letterSpacing: "0.18em",
          }}
        >
          5 tabs → 1 tool
        </span>
      </motion.div>
    </div>
  );
}

// ─── Deliverable: Voice receptionist ──────────────────────────────────────────
function DeliverableVoice({ active }: { active: boolean }) {
  const lines = [
    { by: "caller", text: "Hi, is this Adventure Air?" },
    { by: "eas", text: "Yes — this is Ava, Adventure Air's booking line. How can I help?" },
    { by: "caller", text: "I'd like to book a gyrocopter tour for Saturday." },
    { by: "eas", text: "I have 9:47 AM or 2:15 PM available — which works?" },
  ];
  const [visibleCount, setVisibleCount] = useState(0);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!active || hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    const id = window.setInterval(() => {
      setVisibleCount((c) => {
        if (c >= lines.length) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 650);
    return () => window.clearInterval(id);
  }, [active, lines.length]);

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end p-6 gap-2 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(122,30,39,0.22) 0%, rgba(14,13,12,1) 65%)",
      }}
    >
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: "var(--oxblood)" }}
          />
          <span
            className="font-mono uppercase font-bold"
            style={{
              color: "var(--paper)",
              fontSize: "10px",
              letterSpacing: "0.22em",
            }}
          >
            Live call · 00:28
          </span>
        </div>
        <motion.div
          initial={false}
          animate={{
            opacity: visibleCount >= lines.length ? 1 : 0,
            x: visibleCount >= lines.length ? 0 : 10,
          }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(243,241,238,0.08)",
            border: "1px solid rgba(243,241,238,0.12)",
          }}
        >
          <span style={{ color: "#4ade80" }}>✓</span>
          <span
            className="font-mono uppercase"
            style={{
              color: "var(--paper)",
              fontSize: "10px",
              letterSpacing: "0.18em",
            }}
          >
            Booked · 9:47 AM
          </span>
        </motion.div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <AnimatePresence initial={false}>
          {lines.slice(0, visibleCount).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                line.by === "eas" ? "self-end" : "self-start"
              }`}
              style={{
                background:
                  line.by === "eas"
                    ? "var(--oxblood)"
                    : "rgba(243,241,238,0.08)",
                color: "var(--paper)",
                fontSize: "13px",
                lineHeight: 1.4,
                border:
                  line.by === "eas"
                    ? "none"
                    : "1px solid rgba(243,241,238,0.1)",
              }}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────
function MobileCard({ service, index }: { service: Service; index: number }) {
  return (
    <article className="flex flex-col gap-5" data-service-idx={index}>
      <div className="flex items-start gap-4">
        <span
          className="font-display font-black leading-none"
          style={{
            color: "var(--oxblood)",
            fontSize: "2.5rem",
            letterSpacing: "-0.04em",
          }}
        >
          {service.num}
        </span>
        <div className="flex-1">
          <h4
            className="font-display font-bold leading-tight mb-2"
            style={{
              color: "var(--paper)",
              fontSize: "1.35rem",
              letterSpacing: "-0.025em",
            }}
          >
            {service.title}
          </h4>
          <div
            className="font-mono uppercase"
            style={{
              color: "rgba(243,241,238,0.6)",
              fontSize: "10px",
              letterSpacing: "0.18em",
            }}
          >
            {service.meta}
          </div>
        </div>
      </div>
      <p
        className="leading-[1.55]"
        style={{
          color: "rgba(243,241,238,0.72)",
          fontSize: "14px",
        }}
      >
        {service.body}
      </p>
      <BrowserFrame service={service} active={true} />
      <div className="flex flex-wrap gap-1.5">
        {service.stack.map((t) => (
          <span
            key={t}
            className="font-mono uppercase"
            style={{
              color: "rgba(243,241,238,0.7)",
              fontSize: "10px",
              letterSpacing: "0.16em",
              padding: "4px 10px",
              borderRadius: "999px",
              border: "1px solid rgba(243,241,238,0.12)",
              background: "rgba(243,241,238,0.03)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
