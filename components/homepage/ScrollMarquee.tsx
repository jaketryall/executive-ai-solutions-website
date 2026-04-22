"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Phrases repeat seamlessly — the track is duplicated so translating by -50%
// wraps cleanly to the start.
const PHRASES = [
  "CONVERSION WEBSITES",
  "AI AUTOMATIONS",
  "CUSTOM SOFTWARE",
];

export default function ScrollMarquee() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const track = sectionRef.current?.querySelector<HTMLElement>(".marquee-track");
    if (!track) return;

    const ctx = gsap.context(() => {
      // Base continuous loop — translate the track by -50% (half its width,
      // since it contains two copies of the content) over 30s, repeating.
      const loop = gsap.to(track, {
        xPercent: -50,
        duration: 30,
        ease: "none",
        repeat: -1,
      });

      // Scroll velocity listener — boost timeScale based on how fast the user
      // is scrolling; negative velocity (scrolling up) reverses direction.
      let currentTimeScale = 1;
      const target = { value: 1 };

      const velocityTrigger = ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          // Map velocity to a multiplier. At rest: 1x. Fast scroll: up to 6x.
          // Sign carries direction — scrolling up reverses the marquee.
          const direction = velocity >= 0 ? 1 : -1;
          const magnitude = Math.min(Math.abs(velocity) * 0.004, 5);
          target.value = direction * (1 + magnitude);
        },
      });

      // Ease timeScale toward the target each frame so changes feel smooth,
      // not jittery. Decays back to 1 (base speed) when scroll stops.
      const decayTicker = () => {
        // Decay target toward 1 when user isn't actively scrolling
        target.value += (1 - target.value) * 0.05;
        currentTimeScale += (target.value - currentTimeScale) * 0.15;
        loop.timeScale(currentTimeScale);
      };
      gsap.ticker.add(decayTicker);

      return () => {
        gsap.ticker.remove(decayTicker);
        velocityTrigger.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "clamp(5vh, 7vh, 10vh) 0 clamp(6vh, 10vh, 14vh)" }}
      data-bg="cream"
    >
      {/* Editorial meta strip — gives the marquee context as an "in rotation"
          list rather than pure decoration. Thin hairline anchors it. */}
      <div className="relative px-6 md:px-12 lg:px-20 mb-8 md:mb-14">
        <div
          className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-3 pb-3"
          style={{
            borderBottom: "1px solid rgba(26,24,22,0.12)",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.55)",
            }}
          >
            [ In rotation · Q2 2026 ]
          </span>
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.35)",
            }}
          >
            Scroll accelerates · direction follows scroll
          </span>
        </div>
      </div>

      <div
        className="marquee-track flex whitespace-nowrap"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "clamp(4rem, 13vw, 16rem)",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          willChange: "transform",
        }}
      >
        {[...PHRASES, ...PHRASES].map((phrase, i) => {
          // Alternate filled vs outline phrases for editorial rhythm.
          // `-webkit-text-stroke` keeps the weight-900 Inter glyphs crisp
          // at display size where outlined text normally thins out.
          const isOutline = i % 2 === 1;
          return (
            <span key={i} className="inline-flex items-center shrink-0">
              <span
                style={{
                  paddingRight: "0.5em",
                  color: isOutline ? "transparent" : "#1a1816",
                  WebkitTextStroke: isOutline ? "1.5px #1a1816" : undefined,
                }}
              >
                {phrase}
              </span>
              <span
                aria-hidden="true"
                style={{
                  paddingRight: "0.5em",
                  color: "rgba(26, 24, 22, 0.25)",
                  fontSize: "0.55em",
                  transform: "translateY(-0.18em)",
                }}
              >
                ✦
              </span>
            </span>
          );
        })}
      </div>
    </section>
  );
}
