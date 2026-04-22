"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ease } from "@/lib/motion";

const PROJECT_TYPES = ["Marketing site", "Web app / interface", "Motion / hero piece", "Design system", "Something else"];
const BUDGETS = ["< $10k", "$10 – 25k", "$25 – 50k", "$50k+", "Not sure yet"];
const TIMELINES = ["ASAP", "1–2 months", "3–6 months", "Flexible"];

export default function ContactPage() {
  const [data, setData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <>
      <Navbar lightHero />
      <main className="relative" style={{ zIndex: 10, backgroundColor: "var(--paper)" }}>
        {/* Hero */}
        <section className="pt-40 md:pt-48 pb-16 md:pb-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-[1400px] mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: ease.expoOut }}
              className="text-[11px] uppercase tracking-[0.3em] mb-6"
              style={{ color: "var(--taupe)" }}
            >
              Contact
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.1, ease: ease.expoOut }}
              className="font-display font-semibold leading-[0.98] text-balance"
              style={{
                color: "var(--ink)",
                fontSize: "clamp(3rem, 9vw, 9rem)",
                letterSpacing: "-0.045em",
              }}
            >
              Let's build something.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: ease.expoOut }}
              className="mt-8 max-w-xl text-base md:text-lg leading-relaxed"
              style={{ color: "var(--taupe)" }}
            >
              Tell me a little about your project. I read every inquiry myself
              and respond within two working days — usually sooner.
            </motion.p>
          </div>
        </section>

        {/* Form + Meta */}
        <section className="px-6 md:px-12 lg:px-24 pb-32 md:pb-48">
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-12 md:gap-20">
            {/* Form */}
            <div className="md:col-span-8">
              {state === "sent" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[24px] p-12 md:p-16 text-center"
                  style={{ background: "var(--ink-soft)", color: "var(--paper)" }}
                >
                  <div
                    className="mx-auto mb-8 w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "var(--paper)", color: "var(--ink)" }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h2
                    className="font-display font-semibold mb-4"
                    style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.03em" }}
                  >
                    Got it.
                  </h2>
                  <p className="max-w-md mx-auto" style={{ color: "rgba(229,225,219,0.7)" }}>
                    Thanks for reaching out. I'll be in touch from jake@jakeryall.com within two working days.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={submit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: ease.expoOut }}
                  className="space-y-1"
                >
                  <Field label="Name" required>
                    <input
                      type="text"
                      name="name"
                      required
                      value={data.name}
                      onChange={onChange}
                      placeholder="Your name"
                      className="field-input"
                    />
                  </Field>
                  <Field label="Email" required>
                    <input
                      type="email"
                      name="email"
                      required
                      value={data.email}
                      onChange={onChange}
                      placeholder="you@company.com"
                      className="field-input"
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      type="text"
                      name="company"
                      value={data.company}
                      onChange={onChange}
                      placeholder="Company, studio, team (optional)"
                      className="field-input"
                    />
                  </Field>
                  <Field label="Project type">
                    <select name="projectType" value={data.projectType} onChange={onChange} className="field-input field-select">
                      <option value="">Pick one…</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Budget">
                    <select name="budget" value={data.budget} onChange={onChange} className="field-input field-select">
                      <option value="">Pick a range…</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Timeline">
                    <select name="timeline" value={data.timeline} onChange={onChange} className="field-input field-select">
                      <option value="">Pick a timeline…</option>
                      {TIMELINES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Tell me about it" required>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={data.message}
                      onChange={onChange}
                      placeholder="A few sentences about what you're building, what's in the way, and what success looks like."
                      className="field-input resize-none"
                    />
                  </Field>

                  <div className="pt-8 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="group inline-flex items-center gap-2 h-12 pl-6 pr-2 rounded-full press disabled:opacity-60"
                      style={{ background: "var(--ink)", color: "var(--paper)" }}
                    >
                      <span className="text-sm font-medium tracking-tight">
                        {state === "sending" ? "Sending…" : "Send inquiry"}
                      </span>
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:translate-x-[2px]"
                        style={{ background: "var(--paper)", color: "var(--ink)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                    {state === "error" && (
                      <span className="text-[13px]" style={{ color: "#b23c3c" }}>
                        Something went wrong — try again, or email directly.
                      </span>
                    )}
                  </div>
                </motion.form>
              )}
            </div>

            {/* Meta */}
            <aside className="md:col-span-4 md:sticky md:top-32 self-start space-y-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] mb-3" style={{ color: "var(--taupe)" }}>
                  Email
                </p>
                <a
                  href="mailto:jake@jakeryall.com"
                  className="text-[17px] md:text-[19px] link-hover"
                  style={{ color: "var(--ink)" }}
                >
                  jake@jakeryall.com
                </a>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] mb-3" style={{ color: "var(--taupe)" }}>
                  Availability
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="pulse-dot w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#19c37d", color: "#19c37d" }}
                  />
                  <span className="text-[15px]" style={{ color: "var(--ink)" }}>
                    Q3 2026 · 2 slots
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] mb-3" style={{ color: "var(--taupe)" }}>
                  Response time
                </p>
                <p className="text-[15px]" style={{ color: "var(--ink)" }}>
                  Within two working days.
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] mb-3" style={{ color: "var(--taupe)" }}>
                  Location
                </p>
                <p className="text-[15px]" style={{ color: "var(--ink)" }}>
                  Rocklin, CA — working worldwide.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx global>{`
        .field-input {
          width: 100%;
          background: transparent;
          color: var(--ink);
          font-size: 1.25rem;
          letter-spacing: -0.01em;
          padding: 0.9rem 0;
          outline: none;
          border: 0;
          border-bottom: 1px solid rgba(26, 24, 22, 0.12);
          transition: border-color 400ms var(--ease-expo-out);
          font-family: inherit;
        }
        .field-input::placeholder {
          color: rgba(26, 24, 22, 0.32);
        }
        .field-input:focus {
          border-bottom-color: var(--ink);
        }
        .field-select {
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a1816' stroke-width='1.5'><path d='M6 9l6 6 6-6'/></svg>");
          background-repeat: no-repeat;
          background-position: right 0.25rem center;
          padding-right: 2rem;
        }
      `}</style>
    </>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="py-3 md:py-4">
      <label className="block text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--taupe)" }}>
        {label}
        {required && <span style={{ color: "var(--signal)" }}> *</span>}
      </label>
      {children}
    </div>
  );
}
