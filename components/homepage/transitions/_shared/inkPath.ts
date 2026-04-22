/**
 * Generates a `clip-path: polygon(...)` value for the ink flood effect.
 *
 * The shape is a clean rectangular "card" that rises from the bottom of
 * the viewport, with a smaller rectangular "tab" protruding above the
 * card's top edge — like a manila folder tab or a dashboard drawer
 * handle. The tab reads as an intentional designed object rather than
 * an organic liquid wave.
 *
 * Geometry (clockwise from top-left of the tab):
 *
 *                 ┌───────┐            ← tabTop
 *   ──────────────┘       └─────────── ← cardTop
 *   │                                 │
 *   │          dark card body         │
 *   │                                 │
 *   └─────────────────────────────────┘ ← 100% (bottom of viewport)
 *
 * At progress=0, cardTop sits at 100% so the card body has zero height;
 * only a small tab peeks above the viewport floor. At progress=1 the
 * card top reaches 0%, the tab has scrolled off the top, and the entire
 * viewport is dark.
 *
 * @param progress  0 → 1. 0 = nothing visible (card below viewport),
 *                  1 = card fully covers viewport (tab off-screen above).
 * @returns a polygon() string suitable for CSS `clip-path`.
 */
export function generateInkPath(progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress));

  // Tab dimensions (% of viewport). Tuned to read as a proper "tab" —
  // narrow enough to look intentional, tall enough to be clearly visible.
  const TAB_HEIGHT = 5;
  const TAB_WIDTH = 15;
  // Center the tab horizontally. Offset (e.g., 35%) would feel editorial;
  // centered reads as "clean and deliberate," which matches the card metaphor.
  const TAB_CENTER_X = 50;
  const tabStart = TAB_CENTER_X - TAB_WIDTH / 2;
  const tabEnd = TAB_CENTER_X + TAB_WIDTH / 2;

  // Card body's top edge — rises from the viewport floor (100%) to its
  // ceiling (0%) as progress completes.
  const cardTop = 100 - clamped * 100;
  // Tab sits a fixed distance above the card's top edge. At progress=0,
  // tabTop = 95% — a sliver of tab is visible near the bottom of the
  // viewport. At progress=1, tabTop = -5% — the tab has scrolled off
  // the top while the card fills everything below.
  const tabTop = cardTop - TAB_HEIGHT;

  const vertices = [
    `${tabStart}% ${tabTop}%`,
    `${tabEnd}% ${tabTop}%`,
    `${tabEnd}% ${cardTop}%`,
    `100% ${cardTop}%`,
    `100% 100%`,
    `0% 100%`,
    `0% ${cardTop}%`,
    `${tabStart}% ${cardTop}%`,
  ];

  return `polygon(${vertices.join(", ")})`;
}
