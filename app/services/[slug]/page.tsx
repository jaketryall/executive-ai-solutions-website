"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, use, useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";
import { services, getServiceBySlug, getRelatedProjects } from "@/lib/data";
import gsap from "gsap";

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Moving background orbs
function MovingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Large floating orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
          left: "10%",
          top: "20%",
          animation: "float1 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`,
          right: "5%",
          top: "50%",
          animation: "float2 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-25"
        style={{
          background: `radial-gradient(circle, rgba(255, 180, 120, 0.1) 0%, transparent 70%)`,
          left: "50%",
          bottom: "10%",
          animation: "float3 18s ease-in-out infinite",
        }}
      />

      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 20px) scale(1.1); }
          66% { transform: translate(30px, -40px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -20px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// Section reveal component
function Section({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.section
      className={className}
      style={style}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.section>
  );
}

// ============================================================================
// UNIQUE GSAP HERO EXPERIENCES
// ============================================================================

// Website Design - Floating code blocks and design grid
function WebsiteDesignHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate floating code blocks
      blocksRef.current.forEach((block, i) => {
        if (!block) return;

        // Initial animation
        gsap.fromTo(
          block,
          {
            y: 100,
            opacity: 0,
            scale: 0.8,
            rotateX: 45,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 1.2,
            delay: 0.8 + i * 0.15,
            ease: "power3.out",
          }
        );

        // Floating animation
        gsap.to(block, {
          y: "random(-20, 20)",
          x: "random(-10, 10)",
          rotation: "random(-3, 3)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        });
      });

      // Grid lines animation
      gsap.fromTo(
        ".grid-line-h",
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 1.5, stagger: 0.1, ease: "power2.out", delay: 0.5 }
      );
      gsap.fromTo(
        ".grid-line-v",
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, duration: 1.5, stagger: 0.1, ease: "power2.out", delay: 0.5 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const codeBlocks = [
    { code: "<div>", color: accentColor, x: "15%", y: "20%", size: "text-sm" },
    { code: "{ style }", color: "#ffffff", x: "75%", y: "30%", size: "text-xs" },
    { code: "function()", color: accentColorMuted, x: "25%", y: "65%", size: "text-sm" },
    { code: "</html>", color: "#ffffff80", x: "70%", y: "70%", size: "text-xs" },
    { code: "const ui", color: accentColor, x: "55%", y: "15%", size: "text-sm" },
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid */}
      <div className="absolute inset-0" style={{ perspective: "1000px" }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="grid-line-h absolute left-0 right-0 h-px"
            style={{
              top: `${15 + i * 15}%`,
              background: `linear-gradient(to right, transparent, rgba(255,200,150,0.1), transparent)`,
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="grid-line-v absolute top-0 bottom-0 w-px"
            style={{
              left: `${10 + i * 12}%`,
              background: `linear-gradient(to bottom, transparent, rgba(255,200,150,0.08), transparent)`,
            }}
          />
        ))}
      </div>

      {/* Floating Code Blocks */}
      {codeBlocks.map((block, i) => (
        <div
          key={i}
          ref={(el) => { blocksRef.current[i] = el; }}
          className={`absolute px-4 py-2 rounded-md backdrop-blur-sm ${block.size}`}
          style={{
            left: block.x,
            top: block.y,
            color: block.color,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "monospace",
            boxShadow: `0 4px 30px rgba(255,200,150,0.05)`,
          }}
        >
          {block.code}
        </div>
      ))}

      {/* Cursor following dot */}
      <div
        className="absolute w-3 h-3 rounded-full"
        style={{
          left: "45%",
          top: "45%",
          background: accentColor,
          boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColorMuted}`,
        }}
      />
    </div>
  );
}

// SEO - Search ranking bars and analytics visualization
function SEOHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [rankings] = useState([85, 92, 78, 95, 88, 72, 90]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate ranking bars
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;

        gsap.fromTo(
          bar,
          { scaleY: 0, transformOrigin: "bottom" },
          {
            scaleY: 1,
            duration: 1,
            delay: 1 + i * 0.12,
            ease: "power3.out",
          }
        );

        // Pulse animation
        gsap.to(bar, {
          scaleY: 1.02,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });

      // Search icon animation
      gsap.fromTo(
        ".search-icon",
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1, delay: 0.5, ease: "back.out(1.7)" }
      );

      // Rising arrow animation
      gsap.fromTo(
        ".rising-arrow",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1.5, ease: "power2.out" }
      );

      // Data points floating
      gsap.to(".data-point", {
        y: "random(-15, 15)",
        x: "random(-10, 10)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ranking Bars */}
      <div className="absolute right-[10%] bottom-[20%] flex items-end gap-3 h-40">
        {rankings.map((height, i) => (
          <div
            key={i}
            ref={(el) => { barsRef.current[i] = el; }}
            className="w-6 rounded-t-sm"
            style={{
              height: `${height}%`,
              background: i === 3
                ? `linear-gradient(to top, ${accentColor}, ${accentColorMuted})`
                : `linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0.05))`,
              boxShadow: i === 3 ? `0 0 20px ${accentColorMuted}` : "none",
            }}
          />
        ))}
      </div>

      {/* Search Icon */}
      <div
        className="search-icon absolute left-[15%] top-[25%] w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `2px solid ${accentColorMuted}`,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>

      {/* Rising Arrow */}
      <div className="rising-arrow absolute left-[55%] top-[30%]">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path
            d="M20 60 L40 20 L60 35"
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <polygon
            points="60,35 52,38 55,30"
            fill={accentColor}
          />
        </svg>
      </div>

      {/* Floating Data Points */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="data-point absolute w-2 h-2 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${40 + (i % 3) * 15}%`,
            background: i % 2 === 0 ? accentColor : "rgba(255,255,255,0.3)",
            boxShadow: i % 2 === 0 ? `0 0 10px ${accentColor}` : "none",
          }}
        />
      ))}

      {/* Keywords floating */}
      <div
        className="absolute right-[25%] top-[20%] px-3 py-1 rounded text-xs"
        style={{
          background: "rgba(255,200,150,0.1)",
          border: "1px solid rgba(255,200,150,0.2)",
          color: accentColor,
        }}
      >
        #1 Ranking
      </div>
    </div>
  );
}

