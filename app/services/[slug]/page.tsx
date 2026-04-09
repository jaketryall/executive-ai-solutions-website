"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, use, useEffect, useState, useLayoutEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";
import { services, getServiceBySlug, getRelatedProjects, PricingTier } from "@/lib/data";
import { SplitText, useSplitTextReveal } from "@/lib/hooks";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Isomorphic layout effect
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ============================================================================
// KINETIC TEXT MARQUEE - Solid fill version for services pages
// ============================================================================
function KineticMarquee({ text, direction = -1 }: { text: string; direction?: number }) {
  const animRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (animRef.current) {
      const width = animRef.current.scrollWidth / 2;
      posRef.current = direction === -1 ? 0 : -width;
    }

    const animate = () => {
      const vel = 0.8 * direction;
      posRef.current += vel;

      if (animRef.current) {
        const width = animRef.current.scrollWidth / 2;
        if (direction === -1) {
          if (posRef.current <= -width) posRef.current += width;
        } else {
          if (posRef.current >= 0) posRef.current -= width;
        }
        animRef.current.style.transform = `translateX(${posRef.current}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [direction]);

  return (
    <div className="flex whitespace-nowrap overflow-hidden">
      <div ref={animRef} className="flex">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="text-[18vw] md:text-[12vw] font-black tracking-[-0.04em] mx-6 md:mx-12 shrink-0 text-white/10"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CINEMATIC HERO SECTION - MINIMAL ACCENT (TEXT-FOCUSED)
// ============================================================================
function CinematicHero({
  service,
}: {
  service: NonNullable<ReturnType<typeof getServiceBySlug>>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  // SplitText reveal for hero title
  useSplitTextReveal(contentRef);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const numberY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Content reveal animation
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }

      // Animated accent line
      if (accentLineRef.current) {
        gsap.fromTo(
          accentLineRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.5,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[100vh] flex items-center justify-center">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #0a0908 0%, #0d0b09 100%)",
        }}
      />

      {/* Ambient glow - center positioned */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${accentColor}10, transparent)`,
        }}
      />

      {/* Secondary ambient glow - top right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 40% at 80% 20%, ${accentColor}08, transparent)`,
        }}
      />

      {/* Giant background number - centered */}
      <motion.span
        className="absolute font-black text-white/[0.025] pointer-events-none select-none leading-none z-0"
        style={{
          fontSize: "clamp(20rem, 40vw, 50rem)",
          y: numberY,
        }}
      >
        {service.number}
      </motion.span>

      {/* Decorative horizontal line */}
      <div
        ref={accentLineRef}
        className="absolute top-1/2 left-0 right-0 h-px pointer-events-none origin-left"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)`,
        }}
      />

      {/* Decorative corner accents */}
      <div
        className="absolute top-32 left-8 md:left-16 w-px h-24 pointer-events-none hidden md:block"
        style={{
          background: `linear-gradient(180deg, ${accentColor}40, transparent)`,
        }}
      />
      <div
        className="absolute top-32 left-8 md:left-16 w-24 h-px pointer-events-none hidden md:block"
        style={{
          background: `linear-gradient(90deg, ${accentColor}40, transparent)`,
        }}
      />
      <div
        className="absolute bottom-32 right-8 md:right-16 w-px h-24 pointer-events-none hidden md:block"
        style={{
          background: `linear-gradient(0deg, ${accentColor}40, transparent)`,
        }}
      />
      <div
        className="absolute bottom-32 right-8 md:right-16 w-24 h-px pointer-events-none hidden md:block"
        style={{
          background: `linear-gradient(270deg, ${accentColor}40, transparent)`,
        }}
      />

      {/* Main content - centered */}
      <div className="relative max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-32">
        <motion.div
          ref={contentRef}
          className="relative z-10 text-center"
          style={{ y: contentY }}
        >
          {/* Service number tag */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className="w-12 h-px"
              style={{ backgroundColor: accentColorMuted }}
            />
            <span
              className="text-sm font-medium tracking-[0.3em]"
              style={{ color: accentColor }}
            >
              {service.number}
            </span>
            <span
              className="w-12 h-px"
              style={{ backgroundColor: accentColorMuted }}
            />
          </div>

          {/* Title — SplitText letter reveal */}
          <SplitText
            text={service.title}
            as="h1"
            className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white tracking-[-0.04em] leading-[0.85] mb-4"
          />

          {/* Subtitle */}
          <p
            className="text-2xl md:text-3xl lg:text-4xl font-light mb-8"
            style={{ color: accentColorMuted }}
          >
            {service.subtitle}
          </p>

          {/* Description */}
          <p className="text-white/50 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
            {service.description}
          </p>

          {/* CTA Button */}
          <a
            href="#pricing"
            className="inline-flex items-center gap-4 group"
          >
            <span
              className="px-8 py-4 rounded-full border-2 transition-all duration-300 group-hover:bg-[rgba(255,200,150,0.15)] group-hover:border-[rgba(255,200,150,1)]"
              style={{ borderColor: accentColor }}
            >
              <span className="text-sm uppercase tracking-[0.2em] font-semibold text-white">
                View Pricing
              </span>
            </span>
            <span
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:bg-[rgba(255,200,150,0.15)] group-hover:translate-y-1"
              style={{ borderColor: accentColor }}
            >
              <span style={{ color: accentColor }} className="text-xl">
                ↓
              </span>
            </span>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="flex flex-col items-center gap-3"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// DESCRIPTION SECTION WITH SPLIT TEXT REVEAL
// ============================================================================
function DescriptionSection({
  service,
}: {
  service: NonNullable<ReturnType<typeof getServiceBySlug>>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Split text animation
      if (textRef.current) {
        const words = textRef.current.querySelectorAll(".word");
        gsap.fromTo(
          words,
          { opacity: 0.1 },
          {
            opacity: 1,
            duration: 0.5,
            stagger: 0.02,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "center center",
              scrub: 1,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split long description into words
  const words = service.longDescription.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-transparent"
    >
      <div className="max-w-5xl mx-auto">
        <p
          ref={textRef}
          className="text-2xl md:text-4xl lg:text-5xl font-light text-white leading-[1.4] tracking-[-0.02em]"
        >
          {words.map((word, i) => (
            <span key={i} className="word inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// VERTICAL TIMELINE PROCESS SECTION WITH GLOWING LINE
// ============================================================================
function VerticalTimelineSection({
  service,
}: {
  service: NonNullable<ReturnType<typeof getServiceBySlug>>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const glowLineRef = useRef<HTMLDivElement>(null);

  // Process step icons
  const processIcons: Record<string, React.ReactNode> = {
    "Discovery": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    "Strategy": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    "Design": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>,
    "Development": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    "Launch & Optimize": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    "Audit": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    "Research": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    "Technical Fix": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    "Content Strategy": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    "Monitor & Adapt": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    "Analysis": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    "Architecture": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    "Integration": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    "Training & Support": <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>,
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the glowing line to fill as user scrolls
      if (glowLineRef.current && sectionRef.current) {
        gsap.fromTo(
          glowLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 40%",
              scrub: 0.5,
            },
          }
        );
      }

      // Animate each timeline item
      const items = timelineRef.current?.querySelectorAll(".timeline-item");
      if (items) {
        items.forEach((item, i) => {
          // Card reveal
          gsap.fromTo(
            item.querySelector(".timeline-card"),
            {
              opacity: 0,
              x: i % 2 === 0 ? -60 : 60,
              scale: 0.95
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 75%",
                end: "top 45%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // Node glow effect
          gsap.fromTo(
            item.querySelector(".timeline-node"),
            { scale: 0.5, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: item,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [service.process.length]);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 bg-transparent">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 50% at 50% 50%, ${accentColor}06, transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section header */}
        <div className="text-center mb-20 md:mb-32">
          <motion.span
            className="text-xs uppercase tracking-[0.3em] mb-4 block"
            style={{ color: accentColorMuted }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How We Work
          </motion.span>
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-[-0.04em]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            The Process
          </motion.h2>
        </div>

        {/* Timeline container */}
        <div ref={timelineRef} className="relative">
          {/* Center line (background) */}
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />

          {/* Glowing line (fills on scroll) */}
          <div
            ref={glowLineRef}
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 origin-top hidden md:block"
            style={{
              background: `linear-gradient(180deg, ${accentColor}, ${accentColorMuted})`,
              boxShadow: `0 0 20px ${accentColor}80, 0 0 40px ${accentColor}40, 0 0 60px ${accentColor}20`,
            }}
          />

          {/* Mobile line - hidden for cleaner look */}

          {/* Timeline items */}
          <div className="relative space-y-8 md:space-y-24">
            {service.process.map((step, i) => (
              <div
                key={i}
                className={`timeline-item relative flex items-center ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline node (center dot) - hidden on mobile for clean stacked cards */}
                <div
                  className={`timeline-node absolute hidden md:block md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full z-10`}
                  style={{
                    background: accentColor,
                    boxShadow: `0 0 12px ${accentColor}90, 0 0 24px ${accentColor}50`,
                  }}
                />

                {/* Card */}
                <div
                  className={`timeline-card w-full md:w-[calc(50%-40px)] shrink-0 ${
                    i % 2 === 0 ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <div
                    className="relative p-6 md:p-8 lg:p-10 rounded-2xl overflow-hidden group"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Step number watermark - hidden on mobile for cleaner look */}
                    <div
                      className="absolute -right-4 -top-4 text-[120px] lg:text-[160px] font-black leading-none pointer-events-none select-none hidden md:block"
                      style={{
                        WebkitTextStroke: `1px rgba(255,200,150,0.08)`,
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Step number badge - mobile only */}
                    <div
                      className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                        color: accentColor,
                        border: `1px solid ${accentColor}30`,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Icon - desktop only */}
                    <div
                      className="hidden md:flex w-12 h-12 rounded-xl items-center justify-center mb-6"
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
                        border: `1px solid ${accentColor}25`,
                        color: accentColor,
                      }}
                    >
                      {processIcons[step.step] || (
                        <span className="text-lg font-black">{i + 1}</span>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3">
                      {step.step}
                    </h3>
                    <p className="text-white/60 text-sm md:text-base lg:text-lg leading-relaxed">
                      {step.description}
                    </p>

                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 100%, ${accentColor}10, transparent 70%)`,
                      }}
                    />
                  </div>
                </div>

                {/* Empty space for opposite side */}
                <div className="hidden md:block md:w-[calc(50%-40px)] shrink-0" />
              </div>
            ))}
          </div>

          {/* End node - hidden on mobile */}
          <div
            className="absolute hidden md:flex left-1/2 -translate-x-1/2 -bottom-4 w-6 h-6 rounded-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, rgba(255,180,120,1))`,
              boxShadow: `0 0 30px ${accentColor}60`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BENTO-STYLE BENEFITS SECTION
