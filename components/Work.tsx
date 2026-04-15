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

/* ─── Full-bleed parallax project showcase ─── */
function FullBleedProject({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const ctx = gsap.context(() => {
      // Parallax — image moves slower than scroll, creates depth
      gsap.fromTo(image,
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Subtle zoom-in as you scroll through
      gsap.fromTo(image,
        { scale: 1.15 },
        {
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Text and details fade + slide in
      const textEls = container.querySelectorAll(".project-text");
      gsap.fromTo(textEls,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: "top 60%",
            end: "top 30%",
            scrub: 0.5,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: "100vh" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Full-bleed image with parallax */}
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
        style={{ top: "-15%", bottom: "-15%", height: "130%" }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          style={{
            transition: "filter 0.6s ease",
            filter: hovered ? "brightness(0.7)" : "brightness(0.5)",
          }}
          sizes="100vw"
          priority={index === 0}
        />
      </div>

      {/* Gradient — heavier at bottom for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Project number — giant, top-right */}
      <div
        className="absolute top-8 right-10 pointer-events-none select-none project-text"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "clamp(6rem, 15vw, 14rem)",
          fontWeight: 900,
          lineHeight: 0.85,
          color: "rgba(255,255,255,0.06)",
          letterSpacing: "-0.05em",
        }}
      >
        {num}
      </div>

      {/* Project info — bottom-left */}
      <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16 lg:p-20">
        <div className="max-w-[1400px] mx-auto flex items-end justify-between">
          <div>
            <p
              className="project-text text-xs font-medium uppercase tracking-[0.3em] mb-4"
              style={{ color: accentColor }}
            >
              {project.category}
            </p>
            <h3
              className="project-text"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              {project.title}
            </h3>
            <p
              className="project-text mt-3"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.9rem",
                letterSpacing: "0.02em",
              }}
            >
              {project.year}
            </p>
          </div>

          {/* View arrow — grows on hover */}
          <TransitionLink href={`/work/${project.slug}`}>
            <div
              className="project-text flex items-center justify-center rounded-full border transition-all duration-500"
              style={{
                width: hovered ? 80 : 56,
                height: hovered ? 80 : 56,
                borderColor: hovered ? accentColor : "rgba(255,255,255,0.2)",
                backgroundColor: hovered ? "rgba(196, 138, 90, 0.1)" : "transparent",
              }}
            >
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke={hovered ? accentColor : "rgba(255,255,255,0.6)"}
                strokeWidth="2" strokeLinecap="round"
                style={{ transition: "all 0.4s ease", transform: hovered ? "translate(2px, -2px)" : "none" }}
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}

/* ─── Expand intro — small card grows to full-bleed (inverse of hero) ─── */
function WorkExpandIntro() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    if (!wrapper || !card) return;

    const ctx = gsap.context(() => {
      // Card starts small with rounded corners, expands to fill viewport
      gsap.fromTo(card,
        {
          scale: 0.6,
          borderRadius: 40,
          y: 200,
        },
        {
          scale: 1,
          borderRadius: 0,
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "40% 50%",
            end: "80% 20%",
            scrub: 0.2,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative h-screen hidden md:flex items-center justify-center"
      data-bg="dark"
      style={{ backgroundColor: "#0a0908", marginTop: "-50vh", zIndex: 3 }}
    >
      <div
        ref={cardRef}
        className="w-full h-full relative will-change-transform"
        style={{ overflow: "hidden" }}
      >
        <Image
          src={projects[0].image}
          alt={projects[0].title}
          fill
          className="object-cover"
          style={{ filter: "brightness(0.5)" }}
          sizes="100vw"
          priority
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.3) 100%)",
          }}
        />
        {/* Project info visible as it expands */}
        <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16 lg:p-20">
          <div className="max-w-[1400px] mx-auto">
            <p
              className="text-xs font-medium uppercase tracking-[0.3em] mb-4"
              style={{ color: accentColor }}
            >
              {projects[0].category}
            </p>
            <h3
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              {projects[0].title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Desktop: Full-bleed parallax showcase ─── */
function DesktopWork() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <>
      <WorkExpandIntro />
      <section
        ref={sectionRef}
        data-bg="dark"
        className="hidden md:block relative"
      >
        {/* Skip first project since it's already shown in the expand intro */}
        {projects.slice(1).map((project, i) => (
          <FullBleedProject key={project.slug} project={project} index={i + 1} />
        ))}
      </section>
    </>
  );
}

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
  return (
    <>
      <DesktopWork />
      <MobileWork />
    </>
  );
}
