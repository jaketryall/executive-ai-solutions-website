"use client";

// Contact — the conversion endpoint. Dark dock; what-happens-next on the
// left kills hesitation, the paper form card on the right makes starting
// feel like one small step. Wired to Resend via a server action.

import { useActionState, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { replayEntrance } from "@/lib/scroll";
import HoverText from "./HoverText";
import { ease } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const STEPS = [
  ["Tell us what you're building", "Two minutes, no prep needed."],
  ["Strategy call within 24 hours", "We map what your site needs to do."],
  ["Proposal and timeline in 48", "Fixed scope, fixed price, start date."],
] as const;

const TYPES = ["New website", "Website + bookings", "AI & automation", "Not sure yet"];

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
}) {
  const inputClass =
    "peer w-full bg-transparent outline-none text-[15px] text-ink placeholder:text-ink/30 border-b border-ink/15";
  return (
    <label className="block">
      <span className="micro text-ink/45">
        {label}
        {required && <span className="text-oxblood"> *</span>}
      </span>
      <div className="relative mt-1">
        {textarea ? (
          <textarea
            name={name}
            required={required}
            placeholder={placeholder}
            rows={4}
            className={`${inputClass} py-3 resize-none`}
          />
        ) : (
          <input
            name={name}
            type={type}
            required={required}
            placeholder={placeholder}
            className={`${inputClass} h-12`}
          />
        )}
        {/* Focus underline — draws left to right */}
        <span
          aria-hidden
          className="absolute left-0 bottom-0 h-[1.5px] w-full bg-ink origin-left scale-x-0 transition-transform duration-500 peer-focus:scale-x-100"
          style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
        />
      </div>
    </label>
  );
}

function SubmitPill({ pending }: { pending: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit"
      disabled={pending}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center h-12 pl-6 pr-2 gap-2.5 rounded-full bg-ink text-paper press focus-ring hover:-translate-y-0.5 transition-transform duration-300 disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
    >
      <HoverText
        text={pending ? "Sending…" : "Send it"}
        trigger={hovered && !pending}
        className="text-[13px] font-medium tracking-tight"
      />
      <span className="relative w-8 h-8 rounded-full bg-paper text-ink flex items-center justify-center overflow-hidden">
        {pending ? (
          <span
            aria-hidden
            className="w-3.5 h-3.5 rounded-full border-[1.5px] border-ink/25 border-t-ink animate-spin"
          />
        ) : (
          <>
            <motion.span
              animate={{ x: hovered ? 20 : 0, opacity: hovered ? 0 : 1 }}
              transition={{ duration: 0.35, ease: ease.expoOut }}
              className="absolute"
            >
              <Arrow />
            </motion.span>
            <motion.span
              animate={{ x: hovered ? 0 : -20, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.35, ease: ease.expoOut }}
              className="absolute"
            >
              <Arrow />
            </motion.span>
          </>
        )}
      </span>
    </button>
  );
}

function Arrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export default function ContactSection({
  contactEmail,
}: {
  contactEmail?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendContact,
    null,
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        replayEntrance(".hero-line", sectionRef.current!, {
          from: { y: "115%" },
          to: { y: 0, duration: 1.05, stagger: 0.1, ease: "expo.out" },
          start: "top 65%",
        });
        replayEntrance("[data-contact-step]", sectionRef.current!, {
          from: { y: 28, opacity: 0 },
          to: { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out" },
          start: "top 55%",
        });
        replayEntrance("[data-contact-card]", sectionRef.current!, {
          from: { y: 70, opacity: 0 },
          to: { y: 0, opacity: 1, duration: 1, ease: "expo.out" },
          start: "top 60%",
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="zone-dark relative z-40 -mt-8 rounded-t-[40px] bg-ink-deep px-5 md:px-10 pt-24 md:pt-32 pb-10 text-(--fg) shadow-[0_-32px_80px_rgba(14,13,12,0.4)]"
    >
      <div className="lg:grid lg:grid-cols-12 lg:gap-14">
        {/* Left — kill the hesitation */}
        <div className="lg:col-span-5">
          <p className="micro text-(--fg-faint)">Contact</p>
          <h2 className="mt-5 font-extrabold uppercase tracking-[-0.04em] leading-[0.94] text-[clamp(2.4rem,5.5vw,3.8rem)]">
            <span className="block">
              <span className="hero-line-mask">
                <span className="hero-line">Start the</span>
              </span>
            </span>
            <span className="block">
              <span className="hero-line-mask">
                <span className="hero-line">
                  conversation<span className="text-oxblood">.</span>
                </span>
              </span>
            </span>
          </h2>

          <ul className="mt-10 space-y-7">
            {STEPS.map(([title, sub]) => (
              <li key={title} data-contact-step className="flex gap-4">
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full bg-oxblood shrink-0"
                  aria-hidden
                />
                <div>
                  <p className="text-[15px] font-semibold tracking-tight">{title}</p>
                  <p className="mt-0.5 text-sm text-(--fg-muted)">{sub}</p>
                </div>
              </li>
            ))}
          </ul>

          {contactEmail && (
            <p data-contact-step className="mt-10 text-sm text-(--fg-muted)">
              Forms not your thing?{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-(--fg) font-medium slot-link align-bottom"
              >
                <span className="slot-link-stack">
                  <span className="slot-link-inner">{contactEmail}</span>
                  <span className="slot-link-clone" aria-hidden>
                    {contactEmail}
                  </span>
                </span>
              </a>
            </p>
          )}
        </div>

        {/* Right — the form card */}
        <div data-contact-card className="mt-12 lg:mt-0 lg:col-span-7">
          <div className="relative rounded-[40px] bg-paper text-ink p-6 md:p-10 lg:p-12 overflow-hidden">
            <AnimatePresence mode="wait">
              {state?.ok ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: ease.expoOut }}
                  className="py-10 md:py-16 text-center"
                >
                  <span className="inline-flex items-center gap-2.5 h-9 pl-1.5 pr-4 rounded-full border border-ink/10 bg-paper-warm">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-oxblood/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
                    </span>
                    <span className="micro text-ink">Message received</span>
                  </span>
                  <p className="mt-6 text-3xl md:text-4xl font-extrabold tracking-[-0.03em]">
                    Got it<span className="text-oxblood">.</span>
                  </p>
                  <p className="mt-3 text-[15px] text-taupe max-w-sm mx-auto">
                    You&rsquo;ll hear back within 24 hours — usually much
                    faster.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  action={action}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: ease.expoOut }}
                  className="grid gap-7"
                >
                  {/* Honeypot — humans never see it */}
                  <input
                    type="text"
                    name="company_url"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="hidden"
                  />

                  <div className="grid md:grid-cols-2 gap-7">
                    <Field label="Name" name="name" required placeholder="Jane Smith" />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                    />
                  </div>
                  <Field
                    label="Current site (if you have one)"
                    name="site"
                    placeholder="company.com"
                  />

                  <fieldset>
                    <legend className="micro text-ink/45">
                      What do you need?
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {TYPES.map((t, i) => (
                        <label key={t} className="cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value={t}
                            defaultChecked={i === 0}
                            className="peer sr-only"
                          />
                          <span
                            className="micro inline-flex items-center h-9 px-4 rounded-full border border-ink/15 text-ink/60 transition-all duration-300 peer-checked:bg-ink peer-checked:text-paper peer-checked:border-ink peer-focus-visible:outline-2 peer-focus-visible:outline-ink hover:border-ink/40"
                            style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
                          >
                            {t}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <Field
                    label="The project"
                    name="message"
                    required
                    textarea
                    placeholder="What are you building, and what should it do for the business?"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <SubmitPill pending={pending} />
                    <p className="micro text-ink/40">Reply within 24h</p>
                  </div>

                  {state && !state.ok && (
                    <p role="alert" className="text-sm text-oxblood">
                      {state.error}
                      {contactEmail && (
                        <>
                          {" "}
                          <a className="underline" href={`mailto:${contactEmail}`}>
                            {contactEmail}
                          </a>
                        </>
                      )}
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mini footer */}
      <div className="mt-20 pt-6 border-t border-(--line) flex flex-wrap items-center justify-between gap-4">
        <p className="micro text-(--fg-faint)">
          © 2026 Executive AI Solutions
        </p>
        <a href="#top" className="micro text-(--fg) focus-ring">
          <span className="slot-link">
            <span className="slot-link-stack">
              <span className="slot-link-inner">Back to top ↑</span>
              <span className="slot-link-clone" aria-hidden>
                Back to top ↑
              </span>
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
