"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { TransitionLink } from "@/components/PageTransition";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  // Apple-cubic + a slightly sharper "snap" curve used for panel transitions.
  CustomEase.create("appleOut", "0.16, 1, 0.3, 1");
  CustomEase.create("appleSnap", "0.76, 0, 0.24, 1");
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// TODO: replace with real client quotes once collected.
type Testimonial = {
  num: string;
  metricPrefix: string;
  metricValue: number;
  metricSuffix: string;
  metricLabel: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  launched: string;
  slug: string;
};

const testimonials: Testimonial[] = [
  {
    num: "01",
    metricPrefix: "+",
    metricValue: 40,
    metricSuffix: "%",
    metricLabel: "Discovery flights",
    quote:
      "He nailed what we were trying to say about the flight school in the first round — new students started booking discovery flights through the site the week we launched.",
    name: "Michael Torres",
    role: "Owner",
    company: "Desert Wings",
    launched: "Q1 2026",
    slug: "desert-wings",
  },
  {
    num: "02",
    metricPrefix: "",
    metricValue: 2,
    metricSuffix: "×",
    metricLabel: "Booked calls",
    quote:
      "I'd been trying to describe my coaching for years. One conversation with Jake and the homepage read like it came out of my head. Conversions followed.",
    name: "Danny K.",
    role: "Founder",
    company: "Riled Up Coaching",
    launched: "Q4 2025",
    slug: "riled-up",
  },
  {
    num: "03",
    metricPrefix: "",
    metricValue: 6,
    metricSuffix: " wk",
    metricLabel: "Start to launch",
    quote:
      "Fast, opinionated, and he actually pushes back when something won't convert. That's rarer than it should be for someone shipping at this level.",
    name: "Sarah Lin",
    role: "Operations Lead",
    company: "Wings N Wheels",
    launched: "Q3 2025",
    slug: "wings-n-wheels",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const progressEl = progressRef.current;
    if (!section || !track) return;

    const panels = gsap.utils.toArray<HTMLElement>(track.querySelectorAll(".t-panel"));
    const panelCount = panels.length;
    // SplitText instances — we need to track these so we can .revert() on
    // cleanup, otherwise React re-reconciliation will crash when the DOM
    // SplitText mutated doesn't match what React is holding.
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      // Core horizontal-scroll pin. Vertical scroll translates the track by
      // (n-1) * 100% of its width while the section stays pinned to the top.
      // `end` is set so each panel gets roughly one viewport of scroll time.
      const horizontalTween = gsap.to(track, {
        xPercent: -100 * (panelCount - 1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${window.innerHeight * (panelCount - 1)}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Progress bar fill — scales with horizontal progress.
      if (progressEl) {
        const fill = progressEl.querySelector<HTMLElement>(".t-progress-fill");
        if (fill) {
          gsap.to(fill, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${window.innerHeight * (panelCount - 1)}`,
              scrub: 1,
            },
          });
        }
      }

      // Per-panel animations — driven by `containerAnimation: horizontalTween`
      // so they trigger on horizontal progress instead of vertical scroll.
      panels.forEach((panel, i) => {
        // ---- Quote: SplitText word stagger-in ----
        const quoteEl = panel.querySelector<HTMLElement>(".t-quote");
        if (quoteEl) {
          const split = new SplitText(quoteEl, {
            type: "lines,words",
            linesClass: "t-split-line",
            wordsClass: "t-split-word",
          });
          splits.push(split);
          gsap.set(split.words, { yPercent: 110, opacity: 0 });
          gsap.to(split.words, {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.025,
            ease: "appleOut",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalTween,
              start: "left 70%",
              end: "left 10%",
              scrub: 0.8,
            },
          });
        }

        // ---- Metric counter ----
        const metricValueEl = panel.querySelector<HTMLElement>(".t-metric-value");
        if (metricValueEl) {
          const t = testimonials[i];
          const counter = { n: 0 };
          metricValueEl.textContent = `${t.metricPrefix}0${t.metricSuffix}`;
          gsap.to(counter, {
            n: t.metricValue,
            duration: 1.4,
            ease: "appleOut",
            onUpdate: () => {
              metricValueEl.textContent = `${t.metricPrefix}${Math.round(counter.n)}${t.metricSuffix}`;
            },
            onComplete: () => {
              metricValueEl.textContent = `${t.metricPrefix}${t.metricValue}${t.metricSuffix}`;
            },
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalTween,
              start: "left 65%",
              end: "left 20%",
              scrub: 0.8,
            },
          });
        }

        // ---- Number (01/02/03) — slides from left + scales in ----
        const numEl = panel.querySelector<HTMLElement>(".t-num");
        if (numEl) {
          gsap.fromTo(
            numEl,
            { xPercent: -40, opacity: 0 },
            {
              xPercent: 0,
              opacity: 1,
              ease: "appleOut",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: "left 75%",
                end: "left 30%",
                scrub: 0.8,
              },
            }
          );
        }

        // ---- Attribution / CTA — fade + rise ----
        const footerEl = panel.querySelector<HTMLElement>(".t-footer");
        if (footerEl) {
          gsap.fromTo(
            footerEl,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: "appleOut",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: "left 55%",
                end: "left 15%",
                scrub: 0.8,
              },
            }
          );
        }

        // ---- Subtle bg image parallax within the panel ----
        const bgEl = panel.querySelector<HTMLElement>(".t-bg");
        if (bgEl) {
          gsap.fromTo(
            bgEl,
            { xPercent: 15, scale: 1.15 },
            {
              xPercent: -15,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
      });
    }, section);

    // Refresh after DOM settles (fonts, images) so trigger positions are correct.
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(refreshTimer);
      // Order matters: kill tweens first, then restore original DOM from the
      // SplitText mutations, so React's next reconciliation sees the text it
      // originally rendered.
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      data-bg="cream"
      className="relative overflow-hidden"
      style={{ height: "100vh", backgroundColor: "#f3f1ee" }}
    >
      {/* Fixed editorial overlay on top of every panel — section header, kept
          subtle so the panels are the main event. */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 md:px-14 lg:px-20"
        style={{ paddingTop: "clamp(6vh, 8vh, 9vh)" }}
      >
        <div className="flex items-baseline gap-6">
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.66rem",
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.5)",
            }}
          >
            [ Case notes ]
          </span>
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.66rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.3)",
            }}
          >
            0{testimonials.length} client outcomes
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.64rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.4)",
            }}
          >
            Scroll
          </span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: "rgba(26,24,22,0.5)", fontSize: "0.9rem", lineHeight: 1 }}
          >
            →
          </motion.span>
        </div>
      </div>

      {/* Horizontal track — 300vw wide, GSAP translates it via scroll-scrub */}
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${testimonials.length * 100}vw` }}
      >
        {testimonials.map((t, i) => (
          <article
            key={t.slug}
            className="t-panel relative shrink-0 flex items-center overflow-hidden"
            style={{ width: "100vw", height: "100vh" }}
          >
            {/* Subtle background wash — slightly different tint per panel */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  i === 0
                    ? "radial-gradient(ellipse at 70% 50%, rgba(26,24,22,0.05) 0%, transparent 60%)"
                    : i === 1
                    ? "radial-gradient(ellipse at 30% 40%, rgba(26,24,22,0.04) 0%, transparent 55%)"
                    : "radial-gradient(ellipse at 60% 60%, rgba(26,24,22,0.05) 0%, transparent 60%)",
              }}
            />

            {/* Ambient case-study imagery — very low opacity, parallaxed on pan */}
            <div
              className="t-bg absolute inset-y-0 right-0 pointer-events-none"
              style={{
                width: "62%",
                opacity: 0.08,
                backgroundImage: `url('${
                  t.slug === "desert-wings"
                    ? "/Celestial Laptop Mockup.webp"
                    : t.slug === "riled-up"
                    ? "/Celestial iPhone Mockup.webp"
                    : "/Rubber iPhone Mockup.webp"
                }')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                maskImage:
                  "linear-gradient(to left, rgba(0,0,0,1) 30%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to left, rgba(0,0,0,1) 30%, transparent 100%)",
              }}
            />

            {/* Content grid — asymmetric telemetry-style layout.
                Left column: big number + huge metric + label.
                Right column: quote + attribution + case link. */}
            <div
              className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-20 xl:gap-28 items-center w-full"
              style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding:
                  "clamp(16vh, 20vh, 22vh) clamp(2rem, 5vw, 5rem) clamp(8vh, 10vh, 12vh)",
              }}
            >
              {/* LEFT — metric telemetry */}
              <div className="relative">
                <div
                  className="t-num absolute"
                  style={{
                    top: "-2.5rem",
                    left: 0,
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "clamp(0.72rem, 0.85vw, 0.9rem)",
                    fontWeight: 700,
                    letterSpacing: "0.35em",
                    color: "rgba(26,24,22,0.35)",
                  }}
                >
                  ── {t.num} / 0{testimonials.length}
                </div>

                <div
                  className="t-metric-value"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "clamp(6rem, 14vw, 13rem)",
                    fontWeight: 900,
                    lineHeight: 0.85,
                    letterSpacing: "-0.06em",
                    color: "#1a1816",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {t.metricPrefix}
                  {t.metricValue}
                  {t.metricSuffix}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "clamp(0.92rem, 1.05vw, 1.1rem)",
                    fontWeight: 500,
                    color: "rgba(26,24,22,0.55)",
                    letterSpacing: "-0.005em",
                    marginTop: "clamp(1rem, 2vh, 1.5rem)",
                  }}
                >
                  {t.metricLabel}
                  <span style={{ color: "rgba(26,24,22,0.3)", marginLeft: "0.5rem" }}>
                    · Launched {t.launched}
                  </span>
                </p>
              </div>

              {/* RIGHT — quote + attribution */}
              <div className="flex flex-col justify-center" style={{ maxWidth: 640 }}>
                <blockquote
                  className="t-quote"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "clamp(1.25rem, 1.75vw, 1.85rem)",
                    fontWeight: 500,
                    lineHeight: 1.35,
                    letterSpacing: "-0.016em",
                    color: "#1a1816",
                    marginBottom: "clamp(2rem, 4vh, 3rem)",
                  }}
                >
                  {t.quote}
                </blockquote>

                <footer className="t-footer">
                  <div
                    className="flex items-center gap-4"
                    style={{
                      paddingTop: "1.25rem",
                      borderTop: "1px solid rgba(26,24,22,0.12)",
                    }}
                  >
                    <div className="flex-1">
                      <p
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "clamp(0.95rem, 1.05vw, 1.05rem)",
                          fontWeight: 700,
                          letterSpacing: "-0.005em",
                          color: "#1a1816",
                        }}
                      >
                        {t.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.82rem",
                          fontWeight: 500,
                          color: "rgba(26,24,22,0.5)",
                          marginTop: "0.15rem",
                        }}
                      >
                        {t.role} · {t.company}
                      </p>
                    </div>
                    <TransitionLink
                      href={`/work/${t.slug}`}
                      data-card
                      className="group inline-flex items-center gap-2 rounded-full border border-[rgba(26,24,22,0.18)] text-[#1a1816] bg-transparent transition-colors duration-300 hover:bg-[#1a1816] hover:text-[#f3f1ee] hover:border-[#1a1816]"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "0.7rem 1.25rem",
                      }}
                    >
                      <span>View case</span>
                      <span
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                        style={{ fontSize: "0.85rem", lineHeight: 1 }}
                      >
                        →
                      </span>
                    </TransitionLink>
                  </div>
                </footer>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Fixed progress bar overlay — scroll progress through the 3 panels */}
      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center px-8 md:px-14 lg:px-20"
        style={{ paddingBottom: "clamp(3vh, 5vh, 6vh)" }}
      >
        <div className="flex items-center gap-4 w-full max-w-[1400px] mx-auto">
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.64rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.4)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            01
          </span>
          <div
            className="relative flex-1 overflow-hidden"
            style={{
              height: 1,
              backgroundColor: "rgba(26,24,22,0.15)",
            }}
          >
            <div
              className="t-progress-fill absolute left-0 top-0 bottom-0 w-full origin-left"
              style={{ backgroundColor: "#1a1816", transform: "scaleX(0)" }}
            />
          </div>
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.64rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.4)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            0{testimonials.length}
          </span>
        </div>
      </div>
    </section>
  );
}
