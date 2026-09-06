"use client";

import { useEffect } from "react";

/* THE SCROLL ENGINE — one loop, one measurement pass, N effects.
   Modelled on how landonorris.com does it, decoded rather than guessed:
   there, a section DECLARES what it wants in data attributes
   (`data-h-color-from="dark-green"`), and one generic engine resolves it,
   computes progress, and writes the result every frame. Adding an effect
   there is two attributes, not new code. That is the part worth copying —
   not any single effect.

   Before this, the dark room ran FOUR scroll listeners and FIVE rAF loops,
   each independently calling getBoundingClientRect on its own elements.
   Every one of those measurements happens in the same frame anyway, so
   they were paying for the same layout read several times over.

   WHAT IT WRITES, and nothing more:
     --sp   0 → 1, this element's progress through its declared window
     --spx  the same progress in pixels of viewport travel

   ONE-SHOTS are the single exception, and the grammar's (law 11): the
   structure is scrubbed, the TEXT is triggered — once, in one
   vocabulary, from the same measurement pass. See `Shot` below.

   DAMPING, opt-in per element with data-sp-lerp.
   Decoded off landonorris.com, and it corrected my first reading of that
   site. It is not quite "the value IS f(scroll)": a scroll jump moves
   their scroll position instantly, but the transform takes 700-900ms to
   arrive, easing the whole way, with transitionDuration 0s. So there are
   TWO smoothing layers — Lenis smooths the INPUT, and each effect then
   chases its scroll-derived TARGET:

     target   = f(scrollY)              // derived, path-independent
     current += (target - current) * k  // k ~= 0.1

   Their Lenis runs lerp: 0.1, which is the same constant, so it is
   plausibly one number driving both.

   NOT everything should damp. On the same site the background COLOUR
   resolves within a single frame while transforms chase — so this is
   opt-in, and an element without data-sp-lerp behaves exactly as before.

   GROUND COLOUR, opt-in with data-bg-from / data-bg-to.
   The one genuinely architectural thing on landonorris.com: a section
   DECLARES named colours and a generic engine resolves them against the
   palette, lerps, and writes. Adding a colour change there is two
   attributes, not new code. Names resolve against this room's own CSS
   custom properties, so nothing is duplicated — `void` reads --void.

   Eased, not linear: their sweep fits 2t - t^2 (ease-out quadratic) to
   within +/-0.03, which is measurably not a straight lerp.

   This is the ONE place the engine writes something other than a custom
   property, because a page ground has no other home.

   Otherwise it deliberately does NOT animate anything. The engine
   produces INPUTS;
   the stylesheet turns them into motion with calc(). That split is what
   keeps every effect in this room a pure function of scroll position —
   scrub backwards and it runs backwards exactly, land mid-page and the
   frame is already right, because there is no state to be out of sync. */

type Track = {
  el: HTMLElement;
  /** viewport fraction where progress reads 0 (1 = the fold, 0 = the top) */
  from: number;
  /** viewport fraction where progress reads 1 */
  to: number;
  /** which edge of the element is measured against those marks */
  edge: "top" | "bottom";
  /** custom property to write the 0→1 value into */
  varName: string;
  /** 0 = write the target directly. >0 = chase it at this rate per frame. */
  lerp: number;
  /** the damped value, carried between frames */
  current: number;
  /** ground colour ramp, resolved from named tokens. null = not declared. */
  bg: { from: RGB; to: RGB; target: HTMLElement } | null;
};

type RGB = [number, number, number];

/** #rgb / #rrggbb / rgb(...) → [r,g,b]. Returns null on anything else. */
function parseColor(v: string): RGB | null {
  const t = v.trim();
  const hex = t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1];
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as RGB;
  }
  const rgb = t.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const n = rgb[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (n.length >= 3 && n.slice(0, 3).every(Number.isFinite)) {
      return [n[0], n[1], n[2]] as RGB;
    }
  }
  return null;
}

/** a token NAME ("void") resolved against --void on the room's root */
function token(root: Element, name: string): RGB | null {
  const raw = name.trim();
  const direct = parseColor(raw);
  if (direct) return direct;
  const v = getComputedStyle(root).getPropertyValue(`--${raw}`);
  return v ? parseColor(v) : null;
}

const num = (v: string | null, fallback: number) => {
  const n = v === null ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};

