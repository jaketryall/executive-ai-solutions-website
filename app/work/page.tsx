"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { projects } from "@/lib/data";
import { ease } from "@/lib/motion";
import HoverText from "@/components/ui/HoverText";

const FILTERS = ["All", "Interfaces", "Motion", "Systems"];

export default function WorkPage() {
  const [filter, setFilter] = useState("All");

  return (
    <>
      <Navbar lightHero />
      <main className="relative" style={{ zIndex: 10, backgroundColor: "var(--paper)" }}>
        {/* Hero */}
        <section className="pt-40 md:pt-48 pb-16 md:pb-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-[1400px] mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: ease.expoOut }}
              className="text-[11px] uppercase tracking-[0.3em] mb-6"
              style={{ color: "var(--taupe)" }}
            >
              Work · {projects.length} pieces
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: ease.expoOut }}
              className="font-display font-semibold leading-[1]"
              style={{
                color: "var(--ink)",
                fontSize: "clamp(3rem, 9vw, 9rem)",
                letterSpacing: "-0.045em",
              }}
            >
              Selected work.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: ease.expoOut }}
              className="mt-8 max-w-xl text-base md:text-lg leading-relaxed"
              style={{ color: "var(--taupe)" }}
            >
              A small collection. Each piece shipped, each one built with the
              same rule: the interface should feel alive.
            </motion.p>
          </div>
        </section>

        {/* Filter chips */}
        <section className="px-6 md:px-12 lg:px-24 pb-10">
          <div className="max-w-[1400px] mx-auto flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <FilterChip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="px-6 md:px-12 lg:px-24 pb-32 md:pb-48">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((p, i) => (
              <WorkCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative text-[12px] px-4 py-2 rounded-full press overflow-hidden"
      style={{
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--paper)" : "var(--ink)",
        border: "1px solid rgba(26,24,22,0.12)",
        transition: "background-color 300ms var(--ease-soft), color 300ms var(--ease-soft), border-color 300ms var(--ease-soft)",
      }}
    >
      <HoverText text={label} trigger={hovered && !active} />
      {active ? <span className="invisible">{label}</span> : null}
    </button>
  );
}

function WorkCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.08, ease: ease.expoOut }}
    >
      <Link href={`/work/${project.slug}`} data-card>
          <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative rounded-[24px] overflow-hidden press"
            style={{ background: "var(--ink-soft)", border: "1px solid rgba(26,24,22,0.06)" }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{ scale: hovered ? 1.06 : 1 }}
                transition={{ duration: 0.9, ease: ease.expoOut }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className={project.image.includes("Mockup") ? "object-cover object-top" : "object-cover"}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index < 2}
                />
              </motion.div>
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(10,9,8,0.88) 0%, rgba(10,9,8,0.35) 45%, transparent 82%)",
                }}
              />

              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                <span
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] tracking-tight"
                  style={{ background: "rgba(243,241,238,0.14)", color: "var(--paper)", backdropFilter: "blur(8px)" }}
                >
                  <span className="w-1 h-1 rounded-full" style={{ background: "var(--paper)" }} />
                  {project.category}
                </span>
                <motion.span
                  animate={{ opacity: hovered ? 1 : 0.6, x: hovered ? 0 : 3 }}
                  transition={{ duration: 0.4, ease: ease.expoOut }}
                  className="text-[12px] tabular-nums"
                  style={{ color: "rgba(243,241,238,0.75)" }}
                >
                  {project.year} / {String(index + 1).padStart(2, "0")}
                </motion.span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-6 z-10">
                <div className="flex-1 min-w-0">
                  <motion.h3
                    animate={{ y: hovered ? -4 : 0 }}
                    transition={{ duration: 0.5, ease: ease.expoOut }}
                    className="font-display font-semibold leading-tight mb-2"
                    style={{
                      color: "var(--paper)",
                      fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {toSentence(project.title)}
                  </motion.h3>
                  <motion.p
                    animate={{ y: hovered ? -4 : 0, opacity: hovered ? 1 : 0.75 }}
                    transition={{ duration: 0.5, delay: 0.03, ease: ease.expoOut }}
                    className="text-[13px]"
                    style={{ color: "rgba(243,241,238,0.7)" }}
                  >
                    {project.tagline}
                  </motion.p>
                </div>
                <motion.div
                  animate={{ rotate: hovered ? 0 : -45, scale: hovered ? 1.05 : 0.9 }}
                  transition={{ duration: 0.55, ease: ease.expoOut }}
                  className="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ background: "var(--paper)", color: "var(--ink)" }}
                >
                  <motion.span
                    animate={{ x: hovered ? 18 : 0, opacity: hovered ? 0 : 1 }}
                    transition={{ duration: 0.35, ease: ease.expoOut }}
                    className="absolute"
                  >
                    <ArrowIcon />
                  </motion.span>
                  <motion.span
                    animate={{ x: hovered ? 0 : -18, opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: ease.expoOut }}
                    className="absolute"
                  >
                    <ArrowIcon />
                  </motion.span>
                </motion.div>
              </div>
            </div>
          </article>
      </Link>
    </motion.div>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function toSentence(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
