"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";
import { Segmented } from "@/components/ui/segmented";
import { MiniSite } from "@/components/builder/mini-site";
import { DemoSite } from "@/components/builder/demo-site";
import { setBuild } from "@/components/builder/store";
import {
  ACCENTS,
  INDUSTRIES,
  SKINS,
  getPack,
  getSkin,
  type SkinId,
} from "@/components/builder/packs";

/* The 60-second builder — the "see yours before you buy it" tool. The visitor
   picks an industry, types their name, chooses a look and a color, and the
   mini site in the browser frame becomes THEIRS while they watch (the process
   stage just showed one being built; this one hands them the keys). What they
   make is written to the build store, rides the contact email, and the email
   carries a /?i=..&s=..&a=..&n=..#builder link that reopens the page with
   their build loaded — which is also how those links pre-seed this section
   on mount. */

export function Builder() {
  const root = useRef<HTMLElement>(null!);
  const demoRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const [industry, setIndustry] = useState(INDUSTRIES[0].id);
  const [skin, setSkin] = useState<SkinId>("warm");
  const [accent, setAccent] = useState(ACCENTS[0].id);
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);

  const pack = getPack(industry);

  // a reopened build link (or a labeled ad click) pre-loads the choices —
  // and o=1 (the emailed link) walks them straight into their site
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const i = params.get("i");
    const s = params.get("s");
    const a = params.get("a");
    const n = params.get("n");
    if (!i && !s && !a && !n) return;
    if (i && INDUSTRIES.some((p) => p.id === i)) setIndustry(i);
    if (s === "warm" || s === "dark") setSkin(s);
    if (a && ACCENTS.some((x) => x.id === a)) setAccent(a);
    if (n) setName(n.slice(0, 40));
    setTouched(true);
    if (params.get("o") === "1") {
      const t = setTimeout(() => setOpen(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  // only a touched build attaches to the message — defaults attach nothing
  useEffect(() => {
    setBuild(touched ? { industry, skin, accent, name } : null);
  }, [touched, industry, skin, accent, name]);

  const touch = () => setTouched(true);

  // entrance — controls read first, the reward frame lands last
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        return;
      }
      gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 72%" },
        defaults: { ease: EASE_STRUCTURE },
      })
        .fromTo(
          q("[data-anim='bld-head']"),
          { autoAlpha: 0, y: 21 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }
        )
        .fromTo(
          q("[data-anim='bld-ctrl']"),
          { autoAlpha: 0, x: -21 },
          { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.09 },
          "-=0.45"
        )
        .fromTo(
          q("[data-anim='bld-stage']"),
          { autoAlpha: 0, y: 34, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 },
          "-=0.4"
        );
    },
    { scope: root }
  );

  // industry swaps re-assemble the page (skin/accent swaps morph via CSS
  // color transitions instead — re-staggering them would read as a glitch)
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-ms]"),
        { autoAlpha: 0, y: 13 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE_UI, stagger: 0.07, overwrite: "auto" }
      );
    },
    { scope: root, dependencies: [pack.id] }
  );

  /* ── the alive layer — their site, working. A ghost cursor drifts in,
     clicks their CTA, and an enquiry toast lands. Runs on the showreel's
     clock rules (in view, tab visible, not while they're playing with it) and
     rebuilds per industry since the CTA moves. ── */
  useGSAP(
    (context) => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(root);
      const frame = q(".ms-frame")[0] as HTMLElement;
      const canvas = q(".ms-canvas")[0] as HTMLElement;
      const cursor = q(".ms-cursor")[0] as HTMLElement;
      const toast = q(".ms-toast")[0] as HTMLElement;
      const btn = q(".ms-btn")[0] as HTMLElement;
      if (!frame || !canvas || !cursor || !toast || !btn) return;

      const rest = () => gsap.set([cursor, toast], { autoAlpha: 0 });
      rest();

      // where the click lands, relative to the canvas
      const target = () => {
        const c = canvas.getBoundingClientRect();
        const b = btn.getBoundingClientRect();
        return {
          x: b.left - c.left + b.width * 0.72,
          y: b.top - c.top + b.height * 0.78,
        };
      };

      const tl = gsap
        .timeline({ paused: true, repeat: -1, repeatDelay: 6, delay: 1.6 })
        .set(cursor, { x: () => target().x + 89, y: () => target().y + 47, scale: 1 })
        .to(cursor, { autoAlpha: 1, duration: 0.35, ease: EASE_UI })
        .to(cursor, { x: () => target().x, y: () => target().y, duration: 1.15, ease: EASE_STRUCTURE }, 0.05)
        .to(cursor, { scale: 0.82, duration: 0.11, yoyo: true, repeat: 1, ease: EASE_UI }, ">-0.05")
        .to(btn, { scale: 0.94, duration: 0.11, yoyo: true, repeat: 1, ease: EASE_UI }, "<")
        .fromTo(
          toast,
          { autoAlpha: 0, y: -13 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE_UI },
          ">+0.12"
        )
        .to(cursor, { autoAlpha: 0, duration: 0.4 }, ">+0.35")
        .to(toast, { autoAlpha: 0, y: -8, duration: 0.45, ease: EASE_UI }, ">+1.7");

      let inView = false;
      let hovered = false;
      const sync = () => {
        if (inView && !hovered && !document.hidden) tl.play();
        else tl.pause();
      };
      ScrollTrigger.create({
        trigger: frame,
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) => {
          inView = self.isActive;
          sync();
        },
      });
      // while they're playing, the ghost gets out of the way and restarts clean
      const onEnter = () => {
        hovered = true;
        tl.progress(0).pause();
        rest();
        gsap.set(btn, { scale: 1 });
      };
      const onLeave = () => {
        hovered = false;
        sync();
      };
      frame.addEventListener("pointerenter", onEnter);
      frame.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", sync);
      context.add(() => () => {
        frame.removeEventListener("pointerenter", onEnter);
        frame.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("visibilitychange", sync);
      });
    },
    { scope: root, dependencies: [pack.id] }
  );

  /* ── the reveal: the frame they built grows into their actual site.
     The scroll container is pre-sized to the final viewport so the FLIP is a
     window expanding over a full-size page, not a page reflowing. ── */
  const closeDemo = (toContact = false) => {
    const overlay = demoRef.current;
    if (!overlay || closingRef.current) return;
    closingRef.current = true;
    document.documentElement.style.overflow = "";
    const done = () => {
      closingRef.current = false;
      setOpen(false);
      (root.current?.querySelector(".bld-open") as HTMLElement | null)?.focus();
    };
    if (reducedMotion() || toContact) {
      // heading to the form: get out of the way, the page scroll is the show
      gsap.to(overlay, { autoAlpha: 0, duration: 0.35, ease: EASE_UI, onComplete: done });
      return;
    }
    const frame = root.current?.querySelector(".ms-frame") as HTMLElement | null;
    const r = frame?.getBoundingClientRect();
    const tl = gsap.timeline({ defaults: { ease: EASE_STRUCTURE }, onComplete: done });
    tl.to(overlay.querySelector(".demo-scroll"), { autoAlpha: 0, duration: 0.28, ease: EASE_UI }, 0)
      .to(
        overlay.querySelectorAll(".demo-bar, .demo-close"),
        { autoAlpha: 0, duration: 0.2, ease: EASE_UI },
        0
      );
    if (r) {
      tl.to(
        overlay,
        { top: r.top, left: r.left, width: r.width, height: r.height, borderRadius: 14, duration: 0.6 },
        0.1
      ).to(overlay, { autoAlpha: 0, duration: 0.2 }, ">-0.05");
    } else {
      tl.to(overlay, { autoAlpha: 0, duration: 0.3 }, 0.1);
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDemo();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useGSAP(
    (context, contextSafe) => {
      if (!open) return;
      const overlay = demoRef.current;
      const frame = root.current?.querySelector(".ms-frame") as HTMLElement | null;
      if (!overlay) return;
      const scroll = overlay.querySelector(".demo-scroll") as HTMLElement;
      const q = gsap.utils.selector(overlay);

      document.documentElement.style.overflow = "hidden";
      (overlay.querySelector(".demo-close") as HTMLElement | null)?.focus({ preventScroll: true });

      // scroll reveals for the below-the-fold bands — created AFTER the FLIP
      // lands so every measurement happens at the final size
      const buildReveals = contextSafe!(() => {
        q("[data-demo-anim]").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 21 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: EASE_STRUCTURE,
              scrollTrigger: { trigger: el, scroller: scroll, start: "top 88%" },
            }
          );
        });
      });

      if (reducedMotion()) {
        gsap.set(overlay, { top: 0, left: 0, width: "100%", height: "100%", autoAlpha: 1, visibility: "visible" });
        gsap.set(q(".demo-word-inner"), { yPercent: 0 });
        gsap.set(q("[data-demo-anim], [data-demo]"), { autoAlpha: 1 });
        return;
      }

      const r = frame?.getBoundingClientRect() ?? { top: 0, left: 0, width: 300, height: 200 };
      const words = q(".demo-word-inner");

      // rest states before anything is visible
      gsap.set(scroll, { width: window.innerWidth, height: window.innerHeight });
      gsap.set(words, { yPercent: 112 });
      gsap.set(q("[data-demo='nav'], [data-demo='rise'], [data-demo-anim]"), { autoAlpha: 0, y: 13 });
      gsap.set(q("[data-demo='photo']"), { autoAlpha: 0, scale: 1.06, transformOrigin: "50% 50%" });
      gsap.set(q(".demo-bar"), { autoAlpha: 0, y: 34 });
      gsap.set(q(".demo-close"), { autoAlpha: 0 });

      gsap
        .timeline({ defaults: { ease: EASE_STRUCTURE } })
        .set(overlay, {
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
          borderRadius: 14,
          autoAlpha: 1,
          visibility: "visible",
        })
        .to(overlay, {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          duration: 0.8,
        })
        .set(overlay, { width: "100%", height: "100%" })
        .set(scroll, { width: "100%", height: "100%" })
        // their site introduces itself
        .to(q("[data-demo='nav']"), { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.15")
        .to(words, { yPercent: 0, duration: 0.85, stagger: 0.07 }, "<+0.05")
        .to(q("[data-demo='photo']"), { autoAlpha: 1, scale: 1, duration: 1.0 }, "<+0.15")
        .to(q("[data-demo='rise']"), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: EASE_UI }, "<+0.2")
        .to(q(".demo-bar"), { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI }, "<+0.3")
        .to(q(".demo-close"), { autoAlpha: 1, duration: 0.4, ease: EASE_UI }, "<")
        .add(buildReveals, "-=0.4");
    },
    { scope: root, dependencies: [open] }
  );

  return (
    <section
      id="builder"
      ref={root}
      data-nav="light"
      className="bld relative pb-fib-7 pt-fib-6 md:pt-fib-7"
    >
      <div className="mx-auto max-w-[1280px] px-fib-3 md:px-fib-5">
        <p data-anim="bld-head" className="t-meta text-ink/60">
          Build yours
        </p>
        <h2 data-anim="bld-head" className="t-display-lg mt-fib-2 max-w-[15ch]">
          What would yours look like?
        </h2>
        <p data-anim="bld-head" className="mt-fib-3 max-w-[46ch] text-ink/70">
          You just watched one get built. Now make it yours — pick your
          industry, type your name, choose a look. Sixty seconds, no signup.
        </p>

        <div className="mt-fib-5 grid items-start gap-fib-4 md:grid-cols-[42fr_58fr] md:gap-fib-5">
          {/* the choices */}
          <div className="flex flex-col gap-fib-4 md:col-start-1 md:row-start-1">
            <div data-anim="bld-ctrl" className={`field ${name ? "has-value" : ""}`}>
              <input
                id="bld-name"
                type="text"
                maxLength={40}
                autoComplete="organization"
                placeholder=" "
                value={name}
                onInput={(e) => {
                  setName(e.currentTarget.value);
                  touch();
                }}
              />
              <label htmlFor="bld-name">Your business name</label>
            </div>

            <fieldset data-anim="bld-ctrl">
              <legend className="t-meta mb-fib-2 text-ink/60">Your industry</legend>
              <div className="flex flex-wrap gap-fib-1">
                {INDUSTRIES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="chip-toggle"
                    aria-pressed={industry === p.id}
                    onClick={() => {
                      setIndustry(p.id);
                      touch();
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset data-anim="bld-ctrl">
              <legend className="t-meta mb-fib-2 text-ink/60">The look</legend>
              <Segmented
                options={SKINS}
                value={skin}
                onChange={(id) => {
                  setSkin(id as SkinId);
                  touch();
                }}
              />
            </fieldset>

            <fieldset data-anim="bld-ctrl">
              <legend className="t-meta mb-fib-2 text-ink/60">The color</legend>
              <div className="flex items-center gap-fib-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    className="bld-swatch"
                    style={{ background: a.hex }}
                    aria-pressed={accent === a.id}
                    aria-label={`Accent color: ${a.label}`}
                    title={a.label}
                    onClick={() => {
                      setAccent(a.id);
                      touch();
                    }}
                  />
                ))}
              </div>
            </fieldset>

            <div data-anim="bld-ctrl" className="mt-fib-1 flex flex-wrap items-center gap-fib-3">
              <button
                type="button"
                className="bld-open"
                onClick={() => {
                  touch();
                  setOpen(true);
                }}
              >
                See it live
                <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M3 13 13 3M5.5 3H13v7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <CTA href="#contact" label="Make it real" tone="ink" />
            </div>
            <p data-anim="bld-ctrl" className="t-meta max-w-[34ch] text-ink/55">
              What you build rides along with your message
            </p>
          </div>

          {/* the reward — their site, live (first on mobile so typing a name
              changes something you can actually see above the keyboard) */}
          <div data-anim="bld-stage" className="max-md:-order-1 md:col-start-2 md:row-start-1">
            <MiniSite pack={pack} skin={skin} accent={accent} name={name} />
            <p className="t-meta mt-fib-2 text-right text-ink/45" aria-hidden>
              {getSkin(skin).label} · a sketch — open it to walk through
            </p>
          </div>
        </div>
      </div>

      {/* ── the fullscreen reveal — their build, at real scale. Portaled to
          <body>: inside <main> it would sit in main's z-10 stacking context,
          underneath the fixed site nav. ── */}
      {open &&
        createPortal(
          <DemoSite
            ref={demoRef}
            pack={pack}
            skin={skin}
            accent={accent}
            name={name}
            onClose={(e?: unknown) => {
              const isAnchor =
                !!e && typeof e === "object" && "currentTarget" in e &&
                (e as React.MouseEvent).currentTarget instanceof HTMLAnchorElement;
              closeDemo(isAnchor);
            }}
          />,
          document.body
        )}
    </section>
  );
}
