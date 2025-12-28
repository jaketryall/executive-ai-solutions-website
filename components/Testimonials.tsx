"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const testimonials = [
  {
    quote: "The website exceeded our expectations. Clean, professional, and it actually brings in new students every week. The ROI has been incredible.",
    author: "Michael Torres",
    role: "Owner, Desert Wings Aviation",
    rating: 5,
    result: "3x increase in student inquiries",
    initials: "MT",
  },
  {
    quote: "Working with them was seamless. They understood our vision immediately and delivered a site that perfectly captures our brand.",
    author: "Sarah Chen",
    role: "CEO, Meridian Consulting",
    rating: 5,
    result: "40% improvement in lead quality",
    initials: "SC",
  },
  {
    quote: "Our new website has transformed how clients perceive us. The attention to detail and user experience is outstanding.",
    author: "James Richardson",
    role: "Principal, Apex Interiors",
    rating: 5,
    result: "Featured in Design Weekly",
    initials: "JR",
  },
  {
    quote: "Fast, responsive, and incredibly talented. They took our outdated site and turned it into something we're genuinely proud to show.",
    author: "Emily Watson",
    role: "Founder, Bloom Marketing",
    rating: 5,
    result: "2x website conversion rate",
    initials: "EW",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.svg
          key={i}
          className="w-5 h-5"
          style={{ color: i < rating ? "#3B82F6" : "#27272a" }}
          fill="currentColor"
          viewBox="0 0 20 20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="relative bg-[#0a0a0a] py-32">
      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-blue-500 text-sm font-medium tracking-wider uppercase mb-4"
              >
                Testimonials
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              >
                Client <span className="text-blue-500">Success</span>
                <br />
                Stories
              </motion.h2>
            </div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              {/* Progress indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveIndex(i);
                      setIsAutoPlaying(false);
                    }}
                    className="relative h-1 rounded-full overflow-hidden bg-zinc-800"
                    style={{ width: activeIndex === i ? 48 : 24 }}
                  >
                    {activeIndex === i && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-blue-500"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 6, ease: "linear" }}
                        key={activeIndex}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Arrow buttons */}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => {
                    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
                    setIsAutoPlaying(false);
                  }}
                  className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => {
                    setActiveIndex((prev) => (prev + 1) % testimonials.length);
                    setIsAutoPlaying(false);
                  }}
                  className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-900 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Main Testimonial Display */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
            {/* Featured Quote */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative p-10 md:p-14 rounded-3xl bg-zinc-900/50 border border-zinc-800 overflow-hidden"
              >
                {/* Large quote mark */}
                <div className="absolute top-8 right-8 text-[180px] leading-none font-serif text-blue-500/10 select-none">
                  &ldquo;
                </div>

                {/* Blue accent line */}
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-blue-500" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StarRating rating={activeTestimonial.rating} />

                    <blockquote className="mt-8 mb-10">
                      <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed">
                        &ldquo;{activeTestimonial.quote}&rdquo;
                      </p>
                    </blockquote>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-xl font-bold text-white"
                          whileHover={{ scale: 1.05 }}
                        >
                          {activeTestimonial.initials}
                        </motion.div>
                        <div>
                          <p className="font-semibold text-white text-lg">
                            {activeTestimonial.author}
                          </p>
                          <p className="text-zinc-400">{activeTestimonial.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-blue-500/10">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium text-blue-500">
                          {activeTestimonial.result}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Client Cards */}
            <div className="lg:col-span-2 space-y-4">
              {testimonials.map((testimonial, index) => (
                <motion.button
                  key={testimonial.author}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-full p-6 rounded-2xl text-left transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900/50"
                  } border`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                        activeIndex === index ? "bg-blue-500" : "bg-blue-500/40"
                      }`}
                    >
                      {testimonial.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{testimonial.author}</p>
                      <p className="text-sm text-zinc-500 truncate">{testimonial.role}</p>
                    </div>
                    {activeIndex === index && (
                      <motion.div
                        className="ml-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-zinc-800"
          >
            {[
              { value: "50+", label: "Happy Clients" },
              { value: "5.0", label: "Average Rating" },
              { value: "100%", label: "Satisfaction Rate" },
              { value: "24hr", label: "Avg Response Time" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <motion.p
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-zinc-500 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
