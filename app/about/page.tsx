"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/homepage/ScrollBackground";
import { useSound } from "@/components/SoundManager";
import { SplitText, useSplitTextReveal } from "@/lib/hooks";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Values data
const values = [
  {
    title: "Design-First",
    description: "Every project starts with understanding your brand and goals before a single line of code.",
  },
  {
    title: "Direct Access",
    description: "You work with me directly. No account managers, no junior handoffs, no telephone game.",
  },
  {
    title: "Built to Last",
    description: "Modern tech stack, clean code, fast performance. Your site will still be great years from now.",
  },
];

// Approach steps
const approach = [
  { number: "01", title: "Discovery", desc: "Understanding your business, goals, and what success looks like." },
  { number: "02", title: "Strategy", desc: "Planning the approach, architecture, and user experience." },
  { number: "03", title: "Design", desc: "Creating visuals that capture your brand and convert visitors." },
  { number: "04", title: "Build", desc: "Developing with modern tools for speed and scalability." },
  { number: "05", title: "Launch", desc: "Testing, optimizing, and going live with confidence." },
];

// Bento card wrapper - only interactive cards get hover effects
function BentoCard({
  children,
  className = "",
  gridClassName = "",
  delay = 0,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  gridClassName?: string;
  delay?: number;
  href?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { play } = useSound();

  const baseStyles = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
  };

  // Only interactive (linked) cards get hover effects
  if (href) {
    return (
      <TransitionLink href={href} className={gridClassName}>
        <motion.div
          className={`relative rounded-2xl md:rounded-3xl overflow-hidden h-full ${className}`}
          style={baseStyles}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-5%" }}
          transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const }}
          onMouseEnter={() => {
            setIsHovered(true);
            play("hover", { volume: 0.04 });
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Hover glow - only for interactive cards */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl md:rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              boxShadow: `inset 0 0 0 1px ${accentColorMuted}, 0 0 40px -10px ${accentColorMuted}`,
            }}
          />
          {children}
        </motion.div>
      </TransitionLink>
    );
  }

  // Non-interactive cards - no hover effects
  return (
    <motion.div
      className={`relative rounded-2xl md:rounded-3xl overflow-hidden ${className} ${gridClassName}`}
      style={baseStyles}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // SplitText reveal for hero title
  useSplitTextReveal(heroContentRef);

  // GSAP scrub animations for content sections
  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const scrubElements = document.querySelectorAll(".about-scrub");
      scrubElements.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 60%",
              scrub: 0.4,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);

  return (
    <>
      <Navbar />
      <ScrollBackground />
      <main ref={containerRef} className="relative" style={{ zIndex: 10 }}>

        {/* Hero - Minimal, asymmetric */}
        <motion.section
          ref={heroRef}
          data-bg="dark"
          className="relative min-h-[90vh] flex items-end pb-20 md:pb-32 pt-32 md:pt-40 overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 40% at 30% 40%, rgba(255, 200, 150, 0.06) 0%, transparent 60%)`,
            }}
          />

          <div ref={heroContentRef} className="relative z-10 w-full px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
              {/* Small label */}
              <motion.p
                className="text-xs uppercase tracking-[0.4em] mb-6"
                style={{ color: accentColorMuted }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                About
              </motion.p>

              {/* Large asymmetric title — SplitText letter reveal */}
              <div className="grid md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-7">
                  <SplitText
                    text={"I BUILD\nWEBSITES\nTHAT WORK"}
                    as="h1"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "clamp(3rem, 8vw, 8rem)",
                      fontWeight: 900,
                      color: "#f5f0e8",
                      lineHeight: 0.85,
                      letterSpacing: "-0.04em",
                    }}
                  />

                  <motion.p
                    className="text-white/50 text-lg leading-relaxed mt-8 max-w-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    Not just pretty pages—sites that convert visitors into customers and rank on Google.
                  </motion.p>
                </div>

                {/* Photo */}
                <motion.div
                  className="md:col-span-5 relative self-end"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative aspect-[4/3] md:aspect-[5/4] max-h-[400px] rounded-2xl md:rounded-3xl overflow-hidden">
                    {/* Replace with your photo */}
                    <Image
                      src="/headshot.jpg"
                      alt="Jake Ryall"
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Subtle gradient overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(10,9,8,0.4) 0%, transparent 50%)",
                      }}
                    />
                    {/* Border glow */}
                    <div
                      className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 0 1px rgba(255,200,150,0.1)`,
                      }}
                    />
                  </div>

                  {/* Name label */}
                  <motion.div
                    className="absolute -bottom-4 left-4 md:left-6 px-4 py-2 rounded-full"
                    style={{
                      background: "rgba(10,9,8,0.9)",
                      border: "1px solid rgba(255,200,150,0.2)",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <span className="text-sm font-medium text-white">Jake Ryall</span>
                    <span className="text-white/40 text-sm ml-2">• Founder</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

        </motion.section>

        {/* Bento Grid Section */}
        <section data-bg="dark" className="relative py-20 md:py-32 px-6 md:px-12 lg:px-20">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 50% 30% at 70% 20%, rgba(255, 200, 150, 0.04) 0%, transparent 60%)`,
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Main Bento Grid - Asymmetric */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">

              {/* Story Card - Large, spans 7 cols */}
              <BentoCard className="p-8 md:p-12" gridClassName="md:col-span-7" delay={0}>
                <p
                  className="text-xs uppercase tracking-[0.3em] mb-6"
                  style={{ color: accentColorMuted }}
                >
                  The Story
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                  I got into this because I love seeing businesses succeed online.
                </h2>
                <div className="space-y-4 text-white/50 leading-relaxed">
                  <p>
                    There's nothing better than launching a website and watching it bring in
                    new customers, leads, and opportunities. That's what drives me.
                  </p>
                  <p>
                    I've always been drawn to the craft of creating something beautiful
                    that actually works. Not just looks good—performs.
                  </p>
                </div>
              </BentoCard>

              {/* Quick Facts - Tall, 5 cols */}
              <BentoCard className="p-8 md:p-10 flex flex-col justify-between min-h-[400px]" gridClassName="md:col-span-5" delay={0.1}>
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.3em] mb-8"
                    style={{ color: accentColorMuted }}
                  >
                    Quick Facts
                  </p>

                  <div className="space-y-6">
                    <div>
                      <span className="text-4xl md:text-5xl font-black" style={{ color: accentColor }}>
                        2+
                      </span>
                      <p className="text-white/40 text-sm mt-1">Years building for the web</p>
                    </div>
                    <div>
                      <span className="text-4xl md:text-5xl font-black" style={{ color: accentColor }}>
                        24hr
                      </span>
                      <p className="text-white/40 text-sm mt-1">Typical response time</p>
                    </div>
                    <div>
                      <span className="text-4xl md:text-5xl font-black" style={{ color: accentColor }}>
                        100%
                      </span>
                      <p className="text-white/40 text-sm mt-1">Direct access to me</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-8 pt-6 border-t border-white/5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                  <span className="text-white/40 text-sm">Based in Arizona</span>
                </div>
              </BentoCard>

              {/* Values - Row of 3 smaller cards */}
              {values.map((value, index) => (
                <BentoCard
                  key={value.title}
                  className="p-6 md:p-8 min-h-[220px] flex flex-col"
                  gridClassName="md:col-span-4"
                  delay={0.15 + index * 0.05}
                >
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed flex-1">
                    {value.description}
                  </p>

                  {/* Corner accent */}
                  <div className="absolute top-4 right-4 w-8 h-8">
                    <div className="absolute top-0 right-0 w-4 h-px" style={{ backgroundColor: accentColorMuted }} />
                    <div className="absolute top-0 right-0 w-px h-4" style={{ backgroundColor: accentColorMuted }} />
                  </div>
                </BentoCard>
              ))}

              {/* Featured Project - Wide card */}
              <BentoCard
                className="relative overflow-hidden group cursor-pointer md:min-h-[350px]"
                gridClassName="md:col-span-8"
                delay={0.3}
                href="/work"
              >
                {/* Mobile: stacked layout - image on top, text below */}
                <div className="md:hidden">
                  {/* Image container */}
                  <div className="relative h-[200px] overflow-hidden">
                    <Image
                      src="/Elegant Black Laptop Mockup.webp"
                      alt="Featured project"
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="100vw"
                    />
                  </div>
                  {/* Text content */}
                  <div className="p-6 bg-black">
                    <p
                      className="text-xs uppercase tracking-[0.3em] mb-3"
                      style={{ color: accentColor }}
                    >
                      Featured Work
                    </p>
                    <h3 className="text-2xl font-black text-white mb-2">
                      See What I've Built
                    </h3>
                    <p className="text-white/60 mb-4 text-sm">
                      Real projects with real results. Take a look at recent work.
                    </p>
                    <span
                      className="inline-flex items-center gap-2 text-sm font-medium"
                      style={{ color: accentColor }}
                    >
                      View Projects
                      <span>→</span>
                    </span>
                  </div>
                </div>

                {/* Desktop: side-by-side layout */}
                <div className="hidden md:block absolute inset-0 bg-black">
                  <Image
                    src="/Elegant Black Laptop Mockup.webp"
                    alt="Featured project"
                    fill
                    className="object-contain object-right translate-x-8 transition-transform duration-700 group-hover:scale-105"
                    sizes="50vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 35%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                    }}
                  />
                </div>

                <div className="hidden md:flex relative z-10 p-12 h-full flex-col justify-between">
                  <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: accentColor }}
                  >
                    Featured Work
                  </p>

                  <div>
                    <h3 className="text-4xl font-black text-white mb-2">
                      See What I've Built
                    </h3>
                    <p className="text-white/50 mb-4 max-w-md">
                      Real projects with real results. Take a look at recent work.
                    </p>
                    <span
                      className="inline-flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3"
                      style={{ color: accentColor }}
                    >
                      View Projects
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </BentoCard>

              {/* Philosophy Quote - Tall card */}
              <BentoCard className="p-8 md:p-10 flex flex-col justify-center min-h-[350px]" gridClassName="md:col-span-4" delay={0.35}>
                <blockquote className="text-xl md:text-2xl font-medium text-white leading-snug mb-6">
                  "Good design isn't decoration—it's the reason people trust you, stay on your site, and become customers."
                </blockquote>
                <div
                  className="w-12 h-px"
                  style={{ backgroundColor: accentColorMuted }}
                />
              </BentoCard>

            </div>

            {/* Approach Section - Horizontal scroll feel */}
            <div className="mt-20 md:mt-32">
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p
                  className="text-xs uppercase tracking-[0.3em] mb-4"
                  style={{ color: accentColorMuted }}
                >
                  How I Work
                </p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.03em]">
                  THE PROCESS
                </h2>
              </motion.div>

              {/* Approach steps - asymmetric grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {approach.map((step, index) => (
                  <motion.div
                    key={step.number}
                    className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <span
                      className="text-5xl font-black block mb-4"
                      style={{
                        WebkitTextStroke: `1px ${accentColorMuted}`,
                        WebkitTextFillColor: "transparent",
                        opacity: 0.5,
                      }}
                    >
                      {step.number}
                    </span>
                    <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div data-bg="morph" className="h-[100px] md:h-[150px]" />

        {/* CTA Section */}
        <section data-bg="cream" className="py-32 px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-6xl font-black text-[#1a1816] tracking-[-0.03em] mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to start?
            </motion.h2>

            <motion.p
              className="text-[#1a1816]/50 text-lg mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Let's talk about your project and see if we're a good fit.
            </motion.p>

            <TransitionLink href="/contact">
              <motion.button
                className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border border-[#1a1816]/10 hover:border-[#1a1816]/20 transition-colors"
                style={{ background: "rgba(26,24,22,0.03)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => play("hover", { volume: 0.06 })}
                onClick={() => play("click")}
              >
                <span className="text-[#1a1816] font-medium">Get in touch</span>
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
        </section>
      </main>
      <Footer />
    </>
  );
}
