"use client";

import { useState } from "react";
import { TransitionLink } from "@/components/PageTransition";

const SITEMAP = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services/website-design" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jake-ryall" },
  { label: "Dribbble", href: "https://dribbble.com/jake-ryall" },
  { label: "GitHub", href: "https://github.com/jaketryall" },
  { label: "Instagram", href: "https://instagram.com/exec.ai.solutions" },
  { label: "Email", href: "mailto:jaker@executiveaisolutions.com" },
];

// Humanizing tidbits — Jake updates these manually as projects ship.
const STATUS =
  "Last shipped: Apr 2026 · Currently building: Internal CMS for a Phoenix studio";

export default function Footer() {
  const [markHovered, setMarkHovered] = useState(false);

  return (
    <footer
      className="px-6 pt-20 pb-8"
      style={{ backgroundColor: "#0a0908", color: "#e5e1db" }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {/* Col 1 — mark + name */}
          <div>
            <button
              type="button"
              onMouseEnter={() => setMarkHovered(true)}
              onMouseLeave={() => setMarkHovered(false)}
              className="inline-flex items-center gap-3"
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                cursor: "pointer",
              }}
              aria-label="Jake Ryall mark"
            >
              <div
                className="rounded-lg flex items-center justify-center font-black transition-colors duration-300"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: markHovered
                    ? "#78736c"
                    : "rgba(229,225,219,0.1)",
                  color: markHovered ? "#0a0908" : "#e5e1db",
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.95rem",
                  letterSpacing: "-0.04em",
                  transition:
                    "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                JR
              </div>
              <span
                className="text-sm font-semibold tracking-tight"
                style={{ color: "#e5e1db" }}
              >
                Jake Ryall
              </span>
            </button>
            <p
              className="text-xs mt-4"
              style={{ color: "rgba(229,225,219,0.4)" }}
            >
              Designer &amp; Developer · Rocklin, CA
            </p>
          </div>

          {/* Col 2 — Sitemap */}
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.28em] mb-4"
              style={{ color: "rgba(229,225,219,0.4)" }}
            >
              Sitemap
            </p>
            <ul className="space-y-2">
              {SITEMAP.map((l) => (
                <li key={l.href}>
                  <TransitionLink
                    href={l.href}
                    className="group inline-flex items-center gap-1 text-sm"
                    style={{ color: "rgba(229,225,219,0.75)" }}
                  >
                    <span className="relative">
                      {l.label}
                      <span className="absolute left-0 -bottom-0.5 h-px bg-current w-0 group-hover:w-full transition-all duration-300" />
                    </span>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Socials */}
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.28em] mb-4"
              style={{ color: "rgba(229,225,219,0.4)" }}
            >
              Socials
            </p>
            <ul className="space-y-2">
              {SOCIALS.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      s.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group inline-flex items-center gap-1 text-sm"
                    style={{ color: "rgba(229,225,219,0.75)" }}
                  >
                    <span className="relative">
                      {s.label}
                      <span className="absolute left-0 -bottom-0.5 h-px bg-current w-0 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Marquee strip */}
        <div
          className="overflow-hidden"
          style={{
            borderTop: "1px solid rgba(229,225,219,0.08)",
            borderBottom: "1px solid rgba(229,225,219,0.08)",
          }}
        >
          <div
            className="flex whitespace-nowrap py-3"
            style={{
              animation: "footer-marquee 60s linear infinite",
              width: "max-content",
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="px-6 text-xs uppercase tracking-[0.28em]"
                style={{ color: "rgba(229,225,219,0.4)" }}
              >
                Jake Ryall · Available Q3 2026 · Rocklin, CA ·
              </span>
            ))}
          </div>
        </div>

        {/* Humanizing row */}
        <p
          className="text-xs mt-6"
          style={{ color: "rgba(229,225,219,0.4)" }}
        >
          {STATUS}
        </p>

        {/* Copyright */}
        <p
          className="text-[11px] mt-2"
          style={{ color: "rgba(229,225,219,0.25)" }}
        >
          © {new Date().getFullYear()} Executive AI Solutions · Built in Next.js
        </p>
      </div>

      <style jsx>{`
        @keyframes footer-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </footer>
  );
}
