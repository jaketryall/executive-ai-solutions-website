"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const stats = [
  { value: "3.2x", label: "Avg. conversion lift" },
  { value: "$2.4M", label: "Revenue generated for clients" },
  { value: "47", label: "Websites launched" },
];

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Quote fades up
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "top 45%",
              scrub: 0.5,
            },
          }
        );
      }

      // Divider draws
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "top 35%",
              scrub: 0.5,
            },
          }
        );
      }

      // Stats stagger in
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll(".stat-item");
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              end: "top 50%",
              scrub: 0.5,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="cream"
      style={{
        padding: "clamp(4rem, 10vh, 8rem) clamp(1.5rem, 5vw, 4rem)",
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Testimonial quote */}
        <div ref={quoteRef} style={{ opacity: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#1a1816",
              letterSpacing: "-0.01em",
              maxWidth: "800px",
            }}
          >
            <span style={{ color: "#78736c", fontSize: "1.5em", lineHeight: 0, verticalAlign: "-0.15em", marginRight: "0.1em" }}>&ldquo;</span>
            Jake rebuilt our site and bookings tripled in two months. Best investment we made all year.
            <span style={{ color: "#78736c", fontSize: "1.5em", lineHeight: 0, verticalAlign: "-0.15em", marginLeft: "0.1em" }}>&rdquo;</span>
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div
              style={{
                width: 32,
                height: 1,
                backgroundColor: "#78736c",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "rgba(26, 24, 22, 0.45)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Sarah Chen, Desert Wings Flight School
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          ref={dividerRef}
          style={{
            height: 1,
            backgroundColor: "rgba(26, 24, 22, 0.1)",
            margin: "clamp(2.5rem, 5vh, 4rem) 0",
            transformOrigin: "left",
            transform: "scaleX(0)",
          }}
        />

        {/* Stats row */}
        <div
          ref={statsRef}
          className="flex flex-col md:flex-row md:items-baseline gap-8 md:gap-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item" style={{ opacity: 0 }}>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                  fontWeight: 900,
                  color: "#78736c",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "rgba(26, 24, 22, 0.4)",
                  marginTop: "0.5rem",
                  letterSpacing: "0.02em",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
