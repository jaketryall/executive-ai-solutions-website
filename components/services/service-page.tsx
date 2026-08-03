"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { whenArrived } from "@/components/anim/arrival";
import { revealUp } from "@/components/anim/reveal";
import { CTA } from "@/components/ui/cta";
import { Builder } from "@/components/sections/builder";
import { LeadMath } from "@/components/services/lead-math";
import { SubOffer } from "@/components/services/sub-offer";
import { Monogram } from "@/components/ui/monogram";
import { ProcessCards } from "@/components/ui/process-cards";
import { HighlightsGallery, type Highlight } from "@/components/ui/highlights-gallery";
import { SERVICE_META, siblingServices, type ServiceDef } from "@/lib/services";
import { QUOTES, AV_TINTS } from "@/lib/quotes";

function PersonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-[14px] w-[14px]">
      <circle cx="10" cy="6.5" r="3.4" />
      <path d="M10 11.4c-3.6 0-6.1 1.9-6.6 4.8-.1.5.3.9.8.9h11.6c.5 0 .9-.4.8-.9-.5-2.9-3-4.8-6.6-4.8Z" />
    </svg>
  );
}

/* A service page — one funnel stage, up close. The hero puts the stage's REAL
   artifact to work (the ad, the landing page, the chat: medium is the message),
   the deliverables read as an index-sweep (everything visible, a traveling
   accent walks the list), the price is the page's one centered statement peak,
   and the other two stages carry the motif out. */

const CHAT_Q = "Do you offer discovery flights on weekends?";

/* ── the per-stage hero artifact ── */
/* the shared device shell — the service's REAL surface in a real phone
   (the SearchKings realism lesson, Jake 2026-07-16: what sells is seeing
   the thing as the customer's customer sees it, unmistakably itself) */
function PhoneShell({
  label,
  screenClass = "",
  island = true,
  children,
}: {
  label: string;
  screenClass?: string;
  /* drop the island on UI screens — a cutout over live text reads as a
     defect; keep it only over photographic screens (SearchKings' move) */
  island?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="svc-phone" role="group" aria-label={label}>
      <div className="dvc">
        {island && <span className="dvc-island" aria-hidden />}
        <div className={`dvc-screen ${screenClass}`}>{children}</div>
      </div>
    </div>
  );
}

