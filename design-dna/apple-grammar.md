# The Apple Grammar — measured, not vibed

Synthesized 2026-07-13 from four live teardowns (apple.com home, /macbook-neo,
/iphone-17-pro, /apple-one + /icloud) at 1440×900 — every rule below is
grounded in a computed-style or sampled-frame measurement. This is the
site-wide direction (Jake: "I need this to be an Apple-level site"), applied
in EAS's own brand (paper/ink/steel), never as a skin-swap to Apple's colors.

## 1 · Grounds & chapters
- Two-chapter pages, not checkerboards: iphone-17-pro runs ~67% of the page
  as ONE unbroken dark chapter, flips to light ONCE for the close. Commit to
  long runs; don't alternate per-section.
- Sections abut at zero-margin seams; ALL rhythm is per-section padding.
  Apple's pairs: 160/216px (≈356px at a major joint); slim CTA bands opt out
  of one side (160–240px joints). Two-tier rhythm, not one constant.
  → EAS mapping: keep fib scale; majors = pt-fib-7/pb-fib-7-ish (233/233),
  slim bands = fib-6 single-sided.
- Homepage-style band walls: tiles touch (12px), theme swap does separation.

## 2 · Composition
- NEVER text-beside-image at desktop. Zero instances across 17 sections.
  Stacked always: header block → media, full column width.
- Centered = cinematic/statement sections; left-aligned = informational/list
  sections. Alignment is a semantic switch, not taste.
- Full-bleed is rationed to ~3 moments per page (hero + 1–2 scroll epics).
  Everything else is contained media.
- Bare statement bands (no imagery) are a CLOSING device only (FAQ, index).
- Text columns are line-length-capped hard (Apple: explicit max-widths,
  ~45–60ch — several subheads capped at 250–295px).

## 3 · Type
- 2 families (Display ≥20px, Text below). Weights: 400 and 600 almost
  exclusively (pills are 400 — size carries emphasis, not weight).
- The ladder that matters: 17 body · 21 lead · 28 · 40 · 48 · 56 h2 · 80 hero.
  Negative tracking at big sizes (56 → -0.28px, 80 → -1.2px).
- Secondary grays: #86868b / #6e6e73 on light, #d2d2d7 on dark.
  → EAS mapping: keep our ladder + weight 650; adopt the "few tiers, hard
  line-length caps, gray does secondary" discipline.

## 4 · Surfaces
- Cards: flat, NO shadow (one float shadow exists sitewide), NO visible
  border, radius 18–30px, white on #f5f5f7 canvas — separation by color
  contrast, not elevation.
- Price is the ONE moment of accent color (Apple One: 40px/700 orange).
  Value is proven by arithmetic (itemize + strike-through), not checkmarks.

