"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getServices } from "@/lib/sanity.queries";

interface Service {
  _id: string;
  title: string;
  description: string;
  slug: { current: string };
  icon?: string;
  tags?: string[];
  features?: string[];
  isLarge?: boolean;
  order: number;
}

export default function EteryServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to hardcoded services if Sanity is not configured
        setServices([
          {
            _id: '1',
            title: "Chatbot Development",
            description: "We build custom AI chat solutions for instant support, streamlined processes, and a seamless audience experience.",
            slug: { current: 'chatbot-development' },
            tags: ["Proactive chat", "Customization", "Sales tracking", "Post purchase support"],
            isLarge: true,
            order: 1
          },
          {
            _id: '2',
            title: "Voice Assistants",
            description: "We build smart voice solutions for effortless control, better access, and engaging user experiences.",
            slug: { current: 'voice-assistants' },
            isLarge: false,
            order: 2
          },
          {
            _id: '3',
            title: "AI Consulting",
            description: "We help you strategize, automate, and implement AI solutions for maximum efficiency and growth.",
            slug: { current: 'ai-consulting' },
            tags: ["Revenue analytics"],
            isLarge: false,
            order: 3
          },
          {
            _id: '4',
            title: "Tools Integrations",
            description: "We help companies integrate AI tools into their existing software platforms, CRM systems, or marketing channels.",
            slug: { current: 'tools-integrations' },
            isLarge: true,
            order: 4
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-zinc-800 rounded w-1/3 mx-auto mb-8" />
            <div className="h-6 bg-zinc-800 rounded w-2/3 mx-auto mb-16" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-96 bg-zinc-800 rounded-2xl" />
              <div className="h-96 bg-zinc-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Separate services into rows for alternating layout
  const firstRowServices = services.filter((_, index) => index < 2);
  const secondRowServices = services.filter((_, index) => index >= 2 && index < 4);

  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Full-Service Agency
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Whether you&apos;re automating processes or building advanced analytics,
            we bring your vision to life with tailored artificial intelligence strategies.
          </p>
        </motion.div>

        {/* Services Grid - Alternating Layout */}
        <div className="space-y-6">
          {/* First Row - Large Left, Small Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chatbot Development - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">{firstRowServices[0]?.title}</h3>
                <p className="text-zinc-400">{firstRowServices[0]?.description}</p>
              </div>

              {firstRowServices[0]?.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {firstRowServices[0].tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="bg-zinc-900 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-zinc-300 text-sm">Live chat</span>
                </div>
                <div className="text-zinc-500 text-sm">
                  GPT 4.0 • Customization • 98% accuracy
                </div>
              </div>
              
              <div className="bg-zinc-900 rounded-xl p-4">
                <p className="text-zinc-300 text-sm mb-2">How do I reset my password?</p>
                <p className="text-zinc-400 text-sm whitespace-pre-line">
                  I can help you with that! To reset your password, please follow these steps:

1. Go to the login page
2. Click on 'Forgot Password'
3. Enter your email address
4. Check your email for a reset link
5. Follow the instructions in the email

Is there anything else I can help you with?
                </p>
              </div>
            </motion.div>

            {/* Voice Assistants - Small Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">{firstRowServices[1]?.title}</h3>
                <p className="text-zinc-400">{firstRowServices[1]?.description}</p>
              </div>

              <div className="space-y-2">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-700 rounded-full" />
                      <span className="text-zinc-300 text-sm">Potential Buyer</span>
                    </div>
                    <span className="text-zinc-500 text-xs">Processing call</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Second Row - Small Left, Large Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Consulting - Small Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">{secondRowServices[0]?.title}</h3>
                <p className="text-zinc-400">{secondRowServices[0]?.description}</p>
              </div>

              {secondRowServices[0]?.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {secondRowServices[0].tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="bg-zinc-900 rounded-xl p-6">
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month) => (
                    <span key={month} className="text-zinc-500 text-xs">{month}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(35)].map((_, i) => {
                    // Create a deterministic pattern based on index
                    const isActive = (i % 3 === 0) || (i % 5 === 0) || (i % 7 === 1);
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded ${
                          isActive ? 'bg-[#0066ff]' : 'bg-zinc-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Tools Integrations - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2 bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">{secondRowServices[1]?.title}</h3>
                <p className="text-zinc-400">{secondRowServices[1]?.description}</p>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                {["K", "bolt", "VQ", "asterisk", "AI", "Make", "G"].map((logo, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-400 font-bold"
                  >
                    {logo}
                  </div>
                ))}
              </div>

              <p className="text-zinc-400 mt-4">Seamlessly connect your favorite tools and platforms with our AI solutions.</p>
            </motion.div>
          </div>

          {/* Extra Card - Full Width CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-zinc-900 rounded-2xl p-10 text-center"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              Need Something Custom?
            </h3>
            <p className="text-zinc-400 mb-6">
              Let&apos;s discuss your unique AI requirements
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 bg-[#0066ff] text-white font-medium rounded-full hover:bg-[#0052cc] transition-colors duration-300"
            >
              Get Started
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}