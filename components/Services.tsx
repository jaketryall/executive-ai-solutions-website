"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, memo, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useMobile";
import { WorkflowVisualization, PageBuilderVisualization, ConsultingVisualization } from "./ServiceVisualizations";
import dynamic from "next/dynamic";

const ServicesMobile = dynamic(() => import("./ServicesMobile"), {
  loading: () => <div className="py-20 px-6 bg-black min-h-screen" />,
  ssr: false
});

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

const ServiceCard = memo(function ServiceCard({ service, index, isMobile, prefersReducedMotion }: { service: typeof services[0], index: number, isMobile: boolean, prefersReducedMotion: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const Visualization = service.visualization;
  
  const handleMouseEnter = useCallback(() => !isMobile && setIsHovered(true), [isMobile]);
  const handleMouseLeave = useCallback(() => !isMobile && setIsHovered(false), [isMobile]);
  const handleTouchStart = useCallback(() => isMobile && setIsHovered(true), [isMobile]);
  const handleTouchEnd = useCallback(() => isMobile && setTimeout(() => setIsHovered(false), 300), [isMobile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : index * 0.05, type: "tween", ease: "easeOut" }}
      className="group relative cursor-pointer h-full touch-tap-highlight-transparent"
      style={{ transform: 'translateZ(0)' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={`relative bg-[#0a0a0a] rounded-xl sm:rounded-2xl border overflow-hidden h-full flex flex-col transition-all duration-200 ${
          isHovered 
            ? 'border-zinc-700 shadow-lg shadow-blue-500/25 scale-[1.02]' 
            : 'border-zinc-900 shadow-none scale-100'
        }`}
        style={{ transform: 'translateZ(0)' }}>
        {/* Abstract graphic area */}
        <div 
          className="h-40 sm:h-48 lg:h-56 relative overflow-hidden bg-zinc-950"
          style={{ background: service.bgPattern }}
        >
          {/* Gradient overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${service.gradient} transition-opacity duration-200 ${
              isHovered ? 'opacity-20' : 'opacity-10'
            }`}
          />
          
          {/* Service Visualization */}
          <Visualization isActive={isHovered} />

        </div>
        
        {/* Content */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col">
          <h3 className={`text-xl sm:text-2xl font-light mb-3 sm:mb-4 text-center lg:text-left ${
            isHovered 
              ? `text-transparent bg-gradient-to-r ${service.gradient} bg-clip-text` 
              : 'text-white'
          }`}>
            {service.title}
          </h3>
          
          <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed flex-1 text-center lg:text-left">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = false; // Always false for desktop component
  const prefersReducedMotion = useReducedMotion();
  
  // Remove scroll-based opacity for better performance
  // We'll use CSS-based fade-in instead

  return (
    <>
      {/* Mobile Services - shown below lg breakpoint */}
      <div className="lg:hidden">
        <ServicesMobile />
      </div>

      {/* Desktop Services - shown at lg breakpoint and above */}
      <section ref={ref} className="hidden lg:block pt-24 sm:pt-32 lg:pt-48 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 relative bg-black overflow-hidden">
      {/* Top fade transition */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />
      
      {/* Static background - no parallax for better performance */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a14] to-black" />
      
      {/* Static gradient orbs with GPU acceleration - reduced opacity */}
      <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(0)' }}>
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-lg" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-lg" />
      </div>
      
      
      <div 
        className="max-w-7xl mx-auto relative z-10"
      >
        <motion.div
          ref={textRef}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-4 sm:mb-8 text-white">
            <span className="text-gradient-shine">Our Services</span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-600 font-light max-w-3xl mx-auto">
            Comprehensive AI solutions designed to transform your business
          </p>
        </motion.div>

        <div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} isMobile={isMobile} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </div>
      </div>
    </section>
    </>
  );
}