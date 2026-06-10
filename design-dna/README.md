# Design DNA — Executive AI Solutions

The surviving genome from the 2026-06 ground-zero teardown. Everything else was
deleted deliberately; these are the pieces the owner declared sacred. Any future
build starts from this folder.

## Colors

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#e5e1db` | Primary background — warm cream. The owner's favorite. |
| `--paper-warm` | `#efebe4` | Card / surface lift on paper |
| `--ink` | `#1a1816` | Primary text + dark surfaces |
| `--ink-deep` | `#0e0d0c` | Cinema black — dark-section background |
| `--taupe` | `#78736c` | Muted text, hairlines, metadata |
| `--oxblood` | `#7a1e27` | THE accent. One saturated accent does all the work. |
| `--ox-deep` | `#5a1520` | Oxblood pressed / layered shadow |

Rules that made the palette work:
- Light sections use `paper`, dark sections use `ink-deep` — high contrast flips, never mid-grays.
- Oxblood is rationed: status dots, the active nav pill, one accent word, CTA moments. Never large fills.
- Borders are ink/paper at 8–18% opacity, hairline weight.

## Fonts

Geist + Geist Mono (and Caveat for handwritten accents), loaded via `next/font/google`:

```tsx
import { Geist, Geist_Mono, Caveat } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" }); // handwritten flourishes

// <body className={`${geist.variable} ${geistMono.variable} ${caveat.variable} font-sans`}>
```

Conventions:
- Display: Geist 800–900, tight tracking (`-0.035em` to `-0.06em`), line-height ~0.92–1.05.
- Mono (Geist Mono): uppercase micro-labels at 9–11px with `0.14em–0.22em` letter-spacing.
- Body: Geist 400, taupe for secondary text.

## The button ("pill inside a pill")

`PillCTA.tsx` — the owner's favorite element. Anatomy:
1. `MagneticButton` wrapper — whole button drifts toward cursor (spring), inner content lags slightly (parallax).
2. Pill: ink background, paper text, `rounded-full`, `h-11 pl-5 pr-2`.
3. `HoverText` label — per-letter slide-up swap on hover.
4. Inner circle (`w-8 h-8`, paper bg, ink arrow): on hover the arrow slides out right while a twin slides in from the left.
5. `.press` — scale 0.97 on :active. `.focus-ring` for keyboard.

Used at: hero CTA, navbar CTA (h-10/w-7 compact variant), anywhere "Start a project" appears.

## Files in this folder

- `tokens.css` — palette + motion custom properties + `.press` / `.focus-ring` / `.pulse-dot` utilities
- `motion.ts` — shared easing/duration vocabulary (`ease.expoOut` etc.)
- `MagneticButton.tsx` — magnetic wrapper (framer-motion / motion)
- `HoverText.tsx` — letter-swap hover label
- `PillCTA.tsx` — the assembled signature button

Components import from `./motion` so the folder is drop-in portable. They were
written against `framer-motion` v12 — when reusing under the `motion` package,
change imports to `motion/react` (API identical).

## Assets kept

- `public/Executive Ai Solutions Logo.png` + `.svg` — the logo
- `public/*.webp` — project photography/mockups (+ `thumbnails/`, `backups/`)
- `public/final-comp.mp4` + `video-poster.webp` — showreel
- `public/icon.png` — favicon (was `app/icon.png`)

## Env

`.env.local` keeps Resend only (`RESEND_API_KEY`, `CONTACT_EMAIL`). Sanity was
removed from the project entirely.
