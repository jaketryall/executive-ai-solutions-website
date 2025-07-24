"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Book a Strategy Call",
    description: "Tell us about your business challenges and goals. We'll identify where AI can make the biggest impact.",
  },
  {
    number: "02",
    title: "Get Your AI Roadmap",
    description: "Receive a custom implementation plan with clear milestones and ROI projections for your AI initiatives.",
  },
  {
    number: "03",
    title: "Deploy & Scale",
    description: "Launch your AI workforce with our support. Start small, measure results, and scale what works.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative bg-black">
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-medium mb-6 text-white">How It Works</h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-light">
            Your journey to AI transformation in three simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/30 to-transparent hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-10 hover:border-zinc-700 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="w-14 h-14 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-xl flex items-center justify-center mb-8 mx-auto md:mx-0 shadow-lg"
                  >
                    <span className="text-xl font-medium">{step.number}</span>
                  </motion.div>
                  <h3 className="text-xl font-medium mb-4 text-white">{step.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button className="bg-white text-black px-8 py-4 rounded-md font-medium text-base hover:bg-zinc-100 transition-all duration-300 shadow-lg">
            Book Your Strategy Call
          </button>
        </motion.div>
      </div>
    </section>
  );
}