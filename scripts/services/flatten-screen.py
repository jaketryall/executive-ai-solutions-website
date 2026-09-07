#!/usr/bin/env python3
"""Flat-field a generated phone shot's screen.

nano_banana_pro lights the display as a SURFACE, not as an emissive panel:
the empty band around the camera cutout comes back at 255 while the page
below it sits at 244-247. A ~10-level step with a hard edge at the search
field, which reads as two different whites stacked on one screen (Jake,
2026-09-07: "the area around the notch is white and then the main content
has like some gray in it").

Fix it the way a scanner does. Estimate the low-frequency illumination
across the screen by taking a high percentile of each tile (the local page
white), upsample that smoothly, and divide it out. Text is untouched in
character: the gain is capped near 1.0, so glyph edges move by a couple of
levels at most while the shading disappears.

    python3 flatten-screen.py in.png out.png [--target 253] [--report]
"""
import sys
import numpy as np
from PIL import Image

PCT = 99           # percentile per ROW = that row's page white
SMOOTH = 0.02      # vertical smoothing of the field, as a fraction of height
MAXGAIN = 1.08     # never invent more than 8% of brightness


def longest_run(mask):
    best = (0, 0, 0)
    start = None
    for i, v in enumerate(mask):
        if v and start is None:
            start = i
        elif not v and start is not None:
            if i - start > best[0]:
                best = (i - start, start, i - 1)
            start = None
    if start is not None and len(mask) - start > best[0]:
        best = (len(mask) - start, start, len(mask) - 1)
    return best[1], best[2]


def screen_box(g):
    """The lit display, found as the tallest bright run against the ground."""
    bg = np.median(np.concatenate([g[:, :30].ravel(), g[:, -30:].ravel()]))
    m = g > (bg + 55)
    cols = m.sum(axis=0)
    x0, x1 = longest_run(cols > 0.25 * cols.max())
    rows = m.sum(axis=1)
    y0, y1 = longest_run(rows > 0.25 * rows.max())
    return x0, y0, x1, y1


def step(a, box):
    """Mean near-white level in the notch band vs the body, in levels."""
    x0, y0, x1, y1 = box
    h = y1 - y0
    def band(f0, f1):
        s = a[y0 + int(h * f0):y0 + int(h * f1), x0:x1]
        w = s[s.min(axis=2) > 200]
        return w.mean() if len(w) else float("nan")
    return band(0.0, 0.10) - band(0.20, 1.0)


def flatten(im, target=253):
    """Divide out the screen's vertical shading.

    The field is ONE VALUE PER ROW, not a 2D tile grid. The shading here is
    vertical (bright band, dimmer body), and a row spanning the full screen
    almost always touches page white at its margins — so a per-row high
    percentile finds the page white even where a grey chat bubble covers
    most of that row. A 2D grid does not: a tile landing wholly inside a
    bubble reads the bubble as white and lifts it to paper, which washes
    the bubble out of the design.
    """
    a = np.asarray(im.convert("RGB")).astype(np.float64)
    g = np.asarray(im.convert("L")).astype(np.int16)
    x0, y0, x1, y1 = box = screen_box(g)
    before = step(a, box)

    sub = a[y0:y1, x0:x1]
    h = sub.shape[0]
    field = np.percentile(sub.max(axis=2), PCT, axis=1)
    k = max(3, int(h * SMOOTH) | 1)
    pad = np.pad(field, k // 2, mode="edge")
    field = np.convolve(pad, np.ones(k) / k, mode="valid")[:h]

    gain = np.clip(target / np.maximum(field, 1.0), 1.0, MAXGAIN)
    a[y0:y1, x0:x1] = np.clip(sub * gain[:, None, None], 0, 255)

    out = Image.fromarray(a.astype(np.uint8))
    return out, before, step(np.asarray(out).astype(np.float64), box)


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    target = 253
    if "--target" in sys.argv:
        target = int(sys.argv[sys.argv.index("--target") + 1])
    src, dst = args[0], args[1]
    out, before, after = flatten(Image.open(src), target)
    out.save(dst)
    print(f"{src}: step {before:+.1f} -> {after:+.1f} levels")
