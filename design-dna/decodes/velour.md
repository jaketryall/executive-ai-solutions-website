# Decode — velourproductions.com · the hero video that opens full screen and shrinks

URL: https://velourproductions.com/ · 1440×736 · 2026-09-18 · measured live (Playwright, CDP screencast at 30fps, video rects probed at t+0.8/2.0/3.5/5.5/8.0s, then 11 scroll positions). Frames: `frames/decodes/velour-load.jpg`.

**It is TIMED, not scrolled.** Everything below happens at scrollY 0; scrolling afterwards moves the card at the page's rate (rect.top −89px per 100px — plain flow).

- **0 → ~2.0s: a PRELOADER.** Black, a small "LOADING FRAMES" label. This is a real gate: the hero video (`preload="auto"`, poster) is `readyState 0` at 0.8s and `4` (playing, currentTime 1.9) at 2.0s — the loader exists so the full-screen reveal never shows a still.
- **~2.0 → ~3.3s: FULL SCREEN.** The video at 1440×810 (`transform: scaleY(1.10)` over a 736 viewport, `object-fit: fill`) with the wordmark "velour" huge in red across it.
- **~3.3 → ~5.0s: THE SHRINK.** At 3.5s the video is 1399×779 (scale 1.0087 / 1.096 — just leaving full); by 5.5s it is a 358×202 card (16:9) at the LOWER RIGHT of the composed hero (x 1081, y 357). The hero around it is already there at 3.5s: "WE GIVE YOU A POINT OF VIEW" (3 lines, ~180px), a scatter of small video tiles top-left/left/top-centre, the copy line and "View our work" at the bottom. So the shrink reads as the film "taking its seat" in a layout that assembled under it.
- **Not GSAP-on-window** (`window.gsap` undefined — bundled or CSS). No Lenis class. 4 `<video>`s on the page; the small tiles are `preload="none"`.

**What it costs a visitor:** ~5.0s from navigation to a hero with a readable claim and a door (2.0 of them a loader). For a cinema house that IS the product demo. For an ads-led owner on a phone it is a gate before the price.
