import type { ReactNode } from "react";
import Link from "next/link";
import { CTA } from "@/components/ui/cta";

/* The sub-offer band — the anchor chapters the homepage doors promise
   (#lsa, #landing, #aeo). Three of the six router cards deep-link here;
   until 2026-07-22 the anchors didn't exist and the clicks landed at the
   top of the page with the promise unanswered. Each chapter is the same
   shape: the mock artifact from the matching homepage card (emphasis
   grammar: the win floats, the rest recedes) beside the copy that closes
   the sub-offer. One band per page, right after "How it runs". */

type SubOfferDef = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  chips: string[];
  quiet: { href: string; label: string };
  mockLabel: string;
  mock: ReactNode;
};

/* ── the mocks (same demo-fiction universe as the homepage cards:
   Mesa Rapid Plumbing + Canyon Plumbing are FICTIONAL; Desert Wings is
   the real client, mock content illustrative) ── */

const LSA_MOCK = (
  <div className="dvc" aria-hidden>
    <div className="dvc-screen dvc-screen--ui">
      <div className="g-m">
        <div className="g-m-bar">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="8.6" cy="8.6" r="5.4" stroke="currentColor" strokeWidth="2" />
            <path d="m13 13 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="g-m-q">emergency plumber mesa</span>
        </div>
        <div className="g-lsa">
          <p className="g-lsa-head">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .8 2.7 3v4c0 3.4 2.2 6.5 5.3 7.4 3.1-.9 5.3-4 5.3-7.4V3L8 .8Zm-1 9.9L4.6 8.3l1-1 1.4 1.4 3.4-3.4 1 1-4.4 4.4Z" />
            </svg>
            GOOGLE GUARANTEED
          </p>
          <div className="g-lsa-row is-win">
            <span className="g-lsa-av">M</span>
            <span className="g-lsa-t">
              <span className="g-lsa-name">Mesa Rapid Plumbing</span>
              <span className="g-lsa-meta">
                <span className="g-lsa-star">&#9733;</span> <b>4.9</b> (132) &middot; Open 24/7
              </span>
            </span>
            <span className="g-lsa-call">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.6 1.8 5.8 1c.4-.1.8 0 1 .4l1.1 2.3c.2.4.1.8-.2 1l-1.2 1a10 10 0 0 0 3.8 3.8l1-1.2c.2-.3.6-.4 1-.2l2.3 1.1c.4.2.5.6.4 1l-.8 2.2c-.2.4-.6.7-1 .7C7.2 13 3 8.8 2.9 2.8c0-.4.3-.8.7-1Z" />
              </svg>
            </span>
          </div>
          <div className="g-lsa-row">
            <span className="g-lsa-av">C</span>
            <span className="g-lsa-t">
              <span className="g-lsa-name">Canyon Plumbing Co.</span>
              <span className="g-lsa-meta">
                <span className="g-lsa-star">&#9733;</span> <b>4.8</b> (98) &middot; Mesa, AZ
              </span>
            </span>
            <span className="g-lsa-call">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.6 1.8 5.8 1c.4-.1.8 0 1 .4l1.1 2.3c.2.4.1.8-.2 1l-1.2 1a10 10 0 0 0 3.8 3.8l1-1.2c.2-.3.6-.4 1-.2l2.3 1.1c.4.2.5.6.4 1l-.8 2.2c-.2.4-.6.7-1 .7C7.2 13 3 8.8 2.9 2.8c0-.4.3-.8.7-1Z" />
              </svg>
            </span>
          </div>
          {/* the list continues past the crop — never a dead end */}
          <div className="g-skel">
            <span className="g-skel-thumb" />
            <span className="g-skel-lines">
              <span className="g-skel-line block w-[76%]" />
              <span className="g-skel-line block w-[54%]" />
            </span>
          </div>
          <div className="g-skel">
            <span className="g-skel-thumb" />
            <span className="g-skel-lines">
              <span className="g-skel-line block w-[68%]" />
              <span className="g-skel-line block w-[59%]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LANDING_MOCK = (
  <div className="dvc" aria-hidden>
    <div className="dvc-screen dvc-screen--ui">
      <div className="ldg">
        <div className="ldg-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/work/dw-favicon.png" alt="" className="ldg-logo" width={64} height={64} />
          <span className="ldg-brand">Desert Wings</span>
          <span className="ldg-call">
            <svg viewBox="0 0 20 20" fill="none">
              <path
                d="M4.2 3.5c.4-.7 1.3-.9 1.9-.4l1.6 1.3c.5.4.7 1.2.4 1.8l-.7 1.4a.9.9 0 0 0 .1 1c.8 1.1 1.9 2.2 3 3a.9.9 0 0 0 1 .1l1.4-.7c.6-.3 1.4-.1 1.8.4l1.3 1.6c.5.6.3 1.5-.4 1.9l-1.5.9c-.6.4-1.4.4-2.1.1-3.6-1.7-6.5-4.6-8.2-8.2-.3-.7-.3-1.5.1-2.1l.9-1.5Z"
                fill="currentColor"
              />
            </svg>
            Call
          </span>
        </div>
        <p className="ldg-h">
          Learn to fly
          <br />
          at Falcon Field.
        </p>
        <div className="ldg-form">
          <p className="ldg-form-t">Book a discovery flight</p>
          <span className="ldg-in-row">
            <span className="ldg-in">Name</span>
            <span className="ldg-in">Phone</span>
          </span>
          <span className="ldg-btn">Check available times</span>
        </div>
        <span className="ldg-skel" />
        <span className="ldg-skel ldg-skel--short" />
      </div>
    </div>
  </div>
);

