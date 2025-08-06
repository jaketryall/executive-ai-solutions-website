"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function EteryProcess() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      number: "01",
      title: "Evaluate",
      description: "We identify where AI can bring the most value to your business.",
      stats: {
        revenue: { value: "+6%", label: "Revenue" },
        productivity: { value: "+13%", label: "Productivity" },
        sales: { value: "+2%", label: "Sales" },
        costs: { value: "-5%", label: "Costs" }
      },
      expandedContent: [
        "AI chatbots",
        "Email automation",
        "Workflow automation",
        "Predictive analytics",
        "Content generation",
        "Data analysis model",
        "Email personalization"
      ]
    },
    {
      number: "02",
      title: "Develop",
      description: "We develop custom AI solutions that fit right into your workflow.",
      features: [
        { icon: "📊", label: "Predictive analytics" },
        { icon: "✉️", label: "Email personalization" },
        { icon: "🤖", label: "AI chatbots" },
        { icon: "⚡", label: "Workflow automation" },
        { icon: "📝", label: "Content generation" },
        { icon: "📈", label: "Data analysis model" }
      ],
      expandedContent: "Everything for your business"
    },
    {
      number: "03",
      title: "Growth",
      description: "We optimize your AI solutions to maximize long-term impact.",
      metrics: {
        revenue: { current: "78.2%", change: "+3.2%", label: "Revenue", period: "Up from past week" },
        costs: { current: "$35,495", change: "+5.3%", label: "Costs", period: "Down from past week" },
        sales: { current: "$52,889", change: "+3.3%", label: "Sales", period: "Down from past week" }
      }
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
            Our Process
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            From idea to automation — we follow a clear, proven path to deliver
            tailored AI solutions that drive results.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-300"
            >
              {/* Step Number and Title */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-zinc-500 text-sm">Step {step.number}</span>
                  <h3 className="text-2xl font-bold text-white mt-1">{step.title}</h3>
                </div>
              </div>

              <p className="text-zinc-400 mb-6">{step.description}</p>

              {/* Step-specific content */}
              {step.number === "01" && (
                <div className="bg-zinc-900 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(step.stats).map(([key, stat]) => (
                      <div key={key}>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-zinc-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step.number === "02" && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {step.features.slice(0, 4).map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-900 rounded-lg p-3 flex items-center gap-2"
                    >
                      <span className="text-lg">{feature.icon}</span>
                      <span className="text-zinc-300 text-sm">{feature.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {step.number === "03" && (
                <div className="space-y-3 mb-4">
                  {Object.entries(step.metrics).map(([key, metric]) => (
                    <div key={key} className="bg-zinc-900 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-zinc-400 text-sm">{metric.label}</span>
                        <span className="text-green-400 text-sm">{metric.change}</span>
                      </div>
                      <div className="text-white font-semibold">{metric.current}</div>
                      <div className="text-zinc-500 text-xs">{metric.period}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Expand/Collapse Button */}
              <button
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                className="flex items-center gap-2 text-[#0066ff] hover:text-[#0052cc] transition-colors"
              >
                <span className="text-sm">
                  {expandedStep === index ? "Show less" : "Everything for your business"}
                </span>
                <motion.svg
                  animate={{ rotate: expandedStep === index ? 180 : 0 }}
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedStep === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-zinc-800"
                  >
                    {step.number === "01" && (
                      <div className="space-y-2">
                        {step.expandedContent.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#0066ff] rounded-full" />
                            <span className="text-zinc-400 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.number === "02" && (
                      <div className="grid grid-cols-2 gap-2">
                        {step.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="bg-zinc-900 rounded-lg p-3 flex items-center gap-2"
                          >
                            <span className="text-lg">{feature.icon}</span>
                            <span className="text-zinc-300 text-sm">{feature.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.number === "03" && (
                      <p className="text-zinc-400">
                        Continuous monitoring and optimization to ensure your AI solutions
                        deliver maximum value and adapt to your growing needs.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}