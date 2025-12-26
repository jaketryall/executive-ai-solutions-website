"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";

// Animated button with staggered text reveal
function AnimatedPricingButton({
  text,
  href,
  variant = "dark",
}: {
  text: string;
  href: string;
  variant?: "dark" | "light";
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  const getDelay = (index: number) => {
    const baseDelay = 0.025;
    const acceleration = 0.85;
    let delay = 0;
    for (let i = 0; i < index; i++) {
      delay += baseDelay * Math.pow(acceleration, i);
    }
    return delay;
  };

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center justify-center w-full py-4 text-center font-medium rounded-full transition-all ${
        variant === "light"
          ? "bg-white text-[#0a0a0a] hover:bg-zinc-100"
          : "bg-[#0a0a0a] text-white hover:bg-zinc-800"
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <span className="inline-flex items-center relative">
        {characters.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden relative"
            style={{
              height: "1.2em",
              lineHeight: "1.2em",
            }}
          >
            <motion.span
              className="inline-block"
              animate={{
                y: isHovered ? "-110%" : "0%",
              }}
              transition={{
                duration: 0.25,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            <motion.span
              className="inline-block absolute left-0 top-0"
              animate={{
                y: isHovered ? "0%" : "110%",
              }}
              transition={{
                duration: 0.25,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.a>
  );
}

// Animated inline link with staggered text reveal
function AnimatedInlineLink({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  const getDelay = (index: number) => {
    const baseDelay = 0.02;
    const acceleration = 0.88;
    let delay = 0;
    for (let i = 0; i < index; i++) {
      delay += baseDelay * Math.pow(acceleration, i);
    }
    return delay;
  };

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-block text-[#2563eb]"
    >
      <span className="inline-flex items-center relative">
        {characters.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden relative"
            style={{
              height: "1.2em",
              lineHeight: "1.2em",
            }}
          >
            <motion.span
              className="inline-block"
              animate={{
                y: isHovered ? "-110%" : "0%",
              }}
              transition={{
                duration: 0.2,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            <motion.span
              className="inline-block absolute left-0 top-0"
              animate={{
                y: isHovered ? "0%" : "110%",
              }}
              transition={{
                duration: 0.2,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
    </Link>
  );
}

// 3D Pricing card with subtle tilt effect
function PricingCard({
  plan,
  index,
}: {
  plan: (typeof plans)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className={`relative p-8 rounded-2xl border h-full ${
          plan.popular
            ? "border-[#2563eb] bg-[#0a0a0a] text-white"
            : "border-zinc-200 bg-white"
        }`}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Subtle glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? plan.popular
                ? "0 20px 40px rgba(37, 99, 235, 0.2)"
                : "0 20px 40px rgba(0, 0, 0, 0.1)"
              : "0 0 0 rgba(0, 0, 0, 0)",
          }}
          transition={{ duration: 0.3 }}
        />

        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="px-4 py-1 bg-[#2563eb] text-white text-xs font-medium rounded-full uppercase tracking-wider">
              Most Popular
            </span>
          </div>
        )}

        <div className="mb-6">
          <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? "text-white" : "text-[#0a0a0a]"}`}>
            {plan.name}
          </h3>
          <p className={`text-sm ${plan.popular ? "text-zinc-400" : "text-zinc-500"}`}>
            {plan.description}
          </p>
        </div>

        <div className="mb-8">
          <span className={`text-4xl md:text-5xl font-semibold ${plan.popular ? "text-white" : "text-[#0a0a0a]"}`}>
            {plan.price}
          </span>
          {plan.price !== "Let's Talk" && (
            <span className={`text-sm ${plan.popular ? "text-zinc-400" : "text-zinc-500"}`}> starting</span>
          )}
        </div>

        <ul className="space-y-4 mb-8">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 shrink-0 text-[#2563eb]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className={`text-sm ${plan.popular ? "text-zinc-300" : "text-zinc-600"}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <AnimatedPricingButton
          href="#contact"
          text="Get Started"
          variant={plan.popular ? "light" : "dark"}
        />
      </motion.div>
    </motion.div>
  );
}

const plans = [
  {
    name: "Landing Page",
    price: "$1,500",
    description: "Perfect for startups and small businesses needing a strong online presence.",
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
    description: "Comprehensive website for established businesses ready to scale.",
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
    description: "Complex projects, e-commerce, or unique requirements.",
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

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32 md:py-40 px-6 md:px-12 lg:px-24 bg-white rounded-t-[2rem] -mt-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-12 h-px bg-zinc-300 origin-right"
            />
            <span className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
              Pricing
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-12 h-px bg-zinc-300 origin-left"
            />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0a0a0a] tracking-tight mb-6">
            Transparent <span className="font-serif italic text-[#2563eb]">pricing</span>
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
            No hidden fees. No surprises. Just honest pricing for quality work.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-zinc-500">
            All projects include a free 30-minute consultation.{" "}
            <AnimatedInlineLink href="#contact" text="Let's discuss your project →" />
          </p>
        </motion.div>
      </div>
    </section>
  );
}
