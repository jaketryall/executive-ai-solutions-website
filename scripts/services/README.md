> **RETIRED for stills (2026-09-07).** The green-screen + corner-pin route below was replaced by a
> direct one: attach the real screenshot to `nano_banana_pro` at **4k** and it keeps every word
> intact. See `design-dna/higgsfield/README.md`. Step 1 here (capturing the real screens) is still
> how you get the screenshot; the compositor is kept only for a photo you already have and cannot
> re-generate, or for putting a screen into video frames.

# Photoreal service phones — do it yourself in three commands

1. **Capture the real screens** (the three §02 phones from /dark, 3× density, dev server running):
   `node scripts/services/capture-screens.mjs ./tmp/screens` → `won.png`, `dw.png`, `booked.png`

2. **Generate the photograph** on Higgsfield (Nano Banana 2, 2k, 4:5, ~2 credits). The one rule that
   makes it work: ask for the phone's screen as **"a plain flat pure green rectangle (#00FF00 chroma
   key green), no reflections, no content"**, camera ~25° off vertical, phone in portrait. For a night
   shot ask for a plain pure-white screen instead (its glow lights the scene) and use `--mode bright`.

3. **Composite**:
   `python3 scripts/services/composite-screen.py photo.png tmp/screens/won.png out.png --mode green --top t`
   `--top` = which edge of the phone in the photo is the screen's top (t/l/r/b). `--island 0` to skip
   the dynamic island. If detection fails: `--corners x0,y0,x1,y1,x2,y2,x3,y3` (TL,TR,BR,BL).
   Needs python3 with opencv + numpy (present on this Mac). Writes `out.png` + `out-preview.jpg`.

Why not let the model draw the screen: generated UI text is never right. The photo supplies light,
surface and perspective; the real UI supplies the truth.

## Studio variant (the Apple-page look)
Prompt the phone "perfectly straight on, centred, on a smooth dark charcoal gradient, one soft top light,
screen a plain pure green rectangle filling the entire display including the status-bar area". ONE render
carries every screen. Add `--statusbar dark|light` (ink colour for the 9:41 / signal / wifi / battery strip).
The model usually tilts the phone 3–5°: measure the top edge of the printed quad and level the composite
(cv2.getRotationMatrix2D about the quad centre, BORDER_REPLICATE — the gradient hides it), then crop:
"top" framing = phone ≈55% of frame width, phone top ≈19% down, 4:3.
