# Decode — itsjay.us · full-site pass

URL: https://www.itsjay.us/ (+ https://www.itsjay.us/work for card-count check)
Viewport: 1440×900 primary; spot-checked 2560×1440. Date: 2026-09-10
Stack: Next.js (next/font, next-video), Tailwind (utility classes, default radius/neutral scale), GSAP present as a listed skill tag, Lenis 1.3.3 mounted globally (`html.lenis`, `window.lenisVersion`), Mux for all project-preview video.

---

## 0. VERIFY — the four on-record claims

1. **Slit-open work-card hover** — HOLDS, now with exact numbers (see §5.1). A clip-path box rises from a flat centre slit to a full rect, under a blurred veil. Confirmed live on both homepage cards and all 6 `/work` cards.
2. **Split about section (12-col, 7/5, one display paragraph, sticky not parallax media)** — HOLDS exactly. `#about` is `grid grid-cols-12`; copy is `col-span-12 lg:col-span-7`, media is `hidden lg:block h-full col-span-5`. Media inner node is `position: sticky; top: calc(100vh - 20vw - 172px)` (=440px at 1440×900) — a real CSS sticky, confirmed non-parallaxed. Copy column holds one `<p>` (duplicated once in the DOM for a reveal animation, still one authored paragraph, not a stack of short ones).
3. **Cover-image parallax (26% surplus / 19-7 split / 0.11px-px / well 3:2)** — PARTIALLY WRONG, corrected:
   - Well aspect is **NOT 3:2**. Measured 648–656px × 500px = **~1.30:1** (close to 4:3) on both the homepage's 2 featured cards and all 6 `/work` cards — consistent everywhere, not a stray card.
   - Total surplus **is** ~26%, but only once you compound two separate moves: the wrapper is `h-[120%] top:-15%` (20% surplus) **and** the `<img>` itself carries a constant `scale-105` (independent of hover) → 1.20×1.05 = **1.26**, i.e. 26% oversize. Split at rest (no scroll transform) measured **18% top / 8% bottom** (90px/40px on a 500px well), not 19/7 — same ballpark, corrected split.
   - Rate: measured **exactly 0.12 px of image shift per px of scroll** (linear, clamped ±10vh over a 1500px document-scroll domain), slightly higher than the logged ~0.11. See §5.2 for full samples and the coverage-margin proof that the gap window never overlaps the visible window.
4. **Hero reel (24s / 26-shot / 0.89s-median Mux montage)** — duration re-confirmed live: the Mux asset (`playback-id XNK3bwweeTDrJJdvrcF7omzvSqYfrm01zkC601tzX7fCU`) reports `duration: 24.277s`, matching "~24s" exactly. Shot count/median were not re-counted frame-by-frame this pass (would require playback scrubbing); nothing observed contradicts the prior count. NEW correction: this video is not a bare hero clip — it sits inside a `.video-preview` element that **scale-grows from 0.35→1.0 over exactly the first 810px of page scroll** (see §5.3), something not previously on record.

---

## 1. GROUND & PALETTE

Fully achromatic (a=b=0 on every color sampled — zero hue anywhere in UI chrome; all color in the piece comes from photography/video).

| role | value (as authored) | approx hex | contrast vs its pair |
|---|---|---|---|
| body/global ground | `lab(7.78 0 0)` | ~#171717 (Tailwind neutral-900) | — |
| main/footer ground | `lab(96.52 0 0)` | ~#f5f5f5 (neutral-100) | 16.4:1 vs ink |
| ink (headings/body) | `lab(7.78 0 0)` | ~#171717 (neutral-900) | 16.4:1 vs ground |
| muted text | `lab(66.13 0 0)` | ~#a1a1a1 (neutral-400) | ~3.4:1 vs ground |
| hairline / border | `lab(84.92 0 0)` | ~#d4d4d4 (neutral-300) | decorative only |
| work-card fill | `lab(15.2 0 0)` | ~#262626 (neutral-800) | — |
| hover veil | `oklab(.205 / .3)` | neutral-900 @ 30% + `blur(12px)` | — |
| footer tile glass | `bg-neutral-300/50 backdrop-blur-sm` → `backdrop-blur-md` on hover | — | — |

Scroll order of grounds: neutral-900 (body, visible only where `main`'s neutral-100 doesn't cover, e.g. loading screen) → neutral-100 for the entire `main` + `footer` run, no ground changes at all down the page. One flat light room, one flat dark room (loading state only) — no mid-scroll palette shift anywhere.

