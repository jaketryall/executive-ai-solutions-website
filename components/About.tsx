"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const sectionRef = useRef(null);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 md:py-40 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] overflow-hidden"
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
            About
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
            The Story
          </h2>
        </motion.div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Main story */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-8">
              I believe great design shouldn&apos;t be reserved for big companies with big budgets.
            </p>

            <div className="space-y-6 text-zinc-400 leading-relaxed">
              <p>
                I got into web design because I&apos;ve always been drawn to art and the craft of creating
                something beautiful that actually works.
              </p>
              <p>
                But what really drives me is seeing a business succeed. There&apos;s nothing better than
                launching a website and watching it bring in new customers, leads, and opportunities.
              </p>
            </div>
          </motion.div>

          {/* Right - Values */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {[
              {
                title: "Design-First",
                description: "Every project starts with understanding your brand. I design before I code.",
              },
              {
                title: "Performance",
                description: "Fast websites convert better. Modern technology, optimized for speed.",
              },
              {
                title: "Ownership",
                description: "No lock-in contracts. You own your website, your content, your success.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="py-6 border-t border-zinc-800"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-zinc-400">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mt-20 pt-8 border-t border-zinc-800"
        >
          <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
          <span className="text-zinc-500">Based in Arizona, working with clients worldwide</span>
        </motion.div>
      </div>
    </section>
  );
}
