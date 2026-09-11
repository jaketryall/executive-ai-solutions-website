"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* THE ROOM'S NAV, as the site's nav.

   It was inline in the homepage and the interior pages ran the old
   chrome, so every link out of the room was a hard cut into a different
   site. Now it is the one header every page shares.

   THE RAIL STICKS when a sentinel (.dr-top, in the homepage hero) leaves
   the viewport. A page with no sentinel has no top-of-hero state to
   speak of, so on it the rail is stuck from the first frame — the pill,
   the lit edge and the action are simply there, which is what an
   interior page wants: it opens on content, not on a cold open. */

/* Per-character roll. Each letter is its own cell with a duplicate one
   line below and a delay keyed to its index, so the swap cascades across
   the word instead of the whole label flipping at once. The link keeps a
   real label for screen readers; the split is decoration. */
export function Roll({ label }: { label: string }) {
  return (
    <span className="dr-roll" aria-hidden>
      {label.split("").map((ch, i) => (
        <span
          key={i}
          className="dr-char"
          data-char={ch}
          style={{ "--i": i } as React.CSSProperties}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export function RoomNav() {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const top = document.querySelector<HTMLElement>(".dr-top");
    if (!top) {
      setStuck(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), {
      threshold: 0,
    });
    io.observe(top);
    return () => io.disconnect();
  }, []);

  return (
    <header className="dr-nav wrap">
      <div className="dr-rail dr-edge" data-stuck={stuck ? "true" : undefined}>
        <nav className="dr-links" aria-label="Main">
          <Link href="/work" aria-label="Work">
            <Roll label="Work" />
          </Link>
          <Link href="/services/websites" aria-label="Services">
            <Roll label="Services" />
          </Link>
          <Link href="/pricing" aria-label="Pricing">
            <Roll label="Pricing" />
          </Link>
        </nav>

        <div className="dr-rail-in">
          <Link className="dr-lockup" href="/">
            <span className="dr-mono" aria-hidden />
            <b>Executive AI Solutions</b>
          </Link>

          {/* collapsed at the top of the homepage, so it must not be
              reachable by keyboard or read out until it is really there */}
          <Link
            href="/contact"
            className="dr-navcta dr-edge t-cta"
            tabIndex={stuck ? undefined : -1}
            aria-hidden={!stuck}
          >
            Book the call
          </Link>
        </div>
      </div>
    </header>
  );
}
