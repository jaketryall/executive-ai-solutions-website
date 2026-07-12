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
// The transition itself is the STACK: the old page sinks back, shrinks and
// dims while the new page sheets up over it with a rounded lip — the same
// spatial grammar as the site's rise-over sections, promoted to routing.
// ONE clean transition for every route; no per-element morphs.

const DUR = 800;
// --ease-structure, as a WAAPI easing string (a CustomEase name means nothing here)
const EASE = "cubic-bezier(0.62, 0.05, 0.1, 1)";

type VTDocument = Document & {
  startViewTransition?: (cb: () => Promise<void>) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

export function ViewTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<(() => void) | null>(null);

  // the new route has committed — release the in-flight transition
  useLayoutEffect(() => {
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

      const doc = document as VTDocument;
      if (!doc.startViewTransition || reducedMotion()) return; // plain soft nav

      e.preventDefault(); // Next's Link handler sees this and stands down
      const href = url.pathname + url.search;

      // entrances on the incoming page hold until the sheet lands
      beginArrival();

      const vt = doc.startViewTransition(() => {
        router.push(href);
        return new Promise<void>((resolve) => {
          pending.current = resolve;
          // never trap the page frozen if the route errors out
          setTimeout(resolve, 2500);
        });
      });

      vt.ready
        .then(() => {
          // old page: buried under the new sheet — up, smaller, dimmer
          document.documentElement.animate(
            {
              transform: [
                "translateY(0) scale(1)",
                "translateY(-89px) scale(0.95)",
              ],
              opacity: [1, 0.45],
            },
            {
              duration: DUR,
              easing: EASE,
              pseudoElement: "::view-transition-old(root)",
            },
          );
          // new page: rises as a rounded-top sheet, squares off as it lands
          document.documentElement.animate(
            {
              transform: ["translateY(100%)", "translateY(0)"],
              borderRadius: ["24px 24px 0 0", "0px 0px 0px 0px"],
            },
            {
              duration: DUR,
              easing: EASE,
              pseudoElement: "::view-transition-new(root)",
            },
          );
        })
        .catch(() => {}); // aborted transitions (rapid double-click) are fine

      // settled or aborted, the page has arrived — release held entrances,
      // then remeasure now that the real layout is on screen
      vt.finished
        .catch(() => {})
        .finally(() => {
          releaseArrival();
          ScrollTrigger.refresh();
        });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
