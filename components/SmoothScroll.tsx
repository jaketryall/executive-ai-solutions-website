"use client";

// Smooth scroll — ScrollSmoother interpolates the whole page so scroll
// itself becomes animation. effects:true activates data-speed / data-lag
// on children (elements trail at their own rates). Anchors glide.

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // Mark the page ready BEFORE creating the smoother. Layout that only makes
      // sense once the hero is pinned (the proof strip's pull-up under the reel)
      // is gated on `html.eas-ready`, so the server-rendered / pre-JS paint —
      // where the hero is just one screen tall — can't yank the proof into the
      // first screen. Setting it before create() lets the smoother's refresh
      // measure the pulled-up layout in the same pass.
      document.documentElement.classList.add("eas-ready");

      // Mobile URL-bar show/hide fires resize → ScrollTrigger.refresh storms
      // (the trace's refreshHeight / _maxScroll / _getBounds reads). Ignore it.
      ScrollTrigger.config({ ignoreMobileResize: true });

      const smoother = ScrollSmoother.create({
        wrapper: wrapRef.current!,
        content: wrapRef.current!.firstElementChild as HTMLElement,
        smooth: 1.1,
        // lag/speed effects desktop-only — they jitter on native touch scroll
        effects: window.matchMedia("(min-width: 1024px)").matches,
        smoothTouch: false, // native feel + perf on touch devices
      });

      // Browsers scroll the overflow:hidden wrapper internally on
      // scrollIntoView / focus (e.g. tabbing into the contact form), which
      // splits scrolling across two systems and corrupts the view.
      // Transfer any wrapper scroll back to the smoother.
      const wrapper = wrapRef.current!;
      const onWrapperScroll = () => {
        if (wrapper.scrollTop) {
          const offset = wrapper.scrollTop;
          wrapper.scrollTop = 0;
          smoother.scrollTo(smoother.scrollTop() + offset, false);
        }
      };
      wrapper.addEventListener("scroll", onWrapperScroll);

      // Anchor links glide through the smoother instead of teleporting.
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest?.('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute("href")!;
        if (href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        smoother.scrollTo(target, true, "top 96px");
      };
      document.addEventListener("click", onClick);

      return () => {
        wrapper.removeEventListener("scroll", onWrapperScroll);
        document.removeEventListener("click", onClick);
        document.documentElement.classList.remove("eas-ready");
        smoother.kill();
      };
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef}>
      <div>{children}</div>
    </div>
  );
}
