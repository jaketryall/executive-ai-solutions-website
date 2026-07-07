// The arrival gate. Route transitions ride an 800ms sheet over the incoming
// page (view-transition.tsx); any entrance that fires at mount plays half its
// choreography UNDER that sheet and lands mid-flight — the "flashing /
// animating at the wrong time" glitch. Pages instead hold their entrance
// behind whenArrived(): resolved immediately on a hard load, and on a soft
// nav only once the transition finishes.
//
// Usage in a section's useGSAP:
//   gsap.set(...initial hidden states...);            // synchronous — no flash
//   const enter = contextSafe(() => { ...timelines });
//   let dead = false;
//   whenArrived().then(() => !dead && enter());
//   return () => { dead = true; };

let gate: Promise<void> | null = null;
let release: (() => void) | null = null;

/** view-transition.tsx calls this right before startViewTransition */
export function beginArrival() {
  releaseArrival(); // never stack gates — a stuck one would trap every entrance
  gate = new Promise<void>((res) => (release = res));
}

/** view-transition.tsx calls this when the transition settles (or aborts) */
export function releaseArrival() {
  release?.();
  release = null;
  gate = null;
}

/** entrances await this; resolves at once outside a route transition */
export function whenArrived(): Promise<void> {
  return gate ?? Promise.resolve();
}
