"use client";

import { motion } from "framer-motion";

export default function EteryResults() {
  const results = [
    {
      value: "40-60%",
      label: "Cost Reduction Potential",
      description: "Industry studies show AI automation typically reduces operational costs by 40-60% within the first year."
    },
    {
      value: "40+ Hours",
      label: "Weekly Time Savings",
      description: "Average time saved per department when routine tasks are automated with AI agents."
    },
    {
      value: "95%",
      label: "Error Reduction",
      description: "AI performs repetitive tasks with near-perfect accuracy, eliminating costly human errors."
    },
    {
      value: "3-5x",
      label: "Expected ROI",
      description: "Typical return on investment within 12 months based on industry benchmarks."
    }
  ];

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            What AI Delivers
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Based on industry benchmarks and typical AI implementations, here's the 
            impact you can expect when you automate with artificial intelligence.
          </p>
        </motion.div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                className="text-5xl lg:text-6xl font-bold text-white mb-4"
              >
                {result.value}
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {result.label}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {result.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-zinc-500 text-sm mt-12 italic"
        >
          *Results based on McKinsey, Gartner, and Accenture industry research. Actual results vary by implementation.
        </motion.p>

        {/* Bottom Text */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mt-24"
        >
          <span className="text-white">Simple</span>{" "}
          <span className="text-zinc-500">Membership</span>
        </motion.h3>
      </div>
    </section>
  );
}