# Dead-code audit — redesign/dark-room, 2026-09-10

Measurement only. Nothing in the repo was changed, deleted, or reformatted to produce this report.
Method: static import-graph reachability from every route entry point, literal-string grep for every
CSS class name against every `.tsx`/`.ts` file, literal-filename grep for every `public/` asset, and
`git ls-files` to separate tracked assets from gitignored local scratch. Anything not provably dead is
marked **uncertain** rather than called dead.

Entry points used as reachability roots: `app/page.tsx`, `app/layout.tsx`, `app/contact/page.tsx`,
`app/pricing/page.tsx`, `app/privacy/page.tsx`, `app/work/page.tsx`, `app/work/[slug]/page.tsx`,
`app/services/[slug]/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/api/chat/route.ts`,
`app/api/chat/transcript/route.ts`, `app/api/contact/route.ts`, `app/api/site-check/route.ts` (all = LIVE),
`app/dark/page.tsx` (= /dark), `app/reel/stage/page.tsx` (= /reel). No `middleware.ts` exists. `hooks/`
and `styles/` directories do not exist in this repo. No `next/dynamic` or dynamic `import()` calls exist
anywhere in `app/components/lib`, so the static import graph is complete — nothing is hidden behind a
lazy-loaded boundary.

---

## 1. Reachability map

Root layout `app/layout.tsx` wraps every route including `/dark` and `/reel/stage` (there is no nested
layout that opts out), so `Nav`, `Footer`, `SmoothScroll`, `PersonaCapture`, `PersistentCta`, and
`SiteChat` mount on `/dark` and `/reel/stage` too, on top of whatever those pages render themselves. That
is not a dead-code finding but is worth Jake's attention separately — it means `/dark` currently runs
underneath the production nav/footer/chat widgets, not standalone.

### LIVE — reachable from `app/page.tsx` or another shipped route (63 files, 19,525 lines, 656 KB)

```
app/api/chat/route.ts                    156
app/api/chat/transcript/route.ts          80
app/api/contact/route.ts                  46
app/api/site-check/route.ts              558
app/contact/page.tsx                      45
app/globals.css                         6780
app/layout.tsx                           107
app/page.tsx                              34
app/pricing/page.tsx                      72
app/privacy/page.tsx                      24
app/robots.ts                              8
app/services/[slug]/page.tsx              66
app/sitemap.ts                            52
app/work/[slug]/page.tsx                  43
app/work/page.tsx                         22
components/anim/arrival.ts                34
components/anim/ease.ts                   50
components/anim/reveal.ts                 52
components/anim/smooth-scroll.tsx        150
components/anim/view-transition.tsx      266
components/builder/demo-site.tsx         208
components/builder/mini-site.tsx         166
components/builder/packs.ts              257
components/builder/store.ts               29
components/contact/contact-page.tsx      307
components/estimator/odometer.tsx        101
components/estimator/pricing.ts           87
components/footer.tsx                    252
components/legal/privacy-page.tsx        206
components/nav.tsx                       618
components/persona-capture.tsx            13
components/pricing/compare.tsx           113
components/pricing/pricing-page.tsx      494
components/sections/builder.tsx          528
components/sections/closer.tsx           172
components/sections/estimate.tsx         490
components/sections/faq.tsx              140
components/sections/hero.tsx             804
components/sections/price-beat.tsx       168
components/sections/proof.tsx            338
components/sections/services.tsx         458
components/sections/site-check.tsx       273
components/sections/steps.tsx             87
components/sections/surface-marquee.tsx   40
components/services/lead-math.tsx        254
components/services/service-page.tsx    1350
components/services/sub-offer.tsx        250
components/ui/artifact.tsx                45
components/ui/cta.tsx                     71
components/ui/highlights-gallery.tsx     199
components/ui/monogram.tsx                18
components/ui/persistent-cta.tsx          84
components/ui/person-icon.tsx             10
components/ui/process-cards.tsx           47
components/ui/roll-link.tsx               27
components/ui/segmented.tsx               34
components/ui/site-chat.tsx              289
components/work/case-study.tsx           658
components/work/work-index.tsx           286
lib/persona.ts                            47
lib/quotes.ts                             29
lib/services.ts                          370
lib/work.ts                              463
```

