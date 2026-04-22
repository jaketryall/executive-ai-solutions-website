"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { TransitionLink } from "./PageTransition";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const darkText = "#1a1816";
const creamBg = "#e5e1db";

const SIGNATURE_PATH = "M60,160 C65,100 80,60 95,55 C115,48 110,100 108,130 C105,165 90,200 80,210 Q70,220 85,215 C110,205 135,160 155,155 C175,150 170,185 160,200 Q148,218 165,210 C185,200 195,175 210,165 Q230,152 225,180 C220,205 200,225 195,218 Q188,208 210,195 C225,186 250,175 270,200 Q275,208 265,208 C250,208 280,170 310,120 C325,95 340,75 350,70 Q365,64 358,90 C350,120 335,165 340,185 Q345,200 360,185 C375,168 385,145 400,155 Q408,160 400,178 C390,200 365,230 360,248 Q355,265 370,250 C390,228 410,195 430,188 Q445,182 442,200 C438,215 425,225 435,220 Q450,212 460,140 L462,210 Q465,130 475,128 L477,210 C485,205 520,188 560,182 Q600,176 620,190";

const socialLinks = [
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/jake-ryall" },
  { label: "DRIBBBLE", href: "https://dribbble.com/jake-ryall" },
  { label: "INSTAGRAM", href: "https://instagram.com/exec.ai.solutions" },
  { label: "GITHUB", href: "https://github.com/jaketryall" },
];

function formatLocalTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Los_Angeles",
  });
}

