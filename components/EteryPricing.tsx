"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function EteryPricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const testimonials = [
    {
      name: "Jesse Leigh",
      role: "CEO & Founder",
      quote: "They built us an amazing website that increased our conversions by 150%. The design is beautiful and it loads incredibly fast.",
      date: "increased our conversions by 150%"
    },
    {
      name: "Michael Joseph",
      role: "E-commerce Owner",
      quote: "Our new Shopify store looks professional and works flawlessly. Sales have doubled since launch. Highly recommend!",
      date: "Sales have doubled since launch"
    },
    {
      name: "Amy Louise",
      role: "Marketing Director",
      quote: "They handled everything from design to deployment. Our Squarespace site is exactly what we wanted and more.",
      date: "exactly what we wanted and more"
    }
  ];

  const features = [
    "Custom Website Design & Development",
    "Mobile Responsive Design",
    "SEO Optimization & Setup",
    "CMS Integration (WordPress, Sanity, etc.)",
    "3 Months Free Maintenance",
    "Optional: AI Chatbot Integration"
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
            Website Packages
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Transparent pricing for every project size. From simple landing pages
            to complex web applications — we have a package that fits.
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
                <h3 className="text-2xl font-bold text-white mb-2">Website Development</h3>
                
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
                  <span className="text-5xl font-bold text-white">$2,999</span>
                  <span className="text-zinc-400">starting price</span>
                </div>
                
                {/* CTA Button */}
                <motion.button
                  className="w-full py-4 bg-[#0066ff] text-white font-medium rounded-lg hover:bg-[#0052cc] transition-colors mt-6 mb-8"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Let&apos;s get started
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