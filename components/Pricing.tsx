"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

// Smooth easing curve
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const plans = [
  {
    name: "Landing Page",
    price: "$1,500",
    description: "Perfect for startups needing a strong online presence.",
    features: [
      "Single page website",
      "Mobile responsive design",
      "Contact form integration",
      "Basic SEO setup",
      "2 rounds of revisions",
      "30 days of support",
    ],
    popular: false,
  },
  {
    name: "Business Site",
    price: "$3,500",
    description: "Comprehensive website for businesses ready to scale.",
    features: [
      "Up to 5 pages",
      "Custom design & animations",
      "CMS integration",
      "Advanced SEO setup",
      "Blog functionality",
      "Analytics integration",
      "3 rounds of revisions",
      "60 days of support",
    ],
    popular: true,
  },
  {
    name: "Custom Project",
    price: "Let's Talk",
    description: "Complex projects with unique requirements.",
    features: [
      "Unlimited pages",
      "Custom functionality",
      "E-commerce integration",
      "Third-party integrations",
      "Priority support",
      "Dedicated project manager",
      "Unlimited revisions",
      "90 days of support",
    ],
    popular: false,
  },
];

function PricingCard({
  plan,
  index,
}: {
  plan: typeof plans[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative ${plan.popular ? "lg:-mt-8 lg:mb-8" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={`relative h-full rounded-3xl overflow-hidden ${
          plan.popular
            ? "bg-amber-500/10"
            : "bg-zinc-900/50"
        }`}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Border */}
        <div
          className={`absolute inset-0 rounded-3xl border ${
            plan.popular ? "border-amber-500/30" : "border-zinc-800"
          }`}
        />

        {/* Glow effect for popular */}
        {plan.popular && (
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0"
            style={{
              boxShadow: "0 0 80px rgba(212, 165, 55, 0.2)",
            }}
            animate={{ opacity: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Popular badge */}
        {plan.popular && (
          <div className="absolute -top-px left-1/2 -translate-x-1/2">
            <motion.div
              className="px-6 py-2 bg-amber-500 rounded-b-2xl"
              initial={{ y: -40 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="text-sm font-semibold text-white uppercase tracking-wider">
                Most Popular
              </span>
            </motion.div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 pt-4">
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-zinc-400 text-sm">{plan.description}</p>
          </div>

          {/* Price */}
          <div className="mb-8">
            <motion.div
              className="flex items-baseline gap-2"
              animate={{ scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-5xl md:text-6xl font-bold text-amber-500">
                {plan.price}
              </span>
              {plan.price !== "Let's Talk" && (
                <span className="text-zinc-500 text-sm">starting</span>
              )}
            </motion.div>
          </div>

          {/* CTA Button */}
          <div className="mb-8">
            <Link href="#contact">
              <motion.div
                className={`relative w-full py-4 text-center font-semibold rounded-2xl overflow-hidden ${
                  plan.popular
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700"
                } transition-colors duration-300`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <motion.span
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.div>
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-800 mb-8" />

          {/* Features */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-4 font-medium">
              What's included
            </p>
            <ul className="space-y-4">
              {plan.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <motion.div
                    className="mt-1 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0"
                    animate={{
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                  >
                    <svg
                      className="w-3 h-3 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  <span className="text-zinc-300 text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-[#0a0a0a] py-32 rounded-t-[3rem] -mt-12 z-50 shadow-section-stack">
      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="text-amber-500 text-sm font-medium tracking-wider uppercase mb-4"
            >
              Pricing
            </motion.p>

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                Transparent{" "}
                <motion.span
                  className="text-amber-500 inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4, ease: smoothEase }}
                >
                  Pricing
                </motion.span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto"
            >
              No hidden fees. No surprises. Just honest pricing for quality work.
            </motion.p>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {plans.map((plan, index) => (
              <PricingCard key={plan.name} plan={plan} index={index} />
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-4 px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-zinc-400 text-sm">
                  All projects include a free 30-minute consultation
                </span>
              </div>
              <div className="w-px h-4 bg-zinc-700" />
              <Link
                href="#contact"
                className="text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors"
              >
                Let's discuss your project →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
