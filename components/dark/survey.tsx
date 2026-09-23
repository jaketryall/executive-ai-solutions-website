"use client";

import { useEffect, useRef } from "react";

/* THE GROUND · `?v=survey` (step 1 of design-dna/lando-ground-plan.md,
   2026-09-22 — Jake: "i want a visually impressive animation … the lando
   site … its always moving" → "yes").

   WHAT HIS IS, measured (decodes/lando-census-2026-09-22.json): one fixed
   full-viewport canvas under the whole page drawing topographic contour
   lines that move ON THEIR OWN — no scroll, no mouse — at about 1–2% of
   the frame per 500ms, the lines one tint off the ground. It is the
   biggest reason his page is "always moving": 16 of his 31 census stops
   move at rest, ours 5, then 26 in a row where nothing does. His lines
   are his helmet's swirl; ours are plain hills (Jake, 2026-09-20: "can we
   take my logo out of the background" — a mark-derived field is a later
   token, his call only).

   WHAT THIS IS: one WebGL2 full-screen triangle. The height field is a
   time-warped fbm, so the lines MORPH in place rather than the sheet
   sliding (Jake, 2026-09-22: "i see the whole background move" — the
   cursor parallax on the atmos was a sheet sliding; this never is). The
   field travels up at a tenth of the scroll, Lando's hero ratio, so it
   reads as far behind the page. Each line is one device pixel,
   antialiased on fwidth.

   EACH SECTION DECLARES its ink (how visible) and drift (how alive) —
   Lando's sections declare their GL colours the same way
   (data-gl-change-from/to, lando-section-grammar §2.13). Kept here as one
   table instead of nine attributes while this is a trial. A section's
   values ease in as its top rises from the fold to mid-screen; drift
   scales the clock, so a section can slow the lines but never jump them.
   §02a is drift 0: Jake turned the room's lamps off for that screen, and
   Lando's own statement stop reads 0.00 at rest.

   STACKING: z-index −1 inside <main>'s stacking context (relative z-10),
   i.e. above the room's ground and under EVERY section — several §02
   sections are static and paint below the room's z 1–3 fixed layers, so
   anything at z ≥ 0 would draw over their words.

   COST: boots when idle, DPR capped at 1.25 (Lando's cap), 30fps while
   the lines are only drifting, full rate while the scroll or a section's
   values are moving, nothing when hidden or when drift and scroll are
   both still. Reduced motion: one still frame, no travel, no drift. No
   WebGL2: nothing is drawn and the page is exactly as it was. */

const FIELD: [selector: string, ink: number, drift: number][] = [
  [".dr-say-stage", 0.35, 0],
  [".dr-show", 0.6, 0.3],
  [".dr-more", 0.8, 0.7],
  [".dr-tiles", 0.8, 0.8],
  [".dr-work-zone", 1, 0.25],
  [".dr-voices", 1, 0.8],
  [".dr-runs", 1, 1],
  [".dr-obj", 1, 1],
  [".dr-close", 1, 0.8],
];
const HERO = { ink: 0.8, drift: 1 };

/* CALIBRATED against landonorris.com's own field, full-res crops of the
   census frames (2026-09-22): his lines sit ~+12 levels over olive and
   ~−40 under cream, smooth nested hills ~40–60px apart; at rest his
   field changes 0.9–1.8% of an empty crop per 700ms (|Δ|≥12). Ours: core
   +25 on the void (the room's vignette eats the edges, so the centre is
   set a little brighter), −33 on paper, 1.5–2% at rest. First cut was
   K 6 / 620px / 3 octaves / α .055 — wiggly, sparse and +2 levels: a
   field nobody could see. */
const K = 26.0; // contour levels per unit of height: line density
const SCALE = 1000; // CSS px per noise unit: how broad the hills are
const TRAVEL = 0.1; // field px per scroll px
const A_DARK = 0.1; // white line core on the void
const A_DAY = 0.14; // black line core on paper

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform float uScroll;
uniform float uTime;
uniform float uInk;
uniform float uDay;
uniform float uK;
uniform float uScale;
uniform float uA;
out vec4 o;

