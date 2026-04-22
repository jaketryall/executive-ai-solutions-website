"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TransitionLink } from "@/components/PageTransition";
import { ease } from "@/lib/motion";

const PRINCIPLES = [
  {
    n: "01",
    title: "Motion is a feature, not a coat of paint.",
    body: "Animation carries meaning — hierarchy, causality, feedback. I design motion into the interface from the first sketch, not on top of it at the end.",
  },
  {
    n: "02",
    title: "Ship living things.",
    body: "Static mocks are snapshots. I prototype in code, test on real devices, and push pixels against real data. That's the only way I know something actually works.",
  },
  {
    n: "03",
    title: "Restraint is a skill.",
    body: "Every additional element is a tax on attention. Good design engineering is knowing what to cut — and having the spine to cut it.",
  },
];

const EXPERIENCE = [
  { year: "2024 — now", role: "Independent design engineer", where: "Selected clients" },
  { year: "2022 — 2024", role: "Product designer + frontend", where: "Earlier studio work" },
  { year: "2020 — 2022", role: "First shipping, first gigs", where: "How it started" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar lightHero />
      <main className="relative" style={{ zIndex: 10, backgroundColor: "var(--paper)" }}>
        {/* Hero */}
        <section className="pt-40 md:pt-48 pb-24 md:pb-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-12 md:gap-20 items-end">
            <div className="md:col-span-7">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: ease.expoOut }}
                className="text-[11px] uppercase tracking-[0.3em] mb-6"
                style={{ color: "var(--taupe)" }}
              >
                About
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.1, ease: ease.expoOut }}
                className="font-display font-semibold leading-[0.98] text-balance"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(2.6rem, 7.5vw, 7.5rem)",
                  letterSpacing: "-0.045em",
                }}
              >
                Hi, I'm Jake.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: ease.expoOut }}
                className="mt-8 max-w-xl text-base md:text-lg leading-relaxed"
                style={{ color: "var(--taupe)" }}
              >
                I'm a design engineer based in Rocklin, CA. I work with small
                teams and founders who care about the feel of their product as
                much as its function. Motion, micro-interactions, and
                scroll-driven storytelling are where I spend most of my time.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.2, ease: ease.expoOut }}
              className="md:col-span-5"
            >
              <div
                className="relative aspect-[4/5] rounded-[24px] overflow-hidden"
                style={{ background: "var(--putty)" }}
              >
                <Image
                  src="/headshot.jpg"
                  alt="Jake Ryall"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 rounded-[24px]" style={{ boxShadow: "inset 0 0 0 1px rgba(26,24,22,0.06)" }} />
              </div>
              <p className="text-[12px] mt-4 tracking-tight" style={{ color: "var(--taupe)" }}>
                Jake Ryall · Design Engineer · Rocklin, CA
              </p>
            </motion.div>
          </div>
        </section>

        {/* Principles */}
        <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32" style={{ background: "var(--ink-soft)", color: "var(--paper)" }}>
          <div className="max-w-[1400px] mx-auto">
            <p className="text-[11px] uppercase tracking-[0.3em] mb-6" style={{ color: "rgba(229,225,219,0.55)" }}>
              How I work
            </p>
            <h2
              className="font-display font-semibold mb-20 leading-[1.02] text-balance"
              style={{
                color: "var(--paper)",
                fontSize: "clamp(2.2rem, 5.2vw, 4.8rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Three principles.
            </h2>

            <div className="space-y-12 md:space-y-16 max-w-4xl">
              {PRINCIPLES.map((p, i) => (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: ease.expoOut }}
                  className="grid md:grid-cols-12 gap-6 md:gap-10"
                >
                  <div className="md:col-span-2">
                    <span className="font-mono text-[12px]" style={{ color: "rgba(229,225,219,0.45)" }}>
                      {p.n}
                    </span>
                  </div>
                  <div className="md:col-span-10">
                    <h3
                      className="font-display font-semibold leading-[1.15] mb-4"
                      style={{
                        color: "var(--paper)",
                        fontSize: "clamp(1.4rem, 2.4vw, 2.2rem)",
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-relaxed max-w-xl" style={{ color: "rgba(229,225,219,0.7)" }}>
                      {p.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience timeline */}
        <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-[11px] uppercase tracking-[0.3em] mb-6" style={{ color: "var(--taupe)" }}>
              Experience
            </p>
            <h2
              className="font-display font-semibold mb-16 leading-[1] text-balance"
              style={{
                color: "var(--ink)",
                fontSize: "clamp(2rem, 4.6vw, 4rem)",
                letterSpacing: "-0.035em",
              }}
            >
              A short history.
            </h2>
            <ul className="divide-y" style={{ borderTop: "1px solid rgba(26,24,22,0.1)" }}>
              {EXPERIENCE.map((e, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: ease.expoOut }}
                  className="py-5 md:py-6 grid md:grid-cols-12 gap-4 md:gap-8"
                  style={{ borderColor: "rgba(26,24,22,0.1)" }}
                >
                  <span className="md:col-span-3 text-[13px] tabular-nums" style={{ color: "var(--taupe)" }}>
                    {e.year}
                  </span>
                  <span className="md:col-span-6 text-[16px] font-medium" style={{ color: "var(--ink)" }}>
                    {e.role}
                  </span>
                  <span className="md:col-span-3 md:text-right text-[13px]" style={{ color: "var(--taupe)" }}>
                    {e.where}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Engagement block */}
        <section className="px-6 md:px-12 lg:px-24 pb-32 md:pb-48">
          <div className="max-w-[1100px] mx-auto rounded-[28px] p-10 md:p-16 grid md:grid-cols-12 gap-10" style={{ background: "var(--putty)" }}>
            <div className="md:col-span-7">
              <h3
                className="font-display font-semibold leading-[1.02] mb-6 text-balance"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(1.8rem, 3.8vw, 3.2rem)",
                  letterSpacing: "-0.035em",
                }}
              >
                Engagements are short, focused, and senior-only.
              </h3>
              <p className="text-[15px] md:text-[16px] leading-relaxed max-w-lg" style={{ color: "var(--taupe)" }}>
                You work with me, not a team. Most projects run 4–10 weeks. I
                take a small number at a time so I can still do the work, not
                just manage it.
              </p>
            </div>
            <div className="md:col-span-5 flex md:justify-end items-end">
              <TransitionLink
                href="/contact"
                className="group inline-flex items-center gap-2 h-12 pl-6 pr-2 rounded-full press"
                style={{ background: "var(--ink)", color: "var(--paper)" }}
              >
                <span className="text-sm font-medium tracking-tight">Start a project</span>
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:translate-x-[2px]"
                  style={{ background: "var(--paper)", color: "var(--ink)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </TransitionLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
