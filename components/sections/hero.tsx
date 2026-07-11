"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";
import { ArtifactFrame } from "@/components/ui/artifact";
import { whenArrived } from "@/components/anim/arrival";

/* The hero — "the search". Overlap-and-bleed: the outcome statement commands
   the left zone; the right zone ENACTS the concept — a Google search types
   itself and the client's real ad assembles under it. That ad card physically
   overhangs the hero→proof seam (fib-55) and is the element that docks into
   the proof section on first scroll. Parallel tracks: the headline mask-rise
   starts at t~0 (it is the LCP and the 3-second hook), the search enactment
   runs concurrently, and the sequence resolves on the CTA.

   The statement keeps the rolling industry mirror: it cycles for organic
   visitors and locks to ?i= for labeled traffic (ads + reopened build links —
   same param the builder reads). Outcome leads, industry follows. */
const ROLL_PAIRS = [
  { out: "More customers", who: "for local business" },
  { out: "More students", who: "for flight schools" },
  { out: "More bookings", who: "for restaurants" },
  { out: "More jobs", who: "for the trades" },
];
const ROLL_LOCK: Record<string, number> = {
  flight: 1,
  restaurant: 2,
  trades: 3,
  other: 0,
};

const QUERY = "flight school near me";

/* PLACEHOLDER — swap with the real Desert Wings ad, verbatim from Google Ads
   (real headline + real description). The display URL is already real. */
const AD = {
  url: "desertwingsflightschool.com",
  title: "Desert Wings Flight School | Learn to Fly at Falcon Field",
  desc: "Discovery flights and PPL through CFI training in Mesa, AZ. Book your first lesson today.",
};

