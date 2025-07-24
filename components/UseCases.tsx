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
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Use Cases</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
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
              className="border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors duration-200"
            >
              <h3 className="text-2xl font-semibold mb-4">{useCase.title}</h3>
              <p className="text-zinc-400 mb-6">{useCase.description}</p>
              <div className="text-sm font-semibold text-green-400">
                {useCase.metrics}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}