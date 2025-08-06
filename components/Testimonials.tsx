"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMobile";

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      title: "CEO",
      company: "TechFlow Solutions",
      image: "SC",
      quote: "Executive AI Solutions transformed our customer service. Our AI agents handle 80% of inquiries with perfect accuracy, allowing our team to focus on complex issues.",
      results: ["80% automation rate", "24/7 availability", "50% cost reduction"],
      industry: "SaaS"
    },
    {
      name: "Michael Rodriguez",
      title: "Operations Director",
      company: "Global Manufacturing Inc",
      image: "MR",
      quote: "The workflow automation they built saves us 15 hours per day. What used to take our team weeks now happens automatically with zero errors.",
      results: ["15 hours saved daily", "Zero processing errors", "3x faster workflows"],
      industry: "Manufacturing"
    },
    {
      name: "Lisa Thompson",
      title: "Marketing Director",
      company: "BrandForward Agency",
      image: "LT",
      quote: "Their AI content creation system produces high-quality marketing materials at scale. We've increased our content output by 300% while maintaining brand consistency.",
      results: ["300% content increase", "Consistent brand voice", "60% faster campaigns"],
      industry: "Marketing"
    },
    {
      name: "David Park",
      title: "Founder",
      company: "DataInsights Pro",
      image: "DP",
      quote: "The custom AI analytics platform gives us insights we never had before. We can predict market trends with 85% accuracy and make data-driven decisions instantly.",
      results: ["85% prediction accuracy", "Real-time insights", "40% better decisions"],
      industry: "Analytics"
    }
  ];

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-zinc-950 pointer-events-none" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const startX = (i * 143) % 1200;
          const startY = (i * 251) % 800;
          const endX = ((i + 8) * 181) % 1200;
          const endY = ((i + 8) * 301) % 800;
          const duration = 25 + (i % 8) * 3;
          
          return (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-blue-400/30 rounded-full"
              initial={{ x: startX, y: startY }}
              animate={{
                x: [startX, endX, startX],
                y: [startY, endY, startY],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          );
        })}
      </div>

      <motion.div 
        className="max-w-6xl mx-auto relative"
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
            <span className="block">Real Business</span>
            <span className="text-gradient-shine">Success Stories</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 font-normal leading-tight max-w-3xl mx-auto">
            Proven results from companies
            <span className="block">transforming with our AI solutions.</span>
          </p>
        </motion.div>

        {/* Main testimonial display */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.4 }}
        >
          <div className="bg-zinc-900/40 backdrop-blur-sm p-6 sm:p-8 lg:p-12 rounded-2xl relative overflow-hidden border border-zinc-800/60">
            {/* Quote background */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-8 text-4xl sm:text-6xl text-[#0066ff]/10 font-serif">&ldquo;</div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
              {/* Testimonial content */}
              <div className="lg:col-span-2 relative z-10">
                <motion.blockquote
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg sm:text-xl lg:text-2xl font-light text-white mb-6 sm:mb-8 leading-relaxed"
                >
                  {testimonials[activeTestimonial].quote}
                </motion.blockquote>
                
                {/* Results */}
                <motion.div
                  key={`results-${activeTestimonial}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8"
                >
                  {testimonials[activeTestimonial].results.map((result) => (
                    <div
                      key={result}
                      className="bg-[#0066ff]/10 border border-[#0066ff]/20 rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-[#0066ff]"
                    >
                      {result}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Author info */}
              <motion.div
                key={`author-${activeTestimonial}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center lg:text-left"
              >
                {/* Avatar */}
                <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-[#0066ff] to-cyan-500 rounded-full text-white font-light text-base sm:text-xl mb-3 sm:mb-4">
                  {testimonials[activeTestimonial].image}
                </div>
                
                <h4 className="text-base sm:text-lg font-light text-white mb-1">
                  {testimonials[activeTestimonial].name}
                </h4>
                <p className="text-zinc-400 text-sm mb-2">
                  {testimonials[activeTestimonial].title}
                </p>
                <p className="text-zinc-500 text-sm mb-3">
                  {testimonials[activeTestimonial].company}
                </p>
                <div className="inline-block bg-zinc-800 rounded-full px-3 py-1 text-xs text-zinc-400">
                  {testimonials[activeTestimonial].industry}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial navigation - Desktop */}
        <motion.div
          className="hidden sm:flex justify-center space-x-3 lg:space-x-4 mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.6 }}
        >
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`group p-3 lg:p-4 rounded-lg lg:rounded-xl transition-all duration-300 ${
                activeTestimonial === index
                  ? 'bg-blue-500/20 border border-blue-500/30'
                  : 'bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 rounded-full text-xs lg:text-sm font-light transition-colors duration-300 ${
                  activeTestimonial === index
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
                }`}>
                  {testimonial.image}
                </div>
                <div className="text-left hidden lg:block">
                  <p className={`text-sm font-light transition-colors duration-300 ${
                    activeTestimonial === index ? 'text-white' : 'text-zinc-400'
                  }`}>
                    {testimonial.name}
                  </p>
                  <p className={`text-xs transition-colors duration-300 ${
                    activeTestimonial === index ? 'text-blue-300' : 'text-zinc-600'
                  }`}>
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Mobile navigation dots */}
        <motion.div
          className="flex sm:hidden justify-center space-x-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.5 }}
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeTestimonial === index
                  ? 'bg-blue-500 w-6'
                  : 'bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.8 }}
        >
          <p className="text-zinc-500 font-light mb-6 sm:mb-8 text-sm sm:text-base">
            Join hundreds of businesses already using AI to grow
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-light text-sm sm:text-base rounded-full hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Success Story
            <svg className="ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}