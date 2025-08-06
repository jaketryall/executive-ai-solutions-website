"use client";

import { motion } from "framer-motion";

export default function EteryResults() {
  const results = [
    {
      value: "150 +",
      label: "Project success",
      description: "Completed projects for clients in over 20 countries, from bold startups to top corporations."
    },
    {
      value: "100 %",
      label: "Client efficiency",
      description: "Clients reporting enhanced efficiency with our custom strategies and advanced tech."
    },
    {
      value: "300 +",
      label: "AI innovation",
      description: "Hours spent crafting smart AI tools to optimize workflows across key industries."
    },
    {
      value: "75 +",
      label: "Industry recognition",
      description: "Awarded for excellence in design, technology, and sustainability over the last five years."
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
            Our Results
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Tangible results, not empty claims — we build efficient AI tools that scale,
            optimize, and save valuable hours.
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