### /dark ONLY — reachable only from `app/dark/page.tsx` (12 files, 5,656 lines, 255 KB)

```
app/dark/dark.css                       2997
app/dark/page.tsx                        350
components/dark/about-section.tsx        120
components/dark/close-section.tsx        270
components/dark/objections-section.tsx   221
components/dark/proof-section.tsx        232
components/dark/runs-section.tsx         312
components/dark/scroll-engine.ts         435
components/dark/service-shots.tsx         53
components/dark/services-section.tsx     334
components/dark/voices-section.tsx       177
components/dark/works-list.tsx           155
```
`/dark` is fully self-contained under `components/dark/**` and imports nothing new from
`components/anim/*` beyond `gsap`/`reducedMotion` (shared, see §6). It reuses two LIVE API routes at
runtime via `fetch()`, not import: `objections-section.tsx` calls `/api/chat`, `close-section.tsx` calls
`/api/site-check`. It does not call `/api/contact`.

### /reel ONLY — reachable only from `app/reel/stage/page.tsx` (2 files, 749 lines, 24 KB)

```
app/reel/stage/page.tsx    433
app/reel/stage/stage.css   316
```
Fully self-contained — zero imports from `@/components` or `@/lib`. It expects images at
`/reel-page/<slug>.png`, a path that does not exist under `public/` in this repo; those frames are
produced by an external Playwright capture step (`scripts/reel/render.mjs`), not shipped as static
assets. Not a dead-code finding, but the route will render broken `<img>`s if loaded without first
running that script.

### ORPHAN — not reachable from any route (3 files, 489 lines, 17 KB)

```
components/sections/process.tsx        364
components/sections/value-reframe.tsx  108
components/work/tag-marquee.tsx         17
```
Verified by direct grep of every export name (`Process`, `ValueReframe`, `TagMarquee`) across
`app/components/lib`: zero import sites anywhere, not even from `/dark` or `/reel`. These three files
are pure dead weight — no route, old or new, uses them. `process.tsx` additionally imports
`public/work/dw-home.jpg`, which is therefore also orphaned (see §3).

**Confidence:** high. All four buckets sum to 26,419 lines, matching the raw `wc -l` total for
`app/+components/+lib` exactly (12,189 + 13,321 + 909 = 26,419), so no file was missed or double-counted.

---

## 2. CSS

| Stylesheet | Lines | Size | Loaded on |
|---|---|---|---|
| `app/globals.css` | 6,780 | 172.8 KB | every route (imported once, in root `app/layout.tsx`) |
| `app/dark/dark.css` | 2,997 | 155.1 KB | `/dark` only (imported directly by `app/dark/page.tsx`) |
| `app/reel/stage/stage.css` | 316 | 6.9 KB | `/reel/stage` only |

`dark.css` and `stage.css` are each a single era's work and are essentially clean: of 193 classes
defined in `dark.css`, only 2 (`dr-panel`, `t-section`) have zero matches in any `.tsx` file; `stage.css`
has 0 of 32 unused. **`globals.css` is where four eras have piled up** — of 535 unique class selectors
defined in it, **126 (24%) have zero occurrences in any `.tsx` file anywhere in the repo** (checked
against all of `app/`, `components/`, `lib/`, not just LIVE).

Parsing `globals.css` into its 970 actual rule blocks and keeping only blocks whose *every* class is in
the unused set (safe to delete blind) gives **166 fully-dead rule blocks spanning ~1,119 lines** (about
16% of the file), across these families — grouped by what each turns out to be:

- **Old work-index card/stepper system**, `L4819–5165` + `L2936–3107` + `L6512–6527`: `.wki*` (30
  classes: `.wki`, `.wki-stage`, `.wki-row`, `.wki-frame`, `.wki-veil`, `.wki-fcard`, `.wki-flow`, etc.)
  and `.work-card`/`.wc-avatar`/`.wc-base`/`.wc-client`/`.wc-demo`/`.wc-foot`/`.wc-meta`/`.wc-par`/
  `.wc-veil`/`.wc-well`/`.wkc-open`. This is the July 2026 "split looping stepper" work-page
  implementation, fully superseded — current `components/work/work-index.tsx` and `case-study.tsx` use
  Tailwind utilities plus a different, much smaller class set (`wk-rail`, `wk-rail-link`, `wkt`,
  `mask-line`/`mask-inner`) that has no overlap with the dead names. **166 lines of `wc-marquee`/
  `wc-track`/`wc-set` selectors nested under the dead `.work-card` parent are still live** (used
  elsewhere) — flagged as mixed/uncertain in the full block list below, not deleted blind.
