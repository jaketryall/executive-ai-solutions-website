"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ScrollTrigger, reducedMotion } from "@/components/anim/ease";
import { beginArrival, releaseArrival } from "@/components/anim/arrival";

// Route transitions via the same-document View Transitions API.
//
// App Router navigations are SOFT (no document swap), so the CSS
// `@view-transition { navigation: auto }` opt-in never fires on <Link> clicks.
// This provider closes that gap with ONE document-level capture listener:
// every internal, hash-free left-click is default-prevented (Next's own Link
// handler bails on defaultPrevented, and React onClick handlers still run,
// so the mobile menu keeps closing itself) and re-driven through
// document.startViewTransition(router.push).
//
// The transition itself is the STACK: forward, the old page sinks back,
// shrinks and dims while the new page sheets up over it with a rounded lip —
// the same spatial grammar as the site's rise-over sections, promoted to
// routing. BACKWARD (browser back, or forward after a back), the stack POPS:
// the sheet slides off downward and the buried page rises back to full
// light. Traversals are caught with the Navigation API where it exists
// (Chromium, recent Safari) and stay plain soft navs elsewhere.

const DUR = 800;
// --ease-structure, as a WAAPI easing string (a CustomEase name means nothing here)
const EASE = "cubic-bezier(0.62, 0.05, 0.1, 1)";

type VTDocument = Document & {
  startViewTransition?: (cb: () => Promise<void>) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

// minimal Navigation API surface (not in TS's lib.dom yet)
type NavigateEvent = Event & {
  navigationType: "push" | "replace" | "reload" | "traverse";
  canIntercept: boolean;
  hashChange: boolean;
  downloadRequest: string | null;
  destination: { url: string; index: number };
  intercept: (opts?: { handler?: () => Promise<void> }) => void;
};
type NavigationLike = EventTarget & {
  currentEntry?: { index: number } | null;
};

export function ViewTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<(() => void) | null>(null);
  const committed = useRef(pathname);
  const inFlight = useRef(false);

  // the new route has committed — release the in-flight transition
  useLayoutEffect(() => {
    committed.current = pathname;
    pending.current?.();
    pending.current = null;
  }, [pathname]);

  // triggers on the departed page died with it; remeasure the new one
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // never leave the arrival gate armed if this provider unmounts mid-flight
  useEffect(() => releaseArrival, []);

  useEffect(() => {
    const doc = document as VTDocument;

    /* the two root layers of the stack, as WAAPI keyframes */
    const BURIED = {
      transform: ["translateY(0) scale(1)", "translateY(-89px) scale(0.95)"],
      opacity: [1, 0.45],
    };
    const SHEET = {
      transform: ["translateY(100%)", "translateY(0)"],
      borderRadius: ["24px 24px 0 0", "0px 0px 0px 0px"],
    };
    const reverse = (k: PropertyIndexedKeyframes): PropertyIndexedKeyframes =>
      Object.fromEntries(
        Object.entries(k).map(([p, v]) => [
          p,
          Array.isArray(v) ? [...v].reverse() : v,
        ])
      ) as PropertyIndexedKeyframes;

    const choreograph = (backward: boolean) => {
      // forward: old page buried under the rising sheet.
      // backward: the sheet rides off; the buried page returns to full light
      // (z-order flips via html.vt-back in globals.css).
      document.documentElement.animate(
        backward ? reverse(SHEET) : BURIED,
        { duration: DUR, easing: EASE, pseudoElement: "::view-transition-old(root)" }
      );
      document.documentElement.animate(
        backward ? reverse(BURIED) : SHEET,
        { duration: DUR, easing: EASE, pseudoElement: "::view-transition-new(root)" }
      );
    };

    /* one path for clicks AND traversals: capture, update, choreograph,
       release. `update` performs the navigation for clicks and is a no-op
       for traversals (Next's own popstate handling owns those — which can
       COMMIT before this callback runs, so `dest` short-circuits the wait
       when the destination is already on screen). */
    const run = (update: () => void, backward: boolean, dest?: string) => {
      inFlight.current = true;
      // entrances on the incoming page hold until the sheet lands
      beginArrival();
      const html = document.documentElement;
      // the nav's view-transition-name applies only while in flight — kept
      // on permanently it becomes a backdrop-root boundary and the capsules'
      // glass blur silently stops sampling the page (globals.css, VT block)
      html.classList.add("vt-live");
      if (backward) html.classList.add("vt-back");

      const vt = doc.startViewTransition!(() => {
        update();
        return new Promise<void>((resolve) => {
          if (dest && committed.current === dest) {
            resolve(); // the traversal beat us to the commit
            return;
          }
          pending.current = resolve;
          // never trap the page frozen if the route errors out
          setTimeout(resolve, 2500);
        });
      });

      vt.ready
        .then(() => choreograph(backward))
        .catch(() => {}); // aborted transitions (rapid double-click) are fine

      // settled or aborted, the page has arrived — release held entrances,
      // then remeasure now that the real layout is on screen
      vt.finished
        .catch(() => {})
        .finally(() => {
          html.classList.remove("vt-live", "vt-back");
          inFlight.current = false;
          releaseArrival();
          ScrollTrigger.refresh();
        });

      return vt;
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || a.target || a.hasAttribute("download") || "noVt" in a.dataset)
        return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.hash) return; // anchor scrolls and hash-carrying navs skip the sheet
      if (url.pathname === location.pathname) return;

      if (!doc.startViewTransition || reducedMotion()) return; // plain soft nav

      // a click mid-flight would skip the riding transition to its end (a
      // visible jump) — swallow it; the destination is one beat away anyway
      if (inFlight.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault(); // Next's Link handler sees this and stands down
      const href = url.pathname + url.search;
      run(() => router.push(href), false);
    };
    document.addEventListener("click", onClick, true);

    /* back/forward: the same stack, popped. Where the Navigation API
       exists, the traverse is WRAPPED, not intercepted: the capture starts
       HERE, synchronously in the navigate event — before the entry commits
       and before Next's popstate handling can paint the destination. (An
       intercept handler runs after the commit, and on fast cached backs the
       "old" snapshot was already the new page — the transition then slid a
       page over itself.) Elsewhere this listener never binds and back stays
       a plain soft nav. */
    const nav = (window as Window & { navigation?: NavigationLike }).navigation;
    const onNavigate = (ev: Event) => {
      const e = ev as NavigateEvent;
      if (e.navigationType !== "traverse") return;
      if (e.hashChange || e.downloadRequest !== null) return;
      if (!doc.startViewTransition || reducedMotion()) return;
      if (inFlight.current) return; // let the browser jump; never stack captures
      const to = new URL(e.destination.url);
      if (to.origin !== location.origin) return;
      if (to.pathname === location.pathname) return;
      const backward =
        nav?.currentEntry != null &&
        e.destination.index >= 0 &&
        e.destination.index < nav.currentEntry.index;
      // Next's router owns the traversal (popstate → commit); the pending/
      // failsafe pair inside run() releases the capture once it lands
      run(() => {}, backward === true, to.pathname);
    };
    nav?.addEventListener("navigate", onNavigate);

    return () => {
      document.removeEventListener("click", onClick, true);
      nav?.removeEventListener("navigate", onNavigate);
    };
  }, [router]);

  return null;
}
