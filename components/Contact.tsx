"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";

// Animated submit button with staggered text reveal
function AnimatedSubmitButton({
  isSubmitting,
}: {
  isSubmitting: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const text = "Send Message";
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

  if (isSubmitting) {
    return (
      <button
        type="submit"
        disabled
        className="w-full md:w-auto px-8 py-4 bg-white text-[#0a0a0a] font-medium rounded-full opacity-50 cursor-not-allowed mt-8"
      >
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
          Sending...
        </span>
      </button>
    );
  }

  return (
    <motion.button
      type="submit"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full md:w-auto px-8 py-4 bg-white text-[#0a0a0a] font-medium rounded-full hover:bg-zinc-100 transition-colors mt-8 flex items-center justify-center"
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
    </motion.button>
  );
}

export default function Contact() {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 md:py-40 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] overflow-hidden rounded-t-[2rem] -mt-8"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <span className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4 block">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-6">
            Let&apos;s work <span className="font-serif italic text-[#2563eb]">together</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Have a project in mind? I&apos;d love to hear about it.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="py-6 border-t border-zinc-800">
              <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-3">Email</p>
              <a
                href="mailto:hello@executiveai.com"
                className="text-xl md:text-2xl text-white hover:text-[#2563eb] transition-colors"
              >
                hello@executiveai.com
              </a>
            </div>

            <div className="py-6 border-t border-zinc-800">
              <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-3">Response Time</p>
              <p className="text-xl md:text-2xl text-white">Within 24 hours</p>
            </div>

            <div className="py-6 border-t border-zinc-800">
              <p className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-3">Availability</p>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xl md:text-2xl text-white">Taking new projects</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex items-center justify-center p-12 border border-zinc-800 rounded-2xl"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Message sent!</h3>
                  <p className="text-zinc-400">I&apos;ll get back to you within 24 hours.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-zinc-500 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-0 py-4 bg-transparent border-b border-zinc-800 text-white placeholder-zinc-600 focus:border-[#2563eb] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-zinc-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-0 py-4 bg-transparent border-b border-zinc-800 text-white placeholder-zinc-600 focus:border-[#2563eb] focus:outline-none transition-colors"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-zinc-500 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-0 py-4 bg-transparent border-b border-zinc-800 text-white placeholder-zinc-600 focus:border-[#2563eb] focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <AnimatedSubmitButton isSubmitting={isSubmitting} />
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
