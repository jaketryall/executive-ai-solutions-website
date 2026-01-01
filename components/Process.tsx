"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

// Smooth easing curve
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "We start with a conversation to understand your business, goals, and vision for the project.",
    duration: "Day 1-2",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    details: ["Initial consultation", "Requirements gathering", "Project scope definition"],
  },
  {
    number: "02",
    title: "Design",
    description: "We create mockups tailored to your brand. You see exactly what you're getting before we build.",
    duration: "Day 3-7",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    details: ["Wireframes & layouts", "Visual design", "Feedback & revisions"],
  },
  {
    number: "03",
    title: "Development",
    description: "Your approved design comes to life with clean code, smooth animations, and fast performance.",
    duration: "Day 8-12",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    details: ["Frontend development", "CMS integration", "Performance optimization"],
  },
  {
    number: "04",
    title: "Launch",
    description: "We test everything thoroughly, then go live. Plus 30 days of support included with every project.",
    duration: "Day 13-14",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    details: ["Quality assurance", "Deployment", "Training & handover"],
  },
];

function ProcessStep({
  step,
  index,
  isActive,
  onHover,
}: {
  step: typeof steps[0];
  index: number;
  isActive: boolean;
  onHover: (index: number | null) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Timeline connector */}
      {index < steps.length - 1 && (
        <div className="absolute left-7 top-16 bottom-0 w-px hidden lg:block">
          <motion.div
            className="h-full bg-zinc-800"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
            style={{ transformOrigin: "top" }}
          />
        </div>
      )}

      <motion.div
        className="relative flex gap-8 lg:gap-12"
        whileHover={{ x: 8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Step number circle */}
        <motion.div
          className="relative shrink-0"
          animate={{
            scale: isActive ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center relative z-10 text-blue-500">
            {step.icon}
          </div>

          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
            }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Step number badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
            {index + 1}
          </div>
        </motion.div>

        {/* Content card */}
        <motion.div
          className="flex-1 p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800"
          animate={{
            borderColor: isActive ? "rgba(59, 130, 246, 0.3)" : "rgba(39, 39, 42, 1)",
            backgroundColor: isActive ? "rgba(59, 130, 246, 0.05)" : "rgba(24, 24, 27, 0.5)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <motion.h3
              className="text-2xl md:text-3xl font-bold text-white"
              animate={{ color: isActive ? "#3B82F6" : "#ffffff" }}
              transition={{ duration: 0.3 }}
            >
              {step.title}
            </motion.h3>
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-500">
              {step.duration}
            </span>
          </div>

          {/* Description */}
          <p className="text-zinc-400 leading-relaxed mb-6">{step.description}</p>

          {/* Details list */}
          <motion.div
            className="space-y-3"
            animate={{
              opacity: isActive ? 1 : 0.6,
            }}
            transition={{ duration: 0.3 }}
          >
            {step.details.map((detail, i) => (
              <motion.div
                key={detail}
                className="flex items-center gap-3"
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  x: isActive ? 0 : -5,
                }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-sm text-zinc-400">{detail}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Process() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section id="process" className="relative bg-[#0a0a0a] py-32">
      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          {/* Section Header */}
          <div className="mb-20">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="text-blue-500 text-sm font-medium tracking-wider uppercase mb-4"
            >
              How It Works
            </motion.p>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-20">
              <div>
                <div className="overflow-hidden">
                  <motion.h2
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                  >
                    From idea
                  </motion.h2>
                </div>
                <div className="overflow-hidden">
                  <motion.h2
                    initial={{ y: 80, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500"
                  >
                    to launch
                  </motion.h2>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
                className="flex flex-col justify-end"
              >
                <p className="text-xl text-zinc-400 leading-relaxed">
                  A streamlined process designed to take your project from concept to
                  completion in as little as 2 weeks.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="space-y-8 lg:space-y-12 mb-20">
            {steps.map((step, index) => (
              <ProcessStep
                key={step.number}
                step={step}
                index={index}
                isActive={activeStep === index}
                onHover={setActiveStep}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative p-10 md:p-16 rounded-3xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
              {/* Content */}
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
                    className="px-8 py-4 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors duration-300"
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
