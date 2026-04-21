"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SIGNATURE_PATH = "M60,160 C65,100 80,60 95,55 C115,48 110,100 108,130 C105,165 90,200 80,210 Q70,220 85,215 C110,205 135,160 155,155 C175,150 170,185 160,200 Q148,218 165,210 C185,200 195,175 210,165 Q230,152 225,180 C220,205 200,225 195,218 Q188,208 210,195 C225,186 250,175 270,200 Q275,208 265,208 C250,208 280,170 310,120 C325,95 340,75 350,70 Q365,64 358,90 C350,120 335,165 340,185 Q345,200 360,185 C375,168 385,145 400,155 Q408,160 400,178 C390,200 365,230 360,248 Q355,265 370,250 C390,228 410,195 430,188 Q445,182 442,200 C438,215 425,225 435,220 Q450,212 460,140 L462,210 Q465,130 475,128 L477,210 C485,205 520,188 560,182 Q600,176 620,190";

const words: Array<{ text: string; accent?: boolean }> = [
  { text: "I" },
  { text: "DON'T" },
  { text: "JUST" },
  { text: "BUILD", accent: true },
  { text: "WEBSITES." },
  { text: "I" },
  { text: "BUILD" },
  { text: "UNFAIR", accent: true },
  { text: "ADVANTAGES.", accent: true },
];

// No serviceWords needed anymore

// Service data extracted so it can be shared between the JSX rows and the
// floating cursor-follow preview. Image paths are existing mockup assets in /public.
const SERVICES: Array<{
  number: string;
  name: string;
  desc: string;
  image: string;
  imageAlt: string;
}> = [
  {
    number: "01",
    name: "Conversion Websites",
    desc: "Sites built with conversion architecture from the first wireframe — every section earning its scroll.",
    image: "/Celestial Laptop Mockup.webp",
    imageAlt: "Laptop mockup showing a conversion-focused website",
  },
  {
    number: "02",
    name: "AI Automations",
    desc: "Back-office workflows that run while you sleep — inbox triage, lead routing, content pipelines.",
    image: "/custom-dashboard-mockup.webp",
    imageAlt: "Dashboard mockup for an AI automation workflow",
  },
  {
    number: "03",
    name: "Custom Software",
    desc: "Internal tools and dashboards shaped to your operation — one system instead of 12 tabs.",
    image: "/Elegant Black Laptop Mockup.webp",
    imageAlt: "Dark laptop mockup showing a custom internal tool",
  },
];

