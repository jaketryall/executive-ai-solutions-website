"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer: "Most landing pages are completed within 1-2 weeks. Multi-page websites typically take 2-4 weeks depending on complexity. I'll give you a specific timeline during our initial consultation.",
  },
  {
    question: "What's included in the price?",
    answer: "Every project includes custom design, responsive development, basic SEO setup, and 30 days of post-launch support. I also include 2 rounds of revisions to make sure you're completely satisfied.",
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer: "Yes. After the initial 30-day support period, I offer monthly maintenance packages starting at $99/month. This includes updates, backups, security monitoring, and minor content changes.",
  },
  {
    question: "What platform do you build on?",
    answer: "I primarily build with Next.js and React for maximum performance and flexibility. For simpler projects or those needing a CMS, I also work with Webflow and WordPress.",
  },
  {
    question: "Can I update the website myself?",
    answer: "Absolutely. I can set up a content management system (CMS) so you can easily update text, images, and blog posts without any coding knowledge.",
  },
  {
    question: "What if I need changes after launch?",
    answer: "Small changes are covered during your 30-day support period. For larger updates or new features, I'll provide a quote. Most clients find my hourly rate for updates very reasonable.",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b border-zinc-800"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg md:text-xl font-medium text-white group-hover:text-[#2563eb] transition-colors pr-8">
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl text-zinc-500 group-hover:text-[#2563eb] transition-colors flex-shrink-0"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-400 leading-relaxed max-w-3xl">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="relative py-32 md:py-40 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] rounded-t-[2rem] -mt-8">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-12 h-px bg-zinc-700 origin-left"
            />
            <span className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-6">
            Common <span className="font-serif italic text-[#2563eb]">questions</span>
          </h2>
          <p className="text-xl text-zinc-400">
            Everything you need to know before we get started.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="border-t border-zinc-800">
          {faqs.map((faq, index) => (
            <FAQItem key={faq.question} faq={faq} index={index} />
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center"
        >
          <p className="text-zinc-400 mb-4">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-white font-medium hover:text-[#2563eb] transition-colors"
          >
            Get in touch
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
