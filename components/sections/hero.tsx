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
import { Monogram } from "@/components/ui/monogram";
import { whenArrived } from "@/components/anim/arrival";
import { capturePersona, getPersona } from "@/lib/persona";

/* The hero — the SearchKings shape (Jake, 2026-07-16): NO mockup here.
   The demos live where the choosing happens — one per service card below,
   one per service-page phone — so the hero is just the claim, the one
   action, the quiet audit path, and the de-risk line. (The old search
   enactment lives in git history at 6ac2517 if it's ever wanted back.)

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
const IND_KEYS = ["other", "flight", "restaurant", "trades"] as const;

/* the pile's roster — PLACEHOLDER initials until Jake's real client
   photos land (each entry becomes an <img>). The conveyor needs >= 4
   faces to cycle without adjacent duplicates; fewer -> static pile.
   LAUNCH RULE: every face must be a real client. Never pad with
   invented people to fake volume. */
const FACES = ["DW", "MR", "JT", "KL", "AS"];


/* ══ THE ADAPTIVE PHONE (Jake, 2026-07-17: "if a plumber looked it up the
   words would change in the hero and in the animation") — Phase A: labeled
   ad traffic (?i= / ?svc=) gets a SPLIT hero with a phone showing THEIR
   search won; organic keeps the centered power trio untouched. The win
   frame is STATIC (win-frames law: complete at every instant); the
   performing cycle lives on the service pages.
   Preview: /?i=trades · /?i=flight · /?i=restaurant · /?i=other ·
   /?svc=ai · /?svc=websites ══ */
type SerpDemo = {
  q: string;
  fav?: string;
  name: string;
  url: string;
  title: string;
  desc: string;
  links: [string, string][];
  org: [string, string, string];
};
/* flight = the REAL client. The others are demo-fiction businesses from
   the same universe the services cards already use (Mesa Rapid Plumbing
   is the LSA card's). "other" is the meta move: EAS winning its own
   search — the one honest way to show a generic business on top. */
const SERP_DEMOS: Record<(typeof IND_KEYS)[number], SerpDemo> = {
  flight: {
    q: "flight school near me",
    fav: "/work/dw-favicon.png",
    name: "Desert Wings Flight School",
    url: "https://www.desertwingsflightschool.com",
    title: "Desert Wings Flight School | Learn to Fly at Falcon Field",
    desc: "Discovery flights and PPL through CFI training in Mesa, AZ. Train at Falcon Field with FAA-certified instructors.",
    links: [
      ["Discovery flights", "See the valley from the left seat"],
      ["Fleet and rates", "Transparent hourly rates, modern 172s"],
    ],
    org: [
      "FlightSchoolList",
      "flightschoollist.com › arizona › mesa",
      "Best flight schools near Phoenix, ranked",
    ],
  },
  trades: {
    q: "emergency plumber mesa",
    name: "Mesa Rapid Plumbing",
    url: "https://www.mesarapidplumbing.com",
    title: "Mesa Rapid Plumbing | 24/7 Emergency Call-Outs",
    desc: "Burst pipes, water heaters, slab leaks. Licensed, insured, and on the way in under an hour across the East Valley.",
    links: [
      ["Emergency service", "On the way in under an hour"],
      ["Upfront pricing", "The quote before the wrench"],
    ],
    org: ["Yelp", "yelp.com › mesa › plumbers", "THE BEST 10 Plumbers in Mesa, AZ"],
  },
  restaurant: {
    q: "patio dinner mesa az",
    name: "Canyon Table",
    url: "https://www.canyontable.com",
    title: "Canyon Table | Wood-Fired Patio Dining in Mesa",
    desc: "Seasonal plates and desert sunsets on the valley's warmest patio. Book tonight's table in two taps.",
    links: [
      ["Book a table", "Tonight from 5:00 PM"],
      ["The menu", "Wood-fired, seasonal, local"],
    ],
    org: ["OpenTable", "opentable.com › mesa-restaurants", "The 10 best patios in Mesa"],
  },
  other: {
    q: "google ads agency mesa",
    name: "Executive AI Solutions",
    url: "https://www.executiveaisolutions.com",
    title: "Executive AI Solutions | We Run the Whole Click",
    desc: "Ads, landing pages, and AI follow-up for local business — one team, tracked to the dollar. Fixed quotes in two days.",
    links: [
      ["Free site audit", "Thirty seconds, no email"],
      ["Transparent pricing", "Sites from $2.5k, ads from $500/mo"],
    ],
    org: ["Clutch", "clutch.co › agencies › mesa", "Top Google Ads agencies in Mesa"],
  },
};