// Custom Solutions - Interconnected gears and data flow
function CustomSolutionsHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gearsRef = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate gears rotating
      gearsRef.current.forEach((gear, i) => {
        if (!gear) return;

        // Entry animation
        gsap.fromTo(
          gear,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: 0.8 + i * 0.2,
            ease: "back.out(1.7)",
          }
        );

        // Continuous rotation
        gsap.to(gear, {
          rotation: i % 2 === 0 ? 360 : -360,
          duration: 8 + i * 2,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        });
      });

      // Data flow lines
      gsap.fromTo(
        ".data-flow",
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 0,
          duration: 2,
          repeat: -1,
          ease: "none",
          stagger: 0.5,
        }
      );

      // Connection nodes pulse
      gsap.to(".connection-node", {
        scale: 1.3,
        opacity: 0.5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const gearPositions = [
    { x: "20%", y: "30%", size: 80 },
    { x: "35%", y: "55%", size: 60 },
    { x: "70%", y: "25%", size: 70 },
    { x: "75%", y: "60%", size: 50 },
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Connection Lines SVG */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor={accentColor} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Data flow paths */}
        <path
          className="data-flow"
          d="M 150 200 Q 300 150 400 300"
          stroke="url(#flowGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10 5"
        />
        <path
          className="data-flow"
          d="M 400 300 Q 500 250 600 350"
          stroke="url(#flowGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10 5"
        />
      </svg>

      {/* Gears */}
      {gearPositions.map((pos, i) => (
        <svg
          key={i}
          ref={(el) => { gearsRef.current[i] = el; }}
          className="absolute"
          style={{ left: pos.x, top: pos.y }}
          width={pos.size}
          height={pos.size}
          viewBox="0 0 100 100"
        >
          <path
            d="M50 10 L54 25 L65 20 L60 35 L75 40 L60 50 L75 60 L60 65 L65 80 L54 75 L50 90 L46 75 L35 80 L40 65 L25 60 L40 50 L25 40 L40 35 L35 20 L46 25 Z"
            fill="none"
            stroke={i === 0 ? accentColor : "rgba(255,255,255,0.2)"}
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="15"
            fill="none"
            stroke={i === 0 ? accentColor : "rgba(255,255,255,0.15)"}
            strokeWidth="2"
          />
        </svg>
      ))}

      {/* Connection Nodes */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="connection-node absolute w-3 h-3 rounded-full"
          style={{
            left: `${30 + i * 15}%`,
            top: `${45 + (i % 2) * 15}%`,
            background: accentColor,
            boxShadow: `0 0 15px ${accentColor}`,
          }}
        />
      ))}

      {/* Database icon */}
      <div
        className="absolute right-[15%] bottom-[25%] p-4 rounded-lg"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,200,150,0.2)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      </div>

      {/* API label */}
      <div
        className="absolute left-[50%] top-[15%] px-3 py-1 rounded text-xs font-mono"
        style={{
          background: "rgba(255,200,150,0.1)",
          border: "1px solid rgba(255,200,150,0.2)",
          color: accentColor,
        }}
      >
        API Connected
      </div>
    </div>
  );
}

// Hero selector based on slug
function ServiceHeroExperience({ slug }: { slug: string }) {
  switch (slug) {
    case "website-design":
      return <WebsiteDesignHero />;
    case "seo":
      return <SEOHero />;
    case "custom-solutions":
      return <CustomSolutionsHero />;
    default:
      return null;
  }
}

