# The hero reel — what the slot needs

Written 2026-09-11, when Jake said "im going to make a longer, better
showreel." Every number here is read off the hero's CSS or measured on
the page, not chosen. If the hero changes, re-derive this.

## The well it has to fill

Two heroes share one `<video>`, `object-fit: cover`. Cover crops — so
what matters is the SHAPE of the well, not its size.

| hero | well at 1440×900 | ratio | what a 16:9 source loses |
|---|---|---|---|
| film (`?film`) | 1440 × 796 | **1.81:1** | 2% top+bottom |
| film at 1280×720 | 1280 × 619 | 2.07:1 | **16%** top+bottom |
| film at 2560×1400 | 2560 × 1296 | 1.98:1 | 11% top+bottom |
| band (`/dark`) at rest | 1290 × 418 | **3.09:1** | 42% top+bottom |
| band, opened | 1290 × 643 | 2.01:1 | 12% top+bottom |

**So: shoot for 2:1, and keep everything that matters inside the
vertical middle 60%.** The band hero at rest is a letterbox — anything
in the top or bottom 20% of the frame is never seen there. Screens,
type, cursors: centre band. Backgrounds and grounds: edges.

## Format

- **1920 × 1080 minimum.** 2560 × 1440 if the source allows — the
  ultrawide well is 2560 wide and a 1920 source upscales there.
- **H.264, High profile, yuv420p, crf 22–23, `-movflags +faststart`,
  30fps.** That is what the current cut uses; 885KB for 6s at 1920.
- **Strip the audio track** (`-an`). It autoplays muted; audio is dead
  weight and some browsers refuse autoplay if the track exists.
- Optional second source: **WebM VP9** at the same crf-equivalent, listed
  first. ~30% smaller for the same look; Safari falls through to the mp4.
- Weight budget: **≤ 4MB** for the film hero. It loads immediately (it
  IS the first screen); Apple's `large.mp4` is far heavier but they are
  Apple. `preload="metadata"` + a poster covers the first paint.

## The first and last frames

- **The poster is the first frame.** The page paints the poster until
  the video can play; if frame 0 does not match the poster, the hero
  flashes. Export the poster FROM frame 0 (`ffmpeg -frames:v 1`), never
  a different still.
- **No title card in the first ~2 seconds.** The poster→play handoff
  should be invisible; a card that appears the instant it starts reads as
  a stutter.
- **Decide loop vs. play-once, and cut for it:**
  - **Loop** (current): the last frame must land on the first, or the
    seam is a cut every N seconds. Cut on motion, not on a hold.
  - **Play-once** (Apple's hero): the last frame is a HOLD you will look
    at for as long as the page is open. Make it the strongest still in
    the reel. 8–15s.

## Luminance

The room is light and the film is its one dark object — **dark footage
is right.** The source showreel was measured (2026-09-10): dark from
t=0–10, BRIGHT from t=11–28, black from 29 on. The current cut is
t=4.3–10.4 for exactly that reason. Whatever the new reel does, **no
white flashes**: a frame that goes to white in a 1440×796 well is a
1440×796 white flash on the page. If a light scene is needed, ramp into
it.

## Content

Per the itsjay decode (`design-dna/decodes/itsjay.md`, 2026-09-07): the
reel that works is **flat real UI on solid grounds, cropped type, card
cascades**, ~0.9s median shot length — motion-graphics of the work, not
screen recordings of it. `app/reel/stage` on this branch is the
frame-stepped HTML stage built for exactly that (Playwright → ffmpeg),
and the `uicap` skill captures live sites deterministically at retina.
Both exist; neither has produced a full cut yet.

Show the work, not the tools. One client's site end to end beats three
clients' homepages.

## Drop-in

Replace `public/dark/reel-film.mp4` and `public/dark/reel-film-poster.jpg`.
Nothing else changes. Then check three things on the page:
`?film` at 1280×720 (the tightest well), `/dark` at rest (the letterbox),
and the loop seam if it loops.
