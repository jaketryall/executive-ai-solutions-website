"use client";

import { useEffect, useRef } from "react";

/* §01 · THE SLICE (trial `?v=slice`, 2026-09-22 — Jake: "the lando is
   super cool in hero").

   WHAT HIS IS, measured on landonorris.com: the hero is a WebGL canvas
   (`[data-gl="head"]`, a `.gl` canvas with a 1280×960 backing store,
   built by OFF+BRAND — the same studio as the other site he liked). The
   portrait is cut into horizontal bands that displace sideways around
   the pointer, so the picture reads as if it were being scanned.

   WHAT THIS IS: the same effect without a shader. One canvas over the
   film, one rAF loop, `drawImage` of the LIVE VIDEO band by band — each
   band's offset a falloff of its distance from the pointer's row, so the
   cut is widest where the cursor is and dies out above and below. No
   library, no second decode (the same <video> element is the source),
   nothing composited at rest: the canvas only exists while the pointer
   is over the film, and the video is what paints otherwise.

   THE FALLOFF is a raised cosine over REACH rows — the same shape §02's
   spotlight uses — so there is no seam where the displacement starts.
   AMP scales with the pointer's speed, which is what makes it read as
   the picture reacting rather than a decoration running on its own.
   Both are chased at CHASE per frame, so it settles instead of snapping. */

const BANDS = 22;
const REACH = 7.5; // bands of falloff each side of the pointer's row
const AMP = 64; // px at full strength, at the pointer's own row
const EDGE = "30, 229, 255"; // the accent, as the cut's own light
const CHASE = 0.14;

export default function FilmSlice() {
  const cvsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = cvsRef.current;
    const reel = cvs?.closest<HTMLElement>(".dr-hero-reel");
    const video = reel?.querySelector("video");
    if (!cvs || !reel || !video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (min-width: 901px)").matches) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let live = false;
    const P = { y: 0.5, amp: 0, ty: 0.5, tamp: 0, lastX: 0, lastY: 0, lastT: 0 };

    const size = () => {
      const r = video.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cvs.width = Math.max(1, Math.round(r.width * dpr));
      cvs.height = Math.max(1, Math.round(r.height * dpr));
      cvs.style.width = `${r.width}px`;
      cvs.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return r;
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      P.y += (P.ty - P.y) * CHASE;
      P.amp += (P.tamp - P.amp) * CHASE;
      if (!live && P.amp < 0.01) {
        cvs.dataset.on = "";
        return;
      }
      const w = parseFloat(cvs.style.width) || 1;
      const h = parseFloat(cvs.style.height) || 1;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;
      ctx.clearRect(0, 0, w, h);
      const bh = h / BANDS;
      const sbh = vh / BANDS;
      const row = P.y * BANDS;
      for (let i = 0; i < BANDS; i++) {
        const d = Math.abs(i + 0.5 - row) / REACH;
        const f = d >= 1 ? 0 : 0.5 + 0.5 * Math.cos(d * Math.PI); // raised cosine
        // alternate the direction band to band: a cut, not a bulge
        const dir = i % 2 ? -1 : 1;
        const dx = dir * f * P.amp * AMP;
        ctx.drawImage(video, 0, i * sbh, vw, sbh + 1, dx, i * bh, w, bh + 1);
        /* THE CUT HAS TO BE VISIBLE ON BLACK. Displacing dark pixels
           against dark pixels shows nothing, and most of this reel's
           frame IS black — the first build read as "not working" for
           exactly that reason. So each opened band gets the accent along
           its own edge: the scan line, not the displacement, is what the
           eye follows. */
        if (f > 0.02) {
          ctx.fillStyle = `rgba(${EDGE}, ${(f * P.amp * 0.5).toFixed(3)})`;
          ctx.fillRect(0, i * bh, w, 1.25);
        }
      }
      cvs.dataset.on = "true";
    };

    /* THE POINTER IS WATCHED ON THE WINDOW, not on the reel: the hero's
       own column (.dr-hero) is stacked over the film, so a real pointer
       never reaches the reel at all (elementFromPoint at the film's
       centre answers .dr-hero — measured). A rect test does not care
       what is on top. */
    const onMove = (e: PointerEvent) => {
      const r = video.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) {
        if (live) onLeave();
        return;
      }
      P.ty = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      const now = performance.now();
      const dt = Math.max(16, now - P.lastT);
      const v = Math.hypot(e.clientX - P.lastX, e.clientY - P.lastY) / dt; // px/ms
      P.lastX = e.clientX;
      P.lastY = e.clientY;
      P.lastT = now;
      P.tamp = Math.min(1, 0.22 + v * 0.55);
      if (!live) {
        live = true;
        size();
        if (!raf) raf = requestAnimationFrame(draw);
      }
    };
    function onLeave() {
      live = false;
      P.tamp = 0;
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    const ro = new ResizeObserver(() => live && size());
    ro.observe(video);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return <canvas className="dr-hero-slice" ref={cvsRef} aria-hidden />;
}
