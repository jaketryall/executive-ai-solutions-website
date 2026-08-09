"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  reducedMotion,
} from "@/components/anim/ease";
import { whenArrived } from "@/components/anim/arrival";
import { CTA } from "@/components/ui/cta";
import { Monogram } from "@/components/ui/monogram";
import { RollLink } from "@/components/ui/roll-link";

// Footer reveals from under the page (E2): the main content lifts off this
// fixed layer; the display-mega wordmark rises scroll-linked and bleeds past
// the bottom viewport edge — the page's single intentional break.
export function Footer() {
  const root = useRef<HTMLElement>(null!);
  const pathname = usePathname();
  const estimateHref = "/pricing#estimate";

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const main = document.querySelector<HTMLElement>("main");
      const lines = q("[data-fit]") as HTMLElement[];

      // the lockup lines are FITTED, not clamped: measure each at a probe
      // size and scale so the type spans the row exactly, every viewport.
      // The probe shrink-wraps (inline-block) — a block line never measures
      // NARROWER than its row, so short lines would refuse to grow.
      const fit = () => {
        for (const el of lines) {
          if (!el.offsetParent) continue; // display:none can't be measured
          el.style.fontSize = "100px";
          el.style.display = "inline-block";
          const avail = el.parentElement!.clientWidth;
          const w = el.getBoundingClientRect().width;
          el.style.display = "";
          if (avail && w) el.style.fontSize = `${((100 * avail) / w) * 0.995}px`;
        }
      };

      // main carries a CSS-default reveal gap (see globals) so the footer is
      // reachable even without JS; measurement refines it, and refresh is
      // rAF-debounced so raw resize events don't thrash ScrollTrigger
      let raf = 0;
      const setH = () => {
        if (!root.current) return; // resize can race an unmount
        fit(); // the lockup sets the footer's height — fit before measuring
        if (main) main.style.marginBottom = `${root.current.offsetHeight}px`;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      setH();
      document.fonts.ready.then(setH);
      // width-GATE the resize (2026-08-08): on mobile, scrolling shows/hides
      // the browser chrome, which fires a continuous stream of resize events
      // that only change the VIEWPORT HEIGHT. Re-fitting + refreshing on each
      // one thrashed ScrollTrigger every frame — framy scroll + a jumping
      // footer. The lockup fit and reveal geometry depend on WIDTH, so only
      // a real width change needs the work; height-only chrome slides are
      // ignored.
      let lastW = window.innerWidth;
      const onResize = () => {
        if (window.innerWidth === lastW) return;
        lastW = window.innerWidth;
        setH();
      };
      window.addEventListener("resize", onResize);
      // soft navs re-run this effect while the NEW page's subtree may not
      // have committed yet (App Router streams children after the layout
      // re-renders), so the homepage's closer pin-spacer can be missing
      // from the first measurement and nothing refreshes later — soft navs
      // never fire the window `load` refresh that saves hard loads. The
      // arrival gate resolves only once the transition (and the page under
      // it) has settled: re-measure then.
      let dead = false;
      whenArrived().then(() => !dead && setH());

      let st: ScrollTrigger | undefined;
      const blocks = q("[data-foot-rise]") as HTMLElement[];
      const veil = q(".footer-veil")[0] as HTMLElement | undefined;
      /* the homepage ends on the DARK closer — its contrast already earns
         the reveal, and it was tuned to taste (Jake). The shadow/veil/wake
         physics exist for pages whose last section is light-on-light. */
      const plain = pathname === "/";
      if (main) main.style.boxShadow = plain ? "" : "0 34px 89px -21px rgba(19, 20, 19, 0.35)";
      if (!reducedMotion() && main && lines.length && !plain) {
        // the whole footer wakes as the page lifts away: it starts a shade
        // in SHADOW (the veil — it really is UNDER the page), the upper
        // blocks rise in first, the lockup settles last, and the scrub runs
        // to the literal final scrollable pixel (no dead tail)
        gsap.set(lines, { yPercent: 34 });
        gsap.set(blocks, { autoAlpha: 0, y: 21 });
        st = ScrollTrigger.create({
          trigger: main,
          // refresh LAST: on soft navs this trigger is created before the
          // incoming page's pins, and refresh processes triggers in
          // creation order with pins reverted — measured first, the reveal
          // window lands one pin-duration early (the homepage bug,
          // 2026-07-28). Low priority = measured after every pin re-adds
          // its spacing.
          refreshPriority: -1,
          start: "bottom bottom",
          end: () =>
            `bottom ${window.innerHeight - (root.current?.offsetHeight ?? 0)}px`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (veil) gsap.set(veil, { opacity: 0.14 * (1 - p) });
            blocks.forEach((el, i) => {
              const bp = gsap.utils.clamp(0, 1, (p - i * 0.07) / 0.38);
              gsap.set(el, { autoAlpha: bp, y: 21 * (1 - bp) });
            });
            lines.forEach((el, i) => {
              const lp = gsap.utils.clamp(
                0,
                1,
                (p - i * 0.12) / (1 - i * 0.12)
              );
              gsap.set(el, { yPercent: 34 * (1 - lp) });
            });
          },
        });
      } else if (!reducedMotion() && main && lines.length && plain) {
        // the ORIGINAL homepage reveal, untouched: lockup rise only
        gsap.set(blocks, { autoAlpha: 1, y: 0 });
        if (veil) gsap.set(veil, { opacity: 0 });
        gsap.set(lines, { yPercent: 34 });
        st = ScrollTrigger.create({
          trigger: main,
          refreshPriority: -1, // measure after the closer pin — see above
          start: "bottom bottom",
          end: () =>
            `bottom ${Math.max(120, window.innerHeight - (root.current?.offsetHeight ?? 0))}px`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            lines.forEach((el, i) => {
              const lp = gsap.utils.clamp(
                0,
                1,
                (self.progress - i * 0.12) / (1 - i * 0.12)
              );
              gsap.set(el, { yPercent: 34 * (1 - lp) });
            });
          },
        });
      } else {
        gsap.set(lines, { yPercent: 0 });
        gsap.set(blocks, { autoAlpha: 1, y: 0 });
        if (veil) gsap.set(veil, { opacity: 0 });
      }

      return () => {
        dead = true;
        window.removeEventListener("resize", onResize);
        st?.kill();
        if (main) {
          main.style.marginBottom = "";
          main.style.boxShadow = "";
        }
      };
    },
    /* re-run per ROUTE (bug found 2026-07-28): the footer mounts once in
       the layout, so without a pathname dependency both the plain/elevated
       branch AND the trigger geometry froze at the first-loaded page. On a
       soft nav to the homepage the reveal window then sat one closer-pin
       duration (~734px) EARLY — the rise finished behind the still-pinned
       closer and the wordmark arrived pre-risen. Re-running after the new
       page's effects (tree order: main's children before the footer) means
       the pin-spacer exists before setH's refresh remeasures. */
    { scope: root, dependencies: [pathname], revertOnUpdate: true }
  );

  // panel ground, not canvas: the sheet lifting away needs a color step
  // beneath it on pages that END light (canvas-on-canvas hid the seam)
  return (
    <footer ref={root} className="fixed inset-x-0 bottom-0 z-0 overflow-hidden bg-panel text-ink">
      <div className="wrap pt-[89px] md:pt-[144px]">
        <div className="flex flex-col justify-between gap-[55px] md:flex-row md:items-start">
          {/* contact block — the diagonal counterweight */}
          <div data-foot-rise className="max-w-[440px]">
            <p className="t-meta text-ink/60">Start yours</p>
            <p className="t-title mt-[13px]">
              One call, a fixed quote, and a website that finally earns its keep
            </p>
            <div className="mt-[34px] flex flex-wrap items-center gap-[21px]">
              <CTA href={estimateHref} label="Price my project" tone="ink" />
              <a
                href="mailto:hello@executiveaisolutions.com"
                className="u-link t-meta py-fib-2 text-ink/70"
              >
                hello@executiveaisolutions.com
              </a>
            </div>
          </div>

          <nav data-foot-rise className="flex flex-col items-start gap-[13px] md:items-end" aria-label="Footer">
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
            <RollLink href="/privacy" className="t-meta text-ink/70">
              Privacy
            </RollLink>
            <RollLink href="#top" className="t-meta text-ink/70">
              Back to top
            </RollLink>
          </nav>
        </div>

        {/* the mark keeps the © row company — out of the statement, where it
            was eating line one's budget */}
        <div data-foot-rise className="mt-[55px] flex items-end justify-between md:mt-[89px]">
          <Monogram
            className="h-[34px] w-[34px] text-ink/80"
            label="Executive AI Solutions monogram"
          />
          <p className="t-meta text-ink/70">© 2026</p>
        </div>

        {/* the sign-off: the name at Lesse scale — TWO fitted lines, each
            spanning the full row (the stack is what buys the height a
            22-character name can't reach on one line), both rising whole as
            the footer reveals (no crops — the viewport edge is the mask) */}
        <div className="mt-[21px] select-none text-ink" aria-hidden>
          <p data-fit className="footer-line">
            <span>Executive AI</span>
          </p>
          <p data-fit className="footer-line">
            <span>Solutions</span>
          </p>
        </div>
      </div>
      {/* the shadow the page casts while it's still overhead — scrubbed to 0 */}
      <div className="footer-veil pointer-events-none absolute inset-0 bg-ink opacity-[0.14]" aria-hidden />
    </footer>
  );
}