No accent color exists anywhere in the chrome (buttons, links, numerals, tags are all neutral-900/400/300). Color enters only via photography, Mux video, and brand SVG logos (React/Next/TS/etc.).

---

## 2. TYPE

Self-hosted via `next/font`, requests confirmed:
- `Saans` — Regular / Medium / SemiBold / Bold (woff2), used for everything except the loading counter.
- `SaansMono` — one weight, used for small uppercase tag/label runs (`text-sm font-semibold tracking-tight`).
- `lcddot` (ttf) — a dot-matrix/digital-clock face, used only for the loading-screen "100%" counter.

Computed sizes at 1440 (family always `saans, "saans Fallback"` unless noted):
| px | weight | used for |
|---|---|---|
| 10–14 | 400–600 | tag chips, small labels |
| 16 | 400/600 | nav labels, `Myself`/`Work '25` eyebrow, section H4s (uppercase) |
| 17.28–21.6 | 500–600 | body copy, footer tile labels |
| 47.52 | 500 | Services heading (`Digital Design` etc.), sentence case |
| 50.4 | 600 | the About display paragraph (leading = font-size exactly, i.e. `leading-none`) |
| 172.8 | 700 | "WORK '25" heading (`clamp(48px,12vw,200px)`) |
| 201.6 | 700 | "MODERN TECH STACK" marquee letters (`clamp(48px,14vw,250px)`) |

Every large display size carries **exactly −2.5% tracking** (−4.32px/172.8, −1.26px/50.4, −5.04px/201.6 all resolve to the same −0.025em ratio) — one tracking rule reused at every display scale, not per-heading tuning. Case: display headings + eyebrows are uppercase; the About paragraph and Services descriptions are sentence case. Border-radius scale is stock Tailwind: 8 / 12 / 16 / 24px (lg/xl/2xl/3xl), used consistently (slit box 8, card well 12, card outer 16, hero video 24, about media 12).

---

## 3. LAYOUT

- **No max-width container anywhere.** `body { max-width: none }`; every section pads with `px-4 lg:px-8` only (32px gutter at ≥1024px). Confirmed the 32px gutter is a **fixed px value, not a percentage** — re-measured at 2560×1440 and the gutter is still exactly 32px (full-bleed content, no centering budget at all).
- Work-card well is `clamp(500px,32vw,800px)` tall; at 1440 that clamps to the 500px floor, at 2560 it grows to ~784–800px (clamp working as intended).
- Vertical rhythm (document-scroll tops, 1440): hero 0 → intro/reel-dock 900 → about 1800 → work 2680 → services 3801 → tech-stack 5392 → footer 6904 → end 7699. Section heights: 900, 900, 880, 1121, 1591, 1512, 796.
- Grid: 12-col only used once, on the About split (7/5). Work cards use flex 2-up (`lg:w-1/2`), not a grid-col split.
- Everything sits on a surface: work cards are solid neutral-800 tiles, footer links are neutral-300/50 glass tiles, About media is a rounded sticky frame. Nothing is bare-canvas text-on-ground except the giant display headings themselves (by design, as punctuation).

---

## 4. SECTION LINEUP

| # | job | archetype | density | seam to next |
|---|---|---|---|---|
| 1 | Hero name/eyebrow (mobile stack + "A Seriously Good" wordplay, "Scroll for cool sh*t") | full-bleed hero, no card | sparse | video-preview (§5.3) grows on top of it for exactly 810px, then docks |
| 2 | Reel dock ("intro") | full-bleed video, 16:9 rounded-3xl | sparse | hard cut into grid section |
| 3 | About (split 7/5) | sticky-media split | medium | hard cut, no transition device |
| 4 | Work (2 featured cards) | slit-open hover cards on solid tiles | medium-dense | hard cut |
| 5 | Services (3 numbered rows + image) | numbered list + inline image | dense (copy-heavy) | hard cut |
| 6 | Modern Tech Stack (giant marquee word + logo grid) | display type + logo row | sparse-then-dense | hard cut |
| 7 | Footer | glass-tile bento + giant wordmark | dense | — |

