import type { ReactNode } from "react";
import Image from "next/image";
import { Monogram } from "@/components/ui/monogram";

/* §02 · THE PHONES
   One real screen per stage, in the shipped site's iPhone chrome (.dvc,
   true 9/19.5) with its Google (.g-m) and chat (.chat-*) skins — shared
   classes in globals.css, reused rather than re-drawn so there is ONE
   phone on this site. Every screen is composed to live at the TOP of its
   mock: §02's tray crops the bottom half and nothing that sells the stage
   is down there.

   All three rest in their FINISHED state. No loop, no typing, no reveal:
   a phone in a list must read complete at every scroll moment, and the
   row's title is the thing in the spotlight — the phone is what proves
   it, not what competes with it. */

function Phone({ ui, children }: { ui?: boolean; children: ReactNode }) {
  return (
    <div className="dvc">
      {/* the UI skins carry their own status-bar breath (.dvc-screen--ui
          pads the top) and run islandless, as on the shipped hero; the
          screenshot phone gets the island because a photo of a site
          without one reads as a rounded rectangle */}
      {!ui && <span className="dvc-island" />}
      <div className={ui ? "dvc-screen dvc-screen--ui" : "dvc-screen"}>
        {children}
      </div>
    </div>
  );
}

/* 01 · THE CLICK — the REAL client's search, won. "flight school near
   me" with Desert Wings in the sponsored slot: the slot IS the product. */
const WON = {
  q: "flight school near me",
  fav: "/work/dw-favicon.png",
  name: "Desert Wings Flight School",
  url: "https://www.desertwingsflightschool.com",
  title: "Desert Wings Flight School | Learn to Fly at Falcon Field",
  desc: "Discovery flights and PPL through CFI training in Mesa, AZ. Train at Falcon Field with FAA-certified instructors.",
  links: [
    ["Discovery flights", "See the valley from the left seat"],
    ["Fleet and rates", "Transparent hourly rates, modern 172s"],
  ] as [string, string][],
};

function WonSearch() {
  return (
    <Phone ui>
      <div className="g-m">
        <div className="g-m-bar">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="8.6" cy="8.6" r="5.4" stroke="currentColor" strokeWidth="2" />
            <path d="m13 13 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="g-m-q">{WON.q}</span>
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
            <Image src={WON.fav} alt="" width={64} height={64} className="g-m-fav" />
            <span className="g-m-site">
              <span className="g-m-name">{WON.name}</span>
              <span className="g-m-url">{WON.url}</span>
            </span>
            <svg viewBox="0 0 16 16" fill="currentColor" className="g-m-kebab">
              <circle cx="8" cy="3.2" r="1.4" />
              <circle cx="8" cy="8" r="1.4" />
              <circle cx="8" cy="12.8" r="1.4" />
            </svg>
          </div>
          <p className="g-m-title">{WON.title}</p>
          <p className="g-m-desc">{WON.desc}</p>
          <div className="g-m-links">
            {WON.links.map(([t, sub]) => (
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
      </div>
    </Phone>
  );
}

/* 02 · THE LANDING — the page the click above lands on, on the phone it
   is read on. Desert Wings again, ON PURPOSE: the three trays tell one
   customer's story end to end (their search won, their page, their
   booking), and a story told with one business is a demonstration; told
   with three it is a collage. AAHG's mobile top was tried first and read
   as a dead screen — a dark hero on a black bezel. The asset is the
   shipped card's crop of the mobile hero (the nav skipped, the sky band
   and "Book a tour" at the top), cut once at build time and halved, so
   the browser never decodes 2,500px to show the top 45% of it. */
function SiteTour() {
  return (
    <Phone>
      <Image
        src="/work/live/dw-phone-top.jpg"
        alt=""
        width={585}
        height={1114}
        sizes="300px"
        className="dr-svc-tour"
      />
    </Phone>
  );
}

/* 03 · THE FOLLOW-UP — the thread, already ended in a booking. */
function FollowUp() {
  return (
    <Phone ui>
      <div className="dr-chat">
        <div className="chat-thread">
          <div className="chat-b chat-b--user">
            <p>Are you open this weekend?</p>
          </div>
          <div className="chat-b chat-b--bot">
            <Monogram className="mt-[3px] h-[15px] w-[15px] shrink-0 opacity-70" />
            <p>Yes &mdash; Saturday morning is open. Want me to book you in?</p>
          </div>
          <p className="chat-booked">
            <svg viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 6.4 4.8 9 10 3.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Booked &middot; Sat 9:00 AM
          </p>
        </div>
      </div>
    </Phone>
  );
}

/* keyed by lib/services.ts slug; a slug with no entry renders no tray */
export const PHONES: Record<string, ReactNode> = {
  "google-ads": <WonSearch />,
  websites: <SiteTour />,
  ai: <FollowUp />,
};
