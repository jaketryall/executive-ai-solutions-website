"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const statement = "I design websites that actually grow businesses.";
const accentWords = ["design", "actually", "grow"];

// Thumbnails that fly out from behind the text
const thumbnails = [
  { src: "/Celestial Laptop Mockup.webp", x: -45, y: -35, rotate: -12, scale: 0.9 },
  { src: "/Celestial iPhone Mockup.webp", x: 40, y: -30, rotate: 8, scale: 0.75 },
  { src: "/Rubber iPhone Mockup.webp", x: -38, y: 30, rotate: 6, scale: 0.8 },
  { src: "/Elegant Black Laptop Mockup.webp", x: 42, y: 28, rotate: -10, scale: 0.85 },
];

export default function KineticTypography() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    const label = labelRef.current;
    if (!section) return;

    const words = section.querySelectorAll<HTMLSpanElement>("[data-word]");
    const thumbs = section.querySelectorAll<HTMLDivElement>("[data-thumb]");

    const ctx = gsap.context(() => {
      // Words scrub from dim to bright
      words.forEach((word) => {
        gsap.fromTo(
          word,
          { opacity: 0.06, y: 20, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: word,
              start: "top 88%",
              end: "top 45%",
              scrub: 1,
            },
          }
        );
      });

      // Thumbnails — start at center (behind text), fly outward on scrub
      thumbs.forEach((thumb, i) => {
        const data = thumbnails[i];
        if (!data) return;

        // Start stacked at center, hidden
        gsap.set(thumb, {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scale: 0.3,
          opacity: 0,
          rotation: 0,
        });

        // Fly outward as you scroll through the section
        gsap.to(thumb, {
          x: () => (data.x / 100) * window.innerWidth,
          y: () => (data.y / 100) * window.innerHeight,
          scale: data.scale,
          opacity: 0.15,
          rotation: data.rotate,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 40%",
            end: "bottom 60%",
            scrub: 1,
          },
        });
      });

      // Gold line draws
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "top 20%",
              scrub: 1,
            },
          }
        );
      }

      // Label fades in
      if (label) {
        gsap.fromTo(
          label,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Mobile */}
      <section className="min-h-[60vh] flex items-center justify-center px-6 md:hidden" data-bg="dark">
        <div className="text-center">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-6"
            style={{ color: "rgba(255, 200, 150, 0.5)" }}
          >
            My Approach
          </p>
          <p
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
        </div>
      </section>

      {/* Desktop */}
      <section
        ref={sectionRef}
        className="relative hidden md:block overflow-hidden"
        data-bg="dark"
        style={{ padding: "15vh 0 40vh" }}
      >
        {/* Floating project thumbnails — fly outward from center on scroll */}
        {thumbnails.map((thumb, i) => (
          <div
            key={i}
            data-thumb
            className="absolute rounded-xl overflow-hidden pointer-events-none"
            style={{
              width: "clamp(180px, 18vw, 280px)",
              aspectRatio: "4 / 3",
              top: "50%",
              left: "50%",
              zIndex: 0,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Image
              src={thumb.src}
              alt=""
              fill
              className="object-cover"
              sizes="18vw"
            />
          </div>
        ))}

        <div className="max-w-[1200px] mx-auto px-10 text-center relative" style={{ zIndex: 1 }}>
          {/* Label */}
          <p
            ref={labelRef}
            className="text-xs uppercase tracking-[0.3em] mb-10"
            style={{ color: "rgba(255, 200, 150, 0.4)", opacity: 0 }}
          >
            My Approach
          </p>

          {/* Statement */}
          <p
            className="leading-[1.15]"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(3.5rem, 7vw, 8rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
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
                    opacity: 0.06,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </p>

          {/* Gold accent line */}
          <div
            ref={lineRef}
            style={{
              height: 2,
              backgroundColor: "rgba(255, 200, 150, 0.3)",
              transformOrigin: "center",
              margin: "0 auto",
              transform: "scaleX(0)",
              marginTop: "clamp(2rem, 4vh, 4rem)",
              maxWidth: 200,
            }}
          />
        </div>
      </section>
    </>
  );
}