function HeroArtifact({ slug }: { slug: string }) {
  if (slug === "google-ads") {
    // a mobile Google search, the ad on top — tapped, not cursor-clicked
    return (
      <>
        <PhoneShell
          label="A phone showing a Google search with the Desert Wings ad on top"
          screenClass="dvc-screen--ui"
          island={false}
        >
        {/* the .g-m skin replicates the 2026 mobile SERP as measured off
            Google's live DOM — anatomy AND values are Google's own */}
        <div className="g-m" aria-hidden>
          <div className="g-m-bar">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="8.6" cy="8.6" r="5.4" stroke="currentColor" strokeWidth="2" />
              <path d="m13 13 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="g-m-q">
              <span data-g-q>flight school near me</span>
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
          {/* the results area carries two states the loop swaps between:
              the money SERP (your ad on top) and the junk SERP (no ad —
              negative keywords, the invisible craft, made visible) */}
          <div data-g-results>
            <div data-serp-money>
              <div className="g-m-ad">
                <p className="g-m-sponsored">Sponsored</p>
            <div className="g-m-src">
              {/* the client's real favicon — realism is the pitch */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/work/dw-favicon.png" alt="" className="g-m-fav" width={64} height={64} />
              <span className="g-m-site">
                <span className="g-m-name">Desert Wings Flight School</span>
                <span className="g-m-url">https://www.desertwingsflightschool.com</span>
              </span>
              <svg viewBox="0 0 16 16" fill="currentColor" className="g-m-kebab">
                <circle cx="8" cy="3.2" r="1.4" />
                <circle cx="8" cy="8" r="1.4" />
                <circle cx="8" cy="12.8" r="1.4" />
              </svg>
            </div>
            {/* PLACEHOLDER — swap with the real Desert Wings ad, verbatim */}
            <p className="g-m-title">
              Desert Wings Flight School | Learn to Fly at Falcon Field
            </p>
            <p className="g-m-desc">
              Discovery flights and PPL through CFI training in Mesa, AZ.
              Train at Falcon Field with FAA-certified instructors.
            </p>
            {/* sitelink assets — stacked rows, the 2026 mobile format.
                Spans, not bare <a>s: hrefless anchors invite dead taps */}
            <div className="g-m-links">
              <span className="g-m-link">
                <span>
                  <span className="g-m-link-t block">Discovery flights</span>
                  <span className="g-m-link-d block">
                    See the valley from the left seat
                  </span>
                </span>
                <svg viewBox="0 0 16 16" fill="none" className="g-m-chev">
                  <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="g-m-link">
                <span>
                  <span className="g-m-link-t block">Fleet and rates</span>
                  <span className="g-m-link-d block">
                    Transparent hourly rates, modern 172s
                  </span>
                </span>
                <svg viewBox="0 0 16 16" fill="none" className="g-m-chev">
                  <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            {/* the stage's namesake, on loop: a thumb-tap takes the click */}
            <span className="g-click-ring" />
          </div>
          <div className="g-m-sep" />
          <div className="g-m-org">
            <div className="g-m-src">
              <span className="g-m-fav" />
              <span className="g-m-site">
                <span className="g-m-name">FlightSchoolList</span>
                <span className="g-m-url">flightschoollist.com &rsaquo; arizona &rsaquo; mesa</span>
              </span>
            </div>
            <p className="g-m-title">Best flight schools near Phoenix, ranked</p>
          </div>
          <div className="g-m-org">
            <div className="g-m-src">
              <span className="g-m-fav" />
              <span className="g-m-site">
                <span className="g-m-name">Reddit</span>
                <span className="g-m-url">reddit.com &rsaquo; r/flying</span>
              </span>
            </div>
            <p className="g-m-title">Anyone trained at Falcon Field? Worth it?</p>
          </div>
          {/* the results continue past the screen edge — skeleton rows keep
              the SERP reading as a live page, not a poster */}
          <div className="g-skel">
            <span className="g-skel-thumb" />
            <span className="g-skel-lines">
              <span className="g-skel-line block w-[82%]" />
              <span className="g-skel-line block w-[58%]" />
            </span>
          </div>
          <div className="g-skel">
            <span className="g-skel-thumb" />
            <span className="g-skel-lines">
              <span className="g-skel-line block w-[74%]" />
              <span className="g-skel-line block w-[63%]" />
            </span>
          </div>
            </div>
            <div data-serp-junk className="hidden">
              <div className="g-m-org">
                <div className="g-m-src">
                  <span className="g-m-fav" />
                  <span className="g-m-site">
                    <span className="g-m-name">FlightSimFree</span>
                    <span className="g-m-url">flightsimfree.io &rsaquo; play</span>
                  </span>
                </div>
                <p className="g-m-title">
                  Fly a free flight simulator online — no download
                </p>
              </div>
              <div className="g-m-org">
                <div className="g-m-src">
                  <span className="g-m-fav" />
                  <span className="g-m-site">
                    <span className="g-m-name">Reddit</span>
                    <span className="g-m-url">reddit.com &rsaquo; r/flightsim</span>
                  </span>
                </div>
                <p className="g-m-title">
                  Best free flight simulator games in 2026?
                </p>
              </div>
              <div className="g-skel">
                <span className="g-skel-thumb" />
                <span className="g-skel-lines">
                  <span className="g-skel-line block w-[78%]" />
                  <span className="g-skel-line block w-[55%]" />
                </span>
              </div>
              <div className="g-skel">
                <span className="g-skel-thumb" />
                <span className="g-skel-lines">
                  <span className="g-skel-line block w-[70%]" />
                  <span className="g-skel-line block w-[61%]" />
                </span>
              </div>
            </div>
          </div>
        </div>
        </PhoneShell>
        {/* the loop's narration — one quiet line naming the current beat */}
        <p
          data-g-cap
          className="t-meta mx-auto mt-fib-2 max-w-[36ch] text-center text-ink/55"
        >
          Found for the searches that matter.
        </p>
      </>
    );
  }
  if (slug === "websites") {
    // the site we built, on the phone it's actually seen on, riding
    return (
      <PhoneShell label="The Desert Wings site we designed and built, scrolling on a phone">
        <Image
          data-svc-tour
          src="/work/dw-phone-tour.jpg"
          alt="Scrolling through the Desert Wings site we designed and built"
          width={780}
          height={10128}
          sizes="(min-width: 821px) 310px, 78vw"
          priority
          className="block h-auto w-full"
        />
      </PhoneShell>
    );
  }
  // ai — the chat, answering as itself
  return (
    <PhoneShell
      label="Ask-this-site chat answering a visitor"
      screenClass="dvc-screen--ui"
      island={false}
    >
      <div className="chat-card mt-0! flex-none! border-0! bg-transparent! p-fib-2!">
        <p className="chat-q">{CHAT_Q}</p>
        <div className="chat-a">
          <Monogram className="mt-[3px] h-[16px] w-[16px] shrink-0 opacity-70" />
          <p>
            Yes. Saturday and Sunday mornings from Falcon Field. Want me to
            book you one?
          </p>
        </div>
        {/* the follow-up actually closing — the loop's last beat */}
        <p className="chat-booked" data-chat-booked aria-hidden>
          <svg viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2 6.4 4.8 9 10 3.4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Discovery flight booked · Sat 9:00 AM
        </p>
        <p className="serp-tag t-meta">
          Ask-this-site chat, answering from your pages
        </p>
      </div>
    </PhoneShell>
  );
}

/* ── the ads page's highlights (the macbook-neo gallery, our content):
   each card is one thing the service actually produces. Numbers are
   PLACEHOLDER — same swap list as lib/work.ts results. ── */
const ADS_HIGHLIGHTS: Highlight[] = [
  {
    key: "ad",
    caption: "Your ad, live on Google.",
    media: (
      <div className="hlg-float">
        <p className="g-sponsored">Sponsored</p>
        <p className="g-url">desertwingsflightschool.com</p>
        <p className="g-title">
          Desert Wings Flight School | Learn to Fly at Falcon Field
        </p>
        <p className="g-desc">
          Discovery flights and PPL through CFI training in Mesa, AZ.
        </p>
      </div>
    ),
  },
  {
    key: "landing",
    caption: "Every click lands on a page built to convert.",
    fill: true,
    media: (
      <Image
        src="/work/dw-tour.jpg"
        alt="The Desert Wings landing page we designed and built"
        width={2880}
        height={4446}
        sizes="88vw"
      />
    ),
  },
  {
    key: "tracking",
    caption: "Tracked to the dollar, in your own account.",
    media: (
      <div className="text-center">
        <p className="t-num font-display text-[clamp(3.4rem,7vw,6rem)] font-[650] leading-none">
          $38
        </p>
        <p className="t-meta mt-[13px] text-paper/60">
          cost per lead · last 30 days
        </p>
      </div>
    ),
  },
  {
    key: "reviews",
    caption: "The proof the click reads before calling.",
    fill: true,
    media: (
      <Image
        src="/work/live/dw-reviews.jpg"
        alt="The reviews section on the Desert Wings site"
        width={2880}
        height={1800}
        sizes="88vw"
      />
    ),
  },
  {
    key: "booking",
    caption: "The form that catches it.",
    fill: true,
    media: (
      <Image
        src="/work/live/dw-booking.jpg"
        alt="The booking form on the Desert Wings site"
        width={2880}
        height={1800}
        sizes="88vw"
      />
    ),
  },
  {
    key: "report",
    caption: "A report you can read in one minute.",
    media: (
      <div className="hlg-float">
        {[
          ["Leads", "26"],
          ["Cost per lead", "$38"],
          ["Search impression share", "74%"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-[13px] border-b border-ink/10 py-[9px] text-[0.9375rem] last:border-b-0"
          >
            <span className="text-ink/70">{k}</span>
            <span className="t-num font-[600]">{v}</span>
          </div>
        ))}
        <p className="t-meta mt-[13px] text-ink/50">Sent every Monday</p>
      </div>
    ),
  },
];

/* ── the risk-reversal band (Apple's "why the best place to buy" beat,
   apple-grammar.md sales sequence): the four objections a buyer is still
   holding after the price, each killed in one tile ── */
const WHY_US: Record<string, { head: string; body: string }[]> = {
  "google-ads": [
    {
      head: "Your account. Your data.",
      body: "Ads run in your own Google account — every dollar visible, and it all stays yours if you ever leave.",
    },
    {
      head: "No contracts.",
      body: "Month to month. We keep the work because it works, not because you signed for a year.",
    },
    {
      head: "A fixed fee, in writing.",
      body: "From $500 a month, agreed before we start. Ad spend is separate and you approve every budget.",
    },
    {
      head: "A human answers.",
      body: "Mesa, Arizona. Replies within one business day, from the person actually running your ads.",
    },
  ],
  websites: [
    {
      head: "A fixed quote, in writing.",
      body: "Two days after our call. The number never moves after — no hourly surprises, no scope-creep invoices.",
    },
    {
      head: "You own everything.",
      body: "The design, the code, the domain, the content. Nothing is held hostage on a proprietary builder.",
    },
    {
      head: "No retainers required.",
      body: "The build is the build. Ongoing help exists if you want it, and it's optional every month.",
    },
    {
      head: "A human answers.",
      body: "Mesa, Arizona. Replies within one business day, from the person who built your site.",
    },
  ],
  ai: [
    {
      head: "Scoped before it's built.",
      body: "A fixed, per-project quote. Nothing goes live until you've watched it work on your real enquiries.",
    },
    {
      head: "Your systems, your data.",
      body: "Everything runs in accounts you own. Turn it off any day and keep every record it created.",
    },
    {
      head: "No contracts.",
      body: "Month to month where it's ongoing, one fixed quote where it isn't.",
    },
    {
      head: "A human answers.",
      body: "Mesa, Arizona. Replies within one business day, from the person who wired it up.",
    },
  ],
};

export function ServicePage({ service }: { service: ServiceDef }) {
  const root = useRef<HTMLElement>(null!);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const siblings = siblingServices(service.slug);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const nav = document.querySelector(".site-nav");

      if (reducedMotion()) {
        if (nav) gsap.set(nav, { autoAlpha: 1 });
        gsap.set(q("[data-anim]"), { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        gsap.set(q(".g-m-link"), { autoAlpha: 1 });
        const chatQ = q(".chat-q")[0] as HTMLElement | undefined;
        if (chatQ) chatQ.textContent = CHAT_Q;
        // the demo rests as a still: exchange complete, booking confirmed
        gsap.set(q("[data-chat-booked]"), { autoAlpha: 1 });
        return;
      }

      /* ── hero: statement rises first, the artifact settles LAST, then its
         one loop-once micro-demo plays (animate-last = highest hierarchy) ── */
      const chatQEl = q(".chat-q")[0] as HTMLElement | undefined;
      if (chatQEl) chatQEl.textContent = "";
      const enter = contextSafe!(() => {
        const tl = gsap.timeline({ defaults: { ease: EASE_STRUCTURE } });
        // the nav is pre-hidden site-wide; a soft nav arrives with it visible
        // (to() from 1 is a no-op), a hard load fades it in with the statement
        if (nav) tl.to(nav, { autoAlpha: 1, duration: 0.6, ease: EASE_UI }, 0.1);
        // the title rises WITH the nav beat, not after it (the fade is a
        // no-op on soft navs — sequencing behind it just delayed the page)
        tl.fromTo(
          q(".svc-hero .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 0.95, stagger: 0.09 },
          "<"
        )
          .fromTo(
            q("[data-anim='h-sub']"),
            { autoAlpha: 0, y: 21 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE_UI },
            "-=0.5"
          )
          // the artifact arrives with the services-section envelope: real
          // travel, a whisper of scale, the long brake
          .fromTo(
            q("[data-anim='h-art']"),
            { autoAlpha: 0, y: 40, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 1.1 },
            "-=0.45"
          );

        if (service.slug === "google-ads") {
          // the ad's sitelink extensions tick in
          tl.fromTo(
            q(".g-m-link"),
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1, ease: EASE_UI },
            "+=0.15"
          );
        }
      });

      /* ── the artifact's ambient demo: each stage enacts its namesake on a
         governed loop (in view + tab visible only). The entrance settles the
         card; the loop is what keeps it ALIVE. ── */
      const loops: gsap.core.Timeline[] = [];

      if (service.slug === "google-ads") {
        /* the SEARCH CYCLE: the one surface ads management is visible on
           is the SERP itself, so the loop performs the craft there —
           found for the money searches, absent from the junk one
           (negative keywords made visible), then the tap takes the click */
        const ring = q(".g-click-ring")[0] as HTMLElement;
        const link = q(".g-m-link")[0] as HTMLElement;
        const qEl = q("[data-g-q]")[0] as HTMLElement;
        const caret = q(".g-m-caret")[0] as HTMLElement;
        const cap = q("[data-g-cap]")[0] as HTMLElement;
        const results = q("[data-g-results]")[0] as HTMLElement;
        const money = q("[data-serp-money]")[0] as HTMLElement;
        const junk = q("[data-serp-junk]")[0] as HTMLElement;
        if (ring && link && qEl && caret && cap && results && money && junk) {
          const Q1 = "flight school near me";
          const Q2 = "discovery flight mesa";
          const Q3 = "free flight simulator games";
          const CAP1 = "Found for the searches that matter.";
          const pt = () => ({
            x: link.offsetLeft + link.offsetWidth * 0.5,
            y: link.offsetTop + link.offsetHeight * 0.55,
          });
          gsap.set(ring, { xPercent: -50, yPercent: -50 });
          const c = gsap.timeline({ repeat: -1, paused: true, repeatRefresh: true });
          // the query retypes in place — the deleting/typing runs on proxy
          // objects, so repeatRefresh restarts them clean each cycle
          const retype = (from: string, to: string) => {
            const del = { p: 0 };
            const typ = { p: 0 };
            c.to(caret, { autoAlpha: 1, duration: 0.12 })
              .fromTo(
                del,
                { p: 0 },
                {
                  p: 1,
                  duration: 0.4,
                  ease: "none",
                  onUpdate: () => {
                    qEl.textContent = from.slice(0, Math.round(from.length * (1 - del.p)));
                  },
                }
              )
              .fromTo(
                typ,
                { p: 0 },
                {
                  p: 1,
                  duration: Math.min(1, to.length * 0.04),
                  ease: "none",
                  onUpdate: () => {
                    qEl.textContent = to.slice(0, Math.round(to.length * typ.p));
                  },
                },
                "+=0.15"
              )
              .to(caret, { autoAlpha: 0, duration: 0.2 }, "+=0.25");
          };
          // the caption swaps beneath the phone — narration, never chrome
          const say = (text: string) => {
            c.to(cap, { autoAlpha: 0, y: -4, duration: 0.25, ease: EASE_UI })
              .call(() => {
                cap.textContent = text;
              })
              .fromTo(
                cap,
                { autoAlpha: 0, y: 6 },
                { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE_UI }
              );
          };
          // the SERP "reloads" — the state swap happens while invisible.
          // The local chip only belongs to local searches; a junk query
          // wouldn't carry one on the real page
          const loc = q(".g-m-loc")[0] as HTMLElement | undefined;
          const refresh = (toJunk: boolean) => {
            c.to(results, { autoAlpha: 0, duration: 0.22, ease: EASE_UI });
            if (loc) c.to(loc, { autoAlpha: toJunk ? 0 : 1, duration: 0.22, ease: EASE_UI }, "<");
            c.set(money, { display: toJunk ? "none" : "block" })
              .set(junk, { display: toJunk ? "block" : "none" })
              .to(results, { autoAlpha: 1, duration: 0.28, ease: EASE_UI });
          };
          // a same-ad reload: a quick dip, the way a page blinks on refetch
          const dip = () => {
            c.to(results, { autoAlpha: 0.35, duration: 0.18, ease: "none", yoyo: true, repeat: 1 });
          };

          // beat 1 — the money search (the SSR rest state) holds
          c.to({}, { duration: 2.4 });
          // beat 2 — the NEXT money search; same ad, still on top
          retype(Q1, Q2);
          dip();
          say("And the next one, and the next.");
          c.to({}, { duration: 2.0 });
          // beat 3 — the junk search; the ad is ABSENT on purpose
          retype(Q2, Q3);
          refresh(true);
          say("Never for the ones that waste your budget.");
          c.to({}, { duration: 2.6 });
          // beat 4 — back to money, and the tap takes the click
          retype(Q3, Q1);
          refresh(false);
          say("Then the click becomes a customer.");
          c.to({}, { duration: 0.6 })
            // set-then-to, never fromTo: repeatRefresh re-renders an
            // invalidated fromTo's FROM state at every cycle start
            .set(ring, { x: () => pt().x, y: () => pt().y, autoAlpha: 0.55, scale: 0.25 })
            .to(ring, { autoAlpha: 0, scale: 1, duration: 0.6, ease: EASE_UI })
            .to(link, { opacity: 0.5, duration: 0.09, yoyo: true, repeat: 1, ease: "none" }, "<")
            .to({}, { duration: 1.8 });
          // restore the opening caption so the repeat is seamless
          say(CAP1);
          c.to({}, { duration: 0.9 });
          loops.push(c);
        }
      }

      if (service.slug === "websites") {
        // the LANDING, riding: the page the click arrives on scrolls itself
        const tourEl = q("[data-svc-tour]")[0] as HTMLElement | undefined;
        if (tourEl) {
          const well = tourEl.parentElement as HTMLElement;
          const travel = () =>
            -Math.max(0, 1 - well.offsetHeight / tourEl.offsetHeight) * 100;
          const c = gsap.timeline({ repeat: -1, paused: true, repeatRefresh: true });
          c.to({}, { duration: 1.4 })
            .to(tourEl, { yPercent: travel, duration: 14, ease: "none" })
            .to({}, { duration: 0.9 })
            .to(tourEl, { yPercent: 0, duration: 2.4, ease: EASE_STRUCTURE })
            .to({}, { duration: 1.1 });
          loops.push(c);
        }
      }

      if (service.slug === "ai" && chatQEl) {
        // the FOLLOW-UP, closing: question types, answer lands, booking
        // confirms — then the exchange resets and works the next lead
        const chatQ = chatQEl;
        const chatA = q(".chat-a")[0] as HTMLElement;
        const booked = q("[data-chat-booked]")[0] as HTMLElement;
        // pre-arrival state NOW — the paused loop's own set() only renders
        // on play, and the answer must never paint before its question
        gsap.set([chatA, booked], { autoAlpha: 0 });
        const state = { n: 0 };
        const c = gsap.timeline({ repeat: -1, paused: true });
        c.set([chatA, booked], { autoAlpha: 0 })
          .set(chatQ, { autoAlpha: 1 })
          .call(() => {
            state.n = 0;
            chatQ.textContent = "";
          })
          .to({}, { duration: 0.6 })
          .to(state, {
            n: CHAT_Q.length,
            duration: 1.1,
            ease: "none", // diegetic typing, constant rate
            snap: { n: 1 },
            onUpdate: () => {
              chatQ.textContent = CHAT_Q.slice(0, state.n);
            },
          })
          .to(chatA, { autoAlpha: 1, duration: 0.5, ease: EASE_UI }, "+=0.4")
          .to(booked, { autoAlpha: 1, duration: 0.4, ease: EASE_UI }, "+=0.9")
          .to({}, { duration: 3.8 })
          .to([chatQ, chatA, booked], {
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: EASE_UI,
          })
          .to({}, { duration: 0.5 });
        loops.push(c);
      }

      // governance: loops run only after arrival, in view, tab visible
      let arrived = false;
      let heroInView = false;
      const syncLoops = () => {
        const on = arrived && heroInView && !document.hidden;
        loops.forEach((l) => (on ? l.play() : l.pause()));
      };
      if (loops.length) {
        ScrollTrigger.create({
          trigger: q(".svc-hero")[0],
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            heroInView = self.isActive;
            syncLoops();
          },
        });
        document.addEventListener("visibilitychange", syncLoops);
      }

      let dead = false;
      whenArrived().then(() => {
        if (dead) return;
        enter();
        arrived = true;
        syncLoops();
      });

      /* hero artifact drift — contained one-plane parallax against the
         scroll. The self-scrolling tour already owns its plane's motion, so
         the websites frame stays put (two movements on one axis double up). */
      if (!q("[data-svc-tour]")[0]) {
        gsap.fromTo(
          q("[data-anim='h-art']"),
          { y: 0 },
          {
            y: -21,
            ease: "none",
            scrollTrigger: {
              trigger: q(".svc-hero")[0],
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      /* ── deliverables: rows enter with a directional stagger; on desktop the
         accent mark then WALKS the list as you read (index-sweep: everything
         stays visible, the sweep only directs the eye) ── */
      // THE fade-up (apple-grammar.md §5) — one recipe, fires on entry
      revealUp(q("[data-anim='rail']"), q(".svc-deliver")[0]);
      revealUp(q("[data-anim='d-row']"), q(".svc-d-list")[0]);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 821px)", () => {
        const list = q(".svc-d-list")[0] as HTMLElement;
        const rows = q(".svc-d") as HTMLElement[];
        const inners = q(".svc-d-in") as HTMLElement[];
        const mark = q(".svc-mark")[0] as HTMLElement;
        if (!list || rows.length < 2 || !mark) return;

        gsap.set(inners, { opacity: 0.6 });
        gsap.set(inners[0], { opacity: 1 });
        gsap.set(mark, { autoAlpha: 1, y: rows[0].offsetTop + 44 });

        let prev = 0;
        const setActive = (i: number) => {
          if (i === prev) return;
          prev = i;
          gsap.to(inners, { opacity: 0.6, duration: 0.4, ease: EASE_UI, overwrite: "auto" });
          gsap.to(inners[i], { opacity: 1, duration: 0.4, ease: EASE_UI, overwrite: "auto" });
          gsap.to(mark, {
            y: rows[i].offsetTop + 44,
            duration: 0.55,
            ease: EASE_STRUCTURE,
            overwrite: "auto",
          });
        };
        const st = ScrollTrigger.create({
          trigger: list,
          start: "top 58%",
          end: "bottom 45%",
          onUpdate: (self) =>
            setActive(Math.round(self.progress * (rows.length - 1))),
        });
        return () => {
          st.kill();
          gsap.set(inners, { opacity: 1 });
        };
      });
      // mobile: no sweep — every row rests fully legible
      mm.add("(max-width: 820px)", () => {
        gsap.set(q(".svc-d-in"), { opacity: 1 });
        gsap.set(q(".svc-mark"), { autoAlpha: 0 });
      });

      /* ── process cards: head, then the row deals in left to right ── */
      revealUp(q("[data-anim='proc']"), q(".svc-process")[0]);
      revealUp(q("[data-anim='proc-card']"), q(".proc-card")[0]);

      /* ── the sub-offer band (#lsa/#landing/#aeo) rises as one beat ── */
      revealUp(q("[data-anim='sub']"), q(".svc-sub")[0], { stagger: 0.06 });

      /* ── price beat: the peak — lead line, then the number rises ── */
      const priceTl = gsap.timeline({
        defaults: { ease: EASE_STRUCTURE },
        scrollTrigger: { trigger: q(".svc-price")[0], start: "top 72%", toggleActions: "play none none none" },
      });
      priceTl
        .fromTo(
          q("[data-anim='p-lead']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE_UI }
        )
        .fromTo(
          q(".svc-price .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 0.95 },
          "-=0.25"
        )
        .fromTo(
          q("[data-anim='p-out']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE_UI },
          "-=0.4"
        );

      // the witnesses join after the claim has landed (home price-beat grammar)
      gsap.fromTo(
        q("[data-anim='quote']"),
        { autoAlpha: 0, y: 21, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.16,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: q(".svc-price")[0], start: "top 45%", toggleActions: "play none none none" },
        }
      );
      // and breathe at their own rates while the section is on screen
      (q("[data-drift]") as HTMLElement[]).forEach((el) => {
        gsap.to(el, {
          yPercent: parseFloat(el.dataset.drift || "0"),
          ease: "none",
          scrollTrigger: {
            trigger: q(".svc-price")[0],
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      revealUp(q("[data-anim='why']"), q(".svc-why")[0]);
      revealUp(q("[data-anim='why-tile']"), q(".why-tile")[0]);
      revealUp(q("[data-anim='faq']"), q(".svc-faq")[0], { stagger: 0.07 });

      revealUp(q("[data-anim='ask']"), q(".svc-ask")[0]);

      return () => {
        dead = true;
        document.removeEventListener("visibilitychange", syncLoops);
      };
    },
    { scope: root }
  );

  return (
    <article ref={root}>
      {/* ── HERO · the Apple center-stage: one thing at a time, stacked —
          statement, one gray sentence, the action, then THE artifact,
          enormous and centered beneath the words (never beside them) ── */}
      <section className="svc-hero relative overflow-x-clip">
        {/* mobile trims the top air so the artifact's bottom clears the
            identity bar on the FIRST viewport — the demo is the sell */}
        <div className="wrap flex flex-col items-center pb-fib-6 pt-fib-6 text-center md:pt-[176px]">
          <p data-anim="h-sub" className="t-meta text-ink/55">
            {service.stage}
          </p>
          <h1 className="t-display-title mt-fib-2">
            {service.title.map((line) => (
              <span key={line} className="mask-line">
                <span className="mask-inner">{line}</span>
              </span>
            ))}
          </h1>
          <p data-anim="h-sub" className="t-lede mx-auto mt-fib-3 max-w-[46ch] text-ink/70">
            {service.support}
          </p>
          <div
            data-anim="h-sub"
            className="mt-fib-4 flex flex-wrap items-center justify-center gap-fib-3"
          >
            <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
            <Link
              href="/pricing"
              className="u-link u-link--chev t-meta py-fib-2 text-ink/70"
            >
              See the whole pricing sheet
            </Link>
          </div>
          {/* the price, IN the hero (Apple: "From $1099" sits beside Buy —
              nothing withheld; SK hides price entirely, and transparency is
              exactly where we beat them) */}
          <p data-anim="h-sub" className="t-meta mt-fib-3 text-ink/55">
            {service.heroPrice}
          </p>
          <div
            data-anim="h-art"
            className="mt-fib-5 w-full md:mt-fib-6"
          >
            <HeroArtifact slug={service.slug} />
          </div>
        </div>
      </section>

      {/* ── THE RECEIPT BAND (SK decode 2026-08-02: their award band sits
          DIRECTLY under the hero — trust adjacent to the first ask, at
          heading scale, before any feature copy. We hold no awards, so our
          version is the thing an award stands in for: a real result with
          real stars, linked to the case it came from.
          PLACEHOLDER metric — same swap list as lib/work.ts results. ── */}
      <section className="svc-receipt border-y border-ink/10 py-fib-3">
        <div
          data-anim="h-sub"
          className="wrap flex flex-wrap items-center justify-center gap-x-fib-3 gap-y-fib-1 text-center"
        >
          <span className="flex items-center gap-fib-2">
            <span className="hero-stars" aria-hidden>
              {[0, 1, 2, 3, 4].map((s) => (
                <svg key={s} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.8L10 1.5z" />
                </svg>
              ))}
            </span>
            <span className="t-meta text-ink/70">5.0 from our clients</span>
          </span>
          <span className="hidden text-ink/25 md:inline" aria-hidden>
            &middot;
          </span>
          <span className="t-meta text-ink/70">
            3x more bookings for Desert Wings in 90 days
          </span>
          <Link
            href="/work/desert-wings"
            className="u-link u-link--chev t-meta text-ink/70"
          >
            See the case
          </Link>
        </div>
      </section>

      {/* ── THE FREE TOOL, slot 2 (Jake, 2026-07-16: "our free tool might
          be better" than SearchKings' award band — a working calculator
          de-risks harder than a trophy) ── */}
      {service.slug === "google-ads" && <LeadMath />}

      {/* ── THE HIGHLIGHTS · the swiping gallery (ads page only) ── */}
      {service.slug === "google-ads" && (
        <HighlightsGallery
          label="Google Ads highlights"
          heading="The highlights."
          items={ADS_HIGHLIGHTS}
        />
      )}

      {/* ── WHAT YOU GET · the page's DARK chapter (the homepage funnel-panel
          grammar: the offer lives on the brand's important-objects ground) ── */}
      <section className="svc-deliver py-fib-4 md:py-fib-5">
        <div className="dark-chapter mx-[8px] rounded-panel py-fib-6 md:mx-[13px]">
          <div className="wrap grid gap-fib-5 md:grid-cols-[minmax(260px,340px)_1fr] md:gap-fib-6">
            <div>
              <div className="md:sticky md:top-[144px]">
                <h2 data-anim="rail" className="t-display-lg">
                  What you actually get
                </h2>
                <p data-anim="rail" className="mt-fib-3 max-w-[28ch] text-paper/70">
                  {service.slug === "google-ads" &&
                    "Not impressions. Leads, a cost per lead, and a report you can read in one minute."}
                  {service.slug === "websites" &&
                    "Not a template with your logo on it. A page built from your business, that you own outright."}
                  {service.slug === "ai" &&
                    "Not a chatbot widget. A follow-up system that works your leads while you work."}
                </p>
              </div>
            </div>

            <div className="svc-d-list relative md:pl-fib-5">
              {/* the traveling accent — directs the eye; never gates the content */}
              <span className="svc-mark" aria-hidden />
              <ul className="flex flex-col gap-fib-2 md:gap-fib-3">
                {service.deliverables.map((d) => (
                  <li key={d.name} data-anim="d-row" className="svc-d">
                    <div className="svc-d-in">
                      <h3 className="t-title--lg font-display">{d.name}</h3>
                      <p className="mt-fib-2 max-w-[52ch] text-paper/70">{d.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE SUB-OFFER · the anchor chapter the homepage door promises
          (#lsa / #landing / #aeo) — the deep-link finally has a landing ── */}
      <SubOffer slug={service.slug} />

      {/* ── BUILD YOURS · the toy lives HERE, not on the homepage: on this
          page the visitor has self-selected into website intent, so "what
          would yours look like" closes instead of mispositioning ── */}
      {service.slug === "websites" && <Builder />}

      {/* ── THE PRICE · the one centered statement peak, open on the canvas,
          with the client voices floating around it (the home price-beat
          grammar) ── */}
      {/* compressed 2026-08-02 ("earn every scroll"): the number now also
          lives in the hero, so this peak keeps its statement but gives back
          a third of the viewport it used to hold hostage */}
      <section className="svc-price relative overflow-x-clip" data-pcta-hide>
        <div className="wrap relative flex min-h-[62svh] flex-col items-center justify-center py-fib-5 text-center md:py-fib-6">
          <p data-anim="p-lead" className="t-meta text-ink/60">
            {service.price.lead}
          </p>
          <p className="t-statement t-statement--hero mt-fib-3">
            <span className="mask-line">
              <span className="mask-inner">
                {service.price.big === service.price.accent ? (
                  <span className="text-accent">{service.price.big}</span>
                ) : (
                  <>
                    {service.price.big.slice(
                      0,
                      service.price.big.indexOf(service.price.accent)
                    )}
                    <span className="text-accent">{service.price.accent}</span>
                  </>
                )}
              </span>
            </span>
          </p>
          <p data-anim="p-out" className="t-lede mx-auto mt-fib-3 max-w-[44ch] text-ink/70">
            {service.price.note}
          </p>
          <div data-anim="p-out" className="mt-fib-4 flex flex-wrap justify-center gap-fib-1">
            {service.price.chips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
          <div data-anim="p-out" className="mt-fib-4 flex justify-center">
            <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
          </div>

          {/* the witnesses — quieter, floating around the claim (desktop);
              they join AFTER the price lands and drift at their own rates */}
          <div className="hidden lg:block" aria-hidden="false">
            {QUOTES.map((quo, i) => (
              <figure
                key={quo.name}
                data-anim="quote"
                data-drift={i % 2 === 0 ? "-4" : "3"}
                className={`pb-quote ${
                  i === 0 ? "pb-quote--tl" : i === 1 ? "pb-quote--tr" : "pb-quote--bl"
                }`}
              >
                <blockquote>
                  <p className="text-[0.9375rem] leading-[1.5] text-ink/70">
                    &ldquo;{quo.text}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-fib-2 flex items-center gap-[8px]">
                  <span className={`pb-av ${AV_TINTS[i]}`}>
                    <PersonIcon />
                  </span>
                  <span className="t-meta text-ink/45">{quo.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* mobile / tablet: the witnesses stack under the claim */}
        <div className="wrap grid gap-fib-3 pb-fib-6 sm:grid-cols-3 lg:hidden">
          {QUOTES.map((quo, i) => (
            <figure
              key={quo.name}
              data-anim="quote"
              className="rounded-panel bg-panel/60 p-fib-4"
            >
              <blockquote>
                <p className="text-[0.9375rem] leading-[1.5] text-ink/70">
                  &ldquo;{quo.text}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-fib-2 flex items-center gap-[8px]">
                <span className={`pb-av ${AV_TINTS[i]}`}>
                  <PersonIcon />
                </span>
                <span className="t-meta text-ink/45">{quo.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── WHY BUY IT FROM US · the risk-reversal band: the price just
          landed, so every remaining objection dies here, one per tile
          (flat white bento on the canvas — surfaces don't perform) ── */}
      <section className="svc-why py-fib-5 md:py-fib-6">
        <div className="wrap">
          <h2 data-anim="why" className="t-display-lg mx-auto max-w-[16ch] text-center">
            Why buy it from us
          </h2>
          <div className="mt-fib-5 grid gap-fib-2 md:grid-cols-2 md:gap-fib-3">
            {(WHY_US[service.slug] ?? WHY_US.websites).map((t) => (
              <div key={t.head} data-anim="why-tile" className="why-tile">
                <h3 className="t-title font-display">{t.head}</h3>
                <p className="mt-fib-2 max-w-[44ch] text-ink/70">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUESTIONS · the three that decide this stage ── */}
      <section className="svc-faq py-fib-6">
        <div className="wrap grid gap-fib-4 md:grid-cols-[minmax(260px,340px)_1fr] md:gap-fib-6">
          <div>
            <div className="md:sticky md:top-[144px]">
              <h2 data-anim="faq" className="t-display-lg max-w-[10ch]">
                Asked every week
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-fib-2">
            {service.faqs.map((f, i) => (
              <div
                key={f.q}
                data-anim="faq"
                className={`faq-card ${openFaq === i ? "is-open" : ""}`}
              >
                <button
                  className="faq-q"
                  aria-expanded={openFaq === i}
                  aria-controls={`svc-faq-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="faq-x" aria-hidden />
                </button>
                <div id={`svc-faq-${i}`} className="faq-a" role="region">
                  <div>
                    <p className="max-w-[62ch] text-ink/75">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT RUNS · the easy-bridge (SK decode: a short "getting
          started is easy" band sits between the proof and the form — it
          kills the "this will be work" objection right before the
          commitment; moved here from before the price 2026-08-02) ── */}
      <section className="svc-process py-fib-5 md:py-fib-6">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-fib-3 md:flex-row md:items-end">
            <h2 data-anim="proc" className="t-display-lg max-w-[12ch]">
              How it runs
            </h2>
            <p data-anim="proc" className="max-w-[38ch] text-ink/70 md:text-right">
              {service.slug === "google-ads" &&
                "From first call to a report you can hold us to. No setup fees, no lock-in."}
              {service.slug === "websites" &&
                "From first call to launch. The quote is fixed on day two and never moves."}
              {service.slug === "ai" &&
                "Scoped, built, checked and managed. Nothing goes live until you've seen it work."}
            </p>
          </div>
          <div className="mt-fib-4 md:mt-fib-5">
            <ProcessCards steps={service.process} anim="proc-card" />
          </div>
        </div>
      </section>

      {/* ── THE ASK · dark panel floating on the canvas ── */}
      <section className="svc-ask" data-pcta-hide>
        <div className="dark-chapter mx-[8px] mb-fib-3 rounded-panel py-fib-6 md:mx-[13px]">
          <div className="wrap flex flex-col items-start justify-between gap-fib-4 md:flex-row md:items-end">
            <div>
              <h2 data-anim="ask" className="t-display-lg max-w-[13ch]">
                Price it in sixty seconds
              </h2>
              <p data-anim="ask" className="t-lede mt-fib-3 max-w-[42ch] text-paper/70">
                The estimator computes from the same sheet we quote from. Pick
                what your business needs and watch the number move.
              </p>
            </div>
            <div data-anim="ask" className="flex flex-wrap items-center gap-fib-3">
              <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
              <Link
                href="/contact"
                className="u-link u-link--chev t-meta py-fib-2 text-paper/70"
              >
                Or just tell us about your business
              </Link>
            </div>
          </div>
          {/* objection-kill AT the commitment point (SK's form-side copy)
              + the siblings demoted from a full section to quiet doors —
              the cross-sell no longer owns an exit ramp before the ask.
              The hairline runs panel-wide; the CONTENT sits in the wrap
              (first render escaped the gutters and clipped at the edge). */}
          <div data-anim="ask" className="mt-fib-5 border-t border-paper/15 pt-fib-3">
            <div className="wrap flex flex-wrap items-center justify-between gap-fib-3">
              <p className="t-meta text-paper/55">
                No obligation. The number is fixed in writing before anything
                starts.
              </p>
              <p className="t-meta flex flex-wrap items-center gap-fib-3 text-paper/55">
                <span>Also:</span>
                {siblings.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="u-link text-paper/70"
                  >
                    {s.nav} · {SERVICE_META[s.slug].price}
                  </Link>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
