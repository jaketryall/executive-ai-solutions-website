"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CTA } from "@/components/ui/cta";

/* The persistent CTA capsule (Lesse's always-reachable pill, weaponized):
   bottom-center, appears once the hero has been scrolled past, and hides
   wherever the action itself is on screen (the estimate chapter, the footer).
   Once the visitor touches the estimator, the capsule carries their live
   total — estimate.tsx dispatches `eas:estimate` with {total} on change. */
export function PersistentCta() {
  const root = useRef<HTMLDivElement>(null!);
  const [total, setTotal] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = root.current;
    let pastHero = false;
    let overFooter = false;
    const inZone = new Set<Element>(); // in-flow action zones currently on screen

    const apply = () => {
      el.classList.toggle(
        "is-live",
        pastHero && !overFooter && inZone.size === 0,
      );
    };

    const main = document.querySelector("main");
    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.8;
      // the footer is FIXED under <main> and revealed as main lifts away, so
      // an IntersectionObserver always sees it — the honest signal is main's
      // bottom edge rising into the viewport
      overFooter = main
        ? main.getBoundingClientRect().bottom < window.innerHeight * 0.85
        : false;
      apply();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const zones = ["#estimate"]
      .map((s) => document.querySelector(s))
      .filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inZone.add(e.target);
          else inZone.delete(e.target);
        }
        apply();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    zones.forEach((z) => io.observe(z));

    const onEstimate = (e: Event) => {
      const d = (e as CustomEvent<{ total?: number }>).detail;
      if (typeof d?.total === "number") setTotal(d.total);
    };
    window.addEventListener("eas:estimate", onEstimate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("eas:estimate", onEstimate);
      io.disconnect();
    };
    // re-bind zones when the route (and its sections) change
  }, [pathname]);

  return (
    <div ref={root} className="pcta">
      <CTA
        href="/#estimate"
        label="Get an instant estimate"
        meta={total !== null ? `$${total.toLocaleString()}` : undefined}
        tone="accent"
      />
    </div>
  );
}
