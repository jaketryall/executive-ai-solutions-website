"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, vtName } from "@/lib/work";
import { Monogram } from "@/components/ui/monogram";
import { CTA } from "@/components/ui/cta";
import { whenArrived } from "@/components/anim/arrival";
import {
  gsap,
  Observer,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  EASE_LOOP,
  reducedMotion,
} from "@/components/anim/ease";

// The work index as a LEDGER THAT NEVER ENDS. Split stage: the left side is
// a rolling reel of project names (ghosted paper type; the focused entry
// fills to full paper), the right side is one fixed imagery frame where
// covers trade places with a directional wipe. A wheel tick / swipe / arrow key turns the ledger one entry; the
// list loops forever, so "This spot is open" comes back around every cycle —
// the loop itself is the pitch.
//
// No document scroll in stage mode: GSAP Observer owns the input, the page
// is one viewport, and the geometry is static — which is exactly what the
// route-transition morphs need. Below 821px / reduced motion / no JS the
// stage yields to a normal-flow list (.wki-flow): same content, no tricks.

type Slot = {
  key: string;
  name: string;
  sector: string;
  meta: string;
  desc: string;
  href: string;
  cta: string;
  project?: (typeof PROJECTS)[number];
};

const SLOTS: Slot[] = [
  ...PROJECTS.map((p) => ({
    key: p.slug,
    name: p.listName,
    sector: p.sector,
    meta: `${p.kind} · ${p.year} · ${p.status}`,
    desc: p.lede,
    href: `/work/${p.slug}`,
    cta: "Open the case",
    project: p,
  })),
  {
    key: "open-slot",
    name: "This spot is open",
    sector: "Your industry",
    meta: "The next build · 2026",
    desc: "Price your project in about sixty seconds and see what your business looks like on this screen.",
    href: "/#estimate",
    cta: "Get an estimate",
  },
];

const N = SLOTS.length;
const COPIES = 4; // reel repeats; the wrap-jump inside one copy is invisible

