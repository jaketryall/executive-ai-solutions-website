"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Footer reveal with scale
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0.5, y: 50 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "top 70%",
              scrub: 1,
            },
          }
        );
      }

      // CTA section animation
      if (ctaRef.current) {
        const label = ctaRef.current.querySelector(".footer-label");
        const title = ctaRef.current.querySelector(".footer-title");
        const button = ctaRef.current.querySelector(".footer-button");

        if (label) {
          gsap.fromTo(
            label,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (title) {
          gsap.fromTo(
            title,
            { y: 60, opacity: 0, skewY: 3 },
            {
              y: 0,
              opacity: 1,
              skewY: 0,
              duration: 0.8,
              delay: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (button) {
          gsap.fromTo(
            button,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: 0.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ctaRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }

      // Links grid stagger animation
      if (linksRef.current) {
        const columns = linksRef.current.querySelectorAll(".footer-col");

        gsap.fromTo(
          columns,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: linksRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative py-24 bg-zinc-900 border-t border-white/10 overflow-hidden">
      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="text-[30vw] font-black text-transparent tracking-[-0.02em] select-none"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.03)",
          }}
        >
          EXEC
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Top section */}
        <div ref={ctaRef} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
          <div>
            <p className="footer-label text-white/40 text-sm uppercase tracking-[0.3em] mb-4">
              Ready to start?
            </p>
            <h3 className="footer-title text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9]">
              LET'S BUILD
              <br />
              <span className="text-[#00f0ff]">SOMETHING GREAT</span>
            </h3>
          </div>

          <div className="footer-button">
            <Link
              href="#contact"
              className="group relative inline-flex items-center gap-4 px-8 py-4 overflow-hidden rounded-full"
            >
              <span className="absolute inset-0 border border-white/30 group-hover:border-[#00f0ff] transition-colors rounded-full" />
              <motion.span
                className="absolute inset-0 bg-[#00f0ff] rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: "left" }}
              />
              <span className="relative z-10 text-white group-hover:text-black text-sm uppercase tracking-[0.2em] font-bold transition-colors">
                Get in Touch
              </span>
              <span className="relative z-10 text-white group-hover:text-black text-xl group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Links */}
        <div ref={linksRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="footer-col">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4">Navigation</p>
            <div className="flex flex-col gap-3">
              {["Work", "Services", "Contact"].map((link) => (
                <Link
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-white/60 hover:text-white transition-colors text-sm"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4">Social</p>
            <div className="flex flex-col gap-3">
              {["Twitter", "LinkedIn", "Dribbble", "Instagram"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-white/60 hover:text-white transition-colors text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4">Contact</p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@executive.ai"
                className="text-white/60 hover:text-[#00f0ff] transition-colors text-sm"
              >
                hello@executive.ai
              </a>
            </div>
          </div>

          <div className="footer-col">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4">Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <span className="text-white/60 text-sm">Available</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
          <p className="text-white/40 text-xs uppercase tracking-[0.2em]">
            © {currentYear} Executive AI Solutions
          </p>
          <p className="text-white/40 text-xs">
            Designed & Built with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
