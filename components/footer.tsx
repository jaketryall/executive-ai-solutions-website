"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_LOOP,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";
import { Monogram } from "@/components/ui/monogram";
import { RollLink } from "@/components/ui/roll-link";

// Footer reveals from under the page (E2): the main content lifts off this
// fixed layer; the display-mega wordmark rises scroll-linked and bleeds past
// the bottom viewport edge — the page's single intentional break.
export function Footer() {
  const root = useRef<HTMLElement>(null!);
  const pathname = usePathname();
  const estimateHref = pathname === "/" ? "/#estimate" : "/pricing#estimate";

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const main = document.querySelector<HTMLElement>("main");
      const wordmark = q(".footer-wordmark")[0];

      // main carries a CSS-default reveal gap (see globals) so the footer is
      // reachable even without JS; measurement refines it, and refresh is
      // rAF-debounced so raw resize events don't thrash ScrollTrigger
      let raf = 0;
      const setH = () => {
        if (!root.current) return; // resize can race an unmount
        if (main) main.style.marginBottom = `${root.current.offsetHeight}px`;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      setH();
      document.fonts.ready.then(setH);
      window.addEventListener("resize", setH);

      let st: ScrollTrigger | undefined;
      if (!reducedMotion() && main && wordmark) {
        gsap.set(wordmark, { yPercent: 55 });
        st = ScrollTrigger.create({
          trigger: main,
          start: "bottom bottom",
          end: () =>
            `bottom ${Math.max(120, window.innerHeight - (root.current?.offsetHeight ?? 0))}px`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(wordmark, { yPercent: 55 * (1 - self.progress) }),
        });
        // the motif's terminal registration carries the one ambient breathe
        gsap.to(q(".footer-mark"), {
          y: -6,
          duration: 9,
          ease: EASE_LOOP,
          yoyo: true,
          repeat: -1,
        });
      } else if (wordmark) {
        gsap.set(wordmark, { yPercent: 0 });
      }

      return () => {
        window.removeEventListener("resize", setH);
        st?.kill();
        if (main) main.style.marginBottom = "";
      };
    },
    { scope: root }
  );

  return (
    <footer ref={root} className="fixed inset-x-0 bottom-0 z-0 overflow-hidden bg-canvas text-ink">
      <div className="wrap pt-[89px] md:pt-[144px]">
        <div className="flex flex-col justify-between gap-[55px] md:flex-row md:items-start">
          {/* contact block — the diagonal counterweight */}
          <div className="max-w-[440px]">
            <p className="t-meta text-ink/60">Start yours</p>
            <p className="t-title mt-[13px]">
              One call, a fixed quote, and a website that finally earns its keep
            </p>
            <div className="mt-[34px] flex flex-wrap items-center gap-[21px]">
              <CTA href={estimateHref} label="Get an estimate" tone="ink" />
              <a href="mailto:hello@executiveaisolutions.com" className="u-link t-meta text-ink/70">
                hello@executiveaisolutions.com
              </a>
            </div>
          </div>

          <nav className="flex flex-col items-start gap-[13px] md:items-end" aria-label="Footer">
            <RollLink href="/work" className="t-meta text-ink/70">
              Work
            </RollLink>
            <RollLink href="/#services" className="t-meta text-ink/70">
              Services
            </RollLink>
            <RollLink href="/pricing" className="t-meta text-ink/70">
              Pricing
            </RollLink>
            <RollLink href="/contact" className="t-meta text-ink/70">
              Contact
            </RollLink>
            <RollLink href="#top" className="t-meta text-ink/70">
              Back to top
            </RollLink>
          </nav>
        </div>

        {/* wordmark + motif bookend */}
        <div className="relative mt-[55px] flex items-end justify-between gap-[34px] md:mt-[89px]">
          <div className="footer-mark mb-[21px] shrink-0 text-ink">
            <Monogram className="h-[34px] w-[34px] md:h-[42px] md:w-[42px]" label="Executive AI Solutions monogram" />
          </div>
          <p className="t-meta mb-[21px] shrink-0 text-ink/55">
            © 2026 Executive AI Solutions
          </p>
        </div>
      </div>
      <div className="overflow-hidden">
        <p
          className="footer-wordmark t-display-mega select-none whitespace-nowrap text-center uppercase text-ink"
          style={{ marginBottom: "-0.16em" }}
          aria-hidden
        >
          Executive
        </p>
      </div>
    </footer>
  );
}