export function WorkIndex() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const navEl = document.querySelector(".site-nav");

      if (reducedMotion()) {
        gsap.set([navEl, ...q("[data-anim]")], { autoAlpha: 1 });
        return; // flow list, standing still
      }

      const mm = gsap.matchMedia();

      // ─────────────────────────── the stage (≥821px) ───────────────────────────
      mm.add("(min-width: 821px)", () => {
        const section = root.current;
        section.classList.add("is-live");
        document.documentElement.classList.add("wki-lock");

        const stage = q(".wki-stage")[0] as HTMLElement;
        const reel = q(".wki-reel")[0] as HTMLElement;
        const rows = q(".wki-reel .wki-row") as HTMLElement[];
        const windowEl = q(".wki-reel-window")[0] as HTMLElement;
        const frame = q(".wki-frame")[0] as HTMLElement;
        const layers = q(".wki-layer") as HTMLElement[];
        const imgs = layers.map((l) => l.querySelector(".wki-media"));
        const veils = layers.map((l) => l.querySelector(".wki-veil"));
        const infos = q(".wki-info-item") as HTMLElement[];
        const chips = q(".wki-chip") as HTMLElement[];
        const count = q(".wki-count .t-num")[0] as HTMLElement;
        const frameLink = q(".wki-frame-link")[0] as HTMLAnchorElement;

        // pos is an unbounded reel index; the visible slot is pos % N.
        // Start in the second copy so there's always a copy above and below.
        let pos = N;
        let drift: gsap.core.Tween | null = null;
        let animating = false;
        const slotOf = (p: number) => ((p % N) + N) % N;
        const rowH = () => rows[0].offsetHeight;

        const paint = (p: number) => {
          const s = slotOf(p);
          rows.forEach((r, i) => {
            r.setAttribute("data-active", String(i === p));
            // only the focused row navigates; the rest turn the reel
            // (data-no-vt also tells the transition provider to stand down)
            r.toggleAttribute("data-no-vt", i !== p);
          });
          infos.forEach((el, i) => (el.dataset.on = String(i === s)));
          chips.forEach((c) =>
            c.setAttribute(
              "data-active",
              String(c.dataset.sector === SLOTS[s].sector),
            ),
          );
          if (count) count.textContent = `0${s + 1} / 0${N}`;
          // the morph rides the frame only for a real project; JS owns the
          // name so the hidden flow list never duplicates it
          const slug = SLOTS[s].project?.slug;
          frame.style.viewTransitionName = slug ? vtName(slug) : "";
          frame.setAttribute("data-open", SLOTS[s].project ? "false" : "true");
          if (frameLink) {
            frameLink.href = SLOTS[s].href;
            frameLink.setAttribute(
              "aria-label",
              SLOTS[s].project
                ? `${SLOTS[s].name}: open the case study`
                : SLOTS[s].cta,
            );
          }
        };

        const setReel = (p: number) => {
          gsap.set(reel, { y: -(p - 1) * rowH() });
        };

        // the ambient: the focused cover breathes, slowly (the one ambient)
        const breathe = (s: number) => {
          drift?.kill();
          const img = imgs[s];
          if (!img) return;
          drift = gsap.fromTo(
            img,
            { scale: 1 },
            {
              scale: 1.05,
              duration: 9,
              ease: EASE_LOOP,
              yoyo: true,
              repeat: -1,
            },
          );
        };

        // ── the turn: one dramatic step, direction-aware ──
        const step = (dir: 1 | -1, jumpTo?: number) => {
          if (animating) return;
          const from = slotOf(pos);
          const nextPos = jumpTo !== undefined ? jumpTo : pos + dir;
          const to = slotOf(nextPos);
          if (to === from) return;
          animating = true;
          drift?.kill();

          const inLayer = layers[to];
          const inImg = imgs[to];
          const outLayer = layers[from];

          // incoming rides on top and wipes open against the travel direction
          gsap.set(inLayer, {
            zIndex: 3,
            clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
            scale: 1,
            autoAlpha: 1,
          });
          if (veils[to]) gsap.set(veils[to], { opacity: 0 });
          if (inImg) gsap.set(inImg, { scale: 1.14 });

          const tl = gsap.timeline({
            defaults: { ease: EASE_STRUCTURE },
            onComplete: () => {
              // outgoing sinks back to the pile, cleaned for its next turn
              gsap.set(outLayer, {
                zIndex: 1,
                autoAlpha: 0,
                clipPath: "inset(0% 0% 0% 0%)",
                scale: 1,
              });
              if (veils[from]) gsap.set(veils[from], { opacity: 0 });
              gsap.set(inLayer, { zIndex: 2 });
              // seamless wrap: re-center pos inside the middle copies
              // (full repaint — data-active AND data-no-vt must follow the move)
              if (pos < N || pos >= 3 * N) {
                pos += pos < N ? N : -N;
                setReel(pos);
                paint(pos);
              }
              breathe(to);
              animating = false;
            },
          });

          // the reel turns one entry
          pos = jumpTo !== undefined ? jumpTo : pos + dir;
          tl.to(reel, { y: -(pos - 1) * rowH(), duration: 0.85 }, 0);

          // the covers trade places
          tl.to(
            inLayer,
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 },
            0.02,
          )
            .to(inImg, { scale: 1, duration: 1.15 }, 0.02)
            .to(outLayer, { scale: 0.94, duration: 0.9 }, 0);
          if (veils[from])
            tl.to(veils[from], { opacity: 0.45, duration: 0.6 }, 0);

          // the ledger line swaps
          tl.to(
            infos[from],
            { autoAlpha: 0, y: -12, duration: 0.3, ease: EASE_UI },
            0,
          ).fromTo(
            infos[to],
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE_UI },
            0.3,
          );

          // the counter ticks
          if (count) {
            tl.to(
              count,
              { yPercent: -60, autoAlpha: 0, duration: 0.22, ease: EASE_UI },
              0,
            ).add(() => {
              count.textContent = `0${to + 1} / 0${N}`;
            });
            tl.fromTo(
              count,
              { yPercent: 60, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: EASE_UI },
              0.26,
            );
          }

          paint(pos);
        };

        // jump with the shortest turn (chips, inactive rows)
        const jump = (targetSlot: number) => {
          const cur = slotOf(pos);
          if (targetSlot === cur || animating) return;
          let delta = targetSlot - cur;
          if (delta > N / 2) delta -= N;
          if (delta < -N / 2) delta += N;
          step(delta > 0 ? 1 : -1, pos + delta);
        };

        // ── input: the Observer owns the wheel/touch; keys mirror it ──
        const obs = Observer.create({
          target: stage,
          type: "wheel,touch",
          wheelSpeed: -1,
          tolerance: 12,
          preventDefault: true,
          onDown: () => step(-1),
          onUp: () => step(1),
        });

        const onKey = (e: KeyboardEvent) => {
          if (e.key === "ArrowDown" || e.key === "PageDown") {
            e.preventDefault();
            step(1);
          } else if (e.key === "ArrowUp" || e.key === "PageUp") {
            e.preventDefault();
            step(-1);
          }
        };
        window.addEventListener("keydown", onKey);

        // rows: the focused row is a real link; the others turn the reel
        const rowHandlers = rows.map((row, i) => {
          const h = (e: MouseEvent) => {
            if (i !== pos) {
              e.preventDefault();
              jump(slotOf(i));
            }
          };
          row.addEventListener("click", h);
          return h;
        });
        const chipHandlers = chips.map((chip) => {
          const h = () => {
            const idx = SLOTS.findIndex(
              (s) => s.sector === chip.dataset.sector,
            );
            if (idx >= 0) jump(idx);
          };
          chip.addEventListener("click", h);
          return h;
        });

        // ── the cursor pill over the frame (reel grammar) ──
        let pillCleanup: (() => void) | undefined;
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          const cursor = q(".wki-cursor")[0] as HTMLElement;
          const pill = cursor?.querySelector(".rc-pill") as HTMLElement | null;
          if (cursor && pill) {
            const xTo = gsap.quickTo(cursor, "x", {
              duration: 0.35,
              ease: EASE_UI,
            });
            const yTo = gsap.quickTo(cursor, "y", {
              duration: 0.35,
              ease: EASE_UI,
            });
            let shown = false;
            const move = (e: MouseEvent) => {
              const r = frame.getBoundingClientRect();
              xTo(e.clientX - r.left);
              yTo(e.clientY - r.top);
              const over = frame.getAttribute("data-open") !== "true";
              if (over !== shown) {
                shown = over;
                gsap.to(pill, {
                  scale: over ? 1 : 0.5,
                  autoAlpha: over ? 1 : 0,
                  duration: 0.35,
                  ease: EASE_UI,
                });
              }
            };
            const leave = () => {
              shown = false;
              gsap.to(pill, {
                scale: 0.5,
                autoAlpha: 0,
                duration: 0.3,
                ease: EASE_UI,
              });
            };
            gsap.set(pill, { scale: 0.5, autoAlpha: 0 });
            frame.addEventListener("mousemove", move);
            frame.addEventListener("mouseleave", leave);
            pillCleanup = () => {
              frame.removeEventListener("mousemove", move);
              frame.removeEventListener("mouseleave", leave);
            };
          }
        }

        // ── first paint + the held entrance ──
        layers.forEach((l, i) =>
          gsap.set(l, { autoAlpha: i === slotOf(pos) ? 1 : 0 }),
        );
        // the cover rides the transition sheet at its entrance start-scale so
        // the settle begins from what was already on screen (no pop at landing)
        if (imgs[slotOf(pos)]) gsap.set(imgs[slotOf(pos)], { scale: 1.1 });
        setReel(pos);
        paint(pos);
        const onResize = () => setReel(pos);
        window.addEventListener("resize", onResize);

        let dead = false;
        const enter = contextSafe!(() => {
          if (navEl)
            gsap.to(navEl, {
              autoAlpha: 1,
              duration: 0.6,
              ease: EASE_STRUCTURE,
            });
          gsap
            .timeline({ defaults: { ease: EASE_STRUCTURE } })
            .fromTo(
              imgs[slotOf(pos)],
              { scale: 1.1 },
              {
                scale: 1,
                duration: 1.3,
                onComplete: () => breathe(slotOf(pos)),
              },
            )
            .fromTo(
              windowEl,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.5, ease: EASE_UI },
              0.1,
            )
            .fromTo(
              rows.slice(Math.max(0, pos - 1), pos + 2),
              { yPercent: 45 },
              { yPercent: 0, duration: 0.9, stagger: 0.07 },
              0.1,
            )
            .fromTo(
              q("[data-anim='wki-chrome']"),
              { autoAlpha: 0, y: 10 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                stagger: 0.07,
                ease: EASE_UI,
              },
              0.45,
            )
            .fromTo(
              infos[slotOf(pos)],
              { autoAlpha: 0, y: 14 },
              { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
              0.55,
            );
        });
        whenArrived().then(() => !dead && enter());

        return () => {
          dead = true;
          obs.kill();
          drift?.kill();
          window.removeEventListener("keydown", onKey);
          window.removeEventListener("resize", onResize);
          rows.forEach((r, i) =>
            r.removeEventListener("click", rowHandlers[i]),
          );
          chips.forEach((c, i) =>
            c.removeEventListener("click", chipHandlers[i]),
          );
          pillCleanup?.();
          frame.style.viewTransitionName = "";
          section.classList.remove("is-live");
          document.documentElement.classList.remove("wki-lock");
        };
      });

      // ─────────────────────── the flow (mobile / fallback) ───────────────────────
      mm.add("(max-width: 820px)", () => {
        // the morphs ride the flow wells here; assigned in JS so the two
        // subtrees never carry duplicate view-transition-names at once
        const wells = q(".wki-fcard [data-slug]") as HTMLElement[];
        wells.forEach(
          (w) => (w.style.viewTransitionName = vtName(w.dataset.slug!)),
        );

        let dead = false;
        const enter = contextSafe!(() => {
          if (navEl)
            gsap.to(navEl, {
              autoAlpha: 1,
              duration: 0.6,
              ease: EASE_STRUCTURE,
            });
          gsap.fromTo(
            q("[data-anim='wki-head']"),
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE_UI },
          );
          const cards = q(".wki-fcard") as HTMLElement[];
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { autoAlpha: 0, y: 34 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: EASE_STRUCTURE,
                scrollTrigger: { trigger: card, start: "top 85%" },
              },
            );
          });
          ScrollTrigger.refresh();
        });
        whenArrived().then(() => !dead && enter());

        return () => {
          dead = true;
          wells.forEach((w) => (w.style.viewTransitionName = ""));
        };
      });
    },
    { scope: root },
  );

  const sectors = SLOTS.map((s) => s.sector);

  return (
    <section ref={root} data-nav="dark" className="wki" aria-label="The work">
      <h1 className="sr-only">The work</h1>

      {/* ═══════════ the stage (desktop, driver alive) ═══════════ */}
      <div className="wki-stage" aria-hidden={false}>
        {/* left — the ledger */}
        <div className="wki-left">
          <div className="wki-top">
            <p className="wki-label t-meta" data-anim="wki-chrome">
              The work
            </p>
            <div
              className="wki-sectors"
              data-anim="wki-chrome"
              role="group"
              aria-label="Sectors"
            >
              {sectors.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="wki-chip"
                  data-sector={s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="wki-reel-window" data-anim>
            <div className="wki-reel">
              {Array.from({ length: COPIES }).flatMap((_, c) =>
                SLOTS.map((s, i) => (
                  <Link
                    key={`${c}-${s.key}`}
                    href={s.href}
                    className="wki-row"
                    data-active="false"
                    tabIndex={c === 1 ? 0 : -1}
                    aria-label={
                      s.project
                        ? `${s.project.client}: open the case study`
                        : s.name
                    }
                  >
                    {s.name}
                  </Link>
                )),
              )}
            </div>
          </div>

          <div className="wki-infos">
            {SLOTS.map((s, i) => (
              <div
                key={s.key}
                className="wki-info-item"
                data-on={String(i === 0)}
              >
                <p className="t-meta wki-kicker">
                  <span className="t-num">0{i + 1}</span> · {s.meta} ·{" "}
                  {s.sector}
                </p>
                <p className="wki-desc">{s.desc}</p>
                <CTA
                  href={s.href}
                  label={s.cta}
                  tone="paper"
                  className="mt-fib-3"
                />
              </div>
            ))}
          </div>
        </div>

        {/* right — the frame */}
        <div className="wki-right">
          <div className="wki-frame" data-open="false">
            {SLOTS.map((s) => (
              <div key={s.key} className="wki-layer">
                {s.project ? (
                  <>
                    <div className="wki-media">
                      {/* the crop zoom lives on its own wrapper — GSAP tweens
                          the media node and would wipe a static scale there */}
                      <span
                        className="wki-zoom"
                        style={
                          s.project.backdropCrop
                            ? {
                                transform: `scale(${s.project.backdropCrop.zoom})`,
                                transformOrigin: s.project.backdropCrop.origin,
                              }
                            : undefined
                        }
                      >
                        <Image
                          src={(s.project.backdrop ?? s.project.cover).src}
                          alt={(s.project.backdrop ?? s.project.cover).alt}
                          fill
                          sizes="(min-width: 821px) 52vw, 100vw"
                          className="wki-img"
                          priority={s.key === SLOTS[0].key}
                          style={
                            s.project.backdropCrop
                              ? {
                                  objectPosition: s.project.backdropCrop.origin,
                                }
                              : undefined
                          }
                        />
                      </span>
                    </div>
                    <span className="wki-grade" aria-hidden />
                  </>
                ) : (
                  <div className="wki-media closer-card wki-open-face">
                    <Monogram className="h-fib-4 w-fib-4 opacity-80" />
                    <p className="t-display-lg">
                      Your business, on this screen
                    </p>
                    <span className="wki-open-pill" aria-hidden>
                      Get an estimate
                      <svg viewBox="0 0 16 16" fill="none">
                        <path
                          d="M3 13 13 3M5.5 3H13v7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                )}
                <span className="wki-veil" aria-hidden />
              </div>
            ))}

            {/* the click target — a real anchor so the route transition
                (document-level link listener) owns the navigation */}
            <a
              className="wki-frame-link"
              href={SLOTS[0].href}
              aria-label={`${SLOTS[0].name}: open the case study`}
            />

            {/* the pointer pill (reel-cursor grammar) */}
            <div className="reel-cursor wki-cursor" aria-hidden>
              <span className="rc-center">
                <span className="rc-pill">
                  Open the case
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 13 13 3M5.5 3H13v7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </div>
          </div>
          <p className="wki-count t-meta" data-anim="wki-chrome" aria-hidden>
            <span className="t-num">01 / 0{N}</span>
          </p>
        </div>
      </div>

      {/* ═══════════ the flow (mobile / reduced motion / no JS) ═══════════ */}
      <div className="wki-flow">
        <header className="wki-fhead">
          <p className="t-meta wki-label" data-anim="wki-head">
            The work
          </p>
          <div className="wki-sectors" data-anim="wki-head">
            {sectors.map((s, i) => (
              <a key={s} href={`#wki-${SLOTS[i].key}`} className="wki-chip">
                {s}
              </a>
            ))}
          </div>
        </header>

        {SLOTS.map((s, i) => (
          <article key={s.key} id={`wki-${s.key}`} className="wki-fcard">
            <Link href={s.href} className="wki-fwell-link" aria-label={s.name}>
              {s.project ? (
                <span className="wki-fwell" data-slug={s.project.slug}>
                  <Image
                    src={s.project.cover.src}
                    alt={s.project.cover.alt}
                    fill
                    sizes="92vw"
                    className="wki-img"
                  />
                </span>
              ) : (
                <span className="wki-fwell closer-card wki-open-face">
                  <Monogram className="h-[26px] w-[26px] opacity-80" />
                  <span className="t-display-lg">Your business, here</span>
                </span>
              )}
            </Link>
            <p className="t-meta wki-kicker">
              <span className="t-num">0{i + 1}</span> · {s.meta} · {s.sector}
            </p>
            <Link href={s.href} className="wki-fname t-display-lg">
              {s.name}
            </Link>
            <p className="wki-desc">{s.desc}</p>
            <CTA
              href={s.href}
              label={s.cta}
              tone="paper"
              className="mt-fib-3"
            />
          </article>
        ))}
      </div>
    </section>
  );
}
