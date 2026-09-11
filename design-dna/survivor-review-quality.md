# Survivor review — quality, not function

Scope: the CARRY-FORWARD SET named for the ground-zero rebuild. Judged on whether the CODE is worth
inheriting, not whether it currently works. Report only — nothing in the repo was changed.

---

## 1. Deprecated / outdated

- **No pages-era patterns anywhere.** Grepped the whole tree for `getServerSideProps` / `getStaticProps`
  / `getInitialProps` / `next/head` / `next/legacy/image` — zero hits. App Router used correctly and
  consistently. Nothing to unlearn here.
- **No `runtime = "edge"` in the carry-forward set.** The three API routes that DO declare a runtime
  (`app/api/chat`, `app/api/chat/transcript`, `app/api/site-check` — outside this scope) already use
  `runtime = "nodejs"`, the currently-correct choice. Good precedent to keep, not a habit to fix.
- **Dependencies** (`npm outdated` + `npm audit`, live registry, 2026-09-10):
  - `next@16.2.9` — **npm audit reports a CRITICAL advisory** on this exact range (bundled `postcss`/`sharp`
    also flagged high), fixed in `16.3.4`. This isn't "materially behind," it's an open critical CVE
    sitting in the pinned version. Bump before anything else ships.
  - `next`, `react`, `react-dom` are pinned with **no caret** (`"16.2.9"`, `"19.2.4"`, `"19.2.4"`) — every
    other dependency uses `^`. That inconsistency is what let the critical Next advisory sit un-updated;
    it isn't wrong to pin exactly, but pin *and* have a process to bump, or don't pin.
  - `motion@^12.40.0` — confirmed **zero imports** anywhere in `app/components/lib` (`grep` for
    `from "motion"` / `from 'motion/react'` returns nothing). Dead weight exactly as the dead-code audit
    found. Drop it; the site already carries GSAP for everything animated.
  - `eslint@9` vs current major `10` — a real gap but not urgent (tied to `eslint-config-next`).
  - `resend@6.12.4` vs `6.27.0` — same major, just stale; not on the carry-forward list itself but worth
    a bump pass whenever dependencies are touched.
  - `typescript@^5` — TS 7 (the Go-based compiler) now exists as a distinct major; `^5` won't pull it in
    automatically, nothing to fix today, just don't assume `^5` future-proofs you.
  - `tsconfig.json` — `strict: true` is ON. Good baseline, actually enforced (see §2).

## 2. Type safety

- **Zero `any`, zero `@ts-ignore`/`@ts-expect-error`** anywhere in `app/components/lib`. That's a real,
  verified finding (not "didn't look hard enough") — genuinely clean for a solo-built site.
- **Unsound, not just untidy:**
  - `components/estimator/pricing.ts` — four `Array.find(id)!.field` lookups (lines 54, 55, 73, 74),
    repeated again in the out-of-scope `pricing-page.tsx` (2 more). Sound TODAY only because
    `EstimateState`'s fields are literal unions matching the arrays 1:1 — but nothing enforces that
    coupling at the array-definition site, and `EstimateState` can arrive from outside code (URL
    params, a future persisted/shared-link state) that TypeScript never validates. The `!` is standing
    in for a runtime guarantee that isn't actually checked.
  - `components/sections/estimate.tsx:202` — `Object.fromEntries(new FormData(form).entries()) as
    Record<string, string>` assumes every field is a text value; `FormData` entries can be `File`. Safe
    only because this particular form has no file inputs — an `as` cast riding on an assumption, not a check.
