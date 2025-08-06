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
  const [selectedDates, setSelectedDates] = useState<number[]>([]);

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
            {/* AI Consulting - Small Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30 cursor-pointer"
              onClick={() => console.log('E-commerce clicked')}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">E-commerce Solutions</h3>
                <p className="text-zinc-400">Complete online stores with payment processing, inventory management, and AI-powered product recommendations.</p>
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

              <motion.div 
                className="bg-zinc-900 rounded-xl p-6 cursor-pointer"
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month) => (
                    <span key={month} className="text-zinc-500 text-xs">{month}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(35)].map((_, i) => {
                    // Create a deterministic pattern based on index
                    const isActive = (i % 3 === 0) || (i % 5 === 0) || (i % 7 === 1);
                    const isSelected = selectedDates.includes(i);
                    return (
                      <motion.div
                        key={i}
                        className={`aspect-square rounded cursor-pointer ${
                          isSelected ? 'bg-cyan-400' : isActive ? 'bg-[#0066ff]' : 'bg-zinc-800'
                        }`}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        animate={isActive && !isSelected ? {
                          opacity: [1, 0.5, 1]
                        } : {}}
                        transition={{ 
                          scale: { delay: i * 0.01, duration: 0.3 },
                          opacity: { duration: 2, delay: i * 0.1, repeat: Infinity }
                        }}
                        viewport={{ once: true }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => {
                          setSelectedDates(prev => 
                            prev.includes(i) 
                              ? prev.filter(d => d !== i)
                              : [...prev, i]
                          );
                        }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* Tools Integrations - Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              animate={{
                borderColor: ["rgb(39 39 42)", "rgb(0 102 255 / 0.2)", "rgb(39 39 42)"]
              }}
              viewport={{ once: true }}
              transition={{ 
                borderColor: { duration: 5, repeat: Infinity },
                opacity: { duration: 0.6, delay: 0.3 }
              }}
              className="lg:col-span-2 bg-[#0d0d0d] border border-zinc-800 border-t-zinc-700 rounded-2xl p-8 shadow-lg shadow-black/30 cursor-pointer"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Maintenance & AI Automation</h3>
                <p className="text-zinc-400">Keep your site running smoothly with ongoing support, updates, and optional AI features like chatbots and content generation.</p>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                {["24/7", "Updates", "SEO", "Speed", "AI", "Chat", "CMS"].map((logo, idx) => (
                  <motion.div
                    key={idx}
                    className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-400 font-bold cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    animate={{
                      y: [0, -10, 0]
                    }}
                    transition={{ 
                      y: { duration: 2, delay: idx * 0.2, repeat: Infinity },
                      opacity: { delay: idx * 0.05, duration: 0.3 }
                    }}
                    viewport={{ once: true }}
                    whileTap={{ scale: 0.9, backgroundColor: "#0066ff" }}
                  >
                    {logo}
                  </motion.div>
                ))}
              </div>

              <p className="text-zinc-400 mt-4">Complete website maintenance with optional AI enhancements to automate and improve your site.</p>
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