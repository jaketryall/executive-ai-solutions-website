"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AutomationIcon, LandingPageIcon, ConsultingIcon } from "./Icons";

const services = [
  {
    title: "AI Workflow Automation",
    description: "Streamline your business processes with intelligent automation that works 24/7.",
    icon: AutomationIcon,
  },
  {
    title: "Landing Page Creation",
    description: "AI-powered landing pages that convert visitors into customers.",
    icon: LandingPageIcon,
  },
  {
    title: "AI Consulting",
    description: "Expert guidance to implement practical AI solutions for your business.",
    icon: ConsultingIcon,
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-black" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-medium mb-6 text-white">Our Services</h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-light">
            Comprehensive AI solutions tailored to your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.3, ease: "easeOut" } }}
                className="bg-zinc-900/50 p-10 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 group"
              >
                <div className="w-14 h-14 mb-8 text-[#93bbfd] group-hover:text-[#60a5fa] transition-colors duration-300">
                  <Icon className="w-full h-full" />
                </div>
                <h3 className="text-xl font-medium mb-4 text-white">{service.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}