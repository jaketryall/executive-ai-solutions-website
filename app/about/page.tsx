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
    number: "01",
    title: "Design-First",
    description: "Every project starts with understanding your brand and goals before a single line of code.",
  },
  {
    number: "02",
    title: "Direct Access",
    description: "You work with me directly. No account managers, no junior handoffs, no telephone game.",
  },
  {
    number: "03",
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

// Values accordion row with GSAP scroll animations
function ValueRow({ value, index }: { value: typeof values[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const row = rowRef.current;
    const divider = dividerRef.current;
    if (!row || !divider) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(divider, { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: row, start: "top 90%", end: "top 60%", scrub: 1 },
      });
      gsap.fromTo(row, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: row, start: "top 90%", end: "top 65%", scrub: 1 },
      });
    }, row);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rowRef}>
      <div
        ref={dividerRef}
        className="h-px"
        style={{ backgroundColor: "rgba(255, 200, 150, 0.25)", transformOrigin: "left", transform: "scaleX(0)" }}
      />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-8 md:py-10 group cursor-pointer"
      >
        <div className="flex items-center gap-6 md:gap-10">
          <span
            className="text-sm font-mono transition-colors duration-300"
            style={{ color: isOpen ? accentColor : "rgba(255,255,255,0.3)" }}
          >
            {value.number}
          </span>
          <span
            className="text-2xl md:text-4xl font-black uppercase tracking-[-0.02em] transition-all duration-300 group-hover:translate-x-2"
            style={{ color: isOpen ? accentColor : "#fff" }}
          >
            {value.title}
          </span>
        </div>
        <motion.span
          className="text-white/30 text-2xl"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="text-white/50 text-lg leading-relaxed pb-8 pl-[calc(0.875rem+1.5rem)] md:pl-[calc(0.875rem+2.5rem)] max-w-xl">
          {value.description}
        </p>
      </motion.div>
    </div>
  );
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const _quoteRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // SplitText reveal for hero title
  useSplitTextReveal(heroContentRef);

  // GSAP scroll animations
  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Story section — word-by-word scrub reveal
      const storyWords = storyRef.current?.querySelectorAll("[data-word]");
      if (storyWords?.length) {
        gsap.fromTo(storyWords, { opacity: 0.08 }, {
          opacity: 1, stagger: 0.05, ease: "none",
          scrollTrigger: { trigger: storyRef.current, start: "top 70%", end: "top 20%", scrub: 1 },
        });
      }

      // Story body text
      const storyBody = storyRef.current?.querySelector("[data-story-body]");
      if (storyBody) {
        gsap.fromTo(storyBody, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, ease: "power3.out",
          scrollTrigger: { trigger: storyBody, start: "top 90%", end: "top 60%", scrub: 0.5 },
        });
      }


      // Bento grid — cards drift in from opposite sides
      const bentoSection = containerRef.current?.querySelector("[data-bento]");
      const leftCards = containerRef.current?.querySelectorAll(".bento-left");
      const rightCards = containerRef.current?.querySelectorAll(".bento-right");
      if (bentoSection) {
        if (leftCards?.length) {
          gsap.fromTo(leftCards, { x: -80, opacity: 0 }, {
            x: 0, opacity: 1, stagger: 0.1, ease: "none",
            scrollTrigger: { trigger: bentoSection, start: "top 80%", end: "top 25%", scrub: 1 },
          });
        }
        if (rightCards?.length) {
          gsap.fromTo(rightCards, { x: 80, opacity: 0 }, {
            x: 0, opacity: 1, stagger: 0.1, ease: "none",
            scrollTrigger: { trigger: bentoSection, start: "top 80%", end: "top 25%", scrub: 1 },
          });
        }
      }

      // Centerpiece — word-by-word scrub
      const centerpieceEl = containerRef.current?.querySelector("[data-centerpiece]");
      if (centerpieceEl) {
        const words = centerpieceEl.querySelectorAll("[data-word]");
        if (words.length) {
          gsap.fromTo(words, { opacity: 0.08 }, {
            opacity: 1, stagger: 0.06, ease: "none",
            scrollTrigger: { trigger: centerpieceEl, start: "top 75%", end: "top 25%", scrub: 1 },
          });
        }
      }

      // Values heading — word-by-word scrub
      const valuesHeading = containerRef.current?.querySelector("[data-values-heading]");
      if (valuesHeading) {
        const words = valuesHeading.querySelectorAll("[data-word]");
        if (words.length) {
          gsap.fromTo(words, { opacity: 0.08 }, {
            opacity: 1, stagger: 0.06, ease: "none",
            scrollTrigger: { trigger: valuesHeading, start: "top 85%", end: "top 45%", scrub: 1 },
          });
        }
      }

      // Process heading — word-by-word scrub
      const processHeading = containerRef.current?.querySelector("[data-process-heading]");
      if (processHeading) {
        const words = processHeading.querySelectorAll("[data-word]");
        if (words.length) {
          gsap.fromTo(words, { opacity: 0.08 }, {
            opacity: 1, stagger: 0.06, ease: "none",
            scrollTrigger: { trigger: processHeading, start: "top 85%", end: "top 45%", scrub: 1 },
          });
        }
      }

      // CTA — word-by-word scrub
      const ctaSection = containerRef.current?.querySelector("[data-cta-section]");
      if (ctaSection) {
        const words = ctaSection.querySelectorAll("[data-word]");
        if (words.length) {
          gsap.fromTo(words, { opacity: 0.08, y: 20 }, {
            opacity: 1, y: 0, stagger: 0.08, ease: "none",
            scrollTrigger: { trigger: ctaSection, start: "top 80%", end: "top 40%", scrub: 1 },
          });
        }
      }

      // Process section — stagger steps
      const processSteps = processRef.current?.querySelectorAll("[data-step]");
      if (processSteps?.length) {
        processSteps.forEach((step, i) => {
          gsap.fromTo(step, { y: 50, opacity: 0 }, {
            y: 0, opacity: 1, ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 92%", end: "top 65%", scrub: 0.5 },
          });
        });
      }

      // Process timeline line draw
      const timelineLine = processRef.current?.querySelector("[data-timeline]");
      if (timelineLine) {
        gsap.fromTo(timelineLine, { scaleY: 0 }, {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: processRef.current, start: "top 80%", end: "bottom 40%", scrub: 1 },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);

  // Split text into words for scrub reveals
  const renderWords = (text: string, className: string) =>
    text.split(" ").map((word, i) => (
      <span key={i} data-word className={`inline-block mr-[0.3em] ${className}`}>
        {word}
      </span>
    ));

  return (
    <>
      <Navbar lightHero />
      <ScrollBackground />
      <main ref={containerRef} className="relative" style={{ zIndex: 10 }}>

        {/* ============ HERO — cream, editorial ============ */}
        <motion.section
          ref={heroRef}
          data-bg="cream"
          className="relative min-h-[90vh] flex items-end pb-20 md:pb-32 pt-32 md:pt-40 overflow-hidden"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Subtle organic lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" preserveAspectRatio="none">
            <path d="M0,200 Q400,100 800,250 T1600,180" stroke="#1a1816" strokeWidth="1" fill="none" />
            <path d="M0,400 Q500,300 1000,450 T2000,380" stroke="#1a1816" strokeWidth="0.8" fill="none" />
            <path d="M0,600 Q300,500 700,650 T1400,580" stroke="#1a1816" strokeWidth="0.6" fill="none" />
          </svg>

          <div ref={heroContentRef} className="relative z-10 w-full px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
              <motion.p
                className="text-xs uppercase tracking-[0.4em] mb-6"
                style={{ color: "rgba(26,24,22,0.4)" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                About
              </motion.p>

              <div className="grid md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-7">
                  <SplitText
                    text={"I BUILD\nWEBSITES\nTHAT WORK"}
                    as="h1"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "clamp(3rem, 8vw, 8rem)",
                      fontWeight: 900,
                      color: "#1a1816",
                      lineHeight: 0.85,
                      letterSpacing: "-0.04em",
                    }}
                  />

                  <motion.p
                    className="text-[#1a1816]/50 text-lg leading-relaxed mt-8 max-w-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    Not just pretty pages—sites that convert visitors into customers and rank on Google.
                  </motion.p>
                </div>

                {/* Photo — slight rotation for editorial feel */}
                <motion.div
                  className="md:col-span-5 relative self-end"
                  initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: -2 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative aspect-[4/3] md:aspect-[5/4] max-h-[400px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src="/headshot.jpg"
                      alt="Jake Ryall"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(to top, rgba(229,225,219,0.4) 0%, transparent 50%)" }}
                    />
                    <div
                      className="absolute inset-0 rounded-2xl md:rounded-3xl pointer-events-none"
                      style={{ boxShadow: "inset 0 0 0 1px rgba(26,24,22,0.1)" }}
                    />
                  </div>

                  <motion.div
                    className="absolute -bottom-4 left-4 md:left-6 px-4 py-2 rounded-full"
                    style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(26,24,22,0.15)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <span className="text-sm font-medium text-[#1a1816]">Jake Ryall</span>
                    <span className="text-[#1a1816]/40 text-sm ml-2">• Founder</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ============ MISSION CARD — cream bg, Services-style rounded card ============ */}
        <section data-bg="cream" className="relative px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8">
          <div
            ref={storyRef}
            className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden"
            style={{ backgroundColor: "#141210" }}
          >
            {/* Subtle radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 40% at 30% 30%, rgba(255,200,150,0.04) 0%, transparent 60%)" }}
            />

            <div className="relative z-10 px-8 py-20 md:px-16 md:py-32 lg:px-24 lg:py-40">
              {/* Label */}
              <p
                className="text-[10px] uppercase tracking-[0.5em] mb-10 md:mb-16"
                style={{ color: accentColorMuted }}
              >
                The Mission
              </p>

              {/* MASSIVE headline — word-by-word scrub */}
              <h2
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(2.2rem, 6vw, 6rem)",
                  fontWeight: 900,
                  color: "#f5f0e8",
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                }}
              >
                {renderWords(
                  "I got into this because I love seeing businesses succeed online.",
                  ""
                )}
              </h2>

              {/* Body text — offset right */}
              <div data-story-body className="mt-12 md:mt-16 md:ml-auto md:max-w-lg space-y-5 text-white/45 text-base md:text-lg leading-relaxed">
                <p>
                  There's nothing better than launching a website and watching it bring in
                  new customers, leads, and opportunities. That's what drives me.
                </p>
                <p>
                  I've always been drawn to the craft of creating something beautiful
                  that actually works. Not just looks good—performs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CENTERPIECE — massive statement on cream ============ */}
        <section data-bg="cream" className="relative py-24 md:py-40 px-6 md:px-12 lg:px-20 overflow-hidden">
          {/* Background watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0.03 }}>
            <span className="font-black uppercase" style={{ fontSize: "clamp(10rem, 30vw, 40rem)", letterSpacing: "-0.05em", color: "#1a1816" }}>
              WHY
            </span>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto text-center" data-centerpiece>
            <motion.p
              className="text-[10px] uppercase tracking-[0.5em] mb-8"
              style={{ color: "rgba(26,24,22,0.35)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Why me
            </motion.p>
            <h2
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(2.5rem, 8vw, 8rem)",
                fontWeight: 900,
                color: "#1a1816",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
              }}
            >
              {renderWords("Your website is your", "")}
              <span data-word style={{ color: accentColor, WebkitTextStroke: "2px rgba(255,200,150,0.8)", WebkitTextFillColor: "transparent" }}>
                hardest-working
              </span>{" "}
              {renderWords("employee.", "")}
            </h2>
            <motion.p
              className="text-[#1a1816]/40 text-lg md:text-xl mt-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              It works 24/7, never calls in sick, and talks to every single person who finds you. I make sure it does that job well.
            </motion.p>
          </div>
        </section>

        {/* ============ TOOLS MARQUEE — infinite scroll logos on cream ============ */}
        <section data-bg="cream" className="relative py-12 md:py-16 overflow-hidden">
          <p className="text-center text-[10px] uppercase tracking-[0.5em] mb-8" style={{ color: "rgba(26,24,22,0.3)" }}>
            Built with
          </p>
          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, #e5e1db, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, #e5e1db, transparent)" }} />

            <div className="flex gap-16 md:gap-24 animate-marquee-about">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex items-center gap-16 md:gap-24 shrink-0">
                  {/* Next.js */}
                  <svg viewBox="0 0 180 180" fill="none" className="w-10 h-10 md:w-12 md:h-12 opacity-40 hover:opacity-80 transition-opacity">
                    <mask id={`nj${setIndex}`} style={{maskType:"alpha"}} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180"><circle cx="90" cy="90" r="90" fill="black"/></mask>
                    <g mask={`url(#nj${setIndex})`}><circle cx="90" cy="90" r="90" fill="#1a1816"/><path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill={`url(#nb${setIndex})`}/><rect x="115" y="54" width="12" height="72" fill={`url(#nc${setIndex})`}/></g>
                    <defs><linearGradient id={`nb${setIndex}`} x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse"><stop stopColor="#e5e1db"/><stop offset="1" stopColor="#e5e1db" stopOpacity="0"/></linearGradient><linearGradient id={`nc${setIndex}`} x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse"><stop stopColor="#e5e1db"/><stop offset="1" stopColor="#e5e1db" stopOpacity="0"/></linearGradient></defs>
                  </svg>
                  {/* React */}
                  <svg viewBox="-11.5 -10.232 23 20.463" className="w-10 h-10 md:w-12 md:h-12 opacity-40 hover:opacity-80 transition-opacity">
                    <circle r="2.05" fill="#1a1816"/><g stroke="#1a1816" fill="none" strokeWidth="1"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g>
                  </svg>
                  {/* TypeScript */}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center font-black text-lg opacity-40 hover:opacity-80 transition-opacity" style={{ background: "#1a1816", color: "#e5e1db" }}>TS</div>
                  {/* Tailwind */}
                  <svg viewBox="0 0 54 33" className="w-10 h-8 md:w-12 md:h-10 opacity-40 hover:opacity-80 transition-opacity">
                    <path fillRule="evenodd" clipRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" fill="#1a1816"/>
                  </svg>
                  {/* GSAP */}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-xs opacity-40 hover:opacity-80 transition-opacity" style={{ background: "#1a1816", color: "#e5e1db" }}>GS</div>
                  {/* Figma */}
                  <svg viewBox="0 0 38 57" className="w-8 h-10 md:w-10 md:h-12 opacity-40 hover:opacity-80 transition-opacity">
                    <path fill="#1a1816" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/><path fill="#1a1816" opacity="0.8" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/><path fill="#1a1816" opacity="0.6" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/><path fill="#1a1816" opacity="0.9" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/><path fill="#1a1816" opacity="0.7" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
                  </svg>
                  {/* Vercel */}
                  <svg viewBox="0 0 76 65" className="w-10 h-8 md:w-12 md:h-10 opacity-40 hover:opacity-80 transition-opacity">
                    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#1a1816"/>
                  </svg>
                  {/* Sanity */}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center font-black text-sm opacity-40 hover:opacity-80 transition-opacity" style={{ background: "#1a1816", color: "#e5e1db" }}>S</div>
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            @keyframes marquee-about {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee-about {
              animation: marquee-about 25s linear infinite;
            }
          `}</style>
        </section>

        {/* ============ BENTO GRID — asymmetric cards with featured work ============ */}
        <section data-bg="cream" data-bento className="relative py-20 md:py-28 px-4 md:px-8 lg:px-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">

              {/* Featured Work — large, spans 8 cols */}
              <TransitionLink href="/work" className="md:col-span-8">
                <motion.div
                  className="bento-card bento-left relative rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer h-full min-h-[280px] md:min-h-[420px]"
                  style={{ background: "#141210" }}
                  whileHover={{ scale: 1.005 }}
                  onMouseEnter={() => play("hover", { volume: 0.04 })}
                >
                  <div className="absolute inset-0">
                    <Image
                      src="/Elegant Black Laptop Mockup.webp"
                      alt="Featured project"
                      fill
                      className="object-cover md:object-contain md:object-right md:translate-x-8 transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.3) 60%, transparent 100%)" }} />
                  </div>
                  <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between h-full">
                    <p className="text-xs uppercase tracking-[0.3em]" style={{ color: accentColor }}>Featured Work</p>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-white mb-2">See What I've Built</h3>
                      <p className="text-white/50 mb-4 max-w-md">Real projects with real results.</p>
                      <span className="inline-flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3" style={{ color: accentColor }}>
                        View Projects <span>→</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </TransitionLink>

              {/* What's Included — tall, 4 cols */}
              <motion.div
                className="bento-card bento-right md:col-span-4 relative rounded-2xl md:rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col min-h-[300px] md:min-h-[420px]"
                style={{ background: "#141210" }}
              >
                <p className="text-xs uppercase tracking-[0.3em] mb-8" style={{ color: accentColorMuted }}>Every Project Includes</p>
                <div className="space-y-4 flex-1">
                  {[
                    "Custom design from scratch",
                    "Responsive on all devices",
                    "SEO foundations built in",
                    "Content management system",
                    "Performance optimization",
                    "30 days post-launch support",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                      <span className="text-white/60 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Who I Work With — 6 cols */}
              <motion.div
                className="bento-card bento-left md:col-span-6 relative rounded-2xl md:rounded-3xl overflow-hidden p-8 md:p-10 flex flex-col justify-center min-h-[200px]"
                style={{ background: "#141210" }}
              >
                <p className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: accentColorMuted }}>Who I Work With</p>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-snug mb-4">
                  Small businesses, startups, and professionals who need a website that actually brings in customers.
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Local Businesses", "Startups", "Professional Services", "E-commerce", "Creatives"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-white/50"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Let's Talk — CTA card, 6 cols */}
              <TransitionLink href="/contact" className="md:col-span-6">
                <motion.div
                  className="bento-card bento-right relative rounded-2xl md:rounded-3xl overflow-hidden p-8 md:p-10 flex items-center justify-between min-h-[200px] group cursor-pointer h-full"
                  style={{ background: accentColor }}
                  whileHover={{ scale: 1.01 }}
                  onMouseEnter={() => play("hover", { volume: 0.04 })}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#0a0908]" />
                      <span className="text-[#0a0908]/60 text-xs uppercase tracking-[0.2em] font-medium">Available now</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-[#0a0908]">Let&apos;s build something.</h3>
                  </div>
                  <span className="w-12 h-12 rounded-full bg-[#0a0908] flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e5e1db" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </motion.div>
              </TransitionLink>

            </div>
          </div>
        </section>

        {/* ============ VALUES — accordion in dark card on cream ============ */}
        <section data-bg="cream" className="relative py-10 md:py-16 px-4 md:px-8 lg:px-12">
          <div
            className="max-w-[1400px] mx-auto rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden relative"
            style={{ backgroundColor: "#141210" }}
          >
            <div className="px-8 py-16 md:px-16 md:py-24 lg:px-24 lg:py-28" data-values-section>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: accentColorMuted }}
              >
                What I Believe
              </p>
              <h2
                className="text-4xl md:text-6xl font-black text-white tracking-[-0.03em] mb-12 md:mb-16"
                data-values-heading
              >
                {renderWords("The principles behind every project.", "")}
              </h2>

              <div className="max-w-4xl">
                {values.map((value, i) => (
                  <ValueRow key={value.title} value={value} index={i} />
                ))}
                <div className="h-px" style={{ backgroundColor: "rgba(255, 200, 150, 0.25)" }} />
              </div>
            </div>
          </div>
        </section>


        {/* ============ PROCESS — dark card on cream ============ */}
        <section data-bg="cream" className="relative py-10 md:py-16 px-4 md:px-8 lg:px-12">
          <div
            className="max-w-[1400px] mx-auto rounded-3xl md:rounded-[2.5rem] overflow-hidden relative"
            style={{ backgroundColor: "#141210" }}
          >
            <div ref={processRef} className="px-8 py-16 md:px-16 md:py-24 lg:px-24 lg:py-28">
              <div className="mb-16 md:mb-24" data-process-heading>
                <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: accentColorMuted }}>
                  How I Work
                </p>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-[-0.03em]">
                  {renderWords("From idea to launch in 5 steps.", "")}
                </h2>
              </div>

              <div className="relative max-w-4xl">
                {/* Vertical timeline line */}
                <div
                  data-timeline
                  className="absolute left-4 md:left-8 top-0 bottom-0 w-px"
                  style={{ backgroundColor: "rgba(255, 200, 150, 0.2)", transformOrigin: "top", transform: "scaleY(0)" }}
                />

                <div className="space-y-0">
                  {approach.map((step) => (
                    <div
                      key={step.number}
                      data-step
                      className="relative pl-12 md:pl-20 py-10 md:py-14"
                    >
                      <div
                        className="absolute left-[11px] md:left-[27px] top-12 md:top-16 w-[10px] h-[10px] rounded-full border-2"
                        style={{ borderColor: accentColorMuted, backgroundColor: "transparent" }}
                      />
                      <span
                        className="absolute right-0 md:right-4 top-4 md:top-6 font-black pointer-events-none select-none"
                        style={{
                          fontSize: "clamp(5rem, 12vw, 10rem)",
                          WebkitTextStroke: "1px rgba(255, 200, 150, 0.06)",
                          WebkitTextFillColor: "transparent",
                          lineHeight: 1,
                        }}
                      >
                        {step.number}
                      </span>
                      <div className="relative z-10">
                        <h4 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-[-0.02em]">
                          {step.title}
                        </h4>
                        <p className="text-white/40 text-base md:text-lg leading-relaxed max-w-lg">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CTA — cream background ============ */}
        <section data-bg="cream" className="py-32 md:py-44 px-6 md:px-12 lg:px-20 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center" data-cta-section>
            <h2 className="text-5xl md:text-7xl font-black text-[#1a1816] tracking-[-0.03em] mb-6">
              {renderWords("Ready to start?", "")}
            </h2>

            <motion.p
              className="text-[#1a1816]/40 text-lg mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Let&apos;s talk about your project and see if we&apos;re a good fit.
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
                  style={{ backgroundColor: "#1a1816" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e5e1db" strokeWidth="2">
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
