"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/PageTransition";
import { SplitText, useSplitTextReveal } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const accentColor = "#78736c";
const textDark = "#1a1714";

// Desktop Work is rendered inside the Hero (the shrink-then-fan card morph).
// This file now only owns the mobile treatment — a 2-row drift grid. The old
// DesktopWork + FloatingCard + FanCard were dead code so they were removed.

const projects = [
  { slug: "desert-wings", title: "Desert Wings", category: "Flight School", year: "2024", image: "/Celestial Laptop Mockup.webp" },
  { slug: "riled-up", title: "Riled Up", category: "Coaching", year: "2024", image: "/Celestial iPhone Mockup.webp" },
  { slug: "wings-n-wheels", title: "Wings N Wheels", category: "Design Showcase", year: "2024", image: "/Rubber iPhone Mockup.webp" },
  { slug: "adventure-air", title: "Adventure Air", category: "Gyrocopter Tours", year: "2024", image: "/Elegant Black Laptop Mockup.webp" },
];

/* ─── Mobile: 2-column grid, rows drift in opposite directions ─── */
function MobileWork() {
  const mobileWorkRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const mobileRow1Ref = useRef<HTMLDivElement>(null);
  const mobileRow2Ref = useRef<HTMLDivElement>(null);

  useSplitTextReveal(headerRef);

  useIsomorphicLayoutEffect(() => {
    if (!mobileWorkRef.current) return;

    const ctx = gsap.context(() => {
      const section = mobileWorkRef.current!;
      const row1 = mobileRow1Ref.current;
      const row2 = mobileRow2Ref.current;

      // Row 1 drifts RIGHT to LEFT
      if (row1) {
        gsap.fromTo(row1,
          { x: 40 },
          { x: -40, ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 } }
        );
      }

      // Row 2 drifts LEFT to RIGHT (opposite)
      if (row2) {
        gsap.fromTo(row2,
          { x: -40 },
          { x: 40, ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 } }
        );
      }

      // Cards fade in
      const cards = section.querySelectorAll(".mobile-work-card");
      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.06, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none none" } }
      );
    });

    return () => ctx.revert();
  }, []);

  // Split into 2 rows
  const row1 = projects.slice(0, 2);
  const row2 = [...projects].reverse().slice(0, 2);

  return (
    <section ref={mobileWorkRef} data-bg="cream" className="md:hidden pt-20 pb-24 overflow-hidden">
      {/* Header */}
      <div ref={headerRef} className="px-5 mb-10">
        <p className="text-[10px] font-medium tracking-[0.3em] uppercase mb-4" style={{ color: accentColor }}>
          Selected Work
        </p>
        <SplitText
          text="PROJECTS"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(3.5rem, 16vw, 5.5rem)",
            fontWeight: 900,
            color: textDark,
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
          }}
        />
      </div>

      {/* Row 1 — drifts right to left */}
      <div ref={mobileRow1Ref} className="flex gap-3 mb-3" style={{ paddingLeft: "3vw", paddingRight: "3vw" }}>
        {row1.map((project, i) => (
          <MobileCard key={`r1-${project.slug}`} project={project} index={i} />
        ))}
      </div>

      {/* Row 2 — drifts left to right */}
      <div ref={mobileRow2Ref} className="flex gap-3" style={{ paddingLeft: "3vw", paddingRight: "3vw" }}>
        {row2.map((project, i) => (
          <MobileCard key={`r2-${project.slug}`} project={project} index={i + 2} />
        ))}
      </div>
    </section>
  );
}

/* ─── Mobile card ─── */
function MobileCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      className="mobile-work-card block shrink-0"
      style={{ width: "52%" }}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ aspectRatio: "3/4.5", border: "1px solid rgba(26,23,20,0.08)" }}
      >
        <Image src={project.image} alt={project.title} fill className="object-cover" sizes="52vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white/40 text-[9px] uppercase tracking-[0.15em] mb-1">{project.category}</p>
          <h3 className="text-white font-black text-base leading-tight tracking-tight">{project.title}</h3>
        </div>
      </div>
      <div className="flex items-baseline justify-between mt-2.5 px-0.5">
        <span className="text-[10px] font-medium" style={{ color: accentColor }}>{num}</span>
        <span className="text-[10px]" style={{ color: "rgba(26,23,20,0.3)" }}>{project.year}</span>
      </div>
    </TransitionLink>
  );
}

export default function Work() {
  // Desktop work is now handled inside the Hero component (card fan)
  return <MobileWork />;
}