/* the ONE persistent surface: bar + tabs + location. The enactment
   backspaces and retypes in THIS bar — the page never teleports. */
function GmChrome({ q: initialQ }: { q: string }) {
  return (
    <>
          <div className="g-m-bar">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="8.6" cy="8.6" r="5.4" stroke="currentColor" strokeWidth="2" />
              <path d="m13 13 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="g-m-q">
              <span data-hq>{initialQ}</span>
              <span className="g-m-caret" aria-hidden />
            </span>
            <svg viewBox="0 0 20 20" fill="none">
              <rect x="7" y="2.5" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4.5 10a5.5 5.5 0 0 0 11 0M10 15.5V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 6V4.5A1.5 1.5 0 0 1 4.5 3H6M14 3h1.5A1.5 1.5 0 0 1 17 4.5V6M17 14v1.5a1.5 1.5 0 0 1-1.5 1.5H14M6 17H4.5A1.5 1.5 0 0 1 3 15.5V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <nav className="g-m-tabs">
            <span>AI Mode</span>
            <span className="is-on">All</span>
            <span>Images</span>
            <span>Maps</span>
            <span>News</span>
          </nav>
          <div className="g-m-loc">
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5A4.2 4.2 0 0 0 2.8 5.7C2.8 8.85 7 12.8 7 12.8s4.2-3.95 4.2-7.1A4.2 4.2 0 0 0 7 1.5Z" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="7" cy="5.7" r="1.4" fill="currentColor" />
            </svg>
            <b>Mesa, AZ</b>
            <span>&middot;</span>
            <span className="is-link">Choose area</span>
          </div>
    </>
  );
}

/* per-industry RESULTS only — the chrome (bar/tabs/loc) is one
   persistent surface; a real phone's page doesn't teleport, only the
   query and results change */
function GmResults({ d }: { d: SerpDemo }) {
  return (
    <>
          <div className="g-m-ad relative">
            <p className="g-m-sponsored">Sponsored</p>
            <div className="g-m-src">
              {d.fav ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.fav} alt="" className="g-m-fav" width={64} height={64} />
              ) : (
                <span className="g-m-fav" />
              )}
              <span className="g-m-site">
                <span className="g-m-name">{d.name}</span>
                <span className="g-m-url">{d.url}</span>
              </span>
              <svg viewBox="0 0 16 16" fill="currentColor" className="g-m-kebab">
                <circle cx="8" cy="3.2" r="1.4" />
                <circle cx="8" cy="8" r="1.4" />
                <circle cx="8" cy="12.8" r="1.4" />
              </svg>
            </div>
            <p className="g-m-title">{d.title}</p>
            <p className="g-m-desc">{d.desc}</p>
            <div className="g-m-links">
              {d.links.map(([t, sub]) => (
                <span key={t} className="g-m-link">
                  <span>
                    <span className="g-m-link-t block">{t}</span>
                    <span className="g-m-link-d block">{sub}</span>
                  </span>
                  <svg viewBox="0 0 16 16" fill="none" className="g-m-chev">
                    <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ))}
            </div>
          </div>
          <div className="g-m-sep" />
          <div className="g-m-org">
            <div className="g-m-src">
              <span className="g-m-fav" />
              <span className="g-m-site">
                <span className="g-m-name">{d.org[0]}</span>
                <span className="g-m-url">{d.org[1]}</span>
              </span>
            </div>
            <p className="g-m-title">{d.org[2]}</p>
          </div>
    </>
  );
}

