"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "./ui/MagneticButton";
import HoverText from "./ui/HoverText";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { ease } from "@/lib/motion";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const handwritingRef = useRef<HTMLSpanElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);

  // Live session timer — ticks every second from page load. Shows in the
  // status card corner. Part of the manifest-theme vocabulary.
  const [sessionSeconds, setSessionSeconds] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Entrance choreography + scroll-out
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    const subject = subjectRef.current;
    const handwriting = handwritingRef.current;
    const corners = cornersRef.current;
    if (!section || !wordmark || !subject || !handwriting || !corners) return;

    const ctx = gsap.context(() => {
      // Wordmark — SHIP. letters cascade up from below
      const wmSplit = SplitText.create(wordmark, {
        type: "chars",
        mask: "chars",
      });
      gsap.from(wmSplit.chars, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.06,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.2,
        onComplete: () => wmSplit.revert(),
      });

      // Floating subject — drops in from above with a small tilt-to-settle
      gsap.from(subject, {
        y: -60,
        opacity: 0,
        scale: 0.94,
        rotateZ: -3,
        duration: 1.3,
        ease: "expo.out",
        delay: 0.55,
      });

      // Handwritten flourish — per-char reveal with marker jitter
      const hwSplit = SplitText.create(handwriting, { type: "chars" });
      gsap.from(hwSplit.chars, {
        opacity: 0,
        yPercent: 60,
        rotationZ: "random(-12, 12)",
        duration: 0.55,
        stagger: 0.035,
        ease: "power2.out",
        delay: 1.05,
        onComplete: () => hwSplit.revert(),
      });

      // Corner metadata — stagger-up
      gsap.from(corners.querySelectorAll<HTMLElement>("[data-corner]"), {
        y: 18,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "expo.out",
        delay: 1.25,
      });

      // ─── Scroll-out choreography ───────────────────────────────────────
      // Handwriting fades first (flourish leaves), then subject drifts up,
      // then wordmark fades. Corners stay the longest.
      gsap.to(handwriting, {
        opacity: 0,
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });

      gsap.to(subject, {
        y: -100,
        opacity: 0,
        scale: 0.86,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "55% top",
          scrub: true,
        },
      });

      gsap.to(wordmark, {
        scale: 0.96,
        opacity: 0,
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "10% top",
          end: "70% top",
          scrub: true,
        },
      });

      gsap.to(corners.querySelectorAll<HTMLElement>("[data-corner]"), {
        opacity: 0,
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "25% top",
          end: "70% top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="paper"
      data-nav-num="01"
      data-nav-name="HERO"
      className="relative overflow-hidden"
      style={{
        background: "var(--paper)",
        minHeight: "100vh",
      }}
    >
      {/* Soft radial glow behind the subject — atmospheric depth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 42% at 50% 55%, rgba(122,30,39,0.11) 0%, rgba(122,30,39,0.03) 45%, transparent 75%)",
        }}
      />

      {/* Subtle grain overlay — adds tactility to the paper field */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0 bg-noise opacity-[0.35]"
      />

      {/* Backdrop wordmark — SHIP. */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <h1
          ref={wordmarkRef}
          aria-label="Ship, don't slide"
          className="font-display font-black select-none"
          style={{
            fontSize: "clamp(12rem, 32vw, 36rem)",
            letterSpacing: "-0.06em",
            color: "var(--ink)",
            lineHeight: 0.85,
          }}
        >
          SHIP.
        </h1>
      </div>

      {/* Floating subject — Desert Wings laptop */}
      <motion.div
        ref={subjectRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="relative"
          style={{
            width: "min(58vw, 820px)",
            aspectRatio: "16 / 10",
            filter:
              "drop-shadow(0 40px 60px rgba(26,24,22,0.22)) drop-shadow(0 80px 120px rgba(122,30,39,0.12))",
          }}
        >
          <Image
            src="/Celestial Laptop Mockup.webp"
            alt="Desert Wings Flight School website"
            fill
            priority
            sizes="(max-width: 768px) 90vw, 58vw"
            className="object-contain"
          />
        </div>
      </motion.div>

      {/* Handwritten overlay — "don't slide." */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none z-30"
        style={{ paddingBottom: "18%" }}
      >
        <span
          ref={handwritingRef}
          aria-hidden
          className="select-none"
          style={{
            fontFamily: "var(--font-caveat), cursive",
            color: "var(--oxblood)",
            fontSize: "clamp(2.75rem, 7vw, 6rem)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1,
            transform: "rotate(-5deg)",
            textShadow: "0 2px 20px rgba(122,30,39,0.22)",
          }}
        >
          don&apos;t slide.
        </span>
      </div>

      {/* Corner UI layer */}
      <div
        ref={cornersRef}
        className="absolute inset-0 z-40 pointer-events-none"
      >
        {/* Top-left — manifest stamp */}
        <div
          data-corner
          className="absolute left-6 md:left-12 lg:left-20"
          style={{ top: "clamp(6rem, 10vh, 8rem)" }}
        >
          <div
            className="font-mono uppercase"
            style={{
              color: "var(--taupe)",
              fontSize: "10px",
              letterSpacing: "0.22em",
            }}
          >
            <span style={{ color: "var(--oxblood)" }}>●</span>{" "}
            01 · Hero · SKU EAS/2026/Q2 · In Transit
          </div>
        </div>

        {/* Bottom-left — body copy + CTA */}
        <div
          data-corner
          className="absolute left-6 md:left-12 lg:left-20"
          style={{ bottom: "clamp(1.75rem, 5vh, 3.5rem)" }}
        >
          <p
            className="font-display"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(14px, 1.1vw, 16px)",
              lineHeight: 1.55,
              maxWidth: "30ch",
              marginBottom: "1.25rem",
              opacity: 0.78,
            }}
          >
            A design-engineering studio shipping work that runs — not pretty
            brochures, not theatrical demos.
          </p>
          <div className="pointer-events-auto">
            <StartProjectCTA />
          </div>
        </div>

        {/* Bottom-right — status card */}
        <div
          data-corner
          className="absolute right-6 md:right-12 lg:right-20 pointer-events-auto"
          style={{ bottom: "clamp(1.75rem, 5vh, 3.5rem)" }}
        >
          <StatusCard sessionSeconds={sessionSeconds} />
        </div>
      </div>
    </section>
  );
}

// ─── Start a project CTA ─────────────────────────────────────────────────────
function StartProjectCTA() {
  const [hovered, setHovered] = useState(false);
  return (
    <MagneticButton as="link" href="/contact" strength={12} childStrength={5}>
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative inline-flex items-center gap-2 h-11 pl-5 pr-2 rounded-full press focus-ring"
        style={{ background: "var(--ink)", color: "var(--paper)" }}
      >
        <HoverText
          text="Start a project"
          trigger={hovered}
          className="text-[13px] font-medium tracking-tight"
        />
        <span
          className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
          style={{ background: "var(--paper)", color: "var(--ink)" }}
        >
          <motion.span
            animate={{ x: hovered ? 20 : 0, opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.35, ease: ease.expoOut }}
            className="absolute"
          >
            <Arrow />
          </motion.span>
          <motion.span
            animate={{ x: hovered ? 0 : -20, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35, ease: ease.expoOut }}
            className="absolute"
          >
            <Arrow />
          </motion.span>
        </span>
      </span>
    </MagneticButton>
  );
}

// ─── Status card (bottom-right) ──────────────────────────────────────────────
function StatusCard({ sessionSeconds }: { sessionSeconds: number }) {
  const mins = Math.floor(sessionSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (sessionSeconds % 60).toString().padStart(2, "0");

  return (
    <div
      className="relative rounded-[16px] px-5 py-4 overflow-hidden"
      style={{
        background: "rgba(243,241,238,0.88)",
        border: "1px solid rgba(26,24,22,0.1)",
        boxShadow:
          "0 24px 64px -24px rgba(122,30,39,0.28), 0 4px 12px -4px rgba(26,24,22,0.08)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        minWidth: "240px",
      }}
    >
      {/* Soft oxblood halo — echoes the reference's purple accent */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(122,30,39,0.28) 0%, transparent 65%)",
        }}
      />

      <div className="relative flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span
            className="pulse-dot w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--oxblood)", color: "var(--oxblood)" }}
          />
          <span
            className="font-mono uppercase font-bold"
            style={{
              color: "var(--oxblood)",
              fontSize: "10px",
              letterSpacing: "0.2em",
            }}
          >
            Q3 · 2 slots left
          </span>
        </div>

        <div
          className="font-display font-bold"
          style={{
            color: "var(--ink)",
            fontSize: "1.05rem",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          Next opening: June 4
        </div>

        <div className="flex items-center gap-3 mt-1.5">
          <span
            className="font-mono tabular-nums"
            style={{
              color: "var(--taupe)",
              fontSize: "11px",
              letterSpacing: "0.08em",
            }}
          >
            {mins}:{secs}
          </span>
          <span
            className="font-mono uppercase"
            style={{
              color: "var(--taupe)",
              fontSize: "9px",
              letterSpacing: "0.22em",
              opacity: 0.55,
            }}
          >
            Session
          </span>
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}
