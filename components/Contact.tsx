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

// Mobile Contact - Clean minimal form-first layout
function MobileContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      className="md:hidden relative rounded-t-[2rem] pt-16 pb-20"
      style={{
        zIndex: 30,
        marginTop: "-2rem",
      }}
    >
      {/* Header with status */}
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/80">
            Taking on projects
          </span>
        </div>
        <h2 className="text-[12vw] font-black text-[#f5f0e8] tracking-[-0.03em] leading-[0.9] mb-4">
          GET IN
          <br />
          <span style={{ color: accentColor }}>TOUCH</span>
        </h2>
        <p className="text-[#f5f0e8]/40 text-sm">
          Tell us about your project and we'll respond within 24 hours.
        </p>
      </div>

      {/* Form section */}
      <div className="px-6">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 text-center"
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5 mx-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                />
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold text-[#f5f0e8] mb-2">Message Sent</h3>
            <p className="text-[#f5f0e8]/40 text-sm">We'll be in touch soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div
              className="rounded-xl p-4 transition-all duration-200"
              style={{
                background: focusedField === "name" ? "rgba(255, 200, 150, 0.05)" : "rgba(245, 240, 232, 0.03)",
                border: `1px solid ${focusedField === "name" ? "rgba(255, 200, 150, 0.2)" : "rgba(245, 240, 232, 0.08)"}`,
              }}
            >
              <label
                className="text-[10px] uppercase tracking-[0.15em] block mb-2"
                style={{ color: focusedField === "name" ? accentColor : "rgba(245, 240, 232, 0.4)" }}
              >
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Your name"
                className="w-full bg-transparent text-[#f5f0e8] focus:outline-none placeholder:text-[#f5f0e8]/20"
              />
            </div>

            {/* Email field */}
            <div
              className="rounded-xl p-4 transition-all duration-200"
              style={{
                background: focusedField === "email" ? "rgba(255, 200, 150, 0.05)" : "rgba(245, 240, 232, 0.03)",
                border: `1px solid ${focusedField === "email" ? "rgba(255, 200, 150, 0.2)" : "rgba(245, 240, 232, 0.08)"}`,
              }}
            >
              <label
                className="text-[10px] uppercase tracking-[0.15em] block mb-2"
                style={{ color: focusedField === "email" ? accentColor : "rgba(245, 240, 232, 0.4)" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@company.com"
                className="w-full bg-transparent text-[#f5f0e8] focus:outline-none placeholder:text-[#f5f0e8]/20"
              />
            </div>

            {/* Message field */}
            <div
              className="rounded-xl p-4 transition-all duration-200"
              style={{
                background: focusedField === "message" ? "rgba(255, 200, 150, 0.05)" : "rgba(245, 240, 232, 0.03)",
                border: `1px solid ${focusedField === "message" ? "rgba(255, 200, 150, 0.2)" : "rgba(245, 240, 232, 0.08)"}`,
              }}
            >
              <label
                className="text-[10px] uppercase tracking-[0.15em] block mb-2"
                style={{ color: focusedField === "message" ? accentColor : "rgba(245, 240, 232, 0.4)" }}
              >
                Project Details
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                placeholder="Tell us about your project..."
                className="w-full bg-transparent text-[#f5f0e8] focus:outline-none resize-none placeholder:text-[#f5f0e8]/20"
              />
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full mt-2 py-4 rounded-xl font-semibold text-[#0a0806] overflow-hidden disabled:opacity-70"
              style={{ background: accentColor }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting && (
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <motion.span
                      className="w-4 h-4 border-2 border-[#0a0806]/30 border-t-[#0a0806] rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </span>
            </motion.button>
          </form>
        )}
      </div>

      {/* Footer - email as subtle secondary option */}
      <div className="px-6 mt-10 pt-8 border-t border-[#f5f0e8]/5">
        <p className="text-[#f5f0e8]/30 text-xs text-center mb-3">
          Prefer email?
        </p>
        <a
          href="mailto:jaker@executiveaisolutions.com"
          className="text-[#f5f0e8]/60 text-sm text-center block hover:text-[#f5f0e8] transition-colors"
        >
          jaker@executiveaisolutions.com
        </a>
      </div>
    </section>
  );
}

// Animated form field with micro-interactions
function AnimatedField({
  label,
  number,
  children,
  focused,
}: {
  label: string;
  number: string;
  children: React.ReactNode;
  focused: boolean;
}) {
  return (
    <motion.div
      className="form-field contact-scrub relative py-6"
    >
      <label className="block text-[9px] uppercase tracking-[0.3em] mb-3 transition-colors duration-300"
        style={{ color: focused ? accentColor : "rgba(255,255,255,0.25)" }}
      >
        {number} — {label}
      </label>
      {children}
      {/* Base underline — drawn in by GSAP on scroll */}
      <div
        className="field-underline-base absolute bottom-0 left-0 right-0 h-px"
        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
      />
      {/* Active underline that scales in on focus */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ backgroundColor: accentColor, zIndex: 1 }}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

// Rotating testimonials for the right panel
const contactTestimonials = [
  {
    quote: "The website exceeded our expectations. Clean, professional, and it actually brings in new students every week.",
    author: "Michael Torres",
    role: "Owner, Desert Wings Aviation",
    initials: "MT",
  },
  {
    quote: "Our conversion rate doubled within the first month of launch. Best investment we've made.",
    author: "David Park",
    role: "Director, Vertex Labs",
    initials: "DP",
  },
  {
    quote: "Working with them was seamless. They understood our vision and delivered something we're proud of.",
    author: "Sarah Chen",
    role: "CEO, Meridian Consulting",
    initials: "SC",
  },
];

// Desktop Contact — Bold split, image right
function DesktopContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { play } = useSound();

  const sectionRef = useRef<HTMLElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % contactTestimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // ===== HEADLINE — each letter rises from under mask on scroll =====
      const headlineWrap = section.querySelector(".contact-headline-wrap");
      const headlineChars = section.querySelectorAll(".contact-char");
      if (headlineChars.length && headlineWrap) {
        gsap.set(headlineChars, { y: "100%" });
        gsap.to(headlineChars, {
          y: "0%",
          ease: "none",
          stagger: 0.04,
          scrollTrigger: {
            trigger: headlineWrap,
            start: "top 85%",
            end: "top 30%",
            scrub: 1.5,
          },
        });
      }

      // ===== LEFT ELEMENTS (non-headline) — scrub-staggered as you scroll =====
      const scrubElements = section.querySelectorAll(".contact-scrub");
      scrubElements.forEach((el) => {
        gsap.fromTo(
          el,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 65%",
              scrub: 0.4,
            },
          }
        );
      });

      // ===== FORM FIELD UNDERLINES — draw in on scroll =====
      const formFields = section.querySelectorAll(".form-field");
      formFields.forEach((field) => {
        const underline = field.querySelector(".field-underline-base");
        if (underline) {
          gsap.fromTo(
            underline,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: field,
                start: "top 90%",
                end: "top 70%",
                scrub: 0.3,
              },
            }
          );
        }
      });

      // ===== SUBMIT BUTTON — expands from left =====
      const submitBtn = section.querySelector(".contact-submit-wrap");
      if (submitBtn) {
        gsap.fromTo(
          submitBtn,
          { scaleX: 0, opacity: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: submitBtn,
              start: "top 95%",
              end: "top 75%",
              scrub: 0.4,
            },
          }
        );
      }

      // ===== EMAIL LINK — slides in =====
      const emailWrap = section.querySelector(".contact-email-wrap");
      if (emailWrap) {
        gsap.fromTo(
          emailWrap,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: emailWrap,
              start: "top 95%",
              end: "top 80%",
              scrub: 0.3,
            },
          }
        );
      }

      // ===== RIGHT IMAGE — parallax only =====
      const imagePanel = section.querySelector(".contact-image-panel");
      const imageInner = section.querySelector(".contact-image-inner");

      if (imageInner && imagePanel) {
        gsap.to(imageInner, {
          y: "-15%",
          ease: "none",
          scrollTrigger: {
            trigger: imagePanel,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // ===== TESTIMONIAL OVERLAY — fades up after image reveals =====
      const testimonialOverlay = section.querySelector(".contact-testimonial-overlay");
      if (testimonialOverlay) {
        gsap.fromTo(
          testimonialOverlay,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: testimonialOverlay,
              start: "top 95%",
              end: "top 70%",
              scrub: 0.5,
            },
          }
        );
      }

      // ===== BRAND TAG — drops in =====
      const brandTag = section.querySelector(".contact-brand-tag");
      if (brandTag) {
        gsap.fromTo(
          brandTag,
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: imagePanel,
              start: "top 70%",
              end: "top 45%",
              scrub: 0.4,
            },
          }
        );
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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative hidden md:block"
      style={{ zIndex: 10 }}
    >
      <div
        className="relative pt-28 lg:pt-36 pb-44 lg:pb-56 overflow-hidden"
        style={{ backgroundColor: "#0a0908" }}
        data-bg="dark"
      >
      {/* CSS for animations */}
      <style>{`
        @keyframes metal-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes rotate-glow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .glow-border-btn {
          position: relative;
          overflow: hidden;
        }
        .glow-border-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: max(200%, 800px);
          height: max(200%, 800px);
          transform-origin: center;
          translate: -50% -50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 340deg,
            rgba(255, 200, 150, 0.5) 350deg,
            rgba(255, 200, 150, 0.8) 355deg,
            rgba(255, 200, 150, 0.5) 360deg
          );
          animation: rotate-glow 3s linear infinite;
          z-index: 0;
        }
        .glow-border-btn::after {
          content: '';
          position: absolute;
          inset: 2px;
          background: #0a0908;
          border-radius: inherit;
          z-index: 1;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glow-border-btn:hover::after {
          border-color: rgba(255, 200, 150, 0.2);
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* ===== LEFT: Headline + Form ===== */}
          <div>
            {/* Status */}
            <div className="contact-scrub flex items-center gap-2.5 mb-8">
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "rgba(16, 185, 129, 0.8)" }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/70">
                Taking on projects
              </span>
            </div>

            {/* BIG headline — letter-by-letter masked reveal */}
            <h2
              className="contact-headline-wrap font-black tracking-[-0.05em] leading-[0.9] mb-6"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(4rem, 7vw, 8rem)",
                color: "#f5f0e8",
              }}
            >
              {["L","e","t","'","s"," ","b","u","i","l","d"].map((char, i) => (
                <span key={i} className="inline-block overflow-hidden" style={char === " " ? { width: "0.2em" } : undefined}>
                  <span className="contact-char inline-block">{char === " " ? "\u00A0" : char}</span>
                </span>
              ))}
              <br />
              {["s","o","m","e","t","h","i","n","g"," ","b","o","l","d","."].map((char, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden"
                  style={{
                    ...(char === " " ? { width: "0.2em" } : {}),
                    ...(i >= 10 ? { color: accentColor } : {}),
                  }}
                >
                  <span className="contact-char inline-block">{char === " " ? "\u00A0" : char}</span>
                </span>
              ))}
            </h2>

            <p className="contact-scrub text-white/40 text-lg leading-relaxed mb-12 max-w-lg">
              Tell us about your project and we&apos;ll get back to you within 24 hours with a game plan.
            </p>

            {/* Form */}
            <div>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-16"
                >
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      />
                    </svg>
                  </motion.div>
                  <h3 className="text-3xl font-black text-white mb-2">Message sent.</h3>
                  <p className="text-white/40 text-lg">We&apos;ll be in touch within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-x-8">
                    <AnimatedField label="Name" number="01" focused={focusedField === "name"}>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onFocus={() => { setFocusedField("name"); play("hover", { volume: 0.04 }); }}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent text-white text-lg focus:outline-none placeholder:text-white/10"
                        placeholder="Your name"
                      />
                    </AnimatedField>
                    <AnimatedField label="Email" number="02" focused={focusedField === "email"}>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => { setFocusedField("email"); play("hover", { volume: 0.04 }); }}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent text-white text-lg focus:outline-none placeholder:text-white/10"
                        placeholder="you@company.com"
                      />
                    </AnimatedField>
                  </div>

                  <AnimatedField label="Company" number="03" focused={focusedField === "company"}>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      onFocus={() => { setFocusedField("company"); play("hover", { volume: 0.04 }); }}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent text-white text-lg focus:outline-none placeholder:text-white/10"
                      placeholder="Your company (optional)"
                    />
                  </AnimatedField>

                  <AnimatedField label="Project Details" number="04" focused={focusedField === "message"}>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => { setFocusedField("message"); play("hover", { volume: 0.04 }); }}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent text-white text-lg focus:outline-none resize-none placeholder:text-white/10"
                      placeholder="Tell us about your project..."
                    />
                  </AnimatedField>

                  {/* Submit */}
                  <div className="contact-submit-wrap mt-10">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="glow-border-btn group relative w-full flex items-center justify-center gap-3 py-5 px-8 rounded-full disabled:opacity-50 cursor-pointer"
                      onClick={() => play("click")}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      {isSubmitting ? (
                        <span className="relative flex items-center gap-3" style={{ zIndex: 3 }}>
                          <motion.span
                            className="w-4 h-4 border border-white/20 rounded-full"
                            style={{ borderTopColor: accentColor }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span className="text-white/50 text-sm uppercase tracking-[0.15em]">Sending...</span>
                        </span>
                      ) : (
                        <span className="relative flex items-center gap-3" style={{ zIndex: 3 }}>
                          <span className="text-sm uppercase tracking-[0.15em] font-semibold text-white">
                            Send Message
                          </span>
                          <motion.span
                            className="text-base text-white/40 group-hover:text-white transition-colors duration-300"
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            →
                          </motion.span>
                        </span>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>

            {/* Email fallback */}
            <div className="contact-email-wrap mt-10 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] mb-2">Prefer email?</p>
              <a
                href="mailto:jaker@executiveaisolutions.com"
                className="text-white/40 text-sm hover:text-white transition-colors duration-300 group inline-flex items-center gap-2"
              >
                jaker@executiveaisolutions.com
                <motion.span
                  className="inline-block"
                  whileHover={{ x: 3, y: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  ↗
                </motion.span>
              </a>
            </div>
          </div>

          {/* ===== RIGHT: Image + Testimonial Overlay ===== */}
          <div className="contact-image-panel relative lg:sticky lg:top-28 self-start rounded-2xl overflow-hidden"
            style={{ aspectRatio: "4/5" }}
          >
            {/* Inner wrapper for parallax + zoom */}
            <div className="contact-image-inner absolute inset-0 will-change-transform"
              style={{ height: "130%", top: "-15%" }}
            >
              <img
                src="/custom-dashboard-mockup.webp"
                alt="Executive AI Solutions — Custom dashboard"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Warm gradient overlay from bottom */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(10,9,8,0.95) 0%, rgba(10,9,8,0.6) 35%, rgba(10,9,8,0.1) 60%, transparent 100%)",
              }}
            />

            {/* Top-left brand tag */}
            <div className="contact-brand-tag absolute top-6 left-6 flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(255,200,150,0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,200,150,0.2)",
                }}
              >
                <span className="text-xs font-black" style={{ color: accentColor }}>E</span>
              </div>
              <span
                className="text-sm font-bold"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                }}
              >
                Executive AI
              </span>
            </div>

            {/* Bottom testimonial overlay — like the reference */}
            <div className="contact-testimonial-overlay absolute bottom-0 left-0 right-0 p-8">
                <div className="relative min-h-[140px]">
                  {contactTestimonials.map((testimonial, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{
                        opacity: activeTestimonial === i ? 1 : 0,
                        y: activeTestimonial === i ? 0 : 12,
                      }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p
                        className="text-lg lg:text-xl font-semibold leading-snug mb-6"
                        style={{
                          color: "rgba(255,255,255,0.9)",
                          textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                        }}
                      >
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-bold text-sm">{testimonial.author}</p>
                          <p className="text-white/50 text-xs">{testimonial.role}</p>
                        </div>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: "rgba(255,200,150,0.2)",
                            color: accentColor,
                            border: "1px solid rgba(255,200,150,0.3)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {testimonial.initials}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="flex gap-2 mt-6">
                  {contactTestimonials.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className="relative h-[3px] rounded-full overflow-hidden cursor-pointer flex-1"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                      {activeTestimonial === i && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: accentColor }}
                          initial={{ scaleX: 0, transformOrigin: "left" }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 6, ease: "linear" }}
                          key={`progress-${activeTestimonial}`}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
