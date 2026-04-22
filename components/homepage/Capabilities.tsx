"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import { prefersReducedMotion, tweenCounter } from "@/lib/microInteractions";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Cyan accent — the ONE color that pops against cream. Used sparingly.
const ACCENT = "#4cd3f5";
const ACCENT_SOFT = "rgba(76,211,245,0.18)";
const ACCENT_GLOW = "rgba(76,211,245,0.55)";

const CREAM = "#f3f1ee"; // matches ScrollBackground + Hero cream
const TEXT_DARK = "#1a1816";
const TAUPE = "#78736c";

/* ─────────────────────────────────────────────────────────────────────
   Topographic line background — subtle flowing curves, taupe @ low opacity.
   Runs the full height of the section as an absolute SVG layer.
   ───────────────────────────────────────────────────────────────────── */
function TopoBackground() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 1440 2400"
      style={{ opacity: 0.55 }}
    >
      <g fill="none" stroke={TAUPE} strokeWidth="1" opacity="0.18">
        <path d="M -100 200 Q 360 120 720 240 T 1540 180" />
        <path d="M -100 280 Q 380 200 720 320 T 1540 260" />
        <path d="M -100 360 Q 400 280 720 400 T 1540 340" />
        <path d="M -100 600 Q 360 540 720 660 T 1540 600" />
        <path d="M -100 680 Q 380 620 720 740 T 1540 680" />
        <path d="M -100 1000 Q 360 940 720 1060 T 1540 1000" />
        <path d="M -100 1080 Q 380 1020 720 1140 T 1540 1080" />
        <path d="M -100 1400 Q 360 1340 720 1460 T 1540 1400" />
        <path d="M -100 1480 Q 380 1420 720 1540 T 1540 1480" />
        <path d="M -100 1800 Q 360 1740 720 1860 T 1540 1800" />
        <path d="M -100 1880 Q 380 1820 720 1940 T 1540 1880" />
        <path d="M -100 2200 Q 360 2140 720 2260 T 1540 2200" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Magazine-style section header. Mirrors the Hero's kicker convention.
   ───────────────────────────────────────────────────────────────────── */
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const reduce = prefersReducedMotion();
    const splits: InstanceType<typeof SplitText>[] = [];

    const ctx = gsap.context(() => {
      const titleEl = ref.current!.querySelector<HTMLElement>(".cap-title");
      if (titleEl) {
        const split = SplitText.create(titleEl, { type: "words", mask: "words" });
        splits.push(split);
        gsap.set(split.words, { yPercent: 110 });
        gsap.to(split.words, {
          yPercent: 0,
          duration: reduce ? 0 : 0.9,
          stagger: 0.06,
          ease: "appleOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%" },
        });
      }
    }, ref);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={ref} className="relative max-w-[1280px] mx-auto px-6 md:px-10 pt-32 pb-16">
      {/* Magazine kicker row — same convention as Hero */}
      <div className="flex items-baseline justify-between mb-10">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: TAUPE }}
        >
          What I do
        </p>
        <p
          className="text-[10px] font-medium uppercase tracking-[0.28em]"
          style={{ color: "rgba(26,24,22,0.35)" }}
        >
          Vol. II · Capabilities
        </p>
      </div>
      <div className="h-px w-full mb-10" style={{ background: "rgba(26,24,22,0.12)" }} />

      {/* Title with serif italic accent on one word */}
      <h2
        className="cap-title font-black tracking-tight"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
          lineHeight: 0.95,
          color: TEXT_DARK,
          letterSpacing: "-0.04em",
        }}
      >
        Three things I{" "}
        <span
          style={{
            fontFamily: "var(--font-inter), serif",
            fontStyle: "italic",
            fontWeight: 900,
            color: ACCENT,
            letterSpacing: "-0.05em",
          }}
        >
          ship
        </span>{" "}
        for clients.
      </h2>

      <p
        className="mt-6 max-w-xl"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
          lineHeight: 1.55,
          color: "rgba(26,24,22,0.6)",
        }}
      >
        Each one solves a different problem. All three play together.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Floating metric chip — cyan-bordered pill that counts up on scroll-in.
   ───────────────────────────────────────────────────────────────────── */
