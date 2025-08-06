"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMobile";

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How quickly can AI solutions be implemented in my business?",
      answer: "Most AI implementations can be deployed within 2-4 weeks. Simple automations like chatbots can be live in under a week, while more complex custom AI solutions typically take 2-6 weeks depending on your specific requirements and integrations needed."
    },
    {
      question: "What kind of ROI can I expect from AI implementation?",
      answer: "Our clients typically see 300-500% ROI within the first year. This comes from reduced labor costs, improved efficiency, 24/7 availability, and elimination of human errors. Most businesses break even within 3-6 months of implementation."
    },
    {
      question: "Do I need technical expertise to use your AI solutions?",
      answer: "Not at all. Our AI solutions are designed to be user-friendly and require no technical expertise. We provide comprehensive training and ongoing support. Your team will be able to manage and optimize the AI systems with ease."
    },
    {
      question: "How do you ensure data security and privacy?",
      answer: "We implement enterprise-grade security measures including end-to-end encryption, SOC 2 compliance, and GDPR adherence. All data processing follows strict privacy protocols, and we can deploy solutions on-premise or in private cloud environments as needed."
    },
    {
      question: "Can AI solutions integrate with our existing systems?",
      answer: "Yes, our AI solutions are built to integrate seamlessly with popular business tools including CRMs, ERPs, helpdesk systems, and communication platforms. We provide APIs and custom integrations to ensure smooth workflow continuity."
    },
    {
      question: "What ongoing support do you provide?",
      answer: "We provide continuous monitoring, regular updates, performance optimization, and 24/7 technical support. Our team proactively identifies improvement opportunities and ensures your AI systems evolve with your business needs."
    },
    {
      question: "How do you handle AI model training and customization?",
      answer: "We use your specific business data and requirements to fine-tune AI models for optimal performance. This includes training on your industry terminology, processes, and customer interaction patterns to ensure highly relevant and accurate results."
    },
    {
      question: "What happens if the AI makes mistakes?",
      answer: "Our AI systems include built-in fallback mechanisms and human oversight options. We implement confidence thresholds and escalation protocols to ensure critical decisions are reviewed. Continuous learning algorithms help reduce errors over time."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-zinc-950 pointer-events-none" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="bg-grid-pattern" />
      </div>

      <motion.div 
        className="max-w-4xl mx-auto relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
      >
        {/* Section header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 text-white leading-[0.9] tracking-tight">
            <span className="block">Frequently Asked</span>
            <span className="text-gradient-shine">Questions</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 font-normal leading-tight max-w-3xl mx-auto">
            Everything you need to know about
            <span className="block">implementing AI in your business.</span>
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="space-y-4 sm:space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.5, 
                delay: prefersReducedMotion ? 0 : 0.4 + index * 0.1 
              }}
              className="bg-zinc-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800/60 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-4 sm:p-6 lg:p-8 text-left flex items-center justify-between hover:bg-zinc-950/30 transition-colors duration-300"
              >
                <h3 className="text-base sm:text-lg lg:text-xl font-light text-white pr-4 sm:pr-8 leading-relaxed">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#0066ff]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                      <div className="border-t border-zinc-800 pt-4 sm:pt-6">
                        <p className="text-zinc-400 font-light leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12 sm:mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 1 }}
        >
          <div className="bg-zinc-900/40 backdrop-blur-sm p-6 sm:p-8 lg:p-12 rounded-2xl border border-zinc-800/60">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white mb-3 sm:mb-4">
              Still have questions?
            </h3>
            <p className="text-zinc-400 font-light mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Our AI experts are here to help you understand how artificial intelligence can transform your specific business challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.a
                href="#contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-light text-sm sm:text-base rounded-full hover:scale-105 transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Consultation
                <svg className="ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.a>
              <motion.a
                href="mailto:jaker@executiveaisolutions.com"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-zinc-800 text-white font-light text-sm sm:text-base rounded-full border border-zinc-700 hover:bg-zinc-700 hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Email Us Directly
                <svg className="ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}