export default function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const service = getServiceBySlug(slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  if (!service) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(service.relatedProjects);

  // Get next and prev services
  const currentIndex = services.findIndex((s) => s.slug === slug);
  const prevService = currentIndex > 0 ? services[currentIndex - 1] : null;
  const nextService =
    currentIndex < services.length - 1 ? services[currentIndex + 1] : null;

  return (
    <>
      <MovingBackground />
      <Navbar />
      <main ref={containerRef} className="relative bg-[#0a0908]" style={{ zIndex: 10 }}>
        {/* Hero Section */}
      <motion.section
        className="relative h-[80vh] flex items-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 30%, rgba(255, 200, 150, 0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Unique GSAP Hero Experience */}
        <ServiceHeroExperience slug={slug} />

        {/* Large background number */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden">
          <motion.span
            className="text-[40vw] font-black leading-none select-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.03)",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {service.number}
          </motion.span>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-4xl">
          {/* Service number */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span
              className="text-6xl font-black"
              style={{ color: accentColor }}
            >
              {service.number}
            </span>
            <div
              className="h-px flex-1 max-w-32"
              style={{
                background: `linear-gradient(to right, ${accentColorMuted}, transparent)`,
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-[-0.03em] mb-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {service.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-white/40 italic mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {service.subtitle}
          </motion.p>

          {/* Short description */}
          <motion.p
            className="text-white/60 text-lg max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {service.description}
          </motion.p>
        </div>
      </motion.section>

      {/* Long Description */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-8"
            style={{ color: accentColorMuted }}
          >
            What We Do
          </p>
          <p className="text-2xl md:text-3xl text-white/80 leading-relaxed">
            {service.longDescription}
          </p>
        </div>
      </Section>

      {/* Benefits */}
      <Section className="py-32 px-6 md:px-12 lg:px-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: accentColorMuted }}
              >
                What You Get
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.02em]">
                Benefits
              </h2>
            </div>

            <div className="space-y-6">
              {service.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <p className="text-white/70 text-lg">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p
              className="text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: accentColorMuted }}
            >
              How We Work
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.03em]">
              The Process
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px hidden md:block"
              style={{
                background: `linear-gradient(to bottom, transparent, ${accentColorMuted}, transparent)`,
              }}
            />

            <div className="space-y-16">
              {service.process.map((step, index) => (
                <motion.div
                  key={step.step}
                  className={`relative grid md:grid-cols-2 gap-8 ${
                    index % 2 === 0 ? "" : "md:direction-rtl"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Step indicator */}
                  <div
                    className="absolute left-8 md:left-1/2 top-0 w-4 h-4 rounded-full -translate-x-1/2 hidden md:block"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: `0 0 20px ${accentColor}`,
                    }}
                  />

                  {/* Content */}
                  <div
                    className={`${
                      index % 2 === 0
                        ? "md:text-right md:pr-16"
                        : "md:col-start-2 md:pl-16"
                    }`}
                  >
                    <span
                      className="text-5xl font-black block mb-2"
                      style={{ color: accentColorMuted, opacity: 0.3 }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {step.step}
                    </h3>
                    <p className="text-white/50 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <Section className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: accentColorMuted }}
              >
                See It In Action
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.02em]">
                Related Work
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {relatedProjects.map((project, index) => (
                <TransitionLink key={project.slug} href={`/work/${project.slug}`}>
                  <motion.div
                    className="group relative aspect-16/10 overflow-hidden rounded-sm cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onMouseEnter={() => play("hover", { volume: 0.05 })}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0a0908] via-[#0a0908]/50 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6">
                      <p
                        className="text-xs uppercase tracking-wider mb-2"
                        style={{ color: accentColor }}
                      >
                        {project.category}
                      </p>
                      <h3 className="text-2xl font-black text-white">
                        {project.title}
                      </h3>
                    </div>
                  </motion.div>
                </TransitionLink>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Service Navigation */}
      <Section className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Prev */}
            {prevService ? (
              <TransitionLink href={`/services/${prevService.slug}`}>
                <motion.div
                  className="group flex items-center gap-4"
                  whileHover={{ x: -8 }}
                  onMouseEnter={() => play("hover", { volume: 0.05 })}
                >
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider">
                      Previous
                    </p>
                    <p className="text-white font-medium">
                      {prevService.title}
                    </p>
                  </div>
                </motion.div>
              </TransitionLink>
            ) : (
              <div />
            )}

            {/* Next */}
            {nextService ? (
              <TransitionLink href={`/services/${nextService.slug}`}>
                <motion.div
                  className="group flex items-center gap-4"
                  whileHover={{ x: 8 }}
                  onMouseEnter={() => play("hover", { volume: 0.05 })}
                >
                  <div className="text-right">
                    <p className="text-white/40 text-xs uppercase tracking-wider">
                      Next
                    </p>
                    <p className="text-white font-medium">
                      {nextService.title}
                    </p>
                  </div>
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </motion.div>
              </TransitionLink>
            ) : (
              <div />
            )}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.02em] mb-6">
            Ready to get started?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Let's discuss how our {service.title.toLowerCase()} services can
            help transform your digital presence.
          </p>

          <TransitionLink href="/contact">
            <motion.button
              className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 hover:border-white/20 transition-colors"
              style={{ background: "rgba(255,255,255,0.03)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => play("hover", { volume: 0.06 })}
              onClick={() => play("click")}
            >
              <span className="text-white font-medium">Start a project</span>
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
                style={{ backgroundColor: accentColor }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </motion.button>
          </TransitionLink>
        </div>
      </Section>
      </main>
      <Footer />
    </>
  );
}
