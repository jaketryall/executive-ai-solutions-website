"use client";

// FAQ accordion — hairline cards, plus-to-x icon, height-animated answers.

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ease } from "@/lib/motion";

export type Faq = { q: string; a: string };

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <ul className="grid gap-3">
      {faqs.map((faq, i) => {
        const open = openIdx === i;
        return (
          <motion.li
            key={faq.q}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 + i * 0.05, ease: ease.expoOut }}
            className={`rounded-[28px] border transition-colors duration-300 ${
              open ? "border-ink/25 bg-paper-warm" : "border-(--line) hover:border-ink/25"
            }`}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIdx(open ? null : i)}
              className="w-full flex items-center justify-between gap-6 text-left px-6 md:px-8 py-5 md:py-6 cursor-pointer focus-ring rounded-[28px]"
            >
              <span className="text-[15px] md:text-lg font-semibold tracking-tight">
                {faq.q}
              </span>
              <span
                className={`relative w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-all duration-400 ${
                  open ? "bg-ink text-paper border-ink" : "border-ink/15 text-ink"
                }`}
                style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
                aria-hidden
              >
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: ease.expoOut }}
                  className="block"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </motion.span>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: ease.expoOut }}
                  className="overflow-hidden"
                >
                  <p className="px-6 md:px-8 pb-6 md:pb-7 max-w-2xl text-[15px] leading-relaxed text-(--fg-muted)">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}
