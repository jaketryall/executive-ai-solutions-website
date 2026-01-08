"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Form field component with animated underline
function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  isTextarea = false,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  isTextarea?: boolean;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const { play } = useSound();

  const inputClasses =
    "w-full bg-transparent text-white text-lg py-4 outline-none placeholder:text-white/30";

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <label
        className="text-xs uppercase tracking-[0.2em] block mb-2"
        style={{ color: isFocused ? accentColor : "rgba(255,255,255,0.4)" }}
      >
        {label}
        {required && <span style={{ color: accentColor }}> *</span>}
      </label>

      {isTextarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => {
            setIsFocused(true);
            play("hover", { volume: 0.03 });
          }}
          onBlur={() => setIsFocused(false)}
          className={`${inputClasses} resize-none min-h-[150px]`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => {
            setIsFocused(true);
            play("hover", { volume: 0.03 });
          }}
          onBlur={() => setIsFocused(false)}
          className={inputClasses}
        />
      )}

      {/* Animated underline */}
      <div className="relative h-px bg-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 right-0"
          style={{ backgroundColor: accentColor }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    play("click");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        play("success");
      } else {
        play("error");
      }
    } catch {
      play("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main ref={containerRef} className="relative bg-[#0a0908]" style={{ zIndex: 10 }}>
        {/* Hero Section */}
      <motion.section
        className="relative h-[60vh] flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 30%, rgba(255, 200, 150, 0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.p
            className="text-xs uppercase tracking-[0.4em] mb-6"
            style={{ color: accentColorMuted }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get In Touch
          </motion.p>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-[-0.03em] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Let's create
            <br />
            <span style={{ color: accentColor }}>something great</span>
          </motion.h1>

          <motion.p
            className="text-white/50 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Have a project in mind? We'd love to hear about it. Drop us a line
            and we'll get back to you within 24 hours.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Form */}
            <div>
              {isSubmitted ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      strokeWidth="3"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </motion.div>

                  <h2 className="text-3xl font-black text-white mb-4">
                    Message Sent!
                  </h2>
                  <p className="text-white/50 mb-8">
                    Thanks for reaching out. We'll be in touch soon.
                  </p>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        company: "",
                        budget: "",
                        message: "",
                      });
                    }}
                    className="text-white/40 hover:text-white transition-colors underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      label="Name"
                      name="name"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="john@company.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                      label="Company"
                      name="company"
                      placeholder="Your company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                    <FormField
                      label="Budget"
                      name="budget"
                      placeholder="$10k - $50k"
                      value={formData.budget}
                      onChange={handleChange}
                    />
                  </div>

                  <FormField
                    label="Message"
                    name="message"
                    placeholder="Tell us about your project..."
                    required
                    isTextarea
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-full overflow-hidden disabled:opacity-50"
                    style={{
                      background: accentColor,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => play("hover", { volume: 0.06 })}
                  >
                    <span className="relative z-10 text-black font-semibold">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </span>
                    <span className="relative z-10 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center transition-transform group-hover:translate-x-1">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </motion.button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:pl-10">
              <motion.div
                className="sticky top-32 space-y-12"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {/* Email */}
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.3em] mb-3"
                    style={{ color: accentColorMuted }}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:hello@executive.ai"
                    className="text-2xl md:text-3xl font-bold text-white hover:text-white/80 transition-colors"
                    onMouseEnter={() => play("hover", { volume: 0.04 })}
                  >
                    hello@executive.ai
                  </a>
                </div>

                {/* Availability */}
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.3em] mb-3"
                    style={{ color: accentColorMuted }}
                  >
                    Availability
                  </p>
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-white/70">
                      Currently accepting new projects
                    </span>
                  </div>
                </div>

                {/* Response time */}
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.3em] mb-3"
                    style={{ color: accentColorMuted }}
                  >
                    Response Time
                  </p>
                  <p className="text-white/70">
                    We typically respond within 24 hours
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="h-px w-16"
                  style={{ backgroundColor: accentColorMuted }}
                />

                {/* Social */}
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.3em] mb-4"
                    style={{ color: accentColorMuted }}
                  >
                    Follow Us
                  </p>
                  <div className="flex gap-4">
                    {["Twitter", "LinkedIn", "Dribbble"].map((social) => (
                      <motion.a
                        key={social}
                        href="#"
                        className="text-white/50 hover:text-white transition-colors text-sm"
                        whileHover={{ y: -2 }}
                        onMouseEnter={() => play("hover", { volume: 0.03 })}
                      >
                        {social}
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <motion.div
                  className="p-6 rounded-sm border border-white/5"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <p className="text-white/60 italic leading-relaxed">
                    "Every great project starts with a conversation. We're here
                    to listen, understand, and help bring your vision to life."
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p
              className="text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: accentColorMuted }}
            >
              Common Questions
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.02em]">
              Before you ask
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                q: "What's your typical project timeline?",
                a: "Most projects take 8-12 weeks from kickoff to launch. Complex projects may take longer. We'll provide a detailed timeline during our initial consultation.",
              },
              {
                q: "Do you work with startups?",
                a: "We work with businesses of all sizes, from funded startups to established enterprises. What matters most is the ambition and clarity of the project.",
              },
              {
                q: "What's included in your pricing?",
                a: "Our pricing includes strategy, design, development, and launch support. We provide detailed proposals with transparent pricing—no hidden fees.",
              },
              {
                q: "Do you offer ongoing support?",
                a: "Yes, we offer maintenance and optimization packages for all projects we deliver. We're invested in your long-term success.",
              },
            ].map((faq, index) => (
              <motion.div
                key={faq.q}
                className="border-b border-white/5 pb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold text-white mb-3">{faq.q}</h3>
                <p className="text-white/50 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
