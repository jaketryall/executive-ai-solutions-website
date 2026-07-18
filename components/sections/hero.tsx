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

function GmSerp({ d }: { d: SerpDemo }) {
  return (
        <div className="g-m" aria-hidden>
          <div className="g-m-bar">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="8.6" cy="8.6" r="5.4" stroke="currentColor" strokeWidth="2" />
              <path d="m13 13 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="g-m-q">
              <span>{d.q}</span>
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
          <div className="g-m-ad">
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
          <div className="g-skel">
            <span className="g-skel-thumb" />
            <span className="g-skel-lines">
              <span className="g-skel-line block w-[82%]" />
              <span className="g-skel-line block w-[64%]" />
            </span>
          </div>
        </div>
  );
}

function HeroChatPhone() {
  return (
    <div className="dvc" role="img" aria-label="A phone showing our AI answering a customer and booking them in">
      <div className="dvc-screen dvc-screen--ui">
        <div className="px-[7%] pt-[16%]" aria-hidden>
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
        // the resolve — the sequence lands on the one action
        .fromTo(
          q("[data-anim='ctas']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.8
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
          const roll = gsap.timeline({ repeat: -1, paused: true });
          roll
            .to({}, { duration: 3.8 })
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
              // the phone re-searches in step with the headline (Jake's
              // "the words would change in the hero AND in the animation")
              const demos = q("[data-phone-demo]") as HTMLElement[];
              if (demos[prev] && demos[idx]) {
                gsap.to(demos[prev], {
                  autoAlpha: 0,
                  duration: 0.35,
                  ease: EASE_UI,
                });
                gsap.fromTo(
                  demos[idx],
                  { autoAlpha: 0 },
                  { autoAlpha: 1, duration: 0.5, delay: 0.12, ease: EASE_UI }
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
            (on ? roll.play() : roll.pause());
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
      {/* TIGHT well (Hormozi shape, Jake 2026-07-17): the hero deliberately
          does NOT fill the viewport — the audit's "free" headline crests
          the fold below it, and curiosity earns the scroll for free */}
      {/* md:pt 144 (was 89): the stars row sat ~15px under the nav capsule
          (Jake: "content is really close to nav bar") — the capsule bottoms
          at ~81, so 144 gives the crown real air */}
      <div
        className={`hero-in wrap relative z-10 flex min-h-[60svh] flex-col items-center justify-center pb-fib-4 pt-[120px] text-center md:pt-fib-7 ${
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
              <span>DW</span>
              <span>MR</span>
              <span>JT</span>
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
            className={`t-statement t-statement--hero mx-auto mt-fib-2 ${
              adaptive ? "lg:mx-0 lg:text-[3rem]!" : ""
            }`}
            aria-label={`${ariaPair.out} ${ariaPair.who}. We run the whole click.`}
          >
            {/* ALWAYS TWO LINES (Jake, 2026-07-17): the rolling sentence
                owns line one (nowrap from lg — the longest pair clears the
                column there), the accent clause owns line two. Below lg it
                wraps naturally. The visual text swaps on the roll; the
                aria-label is the stable sentence screen readers get. */}
            <span aria-hidden>
              <span className="block text-ink lg:whitespace-nowrap">
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

          {/* the one action (the Hormozi shape, Jake 2026-07-17): powerful
              heading, ONE loud CTA, nothing else to read — the audit's
              "free" headline peeks below and earns the scroll. Lede and
              chips cut same day ("i dont think we need the sub heading…
              get rid of the little pills"). */}
          <div data-anim="ctas" className="mt-fib-4">
            <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
          </div>

          {/* the marquee (Jake's logo-marquee instinct, in motion): the
              real surfaces we put clients on, drifting at ambient speed —
              the hero's one perpetual layer. FOUR sets: a -50% loop is
              only seamless when each HALF of the track outspans the
              visible window (1290px) — two 752px sets ran dry on the
              right ("gets smaller", Jake). Edges feathered by mask. */}
          <div data-anim="marquee" className="hero-marquee mt-fib-5" aria-hidden>
            <div className="hero-marquee-track">
              {[0, 1, 2, 3].map((set) => (
                <span key={set} className="hero-marquee-set">
                  {[
                    "Google",
                    "Google Maps",
                    "Google Guaranteed",
                    "ChatGPT",
                    "AI Overviews",
                  ].map((m) => (
                    <span key={m} className="hm-item">
                      {m}
                    </span>
                  ))}
                </span>
              ))}
            </div>
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
                <div className="relative h-full w-full">
                  {IND_KEYS.map((k, idx) => (
                    <div
                      key={k}
                      data-phone-demo={idx}
                      className={`absolute inset-0 ${
                        idx !== (locked ?? 0) ? "opacity-0" : ""
                      }`}
                    >
                      <GmSerp d={SERP_DEMOS[k]} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
