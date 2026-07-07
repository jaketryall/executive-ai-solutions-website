"use client";

import { useRef, useState } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";

/* Every answer states only what the site already promises (pricing, process,
   services) — review the wording, it speaks for the business. The JSON-LD
   below makes this block quotable by search + answer engines (AEO). */
const FAQS = [
  {
    q: "What does Google Ads management cost?",
    a: "Management is $500/mo plus whatever you spend on the ads themselves. You approve the budget, the tracking shows what every lead cost, and there is no minimum term. If we also built your landing page, we tune both from the same data.",
  },
  {
    q: "What does a website cost?",
    a: "Projects start at $2.5k and every project is quoted individually. The estimator above computes a live number from our real pricing: pick what you need and watch it move. After a twenty-minute call you get a fixed quote within two days.",
  },
  {
    q: "Do I need a monthly retainer?",
    a: "No. The build is a one-time, fixed quote. SEO, Google Ads management, and AI automation are optional monthly services, from $500/mo plus ad spend, and each is explained in plain numbers before you commit.",
  },
  {
    q: "Who owns the site when it's done?",
    a: "You do. Your domain, your content, your code. Everything is hand-built. No page builders, no platform lock-in, nothing you'll outgrow.",
  },
  {
    q: "Can you redesign my existing site?",
    a: "Yes. Redesigns follow the same process as new builds, and the estimator has a toggle for it. We keep what's working, rebuild what isn't, and make sure search engines don't lose track of you in the move.",
  },
  {
    q: "What is the AI automation, exactly?",
    a: "Three things, built and managed for you: chat that answers visitors from your own pages, follow-ups that send themselves so no enquiry goes cold, and pages that adapt to each visitor. It's quoted per project. The call is where we work out what's worth building for your business.",
  },
  {
    q: "How long does a build take?",
    a: "It depends on scope, so we don't guess: your fixed quote comes with a fixed timeline, two days after the call. Small sites move fast; bigger builds get milestones you can see.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export function Faq() {
  const root = useRef<HTMLElement>(null!);
  const [open, setOpen] = useState<number | null>(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        return;
      }

      gsap.fromTo(
        q("[data-anim='faq']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          stagger: 0.07,
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      id="faq"
      ref={root}
      data-nav="light"
      className="relative py-[89px]"
    >
      <div className="wrap grid gap-[34px] md:grid-cols-[minmax(300px,380px)_1fr] md:gap-[89px]">
        <div>
          {/* the rail sticks with the cards; the CTA catches whoever got here
              with a question the cards didn't answer (the form attaches their
              estimate, so the reply already talks numbers) */}
          <div className="md:sticky md:top-fib-7">
            <h2 className="t-display-lg">Questions, answered</h2>
            <p className="mt-fib-3 max-w-[26ch] text-ink/70">
              Anything else, ask us directly. We reply within one business day.
            </p>
            <div className="mt-fib-3">
              <CTA href="#contact" label="Ask your question" tone="ink" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[13px]">
          {FAQS.map((f, i) => (
            <div key={f.q} data-anim="faq" className={`faq-card ${open === i ? "is-open" : ""}`}>
              <button
                className="faq-q"
                aria-expanded={open === i}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{f.q}</span>
                <span className="faq-x" aria-hidden />
              </button>
              <div id={`faq-a-${i}`} className="faq-a" role="region">
                <div>
                  <p className="max-w-[62ch] text-ink/75">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* answer-engine surface: the same Q&A, machine-readable */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
