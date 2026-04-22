"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/PageTransition";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Split a string into per-character spans for the scroll-scrubbed letter
// animation on the section headline. Each char is wrapped in an overflow:
// hidden mask so the in/out translateY motion is cleanly clipped — no
// half-visible letters at mid-scroll. The inner `.char-inner` starts at
// yPercent: 100 (hidden below the mask) via inline style so there's no
// flash on mount before GSAP activates.
function renderChars(text: string) {
  return text.split("").map((ch, i) => (
    <span
      key={i}
      className="inline-flex overflow-hidden"
      style={{
        verticalAlign: "baseline",
        lineHeight: "inherit",
        paddingBottom: "0.12em",
        marginBottom: "-0.12em",
      }}
    >
      <span
        className="char-inner inline-block will-change-transform"
        style={{ transform: "translateY(100%)", lineHeight: "inherit" }}
      >
        {ch === " " ? "\u00A0" : ch}
      </span>
    </span>
  ));
}

// TODO: replace with real client quotes once collected.
// Current content is placeholder aligned to known client projects.
type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  metricValue: string;
  metricLabel: string;
  launched: string;
  slug: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "He nailed what we were trying to say about the flight school in the first round — new students started booking discovery flights through the site the week we launched.",
    name: "Michael Torres",
    role: "Owner",
    company: "Desert Wings",
    metricValue: "+40%",
    metricLabel: "discovery flights",
    launched: "Q1 2026",
    slug: "desert-wings",
  },
  {
    quote:
      "I'd been trying to describe my coaching for years. One conversation with Jake and the homepage read like it came out of my head. Conversions followed.",
    name: "Danny K.",
    role: "Founder",
    company: "Riled Up Coaching",
    metricValue: "2×",
    metricLabel: "booked calls",
    launched: "Q4 2025",
    slug: "riled-up",
  },
  {
    quote:
      "Fast, opinionated, and he actually pushes back when something won't convert. That's rarer than it should be for someone shipping at this level.",
    name: "Sarah Lin",
    role: "Operations Lead",
    company: "Wings N Wheels",
    metricValue: "6 wk",
    metricLabel: "to launch",
    launched: "Q3 2025",
    slug: "wings-n-wheels",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Cards fade + rise as the section first enters view
      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        }
      );

      // Headline letters rise into place as the section enters the viewport…
      // Tight scrub range + mask (overflow:hidden on each char wrapper) keeps
      // half-rendered letters from showing at mid-scroll.
      gsap.to(".char-inner", {
        yPercent: 0,
        stagger: 0.012,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 60%",
          scrub: 0.5,
        },
      });
      // …and rise out upward as the section scrolls past the top.
      gsap.to(".char-inner", {
        yPercent: -100,
        stagger: 0.012,
        ease: "power2.in",
        scrollTrigger: {
          trigger: section,
          start: "bottom 55%",
          end: "bottom 25%",
          scrub: 0.5,
        },
      });

      // Metric counters — count up from 0 to their target as each metric
      // scrolls into view. Parsed from the data-metric attr so we preserve
      // the original formatting ("+40%" / "2×" / "6 wk") on the final frame.
      section
        .querySelectorAll<HTMLElement>(".metric-value-counter")
        .forEach((el) => {
          const original = el.getAttribute("data-metric") || el.textContent || "";
          const match = original.match(/^([^\d.-]*)([\d.]+)(.*)$/);
          if (!match) return;
          const prefix = match[1];
          const target = parseFloat(match[2]);
          const suffix = match[3];
          const counter = { n: 0 };
          el.textContent = `${prefix}0${suffix}`;
          gsap.to(counter, {
            n: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = `${prefix}${Math.round(counter.n)}${suffix}`;
            },
            onComplete: () => {
              el.textContent = original;
            },
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          });
        });
    }, section);

    return () => ctx.revert();
  }, []);

  const [featured, ...supporting] = testimonials;

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      data-bg="cream"
      className="relative scroll-mt-16"
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
              What clients say · 03 / 2026
            </p>
            <h2
              aria-label="Small bets. Real outcomes."
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(2.25rem, 4.5vw, 4rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.035em",
                color: "#1a1816",
              }}
            >
              <span aria-hidden="true" className="inline-block">
                {renderChars("Small bets.")}
              </span>
              <br />
              <span
                aria-hidden="true"
                className="inline-block"
                style={{ color: "rgba(26,24,22,0.35)" }}
              >
                {renderChars("Real outcomes.")}
              </span>
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

        {/* Featured card — cream-toned inversion of the supporting dark cards.
            Asymmetric: outsized metric column on the left, quote + attribution
            on the right. Full-width so it reads as the lead of the section. */}
        <TransitionLink
          href={`/work/${featured.slug}`}
          data-card
          className="testimonial-card group block relative overflow-hidden bg-[#e9e5de] border border-[rgba(26,24,22,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-[#ddd7cc] hover:border-[rgba(26,24,22,0.22)]"
          style={{
            borderRadius: "clamp(1.5rem, 2.25vw, 2.25rem)",
            padding: "clamp(2rem, 3.5vw, 3.5rem)",
            marginBottom: "clamp(1.5rem, 2vw, 2.5rem)",
            willChange: "transform",
          }}
        >
          {/* Top meta: case index + pulsing "LIVE" badge with launch date */}
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: "clamp(2rem, 3vw, 3rem)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.3em",
                color: "rgba(26,24,22,0.42)",
              }}
            >
              01 / 03 · FEATURED
            </span>
            <div className="flex items-center" style={{ gap: "0.5rem" }}>
              <motion.span
                className="rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "rgba(16,185,129,0.9)",
                }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  color: "rgba(26,24,22,0.55)",
                }}
              >
                LIVE · LAUNCHED {featured.launched}
              </span>
            </div>
          </div>

          {/* Content — metric column (left) + quote column (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-16 lg:items-stretch">
            <div className="flex flex-col justify-between">
              <div>
                <p
                  className="metric-value-counter"
                  data-metric={featured.metricValue}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "clamp(4rem, 9vw, 8.5rem)",
                    fontWeight: 900,
                    lineHeight: 0.9,
                    letterSpacing: "-0.05em",
                    color: "#1a1816",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {featured.metricValue}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "rgba(26,24,22,0.55)",
                    letterSpacing: "0.01em",
                    marginTop: "0.6rem",
                  }}
                >
                  {featured.metricLabel}
                </p>
              </div>
              {/* View case study — underline draws in on hover */}
              <div
                className="hidden lg:flex items-center"
                style={{ marginTop: "2rem", gap: "0.75rem" }}
              >
                <span
                  className="relative inline-block"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#1a1816",
                  }}
                >
                  View case study
                  <span
                    className="absolute left-0 w-0 group-hover:w-full transition-all duration-500 ease-out"
                    style={{
                      bottom: -3,
                      height: 1,
                      backgroundColor: "#1a1816",
                    }}
                  />
                </span>
                <span
                  className="inline-block transition-transform duration-400 ease-out group-hover:translate-x-1"
                  style={{ fontSize: "0.95rem", color: "#1a1816", lineHeight: 1 }}
                >
                  →
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <blockquote
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(1.3rem, 1.85vw, 1.8rem)",
                  lineHeight: 1.4,
                  color: "#1a1816",
                  fontWeight: 500,
                  letterSpacing: "-0.012em",
                  marginBottom: "clamp(2rem, 3vw, 2.5rem)",
                  flex: 1,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    display: "block",
                    fontSize: "2em",
                    lineHeight: 0.6,
                    color: "rgba(26,24,22,0.22)",
                    marginBottom: "0.25rem",
                    fontWeight: 400,
                  }}
                >
                  &ldquo;
                </span>
                {featured.quote}
              </blockquote>

              <footer
                style={{
                  paddingTop: "clamp(1rem, 1.5vw, 1.25rem)",
                  borderTop: "1px solid rgba(26,24,22,0.12)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#1a1816",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {featured.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "rgba(26,24,22,0.5)",
                    marginTop: "0.2rem",
                  }}
                >
                  {featured.role} · {featured.company}
                </p>
              </footer>
            </div>
          </div>
        </TransitionLink>

        {/* Supporting cards — two dark cards below the featured */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(1.5rem, 2vw, 2.5rem)" }}
        >
          {supporting.map((t, idx) => (
            <TransitionLink
              key={t.slug}
              href={`/work/${t.slug}`}
              data-card
              className="testimonial-card group relative flex flex-col bg-[#141210] border border-[rgba(229,225,219,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[rgba(229,225,219,0.35)]"
              style={{
                borderRadius: "clamp(1.5rem, 2.25vw, 2.25rem)",
                padding: "clamp(2rem, 3vw, 3rem)",
                willChange: "transform",
              }}
            >
              {/* Top meta — index + launch date */}
              <div
                className="flex items-center justify-between"
                style={{ marginBottom: "clamp(1.75rem, 2.5vw, 2.25rem)" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.28em",
                    color: "rgba(229, 225, 219, 0.4)",
                  }}
                >
                  0{idx + 2} / 03
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    color: "rgba(229, 225, 219, 0.45)",
                  }}
                >
                  LAUNCHED {t.launched}
                </span>
              </div>

              {/* Metric pulled forward */}
              <div
                className="flex items-baseline"
                style={{ gap: "0.65rem", marginBottom: "clamp(1.5rem, 2.5vw, 2rem)" }}
              >
                <span
                  className="metric-value-counter"
                  data-metric={t.metricValue}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "clamp(2.25rem, 3.2vw, 3rem)",
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    color: "#e5e1db",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {t.metricValue}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    color: "rgba(229, 225, 219, 0.55)",
                  }}
                >
                  {t.metricLabel}
                </span>
              </div>

              {/* Quote */}
              <blockquote
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(1rem, 1.2vw, 1.2rem)",
                  lineHeight: 1.55,
                  color: "rgba(229, 225, 219, 0.88)",
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
                    fontSize: "2em",
                    lineHeight: 0.55,
                    color: "rgba(229, 225, 219, 0.3)",
                    marginBottom: "0.4rem",
                    fontWeight: 400,
                  }}
                >
                  &ldquo;
                </span>
                {t.quote}
              </blockquote>

              {/* Attribution + arrow (appears on hover) */}
              <footer
                className="flex items-end justify-between"
                style={{
                  paddingTop: "clamp(1rem, 1.5vw, 1.25rem)",
                  borderTop: "1px solid rgba(229, 225, 219, 0.08)",
                  gap: "1rem",
                }}
              >
                <div>
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
                </div>
                <span
                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400 ease-out"
                  style={{
                    fontSize: "0.95rem",
                    color: "#e5e1db",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  →
                </span>
              </footer>
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
