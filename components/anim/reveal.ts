import { gsap } from "@/components/anim/ease";

/* THE fade-up — the site's one scroll entrance (apple-grammar.md §5,
   measured off iphone-17-pro):

   · fires the moment the element ENTERS the viewport (top 100%), never at
     75% — the page must never feel like it's withholding content
   · y: 30 → 0 on a sharp ease-out; opacity decoupled on a LONGER, softer
     curve, so position settles first and the element "glows in" after
     (Apple's two-curve split — the anti-mechanical detail)
   · ~100ms stagger between siblings
   · transforms cleared on completion (Apple clears its inline styles too)

   One recipe. Sections differ by WHAT reveals, never by HOW. */
export function revealUp(
  targets: gsap.TweenTarget,
  trigger: Element | null | undefined,
  opts: { stagger?: number; start?: string } = {}
) {
  const { stagger = 0.1, start = "top 100%" } = opts;
  if (!trigger) return;
  const tl = gsap.timeline({
    /* toggleActions, NEVER once:true (2026-08-13 — the "This page couldn't
       load" crash). once:true auto-KILLS the trigger after it fires; on a
       soft/back nav the page effect re-runs and a ScrollTrigger.refresh()
       (view-transition + footer + case-study all fire one) hits the
       orphaned trigger -> reads `.end` of undefined -> recursive refresh ->
       stack overflow -> the renderer hangs and Chrome kills the tab. Every
       hand-written section already uses this; the shared helper was the one
       holdout. See reference_dev_gotchas_css_gsap memory. play-once-and-stay
       = "play none none none". */
    scrollTrigger: { trigger, start, toggleActions: "play none none none" },
  });
  tl.fromTo(
    targets,
    { y: 30 },
    {
      y: 0,
      duration: 0.7,
      ease: "expo.out",
      stagger,
      clearProps: "transform",
    },
    0
  ).fromTo(
    targets,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.95, ease: "power2.out", stagger },
    0
  );
  return tl;
}
