"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    number: "01",
    title: "STRATEGY",
    subtitle: "Digital Architecture",
    specs: [
      "USER PSYCHOLOGY MAPPING",
      "CONVERSION PATHWAY DESIGN",
      "ROI-DRIVEN PLANNING",
    ],
    legend: "We define the digital architecture before a single line of code is written. ROI is the North Star.",
    color: "rgba(0, 150, 255, 0.15)",
  },
  {
    number: "02",
    title: "ENGINEERING",
    subtitle: "Custom Development",
    specs: [
      "BESPOKE GSAP SYSTEMS",
      "ZERO DEPENDENCIES",
      "LIGHTNING PERFORMANCE",
    ],
    legend: "Bespoke GSAP systems. Zero dependencies. Lightning-fast performance built from the ground up.",
    color: "rgba(255, 180, 80, 0.12)",
  },
  {
    number: "03",
    title: "EVOLUTION",
    subtitle: "Continuous Growth",
    specs: [
      "HIGH-CONVERSION SEO",
      "SCALABLE ARCHITECTURE",
      "CONTINUOUS ITERATION",
    ],
    legend: "A website is a living asset. We build for scalability, ensuring your platform grows with your revenue.",
    color: "rgba(0, 255, 200, 0.12)",
  },
];

// Accordion Item Component
function AccordionItem({
  service,
  index,
  isExpanded,
  expandProgress,
}: {
  service: typeof services[0];
  index: number;
  isExpanded: boolean;
  expandProgress: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  // Calculate heights - collapsed shows just header, expanded shows full content
  const collapsedHeight = 120; // Header height in pixels
  const expandedHeight = 500; // Full expanded height

  return (
    <motion.div
      ref={itemRef}
      className="accordion-item relative overflow-hidden border-b border-white/10"
      style={{
        height: `${collapsedHeight + (expandedHeight - collapsedHeight) * expandProgress}px`,
      }}
    >
      {/* Background glow when expanded */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 100% 100% at 50% 0%, ${service.color} 0%, transparent 70%)`,
          opacity: expandProgress,
        }}
      />

      {/* Header - Always visible */}
      <div className="relative h-[120px] flex items-center justify-between px-8 md:px-16 cursor-pointer">
        {/* Left side - Number and Title */}
        <div className="flex items-center gap-8 md:gap-16">
          {/* Number */}
          <motion.span
            className="text-4xl md:text-6xl font-black font-mono"
            style={{
              color: isExpanded ? "#00f0ff" : "rgba(255,255,255,0.2)",
            }}
          >
            {service.number}
          </motion.span>

          {/* Title */}
          <div>
            <motion.h3
              className="text-3xl md:text-5xl font-black tracking-[-0.02em]"
              style={{
                color: isExpanded ? "#ffffff" : "rgba(255,255,255,0.5)",
              }}
            >
              {service.title}
            </motion.h3>
            <motion.p
              className="text-xs md:text-sm font-mono uppercase tracking-widest mt-1"
              style={{
                color: isExpanded ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
              }}
            >
              {service.subtitle}
            </motion.p>
          </div>
        </div>

        {/* Right side - Expand indicator */}
        <motion.div
          className="w-12 h-12 rounded-full border flex items-center justify-center"
          style={{
            borderColor: isExpanded ? "#00f0ff" : "rgba(255,255,255,0.2)",
          }}
        >
          <motion.div
            style={{
              rotate: expandProgress * 180,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isExpanded ? "#00f0ff" : "rgba(255,255,255,0.4)"}
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Expandable Content */}
      <motion.div
        className="relative px-8 md:px-16 pb-12"
        style={{
          opacity: expandProgress,
          transform: `translateY(${(1 - expandProgress) * 30}px)`,
        }}
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Left - Description */}
          <div className="md:pl-[calc(4rem+64px)]">
            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-8">
              {service.legend}
            </p>

            {/* CTA Button */}
            <motion.button
              className="group flex items-center gap-3 text-[#00f0ff] font-mono text-sm uppercase tracking-widest"
              whileHover={{ x: 5 }}
            >
              <span>Learn More</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </div>

          {/* Right - Specs */}
          <div className="space-y-4">
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-6">
              Capabilities
            </p>
            {service.specs.map((spec, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4 text-white/70 font-mono text-sm md:text-base"
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: expandProgress > 0.5 ? 1 : 0,
                  x: expandProgress > 0.5 ? 0 : 20,
                }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-[#00f0ff]/50">[{String(i + 1).padStart(2, "0")}]</span>
                <span className="tracking-wider">{spec}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative line */}
        <motion.div
          className="absolute bottom-0 left-8 md:left-16 right-8 md:right-16 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${service.color.replace('0.12', '0.3').replace('0.15', '0.3')} 50%, transparent 100%)`,
            scaleX: expandProgress,
          }}
        />
      </motion.div>

      {/* Progress bar for current item */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f0ff]"
        style={{
          scaleY: expandProgress,
          transformOrigin: "top",
          boxShadow: "0 0 20px rgba(0, 240, 255, 0.5)",
        }}
      />
    </motion.div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [expandedStates, setExpandedStates] = useState<number[]>(services.map(() => 0));
  const [activeIndex, setActiveIndex] = useState(0);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!accordionRef.current || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const items = accordionRef.current.querySelectorAll(".accordion-item");

    const ctx = gsap.context(() => {
      // Create a ScrollTrigger for each accordion item
      items.forEach((item, index) => {
        // Calculate the scroll range for each item
        const itemStart = index / services.length;
        const itemEnd = (index + 1) / services.length;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;

            // Determine expand progress for this item
            let expandProgress = 0;

            if (progress >= itemStart && progress < itemEnd) {
              // Currently in this item's range
              const localProgress = (progress - itemStart) / (itemEnd - itemStart);

              // Expand quickly, stay expanded, collapse at end
              if (localProgress < 0.2) {
                expandProgress = localProgress / 0.2; // Expand 0->1
              } else if (localProgress < 0.8) {
                expandProgress = 1; // Stay fully expanded
              } else {
                expandProgress = 1 - (localProgress - 0.8) / 0.2; // Collapse 1->0
              }

              setActiveIndex(index);
            } else if (progress < itemStart) {
              // Before this item
              expandProgress = 0;
            } else {
              // After this item
              expandProgress = 0;
            }

            setExpandedStates((prev) => {
              const newStates = [...prev];
              newStates[index] = expandProgress;
              return newStates;
            });
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-black"
      style={{ zIndex: 10, minHeight: `${100 + services.length * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 min-h-screen flex flex-col">
        {/* Header */}
        <div className="pt-24 pb-12 px-8 md:px-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#00f0ff]/50" />
            <span className="text-[#00f0ff]/60 text-xs font-mono tracking-[0.3em] uppercase">
              Our Services
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-[-0.03em]">
            WHAT WE DO
          </h2>
        </div>

        {/* Accordion */}
        <div
          ref={accordionRef}
          className="flex-1 border-t border-white/10"
        >
          {services.map((service, index) => (
            <AccordionItem
              key={service.number}
              service={service}
              index={index}
              isExpanded={expandedStates[index] > 0.5}
              expandProgress={expandedStates[index]}
            />
          ))}
        </div>

        {/* Progress indicator */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
          {services.map((service, index) => (
            <div key={index} className="flex items-center gap-3">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: activeIndex === index ? "#00f0ff" : "rgba(255,255,255,0.2)",
                  boxShadow: activeIndex === index ? "0 0 10px #00f0ff" : "none",
                }}
              />
              <motion.span
                className="text-xs font-mono"
                style={{
                  color: activeIndex === index ? "#00f0ff" : "rgba(255,255,255,0.3)",
                }}
              >
                {service.number}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
