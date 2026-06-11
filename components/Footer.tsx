"use client";

// Footer — the sign-off. The conversion work is done by the closer and the
// contact form above; this is orientation (sitemap, contact) and one last
// brand moment: the giant cropped wordmark rising at the page's end.

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const SITE_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
  { label: "FAQ", href: "/faq" },
];

function SlotLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="micro text-(--fg) focus-ring"
    >
      <span className="slot-link">
        <span className="slot-link-stack">
          <span className="slot-link-inner">{label}</span>
          <span className="slot-link-clone" aria-hidden>
            {label}
          </span>
        </span>
      </span>
    </a>
  );
}

export default function Footer({ contactEmail }: { contactEmail?: string }) {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The wordmark rises out of the page edge as you arrive at the end.
        gsap.fromTo(
          "[data-footer-mark]",
          { yPercent: 76 },
          {
            yPercent: 34,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="zone-dark relative z-40 -mt-8 rounded-t-[40px] bg-ink-deep px-5 md:px-10 pt-16 md:pt-20 pb-0 text-(--fg) overflow-hidden"
    >
      <div className="grid gap-12 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-5">
          <Link href="/" className="group inline-flex items-center gap-2.5 focus-ring" aria-label="Executive AI Solutions — home">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-full bg-ink border border-(--line) overflow-hidden transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-105"
              style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
            >
              <Image src="/Executive Ai Solutions Logo.svg" alt="" width={26} height={26} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Executive AI Solutions
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-(--fg-muted)">
            Premium websites that book clients — designed, built and automated
            by one person. Arizona to anywhere.
          </p>
          <p className="mt-6 inline-flex items-center gap-2.5 text-sm text-(--fg-muted)">
            <span className="w-1.5 h-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" aria-hidden />
            2 spots left for July
          </p>
        </div>

        {/* Sitemap */}
        <nav className="md:col-span-3" aria-label="Site">
          <p className="micro text-(--fg-faint)">Site</p>
          <ul className="mt-5 space-y-3.5">
            {SITE_LINKS.map((l) => (
              <li key={l.label}>
                <SlotLink href={l.href} label={l.label} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Reach out */}
        <div className="md:col-span-4">
          <p className="micro text-(--fg-faint)">Get in touch</p>
          <ul className="mt-5 space-y-3.5">
            {contactEmail && (
              <li>
                <SlotLink href={`mailto:${contactEmail}`} label={contactEmail} />
              </li>
            )}
            <li>
              <SlotLink href="/#contact" label="Start a project →" />
            </li>
          </ul>
          {/* TODO(owner): social links (Instagram / LinkedIn / X) when ready */}
        </div>
      </div>

      {/* Legal row */}
      <div className="mt-16 pt-6 border-t border-(--line) flex flex-wrap items-center justify-between gap-4">
        <p className="micro text-(--fg-faint)">
          © 2026 Executive AI Solutions — designed &amp; built in-house, obviously
        </p>
        <a href="#top" className="micro text-(--fg) focus-ring">
          <span className="slot-link">
            <span className="slot-link-stack">
              <span className="slot-link-inner">Back to top ↑</span>
              <span className="slot-link-clone" aria-hidden>
                Back to top ↑
              </span>
            </span>
          </span>
        </a>
      </div>

      {/* The sign-off — giant wordmark cropped by the page edge */}
      <div aria-hidden className="relative mt-8 h-[13vw] md:h-[11vw] select-none">
        <p
          data-footer-mark
          className="absolute inset-x-0 bottom-0 text-center whitespace-nowrap font-extrabold uppercase tracking-[-0.04em] leading-none text-[14vw] text-paper"
        >
          Executive AI
        </p>
      </div>
    </footer>
  );
}
