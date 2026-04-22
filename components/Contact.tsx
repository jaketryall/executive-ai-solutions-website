"use client";

import { motion } from "framer-motion";
import { TransitionLink } from "@/components/PageTransition";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { SplitText as SplitTextHooks, useSplitTextReveal } from "@/lib/hooks";
import { prefersReducedMotion } from "@/lib/microInteractions";
import AvailabilityWidget from "./homepage/AvailabilityWidget";

// Cinematic warm color palette — used by MobileContact
const accentColor = "rgba(229, 225, 219, 1)";

// ============================================================
// MobileContact — preserved verbatim from previous implementation.
// Mobile experience is intentionally not redesigned in this task.
// ============================================================
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

// ============================================================
// DesktopContact — rewritten: dual CTA + availability widget + smart form
// ============================================================

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function DesktopContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const reduce = prefersReducedMotion();
    const splits: InstanceType<typeof SplitText>[] = [];

    const ctx = gsap.context(() => {
      const titleEl = sectionRef.current!.querySelector<HTMLElement>(".contact-title");
      if (titleEl) {
        const split = SplitText.create(titleEl, { type: "words", mask: "words" });
        splits.push(split);
        gsap.set(split.words, { yPercent: 110 });
        gsap.to(split.words, {
          yPercent: 0,
          duration: reduce ? 0 : 0.8,
          stagger: 0.05,
          ease: "appleOut",
          scrollTrigger: { trigger: titleEl, start: "top 80%" },
        });
      }
    }, sectionRef);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      projectType: fd.get("projectType"),
      brief: fd.get("brief"),
      preferredStart: picked ?? null,
    };
    // TODO: wire to actual endpoint. For now, log so developers can verify
    // the form is capturing fields correctly.
    console.info("[contact] form submit (stub)", payload);

    // Stub — simulate network
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setDone(true);
  };

  return (
    <section ref={sectionRef} id="contact-desktop" data-seam-enter="seam-4" className="hidden md:block py-32 px-6" style={{ backgroundColor: "#0a0908", color: "#e5e1db" }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* LEFT — invitation + dual CTAs */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: "rgba(229,225,219,0.45)" }}>
            Contact
          </p>
          <h2 className="contact-title font-black tracking-tight" style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", lineHeight: 1.05, color: "#e5e1db" }}>
            Let&apos;s build something.
          </h2>
          <p className="mt-6 max-w-md" style={{ color: "rgba(229,225,219,0.65)", lineHeight: 1.6 }}>
            Tell me about your project — I&apos;ll respond within a day.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contact-form"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full transition-colors duration-300 hover:bg-[#78736c] group"
              style={{ backgroundColor: "#e5e1db", color: "#1a1816" }}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.1em]">Start a project</span>
              <span aria-hidden>→</span>
            </a>
            <a
              href="mailto:jaker@executiveaisolutions.com?subject=Hiring Inquiry"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full transition-colors duration-300 hover:bg-white/5"
              style={{ backgroundColor: "transparent", color: "#e5e1db", border: "1px solid rgba(229,225,219,0.25)" }}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.1em]">Resume + DM</span>
              <span aria-hidden>→</span>
            </a>
          </div>

          <p className="mt-6 text-sm" style={{ color: "rgba(229,225,219,0.4)" }}>
            For founders building. For teams hiring.
          </p>
        </div>

        {/* RIGHT — availability + form */}
        <div
          id="contact-form"
          className="rounded-2xl p-6 md:p-8"
          style={{
            backgroundColor: "rgba(229,225,219,0.03)",
            border: "1px solid rgba(229,225,219,0.1)",
          }}
        >
          <AvailabilityWidget onPickDate={(d) => setPicked(d)} />

          <form onSubmit={submit} className="space-y-4">
            <DesktopField label="Your name" name="name" required />
            <DesktopField label="Email" name="email" type="email" required />

            <div>
              <label data-seam-label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(229,225,219,0.5)" }}>
                Project type
              </label>
              <div className="flex flex-wrap gap-2">
                {["Website", "Brand", "Automation", "Other"].map((t) => (
                  <label key={t} className="cursor-pointer">
                    <input type="radio" name="projectType" value={t} className="sr-only peer" />
                    <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full peer-checked:bg-[#e5e1db] peer-checked:text-[#1a1816] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#e5e1db] transition-colors" style={{ border: "1px solid rgba(229,225,219,0.2)", color: "#e5e1db" }}>
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <DesktopField label="What are you building?" name="brief" maxLength={240} />


            {picked && (
              <p className="text-xs" style={{ color: "rgba(229,225,219,0.55)" }}>
                Preferred start: <span style={{ color: "#e5e1db", fontWeight: 600 }}>{picked}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || done}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: done ? "#86efac" : "#e5e1db", color: "#1a1816" }}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.1em]">
                {done ? "Got it ✓" : submitting ? "Sending…" : "Send →"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function DesktopField({
  label,
  name,
  type = "text",
  maxLength,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        data-seam-label
        className="block text-xs uppercase tracking-[0.2em] mb-2"
        style={{ color: "rgba(229,225,219,0.5)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          maxLength={maxLength}
          required={required}
          className="w-full bg-transparent border-0 focus:outline-none py-2 text-sm"
          style={{ color: "#e5e1db" }}
        />
        {/* Class-only styling to avoid SSR hydration mismatches —
            inline `height: 1` and `transform: scaleX(0)` normalize to
            `1px` and `scale(0, 1)` in the DOM, which Next 16 + Turbopack
            flags as a mismatch. GSAP still overrides `transform` on
            scroll via Seam4_InkFlood's scrollTrigger. */}
        <span
          aria-hidden
          data-seam-underline
          className="absolute left-0 right-0 bottom-0 block h-px bg-[rgba(229,225,219,0.2)] origin-left scale-x-0 will-change-transform"
        />
      </div>
    </div>
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