- **Fake Google-SERP hero artifact**, `L1656–1910`: `.g-search`, `.g-ad`, `.g-caret`, `.g-glass`,
  `.g-src`, `.g-fav`, `.g-site`, `.g-desc`, `.g-ext`, `.g-list`, `.g-org-row/-title/-url`, `.g-row`,
  `.g-expand`, `.g-cursor`, `.ad-artifact`, `.af--paper`. Zero references anywhere, including `/dark`.
- **Retired hero headline mechanism**, `L3225–3300`: `.hero-h1`, `.h1-roll`, `.h1-roll-stack`,
  `.h1-roll-word`, `.h1-roll--pair`, `.h1-roll--inline`, `.orb-item`, `.rc` — matches the memory record
  exactly ("h1 roll retired — phone cycles alone"). `hero.tsx` today has zero `h1-roll` references.
- **Two retired marquee mechanisms**, `L3306–3358`: `.trust-ticker`/`.tt-track`/`.tt-set` and
  `L1782–1802`: `.lm-track`/`.lm-set`/`.lm-mark` (platform-logo marquee). The one actually running today
  is `.smq`/`.smq-set`/`.smq-track` in `components/sections/surface-marquee.tsx` — a third, different,
  still-live name. Three marquee eras, one survivor.
- **Retired CTA button skin**, `L370–397`: `.cta-btn--accent`, `.cta-btn--ink`, `.cta-btn--paper`. The
  live CTA (`components/ui/cta.tsx`) uses `.cta-arrow`, described in the file's own comment as "v3
  shape" — i.e. this is the CTA system v3 replaced.
- **Retired sketch/browser-frame builder skin**, `L2453–2571`, `L2739–2798`, `L2904–2914`:
  `.browser-card`, `.browser-shot`, `.phone-card`, `.rail-bar`, `.rail-bar-fill` (bare form — a nested
  `.dark-chapter .rail-bar` variant is likewise dead, see mixed list), `.serp-card/-url/-path/-title/
  -desc`, `.st-word`, `.st-btn`, `.st-card`, `.pd-panel--browser`.
- **Retired ask-chat wrapper**, `L2221–2231`: `.chat-slot` (the live bubble classes `.chat-b`/
  `.chat-b--user`/`.chat-b--bot` are actively used in `hero.tsx`, `services.tsx`, `site-chat.tsx`).
- **Misc singles**: `.t-display-mega/-hero/-xl/-xl--tight/-xl--hero` (`L117–153`), `.t-numeral`
  (`L209–217`), `.nav-mini--static` (`L874–880`), `.dock-skin--warm/--dark` (`L4593–4602`), `.ms-chip`
  (`L3340–3358`), `.svc-x`/`.svc-x-foot` (`L6621–6655`), `.cs-fig-well`/`.cs-fig-well--wide`
  (`L5190–5264`).

**28 additional rule blocks are mixed** (selector combines a dead class with a class that IS still used
elsewhere, e.g. `.dark-chapter .rail-bar` — `.dark-chapter` is heavily live, `.rail-bar` itself is not,
so this specific descendant rule is inert but the block cannot be deleted by touching `.dark-chapter`).
These are listed as **uncertain — do not blind-delete** in the interest of conservatism; a human pass
confirming the parent/child pairing is needed before removing them.

**Verification against the memory record's specific worry** ("`.dvc` / Google / chat-phone skins were
kept for the shipped site after `/dark` stopped using them — verify if that's now stale"):
- `.dvc` / `.dvc-screen` / `.dvc-island` — **genuinely still live**, actively used by LIVE files
  `hero.tsx`, `services.tsx`, `sub-offer.tsx`, `service-page.tsx`, `case-study.tsx`. Not stale. Keep.
- The "Google" skin (`.g-*`, `.serp-*`, `.ad-artifact`) — **fully stale**, zero use anywhere including
  `/dark`. The memory record's caveat no longer applies; this can be deleted once §2's rule blocks above
  are confirmed.