vec2 g(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
}
float n(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(dot(g(i), f), dot(g(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
             mix(dot(g(i + vec2(0, 1)), f - vec2(0, 1)), dot(g(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 2; i++) { s += a * n(p); p = p * 2.02 + vec2(17.1, 9.2); a *= 0.35; }
  return s;
}
void main() {
  vec2 css = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 q = (css + vec2(0.0, uScroll)) / uScale;
  /* the time lives in a domain warp, so the hills change shape where
     they stand instead of the whole field translating */
  vec2 w = vec2(fbm(q + vec2(0.0, uTime * 0.026)), fbm(q + vec2(5.2, 1.3) - vec2(uTime * 0.021, 0.0)));
  float h = uK * fbm(q + 0.3 * w);
  float d = abs(fract(h + 0.5) - 0.5) / max(fwidth(h), 1e-4);
  float line = 1.0 - clamp(d - 0.35, 0.0, 1.0);
  float a = uA * uInk * line;
  o = vec4(vec3(1.0 - uDay) * a, a);
}`;

export default function Survey() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cvs = cvsRef.current;
    if (!wrap || !cvs) return;
    let cancelled = false;
    let stop = () => {};

    const boot = () => {
      if (cancelled) return;
      const gl = cvs.getContext("webgl2", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
      if (!gl) return;

      const sh = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
        return s;
      };
      let prog: WebGLProgram;
      try {
        prog = gl.createProgram()!;
        gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
      } catch (e) {
        console.warn("[survey] shader failed", e);
        return;
      }
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const u = (name: string) => gl.getUniformLocation(prog, name);
      const U = {
        res: u("uRes"), dpr: u("uDpr"), scroll: u("uScroll"), time: u("uTime"), ink: u("uInk"),
        day: u("uDay"), k: u("uK"), scale: u("uScale"), a: u("uA"),
      };
      gl.uniform1f(U.k, K);
      gl.uniform1f(U.scale, SCALE);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const root = document.querySelector<HTMLElement>(".dr-root");

      /* size: CSS box × capped DPR, on resize only */
      let W = 0, H = 0, dpr = 1;
      const size = () => {
        const r = wrap.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        W = r.width;
        H = r.height;
        cvs.width = Math.max(1, Math.round(W * dpr));
        cvs.height = Math.max(1, Math.round(H * dpr));
        gl.viewport(0, 0, cvs.width, cvs.height);
        gl.uniform2f(U.res, W, H);
        gl.uniform1f(U.dpr, dpr);
        measure();
        dirty = true;
      };

      /* the sections' untransformed tops, in document order (offsetTop
         chain — a pinned or scaled section's box would lie) */
      let secs: { top: number; ink: number; drift: number }[] = [];
      const docTop = (el: HTMLElement) => {
        let y = 0;
        let e: HTMLElement | null = el;
        while (e) {
          y += e.offsetTop;
          e = e.offsetParent as HTMLElement | null;
        }
        return y;
      };
      const measure = () => {
        secs = [];
        for (const [sel, ink, drift] of FIELD) {
          const el = document.querySelector<HTMLElement>(sel);
          if (el) secs.push({ top: docTop(el), ink, drift });
        }
        secs.sort((a, b) => a.top - b.top);
      };

      let day = false;
      const readDay = () => {
        day = !!root?.classList.contains("dr-day");
        gl.uniform1f(U.day, day ? 1 : 0);
        gl.uniform1f(U.a, day ? A_DAY : A_DARK);
        dirty = true;
      };

      const resolve = (scroll: number) => {
        let ink = HERO.ink;
        let drift = HERO.drift;
        const vh = H || window.innerHeight;
        for (const s of secs) {
          const t = Math.min(1, Math.max(0, (vh - (s.top - scroll)) / (0.5 * vh)));
          if (t <= 0) break;
          const e = 2 * t - t * t;
          ink += (s.ink - ink) * e;
          drift += (s.drift - drift) * e;
        }
        return { ink, drift };
      };

      let raf = 0;
      let last = performance.now();
      let time = 0;
      let lastScroll = NaN;
      let lastInk = NaN;
      let frame = 0;
      let dirty = true;

      const draw = (scroll: number, ink: number) => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(U.scroll, reduce ? 0 : scroll * TRAVEL);
        gl.uniform1f(U.time, time);
        gl.uniform1f(U.ink, ink);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
        last = now;
        const scroll = window.scrollY;
        const { ink, drift } = resolve(scroll);
        const moving = scroll !== lastScroll || Math.abs(ink - lastInk) > 0.001;
        if (!reduce) time += dt * drift;
        frame++;
        const drifting = !reduce && drift > 0.001;
        /* full rate while anything the reader did is moving; 30fps while
           the lines only drift; nothing at all when both are still */
        if (!(dirty || moving || (drifting && frame % 2 === 0))) return;
        if (ink < 0.005 && !dirty && !moving) return;
        draw(scroll, ink);
        lastScroll = scroll;
        lastInk = ink;
        dirty = false;
      };

      const onVis = () => {
        if (document.hidden) {
          cancelAnimationFrame(raf);
          raf = 0;
        } else if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      };

      const ro = new ResizeObserver(size);
      ro.observe(wrap);
      const mo = new MutationObserver(readDay);
      if (root) mo.observe(root, { attributes: true, attributeFilter: ["class"] });
      const onResize = () => measure();
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVis);
      const onLost = (e: Event) => {
        e.preventDefault();
        cancelAnimationFrame(raf);
        raf = 0;
        cvs.style.visibility = "hidden";
      };
      cvs.addEventListener("webglcontextlost", onLost);
      /* fonts and images settle the sections' tops after boot */
      const remeasure = window.setTimeout(measure, 1500);

      readDay();
      size();
      raf = requestAnimationFrame(tick);
      wrap.dataset.on = "true";

      stop = () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(remeasure);
        ro.disconnect();
        mo.disconnect();
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVis);
        cvs.removeEventListener("webglcontextlost", onLost);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    };

    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    let idle = 0;
    let timer = 0;
    if (ric) idle = ric(boot, { timeout: 1200 });
    else timer = window.setTimeout(boot, 450);

    return () => {
      cancelled = true;
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idle && cic) cic(idle);
      window.clearTimeout(timer);
      stop();
    };
  }, []);

  return (
    <div className="dr-survey" ref={wrapRef} aria-hidden>
      <canvas ref={cvsRef} />
    </div>
  );
}
