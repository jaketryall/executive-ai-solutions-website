"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

const services = [
  {
    title: "Brand Identity",
    description: "Crafting bold, memorable brand identities from logos to full brand guidelines that set you apart.",
    details: [
      "Logo design & variations",
      "Color palette & typography",
      "Brand guidelines document",
      "Social media assets",
    ],
  },
  {
    title: "Web Design",
    description: "Stunning, high-performance websites with sleek, user-friendly interfaces and responsive, fast-loading pages.",
    details: [
      "Custom responsive design",
      "Interactive animations",
      "Performance optimization",
      "SEO-ready structure",
    ],
  },
  {
    title: "UI/UX Design",
    description: "Seamless, intuitive digital experiences designed to enhance user engagement and drive conversions.",
    details: [
      "User research & personas",
      "Wireframing & prototyping",
      "Usability testing",
      "Design system creation",
    ],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-32 md:py-40 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] overflow-hidden rounded-t-[2rem] -mt-8"
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
          <motion.span
            className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            What We Offer
          </motion.span>
          <div className="overflow-hidden">
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-6"
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Our <span className="font-serif italic text-[#2563eb]">services</span>
            </motion.h2>
          </div>
          <motion.p
            className="text-xl text-zinc-400 max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Specializing in creating bold, high-impact digital experiences that set brands apart.
          </motion.p>
        </motion.div>

        {/* Services list */}
        <div className="space-y-0">
          {services.map((service, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <motion.div
                  className="py-10 border-t border-zinc-800"
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                    {/* Number */}
                    <motion.span
                      className={`text-sm font-mono w-12 transition-colors duration-300 ${isExpanded ? "text-[#2563eb]" : "text-zinc-600"}`}
                    >
                      0{index + 1}
                    </motion.span>

                    {/* Title */}
                    <motion.h3
                      className={`text-2xl md:text-3xl font-semibold flex-1 transition-colors duration-300 ${isExpanded ? "text-[#2563eb]" : "text-white group-hover:text-[#2563eb]"}`}
                    >
                      {service.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      className="text-zinc-400 md:max-w-md md:text-right transition-colors duration-300 group-hover:text-zinc-300"
                    >
                      {service.description}
                    </motion.p>

                    {/* Expand/collapse icon */}
                    <motion.div
                      className="hidden md:flex items-center justify-center w-10 h-10 border border-zinc-700 rounded-full group-hover:border-[#2563eb] transition-colors"
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={`text-xl transition-colors ${isExpanded ? "text-[#2563eb]" : "text-zinc-500 group-hover:text-[#2563eb]"}`}>
                        +
                      </span>
                    </motion.div>
                  </div>

                  {/* Expandable details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-8 md:pl-24 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {service.details.map((detail, i) => (
                            <motion.div
                              key={detail}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                              <span className="text-sm text-zinc-400">{detail}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
          {/* Final border */}
          <motion.div
            className="border-t border-zinc-800"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Pricing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20"
        >
          <motion.div
            className="p-8 md:p-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl"
            whileHover={{ borderColor: "rgba(194, 58, 34, 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <motion.h3
                  className="text-2xl md:text-3xl font-semibold text-white mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Transparent Pricing
                </motion.h3>
                <motion.p
                  className="text-zinc-400 max-w-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Landing pages from $500. Multi-page websites from $2,000.
                  Every project includes revisions and 30 days of support.
                </motion.p>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0a] font-medium rounded-full hover:bg-zinc-100 transition-colors shrink-0 group"
                >
                  <span>Get a Quote</span>
                  <motion.span
                    className="inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
