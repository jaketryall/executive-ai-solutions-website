"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useMobile";

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  const features = [
    {
      icon: "🤖",
      title: "AI Workflow Automation",
      description: "Streamline repetitive tasks with intelligent automation that learns and adapts to your business processes.",
      benefits: ["24/7 Operation", "Zero Human Error", "Scalable Processing"]
    },
    {
      icon: "💼",
      title: "Virtual AI Employees",
      description: "Deploy specialized AI workers for customer service, data analysis, content creation, and more.",
      benefits: ["Instant Availability", "Consistent Performance", "Cost Effective"]
    },
    {
      icon: "🎯",
      title: "Custom AI Solutions",
      description: "Tailored AI implementations designed specifically for your industry and business requirements.",
      benefits: ["Industry-Specific", "Seamless Integration", "Ongoing Support"]
    },
    {
      icon: "📊",
      title: "Data Intelligence",
      description: "Transform raw data into actionable insights with advanced AI analytics and reporting.",
      benefits: ["Real-time Analysis", "Predictive Insights", "Smart Reporting"]
    },
    {
      icon: "🚀",
      title: "Rapid Deployment",
      description: "Get your AI solutions up and running quickly with our streamlined implementation process.",
      benefits: ["Fast Setup", "Minimal Disruption", "Quick ROI"]
    },
    {
      icon: "🔧",
      title: "Ongoing Optimization",
      description: "Continuous monitoring and improvement of your AI systems for maximum efficiency and results.",
      benefits: ["Performance Monitoring", "Regular Updates", "Proactive Support"]
    }
  ];

  return (
    <section ref={ref} className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Minimal background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 to-black pointer-events-none" />

      <motion.div 
        className="max-w-7xl mx-auto relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
      >
        {/* Section header */}
        <motion.div
          className="text-center mb-16 sm:mb-20 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.2 }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 text-white leading-[0.85] tracking-tighter">
            <span className="block">Complete AI</span>
            <span className="text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-400 bg-clip-text">Capabilities</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-zinc-400 font-light leading-relaxed max-w-4xl mx-auto">
            Comprehensive artificial intelligence solutions designed to transform your business operations.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.6, 
                delay: prefersReducedMotion ? 0 : 0.3 + index * 0.1 
              }}
              className="group"
            >
              <div className="h-full p-8 lg:p-10 rounded-3xl bg-zinc-950/80 border border-zinc-800/40 group-hover:border-zinc-700/60 transition-all duration-500 hover:bg-zinc-950/90">
                {/* Feature icon */}
                <div className="text-5xl lg:text-6xl mb-8 group-hover:scale-105 transition-transform duration-300">
                  {feature.icon}
                </div>
                
                {/* Feature content */}
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 group-hover:text-[#0066ff] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 font-light mb-8 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                  
                  {/* Benefits list */}
                  <ul className="space-y-4">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <motion.li
                        key={benefit}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ 
                          duration: prefersReducedMotion ? 0 : 0.4, 
                          delay: prefersReducedMotion ? 0 : 0.5 + index * 0.1 + benefitIndex * 0.05 
                        }}
                        className="flex items-center text-base text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300"
                      >
                        <div className="w-3 h-3 bg-[#0066ff] rounded-full mr-4 group-hover:bg-cyan-400 transition-colors duration-300 flex-shrink-0" />
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-12 sm:mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.8 }}
        >
          <p className="text-zinc-500 font-light mb-6 sm:mb-8 text-sm sm:text-base">
            Ready to transform your business with AI?
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-light text-sm sm:text-base rounded-full hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
            <svg className="ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}