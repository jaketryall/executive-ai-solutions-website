"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMobile";

export default function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses starting with AI",
      monthlyPrice: 2999,
      annualPrice: 2699,
      popular: false,
      features: [
        "1 AI workflow automation",
        "Basic customer service chatbot",
        "Email support",
        "Up to 1,000 monthly interactions",
        "Standard integrations",
        "Basic analytics dashboard"
      ]
    },
    {
      name: "Professional",
      description: "Comprehensive AI solutions for growing companies",
      monthlyPrice: 7999,
      annualPrice: 7199,
      popular: true,
      features: [
        "5 AI workflow automations",
        "Advanced AI customer service",
        "Priority support & phone calls",
        "Up to 10,000 monthly interactions",
        "Custom integrations",
        "Advanced analytics & reporting",
        "Multi-channel deployment",
        "AI content generation",
        "Basic predictive analytics"
      ]
    },
    {
      name: "Enterprise",
      description: "Custom AI workforce for large organizations",
      monthlyPrice: null,
      annualPrice: null,
      popular: false,
      features: [
        "Unlimited AI automations",
        "Complete AI workforce solution",
        "Dedicated account manager",
        "Unlimited interactions",
        "Full API access",
        "Custom AI model training",
        "White-label solutions",
        "Advanced predictive analytics",
        "SLA guarantees",
        "24/7 priority support"
      ]
    }
  ];

  const formatPrice = (price: number | null) => {
    if (price === null) return "Custom";
    return `$${price.toLocaleString()}`;
  };

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/30 to-black pointer-events-none" />
      
      {/* Grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="bg-grid-pattern" />
      </div>

      <motion.div 
        className="max-w-7xl mx-auto relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
      >
        {/* Section header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 text-white leading-[0.9] tracking-tight">
            <span className="block">Transparent</span>
            <span className="text-gradient-shine">Pricing Plans</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 font-normal leading-tight max-w-3xl mx-auto mb-10 sm:mb-14">
            Choose the perfect plan to start
            <span className="block">your AI transformation journey.</span>
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-zinc-900/50 rounded-full p-1 border border-zinc-800">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-light transition-all duration-300 ${
                billingCycle === "monthly"
                  ? "bg-blue-500 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-light transition-all duration-300 relative ${
                billingCycle === "annual"
                  ? "bg-blue-500 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual
              <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-green-500 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                10% off
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.6, 
                delay: prefersReducedMotion ? 0 : 0.4 + index * 0.1 
              }}
              className={`relative group ${plan.popular ? "lg:-mt-6" : ""}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-[#0066ff] to-cyan-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`bg-zinc-900/40 backdrop-blur-sm h-full p-6 lg:p-8 rounded-2xl relative overflow-hidden border transition-all duration-300 ${
                plan.popular 
                  ? "border-[#0066ff]/30 bg-zinc-900/60 lg:scale-105 shadow-lg shadow-[#0066ff]/10" 
                  : "border-zinc-800/60 hover:border-zinc-700/80 hover:bg-zinc-900/60"
              }`}>
                {/* Popular glow effect */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0066ff]/5 to-transparent" />
                )}
                
                <div className="relative z-10">
                  {/* Plan header */}
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-light text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-zinc-400 font-light text-sm mb-4 sm:mb-6">
                      {plan.description}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-white">
                          {formatPrice(billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice)}
                        </span>
                        {plan.monthlyPrice && (
                          <span className="text-zinc-500 ml-2">
                            /{billingCycle === "monthly" ? "mo" : "yr"}
                          </span>
                        )}
                      </div>
                      {billingCycle === "annual" && plan.monthlyPrice && (
                        <p className="text-xs text-zinc-600 mt-2">
                          Billed annually (${Math.round((plan.annualPrice || 0) / 12).toLocaleString()}/mo)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ 
                          duration: prefersReducedMotion ? 0 : 0.4, 
                          delay: prefersReducedMotion ? 0 : 0.6 + index * 0.1 + featureIndex * 0.05 
                        }}
                        className="flex items-start"
                      >
                        <svg 
                          className={`w-4 sm:w-5 h-4 sm:h-5 mt-0.5 mr-3 flex-shrink-0 ${
                            plan.popular ? "text-blue-400" : "text-green-400"
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-zinc-300 font-light text-sm leading-relaxed">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ 
                      duration: prefersReducedMotion ? 0 : 0.5, 
                      delay: prefersReducedMotion ? 0 : 0.8 + index * 0.1 
                    }}
                  >
                    {plan.name === "Enterprise" ? (
                      <motion.a
                        href="#contact"
                        className="w-full inline-flex items-center justify-center px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-light text-sm sm:text-base rounded-full hover:scale-105 transition-transform duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Contact Sales
                        <svg className="ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.a>
                    ) : (
                      <motion.a
                        href="#contact"
                        className={`w-full inline-flex items-center justify-center px-6 py-3 sm:py-4 font-light text-sm sm:text-base rounded-full hover:scale-105 transition-all duration-300 ${
                          plan.popular
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Get Started
                        <svg className="ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.a>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 1 }}
        >
          <p className="text-zinc-600 font-light text-xs sm:text-sm">
            All plans include free setup and onboarding. Cancel anytime.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}