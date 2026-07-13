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
  opts: { stagger?: number; start?: string; once?: boolean } = {}
) {
  const { stagger = 0.1, start = "top 100%", once = true } = opts;
  if (!trigger) return;
  const tl = gsap.timeline({
    scrollTrigger: { trigger, start, once },
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
