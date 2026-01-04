"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Section reveal with clip-path from top
      if (sectionRef.current) {
        gsap.fromTo(
          sectionRef.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }

      // Header animations
      if (headerRef.current) {
        const label = headerRef.current.querySelector(".contact-label");
        const title = headerRef.current.querySelector(".contact-title");

        if (label) {
          gsap.fromTo(
            label,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (title) {
          gsap.fromTo(
            title,
            { y: 80, opacity: 0, skewY: 4 },
            {
              y: 0,
              opacity: 1,
              skewY: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      // Content columns animation
      if (contentRef.current) {
        const leftCol = contentRef.current.querySelector(".contact-left");
        const rightCol = contentRef.current.querySelector(".contact-right");

        if (leftCol) {
          gsap.fromTo(
            leftCol,
            { x: -60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (rightCol) {
          gsap.fromTo(
            rightCol,
            { x: 60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1,
              delay: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const budgetOptions = ["$5K - $10K", "$10K - $25K", "$25K - $50K", "$50K+"];

  return (
    <section ref={sectionRef} id="contact" className="relative py-32 bg-neutral-950 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00f0ff]/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <p className="contact-label text-white/40 text-sm uppercase tracking-[0.3em] mb-4">
            Start a Project
          </p>
          <h2 className="contact-title text-[12vw] md:text-[8vw] font-black text-white leading-[0.9] tracking-[-0.02em]">
            LET'S TALK
          </h2>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left side - Info */}
          <div className="contact-left">
            <p className="text-white/60 text-xl md:text-2xl leading-relaxed mb-12">
              Ready to build something extraordinary? We partner with ambitious brands to create digital experiences that demand attention.
            </p>

            <div className="space-y-8">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">Email</p>
                <a
                  href="mailto:hello@executive.ai"
                  className="text-white text-xl hover:text-[#00f0ff] transition-colors"
                >
                  hello@executive.ai
                </a>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">Response Time</p>
                <p className="text-white text-xl">Within 24 hours</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-2">Status</p>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                  <p className="text-white text-xl">Taking new projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="contact-right">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 rounded-full border border-[#00f0ff] flex items-center justify-center mb-8"
                >
                  <svg className="w-10 h-10 text-[#00f0ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-4xl font-black text-white mb-4">MESSAGE SENT</h3>
                <p className="text-white/60 text-lg">We'll be in touch within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name */}
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white text-lg focus:border-[#00f0ff] focus:outline-none transition-colors placeholder:text-white/20"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white text-lg focus:border-[#00f0ff] focus:outline-none transition-colors placeholder:text-white/20"
                    placeholder="you@company.com"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
                    Budget
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {budgetOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget: option })}
                        className={`py-3 px-4 text-sm font-medium transition-all duration-300 rounded-full ${
                          formData.budget === option
                            ? "bg-[#00f0ff] text-black"
                            : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
                    Project Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white text-lg focus:border-[#00f0ff] focus:outline-none transition-colors resize-none placeholder:text-white/20"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full py-5 text-white font-bold text-sm uppercase tracking-[0.2em] overflow-hidden rounded-full"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="absolute inset-0 border border-white/30 group-hover:border-[#00f0ff] transition-colors duration-300 rounded-full" />
                  <motion.span
                    className="absolute inset-0 bg-[#00f0ff] rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                  <span className="relative z-10 group-hover:text-black transition-colors duration-300 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <motion.span
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
