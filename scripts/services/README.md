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
