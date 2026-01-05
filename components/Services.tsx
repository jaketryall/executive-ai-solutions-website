"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    number: "01",
    title: "STRATEGY",
    subtitle: "Digital Architecture",
    specs: [
      "USER PSYCHOLOGY MAPPING",
      "CONVERSION PATHWAY DESIGN",
      "ROI-DRIVEN PLANNING",
    ],
    legend: "We define the digital architecture before a single line of code is written. ROI is the North Star.",
    lightColor: "rgba(0, 150, 255, 0.15)", // Cold surgical blue
  },
  {
    number: "02",
    title: "ENGINEERING",
    subtitle: "Custom Development",
    specs: [
      "BESPOKE GSAP SYSTEMS",
      "ZERO DEPENDENCIES",
      "LIGHTNING PERFORMANCE",
    ],
    legend: "Bespoke GSAP systems. Zero dependencies. Lightning-fast performance built from the ground up.",
    lightColor: "rgba(255, 180, 80, 0.12)", // Warm expensive gold
  },
  {
    number: "03",
    title: "EVOLUTION",
    subtitle: "Continuous Growth",
    specs: [
      "HIGH-CONVERSION SEO",
      "SCALABLE ARCHITECTURE",
      "CONTINUOUS ITERATION",
    ],
    legend: "A website is a living asset. We build for scalability, ensuring your platform grows with your revenue.",
    lightColor: "rgba(255, 255, 255, 0.1)", // High-contrast white
  },
];

