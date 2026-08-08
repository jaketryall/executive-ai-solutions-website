"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, EASE_STRUCTURE, EASE_UI, reducedMotion } from "@/components/anim/ease";
import { Monogram } from "@/components/ui/monogram";
import { CTA } from "@/components/ui/cta";
import { PROJECTS } from "@/lib/work";
import { SERVICES, SERVICE_META } from "@/lib/services";


const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

/* the live element (a real one): our local clock, ticking in the Contact
   panel — "someone is actually there, and it's daytime for them right now" */
function LocalTime() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "America/Phoenix",
    });
    const tick = () => setNow(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="t-num" suppressHydrationWarning>
      {now || "—"}
    </span>
  );
}

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
      // links without a panel (pricing) keep the pill highlight but the
      // capsule stays at rest — nothing to preview, nothing opens
      setOpen(panels[i] ? i : null);
      if (panels[i]) setShown(i);
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
      style={{ animationDelay: `${i * 100}ms` }}
      onClick={close}
    >
      {body}
    </Link>
  );

  const panels = [
    // Work — the proof, DATA-DRIVEN from the roster (2026-08-07: hardcoded
    // to a single DW case, went stale when AAHG + Riled Up landed). The
    // first three roster entries (clients-first order) + an All-work card,
    // in the 2x2 grid. Never drifts from lib/work.ts again.
    <div key="w" className="nav-panel">
      {PROJECTS.slice(0, 3).map((p, i) =>
        mini(
          `/work/${p.slug}`,
          <>
            <span className="text-trim">{p.listName}</span>
            <span className="nav-mini-meta">{p.sector}</span>
          </>,
          i,
        ),
      )}
      {mini(
        "/work",
        <>
          <span className="text-trim">All work</span>
          <span className="nav-mini-meta">Every build, live &amp; linked</span>
        </>,
        3,
      )}
    </div>,
    // Services — the funnel, three stages, DATA-DRIVEN (2026-08-07: was the
    // retired funnel-jargon "The click/landing/follow-up"; the pages now
    // lead with literal service names, so the nav does too)
    <div key="s" className="nav-panel nav-panel--swell">
      {SERVICES.map((s, i) =>
        mini(
          `/services/${s.slug}`,
          <>
            <span className="text-trim">{s.nav}</span>
            <span className="nav-mini-meta">{SERVICE_META[s.slug].price}</span>
          </>,
          i,
        ),
      )}
    </div>,
    // Pricing — a plain destination; the page needs no preview
    null,
    // Contact — the hover reveals one quiet fact: someone's actually
    // there. Right-aligned: it lands directly under the Contact link
    // (the last one), where the eyes already are
    <div key="c" className="nav-panel nav-panel--1">
      <div className="nav-fact nav-fact--end" style={{ animationDelay: "0ms" }}>
        Mesa, AZ · <LocalTime /> our time
      </div>
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
        {/* the mark rides IN the bar — first item, home link (the Apple
            arrangement); entering it stands the panel down but takes the
            pill highlight like any other stop in the row */}
        <Link
          href="/"
          className="nav-brand-in"
          aria-label="Executive AI Solutions, home"
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            setOpen(null);
            setPill({ left: el.offsetLeft, width: el.offsetWidth });
          }}
          onFocus={(e) => {
            const el = e.currentTarget;
            setOpen(null);
            setPill({ left: el.offsetLeft, width: el.offsetWidth });
          }}
        >
          <Monogram className="h-[26px] w-[26px]" />
          {/* the lockup: two stacked lines matched to the mark's height
              (Jake, 2026-07-16); the Link's aria-label carries the name */}
          <span className="nav-brand-name" aria-hidden>
            <span>Executive AI</span>
            <span>Solutions</span>
          </span>
        </Link>
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
        {/* the action rides the right end (Jake, 2026-07-16) — the counter-
            weight to the lockup. Its own fill; the pill highlight stands
            down here, and hovering it closes any open panel. */}
        <Link
          href="/pricing#estimate"
          className="nav-cta"
          onMouseEnter={() => {
            setOpen(null);
            setPill(null);
          }}
          onFocus={() => {
            setOpen(null);
            setPill(null);
          }}
        >
          Price my project
        </Link>
      </div>
      <div className="nav-expand">
        <div className="nav-expand-in" inert={open === null ? true : undefined}>
          {panels[shown]}
        </div>
      </div>
    </nav>
  );
}

