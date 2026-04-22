"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { TransitionLink } from "./PageTransition";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const darkText = "#1a1816";
const creamBg = "#e5e1db";

const navGroups: {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    heading: "Studio",
    links: [
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services/website-design" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jake-ryall", external: true },
      { label: "Dribbble", href: "https://dribbble.com/jake-ryall", external: true },
      { label: "GitHub", href: "https://github.com/jaketryall", external: true },
      { label: "Instagram", href: "https://instagram.com/exec.ai.solutions", external: true },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "jaker@executiveaisolutions.com", href: "mailto:jaker@executiveaisolutions.com", external: true },
      { label: "Rocklin, CA · PT", href: "#", external: false },
    ],
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const footer = footerRef.current!;

      // Liquid curve — kept from before, subtle organic transition from the
      // dark Contact section above.
      const curvePath = footer.querySelector(".footer-curve-path");
      if (curvePath) {
        gsap.fromTo(
          curvePath,
          { attr: { d: "M0,0 Q500,0 1000,0 L1000,100 L0,100 Z" } },
          {
            attr: { d: "M0,0 Q500,80 1000,0 L1000,100 L0,100 Z" },
            ease: "power2.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 100%",
              end: "top 55%",
              scrub: 0.8,
            },
          }
        );
      }

      // Apple-style restrained reveal — just a subtle rise-in, no stagger drama.
      const revealTargets = footer.querySelectorAll(".footer-reveal");
      if (revealTargets.length) {
        gsap.fromTo(
          revealTargets,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 0.9,
            stagger: 0.06,
            scrollTrigger: {
              trigger: footer,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="site-footer"
      className="relative mt-[-80px] md:mt-[-120px] pt-[80px] md:pt-[120px]"
      style={{ backgroundColor: "transparent", zIndex: 10 }}
      data-footer
    >
      {/* Cream bg — offset down so the curve area sits over the dark section */}
      <div
        className="absolute inset-0 top-[79px] md:top-[119px]"
        style={{ backgroundColor: creamBg }}
      />

      {/* Liquid curve — subtle organic transition */}
      <div
        className="absolute left-0 right-0 top-0 h-[80px] md:h-[120px] pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <path
            className="footer-curve-path"
            d="M0,0 Q500,0 1000,0 L1000,100 L0,100 Z"
            fill={creamBg}
          />
        </svg>
      </div>

      {/* ===== CTA BLOCK — Apple-style big clean hero ===== */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 pt-24 md:pt-36 pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-[880px]">
            <p
              className="footer-reveal"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(0.82rem, 0.95vw, 0.95rem)",
                fontWeight: 500,
                color: "rgba(26,24,22,0.45)",
                marginBottom: "clamp(1.5rem, 3vh, 2rem)",
                letterSpacing: "-0.005em",
              }}
            >
              Have a project in mind?
            </p>
            <h2
              className="footer-reveal"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(2.75rem, 7vw, 6rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
                color: darkText,
                marginBottom: "clamp(2rem, 4vh, 3rem)",
              }}
            >
              Let&apos;s build something
              <br />
              <span style={{ color: "rgba(26,24,22,0.45)" }}>people actually use.</span>
            </h2>

            <div className="footer-reveal flex flex-wrap items-center gap-4">
              <a
                href="mailto:jaker@executiveaisolutions.com"
                className="group inline-flex items-center gap-2.5 rounded-full transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(0.92rem, 1vw, 1rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                  padding: "0.9rem 1.75rem",
                  backgroundColor: darkText,
                  color: "#f3f1ee",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2a2620";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = darkText;
                }}
              >
                <span>Start a project</span>
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ fontSize: "1.05em", lineHeight: 1 }}
                >
                  →
                </motion.span>
              </a>
              <TransitionLink
                href="/work"
                className="group inline-flex items-center gap-2 rounded-full transition-colors duration-300 hover:bg-[rgba(26,24,22,0.06)]"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(0.92rem, 1vw, 1rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                  padding: "0.9rem 1.5rem",
                  color: darkText,
                }}
              >
                <span>See the work</span>
                <span
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  style={{ fontSize: "1em" }}
                >
                  ›
                </span>
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>

      {/* ===== NAV GRID — clean 3-col, Apple-spec hairlines ===== */}
      <div
        className="relative z-10 px-6 md:px-12 lg:px-20 py-12 md:py-16"
        style={{
          borderTop: "1px solid rgba(26,24,22,0.1)",
          borderBottom: "1px solid rgba(26,24,22,0.1)",
        }}
      >
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
          {navGroups.map((group) => (
            <div key={group.heading} className="footer-reveal">
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "rgba(26,24,22,0.45)",
                  letterSpacing: "-0.005em",
                  marginBottom: "1rem",
                }}
              >
                {group.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group inline-block transition-colors duration-300"
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "clamp(0.92rem, 1vw, 1rem)",
                          fontWeight: 500,
                          color: darkText,
                          letterSpacing: "-0.005em",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "rgba(26,24,22,0.55)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = darkText;
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <TransitionLink
                        href={link.href}
                        className="group inline-block text-[#1a1816] transition-colors duration-300 hover:text-[rgba(26,24,22,0.55)]"
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "clamp(0.92rem, 1vw, 1rem)",
                          fontWeight: 500,
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {link.label}
                      </TransitionLink>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ===== COPYRIGHT STRIP — minimal, Apple-scale type ===== */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 py-6 md:py-8">
        <div
          className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.78rem",
            fontWeight: 500,
            color: "rgba(26,24,22,0.5)",
            letterSpacing: "-0.005em",
          }}
        >
          <span>Copyright © {currentYear} Executive AI Solutions. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <motion.span
              className="inline-block rounded-full"
              style={{
                width: 6,
                height: 6,
                backgroundColor: "rgba(16,185,129,0.85)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            Available for Q2 · 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
