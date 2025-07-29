"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { WorkflowVisualization, PageBuilderVisualization, ConsultingVisualization } from "./ServiceVisualizations";

const services = [
  {
    title: "AI-Powered Workflow Automation Solutions",
    description: "Deploy intelligent automation that handles complex workflows 24/7. From data processing to customer interactions, our AI agents work tirelessly to streamline your operations, reduce costs, and scale your business without limits.",
    gradient: "from-blue-600 to-cyan-500",
    bgPattern: "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
    visualization: WorkflowVisualization,
  },
  {
    title: "Landing Page Creation",
    description: "Transform your ideas into high-converting landing pages powered by AI. Our intelligent design system creates, tests, and optimizes pages for maximum conversions and engagement.",
    gradient: "from-purple-600 to-pink-500",
    bgPattern: "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
    visualization: PageBuilderVisualization,
  },
  {
    title: "AI Consulting",
    description: "Navigate the AI landscape with expert guidance tailored to your business. We help you identify opportunities, implement practical solutions, and build a roadmap for AI transformation that delivers measurable results.",
    gradient: "from-orange-600 to-red-500",
    bgPattern: "radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.15) 0%, transparent 50%)",
    visualization: ConsultingVisualization,
    isConsultation: true,
  },
];

function ServiceCard({ service, index }: { service: typeof services[0], index: number }) {
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" }); // Changed to once: true
  const Visualization = service.visualization;

  // Simple touch interaction for mobile
  const handleTouch = () => {
    setIsActive(true);
    setIsHovered(true);
    setTimeout(() => {
      setIsActive(false);
      setIsHovered(false);
    }, 7000);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative cursor-pointer h-full"
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      onTouchStart={handleTouch}
      onClick={handleTouch}
    >
      <motion.div 
        className="relative bg-[#0a0a0a] rounded-2xl border border-zinc-900 transition-all duration-300 shadow-2xl shadow-blue-500/10 h-full flex flex-col overflow-hidden"
        animate={{
          borderColor: isHovered ? 'rgba(59, 130, 246, 0.3)' : 'rgba(39, 39, 42, 1)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Abstract graphic area */}
        <div 
          className="h-48 relative overflow-hidden bg-zinc-950"
          style={{ background: service.bgPattern }}
        >
          {/* Tap indicator */}
          <AnimatePresence>
            {!isActive && (
              <motion.div 
                className="absolute top-3 right-3 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/80 backdrop-blur-sm rounded-full border border-zinc-800"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <span className="text-zinc-500 text-xs font-light">Tap to explore</span>
                  <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2z" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Gradient overlay with animation */}
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-br ${service.gradient}`}
            animate={{
              opacity: isHovered ? 0.3 : 0.2,
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Tap ripple effect */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className={`w-32 h-32 bg-gradient-to-br ${service.gradient} rounded-full opacity-30`}
                initial={{ scale: 0 }}
                animate={{ scale: 3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </motion.div>
          )}
          
          {/* Service Visualization */}
          <Visualization isActive={isActive} />
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-4 relative overflow-visible" style={{ minHeight: '3rem' }}>
            <h3 className={`text-xl font-light transition-all duration-300 text-center ${
              isActive 
                ? `text-transparent bg-gradient-to-r ${service.gradient} bg-clip-text` 
                : 'text-white'
            }`}
            style={{ 
              position: 'relative',
              display: 'inline-block',
              width: '100%',
              paddingBottom: '0.75rem',
              lineHeight: '2.5'
            }}>
              {service.title}
            </h3>
          </div>
          <p className="text-zinc-600 font-light text-center leading-relaxed text-sm">
            {service.description}
          </p>
          {service.isConsultation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <a
                href="#contact"
                className={`inline-flex items-center px-6 py-3 text-sm font-light bg-gradient-to-r ${service.gradient} text-white rounded-full transition-all duration-300 hover:shadow-lg`}
              >
                Schedule Consultation
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ServicesMobile() {
  return (
    <section className="py-20 px-6 bg-black relative overflow-hidden">
      {/* Top fade transition */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />
      
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a14] to-black" />
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-lg" />
      <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-lg" />
      
      <div className="max-w-xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-light mb-8 text-white">
            <span className="text-gradient-shine">Our Services</span>
          </h2>
          <p className="text-xl text-zinc-600 font-light">
            Comprehensive AI solutions designed to transform your business
          </p>
        </motion.div>
        
        {/* Service cards */}
        <div className="space-y-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}