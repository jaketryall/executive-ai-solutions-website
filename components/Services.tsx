"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    number: "01",
    title: "STRATEGY",
    description: "Brand positioning, market research, and digital roadmaps that set the foundation for success.",
    size: "large",
  },
  {
    number: "02",
    title: "DESIGN",
    description: "Bold visual systems and interfaces that demand attention and drive engagement.",
    size: "small",
  },
  {
    number: "03",
    title: "DEVELOPMENT",
    description: "Blazing-fast, custom-coded experiences. No templates. No compromises.",
    size: "small",
  },
  {
    number: "04",
    title: "MOTION",
    description: "Cinematic animations and micro-interactions that bring brands to life.",
    size: "medium",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Section reveal with scale
      if (sectionRef.current) {
        gsap.fromTo(
          sectionRef.current,
          { scale: 0.95, opacity: 0.8 },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 60%",
              scrub: 1,
            },
          }
        );
      }

      // Header animations
      if (headerRef.current) {
        const label = headerRef.current.querySelector(".services-label");
        const title = headerRef.current.querySelector(".services-title");

        if (label) {
          gsap.fromTo(
            label,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headerRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (title) {
          gsap.fromTo(
            title,
            { y: 80, opacity: 0, skewY: 3 },
            {
              y: 0,
              opacity: 1,
              skewY: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      // Cards stagger animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".service-card");

        gsap.fromTo(
          cards,
          { y: 100, opacity: 0, rotateX: 10 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="relative py-32 bg-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <p className="services-label text-white/40 text-sm uppercase tracking-[0.3em] mb-4">
            Capabilities
          </p>
          <h2 className="services-title text-[12vw] md:text-[8vw] font-black text-white leading-[0.9] tracking-[-0.02em]">
            WHAT WE DO
          </h2>
        </div>

        {/* Bento Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Large card - Strategy */}
          <div
            className="service-card group relative md:col-span-2 lg:col-span-2 lg:row-span-2 bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-colors duration-500"
          >
            <div className="p-8 md:p-12 h-full min-h-[400px] lg:min-h-[500px] flex flex-col justify-between relative">
              {/* Gradient orb */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div>
                <span className="text-[#00f0ff] text-sm font-mono mb-4 block">01</span>
                <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-[-0.02em] group-hover:text-[#00f0ff] transition-colors duration-300">
                  STRATEGY
                </h3>
              </div>

              <p className="text-white/50 text-lg md:text-xl max-w-md leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                Brand positioning, market research, and digital roadmaps that set the foundation for success.
              </p>

              <div
                className="absolute bottom-8 right-8 text-white/20 text-3xl group-hover:text-[#00f0ff] group-hover:translate-x-2 transition-all duration-300"
              >
                →
              </div>
            </div>
          </div>

          {/* Small card - Design */}
          <div
            className="service-card group relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-colors duration-500"
          >
            <div className="p-8 h-full min-h-[240px] flex flex-col justify-between relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div>
                <span className="relative text-[#00f0ff] text-sm font-mono mb-3 block">02</span>
                <h3 className="relative text-3xl md:text-4xl font-black text-white tracking-[-0.02em] group-hover:text-[#00f0ff] transition-colors duration-300">
                  DESIGN
                </h3>
              </div>

              <p className="relative text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                Bold visual systems and interfaces that demand attention.
              </p>
            </div>
          </div>

          {/* Small card - Development */}
          <div
            className="service-card group relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-colors duration-500"
          >
            <div className="p-8 h-full min-h-[240px] flex flex-col justify-between relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div>
                <span className="relative text-[#00f0ff] text-sm font-mono mb-3 block">03</span>
                <h3 className="relative text-3xl md:text-4xl font-black text-white tracking-[-0.02em] group-hover:text-[#00f0ff] transition-colors duration-300">
                  DEVELOPMENT
                </h3>
              </div>

              <p className="relative text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                Blazing-fast, custom-coded experiences. No templates.
              </p>
            </div>
          </div>

          {/* Medium card - Motion */}
          <div
            className="service-card group relative md:col-span-2 lg:col-span-3 bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-colors duration-500"
          >
            <div className="p-8 md:p-12 h-full min-h-[200px] flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative">
              {/* Animated gradient line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex-1">
                <span className="text-[#00f0ff] text-sm font-mono mb-3 block">04</span>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-[-0.02em] group-hover:text-[#00f0ff] transition-colors duration-300">
                  MOTION
                </h3>
              </div>

              <p className="text-white/50 text-lg max-w-sm leading-relaxed group-hover:text-white/70 transition-colors duration-300 md:text-right">
                Cinematic animations and micro-interactions that bring brands to life.
              </p>

              <div
                className="absolute bottom-8 right-8 text-white/20 text-3xl group-hover:text-[#00f0ff] group-hover:translate-x-2 transition-all duration-300 hidden md:block"
              >
                →
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
