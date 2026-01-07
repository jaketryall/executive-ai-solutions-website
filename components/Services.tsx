"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)"; // Warm champagne
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Scroll-driven letter reveal component
function ScrollRevealText({
  text,
  className,
  scrollYProgress,
  startOffset = 0,
  dimmed = false,
}: {
  text: string;
  className?: string;
  scrollYProgress: import("framer-motion").MotionValue<number>;
  startOffset?: number;
  dimmed?: boolean;
}) {
  const letters = text.split("");
  const totalLetters = letters.length;

  return (
    <span className={`inline-flex flex-wrap ${className || ""}`}>
      {letters.map((letter, index) => {
        // Each letter reveals at a staggered scroll position
        const letterStart = startOffset + (index / totalLetters) * 0.4;
        const letterEnd = letterStart + 0.15;

        return (
          <ScrollLetter
            key={index}
            letter={letter}
            scrollYProgress={scrollYProgress}
            start={letterStart}
            end={letterEnd}
            dimmed={dimmed}
          />
        );
      })}
    </span>
  );
}

function ScrollLetter({
  letter,
  scrollYProgress,
  start,
  end,
  dimmed,
}: {
  letter: string;
  scrollYProgress: import("framer-motion").MotionValue<number>;
  start: number;
  end: number;
  dimmed: boolean;
}) {
  // Transform scroll progress to Y translation (-100% to 0%)
  const y = useTransform(scrollYProgress, [start, end], ["100%", "0%"]);

  if (letter === " ") {
    return <span className="inline-block w-[0.3em]">&nbsp;</span>;
  }

  return (
    <span className="relative inline-block overflow-hidden">
      {/* Hidden letter for sizing */}
      <span className="invisible">{letter}</span>

      {/* Top letter (scrolls down from above) */}
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          y,
          color: dimmed ? "rgba(255,255,255,0.3)" : "#ffffff",
        }}
      >
        {letter}
      </motion.span>

      {/* Bottom letter (the one being replaced) - starts visible, scrolls down and out */}
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          y: useTransform(y, (v) => {
            const numValue = parseFloat(v);
            return `${numValue - 100}%`;
          }),
          color: dimmed ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
        }}
      >
        {letter}
      </motion.span>
    </span>
  );
}

const services = [
  {
    number: "01",
    title: "STRATEGY",
    subtitle: "The Blueprint",
    description: "Every frame tells a story. We architect digital experiences that captivate from the first moment.",
    details: [
      "Audience psychology & journey mapping",
      "Conversion-focused experience design",
      "Strategic narrative development",
    ],
    color: "rgba(255, 220, 180, 0.08)",
  },
  {
    number: "02",
    title: "CRAFT",
    subtitle: "The Production",
    description: "Where vision meets execution. Custom-built systems engineered for performance and polish.",
    details: [
      "Bespoke animation systems",
      "Performance-first development",
      "Seamless interactions",
    ],
    color: "rgba(255, 200, 150, 0.08)",
  },
  {
    number: "03",
    title: "LEGACY",
    subtitle: "The Premiere",
    description: "A website is a living story. We ensure your digital presence evolves with your ambitions.",
    details: [
      "Strategic visibility",
      "Scalable architecture",
      "Continuous refinement",
    ],
    color: "rgba(255, 180, 120, 0.08)",
  },
];

// Service Item Component - Always expanded
function ServiceItem({
  service,
  index,
}: {
  service: typeof services[0];
  index: number;
}) {
  return (
    <motion.div
      className="relative overflow-hidden border-t border-white/10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Warm ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 120% 80% at 50% 20%, ${service.color} 0%, transparent 60%)`,
        }}
      />

      {/* Warm accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{
          background: `linear-gradient(to bottom, ${accentColor}, ${accentColorMuted})`,
          opacity: 0.8,
        }}
      />

      {/* Header */}
      <div className="relative w-full py-10 md:py-12 flex items-center px-8 md:px-16">
        {/* Left side - Number and Title */}
        <div className="flex items-center gap-8 md:gap-16">
          {/* Number */}
          <span
            className="text-5xl md:text-7xl font-black"
            style={{ color: accentColor }}
          >
            {service.number}
          </span>

          {/* Title */}
          <div className="text-left">
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-white">
              {service.title}
            </h3>
            <p
              className="text-sm md:text-base uppercase tracking-[0.2em] mt-2"
              style={{ color: accentColorMuted }}
            >
              {service.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Content - Always visible */}
      <div className="px-8 md:px-16 pb-12 md:pb-16">
        <div className="grid md:grid-cols-2 gap-10 md:gap-24">
          {/* Left - Description */}
          <div className="md:pl-[calc(5rem+64px)]">
            <p className="text-white/70 text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 font-light">
              {service.description}
            </p>

            {/* CTA */}
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-4 text-lg tracking-wide group"
              style={{ color: accentColor }}
              whileHover={{ x: 8 }}
            >
              <span>Start a project</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </motion.a>
          </div>

          {/* Right - Details */}
          <div className="space-y-5">
            {service.details.map((detail, i) => (
              <div
                key={i}
                className="flex items-start gap-5"
              >
                <span
                  className="text-2xl font-light mt-0.5"
                  style={{ color: accentColorMuted }}
                >
                  —
                </span>
                <span className="text-white/60 text-base md:text-lg lg:text-xl tracking-wide">
                  {detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      id="services"
      className="relative bg-black py-24 md:py-32"
      style={{ zIndex: 10 }}
    >
      {/* Header */}
      <div ref={headerRef} className="px-8 md:px-16 mb-16 md:mb-20">
        <motion.p
          className="text-sm md:text-base uppercase tracking-[0.3em] mb-6"
          style={{ color: accentColorMuted }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Services
        </motion.p>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-[-0.04em]">
          <ScrollRevealText
            text="WHAT WE"
            scrollYProgress={scrollYProgress}
            startOffset={0}
          />
          <br />
          <ScrollRevealText
            text="CREATE"
            scrollYProgress={scrollYProgress}
            startOffset={0.15}
            dimmed
          />
        </h2>
      </div>

      {/* Services List */}
      <div className="border-b border-white/10">
        {services.map((service, index) => (
          <ServiceItem
            key={service.number}
            service={service}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
