# Higgsfield playbook — product/device stills, lifestyle, showreel video, consistency

Plan: Plus, 1,000 credits/mo, no rollover, free-trial "unlim" unavailable on this account (`unlim.available:false`) — everything below is paid credits.

## Model table (id · best for · refs/roles · res · credits, measured via `get_cost:true`)

| Model | Best for | Ref roles (medias) | Res options | Cost @2k img / 5s vid |
|---|---|---|---|---|
| `nano_banana_pro` | Ultimate-quality stills, legible text/diagrams, hero product shots | `image_references` (multi-ref, up to ~8 per help docs) | 1k/2k/4k | **2 cr** |
| `nano_banana_2` | Fast iteration + true **inpaint** (`is_inpaint:true` + `mask` role) | `image_references`, `mask` | 1k/2k/4k (default 1k — must set explicitly) | 2 cr @2k |
| `nano_banana_2_lite` | Cheap draft passes only | `image_references`, `mask` | 1k only | untested, expect <2 cr |
| `seedream_v4_5` | 4-6K precise transformations, edits | `image_references` | up to 4k(basic)/6k(high) | 1.5 cr |
| `flux_2` (pro) | Strict prompt/geometry adherence | `image_references` | 1k/2k | 6 cr (pricy) |
| `gpt_image_2` | Best text rendering/typography if generating text | `image` (single) | 1k/2k/4k | 1 cr |
| `soul_2` | Human/UGC-with-device shots, portraits | `image` (max 1) | 1.5k/2k | 2 cr |
| `marketing_studio_image` | One-click ad-style product stills | `image` | 1k/2k/4k | 1 cr |
| `seedance_2_5` | Ref-driven video, identity lock, video_edit/extension | `start_image,end_image,image_references,video_references,audio_references` | 480/720/1080p, 4-30s | 32.5 cr@720p / **45 cr@1080p** |
| `kling3_0` | Multi-shot, audio sync, motion transfer | `start_image,end_image` | std/pro/4k | 12.5 cr (pro) |
| `kling3_0_turbo` | Fast, cheap single-frame animation | `start_image` | 720/1080p | 10 cr |
| `minimax_h3` | 2K multimodal keyframes/mixed refs | `start_image,end_image,image_references,video_references,audio_references` | 2K fixed | 10 cr |
| `veo3_1` | Top-tier cinematic realism, locked-camera light sweeps | `start_image` only (no end frame) | fixed | 22 cr (8s, high) |
| `veo3_1_lite` | Budget batch clips | `start_image,end_image` | fixed | 8 cr (8s, no audio) |
| `cinematic_studio_3_0` | Cinema-grade, genre control, 4K | `image,start_image,end_image` | 480p-4k | 50 cr@1080p/5s |
| `marketing_studio_video` | Polished one-click TikTok/Reels ad | `avatars`, `image,start_image,end_image` | 480/720/1080p | **150 cr** (forces 12-15s min, audio on by default) |

## (a) Photoreal device stills with a REAL screenshot, text intact
No generative model reliably re-renders small on-screen text/UI pixel-perfect — diffusion always risks garbling glyphs. The safe recipe: **composite, don't hallucinate.**
1. Generate the phone/laptop hero shot with the screen left blank/dark/off via `nano_banana_pro` (2 cr) or `soul_2`.
2. Paste the *real* screenshot into the screen region yourself (Figma/Photoshop/CSS device mockup) — this is outside Higgsfield and the only way to guarantee pixel-exact text.
3. If you must do it in-model, use `nano_banana_2` with `is_inpaint:true` + a `mask` restricting edits to everything *except* the screen, and prompt "keep the reference image's screen content completely unchanged." Zoom/upscale the result before trusting any text.
`gpt_image_2` is the strongest at rendering *invented* text/typography if you don't have a real screenshot to paste — not for preserving an existing one.

## (b) Lifestyle scenes with that device
Screen content rarely needs to be legible here, so plain reference-based generation works: `nano_banana_pro` or `marketing_studio_image` (both 1-2 cr) with the composited hero shot as `image_references`. Marketing Studio's `product_shots_people` / `standalone` templates (986 presets, `show_marketing_studio_v2`) give ready lifestyle compositions — upload the product once, reuse across the catalog.

