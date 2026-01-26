"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "./SplitText";
import { useSound } from "./SoundManager";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";
const accentColorFaint = "rgba(255, 200, 150, 0.15)";


// Magnetic button component
function MagneticButton({
  children,
  className = "",
  disabled = false,
  onHover,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onHover?: () => void;
  onClick?: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const hasEnteredRef = useRef(false);

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

  const handleMouseEnter = () => {
    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
      onHover?.();
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    hasEnteredRef.current = false;
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <motion.button
      ref={buttonRef}
      type="submit"
      disabled={disabled}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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

// Mobile Contact - Clean, simple layout
function MobileContact() {
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
    <section className="md:hidden relative py-16 bg-[#0a0908]">
      <div className="px-6">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-4"
            style={{ color: accentColorMuted }}
          >
            Get in Touch
          </p>
          <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
            LET'S START
            <br />
            <span className="text-white/30">SOMETHING</span>
          </h2>
        </div>

        {/* Info cards */}
        <div className="space-y-4 mb-10">
          <motion.a
            href="mailto:jaker@executiveaisolutions.com"
            className="block p-4 rounded-xl bg-white/5 active:scale-[0.98] transition-transform"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Email</p>
            <p className="text-white text-sm break-all" style={{ color: accentColor }}>
              jaker@executiveaisolutions.com
            </p>
          </motion.a>

          <motion.div
            className="p-4 rounded-xl bg-white/5"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Response Time</p>
            <p className="text-white text-sm">Within 24 hours</p>
          </motion.div>

          <motion.div
            className="p-4 rounded-xl bg-white/5"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-white text-sm">Available for projects</p>
            </div>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Message sent</h3>
              <p className="text-white/50 text-sm">We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 placeholder:text-white/30"
                  style={{ ["--tw-ring-color" as string]: accentColorMuted }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 placeholder:text-white/30"
                  style={{ ["--tw-ring-color" as string]: accentColorMuted }}
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 resize-none placeholder:text-white/30"
                  style={{ ["--tw-ring-color" as string]: accentColorMuted }}
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-semibold text-black transition-opacity disabled:opacity-50 active:scale-[0.98]"
                style={{ background: accentColor }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// Desktop Contact
function DesktopContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const { play } = useSound();

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
        if (title) {
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
        }

        // Label fades in
        if (label) {
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
    play("whoosh");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    play("success");
  };

  // Simple section entrance - just slides up smoothly
  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.4"],
  });

  // Simple smooth slide up
  const sectionY = useTransform(sectionScrollProgress, [0, 1], ["8%", "0%"]);
  const sectionOpacity = useTransform(sectionScrollProgress, [0, 0.5], [0, 1]);

  // Content follows slightly behind
  const contentY = useTransform(sectionScrollProgress, [0.1, 1], [40, 0]);
  const contentOpacity = useTransform(sectionScrollProgress, [0.1, 0.6], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 overflow-hidden bg-[#0a0908] min-h-screen hidden md:block"
      style={{
        zIndex: 10,
        isolation: "isolate",
      }}
    >
      {/* Solid opaque background - prevents footer bleed-through */}
      <div
        className="absolute inset-0 bg-[#0a0908]"
        style={{ zIndex: 1 }}
      />
      {/* Extra coverage below section to prevent footer flash */}
      <div
        className="absolute left-0 right-0 -bottom-[100vh] h-[100vh] bg-[#0a0908]"
        style={{ zIndex: 1 }}
      />

      {/* Static gradient background - always visible */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0908 0%, #0d0b09 50%, #0a0908 100%)",
          zIndex: 2,
        }}
      />
      {/* Warm ambient glow background */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${accentColorFaint} 0%, transparent 60%)`,
          zIndex: 3,
        }}
      />

      {/* Connection lines SVG */}
      <svg
        ref={connectionLinesRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: isRevealed ? 0.2 : 0, transition: "opacity 0.5s", zIndex: 3 }}
      >
        <path
          d="M 100 300 Q 200 300 200 400"
          stroke={accentColorMuted}
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 100 400 Q 150 400 150 500"
          stroke={accentColorMuted}
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 100 500 Q 180 500 180 600"
          stroke={accentColorMuted}
          strokeWidth="1"
          fill="none"
        />
      </svg>

      <motion.div
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative"
        style={{ y: contentY, opacity: contentOpacity, zIndex: 5 }}
      >
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <p
            className="section-label text-sm uppercase tracking-[0.3em] mb-4"
            style={{ color: accentColorMuted }}
          >
            <SplitText animation="chars" delay={0.2} stagger={0.03}>
              Get in Touch
            </SplitText>
          </p>
          <h2 className="section-title text-5xl md:text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-[-0.03em]">
            <SplitText animation="words" delay={0.4} stagger={0.1}>
              LET'S START
            </SplitText>
            <br />
            <span className="text-white/30">
              <SplitText animation="blur" delay={0.7} stagger={0.04}>
                SOMETHING
              </SplitText>
            </span>
          </h2>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left side - Info */}
          <div className="contact-info">
            <p className="text-white/50 text-lg md:text-xl leading-relaxed mb-12">
              Ready to bring your vision to life? We'd love to hear about your project and explore how we can help.
            </p>

            <div className="space-y-8">
              <div
                className="info-block relative pl-6 border-l"
                style={{ borderColor: accentColorFaint }}
              >
                <div
                  className="absolute left-0 top-0 w-2 h-2 rounded-full -translate-x-[5px]"
                  style={{ backgroundColor: accentColorMuted }}
                />
                <p
                  className="text-xs uppercase tracking-[0.2em] mb-2"
                  style={{ color: accentColorMuted }}
                >
                  {isRevealed && <TypewriterText text="Email" delay={400} />}
                </p>
                <a
                  href="mailto:jaker@executiveaisolutions.com"
                  className="text-white text-base md:text-lg transition-colors break-all"
                  style={{ ["--tw-hover-color" as string]: accentColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                >
                  jaker@executiveaisolutions.com
                </a>
              </div>

              <div
                className="info-block relative pl-6 border-l"
                style={{ borderColor: accentColorFaint }}
              >
                <div
                  className="absolute left-0 top-0 w-2 h-2 rounded-full -translate-x-[5px]"
                  style={{ backgroundColor: accentColorMuted }}
                />
                <p
                  className="text-xs uppercase tracking-[0.2em] mb-2"
                  style={{ color: accentColorMuted }}
                >
                  {isRevealed && <TypewriterText text="Response Time" delay={600} />}
                </p>
                <p className="text-white text-lg">Within 24 hours</p>
              </div>

              <div
                className="info-block relative pl-6 border-l"
                style={{ borderColor: accentColorFaint }}
              >
                <div
                  className="absolute left-0 top-0 w-2 h-2 rounded-full -translate-x-[5px]"
                  style={{ backgroundColor: accentColorMuted }}
                />
                <p
                  className="text-xs uppercase tracking-[0.2em] mb-2"
                  style={{ color: accentColorMuted }}
                >
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
                  <label
                    className="block text-xs uppercase tracking-[0.2em] mb-3"
                    style={{ color: accentColorMuted }}
                  >
                    {isRevealed && <TypewriterText text="Name" delay={500} />}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none transition-colors placeholder:text-white/20"
                    style={{ ["--focus-border" as string]: accentColorMuted }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = accentColorMuted)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    placeholder="Your name"
                  />
                  <div
                    className="field-underline h-px mt-[-1px]"
                    style={{ background: `linear-gradient(to right, ${accentColorMuted}, transparent)` }}
                  />
                </div>

                {/* Email */}
                <div className="form-field">
                  <label
                    className="block text-xs uppercase tracking-[0.2em] mb-3"
                    style={{ color: accentColorMuted }}
                  >
                    {isRevealed && <TypewriterText text="Email" delay={600} />}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none transition-colors placeholder:text-white/20"
                    onFocus={(e) => (e.currentTarget.style.borderColor = accentColorMuted)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    placeholder="you@company.com"
                  />
                  <div
                    className="field-underline h-px mt-[-1px]"
                    style={{ background: `linear-gradient(to right, ${accentColorMuted}, transparent)` }}
                  />
                </div>

                {/* Message */}
                <div className="form-field">
                  <label
                    className="block text-xs uppercase tracking-[0.2em] mb-3"
                    style={{ color: accentColorMuted }}
                  >
                    {isRevealed && <TypewriterText text="Message" delay={700} />}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none transition-colors resize-none placeholder:text-white/20"
                    onFocus={(e) => (e.currentTarget.style.borderColor = accentColorMuted)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                    placeholder="Tell us about your project..."
                  />
                  <div
                    className="field-underline h-px mt-[-1px]"
                    style={{ background: `linear-gradient(to right, ${accentColorMuted}, transparent)` }}
                  />
                </div>

                {/* Submit - Magnetic Button */}
                <MagneticButton
                  disabled={isSubmitting}
                  className="group flex items-center gap-3 text-white text-sm uppercase tracking-[0.2em] font-medium transition-colors disabled:opacity-50 py-4 px-8 border border-white/10 rounded-full"
                  onHover={() => play("hover", { volume: 0.08 })}
                  onClick={() => play("click")}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="w-4 h-4 border border-white/30 rounded-full animate-spin"
                        style={{ borderTopColor: accentColor }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <span style={{ color: accentColor }}>Get in Touch</span>
                      {/* Arrow with diagonal slide on hover */}
                      <span className="relative w-5 h-5 overflow-hidden inline-block">
                        <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:translate-x-full group-hover:-translate-y-full" style={{ color: accentColor }}>→</span>
                        <span className="absolute inset-0 flex items-center justify-center -translate-x-full translate-y-full transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0" style={{ color: accentColor }}>→</span>
                      </span>
                    </>
                  )}
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Main export
export default function Contact() {
  return (
    <>
      <MobileContact />
      <DesktopContact />
    </>
  );
}
