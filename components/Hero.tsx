"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MagneticButton from "./ui/MagneticButton";
import HoverText from "./ui/HoverText";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { computeFanPositions } from "@/lib/motion/primitives";
import { ease } from "@/lib/motion";
import { projects } from "@/lib/data";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Featured projects for the fan — 4 cards radiating out from the showreel.
// Matches the bento order so the hero fan reads as a preview of the rest.
const FAN_PROJECTS = projects.slice(0, 4);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);
  const handwritingRef = useRef<HTMLSpanElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);

  // Live session timer — ticks every second from page load.
  const [sessionSeconds, setSessionSeconds] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Entrance choreography + scroll-out + fan-out
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const wordmark = wordmarkRef.current;
    const subject = subjectRef.current;
    const handwriting = handwritingRef.current;
    const corners = cornersRef.current;
    const fan = fanRef.current;
    if (!section || !wordmark || !subject || !handwriting || !corners || !fan)
      return;

    const ctx = gsap.context(() => {
      // ─── Entrance ──────────────────────────────────────────────────────
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

      gsap.from(subject, {
        y: -60,
        opacity: 0,
        scale: 0.94,
        rotateZ: -3,
        duration: 1.3,
        ease: "expo.out",
        delay: 0.55,
      });

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

      gsap.from(corners.querySelectorAll<HTMLElement>("[data-corner]"), {
        y: 18,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "expo.out",
        delay: 1.25,
      });

      // ─── Fan — initial state (stacked behind the showreel) ─────────────
      const fanCards = gsap.utils.toArray<HTMLElement>(
        fan.querySelectorAll("[data-fan-card]")
      );
      const fanPositions = computeFanPositions({
        count: fanCards.length,
        spread: 26, // ±13° rotation
        depth: 80, // outer cards recede 80px
        radius: 460, // outer cards sit ±460px from center
        tiltY: 6, // slight inward tilt toward viewer
      });
      fanCards.forEach((card) => {
        gsap.set(card, {
          x: 0,
          y: 0,
          z: 0,
          rotation: 0,
          rotationY: 0,
          opacity: 0,
          scale: 0.9,
          transformOrigin: "center center",
        });
      });

      // ─── Scroll-out choreography ───────────────────────────────────────
      // Handwriting peels off first (20vh of scroll).
      gsap.to(handwriting, {
        opacity: 0,
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "18% top",
          scrub: true,
        },
      });

      // Fan emerges between 10–50% of the section's scroll. Cards deal out
      // to their fanned positions in a staircase stagger.
      const fanTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "55% top",
          scrub: 0.6,
        },
      });
      fanCards.forEach((card, i) => {
        fanTl.to(
          card,
          {
            x: fanPositions[i].x,
            y: fanPositions[i].y,
            z: fanPositions[i].z,
            rotation: fanPositions[i].rotation,
            rotationY: fanPositions[i].rotationY,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "expo.out",
          },
          i * 0.12
        );
      });

      // The showreel itself drifts up slightly and fades as the fan spreads.
      gsap.to(subject, {
        y: -40,
        scale: 0.92,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "55% top",
          scrub: true,
        },
      });

      // Wordmark fades in parallel so it doesn't compete with the fan.
      gsap.to(wordmark, {
        opacity: 0,
        scale: 0.96,
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "10% top",
          end: "55% top",
          scrub: true,
        },
      });

      // Final exit: everything still on-screen dissolves into the seam.
      gsap.to([subject, fan, corners], {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "55% top",
          end: "85% top",
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
      {/* Radial glow behind subject */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 42% at 50% 55%, rgba(122,30,39,0.11) 0%, rgba(122,30,39,0.03) 45%, transparent 75%)",
        }}
      />

      {/* Grain */}
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

      {/* Fan cards — radiate out from behind the showreel on scroll.
          Perspective enables the rotationY tilt to feel 3D. */}
      <div
        ref={fanRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        style={{ perspective: "1400px" }}
      >
        {FAN_PROJECTS.map((p, i) => (
          <FanCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      {/* Showreel — the center hub */}
      <motion.div
        ref={subjectRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="relative rounded-[18px] overflow-hidden pointer-events-auto"
          style={{
            width: "min(52vw, 720px)",
            aspectRatio: "16 / 10",
            boxShadow:
              "0 40px 80px -20px rgba(26,24,22,0.28), 0 80px 140px -40px rgba(122,30,39,0.22)",
            border: "1px solid rgba(26,24,22,0.08)",
          }}
        >
          <video
            src="/final-comp.mp4"
            poster="/video-poster.webp"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle film grain + tiny chrome for a "showreel" feel */}
          <div
            aria-hidden
            className="absolute top-3 left-3 flex items-center gap-1.5"
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--oxblood)" }}
            />
            <span
              className="font-mono uppercase"
              style={{
                color: "rgba(243,241,238,0.9)",
                fontSize: "9px",
                letterSpacing: "0.22em",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              Showreel · 2026
            </span>
          </div>
        </div>
      </motion.div>

      {/* Handwritten overlay — "don't slide." */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none z-40"
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

      {/* Corner UI */}
      <div ref={cornersRef} className="absolute inset-0 z-50 pointer-events-none">
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

// ─── Fan card ─────────────────────────────────────────────────────────────────
function FanCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <div
      data-fan-card
      className="absolute pointer-events-auto"
      style={{
        width: "clamp(180px, 16vw, 260px)",
        aspectRatio: "4 / 5",
        willChange: "transform, opacity",
      }}
    >
      <Link
        href={`/work/${project.slug}`}
        data-card
        className="block w-full h-full"
      >
        <article
          className="relative w-full h-full rounded-[14px] overflow-hidden press"
          style={{
            background: project.color,
            border: "1px solid rgba(26,24,22,0.08)",
            boxShadow: "0 20px 50px -20px rgba(26,24,22,0.35)",
          }}
        >
          <div className="absolute inset-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className={
                project.image.includes("Mockup")
                  ? "object-cover object-top"
                  : "object-cover"
              }
              sizes="(max-width: 768px) 40vw, 20vw"
              priority={index < 2}
            />
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(14,13,12,0.78) 0%, rgba(14,13,12,0.3) 45%, transparent 70%)",
            }}
          />

          {/* Category label — top-left */}
          <div
            className="absolute top-3 left-3 font-mono uppercase"
            style={{
              color: "rgba(243,241,238,0.75)",
              fontSize: "9px",
              letterSpacing: "0.22em",
            }}
          >
            {project.category}
          </div>

          {/* Title — bottom-left */}
          <div
            className="absolute bottom-3 left-3 right-3 font-display font-bold"
            style={{
              color: "var(--paper)",
              fontSize: "0.92rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {toSentence(project.title)}
          </div>
        </article>
      </Link>
    </div>
  );
}

function toSentence(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
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

// ─── Status card ──────────────────────────────────────────────────────────────
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
