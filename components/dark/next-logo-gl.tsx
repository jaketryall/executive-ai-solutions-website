"use client";

import { useEffect, useRef } from "react";
import { markField } from "@/components/dark/survey";

/* THE ZOOM, SHARP AT EVERY SIZE (`?v=next+nlogo+grow`, 2026-09-23 — Jake:
   "the off brand scale up doesnt lose resolution it doesnt become
   blurry").

   WHY IT BLURRED: the CSS mark is a masked layer rastered once at its
   resting size (will-change) and then stretched 23× — a bitmap blown up.
   Theirs is a WebGL body redrawn at screen resolution every frame, so an
   edge is an edge at any size.

   THIS: the moment the mark starts to grow (its computed scale > 1.01),
   the CSS mark hides and this canvas draws the SAME mark in the SAME
   place, from its exact signed distance field (1024² with the mark 600
   texels wide — markField, the path's exact EDT), at the screen's own
   pixel density every frame: the edge is re-derived per pixel (fwidth),
   so it stays one clean antialiased pixel at 1× or 30×. Everything is
   read off the CSS mark each frame, so the handoff is exact and there is
   one source of truth: its layout box (the untransformed rect inside the
   card), its computed `scale` and `rotate` about the same origin
   (55.2% / 56%), and the conic gradient's live angle (--na). The canvas
   sits in the card's stacking order (after the shape, before the words
   and the pill) and is sized to the viewport, offset by the card's
   position — the card holds still through the zoom (the rail's hold). */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uSdf;
