"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
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

const accentColor = "#c48a5a";
const textDark = "#1a1714";

const projects = [
  { slug: "desert-wings", title: "Desert Wings", category: "Flight School", year: "2024", image: "/Celestial Laptop Mockup.webp" },
  { slug: "riled-up", title: "Riled Up", category: "Coaching", year: "2024", image: "/Celestial iPhone Mockup.webp" },
  { slug: "wings-n-wheels", title: "Wings N Wheels", category: "Design Showcase", year: "2024", image: "/Rubber iPhone Mockup.webp" },
  { slug: "adventure-air", title: "Adventure Air", category: "Gyrocopter Tours", year: "2024", image: "/Elegant Black Laptop Mockup.webp" },
];

/* ─── Floating Card ─── */
function FloatingCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      className="floating-card shrink-0"
      style={{ width: "clamp(320px, 38vw, 550px)" }}
    >
      <TransitionLink
        href={`/work/${project.slug}`}
        className="block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            height: "clamp(380px, 50vh, 600px)",
            border: "1px solid rgba(26, 23, 20, 0.08)",
            boxShadow: hovered
              ? "0 30px 80px rgba(0, 0, 0, 0.15)"
              : "0 4px 24px rgba(0, 0, 0, 0.04)",
            transition: "box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            sizes="38vw"
            priority={index === 0}
          />

          {/* Hover overlay */}
          <div
            className="absolute inset-0 flex items-end"
            style={{
              background: hovered
                ? "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)"
                : "transparent",
              opacity: hovered ? 1 : 0,
              transition: "all 0.5s ease",
            }}
          >
            <div className="p-6 w-full flex items-center justify-between">
              <span className="text-white/60 text-xs uppercase tracking-[0.2em]">
                {project.category}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </div>
        </div>

        {/* Label below */}
        <div className="mt-4 flex items-baseline justify-between px-1">
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-medium tracking-[0.2em]" style={{ color: accentColor }}>{num}</span>
            <h3 className="text-base font-bold" style={{ color: textDark, fontFamily: "var(--font-inter), sans-serif" }}>
              {project.title}
            </h3>
          </div>
          <span className="text-sm" style={{ color: "rgba(26,23,20,0.3)" }}>{project.year}</span>
        </div>
      </TransitionLink>
    </div>
  );
}

/* ─── Desktop: 2 rows drifting in opposite directions ─── */
function DesktopWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useSplitTextReveal(headerRef);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!section || !row1 || !row2) return;

    const ctx = gsap.context(() => {
      // Row 1 drifts RIGHT to LEFT
      gsap.fromTo(
        row1,
        { x: 100 },
        {
          x: -100,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );

      // Row 2 drifts LEFT to RIGHT (opposite)
      gsap.fromTo(
        row2,
        { x: -100 },
        {
          x: 100,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );

      // Fade in all cards
      const allCards = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".floating-card")
      );
      gsap.fromTo(
        allCards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, section);

    // Longer delay — needs to wait for HorizontalGallery pin to initialize first
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => { clearTimeout(timer); ctx.revert(); };
  }, []);

  // Row 1: all 4 projects
  // Row 2: reversed order for visual variety
  const row2Projects = [...projects].reverse();

  return (
    <section
      ref={sectionRef}
      data-bg="cream"
      className="hidden md:block relative"
    >
      <div style={{ padding: "clamp(6rem, 12vh, 10rem) 0" }}>
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-16">
        <div ref={headerRef} className="max-w-[1400px] mx-auto mb-16 lg:mb-24">
          <p className="text-xs font-medium tracking-[0.3em] uppercase mb-4" style={{ color: accentColor }}>
            Selected Work
          </p>
          <SplitText
            text="PROJECTS"
            as="h2"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(4rem, 8vw, 8rem)",
              fontWeight: 900,
              color: textDark,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          />
        </div>
      </div>

      {/* Row 1 — drifts right to left */}
      <div
        ref={row1Ref}
        className="flex gap-6 mb-6"
        style={{ paddingLeft: "2vw", paddingRight: "2vw" }}
      >
        {projects.map((project, i) => (
          <FloatingCard key={`r1-${project.slug}`} project={project} index={i} />
        ))}
      </div>

      {/* Row 2 — drifts left to right */}
      <div
        ref={row2Ref}
        className="flex gap-6"
        style={{ paddingLeft: "2vw", paddingRight: "2vw" }}
      >
        {row2Projects.map((project, i) => (
          <FloatingCard key={`r2-${project.slug}`} project={project} index={i + 4} />
        ))}
      </div>
      </div>
    </section>
  );
}

/* ─── Mobile: Horizontal Snap Scroll ─── */
function MobileWork() {
  return (
    <section data-bg="cream" className="md:hidden py-16">
      <div className="px-5 mb-8">
        <p className="text-xs font-medium tracking-[0.3em] uppercase mb-3" style={{ color: accentColor }}>
          Selected Work
        </p>
        <h2
          className="font-black tracking-tight"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(2.5rem, 10vw, 4rem)",
            color: textDark,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
          }}
        >
          PROJECTS
        </h2>
      </div>
      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
        style={{ paddingLeft: "1.25rem", paddingRight: "1.25rem", scrollbarWidth: "none" }}
      >
        {projects.map((project, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <TransitionLink key={project.slug} href={`/work/${project.slug}`} className="block shrink-0 snap-start" style={{ width: "80vw" }}>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: "50vh", border: "1px solid rgba(26,23,20,0.08)" }}>
                <Image src={project.image} alt={project.title} fill className="object-cover" sizes="80vw" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)" }} />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-white/50 text-xs block mb-1">{project.category}</span>
                    <h3 className="text-white text-lg font-bold">{project.title}</h3>
                  </div>
                  <span className="text-xs" style={{ color: accentColor }}>{num}</span>
                </div>
              </div>
            </TransitionLink>
          );
        })}
      </div>
    </section>
  );
}

export default function Work() {
  return (
    <>
      <DesktopWork />
      <MobileWork />
    </>
  );
}
