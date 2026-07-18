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

/* the marquee marks (Jake, 2026-07-17: "some color there may look
   good") — real platform icons beside quiet wordmarks, the classic
   logo-strip grammar: color lives in the marks, type stays gray.
   Inline SVGs, nominative use (we genuinely run these platforms). */
const MARKS: [string, React.ReactNode][] = [
  [
    "Google",
    <svg key="g" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>,
  ],
  [
    "Google Ads",
    <svg key="ga" viewBox="0 0 24 24">
      <rect x="9.4" y="2.6" width="5.2" height="16.4" rx="2.6" fill="#4285F4" transform="rotate(30 12 10.8)" />
      <rect x="9.4" y="2.6" width="5.2" height="16.4" rx="2.6" fill="#FBBC05" transform="rotate(-30 12 10.8)" />
      <circle cx="5.05" cy="18.6" r="2.85" fill="#34A853" />
    </svg>,
  ],
  [
    "Google Maps",
    <svg key="gm" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 1.5a7.5 7.5 0 0 0-7.5 7.5c0 5.4 6.55 12.57 6.83 12.87a.9.9 0 0 0 1.34 0c.28-.3 6.83-7.47 6.83-12.87A7.5 7.5 0 0 0 12 1.5Z"
      />
      <circle cx="12" cy="9" r="2.8" fill="#fff" />
    </svg>,
  ],
  [
    "Google Guaranteed",
    <svg key="gg" viewBox="0 0 24 24">
      <path
        fill="#34A853"
        d="M12 1.8 4 5v6.1c0 5 3.4 9.66 8 10.9 4.6-1.24 8-5.9 8-10.9V5l-8-3.2Z"
      />
      <path
        d="m8.3 12.1 2.5 2.5 4.9-4.9"
        stroke="#fff"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>,
  ],
  [
    "ChatGPT",
    <svg key="cg" viewBox="0 0 24 24" fill="none" stroke="#131413" strokeWidth="1.9" strokeLinecap="round">
      <path d="M12 3.2v17.6M4.4 7.6l15.2 8.8M4.4 16.4l15.2-8.8" />
      <circle cx="12" cy="12" r="3.1" fill="#fff" stroke="#131413" strokeWidth="1.9" />
    </svg>,
  ],
  [
    "AI Overviews",
    <svg key="ao" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="aio" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4285F4" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#EA4335" />
        </linearGradient>
      </defs>
      <path
        fill="url(#aio)"
        d="M12 2c.55 5.05 4.13 8.63 9.18 9.18l.82.82-.82.82C16.13 13.37 12.55 16.95 12 22c-.55-5.05-4.13-8.63-9.18-9.18L2 12l.82-.82C7.87 10.63 11.45 7.05 12 2Z"
      />
    </svg>,
  ],
];

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
            {/* the tap that takes the click — pulsed by the enactment */}
            <span className="g-click-ring" />
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
    const params = new URLSearchParams(window.location.search);
    const i = params.get("i");
    if (i && ROLL_LOCK[i] !== undefined) setLocked(ROLL_LOCK[i]);
    const s = params.get("svc");
    if (s === "ai" || s === "websites") setSvc(s);
  }, []);

  // THE hero for everyone (Jake, 2026-07-17: "the adaptive hero on home
  // page too") — organic gets the split with the phone SYNCED to the
  // roll (headline swaps industry → the phone re-searches); labeled
  // traffic gets it locked to their industry / campaign surface.
  const adaptive = true;

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
        // track A — trust crowns first (the SK order), the eyebrow sets
        // the category, the statement rises
        .fromTo(
          q("[data-anim='stars']"),
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE_UI },
          0.05
        )
        .fromTo(
          q("[data-anim='eyebrow']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.16
        )
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
        // the ambient layer wakes last, already drifting
        .fromTo(
          q("[data-anim='marquee']"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6, ease: EASE_UI },
          1.05
        );
      // the adaptive phone rises with the claim (only exists for labeled traffic)
      if (q("[data-anim='phone']").length) {
        tl.fromTo(
          q("[data-anim='phone']"),
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          0.5
        );
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
        const who = q("[data-roll-who]")[0] as HTMLElement;
        const h1 = q("[data-anim='statement']")[0] as HTMLElement;
        if (out && who && h1) {
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
            .to([out, who], {
              yPercent: -55,
              autoAlpha: 0,
              duration: 0.4,
              ease: EASE_UI,
              stagger: 0.06,
            })
            .call(() => {
              const prev = idx;
              idx = (idx + 1) % ROLL_PAIRS.length;
              out.textContent = ROLL_PAIRS[idx].out;
              who.textContent = `${ROLL_PAIRS[idx].who}.`;
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
                const ringAll = q(".g-click-ring") as HTMLElement[];
                gsap.killTweensOf(ringAll);
                gsap.set(ringAll, { autoAlpha: 0 });
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
                  // ── the POINT, exaggerated (Jake: "so they really get
                  // it"): a beat to read, then the thumb-tap blooms on the
                  // ad and everything that isn't the win dims ──
                  .to({}, { duration: 0.5 })
                  .call(() => {
                    const ad = layers[idx].querySelector(
                      ".g-m-ad"
                    ) as HTMLElement;
                    const ring = ad?.querySelector(
                      ".g-click-ring"
                    ) as HTMLElement;
                    const title = ad?.querySelector(
                      ".g-m-title"
                    ) as HTMLElement;
                    if (!ring || !title) return;
                    gsap.set(ring, {
                      xPercent: -50,
                      yPercent: -50,
                      x: title.offsetLeft + title.offsetWidth * 0.35,
                      y: title.offsetTop + title.offsetHeight * 0.55,
                      scale: 0.5,
                      autoAlpha: 0,
                    });
                    gsap
                      .timeline()
                      .to(ring, {
                        autoAlpha: 0.95,
                        scale: 0.85,
                        duration: 0.16,
                        ease: EASE_UI,
                      })
                      .to(ring, {
                        scale: 1.6,
                        autoAlpha: 0,
                        duration: 0.55,
                        ease: "power2.out",
                      });
                  })
                  .to(
                    layers[idx].querySelectorAll(".g-m-org, .g-m-sep"),
                    { opacity: 0.35, duration: 0.45, ease: EASE_UI },
                    "+=0.1"
                  );
              }
            })
            .fromTo(
              [out, who],
              { yPercent: 55, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.5,
                ease: EASE_UI,
                stagger: 0.06,
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
      {/* the SearchKings hero: CENTERED — claim, one action, the quiet
          audit path, the de-risk line. No mockup; the services cards
          directly below carry the demos. */}
      {/* md:pt 108 (third lift, 2026-07-17): 27px of air under the nav
          capsule (bottoms ~81) — the floor of the range; below ~100 we're
          back to the "content is really close to nav" complaint */}
      <div
        className={`hero-in wrap relative z-10 flex min-h-[60svh] flex-col items-center justify-center pb-fib-4 pt-[100px] text-center md:pt-[108px] ${
          adaptive
            ? "lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-fib-6 lg:text-left"
            : ""
        }`}
      >
        {/* ── the SearchKings stack, our true content (Jake, 2026-07-16):
            trust → outcome → how → incentives. Their stars/badges are
            earned marks we don't hold, so every trust beat here is a
            checkable fact instead: place in the eyebrow, real surfaces
            in the marks row, real terms in the chips. ── */}
        {/* w-full: without it this column sizes to the marquee track's
            max-content width and drags the whole page into horizontal
            overflow — the clamp is what lets .hero-marquee clip */}
        <div
          className={`hero-left flex w-full flex-col items-center ${
            adaptive ? "lg:items-start" : ""
          }`}
        >
          {/* the trust crown (Jake's SK decode: stars first) — REAL reviews,
              all five-star; the count is deliberately unstated until it's
              a number worth printing. No volume implied. */}
          <div
            data-anim="stars"
            className="flex items-center gap-fib-1"
            aria-label="Rated 5.0 by our clients"
          >
            {/* the pile — PLACEHOLDER initials until Jake's three real
                client photos land (he's collecting them, 2026-07-17).
                Swap: replace each span with <img src="/work/face-N.jpg">.
                NEVER ship stock faces. */}
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
          <p data-anim="eyebrow" className="t-meta mt-fib-2 uppercase text-ink/70">
            Full-funnel ads agency &middot; Mesa, AZ
          </p>
          {/* the two-tone statement (the signature): bright outcome, dim
              continuation IN the same sentence. The dim clause stays five
              words — that's what lets the whole thing hold display size
              without reading as a wall (the eyebrow + the ad demo carry the
              specifics) */}
          <h1
            data-anim="statement"
            className="t-statement t-statement--hero mx-auto mt-fib-2 lg:mx-0"
            aria-label={`${ariaPair.out} ${ariaPair.who}. We run the whole click.`}
          >
            {/* ALWAYS TWO LINES (Jake, 2026-07-17): the rolling sentence
                owns line one (nowrap from lg — the longest pair clears the
                column there), the accent clause owns line two. Below lg it
                wraps naturally. The visual text swaps on the roll; the
                aria-label is the stable sentence screen readers get. */}
            <span aria-hidden>
              <span className="block text-ink">
                <span data-roll-out className="inline-block">
                  {ariaPair.out}
                </span>{" "}
                <span data-roll-who className="inline-block">
                  {ariaPair.who}.
                </span>
              </span>
              {/* the two-tone goes SearchKings: the second clause wears the
                  click color instead of a dim — accent IS the click */}
              <span className="block text-accent">
                We run the whole click.
              </span>
            </span>
          </h1>

          {/* the HOW returns (fill-the-left, Jake 2026-07-17): with the
              phone owning the right, the text column needs real mass —
              claim at full size, the machine named in one line, the
              action plus the quiet audit path */}
          <p
            data-anim="how"
            className="t-lede mx-auto mt-fib-3 max-w-[42ch] text-ink/65 lg:mx-0"
          >
            The ad, the landing page, the AI follow-up &mdash; one team owns
            every step between the search and the booked job.
          </p>

          <div
            data-anim="ctas"
            className="mt-fib-4 flex flex-wrap items-center justify-center gap-fib-3 lg:justify-start"
          >
            <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
            <a href="#site-check" className="u-link text-ink/70">
              Not sure yet? Run the free audit
            </a>
          </div>

        </div>

        {/* the adaptive phone — THEIR search, won (or the svc campaign's
            surface). All four SERPs ride stacked in one screen; organic
            crossfades them on the roll's beat, labeled traffic pins its
            own. Each frame is a static win frame; the performing cycle
            lives on the service pages. */}
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

      {/* THE STRIP — its own thin band (Jake: "struggling with spacing…
          it's tricky" — floating after the grid meant the gap was measured
          from the taller column and could never look right; a band with
          symmetric padding removes the judgment call, the viral/SK form).
          Full-bleed, feathered edges. */}
      <div data-anim="marquee" className="hero-marquee py-fib-4" aria-hidden>
        <div className="hero-marquee-track">
          {[0, 1, 2, 3].map((set) => (
            <span key={set} className="hero-marquee-set">
              {MARKS.map(([label, icon]) => (
                <span key={label} className="hm-item">
                  <span className="hm-logo">{icon}</span>
                  {label}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
