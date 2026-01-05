"use client";

import Link from "next/link";
import { useRef, useEffect, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "./SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Cinematic warm color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksLeftRef = useRef<HTMLDivElement>(null);
  const linksRightRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);
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
      // ===== LARGE WORDMARK - Parallax slower than scroll =====
      if (wordmarkRef.current) {
        // Parallax effect - moves slower than scroll
        gsap.to(wordmarkRef.current, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        // Stroke width animation on scroll
        gsap.fromTo(
          wordmarkRef.current.querySelector(".wordmark-text"),
          {
            WebkitTextStrokeWidth: "1px",
          },
          {
            WebkitTextStrokeWidth: "2px",
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

      // ===== CENTER-EXPANDING LINE =====
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "center center" },
          {
            scaleX: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "top 50%",
              scrub: 0.4,
            },
          }
        );
      }

      // ===== LINKS CASCADE FROM CENTER =====
      if (linksLeftRef.current) {
        const leftLinks = linksLeftRef.current.querySelectorAll(".footer-link");
        leftLinks.forEach((link, index) => {
          gsap.fromTo(
            link,
            { opacity: 0, x: 20 },
            {
              opacity: 1,
              x: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 80%",
                end: "top 40%",
                scrub: 0.3,
              },
            }
          );
        });
      }

      if (linksRightRef.current) {
        const rightLinks = linksRightRef.current.querySelectorAll(".footer-link");
        rightLinks.forEach((link, index) => {
          gsap.fromTo(
            link,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 80%",
                end: "top 40%",
                scrub: 0.3,
              },
            }
          );
        });
      }

      // ===== COPYRIGHT - Final frame =====
      if (copyrightRef.current) {
        gsap.fromTo(
          copyrightRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 60%",
              end: "top 30%",
              scrub: 0.3,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Spacer div - takes up space so content above can scroll over the fixed footer */}
      <div style={{ height: footerHeight }} />

      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0 py-24 bg-black overflow-hidden"
        style={{ zIndex: 0 }}
      >
      {/* Large wordmark background */}
      <div
        ref={wordmarkRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      >
        <span
          className="wordmark-text text-[20vw] md:text-[18vw] lg:text-[15vw] font-black text-transparent tracking-[-0.04em] whitespace-nowrap select-none"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.08)",
          }}
        >
          EXECUTIVE
        </span>
      </div>

      <div ref={contentRef} className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Top section with branding */}
        <div className="text-center mb-20">
          <Link
            href="/"
            className="inline-block text-white text-2xl font-bold tracking-tight transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
          >
            <SplitText animation="chars" stagger={0.05} delay={0.2}>
              EXECUTIVE
            </SplitText>
          </Link>
          <p className="text-white/30 text-sm mt-4 max-w-md mx-auto">
            <SplitText animation="words" stagger={0.06} delay={0.5}>
              Building digital experiences for ambitious brands.
            </SplitText>
          </p>
        </div>

        {/* Center-expanding line */}
        <div
          ref={lineRef}
          className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-16"
        />

        {/* Links grid - cascades from center */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* Left - Navigation */}
          <div ref={linksLeftRef} className="text-center md:text-left">
            <p className="text-white/20 text-xs uppercase tracking-[0.2em] mb-6">Navigation</p>
            <div className="flex flex-col gap-3">
              {["Work", "Services", "Contact"].map((link, index) => (
                <Link
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="footer-link text-white/40 hover:text-white transition-colors text-sm inline-block"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Center - Social */}
          <div className="text-center">
            <p className="text-white/20 text-xs uppercase tracking-[0.2em] mb-6">Social</p>
            <div className="flex flex-col gap-3">
              {["Twitter", "LinkedIn", "Dribbble"].map((link, index) => (
                <a
                  key={link}
                  href="#"
                  className="footer-link text-white/40 hover:text-white transition-colors text-sm inline-block"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Right - Contact */}
          <div ref={linksRightRef} className="text-center md:text-right">
            <p className="text-white/20 text-xs uppercase tracking-[0.2em] mb-6">Contact</p>
            <a
              href="mailto:hello@executive.ai"
              className="footer-link text-white/40 transition-colors text-sm inline-block"
              onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              hello@executive.ai
            </a>
          </div>
        </div>

        {/* Bottom bar - Copyright as final frame */}
        <div
          ref={copyrightRef}
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-white/20 text-xs">
            © {currentYear} Executive AI Solutions
          </p>
          <p className="text-white/20 text-xs flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: accentColorMuted,
                boxShadow: `0 0 8px ${accentColorMuted}`,
              }}
            />
            Built with precision
          </p>
        </div>
      </div>

      {/* Subtle vignette overlay for cinematic feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </footer>
    </>
  );
}
