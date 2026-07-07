"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, EASE_STRUCTURE, EASE_UI, reducedMotion } from "@/components/anim/ease";
import { Monogram } from "@/components/ui/monogram";
import { CTA } from "@/components/ui/cta";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#estimate", label: "Pricing" },
];

/* The links capsule (the Lesse mechanism, decoded from their DOM): the
   capsule ITSELF expands downward on hover — height animates, overflow
   hidden — revealing a grid of little cards inside it, while a pill
   highlight slides behind the hovered link. Nothing floats outside. */
function LinksCapsule() {
  const [open, setOpen] = useState<number | null>(null);
  // the last-open panel stays MOUNTED while the capsule collapses — unmounting
  // it would empty the 1fr row instantly and the height would snap, not ease
  const [shown, setShown] = useState(0);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const enter =
    (i: number) =>
    (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
      const el = e.currentTarget;
      setOpen(i);
      setShown(i);
      setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
  const close = () => {
    setOpen(null);
    setPill(null);
  };

  const mini = (
    href: string,
    body: React.ReactNode,
    i: number,
    extra = "",
  ) => (
    <Link
      key={i}
      href={href}
      className={`nav-mini ${extra}`}
      style={{ animationDelay: `${i * 60}ms` }}
      onClick={close}
    >
      {body}
    </Link>
  );

  const panels = [
    // Work — the proof, small
    <div key="w" className="nav-panel">
      {mini(
        "/work",
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero/dw-hero.jpg" alt="" className="nav-mini-thumb" />
          <span className="text-trim">Desert Wings Flight School</span>
        </>,
        0,
      )}
      {mini(
        "/work",
        <>
          <span className="nav-mini-meta">All work</span>
          <span className="text-trim">Every build, live and linked</span>
        </>,
        1,
      )}
    </div>,
    // Services — the funnel, three stages
    <div key="s" className="nav-panel nav-panel--3">
      {mini(
        "/#services",
        <>
          <span className="text-trim">The click</span>
          <span className="nav-mini-meta">$500/mo + spend</span>
        </>,
        0,
      )}
      {mini(
        "/#services",
        <>
          <span className="text-trim">The landing</span>
          <span className="nav-mini-meta">From $2.5k</span>
        </>,
        1,
      )}
      {mini(
        "/#services",
        <>
          <span className="text-trim">The follow-up</span>
          <span className="nav-mini-meta">Per project</span>
        </>,
        2,
      )}
    </div>,
    // Pricing — the two promises
    <div key="p" className="nav-panel">
      {mini(
        "/#estimate",
        <>
          <span className="nav-mini-meta">Instant estimate</span>
          <span className="text-trim">A live number from real pricing</span>
        </>,
        0,
      )}
      {mini(
        "/#estimate",
        <>
          <span className="nav-mini-meta">Fixed quote</span>
          <span className="text-trim">In your inbox within two days</span>
        </>,
        1,
      )}
    </div>,
  ];

  return (
    <nav
      className={`nav-capsule nav-capsule--links absolute left-1/2 top-fib-2 hidden -translate-x-1/2 md:top-fib-3 md:flex ${
        open !== null ? "is-open" : ""
      }`}
      aria-label="Primary"
      onMouseLeave={close}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) close();
      }}
    >
      <div className="nav-links-row">
        <span
          className="pill-bg"
          style={
            pill
              ? { left: pill.left, width: pill.width, opacity: 1 }
              : undefined
          }
          aria-hidden
        />
        {LINKS.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className="nav-link t-meta"
            onMouseEnter={enter(i)}
            onFocus={enter(i)}
          >
            <span className="text-trim">{l.label}</span>
          </Link>
        ))}
      </div>
      <div className="nav-expand">
        <div className="nav-expand-in" inert={open === null ? true : undefined}>
          {panels[shown]}
        </div>
      </div>
    </nav>
  );
}

/* v3 nav — three floating ink-glass capsules (logo · links · CTA). Each
   capsule is a self-contained object that reads over every ground, so the
   old color-adaptive theme resolver is gone by construction: nothing under
   the nav can ever collide with it or wash it out. Constant at all scroll
   positions (the Lesse grammar). */
export function Nav() {
  const root = useRef<HTMLElement>(null!);
  const overlayRef = useRef<HTMLDivElement>(null!);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // a route change swaps the page under the overlay — close it
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Overlay menu open/close
  const ovTl = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const hambRef = useRef<HTMLButtonElement>(null!);
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    document.documentElement.style.overflow = open ? "hidden" : "";
    const main = document.querySelector("main");
    const foot = document.querySelector("footer");
    if (open) {
      main?.setAttribute("inert", "");
      foot?.setAttribute("inert", "");
    } else {
      main?.removeAttribute("inert");
      foot?.removeAttribute("inert");
    }

    // kill any in-flight open/close so a rapid toggle can't strand the menu
    ovTl.current?.kill();

    const focusFirst = () =>
      (overlay.querySelector("a") as HTMLElement)?.focus();
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
          { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: EASE_STRUCTURE },
        )
        .fromTo(
          links,
          { yPercent: 120, y: 0 },
          {
            yPercent: 0,
            y: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: EASE_STRUCTURE,
          },
          "-=0.3",
        )
        .fromTo(
          ovFoot,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, ease: EASE_UI },
          "-=0.2",
        );
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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && overlayRef.current?.style.display === "flex") {
        const focusables =
          overlayRef.current.querySelectorAll<HTMLElement>("a[href], button");
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (
          e.shiftKey &&
          (active === first || !overlayRef.current.contains(active))
        ) {
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
    <header ref={root} className="site-nav" data-anim="nav">
      <div className="flex items-center justify-between px-fib-2 pt-fib-2 md:px-fib-3 md:pt-fib-3">
        <Link
          href="/"
          className="nav-capsule nav-capsule--brand inline-flex"
          aria-label="Executive AI Solutions, home"
        >
          <Monogram className="h-[26px] w-[26px]" />
          <span
            className="text-trim hidden font-semibold tracking-[-0.01em] lg:inline"
            style={{ fontSize: "0.9375rem" }}
          >
            Executive AI Solutions
          </span>
        </Link>

        <LinksCapsule />

        <div className="flex items-center gap-fib-1">
          <CTA
            href="/#estimate"
            label="Get an estimate"
            tone="accent"
            className="nav-cta hidden sm:inline-flex"
          />
          <button
            ref={hambRef}
            className={`nav-capsule hamb md:hidden ${open ? "is-open" : ""}`}
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
      <div
        ref={overlayRef}
        id="site-menu"
        className="ov dark-chapter"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        style={{ display: "none" }}
      >
        <div className="flex h-full w-full flex-col justify-between px-fib-3 pb-fib-4 pt-fib-6">
          <nav className="flex flex-col gap-fib-2" aria-label="Menu">
            {[...LINKS, { href: "/#contact", label: "Contact" }].map((l) => (
              <span key={l.href} className="mask-line">
                <span className="mask-inner">
                  <Link
                    href={l.href}
                    className="ov-item t-display-lg"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </span>
              </span>
            ))}
          </nav>
          <div className="ov-foot flex items-center justify-between">
            <Monogram className="h-fib-4 w-fib-4 opacity-60" />
            <a
              href="mailto:hello@executiveaisolutions.com"
              className="u-link t-meta"
            >
              hello@executiveaisolutions.com
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
