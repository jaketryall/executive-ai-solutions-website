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
            title: "Custom Website Development",
            description: "We build stunning custom websites from scratch using modern frameworks like React, Next.js, and TypeScript for blazing-fast performance.",
            slug: { current: 'custom-development' },
            tags: ["React/Next.js", "Custom Design", "Mobile Responsive", "SEO Optimized"],
            isLarge: true,
            order: 1
          },
          {
            _id: '2',
            title: "CMS & Platform Solutions",
            description: "Content management systems and platform solutions including WordPress, Webflow, and headless CMS for easy content updates.",
            slug: { current: 'cms-solutions' },
            isLarge: false,
            order: 2
          },
          {
            _id: '3',
            title: "E-commerce Solutions",
            description: "Complete online stores with payment processing, inventory management, and AI-powered product recommendations.",
            slug: { current: 'ecommerce-solutions' },
            tags: ["Shopify/WooCommerce"],
            isLarge: false,
            order: 3
          },
          {
            _id: '4',
            title: "Maintenance & AI Automation",
            description: "Keep your site running smoothly with ongoing support, updates, and optional AI features like chatbots and content generation.",
            slug: { current: 'maintenance-automation' },
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
Full-Service Custom Web Development
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Specializing in custom-built websites with modern technologies,
            we create unique digital experiences that look amazing and drive real business results.
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
              animate={{ 
                boxShadow: [
                  "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                  "0 10px 25px -3px rgba(0, 102, 255, 0.15)",
                  "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
                ]
              }}
              transition={{ 
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.6 }
              }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 cursor-pointer"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Custom Website Development</h3>
                <p className="text-zinc-400">We build stunning custom websites from scratch using modern frameworks like React, Next.js, and TypeScript for blazing-fast performance.</p>
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

              <motion.div 
                className="bg-zinc-900 rounded-xl p-4 mb-4"
                animate={{ 
                  borderColor: ["rgb(39 39 42)", "rgb(0 102 255 / 0.3)", "rgb(39 39 42)"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ borderWidth: "1px", borderStyle: "solid" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-zinc-300 text-sm">Live Preview</span>
                </div>
                <div className="text-zinc-500 text-sm">
                  Next.js 14 • TypeScript • 95+ PageSpeed
                </div>
              </motion.div>
              
              <div className="bg-zinc-900 rounded-xl p-4">
                <p className="text-zinc-300 text-sm mb-2">Website Features:</p>
                <p className="text-zinc-400 text-sm whitespace-pre-line">
                  {`✓ Lightning-fast load times (under 2s)
✓ Mobile-first responsive design
✓ SEO optimized structure
✓ Custom animations & interactions
✓ CMS integration
✓ Analytics dashboard
✓ Optional AI chatbot integration`}
                </p>
              </div>
            </motion.div>

            {/* Voice Assistants - Small Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              animate={{
                rotate: [0, 0.5, 0, -0.5, 0]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.6, delay: 0.1 }
              }}
              viewport={{ once: true }}
              className="bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30 cursor-pointer"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">CMS & Platform Solutions</h3>
                <p className="text-zinc-400">Content management systems and platform solutions including WordPress, Webflow, and headless CMS for easy content updates.</p>
              </div>

              <div className="relative h-[200px] overflow-hidden">
                {/* Gradient fade at top and bottom */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0d0d0d] to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d0d0d] to-transparent z-10 pointer-events-none" />
                
                <motion.div 
                  className="space-y-2"
                  animate={{
                    y: ["0%", "-50%"]
                  }}
                  transition={{
                    y: {
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  {/* Double the items for seamless loop */}
                  {['WordPress', 'Webflow', 'Sanity CMS', 'Strapi', 'WordPress', 'Webflow', 'Sanity CMS', 'Strapi'].map((platform, idx) => (
                    <div 
                      key={idx} 
                      className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-8 h-8 bg-zinc-700 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="text-zinc-300 text-sm">{platform}</span>
                      </div>
                      <span className="text-zinc-500 text-xs">Expert Level</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Second Row - Small Left, Large Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Optimization - Small Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30 cursor-pointer"
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Performance & SEO</h3>
                <p className="text-zinc-400">Lightning-fast websites optimized for search engines and maximum conversion rates.</p>
              </div>

              {/* Performance Metrics Animation */}
              <div className="space-y-4">
                {[
                  { label: "Page Speed", value: 98, color: "bg-green-400" },
                  { label: "SEO Score", value: 100, color: "bg-[#0066ff]" },
                  { label: "Accessibility", value: 95, color: "bg-cyan-400" },
                  { label: "Best Practices", value: 92, color: "bg-purple-400" }
                ].map((metric, idx) => (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">{metric.label}</span>
                      <span className="text-white font-medium">{metric.value}</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${metric.color} rounded-full`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        transition={{ 
                          duration: 1.5, 
                          delay: 0.5 + idx * 0.1,
                          ease: "easeOut"
                        }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Lighthouse Score Circle */}
              <motion.div 
                className="mt-6 flex justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="rgb(39 39 42)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="226"
                      initial={{ strokeDashoffset: 226 }}
                      whileInView={{ strokeDashoffset: 20 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0066ff" />
                        <stop offset="100%" stopColor="#00ffff" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">96</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Launch & Support - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.3 }
              }}
              className="lg:col-span-2 bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30 cursor-pointer"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Launch & Growth</h3>
                <p className="text-zinc-400">From initial deployment to ongoing optimization, we ensure your website scales with your business growth.</p>
              </div>

              {/* Project Timeline Animation */}
              <div className="relative mb-6">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-800" />
                {[
                  { phase: "Discovery", time: "Week 1", status: "complete" },
                  { phase: "Design", time: "Week 2-3", status: "complete" },
                  { phase: "Development", time: "Week 4-6", status: "active" },
                  { phase: "Testing", time: "Week 7", status: "upcoming" },
                  { phase: "Launch", time: "Week 8", status: "upcoming" }
                ].map((item, idx) => (
                  <motion.div
                    key={item.phase}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="relative pl-8 pb-4 last:pb-0"
                  >
                    {/* Timeline dot */}
                    <motion.div
                      className={`absolute left-0 w-2 h-2 rounded-full -translate-x-[3px] ${
                        item.status === 'complete' ? 'bg-green-400' :
                        item.status === 'active' ? 'bg-[#0066ff]' : 'bg-zinc-600'
                      }`}
                      animate={item.status === 'active' ? {
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{item.phase}</h4>
                        <p className="text-zinc-500 text-sm">{item.time}</p>
                      </div>
                      {item.status === 'complete' && (
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {item.status === 'active' && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <svg className="w-5 h-5 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Live Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900 rounded-lg p-3 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Lightning Bolt Icon */}
                  <svg className="w-6 h-6 text-yellow-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                  <div className="text-white font-bold text-sm">99.9%</div>
                  <div className="text-zinc-500 text-xs">Uptime</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900 rounded-lg p-3 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Rocket Icon */}
                  <svg className="w-6 h-6 text-[#0066ff] mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c0 0-7 5-7 13 0 3.86 3.14 7 7 7s7-3.14 7-7c0-8-7-13-7-13zm0 18c-2.76 0-5-2.24-5-5 0-4.42 3.58-8.09 5-9.56 1.42 1.47 5 5.14 5 9.56 0 2.76-2.24 5-5 5zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  <div className="text-white font-bold text-sm">&lt;200ms</div>
                  <div className="text-zinc-500 text-xs">Response</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900 rounded-lg p-3 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Chat Icon */}
                  <svg className="w-6 h-6 text-green-400 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                  </svg>
                  <div className="text-white font-bold text-sm">24/7</div>
                  <div className="text-zinc-500 text-xs">Support</div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Extra Card - Full Width CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{
              backgroundImage: [
                "linear-gradient(45deg, rgb(13 13 13) 0%, rgb(13 13 13) 100%)",
                "linear-gradient(45deg, rgb(13 13 13) 0%, rgb(0 102 255 / 0.05) 100%)",
                "linear-gradient(45deg, rgb(13 13 13) 0%, rgb(13 13 13) 100%)"
              ]
            }}
            viewport={{ once: true }}
            transition={{ 
              backgroundImage: { duration: 4, repeat: Infinity },
              opacity: { duration: 0.6, delay: 0.4 }
            }}
            className="bg-zinc-900 rounded-2xl p-10 text-center cursor-pointer"
            whileTap={{ scale: 0.98 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              Need Something Custom?
            </h3>
            <p className="text-zinc-400 mb-6">
              Let&apos;s discuss your website project
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