"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* THE WIDGET STACK
   The popular version of this is three glass cards with invented telemetry.
   Every widget here is backed by something real: the work is the actual
   roster, the clock is the promise the page makes, the system is what gets
   built. Each rests as a complete statement and OPENS into a larger panel —
   the open state adds depth, it never hides the essential, so a phone with
   no hover loses nothing. */

const WORK = [
  {
    slug: "desert-wings",
    client: "Desert Wings Flight School",
    kind: "Website · Ads · SEO",
    meta: "Aviation · 2026",
    src: "/work/dw-home.jpg",
  },
  {
    slug: "aahg",
    client: "Arizona Aviation Historical Group",
    kind: "Website",
    meta: "Nonprofit · 2026",
    src: "/work/aahg-hero.jpg",
  },
  {
    slug: "riled-up",
    client: "Riled Up Pickleball",
    kind: "Website · Booking system",
    meta: "Coaching · 2026",
    src: "/work/riled-hero.jpg",
  },
];

const PARTS = [
  ["The site", "Fast, on your phone, built to be found"],
  ["Call tracking", "Every ring logged against the ad that caused it"],
  ["Instant reply", "A text goes back before they call the next guy"],
  ["Ad reporting", "Which ad paid for which job, in plain numbers"],
];

type Props = { numRef: React.RefObject<HTMLElement | null> };

export default function LeadWidgets({ numRef }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [i, setI] = useState(0);
  const w = WORK[i];
  const step = (d: number) => setI((n) => (n + d + WORK.length) % WORK.length);

  // hover drives this on a pointer; tap drives it on a phone
  const tap = (id: string) => () => setOpen((o) => (o === id ? null : id));

  return (
    <div className="dr-system" data-any={open ? "true" : undefined}>
      <span className="t-label dr-system-h">The short version</span>

      {/* ── 1 · RECENT WORK — opens into a panel you can page through ── */}
      <div
        className="dr-w dr-panel dr-edge"
        data-open={open === "work" ? "true" : undefined}
        onClick={tap("work")}
        tabIndex={0}
        role="group"
        aria-label="Recent work"
      >
        <div className="dr-w-face">
          <span className="t-label dr-w-k">Recent work</span>
          <div className="dr-w-thumbs" aria-hidden>
            {WORK.map((p) => (
              <span key={p.slug}>
                <Image src={p.src} alt="" fill sizes="72px" />
              </span>
            ))}
          </div>
          <b>{WORK.length} sites live</b>
        </div>

        <div className="dr-w-open">
          <span className="t-label dr-w-k">Recent work</span>
          <div className="dr-w-shot">
            <Image
              src={w.src}
              alt={`${w.client} website`}
              fill
              sizes="(max-width: 900px) 90vw, 520px"
            />
          </div>
          <b>{w.client}</b>
          <span className="t-meta">
            {w.kind} · {w.meta}
          </span>
          <div className="dr-w-nav">
            <button
              type="button"
              aria-label="Previous project"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
            >
              ←
            </button>
            <span className="dr-w-dots" aria-hidden>
              {WORK.map((p, n) => (
                <i key={p.slug} data-on={n === i ? "true" : undefined} />
              ))}
            </span>
            <button
              type="button"
              aria-label="Next project"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
            >
              →
            </button>
            <Link
              href={`/work/${w.slug}`}
              className="t-label dr-w-go"
              onClick={(e) => e.stopPropagation()}
            >
              View case
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2 · THE CLOCK — the promise, counted, then explained ── */}
      <div
        className="dr-w dr-panel dr-edge"
        data-open={open === "clock" ? "true" : undefined}
        onClick={tap("clock")}
        tabIndex={0}
        role="group"
        aria-label="Reply time"
      >
        <div className="dr-w-face">
          <span className="dr-num">
            <i ref={numRef}>0</i>
            <em>sec</em>
          </span>
          <b>Texted back, automatically</b>
          <span className="t-meta">Before they call the next guy</span>
        </div>

        <div className="dr-w-open">
          <span className="t-label dr-w-k">One missed call</span>
          <ol className="dr-w-time">
            <li>
              <span className="t-meta">6:41:03 PM</span>
              <b>Call comes in, nobody is at the desk</b>
            </li>
            <li>
              <span className="t-meta">6:41:07 PM</span>
              <b>A text goes back on its own</b>
            </li>
            <li>
              <span className="t-meta">Tuesday, 9:00 AM</span>
              <b>Booked</b>
            </li>
          </ol>
        </div>
      </div>

      {/* ── 3 · THE SYSTEM — what "the system behind it" actually means ── */}
      <div
        className="dr-w dr-panel dr-edge"
        data-open={open === "parts" ? "true" : undefined}
        onClick={tap("parts")}
        tabIndex={0}
        role="group"
        aria-label="What gets built"
      >
        <div className="dr-w-face">
          <span className="t-label dr-w-k">The system behind it</span>
          <b>Four moving parts</b>
          <span className="t-meta">Site, tracking, reply, reporting</span>
        </div>

        <div className="dr-w-open">
          <span className="t-label dr-w-k">The system behind it</span>
          <ul className="dr-w-parts">
            {PARTS.map(([name, line]) => (
              <li key={name}>
                <b>{name}</b>
                <span className="t-meta">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
