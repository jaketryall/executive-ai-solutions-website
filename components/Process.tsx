"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// Smooth easing curve
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const steps = [
  {
    id: 0,
    number: "01",
    title: "Discovery",
    subtitle: "Day 1-2",
    description: "Deep dive into your business, goals, and vision.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 1,
    number: "02",
    title: "Design",
    subtitle: "Day 3-7",
    description: "Pixel-perfect mockups tailored to your brand.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    id: 2,
    number: "03",
    title: "Develop",
    subtitle: "Day 8-12",
    description: "Clean code, smooth animations, fast performance.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    id: 3,
    number: "04",
    title: "Launch",
    subtitle: "Day 13-14",
    description: "Go live with 30 days of support included.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.2"],
  });

  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.8", "end 0.5"],
  });

  // UNIQUE TRANSITION: Paper Unfold Effect
  // Section unfolds from the top like a piece of paper being lowered
  const rotateX = useTransform(sectionProgress, [0, 0.6], ["-25deg", "0deg"]);
  const perspectiveOrigin = useTransform(
    sectionProgress,
    [0, 1],
    ["50% 0%", "50% 50%"]
  );
  const unfoldOpacity = useTransform(sectionProgress, [0, 0.3], [0, 1]);
  const unfoldY = useTransform(sectionProgress, [0, 0.8], [-60, 0]);
  const unfoldScale = useTransform(sectionProgress, [0, 0.6], [0.95, 1]);

  // Crease shadow that fades as it unfolds
  const creaseShadowOpacity = useTransform(sectionProgress, [0, 0.5, 0.8], [0.6, 0.3, 0]);
  const creaseY = useTransform(sectionProgress, [0, 0.6], ["5%", "0%"]);

  // Ambient light that shifts as section unfolds
  const lightGradientAngle = useTransform(sectionProgress, [0, 1], [180, 135]);

  // Border radius morph
  const borderRadius = useTransform(sectionProgress, [0, 1], ["5rem", "3rem"]);

  // Timeline line progress
  const lineWidth = useTransform(timelineProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.section
      ref={sectionRef}
      id="process"
      className="relative bg-[#0a0a0a] -mt-12 z-60 shadow-section-stack overflow-hidden"
      style={{
        opacity: unfoldOpacity,
        y: unfoldY,
        scale: unfoldScale,
        rotateX,
        transformPerspective: 1200,
        transformOrigin: "top center",
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
      }}
    >
      {/* Paper fold crease shadow effect */}
      <motion.div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none z-10"
        style={{
          opacity: creaseShadowOpacity,
          y: creaseY,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
        }}
      />

      {/* Ambient light gradient that shifts during unfold */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            lightGradientAngle,
            (angle) =>
              `linear-gradient(${angle}deg, rgba(184,154,94,0.03) 0%, transparent 40%, transparent 60%, rgba(184,154,94,0.02) 100%)`
          ),
        }}
      />
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-20 pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="text-[#b89a5e] text-sm font-medium tracking-wider uppercase mb-4"
            >
              How It Works
            </motion.p>

            <div className="overflow-hidden mb-6">
              <motion.h2
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              >
                From idea to launch
                <br />
                <span className="text-[#b89a5e]">in 2 weeks</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
              className="text-xl text-zinc-400 leading-relaxed"
            >
              A streamlined 4-step process designed to get your project live
              fast, without cutting corners.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="px-6 md:px-12 lg:px-20 pb-32">
        <div className="max-w-[1400px] mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            {/* Timeline track */}
            <div className="absolute top-[60px] left-0 right-0 h-[2px] bg-zinc-800">
              <motion.div
                className="h-full bg-gradient-to-r from-[#9a7b3c] to-[#b89a5e]"
                style={{ width: lineWidth }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => {
                // Calculate when this step should activate
                const stepStart = index / 4;
                const stepEnd = (index + 1) / 4;

                return (
                  <TimelineStep
                    key={step.id}
                    step={step}
                    index={index}
                    progress={timelineProgress}
                    stepStart={stepStart}
                    stepEnd={stepEnd}
                  />
                );
              })}
            </div>
          </div>

          {/* Mobile Timeline - Vertical */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => (
              <MobileTimelineStep key={step.id} step={step} index={index} isLast={index === steps.length - 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 md:px-12 lg:px-20 pb-32">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-10 md:p-16 rounded-3xl bg-zinc-900/50 border border-zinc-800 overflow-hidden"
          >
            {/* Background gradient */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, rgba(154, 123, 60, 0.15) 0%, transparent 60%)",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Ready to get started?
                </h3>
                <p className="text-zinc-400 text-lg">
                  Book a free 30-minute consultation to discuss your project.
                </p>
              </div>

              <Link href="#contact">
                <motion.button
                  className="px-8 py-4 bg-[#9a7b3c] text-white font-medium rounded-full hover:bg-[#7d6230] transition-colors duration-300 whitespace-nowrap"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-2">
                    Book a Consultation
                    <span>→</span>
                  </span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// Desktop timeline step
function TimelineStep({
  step,
  index,
  progress,
  stepStart,
}: {
  step: (typeof steps)[0];
  index: number;
  progress: MotionValue<number>;
  stepStart: number;
  stepEnd: number;
}) {
  // Transform for this specific step
  const isActive = useTransform(progress, (p) => p >= stepStart);
  const dotScale = useTransform(progress, [stepStart - 0.05, stepStart + 0.05], [0.5, 1]);
  const contentOpacity = useTransform(progress, [stepStart, stepStart + 0.1], [0.3, 1]);
  const contentY = useTransform(progress, [stepStart, stepStart + 0.1], [20, 0]);

  return (
    <div className="relative pt-8">
      {/* Node */}
      <div className="relative flex justify-center mb-8">
        <motion.div
          className="relative z-10"
          style={{ scale: dotScale }}
        >
          {/* Outer ring */}
          <motion.div
            className="w-[120px] h-[120px] rounded-full flex items-center justify-center"
            style={{
              backgroundColor: useTransform(isActive, (active) =>
                active ? "rgba(154, 123, 60, 0.1)" : "rgba(39, 39, 42, 0.5)"
              ),
              borderWidth: 2,
              borderColor: useTransform(isActive, (active) =>
                active ? "#9a7b3c" : "#3f3f46"
              ),
            }}
          >
            {/* Inner circle with icon */}
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: useTransform(isActive, (active) =>
                  active ? "#9a7b3c" : "#27272a"
                ),
              }}
            >
              <motion.div
                style={{
                  color: useTransform(isActive, (active) =>
                    active ? "#ffffff" : "#71717a"
                  ),
                }}
              >
                {step.icon}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Step number badge */}
          <motion.div
            className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor: useTransform(isActive, (active) =>
                active ? "#9a7b3c" : "#3f3f46"
              ),
              color: useTransform(isActive, (active) =>
                active ? "#ffffff" : "#71717a"
              ),
            }}
          >
            {index + 1}
          </motion.div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: useTransform(isActive, (active) =>
                active ? "0 0 40px rgba(154, 123, 60, 0.4)" : "none"
              ),
            }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className="text-center"
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
      >
        <motion.h3
          className="text-2xl font-bold mb-2"
          style={{
            color: useTransform(isActive, (active) =>
              active ? "#ffffff" : "#71717a"
            ),
          }}
        >
          {step.title}
        </motion.h3>
        <motion.p
          className="text-sm font-medium mb-3"
          style={{
            color: useTransform(isActive, (active) =>
              active ? "#b89a5e" : "#52525b"
            ),
          }}
        >
          {step.subtitle}
        </motion.p>
        <motion.p
          className="text-sm leading-relaxed max-w-[200px] mx-auto"
          style={{
            color: useTransform(isActive, (active) =>
              active ? "#a1a1aa" : "#52525b"
            ),
          }}
        >
          {step.description}
        </motion.p>
      </motion.div>
    </div>
  );
}

// Mobile timeline step
function MobileTimelineStep({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      className="relative flex gap-6"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        {/* Node */}
        <div className="w-14 h-14 rounded-full bg-[#9a7b3c]/10 border-2 border-[#9a7b3c] flex items-center justify-center text-[#b89a5e]">
          {step.icon}
        </div>
        {/* Line */}
        {!isLast && (
          <div className="w-[2px] flex-1 bg-gradient-to-b from-[#9a7b3c] to-zinc-800 mt-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold text-[#9a7b3c] bg-[#9a7b3c]/10 px-2 py-1 rounded">
            {step.number}
          </span>
          <span className="text-sm text-[#b89a5e]">{step.subtitle}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
        <p className="text-zinc-400 leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}
