"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// Smooth easing curves
const smoothEase = [0.22, 1, 0.36, 1];
const springTransition = { type: "spring", stiffness: 100, damping: 20 };

// Reusable animated text component with stagger
function AnimatedText({
  children,
  className = "",
  delay = 0
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: smoothEase }}
    >
      {children}
    </motion.span>
  );
}

// Animated tag/pill component with hover
function AnimatedTag({
  children,
  delay = 0,
  variant = "dark"
}: {
  children: string;
  delay?: number;
  variant?: "dark" | "light";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.span
      ref={ref}
      className={`px-4 py-2 rounded-full text-sm cursor-default ${
        variant === "dark"
          ? "border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
          : "border border-zinc-300 text-zinc-600 bg-white hover:border-zinc-400 hover:bg-zinc-50"
      } transition-colors duration-300`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: smoothEase }}
      whileHover={{ y: -2 }}
    >
      {children}
    </motion.span>
  );
}

// ============================================
// SERVICE 1: BRAND IDENTITY
// Typography-focused with animated letters
// ============================================
function BrandIdentitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center relative bg-[#0a0a0a] overflow-hidden"
    >
      {/* Giant animated typography background */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className="text-[20vw] md:text-[15vw] font-black text-zinc-900 uppercase leading-none select-none whitespace-nowrap"
          style={{ x: useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]) }}
        >
          BRAND
        </motion.div>
      </div>

      {/* Floating letters */}
      <div className="absolute inset-0 pointer-events-none">
        {["A", "B", "C", "D"].map((letter, i) => (
          <motion.span
            key={letter}
            className="absolute text-6xl md:text-8xl font-black text-blue-500/10"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
              y: useTransform(scrollYProgress, [0, 1], [50 * (i + 1), -50 * (i + 1)]),
              rotate: useTransform(scrollYProgress, [0, 1], [0, 15 * (i % 2 === 0 ? 1 : -1)]),
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 px-6 md:px-12 lg:px-20 w-full"
        style={{ y, opacity }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <div>
              <span className="text-blue-500 text-sm font-mono mb-4 block">01</span>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mb-6">
                Brand<br />Identity
              </h3>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8 max-w-lg">
                Crafting bold, memorable brand identities from logos to full brand guidelines that set you apart.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Logo Design", "Color Systems", "Typography", "Brand Guidelines"].map((item) => (
                  <span key={item} className="px-4 py-2 border border-zinc-800 rounded-full text-sm text-zinc-400">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right - Visual showcase */}
            <div className="relative h-[400px] md:h-[500px]">
              {/* Stacked logo cards */}
              <motion.div
                className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center"
                style={{
                  rotate: useTransform(scrollYProgress, [0.2, 0.8], [-5, 5]),
                  y: useTransform(scrollYProgress, [0.2, 0.8], [0, -20]),
                }}
              >
                <span className="text-6xl md:text-8xl font-black text-white">Ex</span>
              </motion.div>
              <motion.div
                className="absolute top-20 right-20 w-48 h-48 md:w-64 md:h-64 bg-blue-600 rounded-2xl flex items-center justify-center"
                style={{
                  rotate: useTransform(scrollYProgress, [0.2, 0.8], [5, -5]),
                  y: useTransform(scrollYProgress, [0.2, 0.8], [0, 20]),
                }}
              >
                <span className="text-6xl md:text-8xl font-black text-white">Ai</span>
              </motion.div>
              <motion.div
                className="absolute top-40 right-40 w-48 h-48 md:w-64 md:h-64 bg-zinc-800 rounded-2xl border border-zinc-700 flex items-center justify-center"
                style={{
                  rotate: useTransform(scrollYProgress, [0.2, 0.8], [-3, 3]),
                }}
              >
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// SERVICE 2: WEB DESIGN
// Browser mockup with floating elements
// ============================================
function WebDesignSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center relative bg-[#f5f5f0] overflow-hidden"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 px-6 md:px-12 lg:px-20 w-full"
        style={{ y, opacity }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Browser mockup */}
            <div className="relative order-2 lg:order-1">
              <motion.div
                className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200"
                style={{
                  rotateY: useTransform(scrollYProgress, [0.2, 0.8], [-5, 5]),
                  transformPerspective: 1000,
                }}
              >
                {/* Browser bar */}
                <div className="bg-zinc-100 px-4 py-3 flex items-center gap-2 border-b border-zinc-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md px-3 py-1.5 text-xs text-zinc-400 border border-zinc-200">
                      yourwebsite.com
                    </div>
                  </div>
                </div>
                {/* Browser content */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-zinc-900 to-zinc-800 h-[300px] md:h-[350px] relative">
                  <div className="h-8 w-32 bg-white/10 rounded mb-4" />
                  <div className="h-4 w-48 bg-white/5 rounded mb-2" />
                  <div className="h-4 w-40 bg-white/5 rounded mb-6" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 bg-white/5 rounded" />
                    <div className="h-20 bg-blue-500/20 rounded" />
                    <div className="h-20 bg-white/5 rounded" />
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-xl shadow-lg flex items-center justify-center"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [20, -20]),
                  rotate: useTransform(scrollYProgress, [0, 1], [0, 10]),
                }}
              >
                <span className="text-white text-2xl">✦</span>
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-zinc-900 rounded-xl shadow-lg flex items-center justify-center"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [-20, 20]),
                }}
              >
                <span className="text-white text-xl">◇</span>
              </motion.div>
            </div>

            {/* Right - Info */}
            <div className="order-1 lg:order-2">
              <span className="text-blue-600 text-sm font-mono mb-4 block">02</span>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 uppercase tracking-tight mb-6">
                Web<br />Design
              </h3>
              <p className="text-xl text-zinc-600 leading-relaxed mb-8 max-w-lg">
                High-performance websites with stunning visuals and seamless user experiences that convert.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Custom Design", "Responsive", "Motion Design", "SEO-Ready"].map((item) => (
                  <span key={item} className="px-4 py-2 border border-zinc-300 rounded-full text-sm text-zinc-600 bg-white">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// SERVICE 3: UI/UX DESIGN
// Floating UI components
// ============================================
function UIUXSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center relative bg-[#0a0a0a] overflow-hidden"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 px-6 md:px-12 lg:px-20 w-full"
        style={{ y, opacity }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Info */}
            <div>
              <span className="text-purple-500 text-sm font-mono mb-4 block">03</span>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mb-6">
                UI/UX<br />Design
              </h3>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8 max-w-lg">
                Intuitive digital experiences designed to enhance engagement and maximize conversions.
              </p>
              <div className="flex flex-wrap gap-3">
                {["User Research", "Wireframing", "Prototyping", "Testing"].map((item) => (
                  <span key={item} className="px-4 py-2 border border-zinc-800 rounded-full text-sm text-zinc-400">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right - Floating UI components */}
            <div className="relative h-[400px] md:h-[500px]">
              {/* Card component */}
              <motion.div
                className="absolute top-0 left-0 w-56 md:w-72 bg-zinc-900 rounded-2xl border border-zinc-800 p-4 shadow-xl"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [60, -60]),
                  rotate: useTransform(scrollYProgress, [0, 1], [-3, 3]),
                }}
              >
                <div className="w-full h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg mb-3" />
                <div className="h-3 w-3/4 bg-zinc-800 rounded mb-2" />
                <div className="h-3 w-1/2 bg-zinc-800 rounded" />
              </motion.div>

              {/* Button component */}
              <motion.div
                className="absolute top-32 right-0 flex gap-3"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [40, -40]),
                }}
              >
                <div className="px-6 py-3 bg-blue-500 rounded-full text-white text-sm font-medium shadow-lg shadow-blue-500/25">
                  Get Started
                </div>
                <div className="px-6 py-3 bg-zinc-800 rounded-full text-white text-sm font-medium border border-zinc-700">
                  Learn More
                </div>
              </motion.div>

              {/* Input component */}
              <motion.div
                className="absolute bottom-20 left-10 w-64 bg-zinc-900 rounded-xl border border-zinc-800 p-3 shadow-xl"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [30, -30]),
                  rotate: useTransform(scrollYProgress, [0, 1], [2, -2]),
                }}
              >
                <div className="text-xs text-zinc-500 mb-1">Email</div>
                <div className="h-8 bg-zinc-800 rounded-lg flex items-center px-3">
                  <span className="text-zinc-600 text-sm">hello@example.com</span>
                </div>
              </motion.div>

              {/* Toggle component */}
              <motion.div
                className="absolute bottom-0 right-10 flex items-center gap-3 bg-zinc-900 rounded-full px-4 py-2 border border-zinc-800 shadow-xl"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [20, -20]),
                }}
              >
                <span className="text-zinc-400 text-sm">Dark Mode</span>
                <div className="w-10 h-6 bg-blue-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </motion.div>

              {/* Avatar stack */}
              <motion.div
                className="absolute top-1/2 right-1/4 flex -space-x-2"
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [50, -50]),
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-zinc-900"
                    style={{
                      background: `linear-gradient(135deg, hsl(${i * 60}, 70%, 60%), hsl(${i * 60 + 30}, 70%, 50%))`,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// SERVICE 4: DEVELOPMENT
// Code/terminal aesthetic
// ============================================
function DevelopmentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const codeLines = [
    { indent: 0, content: "const website = {", color: "text-purple-400" },
    { indent: 1, content: "framework: 'Next.js',", color: "text-zinc-400" },
    { indent: 1, content: "styling: 'Tailwind CSS',", color: "text-zinc-400" },
    { indent: 1, content: "animations: 'Framer Motion',", color: "text-zinc-400" },
    { indent: 1, content: "deploy: async () => {", color: "text-blue-400" },
    { indent: 2, content: "await vercel.deploy();", color: "text-emerald-400" },
    { indent: 2, content: "return '🚀 Live!';", color: "text-emerald-400" },
    { indent: 1, content: "}", color: "text-blue-400" },
    { indent: 0, content: "};", color: "text-purple-400" },
  ];

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center relative bg-[#0d1117] overflow-hidden"
    >
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-500 font-mono text-xs"
            style={{
              left: `${i * 5}%`,
              top: 0,
              y: useTransform(scrollYProgress, [0, 1], [0, 200 + i * 20]),
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j}>{Math.random() > 0.5 ? "1" : "0"}</div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 px-6 md:px-12 lg:px-20 w-full"
        style={{ y, opacity }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Code editor */}
            <div className="order-2 lg:order-1">
              <motion.div
                className="bg-[#161b22] rounded-xl border border-[#30363d] overflow-hidden shadow-2xl"
                style={{
                  rotateY: useTransform(scrollYProgress, [0.2, 0.8], [5, -5]),
                  transformPerspective: 1000,
                }}
              >
                {/* Editor header */}
                <div className="bg-[#21262d] px-4 py-3 flex items-center gap-3 border-b border-[#30363d]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#f85149]" />
                    <div className="w-3 h-3 rounded-full bg-[#f0883e]" />
                    <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
                  </div>
                  <span className="text-[#8b949e] text-sm font-mono">website.config.ts</span>
                </div>
                {/* Code content */}
                <div className="p-6 font-mono text-sm">
                  {codeLines.map((line, i) => (
                    <motion.div
                      key={i}
                      className="flex"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <span className="text-[#6e7681] w-8 select-none">{i + 1}</span>
                      <span style={{ paddingLeft: `${line.indent * 1.5}rem` }} className={line.color}>
                        {line.content}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating tech badges */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                {["Next.js", "React", "TypeScript", "Node.js"].map((tech, i) => (
                  <motion.span
                    key={tech}
                    className="px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-full text-xs text-[#8b949e] font-mono"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Right - Info */}
            <div className="order-1 lg:order-2">
              <span className="text-emerald-500 text-sm font-mono mb-4 block">04</span>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mb-6">
                Develop<br />ment
              </h3>
              <p className="text-xl text-[#8b949e] leading-relaxed mb-8 max-w-lg">
                Clean, scalable code that brings designs to life with modern technologies and best practices.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Next.js", "React", "CMS Integration", "Deployment"].map((item) => (
                  <span key={item} className="px-4 py-2 border border-[#30363d] rounded-full text-sm text-[#8b949e]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// MAIN SERVICES COMPONENT
// ============================================
export default function Services() {
  return (
    <section id="services" className="relative">
      {/* Section header */}
      <div className="bg-[#0a0a0a] py-32 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-blue-500 text-sm font-medium tracking-wider uppercase mb-4"
        >
          What We Do
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase"
        >
          Services
        </motion.h2>
      </div>

      {/* Individual service sections */}
      <BrandIdentitySection />
      <WebDesignSection />
      <UIUXSection />
      <DevelopmentSection />

      {/* Bottom CTA */}
      <div className="bg-[#0a0a0a] py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to elevate your brand?
          </h3>
          <p className="text-zinc-500 text-lg mb-8 max-w-md mx-auto">
            Every project includes unlimited revisions and 30 days of support.
          </p>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300"
          >
            Start Your Project
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
