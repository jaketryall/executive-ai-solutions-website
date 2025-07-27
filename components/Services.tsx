"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useIsMobile, useReducedMotion } from "@/hooks/useMobile";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

function ServiceCard({ service, index, isMobile, prefersReducedMotion }: { service: typeof services[0], index: number, isMobile: boolean, prefersReducedMotion: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const Visualization = service.visualization;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.1 }}
      className="group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:z-10 h-full touch-tap-highlight-transparent"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onTouchStart={() => isMobile && setIsHovered(true)}
      onTouchEnd={() => isMobile && setTimeout(() => setIsHovered(false), 300)}
    >
      <div className="relative bg-[#0a0a0a] rounded-xl sm:rounded-2xl border border-zinc-900 overflow-hidden hover:border-zinc-800 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col">
        {/* Abstract graphic area */}
        <div 
          className="h-40 sm:h-48 lg:h-56 relative overflow-hidden bg-zinc-950"
          style={{ background: service.bgPattern }}
        >
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
          
          {/* Service Visualization */}
          <Visualization isActive={isHovered} />

        </div>
        
        {/* Content */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col">
          <h3 className={`text-xl sm:text-2xl font-light mb-3 sm:mb-4 transition-all duration-300 text-center lg:text-left ${
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
}

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Text scroll effects
  const { scrollYProgress: textScrollProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"]
  });
  
  // Simpler transforms
  const textOpacity = useTransform(textScrollProgress, 
    [0, 0.2, 0.8, 1], 
    [0, 1, 1, 0]
  );
  
  const textScale = useTransform(textScrollProgress, 
    [0, 0.2, 0.5, 0.7], 
    [0.8, 1, 1, 0.9]
  );
  
  const textY = useTransform(textScrollProgress, 
    [0, 0.2, 0.8, 1], 
    [30, 0, 0, -30]
  );
  
  const y1 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [1, 1, 1] : [0.3, 1, 0.3]);
  
  // New content opacity transitions
  const contentOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const cardsOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.8, 0.95], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="pt-24 sm:pt-32 lg:pt-48 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 relative bg-black overflow-hidden">
      {/* Top fade transition */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10" />
      
      {/* Parallax background layers */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a14] to-black"
        style={{ y: y1 }}
      />
      
      <motion.div 
        className="absolute inset-0"
        style={{ y: y2, opacity }}
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50"
        style={{ y: y3 }}
      />
      
      
      <motion.div 
        className="max-w-7xl mx-auto relative z-10"
        style={{ opacity: contentOpacity }}
      >
        <motion.div
          ref={textRef}
          className="text-center mb-12 sm:mb-16 lg:mb-20 min-h-[150px] sm:min-h-[200px] flex flex-col justify-center"
          style={{ 
            opacity: textOpacity, 
            y: textY,
            scale: textScale
          }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-4 sm:mb-8 text-white">
            <span className="text-gradient-shine">Our Services</span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-600 font-light max-w-3xl mx-auto">
            Comprehensive AI solutions designed to transform your business
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ opacity: cardsOpacity }}
        >
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} isMobile={isMobile} prefersReducedMotion={prefersReducedMotion} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}