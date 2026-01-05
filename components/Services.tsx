"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "./SoundManager";

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)"; // Warm champagne
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

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

// Accordion Item Component - Click to expand
function ServiceItem({
  service,
  index,
  isExpanded,
  onToggle,
}: {
  service: typeof services[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { play } = useSound();

  return (
    <motion.div
      className="relative overflow-hidden border-t border-white/10"
      initial={false}
    >
      {/* Warm ambient glow when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: `radial-gradient(ellipse 120% 80% at 50% 20%, ${service.color} 0%, transparent 60%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Warm accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          background: `linear-gradient(to bottom, ${accentColor}, ${accentColorMuted})`,
          transformOrigin: "top",
          opacity: 0.8,
        }}
      />

      {/* Header - Clickable */}
      <button
        onClick={() => {
          play("hover", { volume: 0.06 });
          onToggle();
        }}
        className="relative w-full py-10 md:py-12 flex items-center justify-between px-8 md:px-16 cursor-pointer group"
      >
        {/* Left side - Number and Title */}
        <div className="flex items-center gap-8 md:gap-16">
          {/* Number */}
          <motion.span
            className="text-5xl md:text-7xl font-black"
            animate={{
              color: isExpanded ? accentColor : "rgba(255,255,255,0.15)",
            }}
            transition={{ duration: 0.4 }}
          >
            {service.number}
          </motion.span>

          {/* Title */}
          <div className="text-left">
            <motion.h3
              className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em]"
              animate={{
                color: isExpanded ? "#ffffff" : "rgba(255,255,255,0.4)",
              }}
              transition={{ duration: 0.4 }}
            >
              {service.title}
            </motion.h3>
            <motion.p
              className="text-sm md:text-base uppercase tracking-[0.2em] mt-2"
              animate={{
                color: isExpanded ? accentColorMuted : "rgba(255,255,255,0.2)",
              }}
              transition={{ duration: 0.4 }}
            >
              {service.subtitle}
            </motion.p>
          </div>
        </div>

        {/* Right side - Expand indicator */}
        <motion.div
          className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center"
          animate={{
            borderColor: isExpanded ? accentColor : "rgba(255,255,255,0.15)",
          }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
            >
              <motion.path
                d="M6 9l6 6 6-6"
                animate={{
                  stroke: isExpanded ? accentColor : "rgba(255,255,255,0.3)",
                }}
                transition={{ duration: 0.4 }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-8 md:px-16 pb-12 md:pb-16">
              <div className="grid md:grid-cols-2 gap-10 md:gap-24">
                {/* Left - Description */}
                <div className="md:pl-[calc(5rem+64px)]">
                  <motion.p
                    className="text-white/70 text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    {service.description}
                  </motion.p>

                  {/* CTA */}
                  <motion.a
                    href="#contact"
                    className="inline-flex items-center gap-4 text-lg tracking-wide group"
                    style={{ color: accentColor }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
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
                    <motion.div
                      key={i}
                      className="flex items-start gap-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
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
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Services() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      id="services"
      className="relative bg-black py-24 md:py-32"
      style={{ zIndex: 10 }}
    >
      {/* Header */}
      <div className="px-8 md:px-16 mb-16 md:mb-20">
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
        <motion.h2
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-[-0.04em]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          WHAT WE
          <br />
          <span className="text-white/30">CREATE</span>
        </motion.h2>
      </div>

      {/* Accordion */}
      <div className="border-b border-white/10">
        {services.map((service, index) => (
          <ServiceItem
            key={service.number}
            service={service}
            index={index}
            isExpanded={expandedIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  );
}
