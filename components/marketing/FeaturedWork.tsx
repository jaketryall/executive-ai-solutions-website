"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import Link from "next/link";
import { projects } from "@/lib/data";
import { ease } from "@/lib/motion";
import HoverText from "@/components/ui/HoverText";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);
  const featured = projects.slice(0, 4);

  return (
    <section
      ref={sectionRef}
      className="relative pb-32 md:pb-48 px-6 md:px-12 lg:px-24 pt-20 md:pt-28"
      style={{ backgroundColor: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-14 md:mb-20">
          <SectionHeader
            sectionRef={sectionRef}
            number="03"
            name="Selected Work"
            sku="EAS/2026/Q2"
            progress={progress}
          />
          <div className="flex items-end justify-between gap-6 mt-10">
            <h3
              className="font-display font-black leading-[0.96] text-balance max-w-[20ch]"
              style={{
                color: "var(--ink)",
                fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
                letterSpacing: "-0.04em",
              }}
              data-reveal
            >
              Four things we&apos;ve built<br />that actually <span style={{ color: "var(--oxblood)" }}>run.</span>
            </h3>
            <AllWorkLink />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {featured.map((p, i) => {
            const colSpan =
              i === 0 ? "md:col-span-7"
              : i === 1 ? "md:col-span-5"
              : i === 2 ? "md:col-span-5"
              : "md:col-span-7";
            const aspect = "aspect-[4/3]";
            return <Card key={p.slug} project={p} index={i} colSpan={colSpan} aspect={aspect} />;
          })}
        </div>

        <div className="md:hidden mt-8">
          <AllWorkLink />
        </div>
      </div>
    </section>
  );
}

function AllWorkLink() {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href="/work"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-2 text-sm"
      style={{ color: "var(--ink)" }}
    >
      <HoverText text="View all work" trigger={hovered} />
      <motion.span
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ duration: 0.4, ease: ease.expoOut }}
        aria-hidden
      >
        →
      </motion.span>
    </Link>
  );
}

function Card({
  project,
  index,
  colSpan,
  aspect,
}: {
  project: (typeof projects)[number];
  index: number;
  colSpan: string;
  aspect: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: ease.expoOut }}
      className={colSpan}
    >
      <Link href={`/work/${project.slug}`} data-card>
          <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative rounded-[28px] overflow-hidden press"
            style={{
              background: "var(--ink-soft)",
              border: "1px solid rgba(26,24,22,0.06)",
            }}
          >
            <div className={`relative ${aspect} overflow-hidden`}>
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: hovered ? 1.06 : 1,
                  filter: hovered ? "contrast(1.08) saturate(1.06)" : "contrast(1) saturate(1)",
                }}
                transition={{ duration: 1.0, ease: ease.expoOut }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className={project.image.includes("Mockup") ? "object-cover object-top" : "object-cover"}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority={index < 2}
                />
              </motion.div>

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.38) 42%, transparent 78%)",
                }}
              />

              {/* Top row */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                <span
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] tracking-tight"
                  style={{
                    background: "rgba(243,241,238,0.14)",
                    color: "var(--paper)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="w-1 h-1 rounded-full" style={{ background: "var(--paper)" }} />
                  {project.category}
                </span>
                <motion.span
                  animate={{ x: hovered ? 0 : 4, opacity: hovered ? 1 : 0.55 }}
                  transition={{ duration: 0.4, ease: ease.expoOut }}
                  className="text-[12px] tabular-nums"
                  style={{ color: "rgba(243,241,238,0.75)" }}
                >
                  {project.year} / {String(index + 1).padStart(2, "0")}
                </motion.span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-6 z-10">
                <div className="flex-1 min-w-0">
                  <motion.h4
                    animate={{ y: hovered ? -4 : 0 }}
                    transition={{ duration: 0.5, ease: ease.expoOut }}
                    className="font-display font-semibold leading-tight mb-2"
                    style={{
                      color: "var(--paper)",
                      fontSize: "clamp(1.4rem, 2.4vw, 2.2rem)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {toSentence(project.title)}
                  </motion.h4>
                  <motion.p
                    animate={{ y: hovered ? -4 : 0, opacity: hovered ? 1 : 0.75 }}
                    transition={{ duration: 0.5, delay: 0.03, ease: ease.expoOut }}
                    className="text-[14px]"
                    style={{ color: "rgba(243,241,238,0.7)" }}
                  >
                    {project.tagline}
                  </motion.p>

                  {/* Reveal on hover — meta pill row */}
                  <motion.div
                    initial={false}
                    animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: ease.expoOut }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 flex flex-wrap gap-1.5">
                      {["Design", "Engineering", "Motion"].map((t, i) => (
                        <motion.span
                          key={t}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
                          transition={{ duration: 0.45, delay: 0.12 + i * 0.05, ease: ease.expoOut }}
                          className="text-[11px] px-2 py-1 rounded-full"
                          style={{
                            background: "rgba(243,241,238,0.08)",
                            color: "rgba(243,241,238,0.8)",
                            border: "1px solid rgba(243,241,238,0.1)",
                          }}
                        >
                          {t}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Arrow disc — rotates + scales */}
                <motion.div
                  animate={{
                    rotate: hovered ? 0 : -45,
                    scale: hovered ? 1.05 : 0.9,
                  }}
                  transition={{ duration: 0.55, ease: ease.expoOut }}
                  className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ background: "var(--paper)", color: "var(--ink)" }}
                >
                  <motion.span
                    animate={{ x: hovered ? 20 : 0, opacity: hovered ? 0 : 1 }}
                    transition={{ duration: 0.35, ease: ease.expoOut }}
                    className="absolute"
                  >
                    <Arrow />
                  </motion.span>
                  <motion.span
                    animate={{ x: hovered ? 0 : -20, opacity: hovered ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: ease.expoOut }}
                    className="absolute"
                  >
                    <Arrow />
                  </motion.span>
                </motion.div>
              </div>
            </div>
          </article>
      </Link>
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

function toSentence(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