No pinned/scroll-jacked sections anywhere except the reel-dock grow (§5.3), which is a normal-flow scroll-linked transform, not a pin. Every seam is a flat hard cut — no color-swap curtain, no shared-element morph between sections (contrast with EAS's own §01→§02 climb / §03→§04 devices).

---

## 5. MOTION

### 5.1 Work-card slit-open hover
Element: the `<a href="/work/…">`'s child `div.overflow-hidden` (the well) contains, in order: (a) veil, (b) the slit box, (c) the parallaxed cover image. Hover is a real `:hover`/`group-hover`, not JS-driven.

| state | clip-path | translate (own box) | veil opacity | veil blur | duration/ease |
|---|---|---|---|---|---|
| rest | `polygon(30% 50%,70% 50%,70% 50%,30% 50%)` (zero-height slit, 40% wide) | `-50% -8.333%` | 0 | 0 | — |
| hover | `polygon(0 100%,100% 100%,100% 0,0 0)` (full rect) | `-50% -50%` | 1 | `blur(12px)` | clip/translate: 700ms `cubic-bezier(.87,0,.13,1)`; veil: 500ms `cubic-bezier(.4,0,.2,1)` |

Box itself: 426×240px at 1440 (`clamp(300px,65%,600px)` wide, `aspect-video`), `rounded-lg` (8px). The move is CSS `translate` (not `transform`), so it composites independently of the clip-path change — the clip-path is the one non-cheap part (inset/polygon growth re-rasters per the grow-effects-raster law); everything else here is cheap.

Cover image on the same hover: `scale-105 → scale-100`, 500ms `ease-in-out` (i.e. it un-zooms slightly on hover, not zooms in).

### 5.2 Cover-image scroll parallax (work-card well)
Driven directly by document scrollY (Lenis-smoothed globally, no extra per-element lerp — style updates track scroll 1:1 once Lenis settles). Sampled on the Jazmin Wong card, full travel:

| scrollY | inline transform | note |
|---|---|---|
| 2050 | translateY(-10vh) | clamp floor |
| 2264 | translateY(-7.34vh) | |
| 2479 | translateY(-4.27vh) | |
| 2693 | translateY(-1.21vh) | |
| 2907 | translateY(1.84vh) | |
| 3121 | translateY(4.90vh) | |
| 3336 | translateY(7.97vh) | |
| 3550 | translateY(10vh) | clamp ceiling |

Rate = 20vh (180px @900vh) / 1500px scroll = **0.12 px/px, linear, no easing** inside the ramp. Coverage check: top overflow ranges 0→180px, bottom overflow ranges −50→+130px across the full clamp range — the only negative (gap) window is scrollY 2050–2467, which resolves *before* the well's bottom edge ever scrolls into the visible viewport (visible window ≈2578–3478). Cover never actually gaps.

### 5.3 Hero reel grow-in (not previously on record)
Element: `.video-preview` (`will-change-transform`, `clip-path: inset(0px)` constant — no clip animation, so this is transform-only/cheap), a 16:9 Mux video, `rounded-3xl`.

| scrollY | scale | translateY |
|---|---|---|
| 0 | 0.350 | −118vh |
| 113 | 0.441 | −101.5vh |
| 225 | 0.531 | −85.2vh |
| 338 | 0.621 | −68.8vh |
| 450 | 0.711 | −52.4vh |
| 563 | 0.802 | −36.0vh |
| 675 | 0.892 | −19.7vh |
| 788 | 0.982 | −3.2vh |
| ≥810 | 1.000 | 0vh |

Curve: **exactly linear** once the true domain is identified — every interior sample's normalized progress equals scrollY/810 to 3 decimal places (not scrollY/900). So the grow completes over **810px of scroll (0.9 × viewport height)**, then the element behaves as a normal in-flow block for the remaining 90px before the next section. No easing function is applied; the "eased" look comes purely from scale (perceived size change is non-linear to the eye even when the transform is linear).

### 5.4 Other motion, for completeness
- **Heading line-mask reveals** ("Work '25", nav labels): a duplicate line masked by `overflow:clip`, translated 100%→0% — a one-time entrance, not scroll-scrubbed.
- **"MODERN TECH STACK" letters**: each letter is doubled (`<span>` + `<span class="absolute bottom-full">`), with a **static** post-entrance transform (`translateY` = exactly `line-height × 0.85` for whichever letter) — confirmed constant across 5 scroll samples. This is a **STILL** element after its one-time roll-in; do not assume it's scroll- or hover-scrubbed without further hover-state testing (not done this pass).
- **Bottom pill nav** (Home/Work/Lab): lives in a `position: fixed` wrapper — confirmed unchanged position across a 3000px scroll. The top info banner ("US Based… Send me an email") is `position: static` and scrolls away normally — easy to mistake for a fixed header; it is not.
- **Footer wordmark** ("itsjay.us"): centered, absolutely positioned, carries a static `translateY(-10vh)` inline style — not verified against scroll (out of budget this pass); flag as possibly scroll-linked, unconfirmed.

---

## 6. INTERACTION

- Work-card hover: see §5.1 (clip + veil + image un-zoom, 500–700ms).
- Footer tiles: `backdrop-blur-sm → backdrop-blur-md` on hover, 500ms `transition-all` — a glass-thickening hover, no scale/color change.
- Cursor: plain system cursor throughout (`pointer` on links, default elsewhere) — no custom cursor dot/follower despite the amount of craft elsewhere.
- No view-switch/filter UI present on the homepage (a filter/sort may exist on `/work`, not checked this pass).

---

## 7. COMPOSITING

- `.video-preview` (hero reel): `will-change: transform`; animates `transform` only (`scale`+`translateY`), `clip-path` held constant at `inset(0px)` — cheap, GPU-composited, no per-frame raster.
- Work-card slit box: animates `clip-path` (polygon→polygon) **and** `translate` together over 700ms on hover only (not scroll-driven) — the clip-path change does re-raster, but it's hover-triggered and short-lived, not a continuous per-frame scroll cost.
- Hover veil: `backdrop-filter: blur(12px)`, opacity-animated — a real backdrop-filter, one per card, only active near hover.
- Footer tiles: `backdrop-filter: blur` at rest too (`backdrop-blur-sm` always-on across ~6 tiles simultaneously) — the most expensive standing compositing cost on the page since it's not hover-gated.
- A full performance trace during the primary scroll could not be captured this pass (tool-side "string too length" error on `performance_stop_trace`); no mean/p90 frame-time numbers to report. Given the observed effects are transform/opacity/backdrop-filter only (one clip-path exception, hover-gated), no long-task or layout-thrash risk is visually evident, but this is not instrument-verified.
- Lenis 1.3.3 confirmed mounted (`html.lenis`, `window.lenisVersion`); no per-element extra lerp found on either measured scroll effect (§5.2, §5.3 both track raw/Lenis-smoothed scrollY 1:1) — damping, where it exists, belongs to Lenis's own scroll smoothing, not to the effects themselves.

---

## 8. TAKEAWAY

**TAKEABLE** (for a small agency selling ads+websites to local US service businesses):
- The About split recipe exactly as measured: 12-col, 7/5, one display paragraph, `position:sticky` media (cheap, no JS, no parallax lerp needed) — already ported into EAS's own build.
- The −2.5% tracking-at-every-display-size rule: one number, reused everywhere, is a cheap way to look considered.
- The linear (not eased) scale-grow-on-scroll for a hero video, tied to a clean fraction of viewport height (0.9×), is trivial to build and reads as intentional.
- Cover-image-with-buffer-scale (over-tall wrapper × a small constant `scale-105`) as the standard recipe for "cover always holds through a scroll shift" — already the pattern EAS ported for §03.

**NOT TAKEABLE** (works only because he is a solo designer showing craft to other designers):
- The slit-open hover's 700ms bespoke cubic-bezier and the whole "reveal ceremony" — a client's site visitor is scanning for services/pricing/a phone number, not admiring a curated reveal; this reads as a portfolio flex, not a sales aid.
- Zero max-width, full-bleed everything — defensible when every asset is custom-shot and the site is a single person's portfolio; risky for a service business where copy needs a readable measure and stock/generated imagery doesn't always survive being blown edge-to-edge.
- No accent color anywhere — works because his own photography/video supplies all the color; a local-service site usually needs a CTA color to point at "Call now" / "Get a quote," which a fully achromatic chrome makes harder.

**THE ONE THING worth taking, stated as buildable:** a hero video/image that starts small and docked (scale ≈0.35, offset −118vh) and grows LINEARLY to full width over exactly 0.9× the viewport height of scroll, `will-change: transform` only, clip-path held constant — cheap to build (two GSAP/CSS-driven values, no pin, no library beyond whatever already smooths scroll), and gives a hero a sense of arrival without scroll-jacking.
