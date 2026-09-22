"use client";

import { useEffect, useRef } from "react";

const D =
  "M397.53,408.07c11.3,0,14.98-9.02,14.98-24.68v-33.53c0-10.6-0.98-24.45-14.7-24.45H297.64 c-6.02,0-9.16,5.59-11.2,10.94l-44.77,130.27c-1.61,4.22-5.27,5.67-9.68,5.67H84.69c-39.07,0-71.19-29.76-74.92-67.85V292.38 c0-28.65,17.24-53.28,41.92-64.05c-26.54-11.81-42.3-37.84-42.31-65.13V94.93c0-39.03,31.64-70.66,70.66-70.66 c0.74,0,1.47,0.01,2.2,0.03h149.44c5.95,0,10.77,4.82,10.77,10.77c0,1.19-0.19,2.33-0.55,3.4c-5.58,16.65-11.23,33.26-16.94,49.82 c-1.94,5.62-7.81,6.67-13.69,6.67c-0.03,0-0.06-0.02-0.09-0.03H102.47c-12.16,1.54-20.92,12.25-20.22,24.31v44.57 c0,11.21,9.04,20.31,20.22,20.41c31.94,0.29,63.81,0,95.61,0c6.83,0,12.81,5.05,10.87,10.67c-0.73,2.1-1.54,4.09-2.58,7.09 l-14.84,42.87c-2.35,6.79-9.81,7.76-16.55,7.76c-0.43,0-0.38,0-0.73,0h-55.72c-18.69,0-33.84,15.15-33.84,33.84 c0,2.15,0,4.22,0,5.95v88.25c-0.07,11.28-2.66,23.82,17.78,23.82h72.52c9.14,0,12.45-4.57,16.56-16.56 c0.19-0.54,0.36-0.94,0.48-1.28L311.27,38.46c2.07-6.04,4.19-14.17,10.96-14.17h97.09c39.16,0,70.95,31.58,71.29,70.66v119.41 c0,5.95-4.82,10.77-10.77,10.77c-0.28,0-0.56-0.01-0.84-0.03h-54.57c-6.22,0-11.34-4.7-12.01-10.73v-95.14 c0-15.29-12.4-27.69-27.69-27.69c-4.97,0-13.12,1.99-15.63,9.46c-12.81,37.97-51.25,151.88-51.25,151.88 c-0.65,1.93,0.28,4.67,2.31,4.67c0.91,0,1.5,0,2.27,0l89.99,0.03c39.69,0,78.19,29.62,78.19,67.36v79.51 c0,39.38-31.92,71.3-71.3,71.3c-0.49,0-0.98,0-1.47-0.02h-95.43c-5.43,0-13.65,0.53-10.66-9.24l15.94-52.18 c1.2-3.93,4.9-6.41,8.83-6.23H397.53z";

/* The mark as REAL SVG (2026-09-22 — "this is an svg we should be able
   to do something cool"), one path used four ways:

   · `dr-mark-ink`   the mark itself.
   · `dr-mark-trace` THE TRACE (`?v=logoink`): the same path STROKED, far
     thicker than the letterform and clipped back to the glyph, with its
     dash running off. The accent therefore travels along the mark's own
     contour and fills it as it goes — it draws the logo rather than
     wiping across it ("i want it to start somewhere and like trace the
     logo to fill not just a wipe"). The dash length is the path's real
     length, read once at mount (getTotalLength), so the speed is even
     whatever the geometry.
   · `dr-mark-lit`   the diagonal wipe (`?v=logowipe`), kept.
   · `dr-mark-draw`  the hairline outline (`?v=logodraw`), kept. */
const PEN =
  "M250,50 H62 Q40,50 40,88 V168 Q40,205 78,205 H215 L215,258 H78 Q40,258 40,296 V402 Q40,442 80,442 H244 L188,472 L332,42 H402 Q458,42 458,100 V240 V392 Q458,442 410,442 H300 L268,442";

export function MarkSvg() {
  const trace = useRef<SVGPathElement>(null);
  useEffect(() => {
    const p = trace.current;
    if (!p) return;
    const len = Math.ceil(p.getTotalLength());
    p.style.setProperty("--len", `${len}`);
  }, []);
  return (
    <svg className="dr-mark" viewBox="0 0 500 500" aria-hidden focusable="false">
      <clipPath id="dr-mark-glyph" clipPathUnits="userSpaceOnUse">
        <path d={D} />
      </clipPath>
      {/* the diagonal wipe's wavefront: a feathered slab, rotated about
          the bottom-left corner and slid along the diagonal */}
      <mask id="dr-mark-corner" maskUnits="userSpaceOnUse" x="-800" y="-800" width="2100" height="2100">
        <g className="dr-mark-c">
          <rect x="-760" y="-760" width="760" height="2020" fill="url(#dr-mark-grad)" />
        </g>
      </mask>
      <linearGradient id="dr-mark-grad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" />
        <stop offset="0.992" stopColor="#fff" />
        <stop offset="1" stopColor="#000" />
      </linearGradient>

      {/* THE PEN (`?v=logopen`, 2026-09-22): a hand-authored centreline
          through the monogram — one subpath, because SVG RESTARTS the
          dash at every subpath and three strokes then revealed at once.
          It runs the E from its top arm, steps down through the notch,
          runs the lower E, crosses to the A's foot, up the diagonal,
          round the right and out along the bottom. It is a MASK over
          the real mark, not a drawing of it: the glyph that appears is
          always the true one, so the pen's own inaccuracy never shows —
          it only decides the ORDER things arrive in. */}
      <mask id="dr-mark-pen" maskUnits="userSpaceOnUse" x="-150" y="-150" width="800" height="800">
        <path className="dr-mark-pen" d={PEN} pathLength={1000} />
      </mask>
      <path className="dr-mark-ink" d={D} />
      {/* ON TOP of the ink copy: under it, the same path in the accent is
          invisible except as an antialiasing fringe — a cyan outline
          round a white mark, which is the other half of what read as
          "odd dimming" */}
      <path className="dr-mark-written" d={D} mask="url(#dr-mark-pen)" />
      <path className="dr-mark-lit" mask="url(#dr-mark-corner)" d={D} />
      <g clipPath="url(#dr-mark-glyph)">
        <path className="dr-mark-trace" ref={trace} d={D} />
      </g>
      <path className="dr-mark-draw" d={D} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
