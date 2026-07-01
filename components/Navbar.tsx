"use client";

// The Command Dock — a floating, seam-aware bar that UNROLLS into a section.
//
// Collapsed: two stacked copies of the bar (a LIGHT interactive one and an
// inert DARK twin) let gsap.ticker clip the dark twin to exactly the slice
// sitting over a `.zone-dark` section — the colours split on the seam line.
//
// Hover Work / Services and the whole surface goes ink-deep and the bar
// grows downward (a grid-rows 0fr→1fr morph) into an immersive panel: a
// live index on the left, a playing preview on the right, availability +
// CTA pinned in the footer. Move off and it rolls back up into the bar.
// About / Contact stay plain links. On touch the full-screen menu carries
// the same contextual sub-lists.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PillCTA from "./PillCTA";
import HoverText from "./HoverText";
import { ease } from "@/lib/motion";

type Tab = "work" | "services";

const LINKS: { label: string; href: string; tab?: Tab }[] = [
  { label: "Work", href: "#work", tab: "work" },
  { label: "Services", href: "#services", tab: "services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const WORKS = [
  { title: "Riled Up Pickleball", category: "Web app · Bookings", video: "/final-comp.mp4" },
  { title: "Desert Wings", category: "Flight school · Web", video: "/final-comp.mp4" },
  { title: "Wings N Wheels", category: "Detailing · Web", video: "/final-comp.mp4" },
  { title: "AZ Gyro Tours", category: "Tourism · Web", video: "/final-comp.mp4" },
];

const SERVICES = [
  {
    name: "Websites",
    line: "Sites that sell the second they load.",
    image: "/Celestial Laptop Mockup.webp",
  },
  {
    name: "Motion & brand",
    line: "Interactions that make you feel expensive.",
    image: "/Elegant Black Laptop Mockup.webp",
  },
  {
    name: "AI & automation",
    line: "A site that works while you sleep.",
    image: "/custom-dashboard-mockup.webp",
  },
];

// Controlled slot-reveal label — current line lifts out, an oxblood clone
// arrives from below. State-driven so both stacked copies of the bar animate
// in lockstep across the seam.
function NavLabel({ text, active, dark }: { text: string; active: boolean; dark: boolean }) {
  return (
    <span className="relative inline-block overflow-hidden leading-[1.3] [font-kerning:none]">
      <span className="invisible">{text}</span>
      <motion.span
        className="absolute inset-0"
        animate={{ y: active ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: ease.expoOut }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0"
        style={{ color: dark ? "#c9606a" : "var(--color-oxblood)" }}
        initial={false}
        animate={{ y: active ? "0%" : "120%" }}
        transition={{ duration: 0.5, ease: ease.expoOut }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [logoHover, setLogoHover] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const [tab, setTab] = useState<Tab | null>(null);
  // `displayTab` lags `tab` through the close so the panel stays painted
  // while the tray rolls up; `collapsed` is true only once it's fully shut.
  const [displayTab, setDisplayTab] = useState<Tab | null>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [activeWork, setActiveWork] = useState(0);
  const [activeService, setActiveService] = useState(0);

  const open = tab !== null;
  // Rolling up: fade the dark surface (bar twin + tray) out together so it
  // dissolves up instead of snapping off at the end.
  const closing = !open && !collapsed;

  const barRef = useRef<HTMLDivElement>(null);
  const darkLayerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuOpenRef = useRef(false);
  const collapsedRef = useRef(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const anchor = (href: string) => (pathname === "/" ? href : `/${href}`);

  useEffect(() => {
    collapsedRef.current = collapsed;
  }, [collapsed]);

  // Roll-up close: the skin + content stay painted through the morph and are
  // torn down by the grid's onTransitionEnd. This timer is only a safety net
  // in case that event never fires (kept longer than the close duration).
  useEffect(() => {
    if (tab === null && !collapsed) {
      const t = setTimeout(() => {
        setCollapsed(true);
        setDisplayTab(null);
      }, 520);
      return () => clearTimeout(t);
    }
  }, [tab, collapsed]);

  // Lock the page behind the full-screen menu.
  useEffect(() => {
    menuOpenRef.current = menuOpen;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Open the full-screen menu when the hero's MENU button asks (decoupled via
  // a window event). The dock's reveal-on-scroll is handled in the ticker
  // frame below (off raw scrollY, since the hero's pin spacing makes a
  // ScrollTrigger progress unreliable here).
  useEffect(() => {
    const onOpen = () => setMenuOpen(true);
    window.addEventListener("eas-open-menu", onOpen);
    return () => window.removeEventListener("eas-open-menu", onOpen);
  }, []);

  // Seam clip — runs on gsap.ticker so it's locked to ScrollSmoother. While
  // the tray (or menu) is open the bar reads fully dark to match the panel.
  //
  // Perf: the bar is fixed and the .zone-dark sections only move with scroll,
  // so we MEASURE once (and on every ScrollTrigger refresh — Services toggles
  // .zone-dark per card and pinned sections shift layout) and cache offsets in
  // document space. Each frame is then pure arithmetic against window.scrollY
  // (a cheap read that doesn't force layout) plus a single clipPath write — no
  // per-frame getBoundingClientRect, which was the page's dominant reflow.
  useEffect(() => {
    const darkEl = darkLayerRef.current;
    if (darkEl) (darkEl as HTMLElement & { inert: boolean }).inert = true;

    let barTop = 0;
    let barH = 56;
    let zones: { top: number; bottom: number }[] = [];
    let lastSy = -1;
    let lastState = -1;

    const measure = () => {
      const bar = barRef.current;
      if (bar) {
        const r = bar.getBoundingClientRect();
        barTop = r.top;
        barH = r.height;
      }
      const sy = window.scrollY;
      zones = Array.from(document.querySelectorAll<HTMLElement>(".zone-dark")).map((z) => {
        const zr = z.getBoundingClientRect();
        return { top: zr.top + sy, bottom: zr.bottom + sy };
      });
      lastSy = -1; // force a recompute on the next frame
    };

    const frame = () => {
      const dl = darkLayerRef.current;
      if (!dl) return;

      const sy = window.scrollY;
      const state = (menuOpenRef.current ? 1 : 0) | (collapsedRef.current ? 2 : 0);
      if (sy === lastSy && state === lastState) return; // idle: nothing to do
      lastSy = sy;
      lastState = state;

      // No nav until scroll: the dock is hidden + click-through over the hero
      // and fades in as the reel forms (~400→620px of scroll).
      const wrap = wrapRef.current;
      if (wrap) {
        const navF = sy <= 400 ? 0 : sy >= 620 ? 1 : (sy - 400) / 220;
        wrap.style.setProperty("--nav-fill", navF.toFixed(3));
        wrap.style.pointerEvents = navF < 0.05 ? "none" : "auto";
      }

      if (menuOpenRef.current || !collapsedRef.current) {
        dl.style.clipPath = "inset(0 0 0 0)";
        return;
      }

      const rTop = barTop;
      const H = barH;
      const rBot = barTop + H;

      const darkAt = (y: number) => {
        for (const z of zones) {
          if (y >= z.top - sy && y < z.bottom - sy) return true;
        }
        return false;
      };

      const dTop = darkAt(rTop + 2);
      const dBot = darkAt(rBot - 2);

      let clip: string;
      if (dTop && dBot) {
        clip = "inset(0 0 0 0)";
      } else if (!dTop && !dBot) {
        clip = "inset(0 0 100% 0)";
      } else {
        let seamY: number | null = null;
        for (const z of zones) {
          const zt = z.top - sy;
          const zb = z.bottom - sy;
          if (zt >= rTop - 1 && zt <= rBot + 1) {
            seamY = zt;
            break;
          }
          if (zb >= rTop - 1 && zb <= rBot + 1) {
            seamY = zb;
            break;
          }
        }
        if (seamY === null) {
          clip = dBot ? "inset(0 0 0 0)" : "inset(0 0 100% 0)";
        } else {
          const rel = Math.max(0, Math.min(H, seamY - rTop));
          clip =
            dTop && !dBot
              ? `inset(0 0 ${(H - rel).toFixed(1)}px 0)`
              : `inset(${rel.toFixed(1)}px 0 0 0)`;
        }
      }
      dl.style.clipPath = clip;
    };

    measure();
    const raf = requestAnimationFrame(measure); // re-measure once layout settles
    ScrollTrigger.addEventListener("refresh", measure);
    gsap.ticker.add(frame);
    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.removeEventListener("refresh", measure);
      gsap.ticker.remove(frame);
    };
  }, []);

  const openTab = (which: Tab) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCollapsed(false);
    setDisplayTab(which);
    setTab(which);
    if (which === "work") setActiveWork(0);
    if (which === "services") setActiveService(0);
  };
  const closeTab = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setTab(null), 90);
  };

  // One bar row, rendered twice — `dark` flips colour; when open the dark
  // twin goes opaque + square-bottomed so it merges with the tray below.
  const renderBar = (tone: "light" | "dark") => {
    const dark = tone === "dark";
    const openDark = dark && !collapsed;
    return (
      <div
        className={[
          "flex h-14 w-full items-center justify-between border pl-4 pr-2.5",
          "transition-[border-radius] duration-500",
          openDark ? "rounded-t-[20px] rounded-b-none border-b-0" : "rounded-[20px]",
          dark ? "text-paper" : "text-ink",
        ].join(" ")}
        style={{
          transitionTimingFunction: "var(--ease-expo-out)",
          // Bar skin fades in with --nav-fill, so the top/collapsed state has
          // no visible bar — just the big mark + the CTA. Materialises on scroll.
          backgroundColor: openDark
            ? "var(--color-ink-deep)"
            : dark
              ? "color-mix(in srgb, var(--color-ink-deep) calc(64% * var(--nav-fill, 1)), transparent)"
              : "color-mix(in srgb, var(--color-paper) calc(74% * var(--nav-fill, 1)), transparent)",
          borderColor: dark
            ? "rgb(229 225 219 / calc(0.16 * var(--nav-fill, 1)))"
            : "rgb(26 24 22 / calc(0.12 * var(--nav-fill, 1)))",
          boxShadow: "0 16px 48px -18px rgb(14 13 12 / calc(0.5 * var(--nav-fill, 1)))",
          backdropFilter: "blur(calc(14px * var(--nav-fill, 1))) saturate(1.2)",
          WebkitBackdropFilter: "blur(calc(14px * var(--nav-fill, 1))) saturate(1.2)",
        }}
      >
        {/* Brand + links grouped together on the left */}
        <div className="flex items-center gap-2 lg:gap-4">
        {/* Brand — ink chip stays constant; the wordmark colour-splits. */}
        <Link
          href="/"
          aria-label="Executive AI Solutions — home"
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
          className="flex items-center gap-2.5 focus-ring"
        >
          {/* logo chip */}
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-ink"
            style={{ opacity: "var(--nav-fill, 1)" }}
          >
            <Image src="/Executive Ai Solutions Logo.svg" alt="" width={22} height={22} priority />
          </span>
          <span style={{ opacity: "var(--nav-fill, 1)" }}>
            <HoverText
              text="Executive AI"
              trigger={logoHover}
              className="text-[14px] font-semibold tracking-tight"
            />
          </span>
        </Link>

        {/* Links */}
        <ul
          className="hidden items-center gap-1 lg:flex"
          style={{ opacity: "var(--nav-fill, 1)" }}
        >
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={anchor(l.href)}
                onMouseEnter={() => {
                  setHovered(l.label);
                  if (l.tab) openTab(l.tab);
                  else closeTab();
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  if (l.tab) closeTab();
                }}
                onFocus={() => {
                  setHovered(l.label);
                  if (l.tab) openTab(l.tab);
                  else closeTab();
                }}
                onBlur={() => {
                  setHovered(null);
                  if (l.tab) closeTab();
                }}
                className="relative flex items-center gap-1.5 rounded-[10px] px-3 py-2 text-[13.5px] font-medium focus-ring"
              >
                <NavLabel
                  text={l.label}
                  active={hovered === l.label || tab === l.tab}
                  dark={dark}
                />
                {l.tab && (
                  <span
                    className="h-1 w-1 rounded-full bg-oxblood transition-opacity duration-300"
                    style={{ opacity: hovered === l.label || tab === l.tab ? 1 : 0 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
        </div>

        {/* Right cluster — fades in with the bar; the compact pill covers the top */}
        <div className="flex items-center gap-2.5" style={{ opacity: "var(--nav-fill, 1)" }}>
          <span
            className="hidden items-center gap-2 pr-0.5 text-[11.5px] xl:flex"
            style={{ opacity: "var(--nav-fill, 1)" }}
          >
            <span className="relative h-1.5 w-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
            <span className={dark ? "text-paper/70" : "text-ink/65"}>2 spots · July</span>
          </span>
          <span className="hidden sm:inline-flex">
            <PillCTA size="compact" invert={dark} hovered={ctaHover} onHoverChange={setCtaHover} />
          </span>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="press focus-ring flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-[10px] lg:hidden"
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 3.5 : 0 }}
              transition={{ duration: 0.4, ease: ease.expoOut }}
              className={`block h-[1.5px] w-[18px] rounded-full ${dark ? "bg-paper" : "bg-ink"}`}
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -3.5 : 0 }}
              transition={{ duration: 0.4, ease: ease.expoOut }}
              className={`block h-[1.5px] w-[18px] rounded-full ${dark ? "bg-paper" : "bg-ink"}`}
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-3 z-70 px-3 md:top-4 md:px-5">
        <div
          ref={wrapRef}
          className="relative mx-auto w-full max-w-[1400px]"
          onMouseLeave={closeTab}
          style={
            { "--nav-fill": "0", opacity: "var(--nav-fill)", pointerEvents: "none" } as React.CSSProperties
          }
        >
          {/* Bar — two seam-split layers */}
          <div ref={barRef} className="relative">
            {renderBar("light")}
            <div
              ref={darkLayerRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
              style={{ clipPath: "inset(0 0 100% 0)", opacity: closing ? 0 : 1 }}
            >
              {renderBar("dark")}
            </div>
          </div>

          {/* Tray — the bar unrolls into this section */}
          <div
            className="grid"
            style={{
              gridTemplateRows: open ? "1fr" : "0fr",
              // Open decelerates into place; close is shorter with a tighter
              // curve so the roll-up snaps shut instead of crawling.
              transition: open
                ? "grid-template-rows 560ms var(--ease-expo-out)"
                : "grid-template-rows 320ms cubic-bezier(0.4, 0, 0.2, 1), opacity 240ms ease-out",
              opacity: closing ? 0 : 1,
              willChange: "grid-template-rows, opacity",
            }}
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
            }}
            onTransitionEnd={(e) => {
              // Tear the skin down the EXACT frame the roll-up finishes, so the
              // border never lingers at zero height ("stuck" on the way up).
              if (
                e.target === e.currentTarget &&
                e.propertyName === "grid-template-rows" &&
                tab === null
              ) {
                setCollapsed(true);
                setDisplayTab(null);
              }
            }}
          >
            <div
              className={`min-h-0 overflow-hidden ${
                !collapsed
                  ? "rounded-b-[20px] border-x border-b border-[rgba(229,225,219,0.16)] bg-ink-deep shadow-[0_50px_120px_-40px_rgba(0,0,0,0.7)]"
                  : "border-0"
              }`}
            >
              <div
                className={`relative hidden h-[300px] border-t border-paper/10 lg:block xl:h-[332px] ${
                  !collapsed ? "nav-open" : ""
                }`}
              >
                {/* WORK panel */}
                <div
                  className="absolute inset-0 grid grid-cols-[1fr_1.3fr] gap-9 px-6 pb-16 pt-7 transition-opacity duration-500 xl:px-9"
                  style={{
                    opacity: displayTab === "work" ? 1 : 0,
                    visibility: displayTab === "work" ? "visible" : "hidden",
                    transitionTimingFunction: "var(--ease-expo-out)",
                  }}
                >
                  <div className="flex flex-col">
                    <span
                      className="nav-reveal micro mb-4 text-paper/50"
                      style={{ transitionDelay: open ? "0.08s" : "0s" }}
                    >
                      Selected work
                    </span>
                    <div className="nav-reveal flex flex-col" style={{ transitionDelay: open ? "0.14s" : "0s" }}>
                      {WORKS.map((w, i) => (
                        <a
                          key={w.title}
                          href={anchor("#work")}
                          onMouseEnter={() => setActiveWork(i)}
                          className="group flex items-baseline gap-3.5 border-b border-paper/8 py-2.5 transition-[padding-left] duration-300"
                          style={{
                            paddingLeft: activeWork === i ? "8px" : "0px",
                            transitionTimingFunction: "var(--ease-expo-out)",
                          }}
                        >
                          <span className="micro w-5 shrink-0 text-[9px] text-paper/40">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="text-[18px] font-semibold tracking-tight transition-colors duration-300"
                            style={{ color: activeWork === i ? "#e8b3b8" : "var(--color-paper)" }}
                          >
                            {w.title}
                          </span>
                          <span className="micro ml-auto self-center text-[8px] text-paper/35">
                            {w.category.split("·")[0].trim()}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div
                    className="nav-reveal relative overflow-hidden rounded-[14px] border border-paper/10 bg-ink"
                    style={{ transitionDelay: open ? "0.2s" : "0s" }}
                  >
                    {open && displayTab === "work" && (
                      <video
                        src={WORKS[activeWork].video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-linear-to-t from-ink-deep/85 to-transparent p-4">
                      <div>
                        <p className="text-[15px] font-semibold text-paper">{WORKS[activeWork].title}</p>
                        <p className="micro mt-0.5 text-[9px] text-paper/55">
                          {WORKS[activeWork].category}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-deep/60 px-2.5 py-1 backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-oxblood" />
                        <span className="micro text-[8px] text-paper/80">Live</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* SERVICES panel */}
                <div
                  className="absolute inset-0 grid grid-cols-[1fr_1.3fr] gap-9 px-6 pb-16 pt-7 transition-opacity duration-500 xl:px-9"
                  style={{
                    opacity: displayTab === "services" ? 1 : 0,
                    visibility: displayTab === "services" ? "visible" : "hidden",
                    transitionTimingFunction: "var(--ease-expo-out)",
                  }}
                >
                  <div className="flex flex-col">
                    <span
                      className="nav-reveal micro mb-4 text-paper/50"
                      style={{ transitionDelay: open ? "0.08s" : "0s" }}
                    >
                      What we build
                    </span>
                    <div className="nav-reveal flex flex-col" style={{ transitionDelay: open ? "0.14s" : "0s" }}>
                      {SERVICES.map((s, i) => (
                        <a
                          key={s.name}
                          href={anchor("#services")}
                          onMouseEnter={() => setActiveService(i)}
                          className="group flex flex-col border-b border-paper/8 py-3 transition-[padding-left] duration-300"
                          style={{
                            paddingLeft: activeService === i ? "8px" : "0px",
                            transitionTimingFunction: "var(--ease-expo-out)",
                          }}
                        >
                          <span className="flex items-baseline gap-3.5">
                            <span className="micro w-5 shrink-0 text-[9px] text-paper/40">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              className="text-[18px] font-semibold tracking-tight transition-colors duration-300"
                              style={{ color: activeService === i ? "#e8b3b8" : "var(--color-paper)" }}
                            >
                              {s.name}
                            </span>
                          </span>
                          <span className="mt-1 pl-[34px] text-[12px] text-paper/45">{s.line}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div
                    className="nav-reveal relative overflow-hidden rounded-[14px] border border-paper/10 bg-ink"
                    style={{ transitionDelay: open ? "0.2s" : "0s" }}
                  >
                    {SERVICES.map((s, i) => (
                      <Image
                        key={s.name}
                        src={s.image}
                        alt=""
                        fill
                        sizes="(max-width: 1400px) 50vw, 700px"
                        className="object-cover transition-opacity duration-500"
                        style={{
                          opacity: activeService === i ? 1 : 0,
                          transitionTimingFunction: "var(--ease-expo-out)",
                        }}
                      />
                    ))}
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-deep/85 to-transparent p-4">
                      <p className="text-[15px] font-semibold text-paper">{SERVICES[activeService].name}</p>
                      <p className="micro mt-0.5 text-[9px] text-paper/55">{SERVICES[activeService].line}</p>
                    </div>
                  </div>
                </div>

                {/* Footer strip — availability + CTA, shared across tabs */}
                <div
                  className="nav-reveal absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-paper/10 px-6 py-3.5 xl:px-9"
                  style={{ transitionDelay: open ? "0.26s" : "0s" }}
                >
                  <span className="flex items-center gap-2.5 text-[12.5px] text-paper/70">
                    <span className="relative h-1.5 w-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
                    2 spots left for July — booking now
                  </span>
                  <div className="flex items-center gap-5">
                    <a
                      href={anchor(displayTab === "services" ? "#services" : "#work")}
                      className="text-[12.5px] text-paper/60 transition-colors duration-300 hover:text-[#c9606a]"
                    >
                      View all →
                    </a>
                    <PillCTA size="compact" invert />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen mobile menu — big words with contextual sub-lists */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: ease.expoInOut }}
            className="fixed inset-0 z-60 flex flex-col overflow-y-auto bg-ink-deep px-5 pb-10 pt-28 text-paper md:px-10"
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="press focus-ring absolute right-5 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper transition-colors hover:bg-paper/10 md:right-10 md:top-8"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <nav className="flex flex-col gap-1.5">
              {LINKS.map((l, i) => (
                <div key={l.label} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "115%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "115%", transition: { duration: 0.3 } }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.07, ease: ease.expoOut }}
                  >
                    <a
                      href={anchor(l.href)}
                      onClick={() => setMenuOpen(false)}
                      className="block font-extrabold uppercase leading-[1.05] tracking-[-0.04em] text-[clamp(2.5rem,11vw,8rem)]"
                    >
                      {l.label}
                    </a>
                    {l.tab === "work" && (
                      <div className="mb-1 mt-1 flex flex-wrap gap-x-5 gap-y-2">
                        {WORKS.map((w) => (
                          <a
                            key={w.title}
                            href={anchor("#work")}
                            onClick={() => setMenuOpen(false)}
                            className="inline-flex items-center min-h-[44px] py-2 text-[13px] text-paper/50"
                          >
                            {w.title}
                          </a>
                        ))}
                      </div>
                    )}
                    {l.tab === "services" && (
                      <div className="mb-1 mt-1 flex flex-wrap gap-x-5 gap-y-2">
                        {SERVICES.map((s) => (
                          <a
                            key={s.name}
                            href={anchor("#services")}
                            onClick={() => setMenuOpen(false)}
                            className="inline-flex items-center min-h-[44px] py-2 text-[13px] text-paper/50"
                          >
                            {s.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: ease.expoOut }}
              className="mt-auto flex items-end justify-between gap-4 pt-10"
            >
              <div>
                <p className="micro text-paper/40">New projects</p>
                <p className="mt-2 flex items-center gap-2.5 text-sm text-paper/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
                  2 spots left for July
                </p>
              </div>
              <PillCTA label="Start a project" href="#contact" invert onClick={() => setMenuOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
