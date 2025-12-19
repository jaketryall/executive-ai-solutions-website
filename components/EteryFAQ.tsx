"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getFAQs } from "@/lib/sanity.queries";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}

export default function EteryFAQ() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const data = await getFAQs();
        setFAQs(data);
        // Set first question as open by default if FAQs exist
        if (data.length > 0) {
          setOpenQuestion(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        // Fallback to hardcoded FAQs if Sanity is not configured
        const fallbackFAQs = [
          {
            _id: '0',
            question: "What types of AI agents can you build?",
            answer: "We develop custom AI agents for any business function - customer service chatbots, sales automation agents, data analysis systems, content generation tools, predictive analytics models, and workflow automation solutions. Each agent is tailored to your specific needs and integrated with your existing systems.",
            order: 0
          },
          {
            _id: '1',
            question: "How quickly can AI agents be deployed?",
            answer: "Simple AI agents can be deployed within 2-3 weeks. More complex enterprise solutions typically take 6-8 weeks from initial consultation to full deployment. We provide a detailed timeline during the assessment phase and can often start with a pilot program to deliver value quickly.",
            order: 1
          },
          {
            _id: '2',
            question: "Will AI replace my existing team?",
            answer: "AI agents are designed to augment your team, not replace them. They handle repetitive tasks, provide instant responses, and work 24/7, allowing your human employees to focus on strategic, creative, and relationship-building activities that require human expertise.",
            order: 2
          },
          {
            _id: '3',
            question: "How secure is your AI technology?",
            answer: "Security is our top priority. All AI systems feature enterprise-grade encryption, SOC 2 compliance, GDPR adherence, and secure API connections. Your data never leaves your controlled environment, and we implement strict access controls and regular security audits.",
            order: 3
          },
          {
            _id: '4',
            question: "What's the ROI of AI automation?",
            answer: "Our clients typically see 200-400% ROI within the first year. AI agents reduce operational costs by 40-60%, increase productivity by 3x, and improve customer satisfaction scores by 30%. We provide detailed ROI projections during the consultation phase.",
            order: 4
          },
          {
            _id: '5',
            question: "Do you provide ongoing support?",
            answer: "Yes, we offer 24/7 monitoring and support for all deployed AI systems. This includes performance optimization, regular updates, troubleshooting, and continuous training of AI models to improve accuracy and effectiveness over time.",
            order: 5
          }
        ];
        setFAQs(fallbackFAQs);
        setOpenQuestion('0');
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-zinc-800 rounded w-1/4 mx-auto mb-8" />
            <div className="h-6 bg-zinc-800 rounded w-2/3 mx-auto mb-16" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-zinc-800 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            FAQs
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Find answers to the most common questions about our
            services, AI solutions, and how we can help your business grow.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`border rounded-2xl transition-all duration-300 ${
                openQuestion === faq._id
                  ? "bg-[#0d0d0d] border-[#0066ff]"
                  : "bg-transparent border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <button
                onClick={() => setOpenQuestion(openQuestion === faq._id ? null : faq._id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between"
              >
                <span className="text-lg font-medium text-white pr-4">
                  {`0${index + 1}. ${faq.question}`}
                </span>
                <motion.div
                  animate={{ rotate: openQuestion === faq._id ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <svg
                    className={`w-6 h-6 ${
                      openQuestion === faq._id ? "text-[#0066ff]" : "text-zinc-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {openQuestion === faq._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}