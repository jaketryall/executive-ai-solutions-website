"use client";

import { useState } from "react";
import Link from "next/link";

const SITEMAP = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jake-ryall" },
  { label: "GitHub", href: "https://github.com/jaketryall" },
  { label: "Dribbble", href: "https://dribbble.com/jake-ryall" },
  { label: "Email", href: "mailto:hello@executiveai.solutions" },
];

export default function Footer() {
  const [markHovered, setMarkHovered] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      className="relative px-6 pt-24 pb-10 overflow-hidden"
      style={{ backgroundColor: "var(--ink-soft)", color: "var(--putty)" }}
    >
      {/* Giant watermark — cranked to ~14% so it reads as intentional
          typography, not a faint ghost. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[-8vw] flex items-end justify-center opacity-[0.14] select-none">
        <span
          className="font-display font-semibold leading-none"
          style={{
            fontSize: "clamp(8rem, 28vw, 28rem)",
            letterSpacing: "-0.055em",
            color: "var(--paper)",
          }}
        >
          EAS
        </span>
      </div>

      <div className="relative max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Col 1 — mark */}
          <div className="col-span-2 md:col-span-1">
            <button
              type="button"
              onMouseEnter={() => setMarkHovered(true)}
              onMouseLeave={() => setMarkHovered(false)}
              className="inline-flex items-center gap-3 press"
              style={{ background: "transparent", border: 0, padding: 0 }}
              aria-label="Executive AI Solutions"
            >
              <span
                className="rounded-full flex items-center justify-center font-semibold"
                style={{
                  width: 40, height: 40,
                  backgroundColor: markHovered ? "var(--paper)" : "rgba(229,225,219,0.12)",
                  color: markHovered ? "var(--ink)" : "var(--paper)",
                  transition: "background-color 0.4s var(--ease-soft), color 0.4s var(--ease-soft)",
                  fontSize: "0.8rem",
                  letterSpacing: "-0.02em",
                }}
              >
                jr
              </span>
              <span className="text-sm font-medium tracking-tight" style={{ color: "var(--paper)" }}>
                Executive AI Solutions
              </span>
            </button>
            <p className="text-[13px] mt-4 max-w-[240px]" style={{ color: "rgba(229,225,219,0.5)" }}>
              A two-person studio. We ship software, not slides.
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] mb-4" style={{ color: "rgba(229,225,219,0.4)" }}>
              Sitemap
            </p>
            <ul className="space-y-2">
              {SITEMAP.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm link-hover"
                    style={{ color: "rgba(229,225,219,0.8)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] mb-4" style={{ color: "rgba(229,225,219,0.4)" }}>
              Elsewhere
            </p>
            <ul className="space-y-2">
              {SOCIALS.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm link-hover"
                    style={{ color: "rgba(229,225,219,0.8)" }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] mb-4" style={{ color: "rgba(229,225,219,0.4)" }}>
              Studio
            </p>
            <p className="text-[13px]" style={{ color: "rgba(229,225,219,0.5)" }}>
              Rocklin, California · working worldwide
            </p>
            <p className="text-[13px] mt-2" style={{ color: "rgba(229,225,219,0.5)" }}>
              Two projects per quarter. Fixed-price proposals in 48h.
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(229,225,219,0.08)" }}
        >
          <p className="text-[12px]" style={{ color: "rgba(229,225,219,0.4)" }}>
            © {year} Executive AI Solutions LLC · Built by Jake Ryall
          </p>
          <a
            href="mailto:hello@executiveai.solutions"
            className="text-[13px] link-hover"
            style={{ color: "var(--paper)" }}
          >
            hello@executiveai.solutions
          </a>
        </div>
      </div>
    </footer>
  );
}
