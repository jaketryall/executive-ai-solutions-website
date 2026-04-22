"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Each phrase is its own cinematic moment — reveals char-by-char via SplitText,
// holds for a beat, then dissolves as the next phrase arrives. The section
// pins for ~3x viewport so each phrase has room to breathe.
const PHRASES: { label: string; caption: string; meta: string }[] = [
  {
    label: "CONVERSION",
    caption: "Websites that turn visitors into customers.",
    meta: "01 · Built on Next.js",
  },
  {
    label: "AUTOMATION",
    caption: "Workflows that run while you sleep.",
    meta: "02 · n8n + custom agents",
  },
  {
    label: "SOFTWARE",
    caption: "Custom tools shaped to your operation.",
    meta: "03 · React · Supabase · owned by you",
  },
];

export default function ScrollMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const phrases = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll(".sm-phrase"));
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      // Pin the stage while the user scrolls through all phrases.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * phrases.length * 1.1}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      phrases.forEach((phrase, i) => {
        const labelEl = phrase.querySelector<HTMLElement>(".sm-label");
        const captionEl = phrase.querySelector<HTMLElement>(".sm-caption");
        const metaEl = phrase.querySelector<HTMLElement>(".sm-meta");

        let labelSplit: SplitText | null = null;
        if (labelEl) {
          // Mask each char for a clean rise-out / rise-in reveal. The
          // `mask: "chars"` wrappers have overflow: clip so the yPercent
          // animations are cleanly clipped.
          labelSplit = SplitText.create(labelEl, {
            type: "chars",
            mask: "chars",
            charsClass: "sm-char",
          });
          splits.push(labelSplit);
        }

        // Starting state — hide everything
        gsap.set(phrase, { autoAlpha: 0 });
        if (labelSplit) gsap.set(labelSplit.chars, { yPercent: 110 });
        if (captionEl) gsap.set(captionEl, { y: 20, opacity: 0 });
        if (metaEl) gsap.set(metaEl, { opacity: 0 });

        // Position within the master timeline — each phrase gets its slot.
        const slot = i;

        // Enter
        tl.to(phrase, { autoAlpha: 1, duration: 0.15 }, slot);
        if (labelSplit) {
          tl.to(
            labelSplit.chars,
            { yPercent: 0, stagger: 0.015, duration: 0.5, ease: "appleOut" },
            slot + 0.05
          );
        }
        if (captionEl) tl.to(captionEl, { y: 0, opacity: 1, duration: 0.4, ease: "appleOut" }, slot + 0.2);
        if (metaEl) tl.to(metaEl, { opacity: 1, duration: 0.3 }, slot + 0.3);

        // Hold mid-slot for readability
        tl.to(phrase, { autoAlpha: 1, duration: 0.35 }, slot + 0.35);

        // Exit (skip on the last phrase — we let the section unpin instead)
        if (i < phrases.length - 1) {
          if (labelSplit) {
            tl.to(
              labelSplit.chars,
              { yPercent: -110, stagger: 0.01, duration: 0.4, ease: "appleSnap" },
              slot + 0.7
            );
          }
          if (captionEl) tl.to(captionEl, { y: -16, opacity: 0, duration: 0.3, ease: "appleSnap" }, slot + 0.72);
          if (metaEl) tl.to(metaEl, { opacity: 0, duration: 0.25 }, slot + 0.75);
          tl.to(phrase, { autoAlpha: 0, duration: 0.1 }, slot + 0.95);
        }
      });

      // Subtle overall bg pan — warms up slightly across the whole pinned run
      gsap.to(stage, {
        backgroundColor: "#ebe7df",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * phrases.length * 1.1}`,
          scrub: 1,
        },
      });
    }, section);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refreshTimer);
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      data-bg="cream"
      style={{ height: "100vh" }}
    >
      <div
        ref={stageRef}
        className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
        style={{ backgroundColor: "#f3f1ee" }}
      >
        {/* Top meta strip — gives the section context without competing */}
        <div
          className="absolute top-0 left-0 right-0 flex items-baseline justify-between px-8 md:px-14 lg:px-20"
          style={{ paddingTop: "clamp(6vh, 8vh, 9vh)" }}
        >
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
            [ What I build ]
          </span>
          <span
            className="hidden md:inline"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.64rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.3)",
            }}
          >
            Three disciplines · one person
          </span>
        </div>

        {/* Phrase stage — each phrase absolute-layered, GSAP swaps visibility */}
        <div className="relative w-full" style={{ height: "clamp(20rem, 40vh, 36rem)" }}>
          {PHRASES.map((p, i) => (
            <div
              key={p.label}
              className="sm-phrase absolute inset-0 flex flex-col items-center justify-center"
              style={{ padding: "0 1rem" }}
            >
              <span
                className="sm-meta"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(0.68rem, 0.85vw, 0.82rem)",
                  fontWeight: 600,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(26,24,22,0.4)",
                  marginBottom: "clamp(1.25rem, 3vh, 2rem)",
                }}
              >
                {p.meta}
              </span>
              <div
                className="sm-label block overflow-hidden"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(3.5rem, 13vw, 15rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  lineHeight: 0.9,
                  color: "#1a1816",
                  textAlign: "center",
                }}
              >
                {p.label}
              </div>
              <p
                className="sm-caption"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(1rem, 1.25vw, 1.25rem)",
                  fontWeight: 500,
                  color: "rgba(26,24,22,0.55)",
                  letterSpacing: "-0.005em",
                  marginTop: "clamp(1.5rem, 3vh, 2rem)",
                  maxWidth: "60ch",
                  textAlign: "center",
                }}
              >
                {p.caption}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom progress ticks — 3 segments, active one filled */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center px-8 md:px-14 lg:px-20"
          style={{ paddingBottom: "clamp(4vh, 6vh, 7vh)" }}
        >
          <div className="flex items-center gap-3 w-full max-w-[1400px] mx-auto">
            {PHRASES.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[2px]"
                style={{ backgroundColor: "rgba(26,24,22,0.15)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
