"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function EteryPricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const testimonials = [
    {
      name: "Jesse Leigh",
      role: "CEO & Founder",
      quote: "Their AI agents handle 80% of our customer support tickets automatically. Response times dropped from hours to seconds.",
      date: "80% automation achieved"
    },
    {
      name: "Michael Joseph",
      role: "Operations Director",
      quote: "We've automated our entire data analysis pipeline. What used to take weeks now happens in real-time with AI insights.",
      date: "Reduced processing time by 95%"
    },
    {
      name: "Amy Louise",
      role: "Head of Sales",
      quote: "AI-powered lead qualification and nurturing increased our conversion rate by 3x. The ROI has been incredible.",
      date: "3x conversion rate improvement"
    }
  ];

  const features = [
    "Handles 1,000+ tasks daily",
    "Works with your existing tools",
    "See ROI metrics in real-time",
    "Zero sick days or vacation",
    "Scales instantly with demand",
    "Never needs training or breaks"
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
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Investment That Pays for Itself
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Compare the cost of AI to what you're spending now on manual work. 
            Most clients see positive ROI within 2-3 months.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl p-8 lg:p-10">
              {/* Plan Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Your AI Workforce</h3>
                
                {/* Billing Toggle */}
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`text-sm ${billingPeriod === "monthly" ? "text-white" : "text-zinc-500"}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod("yearly")}
                    className={`text-sm ${billingPeriod === "yearly" ? "text-white" : "text-zinc-500"}`}
                  >
                    Yearly
                  </button>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">$4,999</span>
                  <span className="text-zinc-400">per agent/month</span>
                </div>
                
                {/* ROI Comparison */}
                <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3 mb-4">
                  <p className="text-green-400 text-sm font-medium mb-1">vs. Hiring 2 Full-Time Employees:</p>
                  <p className="text-white font-bold">Save $10,000-15,000/month</p>
                  <p className="text-zinc-400 text-xs mt-1">AI works 168 hrs/week vs 40 hrs for humans</p>
                </div>
                
                {/* CTA Button */}
                <motion.button
                  className="w-full py-4 bg-[#0066ff] text-white font-medium rounded-lg hover:bg-[#0052cc] transition-colors mt-6 mb-8"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Calculate Your Savings
                </motion.button>
              </div>

              {/* What's Included */}
              <div>
                <h4 className="text-white font-semibold mb-6">What&apos;s included?</h4>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-zinc-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-zinc-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#0d0d0d] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066ff] to-cyan-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-semibold">{testimonial.name}</h4>
                        <p className="text-zinc-500 text-sm">{testimonial.role}</p>
                      </div>
                      <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Quote */}
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      <span className="text-3xl text-zinc-600 mr-1">&ldquo;</span>
                      {testimonial.quote}
                      <span className="text-3xl text-zinc-600 ml-1">&rdquo;</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}