uniform vec2 uView;     // viewport, CSS px
uniform float uDpr;
uniform vec4 uBox;      // the mark's untransformed box: x, y, w, h (CSS px)
uniform vec2 uOrigin;   // transform origin, CSS px
uniform float uScale;
uniform float uRot;     // radians
uniform float uAngle;   // the conic's start angle, radians
uniform float uTexBox;  // the mark's box as a fraction of the texture
out vec4 o;
vec3 stop(float t) {
  vec3 s0 = vec3(0.118, 0.898, 1.0);   // #1ee5ff
  vec3 s1 = vec3(0.427, 0.482, 1.0);   // #6d7bff
  vec3 s2 = vec3(0.784, 0.420, 1.0);   // #c86bff
  vec3 s3 = vec3(1.0, 0.478, 0.722);   // #ff7ab8
  vec3 s4 = vec3(1.0, 0.788, 0.541);   // #ffc98a
  float k = t * 5.0;
  if (k < 1.0) return mix(s0, s1, k);
  if (k < 2.0) return mix(s1, s2, k - 1.0);
  if (k < 3.0) return mix(s2, s3, k - 2.0);
  if (k < 4.0) return mix(s3, s4, k - 3.0);
  return mix(s4, s0, k - 4.0);
}
void main() {
  vec2 px = vec2(gl_FragCoord.x, uView.y * uDpr - gl_FragCoord.y) / uDpr;
  // screen → the mark's own (untransformed) box, undoing scale + rotate about the origin
  vec2 d = (px - uOrigin) / uScale;
  float c = cos(-uRot), s = sin(-uRot);
  d = vec2(c * d.x - s * d.y, s * d.x + c * d.y);
  vec2 local = uOrigin + d;
  vec2 uv = (local - uBox.xy) / uBox.zw;          // 0..1 in the mark's box
  vec2 tuv = 0.5 + (uv - 0.5) * uTexBox;
  float dist = texture(uSdf, tuv).r;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) dist = 1.0;
  float aa = fwidth(dist) * 0.9 + 1e-6;
  float a = smoothstep(aa, -aa, dist);
  // the conic gradient, in the box's own frame (0 = up, clockwise)
  vec2 q = uv - 0.5;
  float ang = atan(q.x, -q.y);
  float t = fract((ang - uAngle) / 6.2831853);
  vec3 col = stop(t);
  // the sheen (::after): a light up-left, a shade down-right
  col = mix(col, vec3(1.0), 0.55 * (1.0 - smoothstep(0.0, 0.5, distance(uv, vec2(0.34, 0.30)))));
  col = mix(col, vec3(0.047, 0.047, 0.059), 0.35 * (1.0 - smoothstep(0.0, 0.63, distance(uv, vec2(0.70, 0.78)))));
  o = vec4(col * a, a);
}`;

const N = 1024;
const BOX = 600;

export default function NextLogoGL() {
  const cvsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = cvsRef.current;
    const card = cvs?.parentElement;
    const shape = card?.querySelector<HTMLElement>(".dr-next-shape");
    if (!cvs || !card || !shape) return;
    const gl = cvs.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl) return;

    let ready = false;
    const U: Record<string, WebGLUniformLocation | null> = {};
    const boot = () => {
      const field = markField(1, 1, N, BOX);
      if (!field) return;
      const sh = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || "link");
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
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, N, N, 0, gl.RED, gl.FLOAT, field);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      for (const k of ["uView", "uDpr", "uBox", "uOrigin", "uScale", "uRot", "uAngle", "uTexBox"]) U[k] = gl.getUniformLocation(prog, k);
      gl.uniform1i(gl.getUniformLocation(prog, "uSdf"), 0);
      gl.uniform1f(U.uTexBox, BOX / N);
      ready = true;
    };
    try {
      boot();
    } catch (e) {
      console.warn("[next-logo-gl]", e);
      return;
    }

    let W = 0, H = 0, dpr = 1;
    let live = false;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!ready) return;
      const cs = getComputedStyle(shape);
      const sc = parseFloat(cs.scale) || 1;
      const on = sc > 1.01;
      if (on !== live) {
        live = on;
        /* the handoff: the CSS mark hides while this draws it */
        shape.style.visibility = on ? "hidden" : "";
        cvs.style.display = on ? "block" : "none";
      }
      if (!on) return;
      const vw = window.innerWidth, vh = window.innerHeight;
      const d = Math.min(window.devicePixelRatio || 1, 2); // full retina — the zoom is the point where sharpness shows
      if (vw !== W || vh !== H || d !== dpr) {
        W = vw; H = vh; dpr = d;
        cvs.width = Math.round(W * dpr);
        cvs.height = Math.round(H * dpr);
        cvs.style.width = `${W}px`;
        cvs.style.height = `${H}px`;
        gl.viewport(0, 0, cvs.width, cvs.height);
      }
      const cr = card.getBoundingClientRect();
      cvs.style.left = `${-cr.left}px`;
      cvs.style.top = `${-cr.top}px`;
      /* the mark's untransformed box (it is centred on its left/top by a
         −50% translate) */
      const bw = shape.offsetWidth, bh = shape.offsetHeight;
      const bx = cr.left + shape.offsetLeft - bw / 2;
      const by = cr.top + shape.offsetTop - bh / 2;
      const rot = (parseFloat(cs.rotate) || 0) * (Math.PI / 180);
      const na = (parseFloat(cs.getPropertyValue("--na")) || 0) * (Math.PI / 180);
      gl.uniform2f(U.uView, W, H);
      gl.uniform1f(U.uDpr, dpr);
      gl.uniform4f(U.uBox, bx, by, bw, bh);
      gl.uniform2f(U.uOrigin, bx + 0.552 * bw, by + 0.56 * bh);
      gl.uniform1f(U.uScale, sc);
      gl.uniform1f(U.uRot, rot);
      gl.uniform1f(U.uAngle, na);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    let raf = 0;
    /* only while the card is on screen */
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!raf) raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        shape.style.visibility = "";
        cvs.style.display = "none";
        live = false;
      }
    });
    io.observe(card);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      shape.style.visibility = "";
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas className="dr-next-gl" ref={cvsRef} aria-hidden />;
}
