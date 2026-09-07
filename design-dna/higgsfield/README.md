# Higgsfield playbook

Two research briefs and one measured result. `platform.md` = every model, its reference roles,
resolutions and real credit costs (preflighted). `prompting.md` = prompting craft from the primary
sources (Google's Gemini image docs, Seedance, Kling) with copy-paste templates.

## THE FINDING (2026-09-07, measured — overrides both briefs)

Both briefs claim no generative model preserves small on-screen text and that you must composite.
**False for `nano_banana_pro` at 4k.** Attach the real screenshot as `image_references` and it places
it on the phone with every word, glyph and logo intact — verified at full resolution on three
screens (a Google SERP, a website hero, a chat thread including the EAS monogram).

So: **no green screen, no chroma key, no OpenCV corner-pinning.** The old
`scripts/services/composite-screen.py` path is retired for stills. Just this:

```
model:      nano_banana_pro     (id literally; never "nano banana" — it downgrades)
resolution: 4k                  (the default is 1k; at 1k the text WILL mush)
medias:     [{ role: "image_references", value: <media_id of the real screenshot> }]
aspect:     4:3
cost:       2 credits
```

Prompt (the two load-bearing halves are the camera nouns and the preservation clause):

> A photorealistic studio product photograph of a black titanium smartphone with a matte black
> frame, standing upright, straight-on to the camera, centred, on a smooth dark charcoal gradient
> background. Three-point softbox lighting with a subtle rim light along the frame edges, 85mm lens,
> shallow depth of field. The screen displays exactly the attached reference image, unchanged,
> full-bleed, pixel-faithful, filling the entire display: do not redraw, re-typeset, translate,
> restyle or reflow any text, icons or layout on the screen. Keep every word and every pixel of the
> reference image identical. No people, no hands, no added text, no logos on the phone body.

Swap the first two sentences for a scene (café table, truck dashboard, nightstand) to get a
lifestyle shot; keep the preservation clause verbatim.

## Getting the screenshot in
`node scripts/services/capture-screens.mjs ./tmp/screens` grabs the three §02 screens at 3× from the
running dev server. Upload with `media_upload` → PUT the bytes → `media_confirm`, then pass the
`media_id`. Any PNG works, so this is not limited to the site's own components.

## Rules that carry over
- **Never ask the model to invent screen text.** Everything on a screen must come from a reference
  image; that is what makes the text right and the claims honest.
- **One camera instruction per video shot**, pacing words not f-stops (both Seedance and Kling break
  on stacked moves). Feed a finished still as `start_image` so the screen is frozen and correct.
- `marketing_studio_video` costs 150 credits and forces 12–15s. Not for iteration.
- Video: `kling3_0_turbo` 10 cr for b-roll, `veo3_1` 22 cr for a hero beat, `seedance_2_5` 45 cr at
  1080p when one object must hold across several shots.

---

## Composition and the notch (measured 2026-09-07, 9 images)

Two things the first pass got wrong, both fixed in the prompt rather than in post.

### The camera cutout eats the top of the screen

The model draws its own dynamic island over roughly the **top 6%** of the
screen it paints. A screenshot that starts its content at y=0 loses that
content — the first chat bubble, the site's nav bar, the search field.

So the screenshot is padded **before** upload: keep the same pixel
dimensions, squeeze the body to 91%, and fill the freed **165px of 1884
(8.75%)** with a vertical stretch of the screenshot's own top rows — flat
for a white UI, a continuation of the gradient for a photo hero. Sample
that strip from `x=40..w-40` so the capture's rounded black corners don't
smear into vertical bars. Then say so in the prompt:

> The reference image already contains an empty band across the top of the
> screen for the status bar and camera cutout — put the dynamic island
> inside that empty band so it covers no content.

Sampling from the shot's own pixels beats a flat swatch: `dw_safe` extends
the sky gradient and the seam is invisible.

### "Tight crop" is not a composition instruction

Asked for "a tight crop, only the upper half of the phone", 2 of 6 came
back as ordinary full-device product shots, and one let the phone drift off
the right edge of the frame. What lands it, every time:

> An EXTREME CLOSE-UP studio product photograph of the top half of a black
> titanium smartphone, filling the frame. This is a cropped detail shot,
> not a full product shot: the phone's body spans about two thirds of the
> frame's width, the top edge of the phone sits just below the top of the
> frame, and the phone runs off the BOTTOM edge of the frame so its lower
> half is out of shot entirely. […] horizontally centred […]

Three load-bearing parts: **"extreme close-up"** (not "tight crop"), the
explicit denial **"a cropped detail shot, not a full product shot"**, and a
**fraction of the frame width** for the subject. "Horizontally centred and
entirely within the left and right edges of the frame" is what stops the
drift. A light background pulls hardest toward the catalogue shot — it took
the full phrasing to crop there, while the dark ground cropped on the first
ask.

### Two devices, two screenshots, one image

The laptop-and-phone duo (prod's `.svc-duo`, both screens real) works in a
single generation with two `image_references`. Name each by its **content
and shape**, never by index — "reference 1 / reference 2" is a coin flip,
this is not:

> The WIDE landscape reference (a desktop web page with the headline WHERE
> PILOTS ARE BORN) is displayed on the LAPTOP screen, full-bleed […] The
> TALL portrait reference (the same site on a phone) is displayed on the
> PHONE screen, full-bleed […]

First attempt put each on the right device, kept the nav ("PROGRAMS ⌄ FLEET
PRICING NEWS CONTACT") legible on the laptop at 4k, and drew a MacBook
notch of its own accord. Feed it a real 16:10 capture for the laptop —
`public/work/live/dw-hero.jpg` is exactly 2880×1800.

### The nine (2 credits each, 18 total)

Kept: `half-won`, `half-dw`, `half-booked` (dark ground), `half-won-light`
(#ededf0 ground, the drop-in for §02's white card), `duo-full`, `duo-half`.
The 4800×3584 PNGs are in the Higgsfield account — `show_generations` finds
them if the scratch copies are gone.
