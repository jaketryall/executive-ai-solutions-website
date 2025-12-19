"use client";

import { motion } from "framer-motion";

export default function UseCaseBlocks() {
  const useCases = [
    {
      category: "Small & Local Business",
      icon: "🏪",
      title: "Drowning in Customer Inquiries?",
      description: "Your team spends hours answering the same questions. Customers wait. Sales are lost. Sound familiar?",
      benefits: [
        "Respond to customers in seconds, not hours",
        "Handle 100+ inquiries simultaneously",
        "Never miss a lead, even after hours",
        "Free your team for high-value work"
      ],
      metrics: {
        timeSaved: "30+ hrs/week",
        responseTime: "< 1 second",
        availability: "24/7/365"
      },
      color: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      category: "Enterprise & Global",
      icon: "🏢",
      title: "Can't Scale Without Massive Hiring?",
      description: "Growth means more work, but hiring is slow, expensive, and risky. You need to do more with what you have.",
      benefits: [
        "Handle 10x volume with existing team",
        "Process thousands of tasks simultaneously",
        "Scale up or down instantly with demand",
        "Maintain quality at any volume"
      ],
      metrics: {
        capacity: "10x increase",
        scaling: "Instant",
        quality: "99.9% consistent"
      },
      color: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20"
    }
  ];

  return (
    <section className="py-24 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Real Problems, Smart Solutions
          </h2>
          <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
            Every business faces these challenges. See how AI turns your biggest 
            operational headaches into competitive advantages.
          </p>
        </motion.div>

        {/* Use Case Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              {/* Card Background with Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity`} />
              
              {/* Card Content */}
              <div className={`relative bg-[#0d0d0d]/90 backdrop-blur-sm border ${useCase.borderColor} rounded-2xl p-8 hover:border-opacity-50 transition-all`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-zinc-500 text-sm uppercase tracking-wider">{useCase.category}</span>
                    <h3 className="text-2xl font-bold text-white mt-2">{useCase.title}</h3>
                  </div>
                  <span className="text-4xl">{useCase.icon}</span>
                </div>

                {/* Description */}
                <p className="text-zinc-300 mb-6">
                  {useCase.description}
                </p>

                {/* Benefits List */}
                <div className="space-y-3 mb-6">
                  {useCase.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-zinc-400 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
                  {Object.entries(useCase.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-xl font-bold text-white">{value}</p>
                      <p className="text-zinc-500 text-xs capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 group/btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  See The Solution
                  <svg 
                    className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-zinc-400 mb-6">
            Stop losing money on problems AI can solve today
          </p>
          <motion.button
            className="px-8 py-4 bg-[#0066ff] text-white font-medium rounded-xl hover:bg-[#0052cc] transition-all duration-300 inline-flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Your Free ROI Assessment
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}