## 5 · Motion (the law)
- NO perpetual loops. `animation-iteration-count: infinite` matched ZERO
  elements across every page. Looping VIDEO inside gallery cards is fine
  (that's media, not decoration); looping UI is not.
- THE fade-up (the only entrance): opacity 0→1 + translateY 30→0, ~750ms,
  sharp ease-out (expo/quart), ~100ms sibling stagger, fires the moment the
  element enters (top ≈ 100% viewport — NOT 75%). JS-driven; position
  finishes before opacity (decoupled curves). Clear inline styles after.
- Scroll-scrub epics: sticky viewport panel inside a runway ~12× viewport;
  scrub drives video currentTime / frames; text beats use the same fade-up.
- UI micro tokens: 160/240/320ms; cubic-bezier(0.4,0,0.6,1) signature,
  (0.25,0.1,0.3,1) soft.

## 6 · THE gallery (macbook-neo "Get the highlights." — the genius section)
- Native scroll-snap track: display:grid grid-auto-flow:column, gap 20px,
  cards 1260×680 (87.5% of viewport → ~90px peek each side),
  scroll-snap-align center, scroll-snap-type x mandatory. Dot-nav clicks =
  scrollTo({behavior:'smooth'}) — the browser is the tween.
- THE mechanic: captions have NO animation of their own. Every frame:
  dist = cardCenterX − viewportCenterX
  captionX = dist × 0.1266          (linear parallax lag)
  captionOpacity = (1 − min(|dist|/1280, 1))³   (cubic falloff)
  Direction-aware text entrance falls out of the geometry for free.
- Card media stays opacity 1 / unscaled during swipes — only the caption
  layer moves. One thing in motion per interaction.
- Dot-nav: 8px dots, current elongates to a 48px pill (width transition
  0.25s). Autoplay (if any) gates to the section being in view.
- **THE AXIS LAW (why horizontal exists at all — Jake's question,
  2026-07-15):** the axis encodes information structure. DOWN is the
  argument — the sequence every visitor completes, in the order the page
  chose (claim → proof → price → ask). ACROSS is evidence — SIBLINGS of
  the same kind at the same level, where no card is a prerequisite for the
  next. Horizontal buys: opt-in depth (the scanner loses one viewport, the
  interested swipe through six — page length stays disciplined), one focal
  preserved across multiplicity (snap centers ONE card, neighbors peek as
  the "more" affordance), and gesture separation on touch (vertical =
  navigate, horizontal = explore; zero conflict). The discipline: NOTHING
  everyone must see goes in a track — carousels are seen by fewer people
  by definition. The spine holds the argument; the track holds the
  gallery. The test before building one: is this content a SEQUENCE or a
  SET? Sequences go down. Sets of 3+ peers may go across. Sets of two go
  side by side with no physics (Gate 0, derived-motion.md).

## 7 · Chrome
- Global nav: 44px, rgba(255,255,255,0.8) + saturate(1.8) blur(20px), inert
  to scroll. Local nav on deep pages: 52px frosted dark
  (rgba(22,22,23,0.8) + same blur), product name left, anchors + one Buy
  pill right. (= our dock, validated.)
- One loud ask per page (a single filled pill high up), then quiet
  text-chevron re-asks at every scroll stop. Never two loud CTAs competing.

## 8 · Selling the intangible (services pages)
- No product to photograph → show the CONTENT itself (real artifacts: the
  ad, the report, the site) or an icon composition over a color field.
  → EAS: our diegetic artifacts (ad card, chrome frame, chat) are already
  the right move; compose them Apple-flat.

## 9 · The column system (measured live 2026-07-15; Jake's favorite page
##     is iphone-17-pro — treat its values as the north star)

PRODUCT PAGES (macbook-neo + iphone-17-pro, identical system):
- Core container `.viewport-content`: **max-width 1260px, fixed** — the
  dominant cap (24–34 uses/page). 90px side margins at 1440 viewport; at
  1920 the margins grow, the 1260 does NOT (capped, never fluid).
- Copy column (the lede): 756–840px at 21px/29px type ≈ 72–80 ch/line —
  and set PER BREAKPOINT, non-monotonic (756 @1440 → 622 @1920: narrower
  on bigger screens, protecting the reading measure).
- Feature-list copy: ~367px at 17px/25px ≈ 43 ch.
- Headline blocks: 945–1260px, display type 48–96px.
- Media: ~980–1296px (rides the 1260 grid), with rationed full-bleed
  exceptions. Snap-gallery cards: wide 696px / standard 372px, 20px gap,
  flush to the 90px margin.
- Secondary caps: 1024px (inner grids), 1440px (full-bleed), 980px only
  in legacy nav/footer chrome. (No 1080 anywhere — folklore.)

HOMEPAGE (the storefront — a DIFFERENT grammar on purpose):
- Promo tiles: fluid, no cap — 702×580 (≈1.21:1) in a 2-up grid, 12px
  gutters and 12px edge margins at 1440; at 1920 it re-lays-out (3
  full-width featured rows + 942px pairs). Tile headline 40px/600.
- <main> max-width 2560px; nothing else is capped.

THE MEANING: the product page is a fixed READING instrument (the 1260
cap + per-breakpoint copy measure exist to protect comprehension); the
homepage is a fluid BILLBOARD system (density of offers per viewport).
Same tokens, opposite width philosophy, because the visitor's task is
opposite. EAS's .wrap (max-width 1280px) already matches the product-page
philosophy — correct, since the whole EAS site is a pitch, not a
storefront.

## Rollout map (in order, each pass judged before the next)
1. /services/google-ads: hero (done) + highlights gallery (§6) + fade-up
   unification + section-seam rhythm. ← THE priority page.
2. The fade-up recipe replaces the entrance zoo site-wide (fire at 100%,
   750ms, 0.1 stagger).
3. Homepage → bands/chapters (§1–2).
4. Pricing/case/contact: seam rhythm + composition audit (already close).
5. Motion diet: retire ambient UI loops; demos survive as card media.
