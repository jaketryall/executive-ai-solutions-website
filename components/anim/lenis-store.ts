import type Lenis from "lenis";

/* A section that needs to reach the root's Lenis instance (to hand it to
   `lenis/snap`, or to call scrollTo on it) has no context to read it from —
   SmoothScroll is mounted once in the root layout and owns the instance
   itself. This is a 12-line pub/sub instead: SmoothScroll calls setLenis
   whenever it creates or destroys its instance, and anything downstream
   subscribes with onLenis, which calls back immediately with whatever is
   current (null on touch, where SmoothScroll never creates one at all) and
   again every time it changes. */

type Cb = (l: Lenis | null) => void;

let current: Lenis | null = null;
const subs = new Set<Cb>();

export function setLenis(l: Lenis | null) {
  current = l;
  subs.forEach((cb) => cb(l));
}

/** calls back now with the current instance (null on touch) and again whenever it changes */
export function onLenis(cb: Cb) {
  subs.add(cb);
  cb(current);
  return () => {
    subs.delete(cb);
  };
}