// layout effect so the ?i= lock commits BEFORE first paint
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Hero() {
  const root = useRef<HTMLElement>(null!);
  const [locked, setLocked] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const i = new URLSearchParams(window.location.search).get("i");
    if (i && ROLL_LOCK[i] !== undefined) setLocked(ROLL_LOCK[i]);
  }, []);

  const ariaPair = ROLL_PAIRS[locked ?? 0];

  useGSAP(
    (context) => {
      const q = gsap.utils.selector(root);
      const navEl = document.querySelector(".site-nav");
      const typeEl = q(".g-q")[0] as HTMLElement;
      const searchCard = q("[data-dock-card]")[0] as HTMLElement;

      if (reducedMotion()) {
        gsap.set([navEl, ...q("[data-anim]")], { autoAlpha: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        if (typeEl) typeEl.textContent = QUERY;
        gsap.set([searchCard, ...q(".g-list > *")], { autoAlpha: 1, y: 0 });
        // rest state: the climb already happened
        const list = q("[data-glist]")[0] as HTMLElement;
        const you = q("[data-you]")[0] as HTMLElement;
        if (list && you) {
          list.insertBefore(you, list.firstChild);
          you.classList.add("is-lit");
        }
        return; // static: assembled search, the ad on top
      }

      let entranceDone = false;
      let inView = false;
      let cycleTl: gsap.core.Timeline | null = null;
      let pendingNext = false;
      // assigned below, referenced by sync once cycles begin
      let startCycle: (first: boolean) => void = () => {};

      const sync = () => {
        const on = entranceDone && inView && !document.hidden;
        if (cycleTl) (on ? cycleTl.play() : cycleTl.pause());
        if (on && pendingNext) {
          pendingNext = false;
          startCycle(false);
        }
      };
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          inView = self.isActive;
          sync();
        },
      });
      document.addEventListener("visibilitychange", sync);
      context.add(() => () => document.removeEventListener("visibilitychange", sync));

      /* ── Title sequence: PARALLEL tracks. The statement is the protagonist
         and starts immediately; the search enactment is the concurrent
         secondary action; the CTA resolves the sequence; chips land last. ── */
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE_STRUCTURE } });
      tl.fromTo(
        navEl,
        { autoAlpha: 0, y: -16 },
        { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "transform" },
        0.05
      )
        // track A — the eyebrow sets the category, the statement rises
        .fromTo(
          q("[data-anim='eyebrow']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.1
        )
        .fromTo(
          q("[data-anim='statement']"),
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 1.0 },
          0.22
        )
        // track B — the enactment, concurrent
        .fromTo(
          searchCard,
          { autoAlpha: 0, y: 21, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.75 },
          0.2
        );

      /* ── the enactment, as a CYCLE: buried results → lift-off → the row
         flies OVER the others (they duck down in a cascade as it passes) →
         sets down on top → lights up as the ad → holds → resets and plays
         again. Pauses off-screen and on hidden tabs, like the roll. ── */
      const list = q("[data-glist]")[0] as HTMLElement;
      const you = q("[data-you]")[0] as HTMLElement;
      const ghostEls = list
        ? (Array.from(list.children).filter((el) => el !== you) as HTMLElement[])
        : [];
      const allRows = list ? ([...ghostEls, you] as HTMLElement[]) : [];
      const climbInto = (c: gsap.core.Timeline) => {
        // measured at flight start, BEFORE the flying-card class pads the row
        let lift = 0;
        let push = 0;
        c.addLabel("flight")
          .call(
            () => {
              lift = you.offsetTop - (list.children[0] as HTMLElement).offsetTop;
              push = you.offsetHeight + 14; // the list gap
              you.classList.add("is-flying"); // picks up a white card + shadow
            },
            [],
            "flight"
          )
          // lift off the surface…
          .to(you, { scale: 1.035, duration: 0.22, ease: EASE_UI }, "flight")
          // …fly over the others…
          .to(you, { y: () => -lift, duration: 0.85, ease: EASE_STRUCTURE }, "flight+=0.12")
          // …which duck down in a cascade as the row passes them
          .to(ghostEls[1], { y: () => push, duration: 0.55, ease: EASE_STRUCTURE }, "flight+=0.24")
          .to(ghostEls[0], { y: () => push, duration: 0.55, ease: EASE_STRUCTURE }, "flight+=0.4")
          // …and set down
          .to(you, { scale: 1, duration: 0.28, ease: EASE_UI }, "flight+=0.72")
          .call(
            () => {
              // touchdown: the card chrome eases off (CSS transition), the
              // DOM order becomes truth
              you.classList.remove("is-flying");
              list.insertBefore(you, list.firstChild);
              gsap.set(allRows, { clearProps: "transform" });
            },
            [],
            "flight+=1.05"
          )
          .call(
            () => {
              you.classList.add("is-lit"); // Sponsored + steel + unfold
            },
            [],
            "flight+=1.3"
          );
      };

      startCycle = (first: boolean) => {
        if (!list || !you) return;
        const c = gsap.timeline({
          onComplete: () => {
            cycleTl = null;
            queueNext();
          },
        });
        cycleTl = c;
        if (first) {
          // the entrance already staged the buried list — hold the beat
          c.addLabel("flight", 0.45);
        } else {
          // reset: results sweep out, the query clears and RETYPES like a
          // user, then the results arrive buried again
          const retype = { n: 0 };
          c.to(allRows, { autoAlpha: 0, y: 8, duration: 0.35, stagger: 0.04, ease: EASE_UI })
            .call(() => {
              you.classList.remove("is-lit");
              list.appendChild(you); // back to the bottom of the pile
              gsap.set(allRows, { clearProps: "transform" });
              gsap.set(allRows, { autoAlpha: 0, y: 13 });
              if (typeEl) typeEl.textContent = "";
            })
            .to(
              retype,
              {
                n: QUERY.length,
                duration: 0.7,
                ease: "none", // diegetic typing, constant rate
                snap: { n: 1 },
                onUpdate: () => {
                  if (typeEl) typeEl.textContent = QUERY.slice(0, retype.n);
                },
              },
              "+=0.3"
            )
            .to(
              allRows,
              { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1, ease: EASE_STRUCTURE },
              "+=0.2"
            )
            .addLabel("flight", "+=0.45");
        }
        climbInto(c);
        c.to({}, { duration: 4.5 }); // the lit hold before the next pass
      };
      const queueNext = () => {
        if (entranceDone && inView && !document.hidden) startCycle(false);
        else pendingNext = true;
      };

      // the enactment plays on every load — it IS the hero moment
      const typeState = { n: 0 };
      tl.to(
        typeState,
        {
          n: QUERY.length,
          duration: 0.7,
          // diegetic typing: constant character rate, not an easing choice
          ease: "none",
          snap: { n: 1 },
          onUpdate: () => {
            if (typeEl) typeEl.textContent = QUERY.slice(0, typeState.n);
          },
        },
        0.45
      )
        // the results arrive — and the client is buried at the bottom
        .fromTo(
          q(".g-list > *"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1 },
          1.15
        )
        // a beat lives inside the first cycle; launch it
        .call(() => startCycle(true));

      tl
        // the resolve — the sequence lands on the one action
        .fromTo(
          q("[data-anim='ctas']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.95
        )
        .call(() => {
          entranceDone = true;
          sync();
        });

      // fonts measurable AND the route-transition sheet landed
      Promise.all([document.fonts.ready, whenArrived()]).then(() => {
        if (!root.current) return;
        /* lock the card to its LIT height before anything plays: force the
           expanded state invisibly, measure, revert — same frame, no paint
           between. The loop then rearranges content inside ONE height. */
        if (list && you) {
          const expand = you.querySelector(".g-expand") as HTMLElement;
          const spon = you.querySelector(".g-sponsored") as HTMLElement;
          if (expand && spon) {
            expand.style.transition = "none";
            expand.style.gridTemplateRows = "1fr";
            spon.style.height = "auto";
            list.style.minHeight = `${list.offsetHeight}px`;
            expand.style.gridTemplateRows = "";
            spon.style.height = "";
            requestAnimationFrame(() => {
              expand.style.transition = "";
            });
          }
        }
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            tl.play();
            ScrollTrigger.refresh();
          })
        );
      });

      /* ── exit parallax (not a pin): the statement lifts slightly faster
         than the scroll as the hero leaves; the ad card holds its ground for
         the dock (step-3 scrub takes it the rest of the way). ── */
      gsap.to(q(".hero-left"), {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      // the card carries the click across the seam: it lags the scroll and
      // slides over the proof section's rounded rise before leaving
      gsap.to(searchCard, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root, dependencies: [locked], revertOnUpdate: true }
  );

  return (
    <section id="top" ref={root} className="hero dark-chapter relative">
      {/* grid ratio matches the proof section exactly (62/38) so the ad card
          column and the proof anchor zone share the same edges — the straddle
          lands flush, not "almost" */}
      <div className="hero-in wrap relative z-10 grid min-h-[92svh] items-center gap-fib-5 pb-fib-6 pt-[120px] md:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] md:pt-fib-6">
        {/* ── left zone: the statement (outcome leads, industry follows) ── */}
        <div className="hero-left">
          <p data-anim="eyebrow" className="t-meta uppercase text-paper/45">
            Full-funnel ads agency
          </p>
          <h1 data-anim="statement" className="t-statement mt-fib-2 max-w-[36ch]">
            <span className="text-paper">
              {ariaPair.out} {ariaPair.who}.
            </span>{" "}
            <span className="text-paper/40">
              We run the ads, build the landing page, and answer for the
              whole click.
            </span>
          </h1>

          <div data-anim="ctas" className="mt-fib-3 flex flex-wrap items-center gap-fib-2">
            <CTA href="#estimate" label="Get an instant estimate" tone="paper" />
            <a href="#builder" className="u-link t-meta py-fib-2">
              Build your site in 60 seconds
            </a>
          </div>
        </div>

        {/* ── right zone: the enactment, centered with the statement — the
            hero's one living thing. The dark→light seam below is earned by
            the proof section rising over this chapter with a rounded top. ── */}
        <div
          data-dock-card
          className="relative z-20 md:mt-fib-4 md:self-start"
        >
          <ArtifactFrame
            variant="card"
            tone="paper"
            label={`Google search for ${QUERY}, showing the Desert Wings Flight School ad`}
            className="ad-artifact w-full"
          >
            <div className="g-search" aria-hidden>
              <svg viewBox="0 0 16 16" fill="none" className="g-glass">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="g-q" />
              <span className="g-caret" />
            </div>
            {/* the results list — the client starts BURIED under the
                directories, then climbs to the top and lights up as the ad.
                The pitch, enacted. */}
            <div className="g-list" data-glist aria-hidden>
              <div className="g-org-row">
                <p className="g-org-url">somedirectory.com &rsaquo; arizona</p>
                <p className="g-org-title">Best flight schools near Phoenix, ranked</p>
              </div>
              <div className="g-org-row">
                <p className="g-org-url">aviationforum.com &rsaquo; threads</p>
                <p className="g-org-title">Learning to fly: costs, schools and licenses</p>
              </div>
              <div className="g-row" data-you>
                <p className="g-sponsored">Sponsored</p>
                <p className="g-url">{AD.url}</p>
                <p className="g-title">{AD.title}</p>
                <div className="g-expand">
                  <div className="g-expand-in">
                    <p className="g-desc">{AD.desc}</p>
                    <div className="g-ext">
                      <a>Discovery flights</a>
                      <a>Fleet and rates</a>
                      <a>Book a tour</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ArtifactFrame>
        </div>
      </div>
    </section>
  );
}
