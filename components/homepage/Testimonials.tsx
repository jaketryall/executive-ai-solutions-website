"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// TODO: replace with real client quotes once collected.
// Current content is placeholder aligned to known client projects.
const testimonials: Array<{
  quote: string;
  name: string;
  role: string;
  company: string;
  metric?: string;
}> = [
  {
    quote:
      "He nailed what we were trying to say about the flight school in the first round — new students started booking discovery flights through the site the week we launched.",
    name: "Michael Torres",
    role: "Owner",
    company: "Desert Wings",
    metric: "+40% discovery flights",
  },
  {
    quote:
      "I'd been trying to describe my coaching for years. One conversation with Jake and the homepage read like it came out of my head. Conversions followed.",
    name: "Danny K.",
    role: "Founder",
    company: "Riled Up Coaching",
    metric: "2× booked calls",
  },
  {
    quote:
      "Fast, opinionated, and he actually pushes back when something won't convert. That's rarer than it should be for someone shipping at this level.",
    name: "Sarah Lin",
    role: "Operations Lead",
    company: "Wings N Wheels",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>(".testimonial-card");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="cream"
      className="relative"
      style={{ padding: "clamp(10vh, 15vh, 18vh) 0" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        {/* Eyebrow + headline */}
        <div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
          style={{ marginBottom: "clamp(3rem, 6vh, 5rem)" }}
        >
          <div className="lg:max-w-[680px]">
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(26,24,22,0.4)",
                marginBottom: "1.5rem",
              }}
            >
              What clients say
            </p>
            <h2
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.035em",
                color: "#1a1816",
              }}
            >
              Small bets.
              <br />
              <span style={{ color: "rgba(26,24,22,0.35)" }}>Real outcomes.</span>
            </h2>
          </div>
          <p
            className="lg:text-right"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(0.9rem, 1vw, 1rem)",
              lineHeight: 1.6,
              color: "rgba(26,24,22,0.55)",
              maxWidth: 340,
            }}
          >
            Quotes collected after launch — not curated testimonials pulled for
            the case study.
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ gap: "clamp(1.5rem, 2vw, 2.5rem)" }}
        >
          {testimonials.map((t, i) => (
            <article
              key={i}
              className="testimonial-card group relative flex flex-col"
              style={{
                backgroundColor: "#141210",
                borderRadius: "clamp(1.5rem, 2.25vw, 2.25rem)",
                padding: "clamp(2rem, 3vw, 3rem)",
                border: "1px solid rgba(229, 225, 219, 0.08)",
                transition:
                  "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease",
                willChange: "transform",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor =
                  "rgba(229, 225, 219, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor =
                  "rgba(229, 225, 219, 0.08)";
              }}
            >
              {/* Metric badge (optional) */}
              {t.metric && (
                <span
                  style={{
                    alignSelf: "flex-start",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "100px",
                    backgroundColor: "rgba(229, 225, 219, 0.92)",
                    color: "#141210",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    marginBottom: "clamp(1.5rem, 2.5vw, 2rem)",
                  }}
                >
                  {t.metric}
                </span>
              )}

              {/* Quote */}
              <blockquote
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(1.05rem, 1.3vw, 1.35rem)",
                  lineHeight: 1.55,
                  color: "rgba(229, 225, 219, 0.9)",
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                  marginBottom: "clamp(2rem, 3vw, 2.5rem)",
                  flex: 1,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    fontSize: "2.5em",
                    lineHeight: 0.6,
                    color: "rgba(229, 225, 219, 0.4)",
                    marginBottom: "0.25rem",
                    fontWeight: 400,
                  }}
                >
                  &ldquo;
                </span>
                {t.quote}
              </blockquote>

              {/* Attribution */}
              <footer
                style={{
                  paddingTop: "clamp(1rem, 1.5vw, 1.25rem)",
                  borderTop: "1px solid rgba(229, 225, 219, 0.08)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#e5e1db",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {t.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "rgba(229, 225, 219, 0.45)",
                    marginTop: "0.2rem",
                  }}
                >
                  {t.role} · {t.company}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