function MetricChip({
  label,
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !valRef.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (reduce) {
            valRef.current!.textContent = value.toString();
          } else {
            tweenCounter(valRef.current!, value, { duration: 1.6 });
          }
        },
      });

      if (dotRef.current && !reduce) {
        gsap.to(dotRef.current, {
          opacity: 0.4,
          duration: 1.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }, ref);

    return () => ctx.revert();
  }, [value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={`inline-flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur ${className}`}
      style={{
        background: "rgba(255,255,255,0.65)",
        border: `1.5px solid ${ACCENT_SOFT}`,
        boxShadow: `0 8px 32px rgba(76,211,245,0.18), 0 2px 8px rgba(60,40,20,0.06)`,
      }}
    >
      <span
        ref={dotRef}
        className="inline-block rounded-full"
        style={{ width: 8, height: 8, background: ACCENT, boxShadow: `0 0 10px ${ACCENT_GLOW}` }}
      />
      <span className="flex items-baseline gap-1">
        <span
          className="font-black"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "1.5rem",
            color: TEXT_DARK,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {prefix}
          <span ref={valRef}>0</span>
          {suffix}
        </span>
        <span
          className="uppercase tracking-[0.18em]"
          style={{ fontSize: "0.65rem", fontWeight: 600, color: TAUPE }}
        >
          {label}
        </span>
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Chapter mark — huge italic numeral in cyan accent.
   ───────────────────────────────────────────────────────────────────── */
function ChapterMark({ num, className = "" }: { num: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none select-none ${className}`}
      style={{
        fontFamily: "var(--font-inter), serif",
        fontStyle: "italic",
        fontWeight: 900,
        fontSize: "clamp(8rem, 14vw, 13rem)",
        lineHeight: 0.85,
        letterSpacing: "-0.06em",
        color: ACCENT,
        textShadow: `0 0 60px rgba(76,211,245,0.25)`,
      }}
    >
      {num}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Chapter 01 — CONVERSION WEBSITES
   ───────────────────────────────────────────────────────────────────── */
function ChapterOne() {
  const ref = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !mockupRef.current) return;
    const reduce = prefersReducedMotion();
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Parallax + rotation as section scrolls past
      gsap.fromTo(
        mockupRef.current,
        { yPercent: 12, rotation: 6 },
        {
          yPercent: -10,
          rotation: -2,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );

      // Subtle perpetual breathing on the mockup
      gsap.to(mockupRef.current, {
        scale: 1.015,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Cursor that drifts on the mockup screen
      const cursor = ref.current!.querySelector<HTMLElement>(".ch1-cursor");
      if (cursor) {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(cursor, { x: 90, y: 50, duration: 2.5, ease: "sine.inOut" })
          .to(cursor, { x: 30, y: 90, duration: 2, ease: "sine.inOut" })
          .to(cursor, { x: 110, y: 30, duration: 2.2, ease: "sine.inOut" });
      }

      // Conversion bar chart bars draw upward when in view
      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ".ch1-bar",
            { scaleY: 0 },
            { scaleY: 1, duration: 1.2, stagger: 0.08, ease: "appleOut", transformOrigin: "bottom" },
          );
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start overflow-visible"
    >
      <div className="lg:col-span-5 relative z-10">
        <ChapterMark num="01" className="-ml-2 mb-2" />
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.32em] mb-4"
          style={{ color: TAUPE }}
        >
          Conversion Websites
        </p>
        <h3
          className="font-black tracking-tight mb-5"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            lineHeight: 1.05,
            color: TEXT_DARK,
            letterSpacing: "-0.03em",
          }}
        >
          Every scroll{" "}
          <span style={{ fontStyle: "italic", color: ACCENT, fontWeight: 900 }}>
            earns
          </span>{" "}
          its place.
        </h3>
        <p
          className="mb-7"
          style={{
            color: "rgba(26,24,22,0.7)",
            fontSize: "1.02rem",
            lineHeight: 1.6,
            maxWidth: 460,
          }}
        >
          Sites built with conversion architecture from the first wireframe.
          Every section has to defend its spot — or it gets cut.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {["Next.js", "Sanity CMS", "Tailwind", "Analytics"].map((t) => (
            <motion.span
              key={t}
              whileHover={{ y: -2, borderColor: ACCENT, color: ACCENT }}
              transition={{ duration: 0.2 }}
              className="text-xs font-medium px-3 py-1.5 rounded-full cursor-default"
              style={{ color: TEXT_DARK, border: "1px solid rgba(26,24,22,0.15)" }}
            >
              {t}
            </motion.span>
          ))}
        </div>

        <p className="text-xs" style={{ color: "rgba(26,24,22,0.45)" }}>
          Wireframe → design → launch in 4 weeks.
        </p>
      </div>

      {/* RIGHT — laptop mockup with overlay */}
      <div className="lg:col-span-7 relative min-h-[420px]">
        <div className="absolute top-2 right-0 z-30">
          <MetricChip prefix="+" value={40} suffix="%" label="Conversions" />
        </div>

        <div
          ref={mockupRef}
          className="relative will-change-transform"
          style={{ transformOrigin: "60% 60%" }}
        >
          <div className="relative" style={{ aspectRatio: "16/10", maxWidth: 700, marginLeft: "auto" }}>
            <Image
              src="/Celestial Laptop Mockup.webp"
              alt="Conversion-focused website mockup"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 90vw, 700px"
              priority={false}
            />

            <div
              className="absolute pointer-events-none"
              style={{
                left: "13%",
                top: "10%",
                width: "74%",
                height: "63%",
              }}
            >
              <div
                className="ch1-cursor absolute"
                style={{ left: 30, top: 30, width: 16, height: 16 }}
              >
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    d="M2 2 L2 12 L5 9 L7 13 L9 12 L7 8 L11 8 Z"
                    fill={ACCENT}
                    stroke={TEXT_DARK}
                    strokeWidth="0.6"
                  />
                </svg>
              </div>

              <div
                className="absolute"
                style={{
                  right: "8%",
                  bottom: "8%",
                  width: 110,
                  height: 60,
                  background: "rgba(255,255,255,0.92)",
                  borderRadius: 6,
                  border: `1px solid ${ACCENT_SOFT}`,
                  padding: 6,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 3,
                  boxShadow: `0 6px 18px rgba(60,40,20,0.12)`,
                }}
              >
                {[28, 42, 36, 58, 50, 72, 88].map((h, i) => (
                  <div
                    key={i}
                    className="ch1-bar flex-1"
                    style={{
                      height: `${h}%`,
                      background: i === 6 ? ACCENT : "rgba(26,24,22,0.5)",
                      borderRadius: 1,
                    }}
                  />
                ))}
              </div>

              <div
                className="absolute"
                style={{
                  left: 0,
                  top: 0,
                  fontSize: 8,
                  fontFamily: "var(--font-inter)",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: ACCENT,
                  background: "rgba(255,255,255,0.92)",
                  padding: "3px 6px",
                  borderRadius: 3,
                  border: `1px solid ${ACCENT_SOFT}`,
                }}
              >
                Live · /home
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Chapter 02 — AI AUTOMATIONS
   ───────────────────────────────────────────────────────────────────── */
function ChapterTwo() {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const reduce = prefersReducedMotion();
    if (reduce) return;

    const ctx = gsap.context(() => {
      const packets = ref.current!.querySelectorAll<SVGCircleElement>(".ch2-packet");
      packets.forEach((p, i) => {
        gsap.to(p, {
          motionPath: {
            path: "#ch2-flow-path",
            align: "#ch2-flow-path",
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
          duration: 4,
          ease: "none",
          repeat: -1,
          delay: i * 1.0,
        });
      });

      const nodes = ref.current!.querySelectorAll<SVGCircleElement>(".ch2-node-glow");
      nodes.forEach((n, i) => {
        gsap.to(n, {
          attr: { r: 22 },
          opacity: 0.18,
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.6,
        });
      });

      const uses = ref.current!.querySelectorAll<HTMLElement>(".ch2-use");
      const tl = gsap.timeline({ repeat: -1 });
      uses.forEach((el) => {
        tl.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "appleOut" })
          .to(el, { opacity: 0, y: -10, duration: 0.5, delay: 1.8, ease: "appleOut" });
      });

      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.pause(),
        onLeaveBack: () => tl.pause(),
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center overflow-visible"
    >
      <div className="lg:col-span-5 lg:col-start-1 relative z-10 order-2 lg:order-1">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.32em] mb-4"
          style={{ color: TAUPE }}
        >
          AI Automations
        </p>
        <h3
          className="font-black tracking-tight mb-5"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            lineHeight: 1.05,
            color: TEXT_DARK,
            letterSpacing: "-0.03em",
          }}
        >
          Back-office that{" "}
          <span style={{ fontStyle: "italic", color: ACCENT, fontWeight: 900 }}>
            runs
          </span>{" "}
          on its own.
        </h3>

        <div className="relative mb-7" style={{ height: 32 }}>
          {["Inbox triage", "Lead routing", "Content pipelines", "CRM sync"].map((u, i) => (
            <p
              key={u}
              className="ch2-use absolute top-0 left-0"
              style={{
                opacity: i === 0 ? 1 : 0,
                fontSize: "1.02rem",
                color: TEXT_DARK,
                fontWeight: 600,
              }}
            >
              <span style={{ color: ACCENT, marginRight: 8 }}>→</span>
              {u}
            </p>
          ))}
        </div>

        <p
          className="mb-7"
          style={{
            color: "rgba(26,24,22,0.7)",
            fontSize: "1.02rem",
            lineHeight: 1.6,
            maxWidth: 460,
          }}
        >
          Workflows that do the 10 small things you keep forgetting. Built once, runs forever.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {["n8n", "OpenAI", "Slack", "Webhooks"].map((t) => (
            <motion.span
              key={t}
              whileHover={{ y: -2, borderColor: ACCENT, color: ACCENT }}
              transition={{ duration: 0.2 }}
              className="text-xs font-medium px-3 py-1.5 rounded-full cursor-default"
              style={{ color: TEXT_DARK, border: "1px solid rgba(26,24,22,0.15)" }}
            >
              {t}
            </motion.span>
          ))}
        </div>

        <p className="text-xs" style={{ color: "rgba(26,24,22,0.45)" }}>
          Replaces ~8 hrs/week of admin.
        </p>
      </div>

      <div className="lg:col-span-7 relative order-1 lg:order-2">
        <ChapterMark num="02" className="-mb-16 lg:-mb-20 -mr-2 text-right" />

        <div className="relative">
          <div className="absolute -top-2 left-0 z-30">
            <MetricChip value={8} suffix=" hrs" label="Saved / wk" />
          </div>

          <svg
            viewBox="0 0 600 360"
            className="w-full h-auto"
            style={{ filter: `drop-shadow(0 8px 32px rgba(60,40,20,0.06))` }}
          >
            <path
              id="ch2-flow-path"
              d="M 80 180 Q 200 80 320 180 T 540 180"
              fill="none"
              stroke={TAUPE}
              strokeWidth="1.5"
              strokeDasharray="4 6"
              opacity="0.5"
            />

            <circle className="ch2-node-glow" cx="80" cy="180" r="14" fill={ACCENT} opacity="0.35" />
            <circle className="ch2-node-glow" cx="320" cy="180" r="14" fill={ACCENT} opacity="0.35" />
            <circle className="ch2-node-glow" cx="540" cy="180" r="14" fill={ACCENT} opacity="0.35" />

            <circle cx="80" cy="180" r="18" fill={TEXT_DARK} />
            <circle cx="320" cy="180" r="18" fill={TEXT_DARK} />
            <circle cx="540" cy="180" r="18" fill={TEXT_DARK} />

            <circle cx="80" cy="180" r="5" fill={ACCENT} />
            <circle cx="320" cy="180" r="5" fill={ACCENT} />
            <circle cx="540" cy="180" r="5" fill={ACCENT} />

            <text x="80" y="225" textAnchor="middle" fontSize="11" fontWeight="700" fill={TEXT_DARK} fontFamily="Inter, sans-serif" letterSpacing="0.1em">INBOX</text>
            <text x="320" y="225" textAnchor="middle" fontSize="11" fontWeight="700" fill={TEXT_DARK} fontFamily="Inter, sans-serif" letterSpacing="0.1em">CLASSIFY</text>
            <text x="540" y="225" textAnchor="middle" fontSize="11" fontWeight="700" fill={TEXT_DARK} fontFamily="Inter, sans-serif" letterSpacing="0.1em">SLACK + CRM</text>

            <text x="80" y="244" textAnchor="middle" fontSize="9" fill={TAUPE} fontFamily="Inter, sans-serif">trigger</text>
            <text x="320" y="244" textAnchor="middle" fontSize="9" fill={TAUPE} fontFamily="Inter, sans-serif">openai · gpt-5</text>
            <text x="540" y="244" textAnchor="middle" fontSize="9" fill={TAUPE} fontFamily="Inter, sans-serif">webhook</text>

            <circle className="ch2-packet" cx="0" cy="0" r="6" fill={ACCENT}>
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle className="ch2-packet" cx="0" cy="0" r="5" fill={ACCENT} opacity="0.7" />
            <circle className="ch2-packet" cx="0" cy="0" r="4" fill={ACCENT} opacity="0.5" />
            <circle className="ch2-packet" cx="0" cy="0" r="3" fill={ACCENT} opacity="0.35" />
          </svg>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 bottom-2 backdrop-blur"
            style={{
              background: "rgba(255,255,255,0.65)",
              border: `1px solid ${ACCENT_SOFT}`,
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 11,
              fontFamily: "var(--font-inter)",
              color: TEXT_DARK,
              boxShadow: "0 6px 20px rgba(60,40,20,0.06)",
              maxWidth: 200,
            }}
          >
            <p style={{ color: TAUPE, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>
              Last run
            </p>
            <p style={{ fontWeight: 700, fontSize: 12 }}>
              <span style={{ color: ACCENT }}>● </span>132 emails · 3.2s avg
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Chapter 03 — CUSTOM SOFTWARE
   ───────────────────────────────────────────────────────────────────── */
function ChapterThree() {
  const ref = useRef<HTMLElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const lcpRef = useRef<HTMLSpanElement>(null);
  const usersRef = useRef<HTMLSpanElement>(null);
  const uptimeRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top 70%",
        once: true,
        onEnter: () => {
          if (reduce) {
            if (scoreRef.current) scoreRef.current.textContent = "98";
            if (lcpRef.current) lcpRef.current.textContent = "1.2";
            if (usersRef.current) usersRef.current.textContent = "847";
            if (uptimeRef.current) uptimeRef.current.textContent = "99.9";
            if (ringRef.current) gsap.set(ringRef.current, { drawSVG: "0 98%" });
            return;
          }

          if (ringRef.current) {
            gsap.set(ringRef.current, { drawSVG: "0% 0%" });
            gsap.fromTo(
              ringRef.current,
              { drawSVG: "0 0%" },
              { drawSVG: "0 98%", duration: 1.6, ease: "appleOut" },
            );
          }
          if (scoreRef.current) tweenCounter(scoreRef.current, 98, { duration: 1.6 });
          if (lcpRef.current) tweenCounter(lcpRef.current, 1.2, { duration: 1.4, format: (n) => n.toFixed(1) });
          if (usersRef.current) tweenCounter(usersRef.current, 847, { duration: 1.6 });
          if (uptimeRef.current) tweenCounter(uptimeRef.current, 99.9, { duration: 1.6, format: (n) => n.toFixed(1) });

          gsap.fromTo(
            ".ch3-bar",
            { scaleY: 0 },
            { scaleY: 1, duration: 1, stagger: 0.05, ease: "appleOut", transformOrigin: "bottom" },
          );
        },
      });

      const dash = ref.current!.querySelector<HTMLElement>(".ch3-dashboard");
      if (dash && !reduce) {
        gsap.fromTo(
          dash,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "appleOut",
            scrollTrigger: { trigger: ref.current!, start: "top 75%" },
          },
        );
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-24 md:py-32 overflow-visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
        <div className="lg:col-span-5">
          <ChapterMark num="03" className="-ml-2 mb-2" />
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.32em] mb-4"
            style={{ color: TAUPE }}
          >
            Custom Software
          </p>
          <h3
            className="font-black tracking-tight mb-5"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              lineHeight: 1.05,
              color: TEXT_DARK,
              letterSpacing: "-0.03em",
            }}
          >
            One system{" "}
            <span style={{ fontStyle: "italic", color: ACCENT, fontWeight: 900 }}>
              instead
            </span>{" "}
            of twelve tabs.
          </h3>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p
            className="mb-6"
            style={{
              color: "rgba(26,24,22,0.7)",
              fontSize: "1.02rem",
              lineHeight: 1.6,
              maxWidth: 460,
            }}
          >
            Internal tools and dashboards shaped to your operation. One login,
            one schema, one place your team actually looks.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {["Next.js", "Supabase", "Role-based auth", "Owned by you"].map((t) => (
              <motion.span
                key={t}
                whileHover={{ y: -2, borderColor: ACCENT, color: ACCENT }}
                transition={{ duration: 0.2 }}
                className="text-xs font-medium px-3 py-1.5 rounded-full cursor-default"
                style={{ color: TEXT_DARK, border: "1px solid rgba(26,24,22,0.15)" }}
              >
                {t}
              </motion.span>
            ))}
          </div>
          <p className="text-xs" style={{ color: "rgba(26,24,22,0.45)" }}>
            Purpose-built, not SaaS-bent.
          </p>
        </div>
      </div>

      <div className="ch3-dashboard relative">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(26,24,22,0.08)",
            boxShadow: `0 32px 80px rgba(60,40,20,0.12), 0 0 0 1px rgba(76,211,245,0.08)`,
            padding: "32px 28px",
          }}
        >
          <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(26,24,22,0.08)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "rgba(26,24,22,0.15)" }} />
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "rgba(26,24,22,0.15)" }} />
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "rgba(26,24,22,0.15)" }} />
            <span className="ml-4 text-[10px] uppercase tracking-[0.2em]" style={{ color: TAUPE, fontWeight: 600 }}>
              dashboard.client.com / overview
            </span>
            <span className="ml-auto inline-flex items-center gap-2 text-[10px]" style={{ color: TAUPE }}>
              <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: ACCENT, boxShadow: `0 0 6px ${ACCENT_GLOW}` }} />
              Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-3 flex flex-col items-center">
              <div className="relative" style={{ width: 140, height: 140 }}>
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(26,24,22,0.08)" strokeWidth="6" />
                  <circle
                    ref={ringRef}
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="6"
                    strokeLinecap="round"
                    pathLength="100"
                    style={{ filter: `drop-shadow(0 0 8px ${ACCENT_GLOW})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span ref={scoreRef} className="font-black" style={{ fontFamily: "var(--font-inter)", fontSize: "2.5rem", color: TEXT_DARK, lineHeight: 1, letterSpacing: "-0.04em" }}>0</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: TAUPE, fontWeight: 600 }}>Performance</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 grid grid-cols-3 gap-3">
              {[
                { label: "LCP", refEl: lcpRef, suffix: "s", accent: false },
                { label: "Active users", refEl: usersRef, suffix: "", accent: true },
                { label: "Uptime", refEl: uptimeRef, suffix: "%", accent: false },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-lg p-3"
                  style={{
                    background: m.accent ? ACCENT_SOFT : "rgba(255,255,255,0.6)",
                    border: m.accent ? `1px solid ${ACCENT}` : "1px solid rgba(26,24,22,0.06)",
                  }}
                >
                  <p className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: m.accent ? TEXT_DARK : TAUPE, fontWeight: 600 }}>
                    {m.label}
                  </p>
                  <p className="font-black" style={{ fontFamily: "var(--font-inter)", fontSize: "1.5rem", color: TEXT_DARK, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    <span ref={m.refEl}>0</span>
                    <span style={{ fontSize: "0.75rem", color: TAUPE, marginLeft: 2, fontWeight: 600 }}>{m.suffix}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="md:col-span-4">
              <p className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: TAUPE, fontWeight: 600 }}>
                Last 14 days
              </p>
              <div className="flex items-end gap-1.5" style={{ height: 90 }}>
                {[42, 58, 36, 64, 72, 50, 68, 78, 60, 74, 88, 76, 92, 84].map((h, i) => (
                  <div
                    key={i}
                    className="ch3-bar flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: i >= 11 ? ACCENT : "rgba(26,24,22,0.55)",
                      boxShadow: i >= 11 ? `0 0 8px ${ACCENT_GLOW}` : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   ScrollSpine — vertical cyan line on the left edge of Capabilities that
   draws progressively as you scroll. Has 3 marker dots, one per chapter,
   that light up + glow when their chapter enters the viewport. A small
   "traveler" dot rides the line at the current scroll position.

   Hides on mobile (< md) to avoid eating layout space.
   ───────────────────────────────────────────────────────────────────── */
function ScrollSpine() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!wrapRef.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Line draws via drawSVG, scrub-linked to scroll position over the section
      if (lineRef.current) {
        const section = wrapRef.current!.closest("section")!;
        gsap.fromTo(
          lineRef.current,
          { drawSVG: "0% 0%" },
          {
            drawSVG: "0% 100%",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 80%",
              scrub: 1,
            },
          },
        );
      }

      // Traveler dot rides the line based on scroll progress
      if (travelerRef.current && !reduce) {
        const section = wrapRef.current!.closest("section")!;
        gsap.to(travelerRef.current, {
          top: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 80%",
            scrub: 1,
          },
        });

        // Soft pulse on the traveler
        gsap.to(travelerRef.current, {
          scale: 1.4,
          duration: 1.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Each marker lights up when its chapter enters
      ["chapter-1", "chapter-2", "chapter-3"].forEach((id) => {
        const marker = wrapRef.current!.querySelector<HTMLElement>(`[data-marker="${id}"]`);
        if (!marker) return;
        ScrollTrigger.create({
          trigger: `[data-chapter="${id}"]`,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => marker.classList.add("active"),
          onEnterBack: () => marker.classList.add("active"),
          onLeave: () => marker.classList.remove("active"),
          onLeaveBack: () => marker.classList.remove("active"),
        });
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="hidden md:block absolute left-6 lg:left-10 top-0 h-full pointer-events-none z-20"
      style={{ width: 24 }}
      aria-hidden
    >
      {/* Vertical line via SVG (drawSVG-able) */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 1 100"
      >
        <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="rgba(26,24,22,0.08)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line
          ref={lineRef}
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100"
          stroke={ACCENT}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          style={{ filter: `drop-shadow(0 0 4px ${ACCENT_GLOW})` }}
        />
      </svg>

      {/* Chapter markers — three dots positioned at 25/55/85 percent of the spine height */}
      {[
        { id: "chapter-1", top: "18%", label: "01" },
        { id: "chapter-2", top: "48%", label: "02" },
        { id: "chapter-3", top: "78%", label: "03" },
      ].map((m) => (
        <div
          key={m.id}
          data-marker={m.id}
          className="cap-marker absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
          style={{ top: m.top }}
        >
          <span
            className="block rounded-full transition-all duration-500"
            style={{
              width: 10,
              height: 10,
              background: TAUPE,
              opacity: 0.4,
            }}
          />
          <span
            className="cap-marker-label text-[9px] uppercase tracking-[0.25em] font-bold transition-all duration-500"
            style={{ color: TAUPE, opacity: 0.5, transform: "translateX(-4px)" }}
          >
            {m.label}
          </span>
        </div>
      ))}

      {/* Traveler dot — rides the line at the current scroll position */}
      <div
        ref={travelerRef}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          top: "0%",
          width: 8,
          height: 8,
          background: ACCENT,
          boxShadow: `0 0 12px ${ACCENT_GLOW}, 0 0 24px ${ACCENT_GLOW}`,
        }}
      />

      {/* Active marker styles via inline <style> */}
      <style jsx>{`
        :global([data-marker].active span:first-child) {
          background: ${ACCENT} !important;
          opacity: 1 !important;
          box-shadow: 0 0 10px ${ACCENT_GLOW};
          transform: scale(1.3);
        }
        :global([data-marker].active .cap-marker-label) {
          color: ${ACCENT} !important;
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   BridgeMoment — sits at the very top of Capabilities. A short cinematic
   "drop point" that signals the transition from the Hero. A vertical
   cyan line draws downward as you scroll out of the Hero, with a small
   pulsing dot, a "II" volume marker, and "BEGIN CHAPTER ONE" copy.
   ───────────────────────────────────────────────────────────────────── */
function BridgeMoment() {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Line draws based on scroll into the bridge
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { drawSVG: "0% 0%" },
          {
            drawSVG: "0% 100%",
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom 60%",
              scrub: 1,
            },
          },
        );
      }

      // Label fades in then floats slightly
      if (labelRef.current && !reduce) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "appleOut",
            scrollTrigger: { trigger: ref.current, start: "top 70%" },
          },
        );
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full flex flex-col items-center pt-20 pb-16"
      aria-hidden
    >
      {/* Vertical line (drawSVG) */}
      <svg
        className="overflow-visible"
        width="2"
        height="120"
        viewBox="0 0 2 120"
      >
        <line x1="1" y1="0" x2="1" y2="120" stroke="rgba(26,24,22,0.08)" strokeWidth="1" />
        <line
          ref={lineRef}
          x1="1"
          y1="0"
          x2="1"
          y2="120"
          stroke={ACCENT}
          strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 0 4px ${ACCENT_GLOW})` }}
        />
      </svg>

      {/* Pulsing terminus dot */}
      <motion.span
        className="block rounded-full -mt-1"
        style={{
          width: 10,
          height: 10,
          background: ACCENT,
          boxShadow: `0 0 14px ${ACCENT_GLOW}, 0 0 28px ${ACCENT_GLOW}`,
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Volume + label */}
      <div ref={labelRef} className="mt-6 text-center">
        <p
          className="text-[10px] uppercase tracking-[0.32em] mb-2"
          style={{ color: TAUPE, fontWeight: 600 }}
        >
          Vol. II
        </p>
        <p
          className="text-[10px] uppercase tracking-[0.4em]"
          style={{ color: ACCENT, fontWeight: 700 }}
        >
          ⟶ Begin Chapter One
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Main export — header + 3 chapters with shared topographic bg, scroll
   spine, and bridge moment. data-bg="cream" tells ScrollBackground to
   keep the page bg cream throughout the section (no flash to dark).
   ───────────────────────────────────────────────────────────────────── */
export default function Capabilities() {
  return (
    <section
      id="capabilities"
      data-bg="cream"
      className="relative overflow-hidden"
      style={{ background: CREAM }}
    >
      <TopoBackground />
      <ScrollSpine />
      <div className="relative z-10">
        <BridgeMoment />
        <SectionHeader />
        <div data-chapter="chapter-1">
          <ChapterOne />
        </div>
        <div data-chapter="chapter-2">
          <ChapterTwo />
        </div>
        <div data-chapter="chapter-3">
          <ChapterThree />
        </div>
      </div>
    </section>
  );
}
