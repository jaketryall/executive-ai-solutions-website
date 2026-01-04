"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Magnetic button component
function MagneticButton({
  children,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Magnetic pull - button moves toward cursor
    setPosition({
      x: distanceX * 0.3,
      y: distanceY * 0.3,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      type="submit"
      disabled={disabled}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.button>
  );
}

// Typewriter text component
function TypewriterText({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className={className}>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const connectionLinesRef = useRef<SVGSVGElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ===== BLUEPRINT GRID REVEAL =====
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current,
          { opacity: 0, scale: 1.1 },
          {
            opacity: 0.08,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 40%",
              scrub: 0.5,
              onEnter: () => setIsRevealed(true),
              onLeaveBack: () => setIsRevealed(false),
            },
          }
        );
      }

      // ===== HEADER - Comes toward you =====
      if (headerRef.current) {
        const label = headerRef.current.querySelector(".section-label");
        const title = headerRef.current.querySelector(".section-title");

        // Title scales up toward camera
        gsap.fromTo(
          title,
          { scale: 0.7, opacity: 0, y: 80 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 40%",
              scrub: 0.5,
            },
          }
        );

        // Label fades in
        gsap.fromTo(
          label,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 50%",
              scrub: 0.3,
            },
          }
        );
      }

      // ===== CONTENT - Comes toward you with scrub =====
      if (contentRef.current) {
        const infoSection = contentRef.current.querySelector(".contact-info");
        const formSection = contentRef.current.querySelector(".contact-form");
        const infoBlocks = contentRef.current.querySelectorAll(".info-block");
        const formFields = contentRef.current.querySelectorAll(".form-field");

        // Info section comes toward camera
        if (infoSection) {
          gsap.fromTo(
            infoSection,
            { scale: 0.85, opacity: 0, y: 60 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top bottom",
                end: "top 50%",
                scrub: 0.5,
              },
            }
          );
        }

        // Form section comes toward camera with slight delay
        if (formSection) {
          gsap.fromTo(
            formSection,
            { scale: 0.85, opacity: 0, y: 80 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top 90%",
                end: "top 40%",
                scrub: 0.6,
              },
            }
          );
        }

        // Info blocks stagger in
        infoBlocks.forEach((block, index) => {
          gsap.fromTo(
            block,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: block,
                start: "top bottom",
                end: "top 70%",
                scrub: 0.3,
              },
            }
          );
        });

        // Form fields stagger in
        formFields.forEach((field, index) => {
          gsap.fromTo(
            field,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: field,
                start: "top bottom",
                end: "top 75%",
                scrub: 0.3,
              },
            }
          );

          // Underline draws in with scrub
          const underline = field.querySelector(".field-underline");
          if (underline) {
            gsap.fromTo(
              underline,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: field,
                  start: "top 85%",
                  end: "top 65%",
                  scrub: 0.3,
                },
              }
            );
          }
        });
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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 bg-neutral-950 overflow-hidden"
    >
      {/* Blueprint grid background */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px),
            linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
        }}
      />

      {/* Connection lines SVG */}
      <svg
        ref={connectionLinesRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: isRevealed ? 0.3 : 0, transition: "opacity 0.5s" }}
      >
        <path
          d="M 100 300 Q 200 300 200 400"
          stroke="#00f0ff"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 100 400 Q 150 400 150 500"
          stroke="#00f0ff"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 100 500 Q 180 500 180 600"
          stroke="#00f0ff"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <p className="section-label text-[#00f0ff]/60 text-sm uppercase tracking-[0.3em] mb-4">
            Get in Touch
          </p>
          <h2 className="section-title text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Let's start a
            <br />
            <span className="text-white/40">conversation</span>
          </h2>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left side - Info */}
          <div className="contact-info">
            <p className="text-white/50 text-lg md:text-xl leading-relaxed mb-12">
              Ready to bring your vision to life? We'd love to hear about your project and explore how we can help.
            </p>

            <div className="space-y-8">
              <div className="info-block relative pl-6 border-l border-[#00f0ff]/20">
                <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-[#00f0ff]/50 -translate-x-[5px]" />
                <p className="text-[#00f0ff]/40 text-xs uppercase tracking-[0.2em] mb-2">
                  {isRevealed && <TypewriterText text="Email" delay={400} />}
                </p>
                <a
                  href="mailto:hello@executive.ai"
                  className="text-white text-lg hover:text-[#00f0ff] transition-colors"
                >
                  hello@executive.ai
                </a>
              </div>

              <div className="info-block relative pl-6 border-l border-[#00f0ff]/20">
                <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-[#00f0ff]/50 -translate-x-[5px]" />
                <p className="text-[#00f0ff]/40 text-xs uppercase tracking-[0.2em] mb-2">
                  {isRevealed && <TypewriterText text="Response Time" delay={600} />}
                </p>
                <p className="text-white text-lg">Within 24 hours</p>
              </div>

              <div className="info-block relative pl-6 border-l border-[#00f0ff]/20">
                <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-[#00f0ff]/50 -translate-x-[5px]" />
                <p className="text-[#00f0ff]/40 text-xs uppercase tracking-[0.2em] mb-2">
                  {isRevealed && <TypewriterText text="Status" delay={800} />}
                </p>
                <div className="flex items-center gap-3">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-emerald-500"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(16, 185, 129, 0.4)",
                        "0 0 0 8px rgba(16, 185, 129, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  <p className="text-white text-lg">Available for projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="contact-form">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-start justify-center"
              >
                <motion.div
                  className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Message sent</h3>
                <p className="text-white/50">We'll be in touch within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name */}
                <div className="form-field">
                  <label className="block text-[#00f0ff]/40 text-xs uppercase tracking-[0.2em] mb-3">
                    {isRevealed && <TypewriterText text="Name" delay={500} />}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-[#00f0ff]/50 focus:outline-none transition-colors placeholder:text-white/20"
                    placeholder="Your name"
                  />
                  <div className="field-underline h-px bg-gradient-to-r from-[#00f0ff]/50 to-transparent mt-[-1px]" />
                </div>

                {/* Email */}
                <div className="form-field">
                  <label className="block text-[#00f0ff]/40 text-xs uppercase tracking-[0.2em] mb-3">
                    {isRevealed && <TypewriterText text="Email" delay={600} />}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-[#00f0ff]/50 focus:outline-none transition-colors placeholder:text-white/20"
                    placeholder="you@company.com"
                  />
                  <div className="field-underline h-px bg-gradient-to-r from-[#00f0ff]/50 to-transparent mt-[-1px]" />
                </div>

                {/* Message */}
                <div className="form-field">
                  <label className="block text-[#00f0ff]/40 text-xs uppercase tracking-[0.2em] mb-3">
                    {isRevealed && <TypewriterText text="Message" delay={700} />}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-[#00f0ff]/50 focus:outline-none transition-colors resize-none placeholder:text-white/20"
                    placeholder="Tell us about your project..."
                  />
                  <div className="field-underline h-px bg-gradient-to-r from-[#00f0ff]/50 to-transparent mt-[-1px]" />
                </div>

                {/* Submit - Magnetic Button */}
                <MagneticButton
                  disabled={isSubmitting}
                  className="group flex items-center gap-3 text-white text-sm uppercase tracking-[0.2em] font-medium hover:text-[#00f0ff] transition-colors disabled:opacity-50 py-4 px-8 border border-white/10 hover:border-[#00f0ff]/50 rounded-full"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border border-white/30 border-t-[#00f0ff] rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
