"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion } from "@/components/anim/ease";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Lenis in its default native-scroll mode (real scrollTop — position:sticky keeps working),
// driving ScrollTrigger so every scrubbed beat carries momentum.
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const traversed = useRef(false);
  const first = useRef(true);

  // scroll positions per history entry, saved the moment any navigation
  // starts (the Navigation API's `navigate` fires synchronously, while
  // currentEntry is still the OUTGOING entry). The root layout forces
  // history.scrollRestoration = "manual" so reloads start clean at the top —
  // which also means back/forward restoration is OURS to do.
  const positions = useRef(new Map<string, number>());

  useEffect(() => {
    const onPop = () => {
      traversed.current = true;
    };
    window.addEventListener("popstate", onPop);

    const nav = (
      window as Window & {
        navigation?: EventTarget & { currentEntry?: { key: string } | null };
      }
    ).navigation;
    const onNavigate = (ev: Event) => {
      // only real departures. Next's router fires replaceState during and
      // after traversals — saving on those clobbers the destination entry's
      // stored position with the not-yet-restored scroll.
      const type = (ev as Event & { navigationType?: string }).navigationType;
      if (type !== "push" && type !== "traverse") return;
      const key = nav?.currentEntry?.key;
      if (key) positions.current.set(key, window.scrollY);
    };
    nav?.addEventListener("navigate", onNavigate);

    return () => {
      window.removeEventListener("popstate", onPop);
      nav?.removeEventListener("navigate", onNavigate);
    };
  }, []);

  // a pushed route starts at the TOP — synced through Lenis, pre-paint.
  // Next does jump to 0 on commit, but Lenis's lerp loop still holds the
  // old smoothed position and writes it straight back, so pages were
  // arriving mid-scroll. Layout effect = before the view transition
  // snapshots the new page, so the sheet lands on the top of the page.
  // Back/forward instead RESTORE the position saved for that entry.
  useIsomorphicLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const lenis = lenisRef.current;
    const jump = (y: number) =>
      lenis
        ? lenis.scrollTo(y, { immediate: true, force: true })
        : window.scrollTo(0, y);

    const wasTraverse = traversed.current;
    traversed.current = false;
    if (wasTraverse) {
      const nav = (
        window as Window & {
          navigation?: { currentEntry?: { key: string } | null };
        }
      ).navigation;
      const key = nav?.currentEntry?.key;
      const saved = key ? positions.current.get(key) : undefined;
      if (saved != null) {
        jump(saved);
        // the restored page may not have its full height pre-paint
        // (ScrollTrigger pins re-add theirs after refresh) — re-assert once
        requestAnimationFrame(() => requestAnimationFrame(() => jump(saved)));
      }
      return;
    }
    if (location.hash) return; // anchor-carrying navs land on their target
    jump(0);
  }, [pathname]);

  useEffect(() => {
    if (reducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onAnchor = (e: Event) => {
      const a = (e.target as HTMLElement).closest?.(
        'a[href^="#"], a[href^="/#"]'
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href")!;
      // "/#section" links smooth-scroll only when we're already home;
      // elsewhere they're real navigations the router owns
      if (href.startsWith("/#") && location.pathname !== "/") return;
      const el = document.querySelector(href.replace(/^\//, ""));
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72 });
    };
    document.addEventListener("click", onAnchor);

    return () => {
      document.removeEventListener("click", onAnchor);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
