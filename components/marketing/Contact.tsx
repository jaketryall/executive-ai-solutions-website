"use client";

import { useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap-setup";
import { useIsomorphicLayoutEffect } from "@/lib/motion/primitives";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const { progress } = useSectionReveal(sectionRef);
  const [submitted, setSubmitted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    if (!section || !headline) return;

    const ctx = gsap.context(() => {
      // ── Headline: SplitText char mask reveal ──────────────────────────
      const split = SplitText.create(headline, {
        type: "chars, lines",
        mask: "lines",
      });
      gsap.set(split.chars, { yPercent: 110 });
      gsap.to(split.chars, {
        yPercent: 0,
        duration: 0.85,
        stagger: 0.018,
        ease: "expo.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // ── Form fields cascade from left ─────────────────────────────────
      const form = formRef.current;
      if (form) {
        const fields = gsap.utils.toArray<HTMLElement>(
          form.querySelectorAll("[data-form-field]")
        );
        gsap.set(fields, { x: -50, opacity: 0 });
        gsap.to(fields, {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: form,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        // ── Submit button: overshoot settle ───────────────────────────
        const submit = form.querySelector<HTMLElement>("[data-submit]");
        if (submit) {
          gsap.set(submit, { y: 20, scale: 0.85, opacity: 0 });
          gsap.to(submit, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: form,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          });
        }
      }

      // ── Fallback block: fade in ────────────────────────────────────────
      const fallback = fallbackRef.current;
      if (fallback) {
        gsap.from(fallback, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: {
            trigger: fallback,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

      return () => split.revert();
    }, section);

    return () => ctx.revert();
  }, [submitted]); // Re-run when submitted flips so stale ScrollTriggers get cleaned up

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Placeholder: Task 42 will wire this to /api/contact via Resend
    console.log("Contact submit", Object.fromEntries(formData));
    setSubmitted(true);
  }

  return (
    <section
      ref={sectionRef}
      data-bg="paper"
      data-nav-num="10"
      data-nav-name="CONTACT"
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <SectionHeader
            sectionRef={sectionRef}
            number="10"
            name="Contact"
            sku="EAS/2026/Q2"
            progress={progress}
          />
          <h3
            ref={headlineRef}
            className="font-display font-black leading-[0.96] mt-10"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
              letterSpacing: "-0.04em",
            }}
          >
            Let&apos;s{" "}
            <span style={{ color: "var(--oxblood)" }}>make it real.</span>
          </h3>
          <p
            data-form-field
            className="mt-4 max-w-[50ch]"
            style={{ color: "var(--ink)", opacity: 0.75 }}
          >
            30-second form. We reply the same day.
          </p>
        </div>

        {submitted ? (
          <div
            className="max-w-[42ch] font-display text-[20px]"
            style={{ color: "var(--ink)" }}
          >
            Got it. We&apos;ll reply today.{" "}
            <span style={{ color: "var(--oxblood)" }}>—</span>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="max-w-[42ch] space-y-5"
          >
            <Field name="name" label="Your name" required />
            <Field name="email" label="Email" type="email" required />
            <Field name="message" label="What are you trying to ship?" textarea />
            <button
              type="submit"
              data-submit
              data-cta
              className="mt-4 px-6 py-3 font-mono text-[12px] uppercase tracking-[0.2em] font-bold rounded-[4px] focus-ring"
              style={{ background: "var(--ink)", color: "var(--paper)" }}
            >
              Send it →
            </button>
          </form>
        )}

        <div
          ref={fallbackRef}
          className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--taupe)" }}
        >
          Prefer a call?{" "}
          <a
            href="https://cal.com/eas"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--oxblood)" }}
          >
            Grab 30 min →
          </a>
          <br />
          Or just email{" "}
          <a
            href="mailto:hello@executiveai.solutions"
            style={{ color: "var(--oxblood)" }}
          >
            hello@executiveai.solutions
          </a>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  textarea = false,
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const commonProps = {
    name,
    required,
    className:
      "w-full bg-transparent border-b border-[rgba(26,24,22,0.3)] focus:border-[var(--oxblood)] focus:outline-none pb-2 pt-1 font-display text-[17px] transition-colors",
    style: { color: "var(--ink)" },
  };
  return (
    <label className="block" data-form-field>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2 block"
        style={{ color: "var(--taupe)" }}
      >
        {label}
      </span>
      {textarea ? (
        <textarea rows={3} {...commonProps} />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </label>
  );
}
