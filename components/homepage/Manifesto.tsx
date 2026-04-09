"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
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

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const signatureRef = useRef<SVGPathElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const sig = signatureRef.current;
    if (!section) return;

    const chars = section.querySelectorAll<HTMLSpanElement>("[data-char]");
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Chars reveal — from below, scrub-linked
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
            start: isMobile ? "top 60%" : "top 35%",
            end: isMobile ? "top 10%" : "top -20%",
            scrub: 1,
          },
        }
      );

      // Signature draws on scroll
      if (sig) {
        const length = sig.getTotalLength();
        gsap.set(sig, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(sig, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: isMobile ? "top 80%" : "top 85%",
            end: isMobile ? "top 30%" : "top 45%",
            scrub: 1,
          },
        });

        // Color shifts from gold to dark as background changes to cream
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

  return (
    <section
      ref={sectionRef}
      className="relative"
      data-bg="dark"
      style={{ minHeight: "100vh", padding: "15vh 0" }}
    >
      {/* Signature — sticky, persists through manifesto */}
      <div
        className="sticky top-0 h-screen flex items-start justify-center pointer-events-none pt-[15vh] md:pt-[15vh]"
        style={{ zIndex: 2, marginTop: "-30vh", marginBottom: "-70vh" }}
      >
        <svg
          viewBox="30 30 630 250"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: "clamp(300px, 85vw, 1200px)",
            height: "auto",
            opacity: 0.1,
          }}
        >
          <path
            ref={signatureRef}
            d={SIGNATURE_PATH}
            stroke="rgba(255, 200, 150, 1)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Text — scrolls naturally over the sticky signature */}
      <div
        className="relative flex items-start justify-center"
        style={{ zIndex: 1, minHeight: "100vh", paddingTop: "20vh" }}
      >
        <div className="max-w-[1300px] mx-auto px-6 md:px-8 lg:px-12 text-center">
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
              <span key={wi} className="inline-flex mr-[0.22em]" style={{ overflow: "hidden" }}>
                {word.text.split("").map((char, ci) => (
                  <span
                    key={ci}
                    data-char
                    className="inline-block"
                    style={{
                      color: word.accent ? "rgba(255, 200, 150, 1)" : "#e5e1db",
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
        </div>
      </div>
    </section>
  );
}
