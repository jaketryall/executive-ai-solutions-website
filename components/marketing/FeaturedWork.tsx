"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import Link from "next/link";
import { projects, type Project } from "@/lib/data";
import { ease } from "@/lib/motion";
import HoverText from "@/components/ui/HoverText";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { useIsomorphicLayoutEffect } from "@/lib/motion/primitives";

// Desktop 5-col bento layout — two hero tiles (3×2, 2×2) then two supporting
// tiles (2, 3) below. Mobile stacks single-column.
const TILE_LAYOUT = [
  "md:col-span-3 md:row-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-2 md:row-span-1",
  "md:col-span-3 md:row-span-1",
];

// Short per-project stack label, surfaced inside the chrome bar on hover.
const STACK: Record<string, string> = {
  "desert-wings": "Next.js · Sanity",
  "riled-up": "Next.js · Postgres",
  "wings-n-wheels": "Next.js · Tailwind",
  "adventure-air": "Wix",
};

function hostFromUrl(url: string | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { progress } = useSectionReveal(sectionRef);
  const featured = projects.slice(0, 4);

  // Entrance: ScrollTrigger.batch staircase (opacity + 40px rise).
  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(
        grid.querySelectorAll("[data-work-card]")
      );
      if (!cards.length) return;

      gsap.set(cards, { opacity: 0, y: 40 });

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "expo.out",
            overwrite: "auto",
          }),
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="ink-deep"
      className="relative pb-32 md:pb-48 px-6 md:px-12 lg:px-24 pt-20 md:pt-28"
      style={{ backgroundColor: "var(--ink-deep)" }}
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
                color: "var(--paper)",
                fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
                letterSpacing: "-0.04em",
              }}
              data-reveal
            >
              Four things we&apos;ve built<br />that actually{" "}
              <span style={{ color: "var(--oxblood)" }}>run.</span>
            </h3>
            <div className="hidden md:block">
              <AllWorkLink />
            </div>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-5 gap-5 md:gap-6 md:auto-rows-[260px] lg:auto-rows-[280px]"
        >
          {featured.map((p, i) => (
            <Tile
              key={p.slug}
              project={p}
              index={i}
              spanClass={TILE_LAYOUT[i]}
            />
          ))}
        </div>

        <div className="md:hidden mt-10">
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
      className="inline-flex items-center gap-2 text-sm transition-colors"
      style={{ color: hovered ? "var(--oxblood)" : "var(--paper)" }}
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

function Tile({
  project,
  index,
  spanClass,
}: {
  project: Project;
  index: number;
  spanClass: string;
}) {
  const [hovered, setHovered] = useState(false);
  const host = hostFromUrl(project.liveUrl);
  const stack = STACK[project.slug] ?? "";
  const isHero = index < 2;

  return (
    <div
      data-work-card
      className={`${spanClass} aspect-4/3 md:aspect-auto`}
      style={{ willChange: "transform, opacity" }}
    >
      <Link
        href={`/work/${project.slug}`}
        data-card
        className="block h-full"
      >
        <motion.article
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          animate={{ scale: hovered ? 1.03 : 1 }}
          transition={{ duration: 0.55, ease: ease.expoOut }}
          className="group relative rounded-[20px] overflow-hidden h-full"
          style={{
            background: project.color,
            border: "1px solid rgba(243,241,238,0.08)",
            boxShadow:
              "0 30px 80px -30px rgba(0,0,0,0.6), 0 0 0 1px rgba(243,241,238,0.02)",
            transformOrigin: "center center",
          }}
        >
          {/* Full-bleed project image */}
          <div className="absolute inset-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className={
                project.image.includes("Mockup")
                  ? "object-cover object-top"
                  : "object-cover"
              }
              sizes={isHero ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 40vw"}
              priority={index < 2}
            />
          </div>

          {/* Bottom gradient for title legibility */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(10,9,8,0.82) 0%, rgba(10,9,8,0.35) 55%, transparent 100%)",
            }}
          />

          {/* Darken overlay — fades in on hover (0 → 0.15) */}
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgb(10,9,8)" }}
            initial={false}
            animate={{ opacity: hovered ? 0.15 : 0 }}
            transition={{ duration: 0.45, ease: ease.expoOut }}
          />

          {/* Chrome bar — slides down from top on hover */}
          <motion.div
            aria-hidden
            initial={false}
            animate={{ y: hovered ? 0 : "-105%" }}
            transition={{ duration: 0.5, ease: ease.expoOut }}
            className="absolute top-0 left-0 right-0 px-4 md:px-5 py-2.5 flex items-center gap-3 md:gap-4 overflow-hidden"
            style={{
              background: "rgba(14,13,12,0.78)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(243,241,238,0.08)",
            }}
          >
            {/* Traffic lights */}
            <div className="flex gap-1.5 shrink-0">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "rgba(243,241,238,0.3)" }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "rgba(243,241,238,0.3)" }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "rgba(243,241,238,0.3)" }}
              />
            </div>
            <span
              className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] truncate"
              style={{ color: "rgba(243,241,238,0.78)" }}
            >
              {host}
            </span>
            {stack && (
              <>
                <span
                  aria-hidden
                  className="hidden md:inline font-mono text-[11px]"
                  style={{ color: "rgba(243,241,238,0.35)" }}
                >
                  ·
                </span>
                <span
                  className="hidden md:inline font-mono text-[11px] uppercase tracking-[0.14em] truncate"
                  style={{ color: "rgba(243,241,238,0.55)" }}
                >
                  {project.year}
                </span>
                <span
                  aria-hidden
                  className="hidden lg:inline font-mono text-[11px]"
                  style={{ color: "rgba(243,241,238,0.35)" }}
                >
                  ·
                </span>
                <span
                  className="hidden lg:inline font-mono text-[11px] uppercase tracking-[0.14em] truncate"
                  style={{ color: "rgba(243,241,238,0.55)" }}
                >
                  {stack}
                </span>
              </>
            )}
          </motion.div>

          {/* Category label — top-left, hides under chrome bar on hover */}
          <motion.span
            initial={false}
            animate={{ opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.25, ease: ease.expoOut }}
            className="absolute top-5 left-5 font-mono uppercase"
            style={{
              color: "rgba(243,241,238,0.6)",
              fontSize: "10px",
              letterSpacing: "0.2em",
            }}
          >
            {project.category}
          </motion.span>

          {/* Title — bottom-left */}
          <div className="absolute bottom-5 left-5 right-5 md:bottom-6 md:left-6">
            <h4
              className="font-display font-bold leading-tight"
              style={{
                color: "var(--paper)",
                fontSize: isHero
                  ? "clamp(1.3rem, 1.8vw, 1.75rem)"
                  : "clamp(1.1rem, 1.4vw, 1.35rem)",
                letterSpacing: "-0.025em",
              }}
            >
              {toSentence(project.title)}
            </h4>
          </div>
        </motion.article>
      </Link>
    </div>
  );
}

function toSentence(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