// Service Zone Component - Each full-screen horizontal panel
function ServiceZone({
  service,
  index,
}: {
  service: typeof services[0];
  index: number;
}) {
  return (
    <div
      className="service-zone relative w-screen h-screen flex items-center justify-center shrink-0 overflow-hidden"
      data-index={index}
    >
      {/* Dynamic light source gradient */}
      <div
        className="service-light absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${service.lightColor} 0%, transparent 70%)`,
        }}
      />

      {/* Zone-specific background effects */}
      {index === 0 && (
        // Strategy: Subtle grid
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,150,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,150,255,0.3) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      )}
      {index === 1 && (
        // Engineering: Moving code lines
        <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent"
              style={{
                width: `${100 + Math.random() * 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${8 + i * 8}%`,
              }}
              animate={{
                x: ["-100%", "200%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
      {index === 2 && (
        // Evolution: Light streaks
        <div className="absolute inset-0 overflow-hidden opacity-[0.08]">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-white to-transparent"
              style={{
                width: "300px",
                height: "1px",
                left: "-300px",
                top: `${10 + i * 12}%`,
                transform: "rotate(-15deg)",
              }}
              animate={{
                x: ["0vw", "150vw"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Massive outlined background text (parallax layer - slowest) */}
      <div
        className="parallax-back absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <span
          className="text-[35vw] font-black tracking-[-0.04em] select-none"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.06)",
            WebkitTextFillColor: "transparent",
          }}
        >
          {service.title}
        </span>
      </div>

      {/* Mid layer - abstract visual element */}
      <div
        className="parallax-mid absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div className="relative w-[50vw] h-[50vh] flex items-center justify-center">
          {/* Abstract geometric shape */}
          <svg
            className="w-full h-full opacity-[0.03]"
            viewBox="0 0 400 400"
            fill="none"
          >
            <motion.circle
              cx="200"
              cy="200"
              r="180"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="10 5"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="200"
              cy="200"
              r="140"
              stroke="white"
              strokeWidth="0.5"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="200"
              cy="200"
              r="100"
              stroke="white"
              strokeWidth="0.5"
              strokeDasharray="5 10"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>
      </div>

      {/* Front layer - Service card (parallax - fastest) */}
      <div
        className="parallax-front relative z-10 flex items-center gap-20 px-20"
        style={{ willChange: "transform" }}
      >
        {/* Left: Service info */}
        <div className="max-w-lg">
          {/* Number badge */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[#00f0ff]/60 text-sm font-mono tracking-[0.3em]">
              {service.number}
            </span>
            <div className="h-px w-12 bg-[#00f0ff]/30" />
            <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
              {service.subtitle}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[8vw] md:text-[6vw] lg:text-[5vw] font-black text-white leading-[0.9] tracking-[-0.02em] mb-8">
            {service.title}
          </h2>

          {/* Legend/Description */}
          <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-md">
            {service.legend}
          </p>

          {/* Specs list */}
          <div className="space-y-3 mb-10">
            {service.specs.map((spec, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-white/60 font-mono text-sm"
              >
                <span className="text-[#00f0ff]/40">[{String(i + 1).padStart(2, "0")}]</span>
                <span className="tracking-wider">{spec}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            className="group relative px-8 py-4 border border-white/20 rounded-sm overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
            <span className="relative text-white font-mono text-sm uppercase tracking-widest flex items-center gap-3">
              Start Project
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </div>

        {/* Right: Visual element */}
        <div className="hidden lg:block">
          <ServiceVisual index={index} />
        </div>
      </div>
    </div>
  );
}

// Service Visual - Abstract representations
function ServiceVisual({ index }: { index: number }) {
  if (index === 0) {
    // Strategy: Blueprint wireframe
    return (
      <div className="w-80 h-64 border border-white/10 rounded-lg bg-black/20 p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,150,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,150,255,0.2) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative space-y-4">
          <div className="flex gap-3">
            <motion.div
              className="w-20 h-3 bg-white/20 rounded"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="w-12 h-3 bg-[#00f0ff]/30 rounded"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
            />
          </div>
          <motion.div
            className="w-full h-20 border border-white/10 rounded bg-white/5"
            animate={{ borderColor: ["rgba(255,255,255,0.1)", "rgba(0,240,255,0.2)", "rgba(255,255,255,0.1)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-12 border border-white/10 rounded bg-white/5"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (index === 1) {
    // Engineering: Code terminal
    return (
      <div className="w-80 h-64 bg-black/60 rounded-lg border border-white/10 overflow-hidden">
        <div className="h-8 bg-black/40 border-b border-white/5 flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <div className="p-4 font-mono text-xs space-y-1">
          {[
            { text: "gsap.to('.element', {", color: "#00f0ff" },
            { text: "  duration: 1,", color: "#ffffff80" },
            { text: "  y: -100,", color: "#ffffff80" },
            { text: "  ease: 'power4.out'", color: "#ffffff80" },
            { text: "});", color: "#00f0ff" },
          ].map((line, i) => (
            <motion.div
              key={i}
              style={{ color: line.color }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            >
              {line.text}
            </motion.div>
          ))}
        </div>
        <motion.div
          className="absolute bottom-4 right-4 flex items-center gap-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] font-mono text-green-400">60 FPS</span>
        </motion.div>
      </div>
    );
  }

  // Evolution: Metrics dashboard
  return (
    <div className="w-80 h-64 bg-black/40 rounded-lg border border-white/10 p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-mono text-white/40">ANALYTICS</span>
        <motion.div
          className="flex items-center gap-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[8px] font-mono text-green-400">LIVE</span>
        </motion.div>
      </div>
      <div className="flex items-end gap-1 h-32 mb-4">
        {[40, 55, 45, 70, 60, 85, 75, 90, 80].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-[#00f0ff]/60 to-[#00f0ff]/20 rounded-t"
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] font-mono">
        <span className="text-white/40">Conversions</span>
        <motion.span
          className="text-green-400"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          +127%
        </motion.span>
      </div>
    </div>
  );
}

// Progress indicator
function HorizontalProgress({ progress }: { progress: number }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
      {/* Progress bar */}
      <div className="w-48 h-px bg-white/10 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00f0ff] to-white"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Current section indicators */}
      <div className="flex gap-3">
        {services.map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full border border-white/30"
            animate={{
              backgroundColor: progress > (i / services.length) ? "#00f0ff" : "transparent",
              borderColor: progress > (i / services.length) ? "#00f0ff" : "rgba(255,255,255,0.3)",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}

// Mobile Services layout
function MobileServices() {
  return (
    <div className="md:hidden">
      {services.map((service, index) => (
        <div
          key={service.number}
          className="min-h-screen flex flex-col justify-center px-6 py-20 relative overflow-hidden"
        >
          {/* Light effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${service.lightColor} 0%, transparent 70%)`,
            }}
          />

          {/* Background text */}
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black pointer-events-none select-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.04)",
              WebkitTextFillColor: "transparent",
            }}
          >
            {service.title.charAt(0)}
          </span>

          <div className="relative z-10">
            {/* Number */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[#00f0ff]/60 text-sm font-mono tracking-[0.3em]">
                {service.number}
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Title */}
            <h2 className="text-[14vw] font-black text-white leading-[0.85] tracking-[-0.02em] mb-4">
              {service.title}
            </h2>

            {/* Subtitle */}
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-6">
              {service.subtitle}
            </p>

            {/* Legend */}
            <p className="text-white/50 text-base leading-relaxed mb-8">
              {service.legend}
            </p>

            {/* Specs */}
            <div className="space-y-3">
              {service.specs.map((spec, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 text-white/60 font-mono text-xs"
                >
                  <span className="text-[#00f0ff]/40">[{String(i + 1).padStart(2, "0")}]</span>
                  <span className="tracking-wider">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Services() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isMobile || !containerRef.current || !wrapperRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const zones = container.querySelectorAll(".service-zone");
    const totalWidth = container.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      // Main horizontal scroll
      const horizontalTween = gsap.to(container, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          pin: true,
          scrub: 1.5, // Heavy, cinematic delay
          end: () => `+=${totalWidth * 1.5}`,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // Parallax for each zone
      zones.forEach((zone) => {
        const backLayer = zone.querySelector(".parallax-back");
        const midLayer = zone.querySelector(".parallax-mid");
        const frontLayer = zone.querySelector(".parallax-front");

        // Back layer moves slowest (0.2x)
        if (backLayer) {
          gsap.to(backLayer, {
            x: "20%",
            ease: "none",
            scrollTrigger: {
              trigger: zone,
              containerAnimation: horizontalTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        }

        // Mid layer moves medium (0.6x)
        if (midLayer) {
          gsap.to(midLayer, {
            x: "10%",
            ease: "none",
            scrollTrigger: {
              trigger: zone,
              containerAnimation: horizontalTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        }

        // Front layer moves fastest (1.2x) - slight overshoot
        if (frontLayer) {
          gsap.to(frontLayer, {
            x: "-5%",
            ease: "none",
            scrollTrigger: {
              trigger: zone,
              containerAnimation: horizontalTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="services"
      className="relative bg-black"
      style={{ zIndex: 10 }}
    >
      {/* Desktop: Horizontal Blueprint Panorama */}
      {!isMobile && (
        <div
          ref={wrapperRef}
          className="hidden md:block relative overflow-hidden"
          style={{ height: "100vh" }}
        >
          {/* Panorama container */}
          <div
            ref={containerRef}
            className="flex h-full"
            style={{ width: `${services.length * 100}vw` }}
          >
            {services.map((service, index) => (
              <ServiceZone key={service.number} service={service} index={index} />
            ))}
          </div>

          {/* Fixed progress indicator */}
          <HorizontalProgress progress={scrollProgress} />

          {/* Fixed side labels */}
          <div className="fixed top-1/2 left-8 -translate-y-1/2 z-50">
            <span
              className="text-white/20 text-xs font-mono tracking-widest uppercase"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Services
            </span>
          </div>

          <div className="fixed top-1/2 right-8 -translate-y-1/2 z-50">
            <span
              className="text-white/20 text-xs font-mono tracking-widest uppercase"
              style={{ writingMode: "vertical-rl" }}
            >
              Scroll to explore
            </span>
          </div>
        </div>
      )}

      {/* Mobile layout */}
      {isMobile && <MobileServices />}
    </section>
  );
}