- The "chat phone" bubbles (`.chat-b*`) — **genuinely still live** (hero, services, site-chat). Only the
  outer `.chat-slot` wrapper is dead. Not stale as a family; one wrapper class within it is.

---

## 3. Assets

`public/` on disk: 79 files, 100.3 MB. **Only 70 of those are tracked by git** (28.26 MB) — the other 9,
totaling ~62 MB (`public/Final Comp.mp4`, 8× `public/builder/raw-*.png`), are explicitly listed in
`.gitignore` and confirmed untracked via `git status --ignored`. They are local working files on this
machine, not part of the repo a fresh clone or a new build would inherit — they do not need "deleting"
from a repo-cleanliness standpoint, only from local disk if Jake wants the space back.

**Of the 70 tracked files, 19 (8.91 MB) are referenced nowhere in `app/`, `components/`, or `lib/`:**

```
5,181 KB  public/showreel.mp4                    (poster frame /showreel-poster.jpg IS used; the video itself isn't)
  751 KB  public/work/live/dw-hero.jpg
  680 KB  public/work/dw-home.jpg                (only referenced by orphaned components/sections/process.tsx — dead-on-dead)
  632 KB  public/work/live/dw-instructors.jpg
  435 KB  public/work/live/dw-quicklinks.jpg
  369 KB  public/work/live/dw-cost-calculator.jpg
  347 KB  public/work/live/dw-mobile-booking.jpg
  160 KB  public/work/desert-wings-journey.png
  137 KB  public/work/riled-mobile.jpg
   93 KB  public/work/live/dw-phone-top.jpg
   85 KB  public/work/aahg-mobile.jpg
   61 KB  public/hero/dw-hero.jpg
   44 KB  public/hero/dw-mobile.jpg
   37 KB  public/hero/dw-journey.jpg
   29 KB  public/Executive Ai Solutions Logo.svg
   29 KB  public/hero/eas-estimator.jpg
   25 KB  public/hero/dw-mobile-2.jpg
   23 KB  public/Executive Ai Solutions Logo.png
    2 KB  public/brand/eas-mark-outline.svg
```
(`public/work/live/` holds 11 Desert Wings screenshots total; only `dw-programs.jpg`, `dw-fleet.jpg`,
`dw-booking.jpg`, and `dw-reviews.jpg` are actually wired into `lib/work.ts` — the other 6 are extra
shots that were never used.)

**Referenced only by `/dark`** (safe to keep only if `/dark` ships; irrelevant to LIVE):
`public/services/websites.jpg` (155 KB), `public/services/ad.jpg` (139 KB),
`public/services/follow-up.jpg` (97 KB) — all three via `components/dark/service-shots.tsx` — and
`public/brand/eas-mark.svg` (2 KB) via `app/dark/dark.css`.

**Referenced only by `/reel`:** none — `/reel` reads external-only `/reel-page/*.png`, not from
`public/`.

No unreferenced asset is video/large-media beyond the `showreel.mp4` case, and no unreferenced asset is
load-bearing for the contact form, chat, or site-check tool.

---

## 4. Duplication

