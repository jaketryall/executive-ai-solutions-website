"use client";

import Link from "next/link";
import { useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Magnetic link component with smooth follow effect
function MagneticLink({
  children,
  href,
  className,
  external = false,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  external?: boolean;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.3;
    const distanceY = (e.clientY - centerY) * 0.3;
    setPosition({ x: distanceX, y: distanceY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const LinkComponent = external ? "a" : Link;
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <LinkComponent
        ref={linkRef as any}
        href={href}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...externalProps}
      >
        {children}
      </LinkComponent>
    </motion.div>
  );
}

// Animated underline link
function AnimatedLink({
  children,
  href,
  external = false,
}: {
  children: React.ReactNode;
  href: string;
  external?: boolean;
}) {
  return (
    <MagneticLink
      href={href}
      external={external}
      className="footer-link group relative inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300"
    >
      <span className="relative">
        {children}
        <span
          className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
          style={{ backgroundColor: accentColor }}
        />
      </span>
      {/* Diagonal slide arrow */}
      <span className="relative w-3 h-3 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:translate-x-full group-hover:-translate-y-full text-[10px]">
          ↗
        </span>
        <span className="absolute inset-0 flex items-center justify-center -translate-x-full translate-y-full transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 text-[10px]">
          ↗
        </span>
      </span>
    </MagneticLink>
  );
}

// Floating particles background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: accentColorMuted,
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

// Animated time display
function LiveTime() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      className="font-mono text-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {time}
    </motion.span>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // Measure footer height for the spacer
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
      // Large wordmark parallax
      if (wordmarkRef.current) {
        gsap.to(wordmarkRef.current, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        gsap.fromTo(
          wordmarkRef.current.querySelector(".wordmark-text"),
          { WebkitTextStrokeWidth: "1px", opacity: 0.03 },
          {
            WebkitTextStrokeWidth: "2px",
            opacity: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );
      }

      // CTA section animation
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 80%",
              end: "top 40%",
              scrub: 0.5,
            },
          }
        );
      }

      // Staggered content reveal
      if (contentRef.current) {
        const items = contentRef.current.querySelectorAll(".footer-reveal");
        items.forEach((item, index) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 70%",
                end: "top 30%",
                scrub: 0.3,
              },
            }
          );
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const navLinks = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { label: "Twitter", href: "https://twitter.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
  ];

  return (
    <>
      {/* Spacer div */}
      <div style={{ height: footerHeight }} />

      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0 bg-black overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <FloatingParticles />

        {/* Large wordmark background */}
        <div
          ref={wordmarkRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          <span
            className="wordmark-text text-[25vw] md:text-[20vw] lg:text-[18vw] font-black text-transparent tracking-[-0.04em] whitespace-nowrap select-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.03)",
            }}
          >
            EXECUTIVE
          </span>
        </div>

        {/* Main content */}
        <div className="relative">
          {/* Big CTA Section */}
          <div ref={ctaRef} className="pt-24 pb-16 px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto text-center">
              <motion.p
                className="text-xs uppercase tracking-[0.3em] mb-6"
                style={{ color: accentColorMuted }}
              >
                Ready to create something extraordinary?
              </motion.p>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] text-white mb-8">
                Let&apos;s{" "}
                <span
                  className="relative inline-block"
                  style={{ color: accentColor }}
                >
                  work
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-1 rounded-full"
                    style={{ backgroundColor: accentColor }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  />
                </span>{" "}
                together
              </h2>
              <MagneticLink
                href="mailto:hello@executive.ai"
                className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 hover:border-white/30 transition-all duration-300 hover:bg-white/5"
              >
                <span className="text-white/70 group-hover:text-white transition-colors">
                  hello@executive.ai
                </span>
                <span
                  className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <span className="relative w-4 h-4 overflow-hidden">
                    <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:translate-x-full group-hover:-translate-y-full">
                      ↗
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center -translate-x-full translate-y-full transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0">
                      ↗
                    </span>
                  </span>
                </span>
              </MagneticLink>
            </div>
          </div>

          {/* Divider with gradient */}
          <div className="mx-6 md:mx-12 lg:mx-20">
            <div
              className="h-px"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${accentColorMuted} 50%, transparent 100%)`,
                opacity: 0.3,
              }}
            />
          </div>

          {/* Links Section */}
          <div
            ref={contentRef}
            className="py-16 px-6 md:px-12 lg:px-20"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
                {/* Navigation */}
                <div className="footer-reveal">
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.25em] mb-5">
                    Navigate
                  </p>
                  <div className="flex flex-col gap-3">
                    {navLinks.map((link) => (
                      <AnimatedLink key={link.label} href={link.href}>
                        {link.label}
                      </AnimatedLink>
                    ))}
                  </div>
                </div>

                {/* Social */}
                <div className="footer-reveal">
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.25em] mb-5">
                    Connect
                  </p>
                  <div className="flex flex-col gap-3">
                    {socialLinks.map((link) => (
                      <AnimatedLink key={link.label} href={link.href} external>
                        {link.label}
                      </AnimatedLink>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="footer-reveal">
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.25em] mb-5">
                    Location
                  </p>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Available worldwide
                    <br />
                    <span className="text-white/20">Based in the cloud</span>
                  </p>
                </div>

                {/* Status */}
                <div className="footer-reveal">
                  <p className="text-white/20 text-[10px] uppercase tracking-[0.25em] mb-5">
                    Status
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#4ade80" }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span className="text-white/40 text-sm">
                      Available for projects
                    </span>
                  </div>
                  <div className="text-white/20">
                    <LiveTime />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="px-6 md:px-12 lg:px-20 pb-8">
            <div className="max-w-7xl mx-auto">
              <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-white/20 text-xs footer-reveal">
                  © {currentYear} Executive AI Solutions
                </p>
                <motion.p
                  className="text-white/20 text-xs flex items-center gap-3 footer-reveal"
                  whileHover={{ color: "rgba(255,255,255,0.4)" }}
                >
                  <span>Crafted with intent</span>
                  <span
                    className="inline-block w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: accentColorMuted,
                      boxShadow: `0 0 8px ${accentColorMuted}`,
                    }}
                  />
                  <span>Powered by ambition</span>
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </footer>
    </>
  );
}