## (c) Cinematic showreel shots (locked camera, light sweeps, screen-on, laptop opening)
Feed your composited still (with real screenshot already baked in) as `start_image` so the model only has to animate camera/light around a frozen, already-correct screen — never regenerate screen pixels per frame.
- Best value: `kling3_0_turbo` (10 cr, 1080p/5s) or `veo3_1_lite` (8 cr) for quick locked-camera/light-sweep b-roll.
- Best realism for a hero "laptop opening" or "screen turns on" beat: `veo3_1` (22 cr) or `cinematic_studio_3_0` (50 cr) — reserve for the 1-2 shots that carry the showreel.
- If you need the SAME device across a multi-shot sequence: `seedance_2_5` `omni_reference` mode (45 cr@1080p) accepts your still as `image_references` and holds identity across shots better than start-frame-only models.
Prompt with explicit camera vocabulary (dolly in, push in, orbital move, crane up) — Seedance/Kling read these directly.

## (d) Consistency of one object across many images/clips
Higgsfield's Soul-ID system is for *people*, not objects — for a device, the documented pattern (from the bundled `product-photoshoot` workflow) is **reference-locking**: generate ONE canonical hero image first, then reuse that completed job's output as the `image_references` input for every subsequent image (works across `nano_banana_pro/2`, `seedream_v4_5`, `flux_2`, `marketing_studio_image`). For video, pass that same still into `seedance_2_5`/`minimax_h3`'s `image_references` or `start_image` on every clip. Marketing Studio's `product_ids` (register a product once, cap 4 per request) is the most durable version of this for a running catalog of ads.

## Presets — mostly not applicable here
`presets_show` (60+ items: EARTH ZOOM, ACTION FIGURE, MOONWALK…) and `get_explainer_presets` (cartoon/3D/paper explainer styles) are person/character-centric social-video templates — not useful for product/device work. The real "presets" for this job are the `product-photoshoot` workflow's mode templates (`product-shot`, `lifestyle-scene`, `hero-banner`, `conceptual-product`, `restyle`, etc.), which lock model=`nano_banana_pro`, `resolution:2k`, and structured prompt sections — load via `get_workflow_instructions({workflow:"product-photoshoot"})`.

## Gotchas
- **Preset hijack**: some video models (esp. `higgsfield_preset`, `cinematic_studio_video_v2`) can return a preset recommendation instead of submitting your job; retry the same call with `declined_preset_id` set to reject it and force literal generation.
- **`use_unlim`**: many models carry `supports_unlim`, but leaving it unset can trigger an `unlim_choice` prompt before spending — only pass `true` when explicitly told to burn free-trial generations (moot here: `unlim.available:false` on this account).
- **Silent tier/resolution downgrade**: `nano_banana_2`'s default resolution is `1k`, not `2k` — always pass `resolution` explicitly, and use the literal id `nano_banana_pro` (never generic "nano banana") to avoid landing on `nano_banana_2_lite`/`nano_banana_2_shots`.
- **`marketing_studio_video` is expensive and inflexible**: min 12-15s duration, defaults audio on, costs 150 credits (15% of a month's Plus budget) per clip — fine for one final polished ad, bad for iterating on showreel b-roll.
- Fractional `credits_exact` (e.g. `gpt_image_2` = 0.12) still bills a minimum of 1 whole credit.

## Sources
- Help center home: https://higgsfield.ai/creator-hub/help-center
- Nano Banana Pro: https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-nano-banana-pro
- Seedance: https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-seedance
- Seedance 2.0 prompting guide: https://higgsfield.ai/blog/seedance-prompting-guide
- Marketing Studio video ads: https://higgsfield.ai/creator-hub/help-center/tools-and-workflows/how-do-i-use-marketing-studio-to-create-video-ads
- Plans: https://higgsfield.ai/creator-hub/help-center/plans/how-do-higgsfield-plans-work
- Credits: https://higgsfield.ai/creator-hub/help-center/credits/how-credits-work
