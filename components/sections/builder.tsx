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
import { MiniSite } from "@/components/builder/mini-site";
import { DemoSite } from "@/components/builder/demo-site";
import { setBuild } from "@/components/builder/store";
import {
  ACCENTS,
  INDUSTRIES,
  SKINS,
  getPack,
  type SkinId,
} from "@/components/builder/packs";

/* The 60-second builder — the "see yours before you buy it" toy. No form:
   the controls live on the browser fiction itself (industries are the mini
   browser's TABS, colors and the look are a dot-dock floating on the frame),
   and the one written ask is a display-sized type-your-name line. While
   nobody has touched it, a ghost cursor DEMOS the toy — flips a tab, lets
   the site reassemble, clicks its CTA, catches the enquiry toast — so even
   a fast scroller sees that this thing is alive and playable. What they
   make is written to the build store, rides the contact email, and the email
   carries a /?i=..&s=..&a=..&n=..#builder link that reopens the page with
   their build loaded — which is also how those links pre-seed this section
   on mount. */

export function Builder() {
  const root = useRef<HTMLElement>(null!);
  const demoRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const ghostRef = useRef<gsap.core.Timeline | null>(null);
  const touchedRef = useRef(false);
  const [industry, setIndustry] = useState(INDUSTRIES[0].id);
  const [skin, setSkin] = useState<SkinId>("warm");
  const [accent, setAccent] = useState(ACCENTS[0].id);
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);

  const pack = getPack(industry);
  const brand = name.trim() || pack.defaultName;

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

  // the ghost yields the moment the visitor takes over
  useEffect(() => {
    touchedRef.current = touched;
    if (touched && ghostRef.current) {
      ghostRef.current.kill();
      ghostRef.current = null;
      const layers = root.current?.querySelectorAll(".ms-cursor, .ms-toast");
      if (layers?.length) gsap.set(layers, { autoAlpha: 0 });
    }
  }, [touched]);

  // entrance — the ask reads first, the toy lands, the dock docks. An
  // emailed build link (o=1) lands INSIDE the fullscreen demo: the entrance
  // would play unseen behind the overlay (and can wedge hidden when the
  // overlay freezes the page scroll), so the section rests shown instead.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const landsInDemo =
        new URLSearchParams(window.location.search).get("o") === "1";
      if (reducedMotion() || landsInDemo) {
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
          q("[data-anim='bld-stage']"),
          { autoAlpha: 0, y: 34, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 },
          "-=0.45"
        )
        // opacity only — the dock is positioned by a CSS % transform, and a
        // GSAP x-tween would bake it to px inline (breaks on breakpoint flip)
        .fromTo(
          q("[data-anim='bld-dock']"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6, ease: EASE_UI },
          "-=0.3"
        )
        .fromTo(
          q("[data-anim='bld-after']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          "-=0.35"
        );
    },
    { scope: root }
  );

  // tab swaps re-assemble the page (skin/accent swaps morph via CSS
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

  /* ── the ghost self-demo — while nobody has touched the toy, a cursor
     drifts in, flips to the second tab, waits for the site to reassemble,
     clicks its CTA, and an enquiry toast lands. Plays ONCE, on the
     showreel's clock rules (in view, tab visible), and dies for good the
     moment the visitor hovers or touches anything — a demo should never
     fight the player for the controls. ── */
  useGSAP(
    (context) => {
      if (reducedMotion()) return;
      const frame = root.current?.querySelector(".ms-frame") as HTMLElement | null;
      const cursor = root.current?.querySelector(".ms-cursor") as HTMLElement | null;
      const toast = root.current?.querySelector(".ms-toast") as HTMLElement | null;
      if (!frame || !cursor || !toast) return;

      const rest = () => gsap.set([cursor, toast], { autoAlpha: 0 });
      rest();

      // a point inside a (lazily queried) element, relative to the frame —
      // lazy because tab flips re-render the canvas under the cursor
      const spot = (sel: string, fx: number, fy: number) => {
        const el = frame.querySelector(sel) as HTMLElement | null;
        if (!el) return { x: 0, y: 0 };
        const f = frame.getBoundingClientRect();
        const b = el.getBoundingClientRect();
        return {
          x: b.left - f.left + b.width * fx,
          y: b.top - f.top + b.height * fy,
        };
      };
      const sx = (sel: string, fx = 0.62, fy = 0.72) => () => spot(sel, fx, fy).x;
      const sy = (sel: string, fx = 0.62, fy = 0.72) => () => spot(sel, fx, fy).y;

      const flipTo = INDUSTRIES[1].id;
      const tabSel = `[data-tab="${flipTo}"]`;

      const tl = gsap.timeline({ paused: true });
      tl.to({}, { duration: 1.8 }) // let the entrance settle first
        .set(cursor, { x: sx(".ms-canvas", 0.58, 0.42), y: sy(".ms-canvas", 0.58, 0.42), scale: 1 })
        .to(cursor, { autoAlpha: 1, duration: 0.35, ease: EASE_UI })
        .to(cursor, { x: sx(tabSel, 0.55, 0.62), y: sy(tabSel, 0.55, 0.62), duration: 1.15, ease: EASE_STRUCTURE }, "<+0.05")
        .to(cursor, { scale: 0.82, duration: 0.11, yoyo: true, repeat: 1, ease: EASE_UI })
        .call(() => {
          if (!touchedRef.current) setIndustry(flipTo);
        })
        .to({}, { duration: 1.6 }) // watch it reassemble
        .to(cursor, { x: sx(".ms-btn"), y: sy(".ms-btn"), duration: 1.1, ease: EASE_STRUCTURE })
        .to(cursor, { scale: 0.82, duration: 0.11, yoyo: true, repeat: 1, ease: EASE_UI })
        .call(() => {
          const btn = frame.querySelector(".ms-btn");
          if (btn) gsap.fromTo(btn, { scale: 0.94 }, { scale: 1, duration: 0.3, ease: EASE_UI });
        })
        .fromTo(
          toast,
          { autoAlpha: 0, y: -13 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE_UI },
          ">+0.12"
        )
        .to(cursor, { autoAlpha: 0, duration: 0.4 }, ">+0.35")
        .to(toast, { autoAlpha: 0, y: -8, duration: 0.45, ease: EASE_UI }, ">+1.7");
      ghostRef.current = tl;

      let inView = false;
      let played = false;
      tl.eventCallback("onComplete", () => {
        played = true;
      });
      const sync = () => {
        if (touchedRef.current || played) return;
        if (inView && !document.hidden) tl.play();
        else tl.pause();
      };
      ScrollTrigger.create({
        trigger: frame,
        start: "top 80%",
        end: "bottom 10%",
        onToggle: (self) => {
          inView = self.isActive;
          sync();
        },
        // late refreshes (fonts, images, the pinned chapters above settling)
        // can silently flip the window while the page sits still — re-sync
        onRefresh: (self) => {
          inView = self.isActive;
          sync();
        },
      });
      // they're reaching for it — the demo gets out of the way for good
      const onEnter = () => {
        tl.kill();
        ghostRef.current = null;
        rest();
      };
      frame.addEventListener("pointerenter", onEnter);
      document.addEventListener("visibilitychange", sync);
      context.add(() => () => {
        frame.removeEventListener("pointerenter", onEnter);
        document.removeEventListener("visibilitychange", sync);
      });
    },
    { scope: root }
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
      (root.current?.querySelector(".ms-open") as HTMLElement | null)?.focus();
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
      className="bld relative py-fib-6"
    >
      <div className="wrap">
        {/* header and the name input share ONE row (the input fills what was
            a dead right half) so the ask and the toy it drives meet in the
            same viewport instead of stacking across two */}
        <div className="grid grid-cols-1 gap-fib-4 md:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] md:items-end">
          <div>
            <p data-anim="bld-head" className="t-meta text-ink/60">
              Build yours
            </p>
            <h2 data-anim="bld-head" className="t-display-lg mt-fib-2 max-w-[15ch]">
              What would yours look like?
            </h2>
            <p data-anim="bld-head" className="t-lede mt-fib-3 max-w-[52ch] text-ink/70">
              This one is yours: type your name, flip through the tabs, tap a
              color. Sixty seconds, no signup.
            </p>
          </div>

          {/* the one written ask — your name, at display size */}
          <div data-anim="bld-head" className="bld-nameline w-full md:justify-self-end">
            <input
              className="bld-name"
              type="text"
              maxLength={40}
              autoComplete="organization"
              placeholder="Type your business name"
              aria-label="Your business name"
              value={name}
              onInput={(e) => {
                setName(e.currentTarget.value);
                touch();
              }}
            />
          </div>
        </div>

        <div className="mt-fib-4 flex flex-col gap-fib-4">
          {/* the toy — tabs on the frame, the dot-dock on its edge */}
          <div data-anim="bld-stage" className="bld-stagewrap">
            <MiniSite
              pack={pack}
              skin={skin}
              accent={accent}
              name={name}
              onOpen={() => {
                touch();
                setOpen(true);
              }}
              onPickIndustry={(id) => {
                setIndustry(id);
                touch();
              }}
            />
            <div
              data-anim="bld-dock"
              className="bld-dock"
              role="group"
              aria-label="Color and look"
            >
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="dock-dot"
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
              <span className="dock-sep" aria-hidden />
              {SKINS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`dock-dot dock-skin--${s.id}`}
                  aria-pressed={skin === s.id}
                  aria-label={`The look: ${s.label}`}
                  title={s.label}
                  onClick={() => {
                    setSkin(s.id as SkinId);
                    touch();
                  }}
                />
              ))}
            </div>
          </div>

          {/* the follow-through */}
          <div
            data-anim="bld-after"
            className="bld-after max-md:order-3 flex flex-wrap items-center justify-between gap-fib-3 md:justify-end md:gap-fib-4"
          >
            <p className="t-meta text-ink/45">
              {brand} · sketched in 60 seconds
            </p>
            <a href="#contact" className="bld-real">
              make it real
              <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 13 13 3M5.5 3H13v7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
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
