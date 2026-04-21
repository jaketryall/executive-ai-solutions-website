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
      style={{ padding: "clamp(6vh, 10vh, 14vh) 0" }}
      data-bg="cream"
    >
      <div
        className="marquee-track flex whitespace-nowrap"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "clamp(4rem, 13vw, 16rem)",
          fontWeight: 900,
          color: "#1a1816",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          willChange: "transform",
        }}
      >
        {[...PHRASES, ...PHRASES].map((phrase, i) => (
          <span key={i} className="inline-flex items-center shrink-0">
            <span style={{ paddingRight: "0.5em" }}>{phrase}</span>
            <span
              aria-hidden="true"
              style={{
                paddingRight: "0.5em",
                color: "rgba(229, 225, 219, 0.7)",
                fontSize: "0.55em",
                transform: "translateY(-0.18em)",
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
