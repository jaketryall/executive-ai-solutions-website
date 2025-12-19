"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description: "We start with a conversation. I learn about your business, goals, and vision.",
  },
  {
    number: "02",
    title: "Design",
    description: "I create mockups tailored to your brand. You see exactly what you're getting.",
  },
  {
    number: "03",
    title: "Development",
    description: "Your approved design comes to life. Clean code, fast performance.",
  },
  {
    number: "04",
    title: "Launch",
    description: "We test everything, then go live. Plus 30 days of support included.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-32 md:py-40 px-6 md:px-12 lg:px-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0a0a0a] tracking-tight mb-6">
            Process
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl">
            From first call to launch in as little as 2 weeks.
          </p>
        </motion.div>

        {/* Process steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="mb-6">
                <span className="text-5xl md:text-6xl font-semibold text-zinc-200 group-hover:text-[#2563eb] transition-colors">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-3">
                {step.title}
              </h3>
              <p className="text-zinc-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 pt-12 border-t border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-8"
        >
          <p className="text-xl text-zinc-500">Ready to get started?</p>
          <Link
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#0a0a0a] text-white font-medium rounded-full hover:bg-zinc-800 transition-colors"
          >
            Book a Free Consultation
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