| Concern | Path A | Path B | Verdict |
|---|---|---|---|
| Work-index card/list markup | Dead `.wki*`/`.work-card`/`.wc-*` CSS family in `globals.css` (§2) | `components/work/work-index.tsx` + `components/work/case-study.tsx` (Tailwind utilities + `wk-rail`/`mask-line`) | B is current and live; A is the July-2026 stepper's leftover skin with no consumer. Not two live implementations — one live, one CSS fossil. |
| Phone/device mockup | `.dvc`/`.dvc-screen`/`.dvc-island` in `globals.css` — LIVE, used in `hero.tsx`, `services.tsx`, `sub-offer.tsx`, `service-page.tsx`, `case-study.tsx` | `.dr-svc-shot` in `app/dark/dark.css` — used only by `components/dark/service-shots.tsx` | Genuinely two parallel device-frame skins, one per era. `.dvc` is what ships; `.dr-svc-shot` is `/dark`'s own newer treatment. Both currently in use by their respective routes — not dead, just parallel. Consolidate only if/when `/dark` replaces the homepage. |
| Marquee mechanism | Dead `.trust-ticker`/`.tt-track`/`.tt-set` and dead `.lm-track`/`.lm-set`/`.lm-mark` (globals.css, §2) | Live `.smq`/`.smq-set`/`.smq-track` in `components/sections/surface-marquee.tsx` | Two earlier marquee implementations, both dead; one current. |
| CTA button skin | Dead `.cta-btn--accent/--ink/--paper` (globals.css, §2) | Live `.cta-arrow` in `components/ui/cta.tsx` (its own comment calls it "v3 shape") | A is the pre-v3 CTA; fully superseded. |
| Scroll engine | `components/anim/smooth-scroll.tsx` — instantiates the one `Lenis` instance, mounted globally in `app/layout.tsx` | `components/dark/scroll-engine.ts` (435 lines, `/dark` only) | **Not duplication.** `scroll-engine.ts` holds no second `Lenis` instance — it reads the shared, already-smoothed `scrollY` that `smooth-scroll.tsx` produces and derives `/dark`'s own effects from it (confirmed: no `Lenis`/`new Lenis` in the file, only comments describing riding the shared instance). One scroll engine, one derived-effects consumer layer on top. |
| Nav/Footer | `components/nav.tsx`, `components/footer.tsx` | — | No second implementation exists. Both mount on every route via root `app/layout.tsx`, `/dark` and `/reel` included — worth Jake's attention (see §1) but not duplicated code. |

---

## 5. Dependencies

`package.json` — 7 `dependencies`, 10 `devDependencies`. Checked every package name against literal
`from "<pkg>"` / `require("<pkg>")` imports across `app/components/lib/scripts`, plus non-import usage
(CSS `@import`, file-path reads):

| Package | Imported? | Where |
|---|---|---|
| `@gsap/react` | yes | `components/anim/ease.ts` |
| `gsap` | yes | `components/anim/ease.ts`, `app/dark/page.tsx` |
| `lenis` | yes | `components/anim/smooth-scroll.tsx` |
| `resend` | yes | `app/api/contact/route.ts`, `app/api/chat/transcript/route.ts` |
| `next`, `react`, `react-dom` | yes | framework, everywhere |
| **`motion`** | **no** | **zero occurrences anywhere in the repo** — not imported as `motion`, `motion/react`, or otherwise. Leftover from a pre-GSAP era. Safe to remove from `package.json`. |
| `@tailwindcss/postcss` | yes (non-import) | `postcss.config.mjs` build config |
| `tailwindcss` | yes (non-import) | `@import "tailwindcss";` at the top of `app/globals.css` (Tailwind v4 CSS-first) |
| `playwright` | yes | `scripts/services/capture-screens.mjs`, `scripts/reel/render.mjs` |
| `timeweb` | yes (non-import) | `scripts/reel/render.mjs` reads `node_modules/timeweb/dist/timeweb.js` directly and injects it into a Playwright page context — not an ES import, but genuinely used |
| `eslint`, `eslint-config-next`, `typescript`, `@types/*` | tooling, N/A | — |

**Only `motion` is a confirmed-dead dependency.**

---

## 6. Verdict

**Size per era:**
- LIVE (the shipped site): 63 files, **19,525 lines**, 656 KB source.
- `/dark`-only (the candidate rebuild): 12 files, **5,656 lines**, 255 KB.
- `/reel`-only (showreel stage tool): 2 files, **749 lines**, 24 KB.
- Orphan (reachable from nothing): 3 files, **489 lines**, 17 KB.
- `app/globals.css` dead selectors: **~1,119 of 6,780 lines (16%)** confirmed safe-to-delete, plus 28
  mixed rule blocks needing a human look.
- Assets: 19 tracked, unreferenced files, **8.91 MB** of the 28.26 MB tracked `public/`. Plus ~62 MB of
  gitignored/untracked local scratch (`Final Comp.mp4`, `raw-*.png`) that never entered the repo.
- One dead npm dependency (`motion`).

**Genuinely shared infrastructure — carry this into a new design regardless of which direction wins:**
- Design tokens & type system: `app/globals.css` lines ~55–320 (`@theme`, color tokens, `--color-*`,
  type tiers) — the *tokens*, not the 1,119 dead lines mixed in with them.
