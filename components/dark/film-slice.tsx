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

/* ── WHAT HIS ACTUALLY IS (looked at properly, 2026-09-22, after "have u
   looked at landos slice still broken by the way"): NOT the whole
   picture displaced a little. A TIGHT HORIZONTAL ZONE around the
   cursor's row — about a sixth of the frame — cut into thin strips that
   jump sideways by hundreds of pixels, each a different amount, with
   hard edges; outside the zone the picture is untouched and sharp. And
   the strips show DIFFERENT CONTENT, not a gap: the displacement is of
   the SOURCE, so every strip stays full width and pulls pixels from
   somewhere else in the frame. That is why his reads as a scanner
   tearing through the image instead of as a picture sliding apart.

   Ours adds a vertical source shift as well, because this reel's frame
   is largely black: pulling only sideways in a black region shows black.
   Pulling up and down brings the lit part of the picture into the cut. */
const BANDS = 44; // thin strips: ~20px each in a 860px-tall film
const REACH = 5; // bands each side — a tight zone, not the whole picture
const AMP_X = 0.34; // of the frame's width, at full strength
const AMP_Y = 0.18; // of its height
const CHASE = 0.18;
const EDGE = "30, 229, 255"; // the accent, along the cut

// deterministic per-strip noise, so a strip keeps its own character
const rnd = (i: number) => {
  const v = Math.sin(i * 12.9898) * 43758.5453;
  return v - Math.floor(v);
};

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
        if (d >= 1) {
          ctx.drawImage(video, 0, i * sbh, vw, sbh + 1, 0, i * bh, w, bh + 1);
          continue;
        }
        const f = (0.5 + 0.5 * Math.cos(d * Math.PI)) * P.amp; // raised cosine
        const r = rnd(i);
        const sx = (r - 0.5) * 2 * f * AMP_X * vw;
        const sy = (rnd(i + 97) - 0.5) * 2 * f * AMP_Y * vh;
        /* THE SOURCE MOVES, not the destination: the strip stays full
           width and shows pixels from elsewhere in the frame */
        const syc = Math.max(0, Math.min(vh - sbh - 1, i * sbh + sy));
        ctx.drawImage(video, sx, syc, vw, sbh + 1, 0, i * bh, w, bh + 1);
        if (f > 0.04) {
          ctx.fillStyle = `rgba(${EDGE}, ${(f * 0.55).toFixed(3)})`;
          ctx.fillRect(0, i * bh, w, 1);
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
      P.tamp = Math.min(1, 0.45 + v * 0.5);
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
