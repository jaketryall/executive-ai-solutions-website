# Showreel board v2 · "what we build, cut to music"

Reel v1 (2026-09-07, Seedance device shots + static phone screenshots + fading type cards)
was rejected on sight: "thats so bad lol" — a slideshow. Jake's brief after it: Apple's TEXT
animation (not product shots) × itsjay's hero reel (real UI elements he built, transitions
between them) × the sites must look REAL on the phones. Research decodes (scratchpad
research/{itsjay,apple-type,technique}/, session ce239744) → this board.

## The grammar, in numbers

**itsjay hero reel (Mux HLS, 24.3s, 60fps):** 26 shots · median 0.89s · min 0.05 · max 2.97 ·
~7 projects × ~3.2s · ~15% pure-type shots · real UI as FLAT layers (tight crops, page
screenshots fanned into cascades of 3–6) on solid punctuation grounds · type cropped by the
frame edge · one 5-shot 50–120ms strobe sting at ~1/3 · hard cuts only · music hot · ends on
real UI mid-momentum, no logo card.

**Apple type (measured live + Sept-2025 keynote):** two systems. Scroll headlines = one block
(never split per word) fade + rise 28–30px over 800ms, ease-in-out `cubic-bezier(.42,0,.58,1)`,
160ms stagger between eyebrow → headline → copy, weight 600, tracking tighter as size grows.
Title cards = black→gray LEFT-TO-RIGHT WIPE (clip-path/mask, hard edge, no blur) in 300–500ms,
`cubic-bezier(.6,0,.25,1)` (little in the first third, most in the middle), hold 1.5–2s, EXIT
ALWAYS A HARD CUT. Numerals: scale 3.5×→1 + blur 12px→0 stacked on the wipe. Light-gray
ground #eef0f1 or pure black; text near-white/near-black, never mid-gray.

**Ours =** itsjay's body (flat real UI, cascades, ~1s cuts, one sting, ends on real UI) with
Apple's title cards (wipe in, hard cut out) in Archivo wdth 100 / wght 660–800, on black and
the clients' own colours.

## Production: RENDER, don't record

- A dev-only stage route in this app (`/reel/stage?scene=<id>&f=<frame>`), 1920×1080, every
  animation a pure function of `f` (60fps). Real components + real CSS + real fonts.
- Real screens = the LIVE sites in iframes at real viewports (390×844 / 1440×900) inside
  photoreal bezels (Apple Design Resources), 2× DPR; scroll position = f(frame).
- Playwright steps `f`, screenshots each frame → PNG sequence → ffmpeg 1080p60 h264 (site) +
  ProRes (master). Re-render on any change. One install: `npm i -D playwright` + chromium.
- Transitions are code: cascades, zoom-through (phone screen scales to fill frame → match cut),
  FLIP morphs, clip-path slits (the same move §03's cards do), strobe sting.
- Music: a licensed minimal track (Uppbeat free / Artlist), cut to its grid. Jake supplies the
  file (his licence); a click placeholder until then. Not Suno/Higgsfield for a paid ad.
- Seedance: demoted to ONE optional beat (the night dashboard N-32 is on disk); no more spend.

## Shot list (≈19–20s, 60fps, all cuts hard unless noted)

| # | t | len | Beat | Layer / ground |
|---|---|---|---|---|
| 1 | 0.0 | 0.9 | TYPE wipe: "A website that books" | black |
| 2 | 0.9 | 0.9 | Flat UI: Desert Wings hero, tight crop, 2% push, grain | DW blue ground |
| 3 | 1.8 | 0.8 | TYPE wipe: "while you're on the job." | black |
| 4 | 2.6 | 1.6 | PHONE: DW mobile scrolling live in a real bezel (the "on the phone" beat) | black |
| 5 | 4.2 | 0.8 | CASCADE: 4 DW pages fan out | DW blue |
| 6 | 5.0 | 0.7 | TYPE cropped by the frame edge: "Found." + won-search crop under it | black |
| 7 | 5.7 | 0.9 | Flat UI: AAHG hero crop | AAHG palette |
| 8 | 6.6 | 0.8 | CASCADE: AAHG pages | AAHG palette |
| 9 | 7.4 | 0.3 | STROBE sting: 4×60ms white/mark flicker | — |
| 10 | 7.7 | 0.9 | Flat UI: Riled Up hero crop | RU palette |
| 11 | 8.6 | 0.8 | CASCADE: Riled Up pages | RU palette |
| 12 | 9.4 | 0.8 | TYPE wipe: "Booked." | black |
| 13 | 10.2 | 1.8 | PHONE: the chat — message types, reply, "Booked · Sat 9:00 AM" lands (live DOM) | black |
| 14 | 12.0 | 0.8 | NUMERAL card (scale 3.5→1 + blur 12→0): "2 days" / "fixed quote" | #eef0f1 |
| 15 | 12.8 | 0.8 | Flat UI: pricing / estimate crop | black |
| 16 | 13.6 | 0.8 | TYPE wipe: "Fixed quote up front." | black |
| 17 | 14.4 | 0.9 | Flat UI: /work stepper crop | black |
| 18 | 15.3 | 0.8 | CASCADE: all three clients' heroes stacked | black |
| 19 | 16.1 | 0.9 | TYPE wipe: "Executive AI Solutions" | black |
| 20 | 17.0 | 2.2 | Closing real UI: the EAS hero, phone cycling; fade out mid-momentum | black |

Type ratio ≈ 35% (Jake asked for Apple text; trim toward itsjay's 15% if it drags).
No fabricated numbers: every stat on screen is a real promise or a verified client figure.

## Proof scene first (before the full build)
Shots 1 + 4 only: one Apple wipe title into the Desert Wings site scrolling live on a real
bezel, rendered through the stage → 2.5s at 1080p60. Pass = the phone reads as a real phone,
the scroll is smooth by construction, the wipe matches the keynote numbers. Then the rest.
