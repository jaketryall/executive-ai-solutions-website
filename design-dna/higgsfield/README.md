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
