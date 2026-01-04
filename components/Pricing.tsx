"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Smooth easing curve
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Configuration options
const projectTypes = [
  { id: "landing", label: "Landing Page", basePrice: 1500 },
  { id: "business", label: "Business Website", basePrice: 3000 },
  { id: "ecommerce", label: "E-commerce", basePrice: 5000 },
  { id: "webapp", label: "Web Application", basePrice: 8000 },
];

const pageOptions = [
  { id: "1-3", label: "1-3 pages", multiplier: 1, description: "Perfect for landing pages" },
  { id: "4-7", label: "4-7 pages", multiplier: 1.4, description: "Standard business site" },
  { id: "8-15", label: "8-15 pages", multiplier: 1.8, description: "Comprehensive website" },
  { id: "15+", label: "15+ pages", multiplier: 2.5, description: "Large-scale project" },
];

const addons = [
  { id: "cms", label: "CMS Integration", price: 500, icon: "📝", description: "Edit content yourself" },
  { id: "blog", label: "Blog System", price: 400, icon: "✍️", description: "Share your thoughts" },
  { id: "animations", label: "Custom Animations", price: 600, icon: "✨", description: "Micro-interactions & motion" },
  { id: "seo", label: "SEO Optimization", price: 350, icon: "🔍", description: "Rank higher on Google" },
  { id: "analytics", label: "Analytics Setup", price: 200, icon: "📊", description: "Track your visitors" },
  { id: "forms", label: "Advanced Forms", price: 300, icon: "📋", description: "Multi-step & validation" },
];

const timelineOptions = [
  { id: "relaxed", label: "Relaxed", weeks: "4-6 weeks", multiplier: 0.9, description: "No rush" },
  { id: "standard", label: "Standard", weeks: "2-3 weeks", multiplier: 1, description: "Recommended" },
  { id: "rush", label: "Rush", weeks: "1-2 weeks", multiplier: 1.3, description: "Priority delivery" },
];

