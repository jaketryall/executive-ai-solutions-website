"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const useCases = [
  {
    title: "Flight School CRM",
    description: "Automated student management and scheduling for aviation training centers.",
    metrics: "50% time saved on admin tasks",
  },
  {
    title: "Real Estate Automations",
    description: "AI-powered lead qualification and property matching systems.",
    metrics: "3x increase in qualified leads",
  },
  {
    title: "AI-powered Landing Pages",
    description: "Dynamic, personalized pages that adapt to each visitor.",
    metrics: "2x conversion rate improvement",
  },
];

export default function UseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative bg-black">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-medium mb-6 text-white">Use Cases</h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-light">
            Real-world implementations delivering measurable results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="border border-zinc-800 hover:border-zinc-700 p-10 rounded-xl transition-all duration-300 bg-zinc-900/50 group"
            >
              <h3 className="text-xl font-medium mb-4 text-white group-hover:text-[#93bbfd] transition-colors duration-300">
                {useCase.title}
              </h3>
              <p className="text-zinc-500 mb-6 leading-relaxed">{useCase.description}</p>
              <div className="text-sm font-medium text-[#93bbfd] bg-[#3b82f6]/10 px-4 py-2 rounded-md inline-block">
                {useCase.metrics}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}