/* ONE-SHOTS — the only triggered things in the room (grammar law 11):
   scrub the structure, trigger only the text, and trigger it with ONE
   gesture everywhere. Declared like everything else:
     data-once             add `is-in` when this element's top crosses
                           90% of the viewport; data-once-at="0.86" moves
                           the line
     data-wipe             THE vocabulary. The element is split into its
                           rendered lines; each line clip-wipes left to
                           right behind a bar of light — 600ms a line,
                           150ms between lines, the bar retreating from
                           +300ms — once, at top 90%, so the heading has
                           finished before it is in the reading zone
     data-wipe-delay="150" ms before the first line, so a heading can
                           follow its kicker
   Fired from the same pass as the scrubs: one rect read a frame until
   it fires, nothing after. An IntersectionObserver would be a second
   system saying the same thing on a different clock. */
type Shot = {
  el: HTMLElement;
  /** viewport fraction the element's top must cross */
  at: number;
  cls: string;
  wipe: boolean;
  /** ms before the first line (wipes only) */
  wd: number;
  /** puts the plain text back; null when no lines exist */
  undo: (() => void) | null;
  /** how long the whole wipe runs, so the lines can be unmade after it */
  ms: number;
};

const WIPE_LINE = 600;
const WIPE_STAGGER = 150;
const WIPE_BAR = 300;

function readShot(el: HTMLElement): Shot {
  const wipe = el.hasAttribute("data-wipe");
  const wd = wipe ? num(el.getAttribute("data-wipe-delay"), 0) : 0;
  if (wipe) el.style.setProperty("--wd", `${wd}ms`);
  return {
    el,
    at: num(el.getAttribute(wipe ? "data-wipe-at" : "data-once-at"), 0.9),
    cls: wipe ? "is-wiped" : "is-in",
    wipe,
    wd,
    undo: null,
    ms: 0,
  };
}

/* Split an element's text into one block span per RENDERED line. The
   words are laid inline first and grouped by where the browser actually
   put them, then rebuilt as lines — so `text-wrap: balance`, the measure
   and the alignment all stay the browser's, never a guess. Plain-text
   elements only, which every heading in this room is; the original
   markup is kept and put back once the wipe has run, so a resize after
   it reflows as ordinary text. */
function splitLines(el: HTMLElement): { n: number; undo: () => void } {
  const html = el.innerHTML;
  const words = (el.textContent || "").split(/\s+/).filter(Boolean);
  el.textContent = "";
  const probes = words.map((w) => {
    const s = document.createElement("span");
    s.textContent = w;
    el.append(s, " ");
    return s;
  });
  const lines: string[][] = [];
  let top = NaN;
  for (const s of probes) {
    const t = s.getBoundingClientRect().top;
    // a new line is a real step down, not a sub-pixel wobble
    if (!(Math.abs(t - top) < 2)) {
      lines.push([]);
      top = t;
    }
    lines[lines.length - 1].push(s.textContent || "");
  }
  el.textContent = "";
  lines.forEach((ws, i) => {
    const l = document.createElement("span");
    l.className = "dr-wl";
    l.style.setProperty("--l", String(i));
    l.textContent = ws.join(" ");
    el.append(l);
  });
  // a line hugs its own words, so the alignment has to be carried over
  const align = getComputedStyle(el).textAlign;
  el.classList.toggle("is-c", align === "center");
  el.classList.toggle("is-r", align === "right" || align === "end");
  return {
    n: lines.length,
    undo: () => {
      el.innerHTML = html;
      el.classList.remove("is-c", "is-r", "is-wiped");
    },
  };
}

function readBg(el: HTMLElement): Track["bg"] {
  const fromName = el.getAttribute("data-bg-from");
  const toName = el.getAttribute("data-bg-to");
  if (!fromName || !toName) return null;
  const target =
    (el.closest<HTMLElement>(el.getAttribute("data-bg-target") || ".dr-root")) ??
    document.body;
  const from = token(target, fromName);
  const to = token(target, toName);
  // an unresolvable name is a typo, and silently painting black over the
  // page would be a worse failure than doing nothing
  if (!from || !to) return null;
  return { from, to, target };
}

function read(el: HTMLElement): Track {
  return {
    el,
    from: num(el.getAttribute("data-sp-from"), 1),
    to: num(el.getAttribute("data-sp-to"), 0),
    edge: el.getAttribute("data-sp-edge") === "bottom" ? "bottom" : "top",
    varName: el.getAttribute("data-sp-var") || "--sp",
    bg: readBg(el),
    lerp: Math.max(0, Math.min(1, num(el.getAttribute("data-sp-lerp"), 0))),
    current: NaN, // first frame snaps, so nothing eases in from zero on load
  };
}