export default function Manifesto() {
  const desktopRef = useRef<HTMLElement>(null);
  const desktopSigRef = useRef<SVGPathElement>(null);
  const mobileRef = useRef<HTMLElement>(null);
  const mobileSigRef = useRef<SVGPathElement>(null);

  // Cursor-follow preview for service rows (desktop only)
  const servicesAreaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hoveredServiceIdx, setHoveredServiceIdx] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = previewRef.current;
    const area = servicesAreaRef.current;
    if (!el || !area) return;

    // Smooth cursor follow via gsap.quickTo — each axis eases toward target
    // independently so the preview trails the cursor with a slight lag.
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

    const handleMove = (e: MouseEvent) => {
      const rect = area.getBoundingClientRect();
      // Center the 380x280 preview on the cursor (offsets = -width/2, -height/2)
      xTo(e.clientX - rect.left - 190);
      yTo(e.clientY - rect.top - 140);
    };

    area.addEventListener("mousemove", handleMove);
    return () => area.removeEventListener("mousemove", handleMove);
  }, []);


  // Desktop animations — exact original values
  useIsomorphicLayoutEffect(() => {
    const section = desktopRef.current;
    const sig = desktopSigRef.current;
    if (!section) return;

    const chars = section.querySelectorAll<HTMLSpanElement>("[data-char]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 35%",
            end: "top -20%",
            scrub: 1,
          },
        }
      );

      if (sig) {
        const length = sig.getTotalLength();
        gsap.set(sig, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(sig, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 40%",
            scrub: 1,
          },
        });

        const svgEl = sig.closest("svg");
        if (svgEl) {
          gsap.to(svgEl, {
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom 80%",
              end: "bottom 20%",
              scrub: 1,
            },
          });
        }
        gsap.to(sig, {
          stroke: "rgba(26, 23, 20, 1)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "bottom 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);


  // Mobile animations
  useIsomorphicLayoutEffect(() => {
    const section = mobileRef.current;
    const sig = mobileSigRef.current;
    if (!section) return;

    const chars = section.querySelectorAll<HTMLSpanElement>("[data-char]");

    const ctx = gsap.context(() => {
      // Text reveals
      gsap.fromTo(
        chars,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            end: "top 45%",
            scrub: 1,
          },
        }
      );

      // Signature draws — starts as section enters viewport, finishes before text
      if (sig) {
        const length = sig.getTotalLength();
        gsap.set(sig, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(sig, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 100%",
            end: "top 65%",
            scrub: 1,
          },
        });

        const svgEl = sig.closest("svg");
        if (svgEl) {
          gsap.to(svgEl, {
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom 80%",
              end: "bottom 20%",
              scrub: 1,
            },
          });
        }
        gsap.to(sig, {
          stroke: "rgba(26, 23, 20, 1)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "bottom 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const textBlock = (
    <p
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "clamp(2.5rem, 9vw, 8rem)",
        fontWeight: 900,
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
      }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="manifesto-word inline-flex mr-[0.22em]" data-word-index={wi} style={{ overflow: "hidden" }}>
          {word.text.split("").map((char, ci) => (
            <span
              key={ci}
              data-char
              className="inline-block"
              style={{
                color: word.accent ? "rgba(120, 115, 108, 1)" : "#1a1816",
                willChange: "transform",
                opacity: 0,
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </p>
  );

  const signatureSvg = (ref: React.RefObject<SVGPathElement | null>) => (
    <svg
      viewBox="30 30 630 250"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      style={{ height: "auto", opacity: 0.1 }}
    >
      <path
        ref={ref}
        d={SIGNATURE_PATH}
        stroke="rgba(26, 24, 22, 1)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  return (
    <>
      {/* ===== MOBILE ===== */}
      <section
        ref={mobileRef}
        className="relative md:hidden overflow-hidden"
        data-bg="cream"
        style={{ padding: "0 0 10vh", marginTop: "-10vh" }}
      >
        <div className="px-6 text-center">
          {textBlock}
        </div>
      </section>

      {/* ===== DESKTOP — one section, signature draws on cream then bg goes dark ===== */}
      <section
        ref={desktopRef}
        className="relative hidden md:block"
        data-bg="cream"
        style={{ minHeight: "100vh", padding: "15vh 0", paddingBottom: "60vh" }}
      >
        {/* Signature */}
        <div
          className="absolute top-0 left-0 right-0 flex items-start justify-center pointer-events-none pt-[15vh]"
          style={{ zIndex: 2 }}
        >
          <div style={{ width: "clamp(500px, 75vw, 1200px)" }}>
            {signatureSvg(desktopSigRef)}
          </div>
        </div>

        {/* Text — intentionally no explicit z-index so the fixed "I"/"BUILD" words can
             stack at the root level above the services container's stacking context. */}
        <div
          className="relative flex items-start justify-center"
          style={{ minHeight: "100vh", paddingTop: "20vh" }}
        >
          <div className="max-w-[1300px] mx-auto px-8 lg:px-12 text-center">
            {textBlock}
          </div>
        </div>

        {/* Services — two-column editorial layout. Left: headline + tech stack.
             Right: 3 services with icons + short descriptions. No pin/sticky. */}
        <div
          className="relative"
          style={{ paddingTop: "18vh", paddingBottom: "20vh" }}
        >
          <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-16 xl:gap-28 items-start">
              {/* Left column — big headline + tech stack */}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(26,24,22,0.4)",
                    marginBottom: "1.75rem",
                  }}
                >
                  What I build
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "clamp(2.75rem, 6vw, 6rem)",
                    fontWeight: 900,
                    lineHeight: 0.95,
                    letterSpacing: "-0.035em",
                    color: "#1a1816",
                    marginBottom: "clamp(2rem, 4vh, 3rem)",
                  }}
                >
                  Three things.
                  <br />
                  <span style={{ color: "rgba(26,24,22,0.35)" }}>Done well.</span>
                </h2>

                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "clamp(1rem, 1.15vw, 1.15rem)",
                    lineHeight: 1.6,
                    color: "rgba(26,24,22,0.6)",
                    maxWidth: 520,
                    marginBottom: "clamp(3rem, 6vh, 5rem)",
                  }}
                >
                  I keep the scope tight on purpose — every project gets my full attention,
                  my real stack, and a real outcome. No agency overhead, no filler.
                </p>

                {/* Tech stack */}
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(26,24,22,0.4)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Tech stack
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    {[
                      "Next.js",
                      "React",
                      "TypeScript",
                      "Tailwind",
                      "Sanity",
                      "GSAP",
                      "Framer Motion",
                      "OpenAI",
                      "n8n",
                      "Supabase",
                    ].map((tool) => (
                      <span
                        key={tool}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.6rem 1rem",
                          borderRadius: "100px",
                          backgroundColor: "rgba(26,24,22,0.04)",
                          border: "1px solid rgba(26,24,22,0.08)",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.82rem",
                          fontWeight: 500,
                          color: "rgba(26,24,22,0.7)",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column — 3 services with icons + cursor-follow preview */}
              <div
                ref={servicesAreaRef}
                className="relative"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(1.75rem, 3.5vh, 2.5rem)",
                }}
              >
                {/* Floating preview — desktop only. Tracks cursor via gsap.quickTo.
                    Each service's image is an absolute layer; the hovered one is
                    faded in, others are hidden. */}
                <div
                  ref={previewRef}
                  aria-hidden="true"
                  className="hidden lg:block pointer-events-none absolute left-0 top-0"
                  style={{
                    width: 380,
                    height: 280,
                    zIndex: 20,
                    willChange: "transform",
                  }}
                >
                  {SERVICES.map((s, i) => (
                    <div
                      key={s.number}
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                      style={{
                        border: "1px solid rgba(26,24,22,0.08)",
                        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.35)",
                        opacity: hoveredServiceIdx === i ? 1 : 0,
                        transform: `scale(${hoveredServiceIdx === i ? 1 : 0.92})`,
                        transition:
                          "opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      <Image
                        src={s.image}
                        alt={s.imageAlt}
                        fill
                        className="object-cover"
                        sizes="380px"
                      />
                    </div>
                  ))}
                </div>

                {SERVICES.map((service, i) => {
                  const isDimmed =
                    hoveredServiceIdx !== null && hoveredServiceIdx !== i;
                  const icons = [
                    <svg key="01" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <path d="M3 9h18M7 13h6M7 17h4" />
                    </svg>,
                    <svg key="02" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2L4.5 13h7l-1.5 9 8.5-11h-7l1.5-9z" />
                    </svg>,
                    <svg key="03" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>,
                  ];
                  return (
                    <div
                      key={service.number}
                      className="group"
                      onMouseEnter={() => setHoveredServiceIdx(i)}
                      onMouseLeave={() => setHoveredServiceIdx(null)}
                      style={{
                        display: "flex",
                        gap: "clamp(1.25rem, 2vw, 1.75rem)",
                        padding: "clamp(1.25rem, 2vh, 1.75rem) 0",
                        borderBottom: "1px solid rgba(26,24,22,0.08)",
                        cursor: "default",
                        opacity: isDimmed ? 0.35 : 1,
                        transition:
                          "opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="shrink-0 transition-colors duration-300 group-hover:bg-[#78736c]"
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: "50%",
                          backgroundColor: "#1a1816",
                          color: "#f3f1ee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {icons[i]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="flex items-baseline justify-between gap-4"
                          style={{ marginBottom: "0.5rem" }}
                        >
                          <h3
                            style={{
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "clamp(1.25rem, 1.6vw, 1.6rem)",
                              fontWeight: 800,
                              letterSpacing: "-0.02em",
                              color: "#1a1816",
                            }}
                          >
                            {service.name}
                          </h3>
                          <span
                            style={{
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              letterSpacing: "0.2em",
                              color: "rgba(26,24,22,0.3)",
                            }}
                          >
                            {service.number}
                          </span>
                        </div>
                        <p
                          style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "clamp(0.92rem, 1.05vw, 1.05rem)",
                            lineHeight: 1.55,
                            color: "rgba(26,24,22,0.6)",
                          }}
                        >
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