- Scroll engine: `components/anim/smooth-scroll.tsx` (the one `Lenis` instance) + `components/anim/
  ease.ts` (`gsap`/`CustomEase`/`reducedMotion` setup) + `components/anim/reveal.ts` + `components/anim/
  arrival.ts` (the arrival-gate pattern) + `components/anim/view-transition.tsx`.
- SEO/metadata: `app/layout.tsx` (metadata block), `app/sitemap.ts`, `app/robots.ts`, `public/og.jpg`,
  `public/llms.txt`.
- Contact form + Resend wiring (production revenue path): `app/api/contact/route.ts`,
  `components/contact/contact-page.tsx`, `components/sections/estimate.tsx` (also posts to
  `/api/contact`), env vars `RESEND_API_KEY` / `CONTACT_EMAIL` in `.env.local`.
- Ask-this-site chat: `app/api/chat/route.ts`, `app/api/chat/transcript/route.ts`,
  `components/ui/site-chat.tsx`, env var `ANTHROPIC_API_KEY`.
- Lead-audit tool: `app/api/site-check/route.ts` + `components/sections/site-check.tsx` (scans a
  *prospect's* site for a Google tag — this is a marketing tool, not EAS's own analytics).
- Fonts: `Bricolage_Grotesque` / `Instrument_Sans` loaded in `app/layout.tsx`; `Archivo` loaded
  separately in both `app/dark/page.tsx` and `app/reel/stage/page.tsx`.
- Work/services data + case study rendering: `lib/work.ts`, `lib/services.ts`,
  `components/work/case-study.tsx`, `components/services/service-page.tsx`.

**Correction to a standing assumption:** there is **no Google Ads / GTM conversion-tracking code in this
repo at all.** That tracking lives in the separate Desert Wings client website's own codebase. This repo
only *mentions* "GTM conversion tracking" as case-study copy (`lib/work.ts:163`) and has an unrelated
tool (`api/site-check`) that scans third-party sites for a Google tag. Nothing here needs protecting on
that front — there's simply nothing to touch.

**Era-specific surface a new direction should NOT inherit:** the entire `.wki*`/`.work-card`/`.wc-*`
work-stepper CSS family, the fake-Google-SERP hero artifact, the retired `.h1-roll` headline mechanism,
the two dead marquee systems, the pre-v3 CTA skin, the sketch/browser-frame builder skin, `.chat-slot`,
and the 3 fully orphaned components (`Process`, `ValueReframe`, `TagMarquee`). None of these have a
current consumer in either the shipped site or `/dark`.

**Safest sequencing:**
1. **Delete today, zero risk:** the 3 orphan components (`components/sections/process.tsx`,
   `components/sections/value-reframe.tsx`, `components/work/tag-marquee.tsx`) and the `motion`
   dependency from `package.json`. Both have zero references anywhere, verified by import-graph and
   literal grep respectively.
2. **Delete today with a build check:** the 166 fully-dead CSS rule blocks in `app/globals.css`
   (§2) and the 19 unreferenced tracked assets in `public/` (§3, 8.91 MB) — each was checked against
   every `.tsx`/`.ts` file in the repo (not just LIVE), so removing them cannot affect `/dark` or `/reel`
   either. Recommend removing in the two passes already separated above (CSS, then assets) and running a
   full visual sweep of the shipped homepage + `/dark` + `/reel` afterward, since a false negative in a
   26-selector family this large is possible even with careful grep.
3. **Leave alone until a human resolves the pairing:** the 28 mixed CSS rule blocks (dead class nested
   under a live parent, e.g. `.dark-chapter .rail-bar`) — deleting the selector is safe, but each needs a
   one-line confirmation that the live parent class never gets that child added back.
4. **Wait until the new homepage replaces the old one:** anything in the `/dark`-only bucket
   (5,656 lines) and its 4 `/dark`-only assets — these are the *current candidate*, not dead code, and
   deleting them now would delete the work in progress. Same for `/reel` (749 lines) — it's an active
   tool, not legacy.
5. **Never touch without explicit sign-off — load-bearing for production revenue:**
   `app/api/contact/route.ts` (Resend), `components/contact/contact-page.tsx`,
   `components/sections/estimate.tsx`'s `/api/contact` call, and the `RESEND_API_KEY`/`CONTACT_EMAIL`
   env vars. There is no GTM/Ads tracking file in this repo to add to that list (see correction above).
