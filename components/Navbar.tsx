"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./PageTransition";
import MagneticButton from "./ui/MagneticButton";
import HoverText from "./ui/HoverText";
import { ease } from "@/lib/motion";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function AvailabilityChip({ dark }: { dark: boolean }) {
  return (
    <div
      className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide press"
      style={{
        border: `1px solid ${dark ? "rgba(26,24,22,0.12)" : "rgba(229,225,219,0.16)"}`,
        color: dark ? "rgba(26,24,22,0.75)" : "rgba(229,225,219,0.85)",
        background: dark ? "rgba(255,255,255,0.35)" : "rgba(20,18,16,0.35)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span
        className="pulse-dot w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: "#19c37d", color: "#19c37d" }}
      />
      <span>Available · Q3 2026</span>
    </div>
  );
}

function NavCTA({ dark, onClick }: { dark: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <MagneticButton
      as="link"
      href="/contact"
      onClick={onClick}
      strength={12}
      childStrength={5}
    >
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative inline-flex items-center gap-2 h-10 pl-5 pr-2 rounded-full press focus-ring"
        style={{
          background: dark ? "var(--ink)" : "var(--paper)",
          color: dark ? "var(--paper)" : "var(--ink)",
        }}
      >
        <HoverText text="Start a project" trigger={hovered} className="text-[13px] font-medium tracking-tight" />
        <span
          className="relative w-7 h-7 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            background: dark ? "var(--paper)" : "var(--ink)",
            color: dark ? "var(--ink)" : "var(--paper)",
          }}
        >
          <motion.span
            animate={{ x: hovered ? 18 : 0, opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.35, ease: ease.expoOut }}
            className="absolute"
          >
            <Arrow />
          </motion.span>
          <motion.span
            animate={{ x: hovered ? 0 : -18, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35, ease: ease.expoOut }}
            className="absolute"
          >
            <Arrow />
          </motion.span>
        </span>
      </span>
    </MagneticButton>
  );
}

function Arrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function NavLink({
  href,
  label,
  active,
  dark,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  dark: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <TransitionLink
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative px-3 py-2 text-[13px] tracking-tight"
      style={{
        color: active || hovered
          ? dark ? "var(--ink)" : "var(--paper)"
          : dark ? "rgba(26,24,22,0.6)" : "rgba(229,225,219,0.7)",
        transition: "color 350ms var(--ease-expo-out)",
      }}
    >
      <HoverText text={label} trigger={hovered} />
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute left-3 right-3 -bottom-0.5 h-px"
          style={{ backgroundColor: dark ? "var(--ink)" : "var(--paper)" }}
          transition={{ duration: 0.45, ease: ease.expoOut }}
        />
      )}
    </TransitionLink>
  );
}

export default function Navbar({ lightHero = false }: { lightHero?: boolean }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setIsScrolled(v > 40));

  const darkSurface = lightHero && !isScrolled;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: ease.expoOut }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center pt-5"
      >
        <motion.nav
          animate={{
            background: isScrolled
              ? (darkSurface ? "rgba(243,241,238,0.72)" : "rgba(20,18,16,0.72)")
              : "rgba(0,0,0,0)",
            borderColor: isScrolled
              ? (darkSurface ? "rgba(26,24,22,0.08)" : "rgba(229,225,219,0.10)")
              : "rgba(0,0,0,0)",
            paddingInline: isScrolled ? "10px" : "18px",
          }}
          transition={{ duration: 0.5, ease: ease.expoOut }}
          style={{
            backdropFilter: isScrolled ? "blur(16px) saturate(1.1)" : "none",
            WebkitBackdropFilter: isScrolled ? "blur(16px) saturate(1.1)" : "none",
            border: "1px solid transparent",
          }}
          className="flex items-center gap-2 h-14 rounded-full"
        >
          <TransitionLink href="/" className="pl-3 pr-2 flex items-center gap-2 press group">
            <motion.span
              whileHover={{ rotate: -15 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-semibold tracking-tight"
              style={{
                background: darkSurface ? "var(--ink)" : "var(--paper)",
                color: darkSurface ? "var(--paper)" : "var(--ink)",
              }}
            >
              jr
            </motion.span>
            <span
              className="text-[13px] font-medium tracking-tight"
              style={{ color: darkSurface ? "var(--ink)" : "var(--paper)" }}
            >
              Jake Ryall
            </span>
          </TransitionLink>

          <span className="mx-1 h-5 w-px" style={{ backgroundColor: darkSurface ? "rgba(26,24,22,0.1)" : "rgba(229,225,219,0.12)" }} />

          <div className="flex items-center">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} active={isActive(l.href)} dark={darkSurface} />
            ))}
          </div>

          <span className="mx-1 h-5 w-px" style={{ backgroundColor: darkSurface ? "rgba(26,24,22,0.1)" : "rgba(229,225,219,0.12)" }} />

          <AvailabilityChip dark={darkSurface} />

          <NavCTA dark={darkSurface} />
        </motion.nav>
      </motion.header>

      {/* Mobile */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
      >
        <nav
          className="mx-3 mt-3 px-4 py-3 rounded-2xl flex items-center justify-between"
          style={{
            background: darkSurface ? "rgba(243,241,238,0.80)" : "rgba(20,18,16,0.80)",
            border: `1px solid ${darkSurface ? "rgba(26,24,22,0.08)" : "rgba(229,225,219,0.10)"}`,
            backdropFilter: "blur(16px) saturate(1.1)",
            WebkitBackdropFilter: "blur(16px) saturate(1.1)",
          }}
        >
          <TransitionLink href="/" className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-semibold"
              style={{
                background: darkSurface ? "var(--ink)" : "var(--paper)",
                color: darkSurface ? "var(--paper)" : "var(--ink)",
              }}
            >
              jr
            </span>
            <span
              className="text-[13px] font-medium"
              style={{ color: darkSurface ? "var(--ink)" : "var(--paper)" }}
            >
              Jake Ryall
            </span>
          </TransitionLink>

          <button onClick={() => setIsOpen((v) => !v)} className="p-2 -mr-2" aria-label="Toggle menu">
            <div className="w-6 h-4 relative flex flex-col justify-between">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="h-0.5 w-full rounded-full origin-center"
                style={{ backgroundColor: darkSurface ? "var(--ink)" : "var(--paper)" }}
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="h-0.5 w-full rounded-full"
                style={{ backgroundColor: darkSurface ? "var(--ink)" : "var(--paper)" }}
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="h-0.5 w-full rounded-full origin-center"
                style={{ backgroundColor: darkSurface ? "var(--ink)" : "var(--paper)" }}
              />
            </div>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "var(--ink)" }}
          >
            <div className="flex flex-col justify-center h-full px-8 gap-2 text-paper">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, ease: ease.expoOut, duration: 0.6 }}
                >
                  <TransitionLink
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-5xl font-semibold tracking-tight py-2"
                    style={{ color: isActive(l.href) ? "var(--paper)" : "rgba(229,225,219,0.55)" }}
                  >
                    {l.label}
                  </TransitionLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ease: ease.expoOut, duration: 0.6 }}
                className="mt-6 flex items-center gap-3"
              >
                <span
                  className="pulse-dot w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#19c37d", color: "#19c37d" }}
                />
                <span className="text-sm tracking-tight text-putty">Available · Q3 2026</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, ease: ease.expoOut, duration: 0.6 }}
                className="mt-8"
              >
                <NavCTA dark={false} onClick={() => setIsOpen(false)} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
