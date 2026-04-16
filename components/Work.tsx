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

/* ─── Work card for the fan layout ─── */
function FanCard({
  project,
  index,
  isVideo,
}: {
  project: (typeof projects)[number];
  index: number;
  isVideo?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <TransitionLink href={`/work/${project.slug}`}>
      <div
        className="fan-card relative overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "clamp(280px, 22vw, 380px)",
          aspectRatio: "3/4",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: hovered
            ? `0 30px 80px rgba(0,0,0,0.4), 0 0 30px rgba(196, 138, 90, 0.1)`
            : "0 15px 50px rgba(0,0,0,0.3)",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease",
          zIndex: hovered ? 50 : 10 + index,
          position: "relative",
        }}
      >
        {isVideo ? (
          <video
            autoPlay muted loop playsInline preload="auto"
            poster="/video-poster.webp"
            className="w-full h-full object-cover"
          >
            <source src="/final-comp.mp4?v=6" type="video/mp4" />
          </video>
        ) : (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="22vw"
          />
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
          }}
        />

        {/* Project info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p
            className="text-[10px] font-medium uppercase tracking-[0.2em] mb-2"
            style={{ color: accentColor, opacity: 0.8 }}
          >
            {project.category}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(1rem, 1.3vw, 1.25rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {project.title}
          </h3>
        </div>

        {/* Hover arrow */}
        <div
          className="absolute top-4 right-4"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translate(0,0)" : "translate(-4px, 4px)",
            transition: "all 0.3s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </div>
      </div>
    </TransitionLink>
  );
}

/* ─── Desktop: Video box shrinks into card fan ─── */
function DesktopWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);

  // Fan positions — each card's final offset from center
  const cardPositions = [
    { x: 0, rotation: -1 },       // Center (the video)
    { x: -300, rotation: -12 },   // Far left
    { x: 300, rotation: 10 },     // Far right
    { x: 150, rotation: 5 },      // Inner right
  ];

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const videoBox = videoBoxRef.current;
    const fan = fanRef.current;
    if (!section || !videoBox || !fan) return;

    const cards = gsap.utils.toArray<HTMLElement>(fan.querySelectorAll(".fan-card"));

    const ctx = gsap.context(() => {
      // Hide all non-video cards initially (stacked behind video box)
      cards.forEach((card, i) => {
        if (i === 0) return;
        gsap.set(card, {
          x: 0,
          rotation: 0,
          opacity: 0,
          scale: 0.85,
        });
      });

      // Timeline: video box shrinks + cards fan out
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 15%",
          end: "top -50%",
          scrub: 0.4,
          pin: true,
          pinSpacing: true,
        },
      });

      // Video box shrinks from big showcase to card size
      tl.fromTo(videoBox, {
        width: "min(1100px, 85vw)",
        aspectRatio: "16/10",
        borderRadius: 16,
      }, {
        width: "clamp(280px, 22vw, 380px)",
        aspectRatio: "3/4",
        borderRadius: 20,
        ease: "power3.inOut",
        duration: 1,
      }, 0);

      // First fan card (behind video box) — just rotate into position
      if (cards[0]) {
        tl.to(cards[0], {
          rotation: cardPositions[0].rotation,
          ease: "power2.out",
          duration: 1,
        }, 0);
      }

      // Other cards emerge and fan out
      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.to(card, {
          x: cardPositions[i].x,
          rotation: cardPositions[i].rotation,
          opacity: 1,
          scale: 1,
          ease: "power3.out",
          duration: 1,
        }, 0.15 + i * 0.1);
      });
    });

    const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { clearTimeout(timer); ctx.revert(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="dark"
      className="hidden md:block relative"
      style={{ paddingBottom: "10vh" }}
    >
      {/* The video box — starts big like in the hero, shrinks on scroll */}
      <div className="flex justify-center" style={{ marginTop: "-2vh" }}>
        <div
          ref={videoBoxRef}
          className="relative overflow-hidden will-change-[width,aspect-ratio]"
          style={{
            width: "min(1100px, 85vw)",
            aspectRatio: "16/10",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 80px -12px rgba(0,0,0,0.5), 0 0 60px rgba(196, 138, 90, 0.06)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute -inset-20 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(196, 138, 90, 0.06) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <video
            autoPlay muted loop playsInline preload="auto"
            poster="/video-poster.webp"
            className="w-full h-full object-cover"
          >
            <source src="/final-comp.mp4?v=6" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Card fan — positioned over/around the video box */}
      <div
        ref={fanRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        {projects.slice(1).map((project, i) => (
          <div
            key={project.slug}
            className="absolute pointer-events-auto"
            style={{ zIndex: 10 + i }}
          >
            <FanCard
              project={project}
              index={i + 1}
            />
          </div>
        ))}
      </div>
    </section>
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
