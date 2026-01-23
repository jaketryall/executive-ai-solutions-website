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
  const row1AnimRef = useRef<HTMLDivElement>(null);
  const gradientOverlayRef = useRef<HTMLDivElement>(null);

  // Track scroll velocity for kinetic text
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const row1Pos = useRef(0);
  const scrollVelocity = useRef(0);
  const baseDirection = useRef(-1); // -1 = left, 1 = right
  const rafId = useRef<number>(0);

  // Track scroll velocity and update base direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScrollY.current;
    scrollVelocity.current = delta;
    lastScrollY.current = latest;

    // Change base direction based on scroll direction
    if (delta > 2) {
      baseDirection.current = -1; // Scrolling down = move left
    } else if (delta < -2) {
      baseDirection.current = 1; // Scrolling up = move right
    }
  });

  // Continuous animation loop for kinetic text
  useEffect(() => {
    if (row1AnimRef.current) {
      const width = row1AnimRef.current.scrollWidth / 2;
      row1Pos.current = -width / 2;
    }

    const animate = () => {
      // Base velocity in current direction plus scroll-driven boost
      const baseVel = 1.2 * baseDirection.current;
      const row1Vel = baseVel;

      // Decay the scroll velocity for smooth deceleration
      scrollVelocity.current *= 0.95;

      row1Pos.current += row1Vel;

      if (row1AnimRef.current) {
        const width = row1AnimRef.current.scrollWidth / 2;
        if (row1Pos.current <= -width) row1Pos.current += width;
        else if (row1Pos.current >= 0) row1Pos.current -= width;
        row1AnimRef.current.style.transform = `translateX(${row1Pos.current}px)`;
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
      // Kinetic parallax - immediate response
      if (textRow1Ref.current) {
        gsap.to(textRow1Ref.current, {
          x: "-2%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }

      // Gradient overlay transition - starts at 40% and completes before section ends
      if (gradientOverlayRef.current) {
        gsap.fromTo(
          gradientOverlayRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "10% center",
              end: "100% center",
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
      className="relative pt-24 pb-24 overflow-hidden bg-black"
      style={{ zIndex: 10 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900/50 to-neutral-950" />


      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative flex flex-col items-center justify-center">
        <div ref={textRow1Ref} className="flex whitespace-nowrap overflow-hidden">
          <div ref={row1AnimRef} className="flex">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="text-[18vw] font-black text-white tracking-[-0.04em] mx-8 shrink-0"
              >
                MORE LEADS • MORE SALES • MORE GROWTH •
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
