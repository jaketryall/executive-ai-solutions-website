"use client";

import { motion, useScroll, useTransform, useMotionTemplate, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import AnimatedLogo from "./AnimatedLogo";
import { TransitionLink } from "./PageTransition";
import { SplitText, useSplitTextReveal } from "@/lib/hooks";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Bottom-left hero interaction — circle draws on hover, arrow rotates in
function ViewWorkWidget() {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    const workSection = document.getElementById("work") || document.querySelector("[data-bg='cream']");
    if (workSection) {
      workSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      className="absolute bottom-8 left-8 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{ width: 160 }}
    >
      {/* Outer border container — draws itself on hover */}
      <motion.div
        className="relative rounded-xl overflow-hidden"
        animate={{
          backgroundColor: hovered
            ? "rgba(26, 24, 22, 0.04)"
            : "rgba(26, 24, 22, 0)",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: "10px",
        }}
      >
        {/* Border — subtle default, gold draws on hover */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 3 }}
        >
          {/* Static subtle border — always visible */}
          <rect
            x="0.5"
            y="0.5"
            rx="12"
            ry="12"
            fill="none"
            stroke="rgba(26, 24, 22, 0.12)"
            strokeWidth="1"
            style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
          />
          {/* Gold border — draws on hover */}
          <motion.rect
            x="0.5"
            y="0.5"
            rx="12"
            ry="12"
            fill="none"
            stroke="#c48a5a"
            strokeWidth="1.5"
            strokeDasharray="600"
            animate={{ strokeDashoffset: hovered ? 0 : 600 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
          />
        </svg>

        {/* Top row: dot + label + arrow */}
        <div className="flex items-center justify-between mb-2 relative" style={{ zIndex: 2 }}>
          <div className="flex items-center gap-2">
            <motion.div
              className="rounded-full"
              style={{ width: 6, height: 6 }}
              animate={{
                backgroundColor: hovered ? "#c48a5a" : "rgba(26, 24, 22, 0.3)",
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="text-[9px] font-semibold uppercase tracking-[0.15em]"
              animate={{ color: hovered ? "#c48a5a" : "rgba(26, 24, 22, 0.4)" }}
              transition={{ duration: 0.3 }}
            >
              Latest Project
            </motion.span>
          </div>
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{
              stroke: hovered ? "#c48a5a" : "rgba(26, 24, 22, 0.25)",
              rotate: hovered ? 0 : 90,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </motion.svg>
        </div>

        {/* Expandable thumbnail */}
        <motion.div
          className="rounded-lg overflow-hidden relative"
          animate={{
            height: hovered ? 85 : 0,
            opacity: hovered ? 1 : 0,
            marginBottom: hovered ? 8 : 0,
          }}
          transition={{
            height: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.3, delay: hovered ? 0.1 : 0 },
            marginBottom: { duration: 0.3 },
          }}
          style={{ zIndex: 2, position: "relative" }}
        >
          <Image
            src="/Celestial Laptop Mockup.webp"
            alt="Desert Wings"
            fill
            className="object-cover"
            sizes="160px"
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(26, 24, 22, 0.3)" }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Bottom: project name + year */}
        <div className="flex items-baseline justify-between relative" style={{ zIndex: 2 }}>
          <motion.span
            className="text-[10px] font-bold"
            animate={{ color: hovered ? "#1a1816" : "rgba(26, 24, 22, 0.45)" }}
            transition={{ duration: 0.3 }}
          >
            Desert Wings
          </motion.span>
          <motion.span
            className="text-[9px] font-medium"
            animate={{ color: hovered ? "#c48a5a" : "rgba(26, 24, 22, 0.25)" }}
            transition={{ duration: 0.3 }}
          >
            2024
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

const LOGO_PATH = "M818.41,570.38c15.05,0,19.94-12.01,19.94-32.84v-44.63c0-14.1-1.3-32.55-19.56-32.55H685.46c-8.01,0-12.19,7.43-14.91,14.56l-59.58,173.38c-2.14,5.61-7.02,7.55-12.88,7.55H402.05c-52,0-94.75-39.61-99.71-90.3V416.41c0-38.13,22.95-70.91,55.79-85.25c-35.32-15.72-56.3-50.36-56.31-86.68v-90.87c0-51.94,42.11-94.05,94.05-94.05c0.98,0,1.95,0.01,2.93,0.05h198.9c7.92,0,14.33,6.42,14.33,14.33c0,1.58-0.26,3.1-0.73,4.52c-7.43,22.16-14.95,44.26-22.55,66.31c-2.58,7.48-10.4,8.88-18.22,8.88c-0.04,0-0.08-0.03-0.12-0.04H425.71c-16.19,2.06-27.84,16.3-26.91,32.35v59.32c0,14.92,12.03,27.03,26.91,27.17c42.5,0.39,84.92,0,127.25,0c9.09,0,17.05,6.72,14.46,14.2c-0.97,2.8-2.05,5.45-3.43,9.44l-19.75,57.05c-3.13,9.04-13.06,10.33-22.03,10.33c-0.57,0-0.5,0-0.98,0h-74.16c-24.87,0-45.04,20.16-45.04,45.04c0,2.87,0,5.62,0,7.91v117.45c-0.09,15.01-3.55,31.7,23.66,31.7h96.52c12.17,0,16.56-6.09,22.04-22.04c0.25-0.72,0.48-1.25,0.64-1.71L703.6,78.46c2.76-8.03,5.58-18.86,14.58-18.86h129.22c52.12,0,94.43,42.03,94.88,94.04v158.93c0,7.91-6.42,14.33-14.33,14.33c-0.38,0-0.75-0.01-1.12-0.04h-72.63c-8.28,0-15.09-6.25-15.99-14.29V185.96c0-20.35-16.5-36.86-36.86-36.86c-6.61,0-17.46,2.65-20.81,12.59c-17.05,50.53-68.21,202.14-68.21,202.14c-0.87,2.57,0.37,6.21,3.08,6.21c1.21,0,1.99,0,3.02,0l119.78,0.04c52.82,0,104.07,39.42,104.07,89.65v105.82c0,52.41-42.48,94.89-94.89,94.89c-0.65,0-1.3-0.01-1.95-0.02h-127c-7.23,0-18.16,0.71-14.19-12.3l21.22-69.45c1.6-5.23,6.53-8.53,11.75-8.29";

// Logo with dark outline that fills gold on hover
function HeroLogo() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="cursor-pointer"
      style={{ width: 36, height: 36 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg viewBox="280 40 680 640" className="w-full h-full">
        {/* Fill — fades in on hover */}
        <motion.path
          d={LOGO_PATH}
          animate={{
            fill: hovered ? "rgba(196, 138, 90, 1)" : "rgba(26, 24, 22, 0.15)",
            stroke: hovered ? "rgba(196, 138, 90, 1)" : "rgba(26, 24, 22, 0.4)",
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          strokeWidth="2"
        />
      </svg>
    </motion.div>
  );
}

// Staggered letter hover button — letters slide out upward, new set slides in from below
function StaggerButton({
  text,
  href,
  className = "",
}: {
  text: string;
  href: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const letters = text.split("");

  return (
    <TransitionLink
      href={href}
      className={`relative overflow-hidden inline-flex items-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden className="flex">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="relative inline-block overflow-hidden"
            style={{ lineHeight: 1.2 }}
          >
            {/* Original letter — slides up on hover */}
            <motion.span
              className="inline-block"
              animate={{ y: hovered ? "-100%" : "0%" }}
              transition={{
                duration: 0.3,
                delay: hovered ? i * 0.02 : (letters.length - i) * 0.02,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
            {/* Duplicate letter — slides up from below */}
            <motion.span
              className="absolute left-0 top-0 inline-block"
              animate={{ y: hovered ? "0%" : "100%" }}
              transition={{
                duration: 0.3,
                delay: hovered ? i * 0.02 : (letters.length - i) * 0.02,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          </span>
        ))}
      </span>
    </TransitionLink>
  );
}

// Splash menu nav item with stagger text hover
function SplashNavItem({
  href,
  label,
  index,
  onNavigate,
}: {
  href: string;
  label: string;
  index: number;
  onNavigate: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const letters = label.split("");

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-white/5"
    >
      <TransitionLink
        href={href}
        onClick={onNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group flex items-center justify-between py-4"
      >
        <span
          className="relative inline-flex overflow-hidden"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "#e5e1db",
          }}
        >
          <span className="flex">
            {letters.map((letter, i) => (
              <span key={i} className="relative inline-block overflow-hidden">
                <motion.span
                  className="inline-block"
                  animate={{ y: hovered ? "-100%" : "0%" }}
                  transition={{
                    duration: 0.3,
                    delay: hovered ? i * 0.02 : (letters.length - i) * 0.015,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
                <motion.span
                  className="absolute left-0 top-0 inline-block"
                  style={{ color: "rgba(255, 200, 150, 1)" }}
                  animate={{ y: hovered ? "0%" : "100%" }}
                  transition={{
                    duration: 0.3,
                    delay: hovered ? i * 0.02 : (letters.length - i) * 0.015,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              </span>
            ))}
          </span>
        </span>

        <motion.svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          animate={{
            color: hovered ? "rgba(255, 200, 150, 1)" : "rgba(255,255,255,0)",
            x: hovered ? 0 : -4,
          }}
          transition={{ duration: 0.3 }}
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </motion.svg>
      </TransitionLink>
    </motion.div>
  );
}

// Work items for mobile hero showcase
const mobileWorkItems = [
  { title: "DESERT WINGS", category: "Flight School", image: "/thumbnails/Celestial Laptop Mockup.webp", slug: "desert-wings" },
  { title: "RILED UP", category: "Coaching", image: "/thumbnails/Celestial iPhone Mockup.webp", slug: "riled-up" },
  { title: "WINGS N WHEELS", category: "Detailing", image: "/thumbnails/Rubber iPhone Mockup.webp", slug: "wings-n-wheels" },
  { title: "ADVENTURE AIR", category: "Tours", image: "/thumbnails/Elegant Black Laptop Mockup.webp", slug: "adventure-air" },
];

// No separate MobileHero — DesktopHero is now responsive for all screen sizes

// Desktop Hero — "JAKE RYALL" with projects inside letters, shrinks on scroll
function DesktopHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const marqueeRow1 = useRef<HTMLDivElement>(null);
  const marqueeRow2 = useRef<HTMLDivElement>(null);
  const row1Pos = useRef(0);
  const row2Pos = useRef(0);
  const scrollDir = useRef(-1); // -1 = left, 1 = right

  // Scroll-velocity-driven marquee
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const delta = window.scrollY - lastScrollY;
      if (delta > 2) scrollDir.current = -1;
      else if (delta < -2) scrollDir.current = 1;
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const animate = () => {
      const speed = 0.8;
      row1Pos.current += speed * scrollDir.current;
      row2Pos.current += speed * -scrollDir.current;

      if (marqueeRow1.current) {
        const w = marqueeRow1.current.scrollWidth / 2;
        if (row1Pos.current <= -w) row1Pos.current += w;
        if (row1Pos.current >= 0) row1Pos.current -= w;
        marqueeRow1.current.style.transform = `translateX(${row1Pos.current}px)`;
      }
      if (marqueeRow2.current) {
        const w = marqueeRow2.current.scrollWidth / 2;
        if (row2Pos.current <= -w) row2Pos.current += w;
        if (row2Pos.current >= 0) row2Pos.current -= w;
        marqueeRow2.current.style.transform = `translateX(${row2Pos.current}px)`;
      }
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Ease-out function — fast start, smooth deceleration (like cubic-bezier(0.22, 1, 0.36, 1))
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  // Hero SHRINKS on scroll — proper ease-out curve, no kinks
  const heroScale = useTransform(scrollYProgress, (p) => {
    const t = Math.min(p / 0.45, 1); // normalize 0-0.45 → 0-1
    return 1 - easeOut(t) * 0.48;    // 1 → 0.52
  });
  const heroRadius = useTransform(scrollYProgress, (p) => {
    const t = Math.min(p / 0.35, 1);
    return easeOut(t) * 40;           // 0 → 40
  });

  // Name stays the same size (no scaling)
  const nameScale = 1;

  // "JAKE" slides UP, "RYALL" slides DOWN — curtain open
  const jakeY = useTransform(scrollYProgress, (p) => {
    const t = Math.max(0, Math.min((p - 0.05) / 0.2, 1));
    return -easeOut(t) * 300;
  });
  const ryallY = useTransform(scrollYProgress, (p) => {
    const t = Math.max(0, Math.min((p - 0.05) / 0.2, 1));
    return easeOut(t) * 300;
  });
  const textOpacity = useTransform(scrollYProgress, [0.05, 0.2], [1, 0]);

  // Project cards scale up with stagger
  const cardsReveal = useTransform(scrollYProgress, (p) => {
    const t = Math.max(0, Math.min((p - 0.15) / 0.25, 1));
    return easeOut(t);
  });

  // UI fades
  const uiOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-[200vh]"
        data-bg="dark"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* Dark bg content — marquee, scroll-direction-driven */}
          <div className="absolute inset-0 flex flex-col justify-center pointer-events-none overflow-hidden">
            <div ref={marqueeRow1} className="flex whitespace-nowrap will-change-transform" style={{ width: "fit-content" }}>
              {[...Array(8)].map((_, i) => (
                <span key={`a${i}`} className="shrink-0 pr-[3vw]" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "clamp(3rem, 14vw, 14vw)", fontWeight: 900, color: "rgba(255,255,255,0.04)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  Design · Develop · Deliver ·{" "}
                </span>
              ))}
            </div>
            <div ref={marqueeRow2} className="flex whitespace-nowrap -mt-[2vw] will-change-transform" style={{ width: "fit-content" }}>
              {[...Array(8)].map((_, i) => (
                <span key={`b${i}`} className="shrink-0 pr-[3vw]" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "clamp(3rem, 14vw, 14vw)", fontWeight: 900, color: "rgba(255,255,255,0.04)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  Strategy · Convert · Scale ·{" "}
                </span>
              ))}
            </div>
          </div>

          {/* === THE HERO — dark rectangle that SHRINKS on scroll === */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              scale: heroScale,
              borderRadius: heroRadius,
              background: "#0a0908",
              boxShadow: "0 25px 100px -10px rgba(0,0,0,0.6), 0 10px 40px -5px rgba(0,0,0,0.4), 0 0 120px 20px rgba(0,0,0,0.2)",
            }}
          >
            {/* Everything except the name + project cards fades on scroll */}
            <motion.div
              className="absolute inset-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ opacity: uiOpacity }}
            >
              {/* Organic SVG curves — right side like L1 */}
              <svg className="absolute top-0 right-0 h-full w-1/2 pointer-events-none" viewBox="0 0 960 1080" preserveAspectRatio="xMaxYMid slice" fill="none">
                <path d="M200,0 C250,180 180,360 220,540 S160,720 200,900 S250,1000 200,1080" stroke="rgba(0,0,0,0.05)" strokeWidth="1.2" />
                <path d="M400,0 C450,200 380,400 420,600 S360,800 400,1000 S450,1050 400,1080" stroke="rgba(0,0,0,0.035)" strokeWidth="1" />
                <path d="M650,0 C700,220 630,440 670,660 S610,880 650,1080" stroke="rgba(0,0,0,0.025)" strokeWidth="1" />
              </svg>

              {/* NAV BAR */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 md:px-8 pt-14 md:pt-7">
                <TransitionLink href="/" className="block" style={{ color: "#1a1816" }}>
                  <svg
                    viewBox="30 30 600 250"
                    fill="none"
                    preserveAspectRatio="xMinYMid meet"
                    className="w-[100px] md:w-[130px] h-auto"
                  >
                    <path
                      d="M60,160 C65,100 80,60 95,55 C115,48 110,100 108,130 C105,165 90,200 80,210 Q70,220 85,215 C110,205 135,160 155,155 C175,150 170,185 160,200 Q148,218 165,210 C185,200 195,175 210,165 Q230,152 225,180 C220,205 200,225 195,218 Q188,208 210,195 C225,186 250,175 270,200 Q275,208 265,208 C250,208 280,170 310,120 C325,95 340,75 350,70 Q365,64 358,90 C350,120 335,165 340,185 Q345,200 360,185 C375,168 385,145 400,155 Q408,160 400,178 C390,200 365,230 360,248 Q355,265 370,250 C390,228 410,195 430,188 Q445,182 442,200 C438,215 425,225 435,220 Q450,212 460,140 L462,210 Q465,130 475,128 L477,210 C485,205 520,188 560,182 Q600,176 620,190"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </TransitionLink>
                <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
                  <HeroLogo />
                </div>
                <div className="flex items-center gap-3">
                  <StaggerButton
                    href="/contact"
                    text="Get in Touch"
                    className="hidden md:inline-flex px-5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1a1816] border border-[rgba(26,24,22,0.15)] transition-all duration-300 hover:bg-[#1a1816] hover:text-[#e5e1db] hover:border-[#1a1816]"
                  />
                  <button
                    className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:bg-[#1a1816] hover:border-[#1a1816] group"
                    style={{ borderColor: "rgba(26,24,22,0.15)" }}
                    onClick={() => setMenuOpen(true)}
                  >
                    <div className="flex flex-col gap-[4px]">
                      <span className="w-3.5 h-[1.5px] bg-[#1a1816] group-hover:bg-[#e5e1db] transition-colors" />
                      <span className="w-3.5 h-[1.5px] bg-[#1a1816] group-hover:bg-[#e5e1db] transition-colors" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Bottom-right: scroll hint */}
              <div className="absolute bottom-10 right-5 md:right-10 pointer-events-none">
                <p className="text-[9px] font-sans uppercase tracking-[0.2em]" style={{ color: "#8a857d" }}>
                  Scroll to explore
                </p>
              </div>

              {/* Bottom-left: View Work interaction — desktop only */}
              <div className="hidden md:block">
                <ViewWorkWidget />
              </div>

              {/* Center subtitle */}
              <div className="absolute bottom-[10vh] left-0 right-0 text-center pointer-events-none">
                <p className="text-[9px] md:text-[11px] font-sans uppercase tracking-[0.3em]" style={{ color: "#8a857d" }}>
                  Websites that convert · Brands that stand out
                </p>
              </div>
            </motion.div>

            {/* Video playing behind — visible through text and when cream fades */}
            <div className="absolute inset-0">
              <video
                autoPlay muted loop playsInline preload="auto"
                poster="/video-poster.webp"
                className="w-full h-full object-cover"
              >
                <source src="/final-comp.mp4?v=6" type="video/mp4" />
              </video>
            </div>

            {/* Text with video showing through letterforms — cream surrounds it */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
            >
              {/* Cream overlay — video only visible through the text cutouts */}
              <motion.div
                className="absolute inset-0"
                style={{ background: "#e5e1db", opacity: textOpacity }}
              />

              {/* WEBSITE — video poster peeks through letters, slams in on load, slides up on scroll */}
              <motion.span
                className="relative"
                initial={{ opacity: 0, scale: 1.15, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: "clamp(4.5rem, 12vw, 14rem)",
                  fontFamily: "Impact, 'Arial Black', sans-serif",
                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: "transparent",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  backgroundImage: "url('/video-poster.webp')",
                  backgroundSize: "cover",
                  backgroundPosition: "center 30%",
                  y: jakeY,
                  opacity: textOpacity,
                }}
              >
                WEBSITE
              </motion.span>

              {/* DESIGN — video poster through letters, slams in from opposite direction */}
              <motion.span
                className="relative"
                initial={{ opacity: 0, scale: 1.15, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: "clamp(4.5rem, 12vw, 14rem)",
                  fontFamily: "Impact, 'Arial Black', sans-serif",
                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: "transparent",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  backgroundImage: "url('/video-poster.webp')",
                  backgroundSize: "cover",
                  backgroundPosition: "center 70%",
                  y: ryallY,
                  opacity: textOpacity,
                }}
              >
                DESIGN
              </motion.span>
            </motion.div>

          </motion.div>

          {/* No outside chrome — nav is inside the cream hero now */}
        </div>
      </section>

      {/* === SPLASH MENU === */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] [--clip-x:calc(100%-40px)] [--clip-y:76px] md:[--clip-x:calc(100%-52px)] md:[--clip-y:48px]"
            style={{ background: "#0a0908" }}
            initial={{ clipPath: "circle(0% at var(--clip-x) var(--clip-y))" }}
            animate={{ clipPath: "circle(150% at var(--clip-x) var(--clip-y))" }}
            exit={{ clipPath: "circle(0% at var(--clip-x) var(--clip-y))" }}
            transition={{ duration: 0.75, ease: [0.65, 0.05, 0, 1] }}
          >

            {/* Close button — lines animate from hamburger to X */}
            <button
              className="absolute top-[56px] right-5 md:top-7 md:right-8 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition-all hover:bg-white hover:border-white group z-10"
              onClick={() => setMenuOpen(false)}
            >
              <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                <motion.span
                  className="absolute w-3.5 h-[1.5px] bg-white group-hover:bg-[#0a0908] transition-colors"
                  initial={{ rotate: 0, y: -2.5 }}
                  animate={{ rotate: 45, y: 0 }}
                  exit={{ rotate: 0, y: -2.5 }}
                  transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                />
                <motion.span
                  className="absolute w-3.5 h-[1.5px] bg-white group-hover:bg-[#0a0908] transition-colors"
                  initial={{ rotate: 0, y: 2.5 }}
                  animate={{ rotate: -45, y: 0 }}
                  exit={{ rotate: 0, y: 2.5 }}
                  transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                />
              </div>
            </button>

            {/* Layout — single column mobile, two column desktop */}
            <div className="h-full flex flex-col md:flex-row">
              {/* Left — navigation links */}
              <div className="flex-1 md:w-1/2 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24">
                <motion.p
                  className="text-xs uppercase tracking-[0.3em] mb-8"
                  style={{ color: "rgba(255, 200, 150, 0.4)" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Navigation
                </motion.p>

                {[
                  { href: "/", label: "HOME" },
                  { href: "/work", label: "WORK" },
                  { href: "/about", label: "ABOUT" },
                  { href: "/services/website-design", label: "SERVICES" },
                  { href: "/contact", label: "CONTACT" },
                ].map((link, i) => (
                  <SplashNavItem
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    index={i}
                    onNavigate={() => setMenuOpen(false)}
                  />
                ))}
              </div>

              {/* Right — info panel (hidden on mobile, shown on desktop) */}
              <div className="hidden md:flex w-1/2 h-full flex-col justify-between py-16 px-16 lg:px-24">
                {/* Top right — label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(255, 200, 150, 0.4)" }}>
                    Get in Touch
                  </p>
                  <a
                    href="mailto:jaker@executiveaisolutions.com"
                    className="text-lg font-medium text-white/60 hover:text-[#c48a5a] transition-colors mt-2 inline-block"
                  >
                    jaker@executiveaisolutions.com
                  </a>
                </motion.div>

                {/* Center — big statement */}
                <motion.p
                  className="text-white/[0.03] font-black leading-[0.85]"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "clamp(6rem, 12vw, 14rem)",
                    letterSpacing: "-0.04em",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  JR
                </motion.p>

                {/* Bottom — socials */}
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="flex items-center gap-6">
                    {[
                      { label: "LinkedIn", href: "https://www.linkedin.com/in/jake-ryall" },
                      { label: "Dribbble", href: "https://dribbble.com/jake-ryall" },
                      { label: "Instagram", href: "https://instagram.com/exec.ai.solutions" },
                      { label: "GitHub", href: "https://github.com/jaketryall" },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/30 hover:text-[#c48a5a] transition-colors"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/20">
                    &copy; {new Date().getFullYear()}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Main Hero export — single responsive component
export default function Hero() {
  return <DesktopHero />;
}
