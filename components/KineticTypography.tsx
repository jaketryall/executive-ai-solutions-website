"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function KineticTypography() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRow1Ref = useRef<HTMLDivElement>(null);
  const textRow2Ref = useRef<HTMLDivElement>(null);
  const row1AnimRef = useRef<HTMLDivElement>(null);
  const row2AnimRef = useRef<HTMLDivElement>(null);
  const gradientOverlayRef = useRef<HTMLDivElement>(null);

  // Track scroll velocity for kinetic text
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const row1Pos = useRef(0);
  const row2Pos = useRef(0);
  const scrollDirection = useRef<"down" | "up">("down");
  const rafId = useRef<number>(0);

  // Track scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScrollY.current;
    if (delta > 0) {
      scrollDirection.current = "down";
    } else if (delta < 0) {
      scrollDirection.current = "up";
    }
    lastScrollY.current = latest;
  });

  // Continuous animation loop for kinetic text
  useEffect(() => {
    if (row1AnimRef.current) {
      const width = row1AnimRef.current.scrollWidth / 2;
      row1Pos.current = -width / 2;
    }
    if (row2AnimRef.current) {
      const width = row2AnimRef.current.scrollWidth / 2;
      row2Pos.current = -width / 2;
    }

    const animate = () => {
      const direction = scrollDirection.current === "down" ? 1 : -1;
      const row1Vel = -0.5 * direction;
      const row2Vel = 0.4 * direction;

      row1Pos.current += row1Vel;
      row2Pos.current += row2Vel;

      if (row1AnimRef.current) {
        const width = row1AnimRef.current.scrollWidth / 2;
        if (row1Pos.current <= -width) row1Pos.current += width;
        else if (row1Pos.current >= 0) row1Pos.current -= width;
        row1AnimRef.current.style.transform = `translateX(${row1Pos.current}px)`;
      }

      if (row2AnimRef.current) {
        const width = row2AnimRef.current.scrollWidth / 2;
        if (row2Pos.current <= -width) row2Pos.current += width;
        else if (row2Pos.current >= 0) row2Pos.current -= width;
        row2AnimRef.current.style.transform = `translateX(${row2Pos.current}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Kinetic parallax
      if (textRow1Ref.current && textRow2Ref.current) {
        gsap.to(textRow1Ref.current, {
          x: "-15%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(textRow2Ref.current, {
          x: "10%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Gradient overlay transition
      if (gradientOverlayRef.current) {
        gsap.fromTo(
          gradientOverlayRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "center center",
              end: "bottom 40%",
              scrub: 0.5,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-40 overflow-hidden bg-neutral-950 rounded-t-4xl"
      style={{ zIndex: 10 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900/50 to-neutral-950" />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative flex flex-col gap-8">
        <div ref={textRow1Ref} className="flex whitespace-nowrap overflow-hidden">
          <div ref={row1AnimRef} className="flex">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="text-[12vw] font-black text-white tracking-[-0.03em] mx-6 shrink-0"
              >
                NO TEMPLATES • NO LIMITS • JUST RESULTS •
              </span>
            ))}
          </div>
        </div>
        <div ref={textRow2Ref} className="flex whitespace-nowrap overflow-hidden">
          <div ref={row2AnimRef} className="flex">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="text-[12vw] font-black text-transparent tracking-[-0.03em] mx-6 shrink-0"
                style={{ WebkitTextStroke: "2px rgba(255,255,255,0.4)" }}
              >
                CUSTOM BUILT • PIXEL PERFECT • PERFORMANCE FIRST •
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient overlay transition */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div
          ref={gradientOverlayRef}
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.7) 50%, #000000 80%, #000000 100%)",
          }}
        />
      </div>
    </section>
  );
}
