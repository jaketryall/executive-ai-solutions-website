"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import PillCTA from "./PillCTA";
import { ease } from "@/lib/motion";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function SlotLabel({ text }: { text: string }) {
  return (
    <span className="slot-link">
      <span className="slot-link-stack">
        <span className="slot-link-inner">{text}</span>
        <span className="slot-link-clone" aria-hidden>
          {text}
        </span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-70 transition-all duration-500 ${
          scrolled && !open
            ? "bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] backdrop-blur-md border-b border-(--line)"
            : "border-b border-transparent"
        }`}
        style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
      >
        <nav
          className={`flex items-center justify-between px-5 md:px-10 transition-[height] duration-500 ${
            scrolled ? "h-16" : "h-20"
          }`}
          style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
        >
          {/* Logo — ink chip (the mark is white) + wordmark */}
          <Link href="/" className="group flex items-center gap-2.5 focus-ring" aria-label="Executive AI Solutions — home">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-ink border border-(--line) overflow-hidden transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-105" style={{ transitionTimingFunction: "var(--ease-expo-out)" }}>
              <Image
                src="/Executive Ai Solutions Logo.svg"
                alt=""
                width={24}
                height={24}
                priority
              />
            </span>
            <span className={`text-[15px] font-semibold tracking-tight transition-colors duration-300 ${open ? "text-paper" : "text-(--fg)"}`}>
              <SlotLabel text="Executive AI" />
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="micro text-(--fg) focus-ring">
                  <SlotLabel text={l.label} />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex">
              <PillCTA label="Start a project" href="#contact" size="compact" />
            </span>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className={`lg:hidden relative z-70 flex flex-col items-center justify-center gap-[5px] w-11 h-11 rounded-full border press focus-ring transition-colors duration-300 ${
                open ? "border-paper/25" : "border-(--line)"
              }`}
            >
              <motion.span
                animate={{ rotate: open ? 45 : 0, y: open ? 3.25 : 0 }}
                transition={{ duration: 0.4, ease: ease.expoOut }}
                className={`block w-[18px] h-[1.5px] rounded-full transition-colors duration-300 ${open ? "bg-paper" : "bg-(--fg)"}`}
              />
              <motion.span
                animate={{ rotate: open ? -45 : 0, y: open ? -3.25 : 0 }}
                transition={{ duration: 0.4, ease: ease.expoOut }}
                className={`block w-[18px] h-[1.5px] rounded-full transition-colors duration-300 ${open ? "bg-paper" : "bg-(--fg)"}`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: ease.expoInOut }}
            className="fixed inset-0 z-60 bg-ink-deep text-paper flex flex-col px-5 pt-28 pb-10 lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <span key={l.label} className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "115%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "115%", transition: { duration: 0.3, delay: 0 } }}
                    transition={{
                      duration: 0.8,
                      delay: 0.25 + i * 0.07,
                      ease: ease.expoOut,
                    }}
                    className="block"
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block text-[13vw] leading-[1.02] font-extrabold uppercase tracking-[-0.04em]"
                    >
                      {l.label}
                    </a>
                  </motion.span>
                </span>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: ease.expoOut }}
              className="mt-auto flex items-end justify-between gap-4"
            >
              <div>
                <p className="micro text-paper/40">New projects</p>
                <p className="mt-2 flex items-center gap-2.5 text-sm text-paper/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
                  2 spots left for July
                </p>
              </div>
              <PillCTA label="Start a project" href="#contact" invert onClick={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
