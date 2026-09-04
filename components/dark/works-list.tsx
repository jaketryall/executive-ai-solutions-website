"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/* THE WORK CHAIN
   A card is a thumbnail, a name and one line of what we did. The thumbnail
   is not a still: it is the first frame of a real scroll-through of that
   client's live site, and it plays when the card takes focus.

   The hover is C10 (row ripple): the focal card opens real block padding
   and the list REFLOWS around it. It does not translate its neighbours —
   that reads as the content backing away from your cursor. Displacement
   runs one way down the document instead, so the list makes room like a
   drawer. Falloff is one neighbour deep; deeper reads wobbly. */

type Row = {
  slug: string;
  client: string;
  line: string;
  clip?: string;
  poster?: string;
};

const ROWS: Row[] = [
  {
    slug: "desert-wings",
    client: "Desert Wings",
    line: "Website, Google Ads and SEO for a career-pilot school at Falcon Field.",
    clip: "/work/clips/desert-wings.mp4",
    poster: "/work/clips/desert-wings.jpg",
  },
  {
    slug: "aahg",
    client: "Arizona Aviation Historical Group",
    line: "Website and public archive for a Mesa aviation nonprofit.",
    clip: "/work/clips/aahg.mp4",
    poster: "/work/clips/aahg.jpg",
  },
  {
    slug: "riled-up",
    client: "Riled Up Pickleball",
    line: "Website and booking system for a Valley coaching brand.",
    clip: "/work/clips/riled-up.mp4",
    poster: "/work/clips/riled-up.jpg",
  },
];

export default function WorksList() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // a hover rig is a no-op on touch, and the reflow is motion
    if (
      !window.matchMedia("(hover: hover)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const rows = Array.from(list.querySelectorAll<HTMLElement>(".dr-wk"));
    const offs: (() => void)[] = [];

    rows.forEach((row, i) => {
      const onEnter = () => {
        rows.forEach((r, j) => {
          const d = Math.abs(j - i);
          // REFLOW: the list opens room. Never translate the neighbours.
          r.style.paddingBlock = d === 0 ? "20px" : d === 1 ? "14px" : "9px";
          r.classList.toggle("is-focal", j === i);
          const v = r.querySelector("video");
          if (!v) return;
          if (j === i) {
            void v.play().catch(() => {});
          } else {
            v.pause();
            v.currentTime = 0;
          }
        });
      };
      row.addEventListener("mouseenter", onEnter);
      offs.push(() => row.removeEventListener("mouseenter", onEnter));
    });

    const onLeave = () => {
      rows.forEach((r) => {
        r.style.paddingBlock = "";
        r.classList.remove("is-focal");
        const v = r.querySelector("video");
        if (v) {
          v.pause();
          v.currentTime = 0;
        }
      });
    };
    list.addEventListener("mouseleave", onLeave);

    return () => {
      offs.forEach((f) => f());
      list.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="dr-works" ref={listRef}>
      {ROWS.map((r) => (
        <Link key={r.slug} href={`/work/${r.slug}`} className="dr-wk dr-edge">
          <span className="dr-wk-thumb">
            <video
              muted
              loop
              playsInline
              preload="none"
              poster={r.poster}
              aria-hidden
            >
              <source src={r.clip} type="video/mp4" />
            </video>
          </span>
          <span className="dr-wk-body">
            <span className="dr-wk-top">
              <b>{r.client}</b>
              <i className="dr-wk-arrow" aria-hidden>
                →
              </i>
            </span>
            <span className="t-meta">{r.line}</span>
          </span>
        </Link>
      ))}

      {/* the roster's open slot — a CTA, never dressed up as a project */}
      <Link href="/contact" className="dr-wk dr-wk-open dr-edge">
        <span className="dr-wk-thumb dr-wk-thumb-open" aria-hidden />
        <span className="dr-wk-body">
          <span className="dr-wk-top">
            <b>Your business</b>
            <i className="dr-wk-arrow" aria-hidden>
              →
            </i>
          </span>
          <span className="t-meta">
            The next name on this list. Book the call.
          </span>
        </span>
      </Link>
    </div>
  );
}
