"use client";

import { useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import { TransitionLink } from "./PageTransition";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// 3D Tilt Card Effect
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}

// Magnetic hover effect
function MagneticText({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setPosition({
      x: (e.clientX - centerX) * 0.4,
      y: (e.clientY - centerY) * 0.4,
    });
  }, []);

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

// Animated reveal text with stagger
function RevealText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.03,
            ease: [0.33, 1, 0.68, 1],
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// Animated counter
function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = (currentTime - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

// Glowing orb effect
function GlowingOrb({ size = 300, color = accentColor, x = "50%", y = "50%" }: {
  size?: number;
  color?: string;
  x?: string;
  y?: string;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
        filter: "blur(40px)",
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Animated gradient border
function GradientBorder({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <motion.div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, ${accentColor}40, ${accentColor}10, ${accentColor}40)`,
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="relative bg-black/80 rounded-2xl backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}

// Noise texture overlay
function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// Animated line
function AnimatedLine({ className }: { className?: string }) {
  return (
    <div className={`relative h-px overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="absolute inset-0 bg-white/5" />
    </div>
  );
}

// Social icon with hover effect
function SocialIcon({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 transition-colors duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `${accentColor}10` }}
      />
      <span className="relative z-10 text-white/50 group-hover:text-white transition-colors duration-300">
        {icon}
      </span>
      <span className="sr-only">{label}</span>
    </motion.a>
  );
}

// Live time display
function LiveTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono tabular-nums">{time}</span>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useEffect(() => {
    const updateHeight = () => {
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Parallax for the big text
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: "Projects Completed", value: 150 },
    { label: "Happy Clients", value: 98 },
    { label: "Awards Won", value: 24 },
  ];

  return (
    <>
      <div style={{ height: footerHeight }} />

      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0 bg-[#050505] overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <NoiseOverlay />

        {/* Ambient glow orbs */}
        <GlowingOrb size={600} x="20%" y="30%" />
        <GlowingOrb size={400} x="80%" y="70%" color="rgba(255, 180, 120, 1)" />

        {/* Giant scrolling marquee */}
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
          <div
            ref={marqueeRef}
            className="flex whitespace-nowrap"
            style={{ transform: "translateX(5%)" }}
          >
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="text-[20vw] font-black text-transparent tracking-[-0.04em] mx-8"
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.03)",
                }}
              >
                EXECUTIVE AI
              </span>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {/* Hero CTA Section */}
          <div className="flex flex-col items-center justify-center px-6 md:px-12 pt-12 pb-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.4em] mb-4"
              style={{ color: accentColorMuted }}
            >
              Let&apos;s create something extraordinary
            </motion.p>

            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-white leading-[0.9]">
                <RevealText text="Ready to" className="block" />
                <span className="block mt-2">
                  <RevealText text="start your " delay={0.3} />
                  <MagneticText className="inline-block relative">
                    <span style={{ color: accentColor }}>project</span>
                    <motion.span
                      className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                      style={{ backgroundColor: accentColor }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    />
                  </MagneticText>
                  <RevealText text="?" delay={0.6} />
                </span>
              </h2>
            </div>

            {/* Big CTA Button with 3D effect */}
            <TiltCard className="perspective-1000">
              <motion.a
                href="mailto:hello@executive.ai"
                className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-full overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}20, transparent, ${accentColor}10)`,
                  }}
                />
                <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-white/20 transition-colors" />

                <span className="relative z-10 text-lg md:text-xl text-white/80 group-hover:text-white transition-colors">
                  hello@executive.ai
                </span>

                <motion.span
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `${accentColor}20` }}
                  whileHover={{ rotate: 45 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.span>
              </motion.a>
            </TiltCard>
          </div>

          <AnimatedLine className="mx-6 md:mx-20" />

          {/* Stats Section - inline with less height */}
          <div className="py-6 px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center gap-12 md:gap-20">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-black text-white">
                      <AnimatedCounter target={stat.value} />
                      <span style={{ color: accentColor }}>+</span>
                    </div>
                    <p className="text-white/40 text-xs uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <AnimatedLine className="mx-6 md:mx-20" />

          {/* Links Grid */}
          <div className="py-6 px-6 md:px-12 lg:px-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-2">
                    Navigation
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Work", href: "/work" },
                      { label: "About", href: "/about" },
                      { label: "Contact", href: "/contact" },
                    ].map((item) => (
                      <TransitionLink
                        key={item.href}
                        href={item.href}
                        className="group text-white/50 hover:text-white transition-colors duration-300 flex items-center gap-2"
                      >
                        <motion.span
                          className="w-0 h-px group-hover:w-4 transition-all duration-300"
                          style={{ backgroundColor: accentColor }}
                        />
                        {item.label}
                      </TransitionLink>
                    ))}
                  </div>
                </motion.div>

                {/* Services */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-2">
                    Services
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "Strategy", href: "/services/strategy" },
                      { label: "Craft", href: "/services/craft" },
                      { label: "Legacy", href: "/services/legacy" },
                    ].map((item) => (
                      <TransitionLink
                        key={item.href}
                        href={item.href}
                        className="text-white/50 hover:text-white transition-colors"
                      >
                        {item.label}
                      </TransitionLink>
                    ))}
                  </div>
                </motion.div>

                {/* Contact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-2">
                    Get in Touch
                  </p>
                  <div className="flex flex-col gap-2 text-white/50">
                    <a href="mailto:hello@executive.ai" className="hover:text-white transition-colors">
                      hello@executive.ai
                    </a>
                    <span>Available Worldwide</span>
                  </div>
                </motion.div>

                {/* Social */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mb-2">
                    Follow Us
                  </p>
                  <div className="flex gap-3">
                    <SocialIcon
                      href="https://twitter.com"
                      label="Twitter"
                      icon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      }
                    />
                    <SocialIcon
                      href="https://linkedin.com"
                      label="LinkedIn"
                      icon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      }
                    />
                    <SocialIcon
                      href="https://dribbble.com"
                      label="Dribbble"
                      icon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
                        </svg>
                      }
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="px-6 md:px-12 lg:px-20 pb-6">
            <div className="max-w-6xl mx-auto">
              <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-8">
                  <p className="text-white/30 text-xs">
                    © {currentYear} Executive AI Solutions
                  </p>
                  <div className="hidden md:flex items-center gap-2 text-white/20 text-xs">
                    <motion.span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#4ade80" }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span>Available for projects</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-white/30 text-xs">
                  <span className="font-mono">
                    <LiveTime />
                  </span>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline">Crafted with precision</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient overlay at top */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, #050505, transparent)",
          }}
        />
      </footer>
    </>
  );
}