// Animated counter component
function AnimatedPrice({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const duration = 500;
    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>${displayValue.toLocaleString()}</span>;
}

// Option button component
function OptionButton({
  selected,
  onClick,
  children,
  description,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  description?: string;
  badge?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 text-left transition-colors duration-300 ${
        selected
          ? "border-[#9a7b3c] bg-[#9a7b3c]/10"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {badge && (
        <span className="absolute -top-2 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#9a7b3c] text-white rounded-full">
          {badge}
        </span>
      )}
      <div className={`font-semibold ${selected ? "text-white" : "text-zinc-300"}`}>
        {children}
      </div>
      {description && (
        <div className={`text-sm mt-1 ${selected ? "text-[#b89a5e]" : "text-zinc-500"}`}>
          {description}
        </div>
      )}
      {selected && (
        <motion.div
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#9a7b3c] flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}

// Addon toggle component
function AddonToggle({
  addon,
  selected,
  onToggle,
}: {
  addon: (typeof addons)[0];
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
        selected
          ? "border-[#9a7b3c] bg-[#9a7b3c]/10"
          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{addon.icon}</span>
          <div>
            <div className={`font-semibold ${selected ? "text-white" : "text-zinc-300"}`}>
              {addon.label}
            </div>
            <div className={`text-sm ${selected ? "text-[#b89a5e]" : "text-zinc-500"}`}>
              {addon.description}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-sm font-medium ${selected ? "text-[#b89a5e]" : "text-zinc-500"}`}>
            +${addon.price}
          </span>
          <motion.div
            className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${
              selected ? "bg-[#9a7b3c]" : "bg-zinc-700"
            }`}
          >
            <motion.div
              className="w-4 h-4 rounded-full bg-white"
              animate={{ x: selected ? 16 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
}

// Price breakdown item
function BreakdownItem({
  label,
  value,
  isNew,
}: {
  label: string;
  value: number;
  isNew?: boolean;
}) {
  return (
    <motion.div
      className="flex items-center justify-between py-2"
      initial={isNew ? { opacity: 0, x: -10 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-zinc-400">{label}</span>
      <span className="text-white font-medium">+${value.toLocaleString()}</span>
    </motion.div>
  );
}

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  // Configuration state
  const [projectType, setProjectType] = useState(projectTypes[1]);
  const [pages, setPages] = useState(pageOptions[1]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["cms"]);
  const [timeline, setTimeline] = useState(timelineOptions[1]);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.15"],
  });

  // UNIQUE TRANSITION: Blur Slide with Glass Shatter Effect
  // Section slides up while deblurring, with glass-like reveal
  const blurAmount = useTransform(sectionProgress, [0, 0.5], [20, 0]);
  const slideY = useTransform(sectionProgress, [0, 0.7], [120, 0]);
  const slideOpacity = useTransform(sectionProgress, [0, 0.4], [0, 1]);
  const slideScale = useTransform(sectionProgress, [0, 0.6], [0.96, 1]);

  // Glass reveal effect - clip path that expands
  const clipProgress = useTransform(sectionProgress, [0.1, 0.6], [0, 1]);
  const clipPath = useTransform(
    clipProgress,
    [0, 1],
    [
      "polygon(5% 10%, 95% 10%, 95% 10%, 5% 10%)",
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
    ]
  );

  // Shimmer line that sweeps across during reveal
  const shimmerX = useTransform(sectionProgress, [0.2, 0.7], ["-100%", "200%"]);
  const shimmerOpacity = useTransform(sectionProgress, [0.2, 0.4, 0.65, 0.7], [0, 0.6, 0.6, 0]);

  // Border radius that morphs
  const borderRadius = useTransform(sectionProgress, [0, 1], ["5rem", "3rem"]);

  // Inner glow that pulses during transition
  const glowOpacity = useTransform(sectionProgress, [0.3, 0.5, 0.7], [0, 0.15, 0.05]);

  // Calculate total price
  const basePrice = projectType.basePrice * pages.multiplier;
  const addonsPrice = addons
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);
  const subtotal = basePrice + addonsPrice;
  const totalPrice = Math.round(subtotal * timeline.multiplier);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  return (
    <motion.section
      ref={sectionRef}
      id="pricing"
      className="relative bg-[#0a0a0a] -mt-12 z-50 shadow-section-stack overflow-hidden"
      style={{
        opacity: slideOpacity,
        y: slideY,
        scale: slideScale,
        filter: useTransform(blurAmount, (blur) => `blur(${blur}px)`),
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
      }}
    >
      {/* Glass shatter/reveal overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "linear-gradient(135deg, rgba(184,154,94,0.1) 0%, transparent 50%, rgba(184,154,94,0.05) 100%)",
          clipPath,
          opacity: useTransform(clipProgress, [0, 0.5, 1], [1, 0.5, 0]),
        }}
      />

      {/* Horizontal shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
          x: shimmerX,
          opacity: shimmerOpacity,
        }}
      />

      {/* Inner gold glow during transition */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(ellipse at 50% 30%, rgba(184,154,94,0.3) 0%, transparent 60%)",
        }}
      />

      <div className="px-6 md:px-12 lg:px-20 py-32">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="text-[#b89a5e] text-sm font-medium tracking-wider uppercase mb-4"
            >
              Pricing
            </motion.p>

            <div className="overflow-hidden mb-6">
              <motion.h2
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              >
                Build your
                <br />
                <span className="text-[#b89a5e]">custom quote</span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
              className="text-xl text-zinc-400 leading-relaxed"
            >
              Select your options below and watch your quote build in real-time.
              No hidden fees, no surprises.
            </motion.p>
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left column - Configuration */}
            <div className="lg:col-span-2 space-y-12">
              {/* Project Type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-bold text-white mb-2">Project Type</h3>
                <p className="text-zinc-500 mb-6">What are you building?</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {projectTypes.map((type) => (
                    <OptionButton
                      key={type.id}
                      selected={projectType.id === type.id}
                      onClick={() => setProjectType(type)}
                      description={`From $${type.basePrice.toLocaleString()}`}
                    >
                      {type.label}
                    </OptionButton>
                  ))}
                </div>
              </motion.div>

              {/* Page Count */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-xl font-bold text-white mb-2">Number of Pages</h3>
                <p className="text-zinc-500 mb-6">How many pages do you need?</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pageOptions.map((option) => (
                    <OptionButton
                      key={option.id}
                      selected={pages.id === option.id}
                      onClick={() => setPages(option)}
                      description={option.description}
                    >
                      {option.label}
                    </OptionButton>
                  ))}
                </div>
              </motion.div>

              {/* Add-ons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-2">Add-ons</h3>
                <p className="text-zinc-500 mb-6">Enhance your project with these extras</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {addons.map((addon) => (
                    <AddonToggle
                      key={addon.id}
                      addon={addon}
                      selected={selectedAddons.includes(addon.id)}
                      onToggle={() => toggleAddon(addon.id)}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white mb-2">Timeline</h3>
                <p className="text-zinc-500 mb-6">How quickly do you need it?</p>
                <div className="grid grid-cols-3 gap-4">
                  {timelineOptions.map((option) => (
                    <OptionButton
                      key={option.id}
                      selected={timeline.id === option.id}
                      onClick={() => setTimeline(option)}
                      description={option.weeks}
                      badge={option.id === "standard" ? "Popular" : undefined}
                    >
                      {option.label}
                    </OptionButton>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right column - Price summary (sticky) */}
            <div className="lg:col-span-1">
              <motion.div
                className="lg:sticky lg:top-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm">
                  {/* Summary header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Your Quote</h3>
                    <motion.div
                      className="px-3 py-1 rounded-full bg-[#9a7b3c]/20 border border-[#9a7b3c]/30"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.3 }}
                      key={totalPrice}
                    >
                      <span className="text-sm font-medium text-[#b89a5e]">Live</span>
                    </motion.div>
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-1 border-b border-zinc-800 pb-6 mb-6">
                    <BreakdownItem
                      label={projectType.label}
                      value={projectType.basePrice}
                    />
                    {pages.multiplier > 1 && (
                      <BreakdownItem
                        label={`${pages.label} (×${pages.multiplier})`}
                        value={Math.round(projectType.basePrice * (pages.multiplier - 1))}
                        isNew
                      />
                    )}
                    <AnimatePresence>
                      {addons
                        .filter((a) => selectedAddons.includes(a.id))
                        .map((addon) => (
                          <BreakdownItem
                            key={addon.id}
                            label={addon.label}
                            value={addon.price}
                            isNew
                          />
                        ))}
                    </AnimatePresence>
                    {timeline.multiplier !== 1 && (
                      <BreakdownItem
                        label={`${timeline.label} delivery`}
                        value={Math.round(subtotal * (timeline.multiplier - 1))}
                        isNew
                      />
                    )}
                  </div>

                  {/* Total */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-400">Estimated Total</span>
                      <motion.span
                        className="text-4xl font-bold text-[#b89a5e]"
                        key={totalPrice}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <AnimatedPrice value={totalPrice} />
                      </motion.span>
                    </div>
                    <p className="text-xs text-zinc-500 text-right">
                      Final price may vary based on requirements
                    </p>
                  </div>

                  {/* CTA */}
                  <Link href="#contact">
                    <motion.button
                      className="w-full py-4 bg-[#9a7b3c] text-white font-semibold rounded-2xl relative overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Get Started
                        <motion.span
                          className="inline-block"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-[#7d6230]"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </Link>

                  {/* Consultation note */}
                  <p className="text-center text-sm text-zinc-500 mt-4">
                    or{" "}
                    <Link href="#contact" className="text-[#b89a5e] hover:underline">
                      book a free consultation
                    </Link>
                  </p>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs">Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs">Quick Response</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 text-center"
          >
            <div className="inline-flex items-center gap-4 px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9a7b3c]" />
                <span className="text-zinc-400 text-sm">
                  Need something custom? We can build anything
                </span>
              </div>
              <div className="w-px h-4 bg-zinc-700" />
              <Link
                href="#contact"
                className="text-[#b89a5e] hover:text-[#c4ad84] text-sm font-medium transition-colors"
              >
                Let's talk →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