- **Untidy, not unsound:** `useRef<T>(null!)` appears **25 times** across components (6 in the scoped
  files: estimate.tsx, footer/nav/etc. outside scope corroborate it's the house style). It's a common,
  deliberate React+TS idiom for DOM refs and not a real risk — flagged only because it's the same
  "trust me" shape as the `.find()!` habit above; worth naming once rather than fixing 25 sites.
- Ad hoc DOM-type shims (`VTDocument`, `NavigationLike` in `view-transition.tsx`; the inline
  `window as Window & {...}` casts in `smooth-scroll.tsx`) are hand-rolled locally in **two different
  files** for overlapping experimental APIs (View Transitions, Navigation API) instead of one shared
  ambient `.d.ts`. Not unsound — TS lib just doesn't have these yet — but duplicated typing effort.

## 3. React correctness

This is the strongest part of the carry-forward set. In `estimate.tsx`'s ~230 non-JSX lines:
- The persona-preselect effect (lines 50–67) explicitly guards against **React Strict Mode's double
  effect invocation** with a ref flag, and the comment cites the exact live bug it fixes (a phantom
  $2,500 shown on an untouched estimator). This is evidence of real Strict Mode testing, not luck.
- `useSyncExternalStore(subscribeBuild, getBuild, getBuildServer)` is used **correctly** — a real
  `getServerSnapshot` third argument (`getBuildServer` returns `null`), which is exactly what
  `components/builder/store.ts`'s external module-singleton store needs to hydrate safely.
- `gsap.matchMedia()` inside `useGSAP` returns a cleanup function from its `.add()` callback — respected.
- No missing-dependency-array or fetch-without-cleanup effects found in the reviewed slice.
- The one real smell is **structural, not a bug**: state machine, persona capture, submit/fetch logic,
  and two separate `useGSAP` choreography blocks are all interleaved in one 490-line component file.
  Nothing here is wrong; it's just unreadable as one unit and will fight the next redesign the moment
  the visual layout changes shape. Extract the non-JSX half into a hook before rebuilding the JSX.

## 4. The scroll engine — `components/anim/*`

**Verdict: carry as-is.** This is the one piece of infrastructure worth taking whole.
- **Cleanup**: every listener (`popstate`, `navigate`, `click`, resize-adjacent) is removed in a returned
  cleanup function; Lenis is explicitly `.destroy()`-ed and its `gsap.ticker` callback removed.
- **Reflow**: no per-frame `getBoundingClientRect`/layout reads in the hot path; Lenis drives
  `ScrollTrigger.update` off its own rAF, GSAP owns the ticker.
- **Resize-safe**: `ScrollTrigger.config({ ignoreMobileResize: true })` deliberately filters out
  iOS/Android URL-bar-driven height churn while still refreshing on genuine size/orientation changes —
  a documented fix for a real measured bug, not a guess.
- **Back-navigation-safe**: per-history-entry scroll positions saved via the Navigation API and restored
  on traversal, double-checked a frame later once pins re-measure; `view-transition.tsx` coordinates
  arrival gating with `arrival.ts` so entrances never play under the transition sheet. `reveal.ts`
  explicitly documents (with root cause) a prior `once: true` crash and its fix.
- **`prefers-reduced-motion`**: checked and short-circuits Lenis creation, the arrival choreography, and
  the route-transition WAAPI keyframes.
- **JS-disabled**: progressive enhancement throughout — native scroll/anchor links work unaugmented;
  `main`'s CSS `margin-bottom` fallback exists specifically for the no-JS footer case.
- Only nit: the duplicated experimental-DOM-type shims noted in §2. Not a rewrite reason.

## 5. Content files — `lib/work.ts`, `lib/services.ts`

**Good news: neither is coupled to old markup.** Shapes are semantic (`WorkImage`, `WorkFigure`,
`ProjectResults`, `DeliverableReceipt` as a kind-tagged union) — no CSS class names, section IDs, or
layout assumptions baked into the data. This is genuinely reusable content-as-data.
- `lib/work.ts` shows real content discipline: a comment trail documents that a previously **fabricated**
  ads-credit stat was found and removed, and "Dozens" is used deliberately instead of inventing a precise
  lead count Jake hadn't confirmed. No remaining fabricated metrics found in this file.
- `lib/services.ts` **does** carry placeholder numbers presented as if real ("Calls 18", "Cost per lead
  $38") — honestly commented as `PLACEHOLDER`, but they render on the page indistinguishable from a real
  client stat. Flag for removal/replacement before reuse, not a rewrite of the file.
- `lib/quotes.ts` is disclosed placeholder (de-named, role-only attribution, explicit "swap for real
  quotes" comment) — responsible placeholder, still a placeholder to close out before launch.
- Minor bug: `nextProject()` in `work.ts` silently returns `PROJECTS[0]` for an unknown slug instead of
  signaling the miss (`findIndex` → `-1` → `(-1+1) % length` → `0`).

## 6. Accessibility + SEO — `layout.tsx`, `sitemap.ts`, `robots.ts`

All three are solid. `lang="en"` set, canonical handled per-page with a root fallback, OG/Twitter cards
complete, JSON-LD `Organization` present, `:focus-visible` styled globally (see §7). `sitemap.ts` pulls
live from `PROJECTS`/`SERVICES` so it can't drift from real routes. `robots.ts` is minimal and correct.
Nothing to fix.

## 7. Verdict table

| File | Verdict | Reason |
|---|---|---|
| `components/anim/ease.ts` | CARRY AS-IS | Single registration point, documented curves, sound. |
| `components/anim/arrival.ts` | CARRY AS-IS | Tiny, correct gate/release semantics. |
| `components/anim/reveal.ts` | CARRY AS-IS | One reveal recipe, documented `once:true` crash fix baked in. |
| `components/anim/smooth-scroll.tsx` | CARRY WITH FIXES | Excellent scroll engine; centralize the ad hoc `Window &` shims. |
| `components/anim/view-transition.tsx` | CARRY WITH FIXES | Same shim duplication; otherwise the strongest file in the set. |
| `lib/work.ts` | CARRY AS-IS | Markup-decoupled, honest metric provenance; fix the silent `nextProject` fallback. |
| `lib/services.ts` | CARRY WITH FIXES | Sound shape; strip/replace the placeholder performance numbers first. |
| `lib/persona.ts` | CARRY AS-IS | Small, defensive, SSR-safe. |
| `lib/quotes.ts` | CARRY WITH FIXES | Fine shape; still placeholder content, swap before launch. |
| `components/estimator/pricing.ts` | CARRY WITH FIXES | Sound math; replace `.find()!` chains with a fallback or exhaustive map. |
| `components/builder/packs.ts` | CARRY AS-IS | Clean typed content, safe `?? fallback` lookups, no coupling. |
| `components/builder/store.ts` | CARRY AS-IS | Correct minimal external-store pattern for `useSyncExternalStore`. |
| `app/layout.tsx` | CARRY AS-IS | Metadata/JSON-LD/a11y all complete. |
| `app/sitemap.ts` | CARRY AS-IS | Derives from live content, can't drift. |
| `app/robots.ts` | CARRY AS-IS | Correct and minimal. |
| `package.json` | REWRITE (the dependency list) | Drop unused `motion`; bump `next` off its CVE; fix the pin-vs-caret inconsistency. |
| `next.config.ts` | CARRY AS-IS | Small, commented, no legacy config. |
| `tsconfig.json` | CARRY AS-IS | `strict: true`, modern module/resolution settings. |
| `postcss.config.mjs` | CARRY AS-IS | Nothing to it. |
| `.gitignore` | CARRY AS-IS | Sane, includes secrets/scratch dirs correctly. |
| `app/globals.css` `@theme` (lines 3–53) | CARRY AS-IS | The real token block — tight, no drift risk. |
| `app/globals.css` foundation layer (lines 55–637) | CARRY AS-IS | Base reset, type-tier ladder, `.cta-btn`/`.roll-link`/`.u-link`/`.seg` — genuinely reusable, class-based, markup-decoupled. **Correct the scoped range**: the task's estimated 55–320 undershoots; the real reusable foundation runs to ~637. |
| `app/globals.css` lines 638–6780 | DELETE (do not carry) | Nav-capsule/surfaces/work-ledger/case-study/pricing/contact CSS — implementation styles bound to the OLD markup. Not tokens; don't let this ride along by "copying the top of the file." |
| `components/sections/estimate.tsx` (lines 1–232, the logic) | CARRY WITH FIXES | Logic itself is high quality (see §3); extract into a hook — the 230-line UI-file entanglement is the actual defect, not the code. |

## The three habits worth naming so the rebuild never repeats them

1. **An untyped global event bus made of string literals.** `CustomEvent("eas:estimate", …)` /
   `"eas:chat-open"` / `"eas:site-check"` are dispatched and re-listened-for across at least six files
   (`estimate.tsx`, `nav.tsx`, `persistent-cta.tsx`, `site-chat.tsx`, `services.tsx`, `site-check.tsx`),
   each side independently re-casting `e as CustomEvent<{...}>` with no shared type and no compile-time
   check that the string or the payload shape agree. One typo silently breaks cross-component comms with
   no error. Centralize as one typed emitter/hook (or lift into context/store) next time.
2. **Copy-pasted validation instead of one source of truth.** The exact same fragile hand-rolled email
   regex (`/^[^@\s]+@[^@\s]+\.[^@\s]+$/`) is pasted verbatim in three places
   (`app/api/contact/route.ts`, `estimate.tsx`, `contact-page.tsx`). Any future fix to email validation
   has to be remembered and applied three times — it won't be.
3. **Non-null assertions doing the job a real check should do.** `.find(id)!.field` (6 sites across the
   pricing logic) and `useRef<T>(null!)` (25 sites) are both "trust the invariant" patterns that are sound
   only as long as nobody changes the source-of-truth array or reads the ref before mount. None are bugs
   today, but the pattern itself — asserting instead of guarding — is exactly what turns a future edit
   into a runtime crash with no type-checker warning.
