"use client";

import { motion } from "framer-motion";
import { TransitionLink } from "@/components/PageTransition";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as SplitTextHooks, useSplitTextReveal } from "@/lib/hooks";
import { useSound } from "./SoundManager";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cinematic warm color palette
const accentColor = "rgba(229, 225, 219, 1)";


// Mobile Contact - Bold with SplitText and micro-interactions
export function MobileContact() {
  const mobileContactRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // SplitText reveal for headline
  useSplitTextReveal(headerRef);

  // GSAP scrub reveals for form fields
  useIsomorphicLayoutEffect(() => {
    if (!mobileContactRef.current) return;

    const ctx = gsap.context(() => {
      const fields = mobileContactRef.current!.querySelectorAll(".mobile-form-field");
      fields.forEach((field) => {
        gsap.fromTo(
          field,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: field,
              start: "top 80%",
              end: "top 55%",
              scrub: 0.4,
            },
          }
        );
      });
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
      ref={mobileContactRef}
      id="contact"
      data-bg="cream"
      className="md:hidden relative pt-20 pb-40"
      style={{ backgroundColor: "#141210" }}
    >
      {/* Header */}
      <div ref={headerRef} className="px-6 mb-14">
        <div className="flex items-center gap-3 mb-8">
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/80">
            Taking on projects
          </span>
        </div>
        <SplitTextHooks
          text={"GET IN\nTOUCH"}
          as="h2"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(4rem, 18vw, 7rem)",
            fontWeight: 900,
            color: "#f5f0e8",
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
          }}
        />
        <p className="text-[#f5f0e8]/30 text-sm mt-8 leading-relaxed max-w-[280px]">
          Tell us about your project and we&apos;ll respond within 24 hours.
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
          <form onSubmit={handleSubmit} className="space-y-0">
            {/* Name */}
            <div className="mobile-form-field py-5" style={{ borderBottom: `1px solid ${focusedField === "name" ? "rgba(229,225,219,0.3)" : "rgba(255,255,255,0.06)"}`, transition: "border-color 0.3s" }}>
              <label className="text-[9px] uppercase tracking-[0.25em] block mb-3" style={{ color: focusedField === "name" ? accentColor : "rgba(255,255,255,0.25)" }}>
                01 — Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Your name"
                className="w-full bg-transparent text-[#f5f0e8] text-lg focus:outline-none placeholder:text-[#f5f0e8]/15"
              />
            </div>

            {/* Email */}
            <div className="mobile-form-field py-5" style={{ borderBottom: `1px solid ${focusedField === "email" ? "rgba(229,225,219,0.3)" : "rgba(255,255,255,0.06)"}`, transition: "border-color 0.3s" }}>
              <label className="text-[9px] uppercase tracking-[0.25em] block mb-3" style={{ color: focusedField === "email" ? accentColor : "rgba(255,255,255,0.25)" }}>
                02 — Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@company.com"
                className="w-full bg-transparent text-[#f5f0e8] text-lg focus:outline-none placeholder:text-[#f5f0e8]/15"
              />
            </div>

            {/* Message */}
            <div className="mobile-form-field py-5" style={{ borderBottom: `1px solid ${focusedField === "message" ? "rgba(229,225,219,0.3)" : "rgba(255,255,255,0.06)"}`, transition: "border-color 0.3s" }}>
              <label className="text-[9px] uppercase tracking-[0.25em] block mb-3" style={{ color: focusedField === "message" ? accentColor : "rgba(255,255,255,0.25)" }}>
                03 — Project Details
              </label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                placeholder="Tell us about your project..."
                className="w-full bg-transparent text-[#f5f0e8] text-lg focus:outline-none resize-none placeholder:text-[#f5f0e8]/15"
              />
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="mobile-form-field relative w-full mt-4 py-5 rounded-full font-bold text-sm uppercase tracking-[0.1em] text-[#0a0806] overflow-hidden disabled:opacity-70"
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
                    <span>→</span>
                  </>
                )}
              </span>
            </motion.button>
          </form>
        )}
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