function HeroChatPhone() {
  return (
    <div className="dvc" role="img" aria-label="A phone showing our AI answering a customer and booking them in">
      <div className="dvc-screen dvc-screen--ui">
        <div className="px-[7%] pt-[7%]" aria-hidden>
          <div className="chat-thread">
            <div className="chat-b chat-b--user">
              <p>Are you open this weekend?</p>
            </div>
            <div className="chat-b chat-b--bot">
              <Monogram className="mt-[3px] h-[15px] w-[15px] shrink-0 opacity-70" />
              <p>
                Yes &mdash; Saturday morning is open. Want me to book you in?
              </p>
            </div>
            <p className="chat-booked">
              <svg viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2 6.4 4.8 9 10 3.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Booked &middot; Sat 9:00 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroTourPhone() {
  return (
    <div className="dvc" role="img" aria-label="A phone showing the Desert Wings site we built">
      <span className="dvc-island" aria-hidden />
      <div className="dvc-screen">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/work/dw-phone-tour.jpg"
          alt=""
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}

// layout effect so the ?i= lock commits BEFORE first paint
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Hero() {
  const root = useRef<HTMLElement>(null!);
  const [locked, setLocked] = useState<number | null>(null);
  const [svc, setSvc] = useState<"ai" | "websites" | null>(null);

  useIsomorphicLayoutEffect(() => {
    // params win; the sessionStorage persona (lib/persona.ts) covers the
    // visitor who navigated back home after the params fell off the URL
    capturePersona();
    const stored = getPersona();
    const params = new URLSearchParams(window.location.search);
    const i = params.get("i") ?? stored.i;
    if (i && ROLL_LOCK[i] !== undefined) setLocked(ROLL_LOCK[i]);
    const s = params.get("svc") ?? stored.svc;
    if (s === "ai" || s === "websites") setSvc(s);
  }, []);

  // THE hero for everyone (Jake, 2026-07-17: "the adaptive hero on home
  // page too") — organic gets the phone SYNCED to the roll (headline
  // swaps industry → the phone re-searches); labeled traffic gets it
  // locked to their industry / campaign surface.

  const ariaPair = ROLL_PAIRS[locked ?? 0];

  useGSAP(
    (context) => {
      const q = gsap.utils.selector(root);
      const navEl = document.querySelector(".site-nav");

      if (reducedMotion()) {
        gsap.set([navEl, ...q("[data-anim]")], { autoAlpha: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        return;
      }

      /* ── Title sequence: the statement is the protagonist; the CTA
         resolves it; the de-risk line lands last. ── */
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE_STRUCTURE } });
      tl.fromTo(
        navEl,
        { autoAlpha: 0, y: -16 },
        { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "transform" },
        0.05
      )
        // track A — the statement rises alone (no eyebrow, no stars up
        // here — six2eight proportions; trust rides the CTA row's beat)
        .fromTo(
          q("[data-anim='statement']"),
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 1.0, stagger: 0.12 },
          0.22
        );


      tl
        // the how resolves the claim into a method
        .fromTo(
          q("[data-anim='how']"),
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE_UI },
          0.65
        )
        // the resolve — the sequence lands on the one action
        .fromTo(
          q("[data-anim='ctas']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.9
        )
        ;
      // the adaptive phone rises with the claim (only exists for labeled traffic)
      if (q("[data-anim='phone']").length) {
        // the six2eight entrance, decoded from their live CSS (2026-07-21):
        // their words wipe in FIRST, then the media cards DROP from far
        // above and land as the headline finishes making room. Our
        // adaptation (their literal spacer-channel needs a SHORT visual —
        // our 426px phone would drive through the lede): the statement
        // gets its solo, then the phone FALLS in from above the fold and
        // lands on the flank; the tile blooms behind it at touchdown.
        tl.fromTo(
          q("[data-anim='phone']"),
          { autoAlpha: 0, y: -420, scale: 0.95 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.0 },
          1.2
        ).fromTo(
          q("[data-anim='tile']"),
          { autoAlpha: 0, scale: 0.9 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: EASE_UI },
          2.0
        );
        // THE CLICK BEAT (Jake, 2026-07-21: "something cool with the
        // click text… it becomes the phone"): the sentence lands whole,
        // then its last word gets literally CLICKED — a button press —
        // and the falling phone absorbs it. The word the phone replaces
        // is the thing the phone shows: a won click. lg+ only (the
        // float doesn't exist below; mobile keeps the full sentence).
        const clickWord = q("[data-click-word]")[0];
        if (clickWord && window.matchMedia("(min-width: 1024px)").matches) {
          tl.to(
            clickWord,
            { scale: 0.92, y: 3, duration: 0.12, ease: EASE_UI },
            1.15
          )
            .to(clickWord, { scale: 1, y: 0, duration: 0.2, ease: EASE_UI }, 1.27)
            // mid-fall: the word gives way under the descending phone
            .to(
              clickWord,
              { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: EASE_UI },
              1.75
            );
        }
      }

      // fonts measurable AND the route-transition sheet landed
      Promise.all([document.fonts.ready, whenArrived()]).then(() => {
        if (!root.current) return;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            tl.play();
            ScrollTrigger.refresh();
          })
        );
      });

      /* ── the rolling industry mirror — the hero's one living element.
         Organic visitors see the outcome line cycle through industries;
         ?i= traffic stays locked to its own. Governed: in-view + visible
         tab only, and the h1 height is locked to the longest pair so the
         CTA row never jumps. ── */
      if (locked === null) {
        const out = q("[data-roll-out]")[0] as HTMLElement;
        const h1 = q("[data-anim='statement']")[0] as HTMLElement;
        if (out && h1) {
          // pair 0 is the longest — lock its height so the CTA never
          // jumps between pairs. Lock AFTER fonts land: measuring the
          // fallback font baked a ~3-line min-height into a 2-line h1
          // and left a phantom gap under the claim (Jake: "spacing in
          // hero looks goofy", 2026-07-17)
          document.fonts.ready.then(() => {
            if (root.current) h1.style.minHeight = `${h1.offsetHeight}px`;
          });
          let idx = 0;
          let currentSeq: gsap.core.Timeline | null = null;
          const roll = gsap.timeline({ repeat: -1, paused: true });
          roll
            // 5.5s hold: ~3.6s of enactment + ~2s resting on the WON
            // state before the next industry
            .to({}, { duration: 5.5 })
            .to(out, {
              yPercent: -55,
              autoAlpha: 0,
              duration: 0.4,
              ease: EASE_UI,
            })
            .call(() => {
              const prev = idx;
              idx = (idx + 1) % ROLL_PAIRS.length;
              out.textContent = `${ROLL_PAIRS[idx].out}.`;
              // ONE CONDUCTOR (Jake: "so glitchy") — the previous
              // enactment dies and the stage hard-resets before a new one
              // starts; overlapping timelines were fighting over the bar
              currentSeq?.kill();
              // THE ENACTMENT v2 (Jake: "it doesn't feel real") — one
              // persistent page, a real re-search: the old query
              // BACKSPACES out of the one bar, the new one types with
              // human jitter (real typing is never metronome-constant),
              // an enter-beat, the old results drop with a skeleton
              // loading blink, and the new results land.
              const bar = q("[data-hq]")[0] as HTMLElement;
              const layers = q("[data-hres-l]") as HTMLElement[];
              const skel = q("[data-hskel]")[0] as HTMLElement;
              if (bar && skel && layers[prev] && layers[idx]) {
                const oldQ = SERP_DEMOS[IND_KEYS[prev]].q;
                const newQ = SERP_DEMOS[IND_KEYS[idx]].q;
                // hard reset: whatever state the killed run left behind
                bar.textContent = oldQ;
                gsap.set(skel, { autoAlpha: 0 });
                layers.forEach((l, n) =>
                  gsap.set(l, { autoAlpha: n === prev ? 1 : 0 })
                );
                const seq = gsap.timeline();
                currentSeq = seq;
                // ── ISOLATE THE TYPING (Jake: "the search bar should be
                // isolated"): while the bar is being used, everything
                // beneath it recedes and the bar itself lifts a touch —
                // the screen pays attention to what the user is doing ──
                const barEl = q(".g-m-bar")[0] as HTMLElement;
                const chromeRest = q(".g-m-tabs, .g-m-loc") as HTMLElement[];
                const stackEl = q(".hres-stack")[0] as HTMLElement;
                gsap.killTweensOf([barEl, ...chromeRest, stackEl]);
                gsap.set(barEl, { scale: 1 });
                gsap.set([...chromeRest, stackEl], { opacity: 1 });
                seq
                  .to(
                    [ ...chromeRest, stackEl ],
                    { opacity: 0.22, duration: 0.35, ease: EASE_UI },
                    0
                  )
                  .to(
                    barEl,
                    { scale: 1.05, duration: 0.35, ease: EASE_UI },
                    0
                  );
                // backspace run — quick, slightly uneven
                for (let n = oldQ.length - 1; n >= 0; n--) {
                  const at = n;
                  seq.call(
                    () => {
                      bar.textContent = oldQ.slice(0, at);
                    },
                    [],
                    `+=${(0.016 + Math.random() * 0.022).toFixed(3)}`
                  );
                }
                // the breath before typing the new thing
                seq.to({}, { duration: 0.3 });
                // human typing: jittered inter-key intervals, 30–85ms
                for (let n = 1; n <= newQ.length; n++) {
                  const at = n;
                  seq.call(
                    () => {
                      bar.textContent = newQ.slice(0, at);
                    },
                    [],
                    `+=${(0.055 + Math.random() * 0.06).toFixed(3)}`
                  );
                }
                seq
                  // enter — the bar releases, the page answers: results
                  // drop, loading blinks
                  .to({}, { duration: 0.14 })
                  .to(barEl, { scale: 1, duration: 0.3, ease: EASE_UI })
                  .to(
                    [ ...chromeRest, stackEl ],
                    { opacity: 1, duration: 0.3, ease: EASE_UI },
                    "<"
                  )
                  .to(layers[prev], { autoAlpha: 0, duration: 0.1, ease: "none" })
                  .set(skel, { autoAlpha: 1 }, "<")
                  .to({}, { duration: 0.42 })
                  .set(skel, { autoAlpha: 0 })
                  .call(() => {
                    // a layer keeps inline dims from ITS last turn — clear
                    // before it faces the audience again
                    gsap.set(
                      layers[idx].querySelectorAll(".g-m-org, .g-m-sep"),
                      { clearProps: "opacity" }
                    );
                  })
                  .fromTo(
                    layers[idx],
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: 0.28, ease: EASE_UI }
                  )
                  // ── the POINT: a beat to read, then everything that
                  // isn't the win quietly dims (the tap-ring bloom was
                  // cut 2026-07-17 — Jake: "i dont like that circle") ──
                  .to({}, { duration: 0.5 })
                  .to(
                    layers[idx].querySelectorAll(".g-m-org, .g-m-sep"),
                    { opacity: 0.35, duration: 0.45, ease: EASE_UI },
                    "+=0.1"
                  );
              }
            })
            .fromTo(
              out,
              { yPercent: 55, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.5,
                ease: EASE_UI,
                /* THE ROLL BUG (found 2026-07-17): default immediateRender
                   parked the spans at this from-state AT CREATION, the
                   fade-out then captured that as its start, and every
                   repeat-rewind restored it — so the 3.8s hold played
                   INVISIBLE and the pair only flashed ~0.6s per cycle. */
                immediateRender: false,
              }
            );
          const sync = () => {
            const st = ScrollTrigger.getById("hero-roll");
            const on = (st?.isActive ?? true) && !document.hidden;
            if (on) {
              roll.play();
              currentSeq?.play();
            } else {
              roll.pause();
              currentSeq?.pause();
            }
          };
          ScrollTrigger.create({
            id: "hero-roll",
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            onToggle: sync,
          });
          document.addEventListener("visibilitychange", sync);
          context.add(() => () =>
            document.removeEventListener("visibilitychange", sync)
          );
          sync();
        }
      }

      /* ── the pile conveyor (Jake, 2026-07-17: "a cool animation to
         make that feel infinite — a new one comes in, one leaves").
         Runs only with >= 4 faces (fewer would show duplicates side by
         side); gated to in-view + visible tab like the roll. ── */
      const pileEls = q(".hero-pile [data-face]") as HTMLElement[];
      if (pileEls.length === 4 && FACES.length >= 4) {
        const PITCH = 21; // circle 30 − overlap 9
        let order = [0, 1, 2, 3];
        let face = 3; // next face to enter (0-2 are on stage at mount)
        pileEls.forEach((el, n) =>
          gsap.set(
            el,
            n < 3
              ? // left: 0 kills the no-JS nth-child fallback lefts — they
                // STACKED with the transform x and made the pitch breathe
                // wide/close/wide as roles rotated (Jake-caught)
                { left: 0, x: n * PITCH, zIndex: 10 - n, autoAlpha: 1, scale: 1 }
              : { left: 0, x: -14, zIndex: 11, autoAlpha: 0, scale: 0.4 }
          )
        );
        let active = false;
        let dc: gsap.core.Tween | null = null;
        const cycle = () => {
          if (!active || !root.current) return;
          const [a, b, c, d] = order;
          face = (face + 1) % FACES.length;
          pileEls[d].textContent = FACES[face];
          const tl = gsap.timeline({
            onComplete: () => {
              dc = gsap.delayedCall(2.6, cycle);
            },
          });
          tl.set(pileEls[d], { x: -14, scale: 0.4, autoAlpha: 0, zIndex: 11 })
            // the back face slips out to the right…
            .to(
              pileEls[c],
              { x: 2 * PITCH + 12, autoAlpha: 0, scale: 0.6, duration: 0.45, ease: EASE_UI },
              0
            )
            // …the row makes room…
            .to(pileEls[a], { x: PITCH, zIndex: 9, duration: 0.5, ease: EASE_UI }, 0.05)
            .to(pileEls[b], { x: 2 * PITCH, zIndex: 8, duration: 0.5, ease: EASE_UI }, 0.05)
            // …and the new face blooms in at the front
            .to(
              pileEls[d],
              { x: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: EASE_UI },
              0.15
            )
            .set(pileEls[d], { zIndex: 10 });
          order = [d, a, b, c];
        };
        const syncPile = () => {
          const st = ScrollTrigger.getById("hero-pile");
          const on = (st?.isActive ?? true) && !document.hidden;
          if (on && !active) {
            active = true;
            dc = gsap.delayedCall(1.8, cycle);
          } else if (!on) {
            active = false;
            dc?.kill();
          }
        };
        ScrollTrigger.create({
          id: "hero-pile",
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: syncPile,
        });
        document.addEventListener("visibilitychange", syncPile);
        context.add(() => () =>
          document.removeEventListener("visibilitychange", syncPile)
        );
        syncPile();
      }

      /* ── exit parallax (not a pin): the statement lifts slightly faster
         than the scroll as the hero leaves ── */
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
    },
    { scope: root, dependencies: [locked], revertOnUpdate: true }
  );

  return (
    // WHITE ground (Jake, 2026-07-17): the hero sits on pure white so the
    // audit section's warm-gray band below reads as a visible chapter line
    // right at the fold — the ground change announces "there's more"
    <section id="top" ref={root} className="hero relative bg-white">
      {/* the six2eight hero (Jake, 2026-07-21, ref six2eight.com): one
          CENTERED statement with the adaptive phone floating INSIDE it —
          overlapping the headline's right flank — trust beside the CTA
          where their platform icons sit, and the audit tray cresting the
          fold below (their peek, our give). */}
      {/* md:pt 108 (third lift, 2026-07-17): 27px of air under the nav
          capsule (bottoms ~81) — the floor of the range; below ~100 we're
          back to the "content is really close to nav" complaint */}
      {/* 80svh (Jake, 2026-07-21: "raise the card under so we see free
          site audit text"): the peek must include the tray's TITLE, not
          just its gray shoulder — the fold shows the words */}
      <div className="hero-in wrap relative z-10 flex min-h-[80svh] flex-col items-center justify-center pb-fib-4 pt-[110px] text-center md:pt-[120px]">
        {/* relative: the float anchors to this column, so the exit
            parallax carries text AND phone together */}
        <div className="hero-left relative flex w-full flex-col items-center">
          {/* NO eyebrow (Jake, 2026-07-21: six2eight proportions) — the
              headline carries alone; Mesa lives in the phone's SERP */}
          {/* TWO LINES, PUNCH PAIR (Jake, 2026-07-21: "the title should
              be 2 lines, every other site has two lines"): the roll is
              the outcome alone — "More jobs." — huge; the WHO left the
              headline (the phone's SERP carries the industry mirror now,
              and the who survives in the aria sentence). The visual text
              swaps on the roll; screen readers get the stable claim. */}
          <h1
            data-anim="statement"
            className="t-statement t-statement--hero t-statement--62 mx-auto"
            aria-label={`${ariaPair.out} ${ariaPair.who}. We run the whole click.`}
          >
            <span aria-hidden>
              <span className="block text-ink">
                <span data-roll-out className="inline-block">
                  {ariaPair.out}.
                </span>
              </span>
              {/* SOLID INK (Jake, 2026-07-21: "none of the others do") —
                  at 99px the statement carries itself; the accent stays
                  reserved for the CTA and the phone's blue links. The
                  two-tone era (accent second clause) ended here. */}
              <span className="block text-ink">
                We run the whole{" "}
                {/* the last word gets CLICKED in the entrance (lg+): a
                    button-press, then the falling phone absorbs it — the
                    word becomes the phone showing a won click. Mobile
                    keeps the whole sentence (no float there). */}
                <span data-click-word className="inline-block">
                  click.
                </span>
              </span>
            </span>
          </h1>

          {/* 36ch (not 42): the centered lede must END before the float's
              left edge (~1026px at 1440, float at 10%) — a paragraph cut
              mid-word reads broken, unlike the headline's occlusion */}
          <p
            data-anim="how"
            className="t-lede mx-auto mt-fib-3 max-w-[36ch] text-ink/65"
          >
            The ad, the landing page, the AI follow-up &mdash; one team owns
            every step between the search and the booked job.
          </p>

          {/* the action row, six2eight shape: the CTA with the trust group
              where their platform icons sit — REAL reviews, all five-star;
              the count stays unstated until it's a number worth printing */}
          <div
            data-anim="ctas"
            className="mt-fib-4 flex flex-wrap items-center justify-center gap-fib-3"
          >
            <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
            <div
              className="flex items-center gap-fib-1"
              aria-label="Rated 5.0 by our clients"
            >
              {/* the pile — PLACEHOLDER initials until Jake's real client
                  photos land. Swap: replace each span with
                  <img src="/work/face-N.jpg">. NEVER ship stock faces. */}
              <span className="hero-pile" aria-hidden>
                {/* 4 nodes: 3 visible slots + 1 offstage — the conveyor
                    rotates roles (a new face blooms in at the front, the
                    back one slips out) */}
                {[0, 1, 2, 3].map((n) => (
                  <span
                    key={n}
                    data-face
                    className={n === 3 ? "opacity-0" : ""}
                  >
                    {FACES[n]}
                  </span>
                ))}
              </span>
              <span className="hero-stars" aria-hidden>
                {[0, 1, 2, 3, 4].map((s) => (
                  <svg key={s} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.8L10 1.5z" />
                  </svg>
                ))}
              </span>
              <span className="t-meta text-ink/70" aria-hidden>
                5.0 from our clients
              </span>
            </div>
          </div>
          {/* no quiet audit link (Jake, 2026-07-21): the audit tray
              cresting the fold IS the invitation */}

          {/* the adaptive phone — THEIR search, won (or the svc campaign's
              surface) — floating over the statement's right flank at lg+
              (backing tile + tilt live on .hero-tilt), in the flow below
              the text on smaller screens. All four SERPs ride stacked in
              one screen; organic crossfades them on the roll's beat,
              labeled traffic pins its own. */}
          <div className="hero-float">
            <div className="hero-tilt">
              {/* the tile is its OWN element (was a ::before — which
                  couldn't animate apart from its parent, so the gray
                  sat visible through the statement's solo): it blooms
                  only as the phone LANDS */}
              <div className="hero-tile" data-anim="tile" aria-hidden />
              <div data-anim="phone" className="hero-phone mx-auto mt-fib-5 lg:mt-0">
          {svc === "ai" ? (
            <HeroChatPhone />
          ) : svc === "websites" ? (
            <HeroTourPhone />
          ) : (
            <div
              className="dvc"
              role="img"
              aria-label="A phone showing a Google search with our client's ad on top"
            >
              <div className="dvc-screen dvc-screen--ui">
                <div className="g-m" aria-hidden>
                  <GmChrome q={SERP_DEMOS[IND_KEYS[locked ?? 0]].q} />
                  <div className="hres-stack">
                    {IND_KEYS.map((k, idx) => (
                      <div
                        key={k}
                        data-hres-l={idx}
                        className={idx !== (locked ?? 0) ? "opacity-0" : ""}
                      >
                        <GmResults d={SERP_DEMOS[k]} />
                      </div>
                    ))}
                    {/* the loading blink between enter and results */}
                    <div data-hskel className="opacity-0">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="g-skel">
                          <span className="g-skel-thumb" />
                          <span className="g-skel-lines">
                            <span className="g-skel-line block w-[82%]" />
                            <span className="g-skel-line block w-[64%]" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
