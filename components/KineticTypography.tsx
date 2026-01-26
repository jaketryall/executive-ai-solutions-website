"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
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

  // Track if section is visible (for pausing animation when off-screen)
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track scroll velocity for kinetic text
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const row1Pos = useRef(0);
  const scrollVelocity = useRef(0);
  const baseDirection = useRef(-1); // -1 = left, 1 = right
  const rafId = useRef<number>(0);

  // Check for mobile on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // IntersectionObserver to pause animation when off-screen (battery saver)
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "100px" }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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

  // Continuous animation loop for kinetic text - pauses when not visible
  useEffect(() => {
    if (row1AnimRef.current) {
      const width = row1AnimRef.current.scrollWidth / 2;
      row1Pos.current = -width / 2;
    }

    // Only run animation when section is visible
    if (!isVisible) {
      return;
    }

    const animate = () => {
      // Slower velocity on mobile (0.6 vs 1.2) for better battery life
      const baseVel = (isMobile ? 0.6 : 1.2) * baseDirection.current;
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
  }, [isVisible, isMobile]);

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
              start: "top 60%",
              end: "90% center",
              scrub: 0.5,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Mobile version - cleaner CSS-based animation
  if (isMobile) {
    return (
      <section className="relative py-16 overflow-hidden bg-[#141312] md:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#141312] to-[#1a1918]" />

        <style>{`
          @keyframes kinetic-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>

        <div className="relative overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{
              animation: "kinetic-scroll 12s linear infinite",
              width: "fit-content",
            }}
          >
            {[...Array(2)].map((_, i) => (
              <span
                key={`a-${i}`}
                className="text-[14vw] font-black text-[#f5f0e8]/80 tracking-[-0.04em] mx-3"
              >
                MORE LEADS • MORE SALES • MORE GROWTH •
              </span>
            ))}
            {[...Array(2)].map((_, i) => (
              <span
                key={`b-${i}`}
                className="text-[14vw] font-black text-[#f5f0e8]/80 tracking-[-0.04em] mx-3"
              >
                MORE LEADS • MORE SALES • MORE GROWTH •
              </span>
            ))}
          </div>
        </div>

        {/* Gradient fade to next section */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, #1a1918 100%)",
          }}
        />
      </section>
    );
  }

  // Desktop version
  return (
    <section
      ref={sectionRef}
      className="relative pt-24 pb-24 overflow-hidden bg-black hidden md:block"
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
              "linear-gradient(to bottom, transparent 0%, rgba(5,4,4,0.3) 20%, rgba(5,4,4,0.7) 50%, #050404 80%, #050404 100%)",
          }}
        />
      </div>
    </section>
  );
}