const AEO_MOCK = (
  <div className="dvc" aria-hidden>
    <div className="dvc-screen dvc-screen--ui">
      <div className="ai-m">
        <div className="ai-m-top">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M3 5.5h14M3 10h14M3 14.5h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <p className="ai-m-title">
            ChatGPT <span>5 &rsaquo;</span>
          </p>
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M12.8 3.7 16.3 7.2 7.5 16H4v-3.5l8.8-8.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="ai-m-q">Best flight school near Mesa?</p>
        <p className="ai-m-a">
          <b>Desert Wings Flight School</b> at Falcon Field comes up most
          &mdash; strong reviews, discovery flights, and PPL through CFI on
          one path&hellip;
        </p>
        {/* the answer keeps writing past the crop */}
        <div className="g-skel">
          <span className="g-skel-lines">
            <span className="g-skel-line block w-[88%]" />
            <span className="g-skel-line block w-[64%]" />
          </span>
        </div>
      </div>
    </div>
  </div>
);

const SUB_OFFERS: Record<string, SubOfferDef> = {
  "google-ads": {
    id: "lsa",
    kicker: "Also on this stage · Local Services Ads",
    title: "Pay only when the phone rings",
    body: "Local Services Ads put you in the Google Guaranteed slot above everything else on the page, and they bill per lead, not per click. We handle the setup and verification, tune the categories and hours, and dispute the calls that were never real leads, so the number you pay tracks the phone actually ringing.",
    chips: ["Google Guaranteed", "Billed per lead", "Best for the trades"],
    quiet: { href: "/contact", label: "Ask if LSA fits your trade" },
    mockLabel:
      "A Google search showing the Google Guaranteed listings with the managed business on top",
    mock: LSA_MOCK,
  },
  websites: {
    id: "landing",
    kicker: "Also on this stage · Landing pages",
    title: "One page, built to catch the click",
    body: "When a campaign needs its own page, we build exactly one: a headline that repeats the ad's promise, a lead form above the fold, and nothing else to click. It ships in days, not weeks, on the same fixed-quote terms as a full build, and it is tuned from the same tracking the ads report into.",
    chips: ["Days, not weeks", "Fixed quote", "Message-matched to the ad"],
    quiet: { href: "/contact", label: "Ask about a landing page" },
    mockLabel:
      "A phone showing a one-page landing page with a headline and lead form",
    mock: LANDING_MOCK,
  },
  ai: {
    id: "aeo",
    kicker: "Also on this stage · AEO",
    title: "Be the answer on ChatGPT",
    body: "When a customer asks ChatGPT or Google's AI who to call, the answer is assembled from the pages those engines can actually read. We structure your site for them: llms.txt, structured data, and pages written so an assistant can quote them. Answer-engine optimization, in place before your competitors have heard the term.",
    chips: ["ChatGPT + AI Overviews", "llms.txt + structured data", "Quoted per project"],
    quiet: { href: "/contact", label: "Ask how AI sees your site" },
    mockLabel: "ChatGPT recommending the client business to a customer",
    mock: AEO_MOCK,
  },
};

export function SubOffer({ slug }: { slug: string }) {
  const def = SUB_OFFERS[slug];
  if (!def) return null;
  return (
    <section id={def.id} className="svc-sub scroll-mt-fib-6 py-fib-4 md:py-fib-5">
      <div className="mx-[8px] rounded-panel bg-panel py-fib-5 md:mx-[13px] md:py-fib-6">
        <div className="wrap grid items-center gap-fib-5 md:grid-cols-2 md:gap-fib-6">
          <div>
            <span data-anim="sub" className="chip chip--sm">
              {def.kicker}
            </span>
            <h2 data-anim="sub" className="t-display-lg mt-fib-3 max-w-[14ch]">
              {def.title}
            </h2>
            <p data-anim="sub" className="mt-fib-3 max-w-[48ch] text-ink/70">
              {def.body}
            </p>
            <div data-anim="sub" className="mt-fib-3 flex flex-wrap gap-fib-1">
              {def.chips.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
            <div
              data-anim="sub"
              className="mt-fib-4 flex flex-wrap items-center gap-fib-3"
            >
              <CTA href="/pricing#estimate" label="Price my project" tone="ink" />
              <Link
                href={def.quiet.href}
                className="u-link u-link--chev t-meta py-fib-2 text-ink/70"
              >
                {def.quiet.label}
              </Link>
            </div>
          </div>
          <div
            data-anim="sub"
            className="svc-card-demo svc-sub-demo"
            role="img"
            aria-label={def.mockLabel}
          >
            {def.mock}
          </div>
        </div>
      </div>
    </section>
  );
}
