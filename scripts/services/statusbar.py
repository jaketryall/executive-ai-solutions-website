#!/usr/bin/env python3
"""Draw an iOS status bar into a capture's notch-safe band.

The band exists so the generated dynamic island covers no content. Left
EMPTY it backfires: nano_banana_pro reads a featureless white strip as
part of the phone, not part of the page, lights it as a separate surface,
and returns a screen with two whites stacked and a hard seam between them
(Jake, 2026-09-07: "the area around the notch is white and then the main
content has like some gray in it").

Filling the band with a real status bar — time left, signal/wifi/battery
right, the island's own space between them — gives the model detail to
anchor on, and is what a real screenshot looks like anyway.

    python3 statusbar.py screen.png out.png [--dark] [--band 165]
"""
import sys
from PIL import Image, ImageDraw, ImageFont

FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def draw(im, band=165, dark=True):
    im = im.convert("RGB").copy()
    d = ImageDraw.Draw(im)
    W = im.width
    ink = (0, 0, 0) if dark else (255, 255, 255)
    cy = int(band * 0.62)                      # the row iOS centres glyphs on
    f = ImageFont.truetype(FONT, int(band * 0.30))

    d.text((int(W * 0.115), cy), "9:41", font=f, fill=ink, anchor="mm")

    x = int(W * 0.885)                         # battery, right-aligned
    bw, bh = int(band * 0.46), int(band * 0.23)
    d.rounded_rectangle([x - bw, cy - bh // 2, x, cy + bh // 2],
                        radius=bh // 3, outline=ink, width=max(2, bh // 12))
    d.rounded_rectangle([x - bw + bh // 5, cy - bh // 2 + bh // 5,
                         x - bh // 4, cy + bh // 2 - bh // 5],
                        radius=bh // 6, fill=ink)
    d.rounded_rectangle([x + bh // 12, cy - bh // 6, x + bh // 4, cy + bh // 6],
                        radius=bh // 8, fill=ink)

    x -= int(bw * 1.45)                        # wifi: three arcs and a dot
    r = int(band * 0.20)
    for i in (3, 2, 1):
        rr = int(r * i / 3)
        d.arc([x - rr, cy - rr + r // 3, x + rr, cy + rr + r // 3],
              start=215, end=325, fill=ink, width=max(2, r // 6))
    d.ellipse([x - r // 8, cy + r // 3 - r // 8, x + r // 8, cy + r // 3 + r // 8],
              fill=ink)

    x -= int(r * 2.6)                          # signal: four rising bars
    bwid, gap = max(3, int(band * 0.055)), max(2, int(band * 0.035))
    for i in range(4):
        h = int(band * (0.075 + 0.043 * i))
        bx = x - (3 - i) * (bwid + gap)
        d.rounded_rectangle([bx, cy + int(band * 0.10) - h, bx + bwid,
                             cy + int(band * 0.10)],
                            radius=bwid // 3, fill=ink)
    return im


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    band = 165
    if "--band" in sys.argv:
        band = int(sys.argv[sys.argv.index("--band") + 1])
    out = draw(Image.open(args[0]), band, dark="--light" not in sys.argv)
    out.save(args[1])
    print(f"{args[0]} -> {args[1]} (band {band})")
