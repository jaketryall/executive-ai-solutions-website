"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    title: "AI Workflow Automation",
    description: "Streamline your business processes with intelligent automation that works 24/7.",
    icon: "⚡",
  },
  {
    title: "Landing Page Creation",
    description: "AI-powered landing pages that convert visitors into customers.",
    icon: "🎨",
  },
  {
    title: "AI Consulting",
    description: "Expert guidance to implement practical AI solutions for your business.",
    icon: "🧠",
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Comprehensive AI solutions tailored to your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-zinc-900 p-8 rounded-2xl hover:bg-zinc-800 transition-colors duration-200"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-zinc-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}