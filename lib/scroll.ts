import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Replay-on-entry with a LATE reset: the entrance replays each time you
// scroll down to it, but the hidden state is only restored once the trigger
// is fully below the viewport — never while it's visible (no pop-out when
// scrolling back up). Call inside a gsap context/useGSAP with plugins
// registered.
export function replayEntrance(
  targets: gsap.TweenTarget,
  trigger: HTMLElement,
  vars: { from: gsap.TweenVars; to: gsap.TweenVars; start: string },
) {
  const tween = gsap.fromTo(targets, vars.from, {
    ...vars.to,
    paused: true,
  });
  ScrollTrigger.create({
    trigger,
    start: vars.start,
    onEnter: () => tween.restart(),
    // If the page loads/refreshes already past the start, show it.
    onRefresh: (self) => {
      if (self.progress > 0) tween.progress(1);
    },
  });
  ScrollTrigger.create({
    trigger,
    start: "top bottom",
    onLeaveBack: () => tween.pause(0),
  });
}
