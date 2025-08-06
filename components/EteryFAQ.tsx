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
            question: "What does the membership include?",
            answer: "Our membership includes full access to all AI tools, custom development support, unlimited consultations, real-time performance monitoring, priority support, and regular updates. You'll also get access to our exclusive AI resource library and community.",
            order: 0
          },
          {
            _id: '1',
            question: "How do I get started with your services?",
            answer: "Getting started is simple. Book a consultation call with our team, we'll assess your needs, create a custom AI strategy, and begin implementation within 48 hours. Our onboarding process is designed to be smooth and efficient.",
            order: 1
          },
          {
            _id: '2',
            question: "Can I cancel my membership anytime?",
            answer: "Yes, you can cancel your membership at any time with no hidden fees or penalties. We believe in earning your business every month. Simply notify us 30 days before your next billing cycle.",
            order: 2
          },
          {
            _id: '3',
            question: "Do I need technical expertise to use your tools?",
            answer: "No technical expertise required. Our AI solutions are designed to be user-friendly and intuitive. We provide comprehensive training, documentation, and 24/7 support to ensure you can maximize the value of our tools.",
            order: 3
          },
          {
            _id: '4',
            question: "Are there additional costs?",
            answer: "Our transparent pricing includes everything you need. There are no hidden fees, setup costs, or surprise charges. Any optional add-ons or custom development beyond the scope of your plan will be clearly communicated upfront.",
            order: 4
          },
          {
            _id: '5',
            question: "How often do you release updates?",
            answer: "We release updates continuously, with major feature updates quarterly and minor improvements weekly. All updates are automatically applied to your account, and we provide detailed release notes for transparency.",
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