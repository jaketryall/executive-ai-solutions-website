# Showreel board v3 · "design that sells, cut to music"

> **v3, 2026-09-11.** v2's grammar (below, unchanged — it is measured) survives; its
> shot list does not. Three things moved under it since 2026-09-07: the positioning
> ("design and crms, not ads" — the old opener "A website that books" and the "Found."
> ads beat are gone), the room went LIGHT (the film is now the page's one dark object,
> so a white ground in the reel is a 1440×796 white flash on the page — every light
> ground here is gone), and the slot got a spec (`reel-spec.md`: 2:1 safe zone, ≤15s
> or loop, first frame = poster, ≤4MB). Type trimmed from 35% toward itsjay's 15%.
>
> **THE SENTENCE** — what someone must understand after watching: *these sites are
> real, they were designed to sell, and the system behind them books the call.*
> Every shot either shows a real site or shows the follow-up landing. Nothing else.
>
> **MUSIC: none supplied yet.** Per the motion-design skill the beat grid is the
> skeleton, not a finish — so this board is cut against a **placeholder 120 BPM grid
> (1 beat = 30f @ 60fps)** and every boundary below sits on a half-beat. When Jake
> supplies the licensed track, `pr_detect_beats` (or ffmpeg onset detection) gives the
> real grid and the boundaries re-quantise to it. Until then the timing is a stated
> assumption, not a decision.

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

## Shot list v3 (14.0s = 840f @ 60fps, LOOPS, all cuts hard)

**Loop, not play-once.** The hero `<video>` loops, and since every cut in the reel is a
hard cut, the loop seam (shot 16 → shot 1) is just one more hard cut — UI mid-motion to a
type wipe, the same cut the reel makes six other times. No seam to hide.

**Safe zone: the vertical middle 60% of the frame.** The band hero at rest is a 3.09:1
letterbox (reel-spec.md) — the top and bottom 20% are never seen there. Type, screens,
cursors live in the middle; grounds run to the edges.

**Hold ≠ freeze.** Every held shot carries residual life: a 1–2% push across its whole
length, or a drifting secondary element. Checked by frame-diff on the finished cut — no
run of near-zero change longer than 10 frames.

**Motion blur is synthesised.** The stage is frame-stepped, so every frame has zero
exposure and fast moves strobe. The render samples two sub-frames per output frame
(f and f+0.5) and averages them — a 180° shutter equivalent — as the finishing pass,
never while timing.

| # | f | len | s | beat | ground | move |
|---|---|---|---|---|---|---|
| 1 | 0 | 120 | 2.0 | TYPE wipe L→R: "Design that sells," — ~120px Archivo 660, cropped by the frame's left edge | black | wipe f0–24 `cubic-bezier(.6,0,.25,1)`, hold to 120 (18 chars ÷ 12 = 1.5s floor ✓), 1% push |
| 2 | 120 | 42 | 0.7 | FLAT UI: Desert Wings hero, tight crop on the headline + CTA | DW blue | push 1.00→1.05 whole shot, ease 22/75 |
| 3 | 162 | 36 | 0.6 | FLAT UI: DW fleet grid | black | pan L 40px, decel (flick, not constant) |
| 4 | 198 | 48 | 0.8 | CASCADE: 4 DW pages fan out from a stack | DW blue | fan, stagger 6f, ease 22/75, no overshoot |
| 5 | 246 | 42 | 0.7 | FLAT UI: Riled Up hero (lime type on black — its own drama, no ground needed) | black | push 1.00→1.04 |
| 6 | 288 | 36 | 0.6 | FLAT UI: AAHG hero crop | AAHG navy | pan R 30px, decel |
| 7–11 | 324 | 30 | 0.5 | STROBE STING, 5 shots 6/6/5/6/7f: DW mobile · AAHG programs · RU mobile · DW journey · AAHG numbers. **Content strobes, never white.** | — | hard |
| 12 | 354 | 138 | 2.3 | TYPE wipe: "systems that follow up." — the breath | steel #4C6B7C | wipe f354–378, hold (23 chars ÷ 12 = 1.9s floor ✓ at 1.9s), 1% push |
| 13 | 492 | 108 | 1.8 | PHONE, photoreal bezel (the device IS the point — the follow-up is a text): "Are you open this weekend?" → reply → "Booked · Sat 9:00 AM" lands | black | messages rise 24px + fade, stagger 10f, ease 22/75; the "Booked" pill lands LAST on a beat |
| 14 | 600 | 48 | 0.8 | FLAT UI: DW mobile, booking CTA in frame | DW blue | scroll flick 120px + decel — impulsive, never constant |
| 15 | 648 | 48 | 0.8 | CASCADE: the three clients' heroes stack | black | stack in, stagger 6f |
| 16 | 696 | 144 | 2.4 | CLOSING, real UI mid-momentum: the EAS estimator, cursor moving, a value ticking — **cuts hard to shot 1: the loop seam** | black | push 1.00→1.03, cursor path, no fade |

**Totals:** 16 shots · median 0.75s · two breathers (2.0, 2.3) + a 2.4 close · one sting
at f324 (39% in; reference 33%) · type 2/16 shots = 12.5% (31% of runtime) · zero
dissolves · zero white frames · ends on real UI, no logo card.

**Grounds** (the colour rhythm): black · DW blue · AAHG navy · EAS steel #4C6B7C. All
under ~35% luminance — nothing here can flash the light page.

**No fabricated numbers.** "Booked · Sat 9:00 AM" is the exact string in
`components/dark/service-shots.tsx`. Nothing on screen says a figure that is not a
real promise.

## Proof scene v3, before the full build
Shots 1–4 (0–198f, 3.3s): the new type wipe, a flat-UI push, a flick-pan, a cascade —
the four moves the body is made of, none of which the v2 proof (wipe + phone) covered.
Pass = the push and pan read as intended rather than mechanical (contact sheet, not
playback), the cascade stagger measures 6f ±1, motion blur is provably present
(sharpness drops through the pan), and no frame-pair in a hold is under the residual
floor. Then shots 5–16.
