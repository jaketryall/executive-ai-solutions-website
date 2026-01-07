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
  },
];

// Service Section within the card
function ServiceSection({
  service,
  index,
  isLast,
  scrollYProgress,
}: {
  service: typeof services[0];
  index: number;
  isLast: boolean;
  scrollYProgress: import("framer-motion").MotionValue<number>;
}) {
  // Staggered scroll-driven transforms for each section
  const sectionStart = 0.1 + index * 0.15;
  const numberY = useTransform(scrollYProgress, [sectionStart, sectionStart + 0.2], [30, 0]);
  const numberOpacity = useTransform(scrollYProgress, [sectionStart, sectionStart + 0.15], [0, 1]);
  const contentY = useTransform(scrollYProgress, [sectionStart + 0.05, sectionStart + 0.25], [20, 0]);
  const contentOpacity = useTransform(scrollYProgress, [sectionStart + 0.05, sectionStart + 0.2], [0, 1]);

  return (
    <div className={`relative ${!isLast ? "border-b border-white/5" : ""}`}>
      {/* Section content */}
      <div className="py-10 md:py-14 px-8 md:px-12">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left - Number */}
          <motion.div
            className="md:col-span-2"
            style={{ y: numberY, opacity: numberOpacity }}
          >
            <span
              className="text-5xl md:text-6xl font-black"
              style={{ color: accentColor }}
            >
              {service.number}
            </span>
          </motion.div>

          {/* Middle - Title & Description */}
          <motion.div
            className="md:col-span-5"
            style={{ y: contentY, opacity: contentOpacity }}
          >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-[-0.02em] text-white mb-2">
              {service.title}
            </h3>
            <p
              className="text-xs md:text-sm uppercase tracking-[0.2em] mb-6"
              style={{ color: accentColorMuted }}
            >
              {service.subtitle}
            </p>
            <p className="text-white/60 text-base md:text-lg leading-relaxed">
              {service.description}
            </p>
          </motion.div>

          {/* Right - Details */}
          <motion.div
            className="md:col-span-5"
            style={{ y: contentY, opacity: contentOpacity }}
          >
            <div className="space-y-4">
              {service.details.map((detail, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4"
                >
                  <span
                    className="text-lg font-light mt-0.5"
                    style={{ color: accentColorMuted }}
                  >
                    —
                  </span>
                  <span className="text-white/50 text-sm md:text-base tracking-wide">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: headerScrollProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: cardScrollProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Card entrance animation
  const cardY = useTransform(cardScrollProgress, [0, 0.3], [60, 0]);
  const cardOpacity = useTransform(cardScrollProgress, [0, 0.2], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 md:py-32"
      style={{
        zIndex: 10,
        background: "linear-gradient(180deg, #0a0908 0%, #0d0b09 50%, #0a0908 100%)",
      }}
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
            scrollYProgress={headerScrollProgress}
            startOffset={0}
          />
          <br />
          <ScrollRevealText
            text="CREATE"
            scrollYProgress={headerScrollProgress}
            startOffset={0.15}
            dimmed
          />
        </h2>
      </div>

      {/* Services Card */}
      <div className="px-6 md:px-12 lg:px-16">
        <motion.div
          ref={cardRef}
          className="relative rounded-2xl md:rounded-3xl overflow-hidden"
          style={{
            y: cardY,
            opacity: cardOpacity,
            background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Warm ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 200, 150, 0.06) 0%, transparent 60%)`,
            }}
          />

          {/* Card content */}
          <div className="relative">
            {services.map((service, index) => (
              <ServiceSection
                key={service.number}
                service={service}
                index={index}
                isLast={index === services.length - 1}
                scrollYProgress={cardScrollProgress}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="relative border-t border-white/5 px-8 md:px-12 py-8 md:py-10">
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-4 text-lg tracking-wide group"
              style={{ color: accentColor }}
              whileHover={{ x: 8 }}
            >
              <span>Start a project</span>
              {/* Arrow with diagonal slide on hover */}
              <span className="relative w-5 h-5 overflow-hidden inline-block">
                <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:translate-x-full group-hover:-translate-y-full">→</span>
                <span className="absolute inset-0 flex items-center justify-center -translate-x-full translate-y-full transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0">→</span>
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
