"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function EteryProcess() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      number: "01",
      title: "Week 1-2: Identify High-Impact Automation Opportunities",
      description: "We analyze your operations to identify where AI will deliver the biggest impact.",
      stats: {
        timeSaved: { value: "20-30 hrs", label: "Weekly Savings" },
        costReduction: { value: "$5-8K", label: "Monthly Savings" },
        tasks: { value: "15-25", label: "Automatable Tasks" },
        roi: { value: "2-3x", label: "Expected ROI" }
      },
      expandedContent: [
        "Customer service automation",
        "Data entry elimination",
        "Report generation",
        "Invoice processing",
        "Email management",
        "Appointment scheduling",
        "Lead qualification"
      ]
    },
    {
      number: "02",
      title: "Week 3-6: Build Your AI Workforce",
      description: "We create AI agents tailored to your specific needs - no disruption to current operations.",
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
      title: "Week 7-8: Measure & Optimize",
      description: "Go live and start capturing value immediately - with continuous optimization for maximum impact.",
      metrics: {
        efficiency: { current: "70-80%", change: "Automation Rate", label: "Tasks Automated", period: "From day one" },
        savings: { current: "$1,500+", change: "Weekly Value", label: "Cost Savings", period: "Immediate impact" },
        scale: { current: "3-5x", change: "Capacity Boost", label: "Processing Power", period: "Without hiring" }
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
            ROI in 8 Weeks
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            No lengthy implementations. No disruption. Just a clear path from 
            problem to profit in weeks, not months.
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
              {step.number === "01" && step.stats && (
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

              {step.number === "02" && step.features && (
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

              {step.number === "03" && step.metrics && (
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
                  {expandedStep === index ? "Show less" : "See the details"}
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
                    {step.number === "01" && Array.isArray(step.expandedContent) && (
                      <div className="space-y-2">
                        {step.expandedContent.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#0066ff] rounded-full" />
                            <span className="text-zinc-400 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.number === "02" && step.features && (
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