function formatLocalDate(date: Date): string {
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZone: "America/Los_Angeles",
    })
    .toUpperCase();
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const currentYear = new Date().getFullYear();

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // Live studio clock — ticks every second, formatted in the studio's own TZ.
  // Purely atmospheric: reinforces the "one person at a desk" feel.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Cursor-follow radial gradient on the email. We set CSS vars on the anchor
  // directly (no React state) so the gradient follows the cursor at 60fps
  // without re-rendering the tree.
  useEffect(() => {
    const el = emailRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    const onLeave = () => {
      // Park the "spotlight" off-canvas so the text settles into its faded
      // resting color instead of freezing where the cursor last was.
      el.style.setProperty("--mx", `-9999px`);
      el.style.setProperty("--my", `-9999px`);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    onLeave();
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const footer = footerRef.current!;

      // Liquid curve drops as the footer scrolls in — organic transition from
      // the dark Contact section above to the cream footer below.
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

      // Stagger-rise reveal for the meta strip + CTA + socials + nav.
      const elements = footer.querySelectorAll(".footer-reveal");
      if (elements.length) {
        gsap.set(elements, { y: 30, opacity: 0 });
        gsap.to(elements, {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: footer,
            start: "top 80%",
            end: "top 35%",
            scrub: 0.5,
          },
        });
      }

      // Email — each line rises into a mask. Scrub-linked so it unfolds with
      // the scroll rather than popping.
      const emailLines = footer.querySelectorAll(".footer-email-line");
      if (emailLines.length) {
        gsap.set(emailLines, { yPercent: 110 });
        gsap.to(emailLines, {
          yPercent: 0,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: footer,
            start: "top 75%",
            end: "top 35%",
            scrub: 0.6,
          },
        });
      }

      // Mobile signature draws on scroll (kept from previous design).
      const sig = footer.querySelector(".footer-signature-path") as SVGPathElement | null;
      if (sig) {
        const length = sig.getTotalLength();
        gsap.set(sig, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(sig, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footer,
            start: "top 90%",
            end: "top 30%",
            scrub: 1,
          },
        });
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

      {/* Liquid curve SVG — organic dark→cream transition */}
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

      {/* Subtle noise — breaks up the cream plane */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Top meta strip — studio metadata, reads like a magazine masthead */}
      <div
        className="footer-reveal relative z-10 px-6 md:px-12 lg:px-20 pt-14 md:pt-20"
      >
        <div
          className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 pb-3"
          style={{
            borderBottom: "1px solid rgba(26,24,22,0.1)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(26,24,22,0.5)",
          }}
        >
          <span>
            Executive AI Solutions ·{" "}
            <span style={{ color: "rgba(26,24,22,0.35)" }}>Vol. 1</span>
          </span>
          <span className="hidden md:inline" style={{ color: "rgba(26,24,22,0.3)" }}>
            ———
          </span>
          <span>Rocklin, CA · 38.7907°N · 121.2358°W</span>
          <span className="hidden md:inline" style={{ color: "rgba(26,24,22,0.3)" }}>
            ———
          </span>
          <span className="flex items-center gap-2 tabular-nums">
            <motion.span
              className="inline-block rounded-full"
              style={{
                width: 5,
                height: 5,
                backgroundColor: "rgba(16,185,129,0.9)",
              }}
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {now ? (
              <>
                Local {formatLocalTime(now)} · {formatLocalDate(now)}
              </>
            ) : (
              "Local —:— · ———"
            )}
          </span>
        </div>
      </div>

      {/* Main editorial block — massive email, cursor-lit gradient */}
      <div
        className="relative z-10 px-6 md:px-12 lg:px-20 pt-14 md:pt-24 pb-14 md:pb-20"
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Eyebrow */}
          <p
            className="footer-reveal"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.45)",
              marginBottom: "clamp(2rem, 4vh, 3rem)",
            }}
          >
            [ Let&apos;s work together ]
          </p>

          {/* The email — split across two lines, each masked so GSAP can rise
              it in. Cursor moves a radial gradient that reveals the dark text
              color locally — the rest of the email rests at a faded tone. */}
          <a
            ref={emailRef}
            href="mailto:jaker@executiveaisolutions.com"
            className="footer-email-link block group"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(2.75rem, 9vw, 9.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.045em",
              lineHeight: 0.92,
              color: darkText,
            }}
          >
            <span
              className="footer-email-mask block overflow-hidden"
              style={{ paddingBottom: "0.08em" }}
            >
              <span
                className="footer-email-line footer-email-spotlight inline-block will-change-transform"
                data-email-text
              >
                jaker@
              </span>
            </span>
            <span
              className="footer-email-mask block overflow-hidden"
              style={{ paddingBottom: "0.08em" }}
            >
              <span
                className="footer-email-line footer-email-spotlight inline-block will-change-transform break-all md:break-normal"
                data-email-text
              >
                executiveaisolutions.com
              </span>
            </span>
          </a>

          {/* Send-one CTA — sits under the email like a byline */}
          <div
            className="footer-reveal mt-8 md:mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <a
              href="mailto:jaker@executiveaisolutions.com"
              className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full transition-colors duration-300 hover:bg-[#1a1816] hover:text-[#e5e1db]"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                border: "1px solid rgba(26,24,22,0.2)",
                color: "#1a1816",
              }}
            >
              <span>Send one</span>
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                style={{ fontSize: "0.9rem", lineHeight: 1 }}
              >
                ↗
              </span>
            </a>
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(26,24,22,0.45)",
              }}
            >
              Typical response · under 4 hrs
            </span>
          </div>
        </div>
      </div>

      {/* Mobile signature — draws on scroll (kept) */}
      <div className="md:hidden relative z-10 flex justify-center pb-8 pointer-events-none">
        <svg
          viewBox="30 30 630 250"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          className="w-[75vw]"
          style={{ height: "auto", opacity: 0.15 }}
        >
          <path
            className="footer-signature-path"
            d={SIGNATURE_PATH}
            stroke={darkText}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Textual socials — big tracked-out names with hover underline draw */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-10 md:pb-14">
        <div
          className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-x-6 gap-y-3 md:gap-x-10"
          style={{
            paddingTop: "clamp(1rem, 3vh, 2rem)",
            borderTop: "1px solid rgba(26,24,22,0.1)",
          }}
        >
          <span
            className="footer-reveal"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.4)",
              marginRight: "1rem",
            }}
          >
            Elsewhere
          </span>
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-reveal group relative inline-block transition-colors duration-300"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.82rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(26,24,22,0.55)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = darkText;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(26,24,22,0.55)";
              }}
            >
              {social.label}
              <span
                className="absolute left-0 w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{
                  bottom: -3,
                  height: 1,
                  backgroundColor: darkText,
                }}
              />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom strip — nav + status + copyright */}
      <div
        className="relative z-10 px-6 md:px-12 lg:px-20 pb-8 md:pb-10"
      >
        <div
          className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6"
          style={{
            paddingTop: "clamp(0.75rem, 2vh, 1.5rem)",
            borderTop: "1px solid rgba(26,24,22,0.08)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.72rem",
            fontWeight: 500,
            color: "rgba(26,24,22,0.45)",
          }}
        >
          {/* Left — nav */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Work", href: "/work" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services/website-design" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="relative group transition-colors duration-300 hover:text-[#1a1816]"
              >
                {item.label}
                <span
                  className="absolute left-0 w-0 group-hover:w-full transition-all duration-400 ease-out"
                  style={{
                    bottom: -2,
                    height: 1,
                    backgroundColor: darkText,
                  }}
                />
              </TransitionLink>
            ))}
          </div>

          {/* Right — status + copyright */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-2">
              <motion.span
                className="inline-block rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "rgba(16,185,129,0.9)",
                }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              2 slots open · Q2 2026
            </span>
            <span style={{ color: "rgba(26,24,22,0.3)" }}>·</span>
            <span>© {currentYear} Executive AI Solutions</span>
          </div>
        </div>
      </div>

      {/* Cursor-lit spotlight on the email text. `background-clip: text`
          turns the gradient into per-pixel text color. --mx / --my are
          updated from JS on mousemove. When the cursor is off the link the
          vars are parked at -9999px so the text rests at the faded tone. */}
      <style>{`
        .footer-email-spotlight {
          --mx: -9999px;
          --my: -9999px;
          background: radial-gradient(
            circle at var(--mx) var(--my),
            #1a1816 0%,
            #1a1816 8%,
            rgba(26, 24, 22, 0.22) 38%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          transition: background 0.4s ease;
        }
        @media (max-width: 767px) {
          .footer-email-spotlight {
            /* On touch devices there's no cursor — show the text at full
               contrast instead of the faded resting state. */
            -webkit-text-fill-color: #1a1816;
            color: #1a1816;
            background: none;
          }
        }
      `}</style>
    </footer>
  );
}
