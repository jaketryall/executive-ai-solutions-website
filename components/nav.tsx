"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP, EASE_STRUCTURE, EASE_UI, reducedMotion } from "@/components/anim/ease";
import { Monogram } from "@/components/ui/monogram";
import { RollLink } from "@/components/ui/roll-link";
import { CTA } from "@/components/ui/cta";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#estimate", label: "Pricing" },
];

export function Nav() {
  const root = useRef<HTMLElement>(null!);
  const overlayRef = useRef<HTMLDivElement>(null!);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // a route change swaps every [data-nav] section — close the overlay and
  // rebuild the theme triggers against the new page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Color-adaptive: sections declare the ground they present behind the nav.
  useGSAP(
    () => {
      const nav = root.current;
      const sections = gsap.utils.toArray<HTMLElement>("[data-nav]");
      // data-nav elements can NEST (a dark media card inside a light section):
      // on every toggle, the LAST active element in DOM order wins.
      const entries = sections.map((sec) => ({ sec, active: false }));
      const resolve = () => {
        let theme: string | null = null;
        for (const e of entries) if (e.active) theme = e.sec.dataset.nav!;
        // nothing active = over the fixed footer, which is a light ground
        nav.setAttribute("data-theme", theme ?? "light");
      };
      const triggers = entries.map((e) =>
        ScrollTrigger.create({
          trigger: e.sec,
          start: "top 40px",
          end: "bottom 40px",
          onToggle: (self) => {
            e.active = self.isActive;
            resolve();
          },
        })
      );
      // condensed state past the first 40px
      const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => {
        triggers.forEach((t) => t.kill());
        window.removeEventListener("scroll", onScroll);
      };
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true }
  );

  // Overlay menu open/close
  const prevTheme = useRef<string>("light");
  const ovTl = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    // the overlay is a dark ground — the nav chrome must flip with it
    const nav = root.current;
    const main = document.querySelector("main");
    const foot = document.querySelector("footer");
    if (open) {
      prevTheme.current = nav.getAttribute("data-theme") ?? "light";
      nav.setAttribute("data-theme", "dark");
      main?.setAttribute("inert", "");
      foot?.setAttribute("inert", "");
    } else {
      nav.setAttribute("data-theme", prevTheme.current);
      main?.removeAttribute("inert");
      foot?.removeAttribute("inert");
    }

    // kill any in-flight open/close so a rapid toggle can't strand the menu
    ovTl.current?.kill();

    const focusFirst = () => (overlay.querySelector("a") as HTMLElement)?.focus();
    if (reducedMotion()) {
      overlay.style.display = open ? "flex" : "none";
      overlay.style.clipPath = "inset(0 0 0% 0)";
      if (open) focusFirst();
      else hambRef.current?.focus();
      return;
    }
    const links = overlay.querySelectorAll(".mask-inner");
    const ovFoot = overlay.querySelector(".ov-foot");
    if (open) {
      overlay.style.display = "flex";
      ovTl.current = gsap
        .timeline()
        .fromTo(
          overlay,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: EASE_STRUCTURE }
        )
        .fromTo(
          links,
          { yPercent: 120, y: 0 },
          { yPercent: 0, y: 0, duration: 0.6, stagger: 0.07, ease: EASE_STRUCTURE },
          "-=0.3"
        )
        .fromTo(ovFoot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: EASE_UI }, "-=0.2");
      focusFirst();
    } else {
      ovTl.current = gsap.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.45,
        ease: EASE_UI,
        onComplete: () => {
          overlay.style.display = "none";
        },
      });
      hambRef.current?.focus();
    }
  }, [open]);

  // Escape closes; Tab is trapped inside the open overlay; crossing the md
  // breakpoint closes it (the toggle disappears up there)
  const hambRef = useRef<HTMLButtonElement>(null!);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && overlayRef.current?.style.display === "flex") {
        const focusables = overlayRef.current.querySelectorAll<HTMLElement>("a[href], button");
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !overlayRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onMq);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <header ref={root} className="site-nav" data-theme="light" data-anim="nav">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-[21px] md:px-[55px]">
        <Link href="/" className="nav-brand flex items-center gap-[13px]" aria-label="Executive AI Solutions, home">
          <Monogram className="h-[30px] w-[30px]" />
          <span className="text-trim hidden font-[600] tracking-[-0.01em] sm:inline" style={{ fontSize: "0.9375rem" }}>
            Executive AI Solutions
          </span>
        </Link>

        <div className="nav-cluster flex items-center gap-[8px]">
          <nav className="hidden items-center gap-[21px] pr-[13px] md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <RollLink key={l.href} href={l.href} className="t-meta">
                {l.label}
              </RollLink>
            ))}
          </nav>
          <CTA href="/#estimate" label="Get an estimate" tone="accent" className="nav-cta hidden sm:inline-flex" />
          <button
            ref={hambRef}
            className={`hamb md:hidden ${open ? "is-open" : ""}`}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Full-screen overlay menu (mobile) */}
      <div ref={overlayRef} id="site-menu" className="ov dark-chapter" role="dialog" aria-modal="true" aria-label="Menu" style={{ display: "none" }}>
        <div className="flex h-full w-full flex-col justify-between px-[21px] pb-[34px] pt-[89px]">
          <nav className="flex flex-col gap-[13px]" aria-label="Menu">
            {[...LINKS, { href: "/#contact", label: "Contact" }].map((l) => (
              <span key={l.href} className="mask-line">
                <span className="mask-inner">
                  <Link href={l.href} className="ov-item t-display-lg" onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </span>
              </span>
            ))}
          </nav>
          <div className="ov-foot flex items-center justify-between">
            <Monogram className="h-[34px] w-[34px] opacity-60" />
            <a href="mailto:hello@executiveaisolutions.com" className="u-link t-meta">
              hello@executiveaisolutions.com
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
