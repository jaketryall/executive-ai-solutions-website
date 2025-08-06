"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function HowWeWork() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: "01",
      title: "Understand Your Vision",
      description: "We start with a discovery session to learn about your goals, challenges, and how AI can make a real impact in your business."
    },
    {
      number: "02",
      title: "Design Smart Solutions",
      description: "Our team crafts tailored AI strategies that align with your objectives, ensuring scalable and efficient implementations."
    },
    {
      number: "03",
      title: "Build & Integrate",
      description: "We develop and seamlessly integrate AI solutions into your existing systems, minimizing disruption while maximizing value."
    },
    {
      number: "04",
      title: "Scale & Optimize",
      description: "Continuous monitoring and optimization ensure your AI solutions evolve with your business needs and deliver ongoing results."
    }
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0066ff]/5 to-black" />
      <div className="absolute left-1/2 top-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#0066ff]/10 to-transparent rounded-full blur-3xl transform -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left mb-16 lg:mb-20"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            How We{" "}
            <span className="text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-400 bg-clip-text">
              Work
            </span>{" "}
            - From idea to implementation
          </h2>
          <p className="text-xl lg:text-2xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto lg:mx-0">
            Our process is simple, transparent, and built to deliver results — fast.
          </p>
        </motion.div>

        {/* Timeline Process */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066ff]/50 to-transparent hidden lg:block" />
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="flex items-center justify-center lg:justify-start mb-8">
                  <div className="relative">
                    <div className="text-6xl lg:text-7xl font-bold text-zinc-800">
                      {step.number}
                    </div>
                    {/* Timeline Dot */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#0066ff] rounded-full hidden lg:block" />
                  </div>
                </div>

                {/* Step Content */}
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-lg font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-px h-8 bg-[#0066ff]/30 lg:hidden" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Visual Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 flex justify-center"
        >
          <div className="relative w-96 h-96">
            {/* Animated Process Visual */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0066ff]/20 via-cyan-400/10 to-transparent backdrop-blur-sm border border-[#0066ff]/20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-dashed border-[#0066ff]/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border border-dotted border-cyan-400/30"
              />
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-[#0066ff]/30 to-transparent backdrop-blur-lg flex items-center justify-center">
                <span className="text-[#0066ff] text-2xl font-bold">AI</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}