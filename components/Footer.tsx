"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { TransitionLink } from "./PageTransition";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Social icons as simple SVG components
function DribbbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.82zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jake-ryall", icon: LinkedInIcon },
  { label: "Dribbble", href: "https://dribbble.com/jake-ryall", icon: DribbbleIcon },
  { label: "Instagram", href: "https://instagram.com/exec.ai.solutions", icon: InstagramIcon },
  { label: "GitHub", href: "https://github.com/jaketryall", icon: GitHubIcon },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // GSAP scroll-triggered animations
  useIsomorphicLayoutEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const footer = footerRef.current!;

      // Liquid curve — the SVG curve control point drops on scroll
      const curvePath = footer.querySelector(".footer-curve-path");
      if (curvePath) {
        gsap.fromTo(
          curvePath,
          { attr: { d: "M0,0 Q500,0 1000,0 L1000,100 L0,100 Z" } },
          {
            attr: { d: "M0,0 Q500,120 1000,0 L1000,100 L0,100 Z" },
            ease: "power2.out",
            scrollTrigger: {
              trigger: footer,
              start: "top 100%",
              end: "top 50%",
              scrub: 0.8,
            },
          }
        );
      }

      // Elements slide up
      const elements = footer.querySelectorAll(".footer-reveal");
      if (elements.length) {
        gsap.set(elements, { y: 25 });
        gsap.to(elements, {
          y: 0,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: footer,
            start: "top 75%",
            end: "top 30%",
            scrub: 0.5,
          },
        });
      }

      // Email underline draws in
      const underline = footer.querySelector(".footer-underline");
      if (underline) {
        gsap.fromTo(
          underline,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: footer,
              start: "top 55%",
              end: "top 15%",
              scrub: 0.5,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const creamBg = "#e5e1db";
  const darkText = "#1a1816";

  return (
      <footer
        ref={footerRef}
        id="site-footer"
        className="relative"
        style={{ backgroundColor: creamBg, zIndex: 10 }}
        data-footer
      >
        {/* Liquid curve SVG — extends up into the section above */}
        <div className="absolute left-0 right-0 -top-[80px] md:-top-[120px] h-[80px] md:h-[120px] pointer-events-none" style={{ zIndex: 10 }}>
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

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Main content */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-12 md:pb-16">
          <div className="max-w-6xl mx-auto">

            {/* Top section - Big CTA */}
            <div className="mb-16 md:mb-24">
              <p
                className="footer-reveal text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: "rgba(26, 24, 22, 0.4)" }}
              >
                Let&apos;s work together
              </p>

              <a
                href="mailto:jaker@executiveaisolutions.com"
                className="footer-reveal group inline-block"
              >
                <span
                  className="text-2xl md:text-5xl lg:text-6xl font-black tracking-[-0.03em] transition-colors duration-300 break-all md:break-normal"
                  style={{ color: darkText }}
                >
                  jaker@executiveaisolutions.com
                </span>
                <div
                  className="footer-underline h-[2px] mt-2"
                  style={{ backgroundColor: darkText }}
                />
              </a>
            </div>

            {/* Social links */}
            <div className="flex gap-4 mb-12">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-reveal w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ color: "rgba(26,24,22,0.35)" }}
                  aria-label={social.label}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = darkText;
                    e.currentTarget.style.backgroundColor = "rgba(26,24,22,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(26,24,22,0.35)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <social.icon />
                </a>
              ))}
            </div>

            {/* Bottom section - Links and info */}
            <div className="footer-bottom flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-8" style={{ borderTop: "1px solid rgba(26,24,22,0.08)" }}>

              {/* Left - Navigation */}
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {[
                  { label: "Work", href: "/work" },
                  { label: "About", href: "/about" },
                  { label: "Services", href: "/services/website-design" },
                  { label: "Contact", href: "/contact" },
                ].map((item) => (
                  <TransitionLink
                    key={item.href}
                    href={item.href}
                    className="transition-colors duration-300 text-sm"
                    style={{ color: "rgba(26,24,22,0.4)" }}
                  >
                    {item.label}
                  </TransitionLink>
                ))}
              </div>

              {/* Right - Copyright and status */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <motion.span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#16a34a" }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm" style={{ color: "rgba(26,24,22,0.4)" }}>Available for projects</span>
                </div>
                <p className="text-sm" style={{ color: "rgba(26,24,22,0.3)" }}>
                  © {currentYear} Executive AI Solutions
                </p>
              </div>
            </div>

          </div>
        </div>
      </footer>
  );
}
