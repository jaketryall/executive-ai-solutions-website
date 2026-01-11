"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { TransitionLink } from "@/components/PageTransition";

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
        // Each letter reveals at a staggered scroll position - faster animation
        const letterStart = startOffset + (index / totalLetters) * 0.25;
        const letterEnd = letterStart + 0.08;

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
    slug: "website-design",
    number: "01",
    title: "Website Design & Development",
    description: "High-converting websites built to grow your business. From stunning landing pages to full-scale platforms, we craft digital experiences that turn visitors into customers.",
    tags: [
      "Custom Design",
      "Responsive Development",
      "E-commerce",
      "Landing Pages",
      "Performance Optimization",
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    slug: "seo",
    number: "02",
    title: "Search Engine Optimization",
    description: "Get found by the people who matter most. We build data-driven SEO strategies that drive organic traffic, improve rankings, and deliver measurable results.",
    tags: [
      "Technical SEO",
      "Content Strategy",
      "Local SEO",
      "Analytics & Reporting",
      "Keyword Research",
    ],
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    slug: "custom-solutions",
    number: "03",
    title: "Custom Business Solutions",
    description: "Streamline your operations with tailored software solutions. From CRM systems to workflow automation, we build the tools your business needs to scale efficiently.",
    tags: [
      "CRM Development",
      "Workflow Automation",
      "API Integrations",
      "Database Design",
      "Business Intelligence",
    ],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
];

// Service Row Component - Jason Zubiate style
function ServiceRow({
  service,
  index,
  isLast,
}: {
  service: typeof services[0];
  index: number;
  isLast: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <motion.div
      ref={rowRef}
      className={`relative ${!isLast ? "border-b border-white/10" : ""}`}
      style={{ opacity, y }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(ellipse 100% 100% at 80% 50%, rgba(255, 200, 150, 0.04) 0%, transparent 70%)`,
        }}
      />

      {/* Row content */}
      <div className="relative py-12 md:py-16 px-8 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Number */}
          <div className="col-span-12 md:col-span-1">
            <span className="text-white/30 text-sm font-medium">
              {service.number}
            </span>
          </div>

          {/* Title & Description */}
          <div className="col-span-12 md:col-span-5">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.02em] text-white mb-4">
              {service.title}
            </h3>
            <p className="text-white/50 text-base md:text-lg leading-relaxed mb-4">
              {service.description}
            </p>
            <TransitionLink href={`/services/${service.slug}`}>
              <motion.span
                className="inline-flex items-center gap-2 text-sm tracking-wide group/link cursor-pointer"
                style={{ color: accentColor }}
                whileHover={{ x: 4 }}
              >
                <span>Learn more</span>
                <span className="relative w-4 h-4 overflow-hidden inline-block">
                  <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover/link:translate-x-full group-hover/link:-translate-y-full">→</span>
                  <span className="absolute inset-0 flex items-center justify-center -translate-x-full translate-y-full transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:translate-y-0">→</span>
                </span>
              </motion.span>
            </TransitionLink>
          </div>

          {/* Tags */}
          <div className="col-span-8 md:col-span-4">
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-block px-3 py-1.5 text-xs uppercase tracking-wider text-white/70 bg-white/5 border border-white/15 rounded-sm hover:bg-white/10 hover:border-white/25 hover:text-white transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="col-span-4 md:col-span-2 flex justify-end">
            <motion.div
              className="relative w-full max-w-[160px] aspect-4/3 overflow-hidden rounded-sm"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                sizes="160px"
              />
              {/* Warm overlay on hover */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.2 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: accentColor }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: headerScrollProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-24 md:py-32 rounded-3xl md:rounded-[3rem] md:-mt-[70vh]"
      style={{
        zIndex: 20,
        background: "linear-gradient(180deg, #0a0908 0%, #0d0b09 50%, #0a0908 100%)",
        boxShadow: "0 -30px 60px -10px rgba(0,0,0,0.6)",
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
            startOffset={0.1}
            dimmed
          />
        </h2>
      </div>

      {/* Services List */}
      <div className="mx-6 md:mx-12 lg:mx-16">
        <div
          className="relative rounded-2xl md:rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Warm ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 200, 150, 0.04) 0%, transparent 60%)`,
            }}
          />

          {/* Service rows */}
          <div className="relative">
            {services.map((service, index) => (
              <ServiceRow
                key={service.number}
                service={service}
                index={index}
                isLast={index === services.length - 1}
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
        </div>
      </div>
    </section>
  );
}