// ============================================================================

// Benefit icons mapping
const benefitIcons: Record<number, React.ReactNode> = {
  0: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  1: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  2: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  3: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  4: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  5: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
};

// Secondary descriptive text for benefits
const benefitSubtext: string[] = [
  "Measurable impact from day one",
  "Optimized for peak efficiency",
  "Enterprise-grade protection",
  "Continuous improvement built-in",
  "Expert guidance at every step",
  "Ready for tomorrow's challenges",
];

function BenefitsSection({
  service,
}: {
  service: NonNullable<ReturnType<typeof getServiceBySlug>>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll(".bento-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: {
              each: 0.08,
              from: "start",
            },
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Determine bento grid layout pattern based on number of benefits
  const getBentoClass = (index: number, total: number): string => {
    // For 6 items, create a dramatic layout with large cards:
    // Row 1-2: Feature card (2 cols, 2 rows) + Card 1 & Card 2 stacked
    // Row 3: Card 3 (1 col) + Card 4 (2 cols wide)
    // Row 4: Card 5 (full width - 3 cols)
    if (total === 6) {
      if (index === 0) return "md:col-span-2 md:row-span-2"; // Large 2x2 feature card
      if (index === 1) return "md:col-span-1"; // Top right
      if (index === 2) return "md:col-span-1"; // Middle right
      if (index === 3) return "md:col-span-1"; // Bottom left
      if (index === 4) return "md:col-span-2"; // Wide card
      if (index === 5) return "md:col-span-3"; // Full-width closing card
    }
    // Default: uniform grid
    return "md:col-span-1";
  };

  const isLargeCard = (index: number, total: number): boolean => {
    if (total === 6) {
      return index === 0 || index === 4 || index === 5; // Feature, wide, and full-width cards
    }
    return false;
  };

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 bg-transparent">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${accentColor}08, transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-20 gap-6">
          <div>
            <motion.span
              className="text-xs uppercase tracking-[0.3em] mb-4 block"
              style={{ color: accentColorMuted }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              What You Get
            </motion.span>
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-[-0.04em]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Benefits
            </motion.h2>
          </div>
          <motion.p
            className="text-white/40 text-lg md:text-xl max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Everything you need to transform your digital presence and drive real results.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-fr"
        >
          {service.benefits.map((benefit, i) => {
            const large = isLargeCard(i, service.benefits.length);
            return (
              <div
                key={i}
                className={`bento-card group relative rounded-2xl md:rounded-3xl overflow-hidden ${getBentoClass(i, service.benefits.length)}`}
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  minHeight: large ? "280px" : "200px",
                }}
              >
                {/* Background number */}
                <div
                  className={`absolute font-black leading-none pointer-events-none select-none ${
                    large ? "-right-6 -bottom-10 text-[200px] md:text-[280px]" : "-right-4 -bottom-6 text-[120px] md:text-[160px]"
                  }`}
                  style={{
                    WebkitTextStroke: `1px rgba(255,200,150,0.06)`,
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Content */}
                <div className={`relative h-full flex flex-col ${large ? "p-8 md:p-10" : "p-6 md:p-8"}`}>
                  {/* Icon */}
                  <div
                    className={`${large ? "w-14 h-14" : "w-12 h-12"} rounded-xl flex items-center justify-center mb-auto`}
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`,
                      border: `1px solid ${accentColor}25`,
                      color: accentColor,
                    }}
                  >
                    {benefitIcons[i % 6]}
                  </div>

                  {/* Text content */}
                  <div className="mt-auto">
                    {/* Subtext label */}
                    <span
                      className="text-[10px] uppercase tracking-[0.2em] mb-2 block"
                      style={{ color: accentColorMuted }}
                    >
                      {benefitSubtext[i % 6]}
                    </span>

                    {/* Main benefit */}
                    <p className={`text-white font-medium leading-snug ${large ? "text-xl md:text-2xl" : "text-base md:text-lg"}`}>
                      {benefit}
                    </p>

                    {/* Large card extra content */}
                    {large && (
                      <div className="mt-6 flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            background: `${accentColor}20`,
                            border: `1px solid ${accentColor}30`,
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={accentColor}
                            strokeWidth="2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span className="text-white/40 text-sm">Included in all plans</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative corner accent for large cards */}
                {large && (
                  <div
                    className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 100% 0%, ${accentColor}10, transparent 70%)`,
                    }}
                  />
                )}

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 100%, ${accentColor}12, transparent 60%)`,
                  }}
                />

                {/* Border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 0 1px ${accentColor}30`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PRICING SECTION
// ============================================================================
function PricingSection({
  pricing,
}: {
  pricing: PricingTier[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll(".pricing-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={sectionRef} className="relative py-32 md:py-48 bg-transparent overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 30%, ${accentColor}08, transparent)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            className="text-xs uppercase tracking-[0.3em] mb-4 block"
            style={{ color: accentColorMuted }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Investment
          </motion.span>
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-[-0.04em] mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Pricing
          </motion.h2>
          <motion.p
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Transparent pricing with no hidden fees. Every project includes strategy, design, and development.
          </motion.p>
        </div>

        {/* Pricing cards */}
        <div
          ref={cardsRef}
          className={`pt-12 ${
            pricing.length === 1
              ? "flex justify-center"
              : "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          }`}
        >
          {pricing.map((tier, i) => (
            <TransitionLink
              key={tier.name}
              href="/contact"
              className={`pricing-card group relative transition-transform duration-300 hover:-translate-y-2 block ${
                tier.highlighted && pricing.length > 1 ? "md:-mt-4 md:mb-4" : ""
              } ${pricing.length === 1 ? "w-full max-w-4xl" : ""}`}
              onMouseEnter={() => play("hover", { volume: 0.05 })}
              onClick={() => play("click")}
            >
              {/* Highlighted badge - outside overflow container (only show when multiple cards) */}
              {tier.highlighted && pricing.length > 1 && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider z-10"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, rgba(255, 180, 120, 1))`,
                    color: "#000",
                  }}
                >
                  {tier.cta}
                </div>
              )}

              {/* Card container with overflow hidden */}
              <div
                className="relative rounded-2xl md:rounded-3xl overflow-hidden h-full"
                style={{
                  background: tier.highlighted
                    ? `linear-gradient(145deg, rgba(255,200,150,0.12) 0%, rgba(255,200,150,0.04) 100%)`
                    : "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                  border: tier.highlighted
                    ? `1px solid ${accentColor}40`
                    : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Background number - hide for single card */}
                {pricing.length > 1 && (
                  <div
                    className="absolute -right-4 -top-4 text-[180px] md:text-[220px] font-black leading-none pointer-events-none select-none"
                    style={{
                      WebkitTextStroke: tier.highlighted
                        ? `1px rgba(255,200,150,0.1)`
                        : `1px rgba(255,255,255,0.04)`,
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                )}

                {/* Content - different layout for single card */}
                <div className={`relative h-full ${
                  pricing.length === 1
                    ? "p-8 md:p-12 lg:p-16 flex flex-col md:flex-row md:items-start gap-8 md:gap-16"
                    : "p-8 md:p-10 flex flex-col"
                }`}>
                  {/* Left side - Title, price, description, CTA */}
                  <div className={`${pricing.length === 1 ? "md:w-1/2 flex flex-col" : ""}`}>
                    {/* Tier name */}
                    <h3
                      className={`font-semibold mb-2 ${pricing.length === 1 ? "text-xl md:text-2xl" : "text-lg"}`}
                      style={{ color: tier.highlighted ? accentColor : "white" }}
                    >
                      {tier.name}
                    </h3>

                    {/* Price */}
                    <div className={`${pricing.length === 1 ? "mb-6" : "mb-4 min-h-[72px] md:min-h-[80px]"}`}>
                      <span className={`font-black text-white ${pricing.length === 1 ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"}`}>
                        {tier.price}
                      </span>
                    </div>

                    {/* Description */}
                    <p className={`text-white/50 ${pricing.length === 1 ? "text-base md:text-lg mb-8 max-w-md" : "text-sm mb-8 min-h-[40px]"}`}>
                      {tier.description}
                    </p>

                    {/* CTA Button - only show on left for single card */}
                    {pricing.length === 1 && (
                      <motion.div
                        className="inline-flex py-4 px-8 rounded-xl font-semibold text-sm transition-all duration-300 text-center"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}, rgba(255, 180, 120, 1))`,
                          color: "#000",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {tier.cta}
                      </motion.div>
                    )}
                  </div>

                  {/* Right side - Features */}
                  <div className={`${pricing.length === 1 ? "md:w-1/2" : "grow"}`}>
                    {pricing.length === 1 && (
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
                        What&apos;s Included
                      </p>
                    )}

                    {/* Features */}
                    <ul className={`${pricing.length === 1 ? "grid grid-cols-1 gap-4" : "space-y-3 mb-8"}`}>
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span
                            className={`rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              pricing.length === 1 ? "w-6 h-6" : "w-5 h-5"
                            }`}
                            style={{
                              background: tier.highlighted
                                ? `${accentColor}20`
                                : "rgba(255,255,255,0.1)",
                              border: tier.highlighted
                                ? `1px solid ${accentColor}40`
                                : "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            <svg
                              width={pricing.length === 1 ? "12" : "10"}
                              height={pricing.length === 1 ? "12" : "10"}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke={tier.highlighted ? accentColor : "rgba(255,255,255,0.5)"}
                              strokeWidth="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span className={`text-white/70 ${pricing.length === 1 ? "text-base" : "text-sm"}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button - only for multiple cards layout */}
                    {pricing.length > 1 && (
                      <div className="mt-auto">
                        <motion.div
                          className="w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 text-center"
                          style={{
                            background: tier.highlighted
                              ? `linear-gradient(135deg, ${accentColor}, rgba(255, 180, 120, 1))`
                              : "rgba(255,255,255,0.08)",
                            color: tier.highlighted ? "#000" : "white",
                            border: tier.highlighted
                              ? "none"
                              : "1px solid rgba(255,255,255,0.1)",
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {tier.highlighted ? "Get Started" : tier.cta}
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative elements for single card */}
                {pricing.length === 1 && (
                  <>
                    {/* Corner accent */}
                    <div
                      className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 100% 0%, ${accentColor}15, transparent 70%)`,
                      }}
                    />
                    {/* Bottom accent */}
                    <div
                      className="absolute bottom-0 left-0 w-96 h-48 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at 0% 100%, ${accentColor}10, transparent 70%)`,
                      }}
                    />
                  </>
                )}

                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 100%, ${accentColor}15, transparent 60%)`,
                  }}
                />

                {/* Border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: tier.highlighted
                      ? `inset 0 0 0 1px ${accentColor}60, 0 0 40px ${accentColor}20`
                      : `inset 0 0 0 1px ${accentColor}30`,
                  }}
                />
              </div>
            </TransitionLink>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-white/30 text-sm mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          All prices are starting points. Final quote based on project scope. Payment plans available.
        </motion.p>
      </div>
    </section>
  );
}

// ============================================================================
// RELATED PROJECTS SECTION
// ============================================================================
function RelatedProjectsSection({
  relatedProjects,
}: {
  relatedProjects: ReturnType<typeof getRelatedProjects>;
}) {
  const { play } = useSound();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (relatedProjects.length === 0) return null;

  return (
    <section className="relative py-32 md:py-48 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <span
              className="text-xs uppercase tracking-[0.3em] mb-4 block"
              style={{ color: accentColorMuted }}
            >
              Related Work
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.04em]">
              See It In Action
            </h2>
          </div>
          <TransitionLink
            href="/work"
            className="hidden md:flex items-center gap-2 text-sm uppercase tracking-wider group"
            style={{ color: accentColor }}
          >
            <span>View All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </TransitionLink>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {relatedProjects.slice(0, 2).map((project, i) => (
            <motion.div
              key={project.slug}
              onMouseEnter={() => {
                setHoveredIndex(i);
                play("hover", { volume: 0.05 });
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <TransitionLink
                href={`/work/${project.slug}`}
                className="block relative aspect-[4/3] rounded-2xl overflow-hidden group"
              >
                {/* Image */}
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700"
                  style={{
                    transform: hoveredIndex === i ? "scale(1.05)" : "scale(1)",
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)",
                    opacity: hoveredIndex === i ? 0.6 : 1,
                  }}
                />

                {/* Border glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === i ? 1 : 0 }}
                  style={{
                    boxShadow: `inset 0 0 0 1px ${accentColorMuted}`,
                  }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="text-xs uppercase tracking-wider text-white/50 mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {project.title}
                  </h3>
                </div>
              </TransitionLink>
            </motion.div>
          ))}
        </div>

        {/* Mobile view all link */}
        <div className="mt-8 md:hidden">
          <TransitionLink
            href="/work"
            className="flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            <span>View All Work</span>
            <span>→</span>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================
function CTASection() {
  const { play } = useSound();

  return (
    <section className="relative py-32 md:py-48 bg-transparent overflow-hidden">
      {/* Background effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 100%, ${accentColor}10, transparent)`,
        }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 text-center relative z-10">
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-[-0.04em] mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Ready to Start?
        </motion.h2>
        <motion.p
          className="text-xl md:text-2xl text-white/50 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Let&apos;s discuss how we can help transform your digital presence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <TransitionLink href="/contact">
            <motion.button
              className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, rgba(255, 180, 120, 1))`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                }}
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />
              <span className="relative z-10 text-black font-semibold text-lg">
                Get in Touch
              </span>
              <span className="relative z-10 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </motion.button>
          </TransitionLink>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const service = getServiceBySlug(resolvedParams.slug);

  if (!service) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(service.relatedProjects);

  return (
    <>
      {/* CSS for floating background animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10%, 5%) rotate(1deg);
          }
          50% {
            transform: translate(5%, 10%) rotate(-1deg);
          }
          75% {
            transform: translate(-5%, 5%) rotate(0.5deg);
          }
        }
        @keyframes float-reverse {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(-8%, 8%) rotate(-1deg);
          }
          50% {
            transform: translate(-3%, -5%) rotate(1deg);
          }
          75% {
            transform: translate(5%, -3%) rotate(-0.5deg);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
      `}</style>

      <Navbar />

      <main className="relative bg-[#0a0908] overflow-hidden" style={{ zIndex: 10 }}>
        {/* Moving background elements - fixed but contained by main's z-index */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {/* Large gradient orb 1 */}
          <div
            className="absolute w-[800px] h-[800px] rounded-full opacity-30"
            style={{
              background: `radial-gradient(circle, ${accentColorMuted} 0%, transparent 70%)`,
              top: "-20%",
              right: "-10%",
              filter: "blur(80px)",
              animation: "float 20s ease-in-out infinite",
            }}
          />
          {/* Large gradient orb 2 */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(255, 180, 120, 0.4) 0%, transparent 70%)",
              bottom: "10%",
              left: "-15%",
              filter: "blur(60px)",
              animation: "float 25s ease-in-out infinite reverse",
            }}
          />
          {/* Smaller accent orb */}
          <div
            className="absolute w-[400px] h-[400px] rounded-full opacity-15"
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
              top: "40%",
              left: "60%",
              filter: "blur(100px)",
              animation: "float 18s ease-in-out infinite",
              animationDelay: "-5s",
            }}
          />
        </div>
        {/* Cinematic Hero */}
        <CinematicHero service={service} />

        {/* Kinetic Marquee - transparent to show glassmorphic background */}
        <section className="py-16 md:py-24 overflow-hidden bg-transparent relative">
          <KineticMarquee text={`${service.title} •`} />
        </section>

        {/* Description with word reveal */}
        <DescriptionSection service={service} />

        {/* Vertical Timeline Process */}
        <VerticalTimelineSection service={service} />

        {/* Benefits */}
        <BenefitsSection service={service} />

        {/* Pricing */}
        <PricingSection pricing={service.pricing} />

        {/* Kinetic Marquee 2 - transparent to show glassmorphic background */}
        <section className="py-16 md:py-24 overflow-hidden bg-transparent relative">
          <KineticMarquee text="MORE LEADS • MORE SALES • MORE GROWTH •" direction={1} />
        </section>

        {/* Related Projects */}
        <RelatedProjectsSection relatedProjects={relatedProjects} />

        {/* CTA */}
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
