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
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!section || !row1 || !row2) return;

    const ctx = gsap.context(() => {
      // Label slides in from left
      const label = labelRef.current;
      if (label) {
        gsap.fromTo(label,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, ease: "none",
            scrollTrigger: { trigger: headerRef.current, start: "top 85%", end: "top 55%", scrub: 1 } }
        );
      }

      // Title chars reveal from below
      const title = titleRef.current;
      if (title) {
        const chars = title.querySelectorAll<HTMLSpanElement>(".title-char");
        gsap.fromTo(chars,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.03, ease: "none",
            scrollTrigger: { trigger: headerRef.current, start: "top 80%", end: "top 45%", scrub: 1 } }
        );
      }

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
          <p
            ref={labelRef}
            className="text-xs font-medium tracking-[0.3em] uppercase mb-4"
            style={{ color: accentColor, opacity: 0 }}
          >
            Selected Work
          </p>
          <h2
            ref={titleRef}
            className="overflow-hidden"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(4rem, 8vw, 8rem)",
              fontWeight: 900,
              color: textDark,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          >
            {"PROJECTS".split("").map((char, i) => (
              <span
                key={i}
                className="title-char inline-block"
                style={{ willChange: "transform", opacity: 0 }}
              >
                {char}
              </span>
            ))}
          </h2>
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
  const mobileWorkRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useSplitTextReveal(headerRef);

  useIsomorphicLayoutEffect(() => {
    if (!mobileWorkRef.current) return;

    const ctx = gsap.context(() => {
      // Each card reveals individually on scroll
      const cards = mobileWorkRef.current!.querySelectorAll(".mobile-work-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 60%",
              scrub: 0.5,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={mobileWorkRef} data-bg="cream" className="md:hidden pt-20 pb-24">
      {/* Header */}
      <div ref={headerRef} className="px-6 mb-14">
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

      {/* Full-bleed editorial cards */}
      <div className="flex flex-col gap-10">
        {projects.map((project, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <TransitionLink key={project.slug} href={`/work/${project.slug}`} className="mobile-work-card block">
              {/* Full-width image — no padding, bleeds to edges */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <Image src={project.image} alt={project.title} fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)" }} />

                {/* Number overlay top-right */}
                <div className="absolute top-5 right-6">
                  <span className="text-white/20 text-xs font-medium">{num}</span>
                </div>

                {/* Content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-2">{project.category}</p>
                  <h3
                    className="text-white font-black tracking-tight"
                    style={{ fontSize: "clamp(1.5rem, 7vw, 2.5rem)", lineHeight: 1 }}
                  >
                    {project.title}
                  </h3>
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
