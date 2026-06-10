"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MagneticButton from "./ui/MagneticButton";
import HoverText from "./ui/HoverText";
import { ease } from "@/lib/motion";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Probe line (y coordinate in viewport) used to detect which section sits
// under the nav. Roughly equals nav top padding + pill height.
const PROBE_Y = 80;

type SectionState = {
  bg: "paper" | "ink-deep";
  num: string;
  name: string;
};

const DEFAULT_SECTION: SectionState = {
  bg: "paper",
  num: "01",
  name: "HERO",
};

// ─── Live clock chip — D ─────────────────────────────────────────────────────
function formatPhoenixTime(): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Phoenix",
  }).format(new Date());
}

function AvailabilityChip({ dark }: { dark: boolean }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatPhoenixTime());
    const id = window.setInterval(() => setTime(formatPhoenixTime()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="hidden lg:inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs tracking-tight press"
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
      <span className="font-mono tabular-nums tracking-tight">
        {time ?? "--:--"}
      </span>
      <span
        aria-hidden
        style={{ opacity: 0.35 }}
      >
        MST
      </span>
      <span aria-hidden style={{ opacity: 0.35 }}>·</span>
      <span className="font-mono tracking-[0.14em] uppercase text-[10px]">
        2 slots Q3
      </span>
    </div>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function NavCTA({ dark, onClick }: { dark: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <MagneticButton as="link" href="/contact" onClick={onClick} strength={12} childStrength={5}>
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

// ─── NavLink — A (oxblood pill with shared layout morph) ─────────────────────
function NavLink({
  href,
  label,
  isCurrent,
  dark,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  href: string;
  label: string;
  isCurrent: boolean;
  dark: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => {
        setHovered(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onMouseLeave?.();
      }}
      className="relative inline-flex items-center px-4 py-2 rounded-full text-[13px] tracking-tight"
    >
      {isCurrent && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--oxblood)" }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
        />
      )}
      <motion.span
        className="relative z-10"
        animate={{
          color: isCurrent
            ? "var(--paper)"
            : dark
              ? "rgba(26,24,22,0.65)"
              : "rgba(229,225,219,0.72)",
        }}
        transition={{ duration: 0.3, ease: ease.expoOut }}
      >
        <HoverText text={label} trigger={hovered} />
      </motion.span>
    </Link>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
export default function Navbar({ lightHero = false }: { lightHero?: boolean }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showNow, setShowNow] = useState(false);

  // Current section under the nav — drives surface color + NOW label.
  const [section, setSection] = useState<SectionState>(() =>
    lightHero ? DEFAULT_SECTION : { bg: "ink-deep", num: "01", name: "" }
  );
  const sectionRef = useRef<SectionState>(section);

  // Track hovered route index separate from pathname so the pill can morph
  // to follow the cursor then return to the active route.
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    setIsScrolled(v > 40);
    setShowNow(v > 160);
  });

  // Scroll-driven section detection — the section whose top/bottom straddle
  // the probe line (80px from viewport top) is "current".
  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const nodes = document.querySelectorAll<HTMLElement>("[data-bg]");
      for (let i = 0; i < nodes.length; i++) {
        const rect = nodes[i].getBoundingClientRect();
        if (rect.top <= PROBE_Y && rect.bottom > PROBE_Y) {
          const bg = nodes[i].getAttribute("data-bg");
          if (bg !== "paper" && bg !== "ink-deep") return;
          const num = nodes[i].getAttribute("data-nav-num") ?? "";
          const name = nodes[i].getAttribute("data-nav-name") ?? "";
          const next: SectionState = { bg, num, name };
          const prev = sectionRef.current;
          if (prev.bg !== next.bg || prev.num !== next.num) {
            sectionRef.current = next;
            setSection(next);
          }
          return;
        }
      }
    };

    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Dark-aware surface: darkSurface=true means we're over a LIGHT section,
  // so nav paints with ink (preserving the existing prop semantics).
  const darkSurface = section.bg === "paper";

  // Active route index — used as the pill's default resting position.
  const activeIdx = NAV_LINKS.findIndex((l) =>
    l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)
  );
  const currentIdx = hoverIdx !== null ? hoverIdx : activeIdx;

  return (
    <>
      {/* Desktop */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: ease.expoOut }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex flex-col gap-2 pt-3 px-4 lg:px-8"
      >
        {/* NOW label — C */}
        <div className="h-4 overflow-visible self-center">
          <AnimatePresence mode="wait">
            {showNow && section.num && section.name && (
              <motion.div
                key={`${section.num}-${section.name}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: ease.expoOut }}
                className="font-mono uppercase select-none pointer-events-none"
                style={{
                  color: darkSurface
                    ? "rgba(26,24,22,0.55)"
                    : "rgba(229,225,219,0.6)",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                }}
              >
                <span style={{ color: "var(--oxblood)" }}>●</span>{" "}
                {section.num} · {section.name}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav pill */}
        <motion.nav
          animate={{
            background: isScrolled
              ? darkSurface
                ? "rgba(243,241,238,0.72)"
                : "rgba(20,18,16,0.72)"
              : "rgba(0,0,0,0)",
            borderColor: isScrolled
              ? darkSurface
                ? "rgba(26,24,22,0.08)"
                : "rgba(229,225,219,0.10)"
              : "rgba(0,0,0,0)",
            paddingInline: isScrolled ? "10px" : "18px",
          }}
          transition={{ duration: 0.5, ease: ease.expoOut }}
          style={{
            backdropFilter: isScrolled ? "blur(16px) saturate(1.1)" : "none",
            WebkitBackdropFilter: isScrolled ? "blur(16px) saturate(1.1)" : "none",
            border: "1px solid transparent",
          }}
          className="relative w-full flex items-center justify-between gap-2 h-14 rounded-full"
        >
          <Link href="/" className="pl-3 pr-2 flex items-center gap-2 press group">
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
            <motion.span
              animate={{
                color: darkSurface ? "var(--ink)" : "var(--paper)",
              }}
              transition={{ duration: 0.4, ease: ease.expoOut }}
              className="text-[12px] font-semibold tracking-[0.14em] uppercase"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              EAS
            </motion.span>
          </Link>

          {/* Links with oxblood pill — centered in the wide bar */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            {NAV_LINKS.map((l, i) => (
              <NavLink
                key={l.href}
                href={l.href}
                label={l.label}
                isCurrent={currentIdx === i}
                dark={darkSurface}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <AvailabilityChip dark={darkSurface} />
            <NavCTA dark={darkSurface} />
          </div>
        </motion.nav>
      </motion.header>

      {/* Mobile */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
      >
        <motion.nav
          animate={{
            background: darkSurface ? "rgba(243,241,238,0.80)" : "rgba(20,18,16,0.80)",
            borderColor: darkSurface ? "rgba(26,24,22,0.08)" : "rgba(229,225,219,0.10)",
          }}
          transition={{ duration: 0.4, ease: ease.expoOut }}
          className="mx-3 mt-3 px-4 py-3 rounded-2xl flex items-center justify-between"
          style={{
            border: "1px solid",
            backdropFilter: "blur(16px) saturate(1.1)",
            WebkitBackdropFilter: "blur(16px) saturate(1.1)",
          }}
        >
          <Link href="/" className="flex items-center gap-2">
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
              className="text-[12px] font-semibold tracking-[0.14em] uppercase"
              style={{
                color: darkSurface ? "var(--ink)" : "var(--paper)",
                fontFamily: "var(--font-geist-mono), monospace",
              }}
            >
              EAS
            </span>
          </Link>

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
        </motion.nav>
      </motion.header>

      {/* Mobile overlay */}
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
                  <Link
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-5xl font-semibold tracking-tight py-2"
                    style={{
                      color:
                        activeIdx === i
                          ? "var(--paper)"
                          : "rgba(229,225,219,0.55)",
                    }}
                  >
                    {l.label}
                  </Link>
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
                <span className="text-sm tracking-tight text-putty">Available Q3 · 2 slots</span>
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
