/* Tiny cross-section store: the builder writes what the visitor made, the
   contact form (in estimate.tsx) reads it at submit time and shows it in the
   "Attached to your message" aside. Stays null until the visitor actually
   touches the builder — an untouched default attaches nothing. */

import type { BuildChoice } from "./packs";

let current: BuildChoice | null = null;
const subs = new Set<() => void>();

export function setBuild(c: BuildChoice | null) {
  current = c;
  subs.forEach((fn) => fn());
}

export function getBuild(): BuildChoice | null {
  return current;
}

export function getBuildServer(): BuildChoice | null {
  return null;
}

export function subscribeBuild(fn: () => void): () => void {
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}