export function useScrollEngine(deps: unknown[] = []) {
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sp]")
    );
    const shots = Array.from(
      document.querySelectorAll<HTMLElement>("[data-once], [data-wipe]")
    ).map(readShot);
    if (!nodes.length && !shots.length) return;

    const tracks = nodes.map(read);

    if (still) {
      // resolved, not mid-flight: reduced motion gets the finished frame
      tracks.forEach((t) => {
        t.el.style.setProperty(t.varName, "1");
        if (t.bg) {
          const [r, g, b] = t.bg.to;
          t.bg.target.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        }
      });
      // and the text is simply there: no lines are made, nothing wipes
      shots.forEach((s) => s.el.classList.add(s.cls));
      return;
    }

    /* the lines a wipe needs are made now, from the browser's own
       breaks — and remade whenever those breaks can change: the fonts
       arriving (Archivo swaps in late) or a resize. Only for wipes that
       have not fired; a fired one is already on its way back to text. */
    let alive = true;
    const made = shots.filter((s) => s.wipe);
    const timers: number[] = [];
    const split = (s: Shot) => {
      s.undo?.();
      const r = splitLines(s.el);
      s.undo = r.undo;
      s.ms = s.wd + (r.n - 1) * WIPE_STAGGER + WIPE_LINE + WIPE_BAR + 80;
    };
    const resplit = () => {
      if (alive) shots.forEach((s) => s.wipe && split(s));
    };
    resplit();
    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(resplit, 120);
    };
    addEventListener("resize", onResize);
    document.fonts?.ready.then(resplit);

    let frame = 0;
    /* a damped track has to keep being drawn after the scroll stops, or it
       freezes partway to its target. So the loop runs on while anything is
       still chasing, and idles the moment everything has arrived. */
    const draw = () => {
      frame = 0;
      const vh = window.innerHeight;
      let settling = false;

      for (const t of tracks) {
        const b = t.el.getBoundingClientRect();
        const mark = t.edge === "top" ? b.top : b.bottom;
        const from = vh * t.from;
        const to = vh * t.to;
        // guard a zero-length window rather than dividing by it
        const span = from - to;
        const p = span === 0 ? 1 : (from - mark) / span;
        const target = p < 0 ? 0 : p > 1 ? 1 : p;

        let value = target;
        if (t.lerp > 0) {
          if (Number.isNaN(t.current)) {
            t.current = target; // first paint lands on the real frame
          } else {
            t.current += (target - t.current) * t.lerp;
            // snap once the gap is below a pixel's worth of a 0→1 range,
            // so the loop can actually stop instead of chasing forever
            if (Math.abs(target - t.current) < 0.0004) t.current = target;
            else settling = true;
          }
          value = t.current;
        }

        t.el.style.setProperty(t.varName, String(value));
        t.el.style.setProperty(`${t.varName}x`, `${value * vh}px`);

        if (t.bg) {
          // ease-out quadratic, measured off the reference rather than
          // assumed — a straight lerp reads noticeably more mechanical
          const e = value * (2 - value);
          const c = t.bg.from.map((f, i) =>
            Math.round(f + (t.bg!.to[i] - f) * e)
          );
          t.bg.target.style.backgroundColor = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
        }
      }

      /* the one-shots: fire, forget — and once a wipe has run, hand the
         heading back as the plain text it was */
      for (let i = shots.length - 1; i >= 0; i--) {
        const s = shots[i];
        if (s.el.getBoundingClientRect().top < vh * s.at) {
          shots.splice(i, 1);
          s.el.classList.add(s.cls);
          if (s.undo) {
            timers.push(
              window.setTimeout(() => {
                s.undo?.();
                s.undo = null;
              }, s.ms)
            );
          }
        }
      }

      if (settling && !frame) frame = requestAnimationFrame(draw);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    draw();

    return () => {
      alive = false;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      removeEventListener("resize", onResize);
      clearTimeout(rt);
      timers.forEach(clearTimeout);
      made.forEach((s) => s.undo?.());
      if (frame) cancelAnimationFrame(frame);
      // hand the ground back to the stylesheet
      tracks.forEach((t) => {
        if (t.bg) t.bg.target.style.backgroundColor = "";
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
