"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    number: "01",
    title: "DISCOVERY",
    description: "We dive deep into your business, audience, and goals. No assumptions—just research-driven insights that form the foundation of everything we build.",
  },
  {
    number: "02",
    title: "STRATEGY",
    description: "Every pixel has a purpose. We map user journeys, define conversion paths, and architect experiences that turn visitors into customers.",
  },
  {
    number: "03",
    title: "CREATION",
    description: "Custom code, zero templates. We craft every interaction from scratch—GSAP animations, WebGL experiences, and performance-first engineering.",
  },
  {
    number: "04",
    title: "EVOLUTION",
    description: "Launch is just the beginning. We monitor, optimize, and iterate continuously—because your digital presence should grow with your business.",
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Connecting line to next step */}
      {index < steps.length - 1 && (
        <div className="absolute left-8 top-20 bottom-0 w-px bg-gradient-to-b from-white/20 to-transparent hidden md:block" />
      )}

      <div className="flex gap-8 items-start">
        {/* Number */}
        <div className="relative shrink-0">
          <motion.div
            className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            whileHover={{ scale: 1.1, borderColor: "rgba(0,240,255,0.5)" }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-[#00f0ff]/80 font-mono text-sm">{step.number}</span>
          </motion.div>

          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-[#00f0ff]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="flex-1 pt-2">
          <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-[-0.02em]">
            {step.title}
          </h3>
          <p className="text-white/50 leading-relaxed max-w-md">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Approach() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading animation
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current.querySelectorAll(".heading-line"),
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              end: "top 40%",
              scrub: 0.5,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-32 md:py-48 overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orb */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)",
            right: "-400px",
            top: "20%",
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        {/* Section heading */}
        <div ref={headingRef} className="mb-24 md:mb-32">
          <div className="overflow-hidden mb-4">
            <p className="heading-line text-[#00f0ff]/60 text-sm font-mono tracking-[0.3em] uppercase">
              Our Process
            </p>
          </div>
          <div className="overflow-hidden">
            <h2 className="heading-line text-[10vw] md:text-[8vw] lg:text-[6vw] font-black text-white leading-[0.9] tracking-[-0.02em]">
              HOW WE
            </h2>
          </div>
          <div className="overflow-hidden">
            <h2 className="heading-line text-[10vw] md:text-[8vw] lg:text-[6vw] font-black leading-[0.9] tracking-[-0.02em]" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.3)", WebkitTextFillColor: "transparent" }}>
              BUILD
            </h2>
          </div>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="space-y-16 md:space-y-24">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-24 md:mt-32 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase mb-6">
            Ready to see our capabilities?
          </p>
          <motion.div
            className="inline-flex items-center gap-3 text-white/60 hover:text-[#00f0ff] transition-colors cursor-pointer"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm font-mono tracking-wider">Scroll to explore</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade into Services */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, black)",
        }}
      />
    </section>
  );
}
