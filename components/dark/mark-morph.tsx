"use client";

import { useEffect, useRef } from "react";
import { markField, SDF_N } from "@/components/dark/survey";

/* THE MARK, ALIVE (trial `?v=yours+ymorph`, 2026-09-23 — Jake: "the logo
   i like but i would need something different with the effect the off
   brand one, the logo is constantly moving or changing shape, when its
   on screen and you are scrolling. and it should be the the right of the
   card").

   THEIRS (decodes/offbrand-hero.md): the orb is a WebGL canvas inside a
   fixed layer — a body that never holds a still silhouette, its surface
   rolling like liquid, harder while you scroll.

   OURS: the EA mark rendered the same way. Its signed distance field
   (survey.tsx's markField — the mark's own path, exact EDT) is a
   texture; the shader samples it through a time-warped noise field, so
   the outline flows and ripples and the letterforms swell and pull in
   place, and it keeps doing so at rest. The warp's strength is
   `uAmp`: a low idle, pushed up by the SCROLL'S SPEED and chased back
   down — scrolling stirs it, stopping lets it settle but never still.
   The colour is the blue → lavender → pink of `yx`/`ylogo`, drifting.

   The fixed layer is positioned by CSS on the room's own clocks (--yin
   from the "Yours could be next" section, --yout from the marker after
   the services — room.css `.dr-mmorph`): centred among the words, then
   carried to the RIGHT of the service cards, then out before the voices.
   The canvas only draws while one of those two sections is on screen. */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uSdf;
uniform vec2 uRes;
uniform float uTime;
uniform float uAmp;
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
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.y = 1.0 - uv.y;
  float t = uTime;
  /* the liquid: a slow two-axis warp of where the field is read */
  vec2 w = vec2(n(uv * 2.4 + vec2(0.0, t * 0.21)), n(uv * 2.4 + vec2(5.2, 1.3) - vec2(t * 0.17, 0.0)));
  vec2 q = uv + w * (0.012 + 0.05 * uAmp);
  float d = texture(uSdf, q).r;
  /* the letterforms swell and pull in place */
  d -= 0.004 + (0.004 + 0.016 * uAmp) * n(uv * 3.6 + vec2(t * 0.27, -t * 0.19));
  float aa = fwidth(d) * 1.1 + 1e-4;
  float a = smoothstep(aa, -aa, d);
  /* colour: the diagonal ramp, drifting */
  float s = clamp((uv.x - uv.y) * 0.62 + 0.5 + 0.09 * sin(t * 0.35 + uv.y * 3.0), 0.0, 1.0);
  vec3 c1 = vec3(0.435, 0.741, 0.910);
  vec3 c2 = vec3(0.624, 0.698, 0.867);
  vec3 c3 = vec3(0.780, 0.608, 0.776);
  vec3 c4 = vec3(0.937, 0.514, 0.616);
  vec3 col = s < 0.34 ? mix(c1, c2, s / 0.34) : s < 0.58 ? mix(c2, c3, (s - 0.34) / 0.24) : mix(c3, c4, (s - 0.58) / 0.42);
  col += 0.16 * smoothstep(0.55, 0.0, length(uv - vec2(0.42, 0.34)));
  col *= 0.9 + 0.1 * smoothstep(0.0, -0.06, d);
  o = vec4(col * a, a);
}`;

export default function MarkMorph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cvs = cvsRef.current;
    if (!wrap || !cvs) return;
    const gl = cvs.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl) return;
    const field = markField(2, 2);
    if (!field) return;
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
      console.warn("[mark-morph]", e);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, SDF_N, SDF_N, 0, gl.RED, gl.FLOAT, field);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uAmp = gl.getUniformLocation(prog, "uAmp");
    gl.uniform1i(gl.getUniformLocation(prog, "uSdf"), 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = () => {
      const r = cvs.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      /* the layout box, not the transformed one: the layer scales it */
      const w = cvs.offsetWidth || r.width;
      cvs.width = Math.max(1, Math.round(w * dpr));
      cvs.height = cvs.width;
      gl.viewport(0, 0, cvs.width, cvs.height);
      gl.uniform2f(uRes, cvs.width, cvs.height);
    };
    size();

    /* draw only while its sections are on screen */
    let onScreen = false;
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      onScreen = seen.size > 0;
      if (onScreen) start();
    });
    document.querySelectorAll(".dr-yours, .dr-show--one").forEach((el) => io.observe(el));

    let raf = 0;
    let last = performance.now();
    let time = 0;
    let amp = 0.25;
    let lastY = window.scrollY;
    const frame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const y = window.scrollY;
      const v = Math.abs(y - lastY) / Math.max(dt, 1 / 240) / 1000; // px/ms
      lastY = y;
      /* scrolling stirs it; stopping lets it settle — never to still */
      const target = reduce ? 0 : Math.min(1, 0.22 + v * 0.55);
      amp += (target - amp) * (target > amp ? 0.18 : 0.04);
      if (!reduce) time += dt * (0.6 + amp * 1.4);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uAmp, amp);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (onScreen && !document.hidden && !reduce) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    function start() {
      if (raf) return;
      last = performance.now();
      lastY = window.scrollY;
      raf = requestAnimationFrame(frame);
    }
    const onVis = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(size);
    ro.observe(cvs);
    frame(performance.now()); // one frame even when still (reduced motion)
    wrap.dataset.on = "true";
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div className="dr-mmorph" ref={wrapRef} aria-hidden>
      <canvas ref={cvsRef} />
    </div>
  );
}
