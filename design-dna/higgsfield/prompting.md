# Prompting craft for Higgsfield (Nano Banana Pro/2, Seedance 2.0, Kling 3.0)

## Core rules (all sources agree)

- **Structure beats adjectives.** Subject → Composition/Action → Location → Style (Gemini), or Subject → Action → Environment → Camera → Style → Constraints (Seedance). No model wants a keyword pile.
- **Camera/lens/lighting nouns are load-bearing.** "85mm, f/1.8, three-point softbox, 45° elevated angle" reliably steers Gemini; "golden hour, rim light, backlit" is Seedance's single highest-leverage lever. [Google Cloud — Ultimate prompting guide for Nano Banana](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana), [Seedance 2.0 guide interpretation](https://help.apiyi.com/en/seedance-2-0-prompt-guide-video-generation-camera-style-tips-en.html)
- **One camera instruction per shot.** Seedance and Kling both explicitly warn that mixing camera motion with subject motion, or stacking multiple moves, causes shaky/uncontrolled output. Separate them: "The phone screen wakes. Camera holds fixed framing." [Seedance guide](https://help.apiyi.com/en/seedance-2-0-prompt-guide-video-generation-camera-style-tips-en.html), [Kling 3.0 guide (fal.ai)](https://blog.fal.ai/kling-3-0-prompting-guide/)
- **For edits, say what stays, not just what changes.** Google's documented phrase — *"Keep everything else in the image exactly the same, preserving the original style, lighting, and composition"* — is the semantic-mask technique for localized edits. [ai.google.dev image generation docs](https://ai.google.dev/gemini-api/docs/image-generation)

## (a) Studio product still, screen pixel-faithful

**Reference attachment:** Image 1 = the phone/product (or none if generating from scratch, then lock via seed for reuse); Image 2 = the real screenshot, labeled explicitly as content to preserve.

> A photorealistic studio product photograph of a black titanium phone, straight-on, centered, on a dark charcoal gradient background. Three-point softbox lighting, subtle rim light on the edges, shallow depth of field, 85mm lens. The screen displays exactly the image in reference 2, unchanged, full-bleed, pixel-faithful — do not redraw, translate, or restyle any text on the screen. Keep the phone's material, ports, and camera bump identical to reference 1. Shot on a full-frame camera, 4K.

**Why it works:** combines Google's documented product-photography template (studio lighting + angle to showcase the feature) with the "keep everything else the same" preservation phrasing that stops the model from hallucinating new UI text. [Google Cloud guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana), [ai.google.dev](https://ai.google.dev/gemini-api/docs/image-generation)

## (b) Lifestyle scenes, same screen

> Using reference 1 (the phone, unchanged — same titanium finish, same camera bump) and reference 2 (the screenshot, unchanged, full-bleed on the screen), place the phone on a café table beside a coffee cup, morning window light, shallow depth of field, 50mm lens, natural color grading. The screen content must match reference 2 exactly — no invented text, no redesigned UI. Photorealistic, candid composition, not centered.

**Why it works:** Nano Banana Pro's few-shot design accepts up to ~14 reference images and explicitly recommends defining each image's role; naming "reference 1"/"reference 2" and repeating "unchanged" per-object is the documented multi-image composition pattern. [blog.google — Nano Banana Pro prompt tips](https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/)

## (c) 5-second Apple-style product shots (Seedance 2.0 / Kling 3.0)

**Reference attachment:** @Image1 = product/device stills (same asset as (a)/(b)); one primary camera verb; pacing words, not f-stops.

> @Image1 as the subject, product detail preserved. A locked-off macro shot of the black titanium phone on a dark surface; one soft light sweeps slowly across the frame, left to right, revealing the brushed metal texture. Camera fixed, no handheld drift. Studio lighting, cinematic, shallow focus. Duration 5s. Avoid jitter, avoid warped geometry, avoid text change.

Variants: swap the action line only — "the laptop lid opens slowly to reveal the website on screen, camera holds"; "an ad plays on the phone screen, screen content unchanged, camera pushes in gently 2m to 1m"; "the phone screen wakes from black, soft glow rises, camera fixed."

**Why it works:** Seedance's 6-step formula (subject, action, environment, **one** camera move, style, constraints) plus its documented rule that pacing words ("slow," "gentle") outperform technical parameters, and its stated product-detail-preservation strength. [Seedance 2.0 guide](https://help.apiyi.com/en/seedance-2-0-prompt-guide-video-generation-camera-style-tips-en.html); Kling's parallel rule — "one move per shot, name the move type" — applies identically if using Kling 3.0 instead. [Kling 3.0 guide, fal.ai](https://blog.fal.ai/kling-3-0-prompting-guide/)

## (d) Keeping one phone consistent across many images/clips

- **Nano Banana Pro:** re-attach the *same* product image every generation as a labeled reference ("reference 1 = the phone, unchanged") rather than relying on a seed alone — Google positions multi-image few-shot input as the consistency mechanism, not seeds. [blog.google](https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/)
- **Kling 3.0 Elements:** upload 2–4 angles of the object once as an Element, then tag it with `@element_name` in every shot and describe only the action — the look is locked by the Element, not re-described. [Kling Element Library guide](https://kling.ai/quickstart/klingai-element-library-3-user-guide)
- **Seedance 2.0:** reference the same uploaded image via `@Image1` across every shot in Universal Reference Mode; the guide states this drives face/product-detail consistency. [Seedance 2.0 guide interpretation](https://help.apiyi.com/en/seedance-2-0-prompt-guide-video-generation-camera-style-tips-en.html)
- **Kling start/end frames:** for a single clip, use near-identical start/end images of the object — large differences trigger an unwanted shot-switch instead of a smooth move. [Kling start/end frame docs](https://kling.ai/quickstart/ai-video-start-end-frames)

## Phrases that HURT

- "8k, masterpiece, ultra high quality, trending on artstation" — explicitly *not recommended* for Nano Banana; wastes tokens the model no longer needs. [Google Cloud guide](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana)
- Long negative-prompt lists on FLUX.2 — the model **does not support negative prompts** at all; only positive phrasing works. [BFL FLUX.2 prompting guide](https://docs.bfl.ml/guides/prompting_guide_flux2)
- Two+ camera moves or camera+subject motion tangled in one sentence (Seedance/Kling) — causes shake/drift.
- Asking for screen text without a reference image — the model must invent it and will misspell/redesign it; always attach the real screenshot instead.

## Phrases that HELP

- Named camera/lens/lighting nouns: "85mm, f/1.8," "three-point softbox," "golden hour rim light."
- "Keep everything else exactly the same" / "unchanged" / "pixel-faithful, do not redraw" attached to the specific reference image being preserved.
- Explicit reference roles: "reference 1 = phone (unchanged), reference 2 = screenshot (unchanged, full-bleed)."
- Pacing words for video: "slow, smooth, gentle, locked-off" instead of numeric camera specs.

## Folklore flag

The "reference weight" slider and JSON-schema prompts (e.g., `"use_second_reference_image_as_content": true`) circulating in community guides (Higgsfield's own guide, bananapro.directory) are **not documented** in Google's official pages — treat as unverified platform-specific UI features, not guaranteed prompt syntax. [Higgsfield Nano Banana Pro guide](https://higgsfield.ai/nano-banana-pro-prompt-guide), [bananapro.directory JSON template](https://www.bananapro.directory/prompt/nano-banana-pro-2x2-grid-phone-screen-replacement-json-prompt)
