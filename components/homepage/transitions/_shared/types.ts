// Shared types for homepage section transitions (seams).
// Each seam component adheres to this contract so future refactors
// can swap implementations without touching consumers.

export type SeamId = "seam-1" | "seam-2" | "seam-3" | "seam-4" | "seam-5";

/**
 * Every section that participates in a seam tags its root element with
 * `data-seam-exit="<id>"` (if it's the "from" section) and/or
 * `data-seam-enter="<id>"` (if it's the "to" section). Seam components
 * query these at mount time and wire their ScrollTriggers to them.
 */
export interface SeamAnchors {
  exit: HTMLElement;
  enter: HTMLElement;
}

/**
 * Standard shape for a seam component. Seams are pure effects — they render
 * fixed-position overlays and register scroll triggers, but do not hold
 * meaningful props. Left here for future seams that may want config.
 */
export interface SeamProps {
  /** If true, seam is disabled and renders nothing. Used by debug/storybook. */
  disabled?: boolean;
}
