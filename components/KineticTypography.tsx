"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const statement = "I design websites that actually grow businesses.";
const accentWords = ["design", "actually", "grow"];

export default function KineticTypography() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = section.querySelectorAll<HTMLSpanElement>("[data-word]");

    const ctx = gsap.context(() => {
      words.forEach((word, i) => {
        gsap.fromTo(
          word,
          { opacity: 0.08, y: 12 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: word,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Mobile */}
      <section className="min-h-[50vh] flex items-center justify-center px-6 md:hidden" data-bg="morph">
        <p
          className="text-center"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#e5e1db",
          }}
        >
          I design websites that{" "}
          <span style={{ color: "rgba(255, 200, 150, 1)" }}>actually</span>{" "}
          grow businesses.
        </p>
      </section>

      {/* Desktop — flows naturally, words light up as they scroll into view */}
      <section
        ref={sectionRef}
        className="relative hidden md:block"
        data-bg="morph"
        style={{ padding: "20vh 0" }}
      >
        <div className="max-w-[1100px] mx-auto px-10 text-center">
          <p
            className="leading-[1.3]"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(2.5rem, 4.5vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {statement.split(" ").map((word, i) => {
              const clean = word.replace(/[.,]/g, "");
              const isAccent = accentWords.includes(clean);
              return (
                <span
                  key={i}
                  data-word
                  className="inline-block mr-[0.3em]"
                  style={{
                    color: isAccent ? "rgba(255, 200, 150, 1)" : "#e5e1db",
                    opacity: 0.08,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>
      </section>
    </>
  );
}