/* v3 nav — floating ink-glass capsules (logo · links). Each
   capsule is a self-contained object that reads over every ground, so the
   old color-adaptive theme resolver is gone by construction: nothing under
   the nav can ever collide with it or wash it out. Constant at all scroll
   positions (the Lesse grammar). */
/* the mobile identity bar's marquee line — real facts on loop */
const MARQUEE = [
  "Sites from $2.5k",
  "Ads managed from $500/mo",
  "Mesa, AZ",
  "Fixed quote in 2 days",
  "Replies within a day",
].join("  ·  ");

export function Nav() {
  const root = useRef<HTMLElement>(null!);
  const overlayRef = useRef<HTMLDivElement>(null!);
  const barRef = useRef<HTMLDivElement>(null!);
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false); // Services sub-menu (mobile overlay)
  const [total, setTotal] = useState<number | null>(null);
  const pathname = usePathname();
  // the Services sub-menu resets to collapsed whenever the overlay closes
  useEffect(() => {
    if (!open) setSvcOpen(false);
  }, [open]);
  // case pages: the dock owns the bottom edge — the bar stands down entirely
  const onCasePage = /^\/work\/.+/.test(pathname);

  /* the identity bar yields wherever the bottom edge is spoken for: the
     estimator chapter (est-bar carries the total there) and the footer
     (the sign-off lockup is the closing statement, not ours to cover) */
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    let overFooter = false;
    const inZone = new Set<Element>();
    const apply = () =>
      el.classList.toggle("is-away", overFooter || inZone.size > 0);

    const main = document.querySelector("main");
    const onScroll = () => {
      overFooter = main
        ? main.getBoundingClientRect().bottom < window.innerHeight * 0.9
        : false;
      apply();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const est = document.querySelector("#estimate");
    let io: IntersectionObserver | undefined;
    if (est) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) inZone.add(e.target);
            else inZone.delete(e.target);
          }
          apply();
        },
        { rootMargin: "0px 0px -15% 0px" },
      );
      io.observe(est);
    }

    // once the visitor touches the estimator, the bar carries their number
    const onEstimate = (e: Event) => {
      const d = (e as CustomEvent<{ total?: number }>).detail;
      if (typeof d?.total === "number") setTotal(d.total);
    };
    window.addEventListener("eas:estimate", onEstimate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("eas:estimate", onEstimate);
      io?.disconnect();
    };
  }, [pathname, onCasePage]);

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

    // preventScroll (bug 2026-08-08): focusing the first link WHILE it's
    // mid-rise made the browser scroll-into-view it, yanking only that
    // item ("Work slides up and disappears"; the unfocused links were
    // fine). preventScroll keeps focus without the scroll jump.
    const focusFirst = () =>
      (overlay.querySelector("a") as HTMLElement)?.focus({
        preventScroll: true,
      });
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
      // pre-hide the links SYNCHRONOUSLY (bug 2026-08-08): their rise
      // tween starts 0.3s into the timeline, so before the fix the links
      // flashed at their visible default as the clip opened, then snapped
      // down and rose ("Work starts on screen and disappears")
      gsap.set(links, { yPercent: 120 });
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
        {/* mobile only — on desktop the mark lives inside the links capsule */}
        <Link
          href="/"
          className="nav-capsule nav-capsule--brand inline-flex md:hidden"
          aria-label="Executive AI Solutions, home"
        >
          <Monogram className="h-[26px] w-[26px]" />
        </Link>

        <LinksCapsule />

        {/* no nav CTA for now (Jake, 2026-07-11) — the persistent bottom
            capsule carries the action; the right slot keeps the hamburger */}
        <div className="flex items-center gap-fib-1">
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

      {/* the mobile identity bar (the itsjay lesson: mobile chrome that is
          OF the phone — an OS-native pill, not a desktop nav squeezed down):
          the mark, the name over a fact marquee, and the one action */}
      {!onCasePage && (
        <div ref={barRef} className="mnav">
          <Link
            href="/"
            className="mnav-tile"
            aria-label="Executive AI Solutions, home"
          >
            <Monogram className="h-[21px] w-[21px]" />
          </Link>
          <span className="mnav-mid">
            {/* short form: with the Ask tile aboard, the full name needs
                ~176px the 390px bar no longer has — the mark and marquee
                carry the rest */}
            <span className="mnav-name text-trim">Executive AI</span>
            <span className="mnav-marquee" aria-hidden>
              <span className="mnav-track">
                <span>{MARQUEE}</span>
                <span>{MARQUEE}</span>
              </span>
            </span>
          </span>
          {/* Ask lives IN the bar on mobile — a second floating pill above
              it cost 130px of stacked bottom chrome (mobile audit 2026-07-16).
              One quiet tile; Estimate keeps the loud slot. */}
          <button
            type="button"
            className="mnav-tile mnav-ask"
            aria-label="Ask this site a question"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("eas:chat-open"))
            }
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M4 4.5h12A1.5 1.5 0 0 1 17.5 6v6a1.5 1.5 0 0 1-1.5 1.5H9l-3.5 3v-3H4A1.5 1.5 0 0 1 2.5 12V6A1.5 1.5 0 0 1 4 4.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <Link
            href="/pricing#estimate"
            className="mnav-cta t-num"
          >
            {total !== null ? `$${total.toLocaleString()}` : "Estimate"}
          </Link>
        </div>
      )}

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
            {LINKS.map((l) =>
              l.label === "Services" ? (
                // Services EXPANDS to its three stages (Jake, 2026-08-08:
                // "services should definitely be a dropdown"). The mask-line
                // wraps ONLY the toggle — the sub-list sits outside it, or
                // the mask's overflow:hidden would clip the expansion.
                <div key={l.href} className="ov-svc">
                  <span className="mask-line">
                    <span className="mask-inner">
                      <button
                        type="button"
                        className="ov-item ov-svc-toggle t-display-lg"
                        aria-expanded={svcOpen}
                        aria-controls="ov-svc-sub"
                        onClick={() => setSvcOpen((v) => !v)}
                      >
                        Services
                        <svg
                          className="ov-svc-chev"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M5 9l7 7 7-7"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </span>
                  </span>
                  <div
                    id="ov-svc-sub"
                    className={`ov-svc-sub ${svcOpen ? "is-open" : ""}`}
                  >
                    <div className="ov-svc-sub-in">
                      {SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="ov-svc-link"
                          onClick={() => setOpen(false)}
                        >
                          <span className="text-trim">{s.nav}</span>
                          <span className="ov-svc-price">
                            {SERVICE_META[s.slug].price}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
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
              ),
            )}
          </nav>
          {/* the menu ends in the one action (it had none), then the two
              human facts: a real inbox and a ticking Mesa clock */}
          <div className="ov-foot flex flex-col gap-fib-4">
            <span onClick={() => setOpen(false)}>
              <CTA
                href="/pricing#estimate"
                label="Price my project"
                tone="paper"
              />
            </span>
            <div className="flex flex-wrap items-center justify-between gap-fib-2">
              <a
                href="mailto:hello@executiveaisolutions.com"
                className="u-link t-meta"
              >
                hello@executiveaisolutions.com
              </a>
              <span className="t-meta text-paper/50">
                Mesa, AZ · <LocalTime />
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
