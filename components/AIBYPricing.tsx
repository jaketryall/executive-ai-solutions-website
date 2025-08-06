"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AIBYPricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      name: "Starter",
      price: "$0",
      unit: "/project",
      description: "Perfect for small team / startups trying AI for the first time.",
      features: [
        "1 AI Chatbot (custom-trained)",
        "Up to 3 chatbot flows",
        "AI image generation",
        "Basic integration",
        "Email support",
        "10-day delivery"
      ],
      buttonText: "Start Your Project",
      popular: false
    },
    {
      name: "Growth",
      price: "$1,990",
      unit: "/project",
      description: "Ideal for scaling teams needing deeper automation.",
      features: [
        "Everything in Starter, plus",
        "AI video generation",
        "Advanced chatbot logic",
        "Custom dashboard",
        "Slack & CRM integrations",
        "2-3 week delivery"
      ],
      buttonText: "Start Your Project",
      popular: true,
      badge: "Best Deal 🎯"
    },
    {
      name: "Enterprise",
      price: "Custom Pricing",
      unit: "",
      description: "Custom AI + Blockchain solutions tailored to your operations.",
      features: [
        "AI + Blockchain integration",
        "End-to-end automation strategy",
        "Scalable infrastructure",
        "Custom dashboard",
        "Slack & CRM integrations",
        "2-3 week delivery"
      ],
      buttonText: "Start Your Project",
      popular: false
    }
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0066ff]/10 to-black" />
      <div className="absolute right-0 top-1/2 w-1/2 h-1/2 bg-gradient-to-l from-cyan-400/10 to-transparent rounded-full blur-3xl transform -translate-y-1/2" />
      <div className="absolute left-0 bottom-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#0066ff]/10 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            <span className="text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-400 bg-clip-text">
              Pricing
            </span>{" "}
            Plans - Flexible plans for every stage of your growth
          </h2>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-[#0066ff] text-white px-4 py-2 rounded-full text-sm font-medium">
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className={`
                relative h-full p-8 rounded-3xl border transition-all duration-300
                ${plan.popular 
                  ? 'bg-zinc-900/90 border-[#0066ff]/50 shadow-2xl shadow-[#0066ff]/20' 
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }
              `}>
                {/* Plan Name */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl lg:text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-zinc-400 ml-2">{plan.unit}</span>
                  </div>
                  <p className="text-zinc-400 font-light">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-[#0066ff] mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-zinc-300 font-light">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.a
                  href="#contact"
                  className={`
                    w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300
                    ${plan.popular 
                      ? 'bg-[#0066ff] text-white hover:bg-[#0052cc]' 
                      : 'bg-white text-black hover:bg-zinc-100'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {plan.buttonText}
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}