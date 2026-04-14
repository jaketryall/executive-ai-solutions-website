"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";
import { SplitText, useSplitTextReveal } from "@/lib/hooks";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollBackground from "@/components/homepage/ScrollBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Moving background orbs
function MovingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
          left: "-10%",
          top: "10%",
          animation: "float1 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
          right: "-5%",
          top: "40%",
          animation: "float2 30s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, rgba(255, 180, 120, 0.08) 0%, transparent 70%)`,
          left: "40%",
          bottom: "5%",
          animation: "float3 20s ease-in-out infinite",
        }}
      />

      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -40px) scale(1.05); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(1.08); }
          66% { transform: translate(40px, -50px) scale(0.92); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -30px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  // SplitText reveal for hero title
  useSplitTextReveal(heroContentRef);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const budgetOptions = [
    { value: "", label: "Select a budget range" },
    { value: "5k-10k", label: "$5,000 - $10,000" },
    { value: "10k-25k", label: "$10,000 - $25,000" },
    { value: "25k-50k", label: "$25,000 - $50,000" },
    { value: "50k+", label: "$50,000+" },
  ];

  return (
    <>
      <Navbar lightHero />
      <ScrollBackground />
      <main ref={containerRef} className="relative" style={{ zIndex: 10 }}>

        {/* Hero Section - Full height, dramatic */}
        <motion.section
          ref={heroRef}
          data-bg="cream"
          className="relative min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] flex items-end pb-12 md:pb-20 lg:pb-24 overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div ref={heroContentRef} className="relative z-10 w-full px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
              {/* Label */}
              <motion.p
                className="text-xs uppercase tracking-[0.4em] mb-6"
                style={{ color: "rgba(26,24,22,0.4)" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Contact
              </motion.p>

              {/* Large title — SplitText letter reveal */}
              <div className="grid md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-8">
                  <SplitText
                    text={"LET'S\nTALK"}
                    as="h1"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "clamp(4rem, 11vw, 10rem)",
                      fontWeight: 900,
                      color: "#1a1816",
                      lineHeight: 0.85,
                      letterSpacing: "-0.04em",
                    }}
                  />
                </div>

                <motion.div
                  className="md:col-span-4 pb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <p className="text-[#1a1816]/50 text-lg leading-relaxed">
                    Ready to start your project? Send me a message and I'll get back to you within 24 hours.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        <div data-bg="morph" className="h-[250px] md:h-[400px]" />

        {/* Main Content */}
        <section data-bg="dark" className="relative py-16 md:py-24 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 lg:gap-20">

              {/* Left Column - Form */}
              <div className="md:col-span-7">
                {isSubmitted ? (
                  <motion.div
                    className="flex flex-col items-center justify-center py-20 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <motion.div
                      className="w-24 h-24 rounded-full mb-8 flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2.5"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </motion.div>

                    <h2 className="text-4xl font-black text-white mb-4">
                      Message Sent
                    </h2>
                    <p className="text-white/50 text-lg mb-10 max-w-md">
                      Thanks for reaching out. I'll review your message and get back to you soon.
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
                      className="text-white/40 hover:text-white transition-colors text-sm tracking-wide"
                    >
                      ← Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-0"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* Form fields as large, clean inputs */}
                    <div className="space-y-1">
                      {/* Name */}
                      <div
                        className="py-6 border-b transition-colors"
                        style={{
                          borderColor: focusedField === "name" ? accentColor : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <label className="block text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
                          Name <span style={{ color: accentColor }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => {
                            setFocusedField("name");
                            play("hover", { volume: 0.03 });
                          }}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Your name"
                          className="w-full bg-transparent text-white text-2xl md:text-3xl font-medium outline-none placeholder:text-white/20"
                        />
                      </div>

                      {/* Email */}
                      <div
                        className="py-6 border-b transition-colors"
                        style={{
                          borderColor: focusedField === "email" ? accentColor : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <label className="block text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
                          Email <span style={{ color: accentColor }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => {
                            setFocusedField("email");
                            play("hover", { volume: 0.03 });
                          }}
                          onBlur={() => setFocusedField(null)}
                          placeholder="you@company.com"
                          className="w-full bg-transparent text-white text-2xl md:text-3xl font-medium outline-none placeholder:text-white/20"
                        />
                      </div>

                      {/* Company */}
                      <div
                        className="py-6 border-b transition-colors"
                        style={{
                          borderColor: focusedField === "company" ? accentColor : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <label className="block text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          onFocus={() => {
                            setFocusedField("company");
                            play("hover", { volume: 0.03 });
                          }}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Your company (optional)"
                          className="w-full bg-transparent text-white text-2xl md:text-3xl font-medium outline-none placeholder:text-white/20"
                        />
                      </div>

                      {/* Budget */}
                      <div
                        className="py-6 border-b transition-colors"
                        style={{
                          borderColor: focusedField === "budget" ? accentColor : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <label className="block text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
                          Budget
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          onFocus={() => {
                            setFocusedField("budget");
                            play("hover", { volume: 0.03 });
                          }}
                          onBlur={() => setFocusedField(null)}
                          className="w-full bg-transparent text-white text-2xl md:text-3xl font-medium outline-none cursor-pointer appearance-none"
                          style={{
                            color: formData.budget ? "white" : "rgba(255,255,255,0.2)",
                          }}
                        >
                          {budgetOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className="bg-[#0a0908] text-white"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Message */}
                      <div
                        className="py-6 border-b transition-colors"
                        style={{
                          borderColor: focusedField === "message" ? accentColor : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <label className="block text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
                          Project Details <span style={{ color: accentColor }}>*</span>
                        </label>
                        <textarea
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => {
                            setFocusedField("message");
                            play("hover", { volume: 0.03 });
                          }}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Tell me about your project, goals, and timeline..."
                          rows={4}
                          className="w-full bg-transparent text-white text-xl md:text-2xl font-medium outline-none placeholder:text-white/20 resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-10">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full overflow-hidden disabled:opacity-50"
                        style={{ background: accentColor }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onMouseEnter={() => play("hover", { volume: 0.06 })}
                      >
                        <span className="relative z-10 text-black text-lg font-semibold">
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </span>
                        <motion.span
                          className="relative z-10 w-10 h-10 rounded-full bg-black/10 flex items-center justify-center"
                          animate={{ x: isSubmitting ? 0 : [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </motion.span>
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </div>

              {/* Right Column - Info */}
              <div className="md:col-span-5">
                <motion.div
                  className="md:sticky md:top-32 space-y-12 lg:space-y-16"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {/* Email - Large and prominent */}
                  <div>
                    <p
                      className="text-xs uppercase tracking-[0.3em] mb-4"
                      style={{ color: accentColorMuted }}
                    >
                      Email
                    </p>
                    <a
                      href="mailto:jaker@executiveaisolutions.com"
                      className="text-xl md:text-2xl lg:text-3xl font-bold text-white hover:opacity-80 transition-opacity block break-all"
                      onMouseEnter={() => play("hover", { volume: 0.04 })}
                    >
                      jaker@executiveaisolutions.com
                    </a>
                  </div>

                  {/* Status */}
                  <div>
                    <p
                      className="text-xs uppercase tracking-[0.3em] mb-4"
                      style={{ color: accentColorMuted }}
                    >
                      Status
                    </p>
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="w-2.5 h-2.5 rounded-full bg-green-400"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [1, 0.7, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-white text-lg">
                        Available for new projects
                      </span>
                    </div>
                  </div>

                  {/* Response time */}
                  <div>
                    <p
                      className="text-xs uppercase tracking-[0.3em] mb-4"
                      style={{ color: accentColorMuted }}
                    >
                      Response Time
                    </p>
                    <p className="text-white/70 text-lg">
                      Within 24 hours
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px w-full"
                    style={{ background: `linear-gradient(to right, ${accentColorMuted}, transparent)` }}
                  />

                  {/* Quick info cards */}
                  <div className="grid grid-cols-2 gap-6">
                    <div
                      className="p-5 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <span
                        className="text-3xl font-black block mb-1"
                        style={{ color: accentColor }}
                      >
                        2+
                      </span>
                      <span className="text-white/40 text-sm">Years Experience</span>
                    </div>
                    <div
                      className="p-5 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <span
                        className="text-3xl font-black block mb-1"
                        style={{ color: accentColor }}
                      >
                        100%
                      </span>
                      <span className="text-white/40 text-sm">Direct Access</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-white/40">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Based in Arizona, working worldwide</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section data-bg="dark" className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: accentColorMuted }}
              >
                FAQ
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.03em]">
                Common Questions
              </h2>
            </motion.div>

            <div className="space-y-0">
              {[
                {
                  q: "What's your typical project timeline?",
                  a: "Most projects take 6-10 weeks from kickoff to launch. Complex projects may take longer—I'll give you a realistic timeline during our first call.",
                },
                {
                  q: "What technologies do you use?",
                  a: "I primarily build with Next.js, React, TypeScript, and Tailwind CSS. For content management, I use Sanity CMS—a powerful, customizable headless CMS that gives you complete control over your content.",
                },
                {
                  q: "Do you offer ongoing support?",
                  a: "Yes. I offer maintenance packages for hosting, updates, and optimizations. I'm invested in your long-term success, not just the launch.",
                },
                {
                  q: "What's included in your pricing?",
                  a: "Everything: strategy, design, development, and launch. I provide detailed proposals with transparent pricing—no surprise fees.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={faq.q}
                  className="py-8 border-b border-white/5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{faq.q}</h3>
                  <p className="text-white/50 text-lg leading-relaxed">{faq.a}</p>
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
