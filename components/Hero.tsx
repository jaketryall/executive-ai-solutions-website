"use client";

import { motion, useScroll, useTransform, useMotionTemplate, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import AnimatedLogo from "./AnimatedLogo";
import { TransitionLink } from "./PageTransition";

// Work items for mobile hero showcase
const mobileWorkItems = [
  { title: "DESERT WINGS", category: "Flight School", image: "/thumbnails/Celestial Laptop Mockup.webp", slug: "desert-wings" },
  { title: "RILED UP", category: "Coaching", image: "/thumbnails/Celestial iPhone Mockup.webp", slug: "riled-up" },
  { title: "WINGS N WHEELS", category: "Detailing", image: "/thumbnails/Rubber iPhone Mockup.webp", slug: "wings-n-wheels" },
  { title: "ADVENTURE AIR", category: "Tours", image: "/thumbnails/Elegant Black Laptop Mockup.webp", slug: "adventure-air" },
];

// Mobile Hero - Video-forward with work showcase
function MobileHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Delay video loading until intro is partway through (reduces initial load)
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 2000); // Start loading video 2s in (during logo animation)
    return () => clearTimeout(loadTimer);
  }, []);

  // Ensure intro animations complete before allowing fade-out
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroComplete(true);
    }, 3500); // Wait for logo draw + text animations
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    const handleReady = () => {
      // Only mark ready if video is actually playing (has current time > 0)
      // This prevents black frame flash
      if (video.currentTime > 0 || video.readyState >= 4) {
        setVideoReady(true);
      }
    };

    // Check if video is already playing (cached)
    if (video.currentTime > 0 && video.readyState >= 3) {
      setVideoReady(true);
      return;
    }

    // Listen for playing event - most reliable for "video has a frame"
    video.addEventListener("playing", handleReady);
    video.addEventListener("timeupdate", handleReady, { once: true });

    return () => {
      video.removeEventListener("playing", handleReady);
      video.removeEventListener("timeupdate", handleReady);
    };
  }, [shouldLoadVideo]);

  // Only fade out content when BOTH video is playing AND intro is complete
  const shouldFadeOut = videoReady && introComplete;

  return (
    <section className="relative h-screen bg-[#141312] md:hidden overflow-hidden">
      {/* Poster image - shows immediately */}
      <div className="absolute inset-0">
        <Image
          src="/video-poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#141312]/60" />
      </div>

      {/* Video - only loads after 2s delay, fades in when ready */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldFadeOut ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {shouldLoadVideo && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/final-comp.mp4?v=6" type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-[#141312]/50" />
      </motion.div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col">
        {/* Main content - centered, fades out when intro complete AND video loaded */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center px-6 pt-20"
          initial={{ opacity: 1 }}
          animate={{ opacity: shouldFadeOut ? 0 : 1 }}
          transition={{ duration: 0.8, delay: shouldFadeOut ? 0.5 : 0 }}
        >
          {/* Logo with draw animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatedLogo
              width={200}
              height={120}
              drawDuration={2}
              delay={0.5}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="mt-6 text-[#f5f0e8]/80 text-center text-sm font-light tracking-[0.2em] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
          >
            Premium AI Solutions
          </motion.p>

          {/* Subtext */}
          <motion.p
            className="mt-4 text-[#f5f0e8]/50 text-center text-xs max-w-[280px] leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 3.0 }}
          >
            Transforming businesses with cutting-edge artificial intelligence
          </motion.p>
        </motion.div>

        {/* Bottom work showcase - auto-scrolling marquee, stays visible */}
        <motion.div
          className="pb-8 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3.2 }}
        >
          <style>{`
            @keyframes work-marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
          `}</style>

          {/* Label */}
          <div className="px-6 mb-3">
            <span className="text-[#f5f0e8]/40 text-[10px] uppercase tracking-[0.2em]">
              Our Work
            </span>
          </div>

          {/* Marquee container - only render images after intro (3s) to not compete with LCP */}
          <div
            className="flex gap-6"
            style={{
              animation: "work-marquee 25s linear infinite",
              width: "fit-content",
            }}
          >
            {/* First set */}
            {mobileWorkItems.map((item) => (
              <TransitionLink
                key={`a-${item.slug}`}
                href={`/work/${item.slug}`}
                className="shrink-0 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-[#f5f0e8]/10 relative">
                  {introComplete ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f5f0e8]/5" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[#f5f0e8] text-sm font-medium tracking-wide">
                    {item.title}
                  </span>
                  <span className="text-[#f5f0e8]/50 text-xs uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </TransitionLink>
            ))}
            {/* Duplicate set for seamless loop */}
            {mobileWorkItems.map((item) => (
              <TransitionLink
                key={`b-${item.slug}`}
                href={`/work/${item.slug}`}
                className="shrink-0 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-[#f5f0e8]/10 relative">
                  {introComplete ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f5f0e8]/5" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[#f5f0e8] text-sm font-medium tracking-wide">
                    {item.title}
                  </span>
                  <span className="text-[#f5f0e8]/50 text-xs uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </TransitionLink>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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

  // Hero SHRINKS on scroll (the rectangle)
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.52]);
  const heroRadius = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 20, 40]);

  // Name stays the same size (no scaling)
  const nameScale = 1;

  // "JAKE" slides UP, "RYALL" slides DOWN — curtain open
  const jakeY = useTransform(scrollYProgress, [0.2, 0.45], [0, -300]);
  const ryallY = useTransform(scrollYProgress, [0.2, 0.45], [0, 300]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.4], [1, 0]);

  // Project cards scale up with stagger (each card gets a slight delay via index)
  const cardsReveal = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);

  // UI fades
  const uiOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-[300vh] hidden md:block"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* Dark bg content — marquee, scroll-direction-driven */}
          <div className="absolute inset-0 flex flex-col justify-center pointer-events-none overflow-hidden">
            <div ref={marqueeRow1} className="flex whitespace-nowrap will-change-transform" style={{ width: "fit-content" }}>
              {[...Array(8)].map((_, i) => (
                <span key={`a${i}`} className="shrink-0 pr-[3vw]" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14vw", fontWeight: 900, color: "rgba(255,255,255,0.04)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  Design · Develop · Deliver ·{" "}
                </span>
              ))}
            </div>
            <div ref={marqueeRow2} className="flex whitespace-nowrap -mt-[2vw] will-change-transform" style={{ width: "fit-content" }}>
              {[...Array(8)].map((_, i) => (
                <span key={`b${i}`} className="shrink-0 pr-[3vw]" style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "14vw", fontWeight: 900, color: "rgba(255,255,255,0.04)", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  Strategy · Convert · Scale ·{" "}
                </span>
              ))}
            </div>
          </div>

          {/* === THE HERO — cream rectangle that SHRINKS === */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{
              scale: heroScale,
              borderRadius: heroRadius,
              background: "#0a0908",
              boxShadow: "0 25px 100px -10px rgba(0,0,0,0.6), 0 10px 40px -5px rgba(0,0,0,0.4), 0 0 120px 20px rgba(0,0,0,0.2)",
            }}
          >
            {/* Everything except the name + project cards fades on scroll */}
            <motion.div className="absolute inset-0 z-20" style={{ opacity: uiOpacity }}>
              {/* Organic SVG curves — right side like L1 */}
              <svg className="absolute top-0 right-0 h-full w-1/2 pointer-events-none" viewBox="0 0 960 1080" preserveAspectRatio="xMaxYMid slice" fill="none">
                <path d="M200,0 C250,180 180,360 220,540 S160,720 200,900 S250,1000 200,1080" stroke="rgba(0,0,0,0.05)" strokeWidth="1.2" />
                <path d="M400,0 C450,200 380,400 420,600 S360,800 400,1000 S450,1050 400,1080" stroke="rgba(0,0,0,0.035)" strokeWidth="1" />
                <path d="M650,0 C700,220 630,440 670,660 S610,880 650,1080" stroke="rgba(0,0,0,0.025)" strokeWidth="1" />
              </svg>

              {/* NAV BAR */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 pt-7">
                <TransitionLink href="/" className="text-[12px] font-sans font-bold uppercase tracking-[0.08em]" style={{ color: "#1a1816" }}>
                  Jake Ryall
                </TransitionLink>
                <div className="absolute left-1/2 -translate-x-1/2">
                  <img src="/Executive Ai Solutions Logo.svg" alt="" className="w-8 h-8" style={{ opacity: 0.3, filter: "brightness(0)" }} />
                </div>
                <div className="flex items-center gap-3">
                  <TransitionLink
                    href="/contact"
                    className="px-5 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1a1816] border border-[rgba(26,24,22,0.15)] transition-all duration-300 hover:bg-[#1a1816] hover:text-[#e5e1db] hover:border-[#1a1816]"
                  >
                    Get in Touch
                  </TransitionLink>
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
              <div className="absolute bottom-10 right-10 pointer-events-none">
                <p className="text-[9px] font-sans uppercase tracking-[0.2em]" style={{ color: "#8a857d" }}>
                  Scroll to explore
                </p>
              </div>

              {/* Bottom-left: project count */}
              <div className="absolute bottom-10 left-10 pointer-events-none">
                <p className="text-[42px] font-sans font-black leading-none" style={{ color: "#1a1816", opacity: 0.06 }}>04</p>
                <p className="text-[9px] font-sans uppercase tracking-[0.2em] mt-1" style={{ color: "#8a857d" }}>
                  Selected Projects
                </p>
              </div>

              {/* Center subtitle */}
              <div className="absolute bottom-[10vh] left-0 right-0 text-center pointer-events-none">
                <p className="text-[11px] font-sans uppercase tracking-[0.3em]" style={{ color: "#8a857d" }}>
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

            {/* "JAKE" slides UP, "RYALL" slides DOWN — curtain open revealing video */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
            >
              {/* Cream overlay — fades with text to reveal video underneath */}
              <motion.div
                className="absolute inset-0"
                style={{ background: "#e5e1db", opacity: textOpacity }}
              />

              {/* JAKE — video poster visible through letters, slides up */}
              <motion.span
                className="relative"
                style={{
                  fontSize: "clamp(6rem, 14vw, 16rem)",
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
                JAKE
              </motion.span>

              {/* RYALL — video poster through letters, slides down */}
              <motion.span
                className="relative"
                style={{
                  fontSize: "clamp(6rem, 14vw, 16rem)",
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
                RYALL
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
            className="fixed inset-0 z-[100] hidden md:flex items-center justify-center"
            style={{ background: "#0a0908" }}
            initial={{ clipPath: "circle(0% at calc(100% - 52px) 52px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 52px) 52px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 52px) 52px)" }}
            transition={{ duration: 0.75, ease: [0.65, 0.05, 0, 1] }}
          >
            <button
              className="absolute top-7 right-8 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center transition-colors hover:bg-white hover:border-white group"
              onClick={() => setMenuOpen(false)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white group-hover:text-[#0a0908] transition-colors">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/work", label: "Work" },
                { href: "/about", label: "About" },
                { href: "/services/website-design", label: "Services" },
                { href: "/contact", label: "Contact" },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.65, 0.05, 0, 1] }}
                >
                  <TransitionLink
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-4xl font-bold uppercase tracking-[-0.02em] py-2 transition-colors duration-300 hover:text-[#c8a97e]"
                    style={{ fontFamily: "var(--font-serif)", color: "#e5e1db" }}
                  >
                    {link.label}
                  </TransitionLink>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center gap-5">
                {["Ig", "Li", "Dr", "Gh"].map((s) => (
                  <span key={s} className="text-[10px] font-sans uppercase tracking-[0.12em] text-white/30 hover:text-[#c8a97e] transition-colors cursor-pointer">{s}</span>
                ))}
              </div>
              <a href="mailto:jaker@executiveaisolutions.com" className="text-[10px] font-sans text-white/30 hover:text-[#c8a97e] transition-colors">
                jaker@executiveaisolutions.com
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Main Hero export - renders mobile or desktop version
export default function Hero() {
  return (
    <>
      <MobileHero />
      <DesktopHero />
    </>
  );
}