// Studio booking state — shown in the right-panel availability grid. Hardcoded
// to a realistic "busy with two genuine openings" picture. Replace with real
// data (Sanity / calendar API) once the pipeline is wired up. Week numbers
// use ISO-week convention; the studio sells in 2-week sprints so openings
// come in pairs.
type WeekStatus = "booked" | "hold" | "open";
const WEEKS: { num: number; label: string; status: WeekStatus; who?: string }[] = [
  { num: 17, label: "W17", status: "booked", who: "Desert Wings · R2" },
  { num: 18, label: "W18", status: "booked", who: "Desert Wings · R2" },
  { num: 19, label: "W19", status: "booked", who: "Riled Up · P3" },
  { num: 20, label: "W20", status: "booked", who: "Riled Up · P3" },
  { num: 21, label: "W21", status: "hold" },
  { num: 22, label: "W22", status: "open" },
  { num: 23, label: "W23", status: "booked", who: "Internal · EAS" },
  { num: 24, label: "W24", status: "open" },
];

// Linear 4-step flow of what happens after you send the form. Replaces the
// generic rotating-testimonial overlay with something actually useful — shows
// the funnel and sets response expectations up front.
const STEPS: { num: string; title: string; body: string }[] = [
  {
    num: "01",
    title: "You send this",
    body: "Lands in my inbox — no routing, no gate, no assistant reading it first.",
  },
  {
    num: "02",
    title: "I read it",
    body: "Focus hours are 07:00–10:00 PT. Your message lands in the same block.",
  },
  {
    num: "03",
    title: "Reply under 4 hrs",
    body: "Monday–Friday. Usually same-morning. Book a 20-min call if it's worth it.",
  },
  {
    num: "04",
    title: "Scope + quote",
    body: "Fixed price, fixed scope, fixed start date within 48 hrs of the call.",
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
  const { play } = useSound();

  const sectionRef = useRef<HTMLElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
            start: "top 65%",
            end: "top 20%",
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
              start: "top 75%",
              end: "top 45%",
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
                start: "top 70%",
                end: "top 50%",
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
              start: "top 75%",
              end: "top 55%",
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
              start: "top 75%",
              end: "top 60%",
              scrub: 0.3,
            },
          }
        );
      }

      // ===== RIGHT PANEL — staggered card + step reveals =====
      const rightCards = section.querySelectorAll(".contact-right-card");
      rightCards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 55%",
              scrub: 0.5,
            },
          }
        );
      });

      // Week pills cascade in as the booking card enters view — reads like a
      // sequential calendar load rather than all-at-once.
      const weekPills = section.querySelectorAll(".contact-week-pill");
      if (weekPills.length) {
        gsap.fromTo(
          weekPills,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            stagger: 0.04,
            scrollTrigger: {
              trigger: ".contact-booking-card",
              start: "top 78%",
              end: "top 50%",
              scrub: 0.4,
            },
          }
        );
      }

      // "What happens next" steps — vertical line draws down, each step rises.
      const stepRows = section.querySelectorAll(".contact-step-row");
      stepRows.forEach((row) => {
        gsap.fromTo(
          row,
          { x: -14, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              end: "top 65%",
              scrub: 0.4,
            },
          }
        );
      });
      const stepLine = section.querySelector(".contact-step-line");
      if (stepLine) {
        gsap.fromTo(
          stepLine,
          { scaleY: 0, transformOrigin: "top" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".contact-whats-next",
              start: "top 85%",
              end: "bottom 70%",
              scrub: 0.6,
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
        style={{ backgroundColor: "#141210" }}
        data-bg="cream"
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
            rgba(229, 225, 219, 0.5) 350deg,
            rgba(229, 225, 219, 0.8) 355deg,
            rgba(229, 225, 219, 0.5) 360deg
          );
          animation: rotate-glow 3s linear infinite;
          z-index: 0;
        }
        .glow-border-btn::after {
          content: '';
          position: absolute;
          inset: 2px;
          background: #141210;
          border-radius: inherit;
          z-index: 1;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glow-border-btn:hover::after {
          border-color: rgba(229, 225, 219, 0.2);
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

            {/* Handoff headline — picks up from the Manifesto's "LET'S BUILD" moment */}
            <h2
              className="contact-headline-wrap font-black tracking-[-0.05em] leading-[0.9] mb-6"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(2.5rem, 4.5vw, 5rem)",
                color: "#f5f0e8",
              }}
            >
              {"Tell me everything.".split("").map((char, i) => (
                <span key={i} className="inline-block overflow-hidden" style={char === " " ? { width: "0.25em" } : undefined}>
                  <span className="contact-char inline-block">{char === " " ? "\u00A0" : char}</span>
                </span>
              ))}
            </h2>

            <p className="contact-scrub text-white/40 text-lg leading-relaxed mb-12 max-w-lg">
              The more you share, the sharper the first draft. Response within 24 hours.
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

          {/* ===== RIGHT: Booking grid · What happens next · Pinned proof =====
              Replaces the stock sticky-image + rotating-testimonial overlay
              pattern with three card-stacked blocks that actually do work —
              show scarcity (booking grid), set expectations (4-step flow),
              and close with a real outcome link (pinned proof stat). */}
          <div className="relative lg:sticky lg:top-28 self-start flex flex-col gap-6">

            {/* — 1. Booking availability grid — */}
            <div
              className="contact-right-card contact-booking-card relative rounded-2xl overflow-hidden"
              style={{
                padding: "clamp(1.5rem, 2.25vw, 2rem)",
                backgroundColor: "rgba(229,225,219,0.025)",
                border: "1px solid rgba(229,225,219,0.08)",
              }}
            >
              <div className="flex items-baseline justify-between mb-5">
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(229,225,219,0.42)",
                  }}
                >
                  Next 8 weeks · studio book
                </span>
                <span className="flex items-center gap-2">
                  <motion.span
                    className="inline-block rounded-full"
                    style={{ width: 5, height: 5, backgroundColor: "rgba(16,185,129,0.9)" }}
                    animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(229,225,219,0.7)",
                    }}
                  >
                    2 open
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {WEEKS.map((w) => {
                  const isOpen = w.status === "open";
                  const isHold = w.status === "hold";
                  const isBooked = w.status === "booked";
                  return (
                    <div
                      key={w.num}
                      className="contact-week-pill group relative overflow-hidden"
                      style={{
                        borderRadius: 10,
                        padding: "0.7rem 0.7rem",
                        backgroundColor: isOpen
                          ? "rgba(16,185,129,0.09)"
                          : isBooked
                          ? "rgba(229,225,219,0.05)"
                          : "transparent",
                        border: isOpen
                          ? "1px solid rgba(16,185,129,0.35)"
                          : isHold
                          ? "1px dashed rgba(229,225,219,0.22)"
                          : "1px solid rgba(229,225,219,0.06)",
                        cursor: isOpen ? "pointer" : "default",
                        transition: "transform 0.3s ease, background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (isOpen) e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        if (isOpen) e.currentTarget.style.transform = "translateY(0)";
                      }}
                      title={
                        isOpen
                          ? "Open slot — click the form to grab it"
                          : isHold
                          ? "Hold — possible client continuation"
                          : `Booked · ${w.who ?? ""}`
                      }
                    >
                      <div className="flex items-baseline justify-between mb-1">
                        <span
                          style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: isOpen
                              ? "rgba(16,185,129,0.95)"
                              : isBooked
                              ? "rgba(229,225,219,0.4)"
                              : "rgba(229,225,219,0.55)",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {w.label}
                        </span>
                        {isOpen && (
                          <motion.span
                            className="inline-block rounded-full"
                            style={{
                              width: 4,
                              height: 4,
                              backgroundColor: "rgba(16,185,129,0.95)",
                            }}
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.55rem",
                          fontWeight: 600,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: isOpen
                            ? "rgba(16,185,129,0.7)"
                            : isBooked
                            ? "rgba(229,225,219,0.3)"
                            : "rgba(229,225,219,0.4)",
                        }}
                      >
                        {isOpen ? "Open" : isHold ? "Hold" : "Booked"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p
                className="mt-5"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.72rem",
                  lineHeight: 1.55,
                  color: "rgba(229,225,219,0.45)",
                }}
              >
                Each slot is a 2-week sprint. <span style={{ color: "rgba(229,225,219,0.7)" }}>Hold</span> = waiting on an existing client
                to extend. Openings are first-come, first-scoped.
              </p>
            </div>

            {/* — 2. What happens next — */}
            <div
              className="contact-right-card contact-whats-next relative rounded-2xl overflow-hidden"
              style={{
                padding: "clamp(1.5rem, 2.25vw, 2rem)",
                backgroundColor: "rgba(229,225,219,0.025)",
                border: "1px solid rgba(229,225,219,0.08)",
              }}
            >
              <div className="flex items-baseline justify-between mb-6">
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(229,225,219,0.42)",
                  }}
                >
                  After you send this
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(229,225,219,0.3)",
                  }}
                >
                  04 steps
                </span>
              </div>

              {/* Steps — vertical timeline with a draw-on-scroll connector */}
              <div className="relative">
                <span
                  className="contact-step-line absolute left-[0.68rem] top-1 bottom-1 w-px"
                  style={{ backgroundColor: "rgba(229,225,219,0.18)" }}
                  aria-hidden="true"
                />
                <div className="flex flex-col">
                  {STEPS.map((s, i) => (
                    <div
                      key={s.num}
                      className="contact-step-row relative flex gap-4"
                      style={{
                        paddingTop: i === 0 ? 0 : "1.1rem",
                        paddingBottom: i === STEPS.length - 1 ? 0 : "1.1rem",
                      }}
                    >
                      {/* Step marker — circle over the vertical line */}
                      <span
                        className="shrink-0 relative z-10 rounded-full flex items-center justify-center"
                        style={{
                          width: 22,
                          height: 22,
                          backgroundColor: "#141210",
                          border: "1px solid rgba(229,225,219,0.35)",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.58rem",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          color: "rgba(229,225,219,0.9)",
                          marginLeft: 0,
                        }}
                      >
                        {s.num}
                      </span>

                      <div className="flex-1 -mt-0.5">
                        <p
                          style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "clamp(0.95rem, 1.05vw, 1.05rem)",
                            fontWeight: 700,
                            letterSpacing: "-0.01em",
                            color: "rgba(229,225,219,0.92)",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {s.title}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.82rem",
                            lineHeight: 1.55,
                            color: "rgba(229,225,219,0.5)",
                          }}
                        >
                          {s.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* — 3. Pinned proof — big metric linking to the case study — */}
            <TransitionLink
              href="/work/desert-wings"
              data-card
              className="contact-right-card group relative block overflow-hidden rounded-2xl transition-colors duration-500"
              style={{
                padding: "clamp(1.5rem, 2.25vw, 2rem)",
                backgroundColor: "rgba(229,225,219,0.04)",
                border: "1px solid rgba(229,225,219,0.12)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(229,225,219,0.42)",
                  }}
                >
                  Most recent outcome
                </span>
                <span
                  className="transition-transform duration-400 ease-out group-hover:translate-x-1"
                  style={{ fontSize: "0.9rem", color: accentColor, lineHeight: 1 }}
                >
                  →
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-2">
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "clamp(2.75rem, 4.5vw, 4rem)",
                    fontWeight: 900,
                    lineHeight: 0.9,
                    letterSpacing: "-0.045em",
                    color: accentColor,
                  }}
                >
                  +40%
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "rgba(229,225,219,0.55)",
                    letterSpacing: "0.01em",
                  }}
                >
                  discovery flights
                  <br />
                  <span style={{ color: "rgba(229,225,219,0.35)", fontSize: "0.78rem" }}>
                    first month post-launch
                  </span>
                </span>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(229,225,219,0.55)",
                  marginTop: "0.75rem",
                }}
              >
                Desert Wings · Flight school
              </p>
            </TransitionLink>
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
