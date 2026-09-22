"use client";

import Link from "next/link";
import { CLIENT_MARKS, GOOGLE_REVIEWS } from "@/lib/proof";
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
  const [ground, setGround] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const top = document.querySelector<HTMLElement>(".dr-top");
    if (!top) {
      setStuck(true);
      /* no hero, no dark zone: an interior page opens on its own
         content, in the light room's own chrome */
      setGround("light");
      return;
    }
    /* THE SENTINEL ENDS WHERE THE META ROW ENDS (Jake, 2026-09-18: "i dont
       think the nav bar should come in with its animation until after the
       bar in the hero has disappeared" — the strip, then the meta row,
       then the card, then (mid-trial) the title alone — final settle,
       same day: the DOOR again, back to being its own pill under the
       title and the day line, the hero's true last thing). The row fades
       out by p .69 of the grow and its box leaves the top of the screen
       a beat later; the sentinel is sized to that box's bottom edge,
       through the offset chain (transforms ignored, same as the hero's
       own measure), so the rail's pill, lit edge and action arrive only
       once the hero's white bar is gone — on every viewport, the phone
       included, where the row does not fade but simply scrolls off. The
       19.8svh in the stylesheet is the no-JS fallback. */
    // the sentinel ends at the DOOR when one exists (every shape this
    // hero has had, current and past), else the CARD, else the TITLE
    // alone, else the old day line — first match wins
    const metaRow =
      document.querySelector<HTMLElement>(".dr-hero-door") ??
      document.querySelector<HTMLElement>(".dr-hero-band") ??
      document.querySelector<HTMLElement>(".dr-greet") ??
      document.querySelector<HTMLElement>(".dr-meta");
    const wrap = top.offsetParent as HTMLElement | null;
    const docY = (el: HTMLElement) => {
      let y = 0;
      for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) y += e.offsetTop;
      return y;
    };
    const fit = () => {
      if (!metaRow || !wrap) return;
      top.style.height = `${docY(metaRow) + metaRow.offsetHeight - docY(wrap)}px`;
    };
    fit();
    const ro = metaRow && wrap ? new ResizeObserver(fit) : null;
    ro?.observe(wrap!);
    /* `?v=navstrip` (trial, 2026-09-21 — Jake: "move it up to where the
       nav is and combine it with the nav"): the hero's strip lives HERE
       — the proof after the mark, the one door at the end — so the rail
       is the pill from the first frame, not something the first scroll
       earns. */
    /* (`navc` was in this list for an hour — Jake: "i dont want the pill
       in by default i do like it centered tho" — so the centred rail is
       the quiet cluster at rest and the pill on the first scroll, like
       the wide one was.) */
    const always = !!document.querySelector('.dr-hero-wrap[data-v~="navstrip"], .dr-hero-wrap[data-v~="navpill"]');
    if (always) setStuck(true);
    const io = new IntersectionObserver(([e]) => setStuck(always || !e.isIntersecting), {
      threshold: 0,
    });
    io.observe(top);
    return () => {
      io.disconnect();
      ro?.disconnect();
      top.style.removeProperty("height");
    };
  }, []);

  /* THE RAIL IS THE HERO COLUMN'S WIDTH (Jake, 2026-09-13: "nav items
     need to be aligned with titles"). The hero column is the measure OR
     what the height allows, whichever is less (room.css, .dr-hero) — on
     a 736-tall screen it is ~82% and centred — and the rail has to be
     the same width so the wordmark sits on the title's left edge and
     the last link on its right, whatever the screen makes that. Read
     off the column itself, so the two cannot drift; interior pages have
     no hero and the rail keeps its full width. */
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".dr-hero");
    const rail = document.querySelector<HTMLElement>(".dr-rail");
    if (!hero || !rail) return;
    const fit = () => rail.style.setProperty("--rail-w", `${hero.offsetWidth}px`);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(hero);
    return () => {
      ro.disconnect();
      rail.style.removeProperty("--rail-w");
    };
  }, []);

  /* THE GROUND FLIPS WITH THE FILM (2026-09-19, THE ROOM: white page,
     black hero). `.dr-ground-end` (page.tsx) marks the film's own frozen
     post-grow bottom edge — well past `.dr-top`, which only marks the
     strip. While that edge sits below the rail's own hem the rail is
     over the dark zone (dark chrome); once it has scrolled above the
     hem the rail is over the light page (light chrome).

     A plain position compare on scroll, not a single IntersectionObserver
     threshold: `.dr-ground-end` is a 1px line, and a rootMargin shrunk to
     the hem gives isIntersecting the SAME false reading whether the line
     is still off the bottom of the screen (page just loaded — should
     read dark) or has already passed above the hem (should read light).
     Reading its rect against the rail's own rect has no such ambiguity,
     and it costs one comparison of two already-cheap
     getBoundingClientRect calls, rAF-batched like the hero's own wall
     drift (app/page.tsx).

     ⚠ ONLY IN THE LIGHT ROOM. `.dr-ground-end` sits at the same document
     position regardless of which room is active, but in `?dark` there is
     no light page below it to flip INTO — the whole route is the dark
     room end to end, and a real bug here (caught live) flipped the rail
     to the light-chrome colours once scrolled past the sentinel even in
     `?dark`. Re-checked on every call, not just at mount: shell.tsx's own
     `?dark` effect and this one both run on mount, in undefined order
     across components, so trusting a single read at mount could race it. */
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>(".dr-rail");
    const groundEnd = document.querySelector<HTMLElement>(".dr-ground-end");
    if (!rail || !groundEnd) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const root = document.querySelector<HTMLElement>(".dr-root");
      const isLightRoom = root?.classList.contains("dr-light");
      /* `?v=paper` (trial, 2026-09-21): the dark page turns light INSIDE
         the work rail and dark again at the close (room.css "PAPER") —
         the root's --flip is the only truth here, the hero's sentinel
         says nothing about it */
      const paper = !!document.querySelector('.dr-hero-wrap[data-v~="paper"]');
      /* `?v=lm`: the whole page on the light tokens, hero included — light chrome, full stop */
      if (document.querySelector('.dr-hero-wrap[data-v~="lm"]')) {
        setGround("light");
        return;
      }
      if (!isLightRoom && !paper) {
        setGround("dark");
        return;
      }
      const hem = rail.getBoundingClientRect().bottom;
      /* THE PAGE ITSELF CAN BE DARK (2026-09-20, the scroll-driven flip
         before the work, hero-room.tsx): the root's --flip is the ground's
         truth — under .5 the page is on its dark side and the chrome
         follows it, wherever the hero's own sentinel is */
      const flip = root ? parseFloat(getComputedStyle(root).getPropertyValue("--flip")) : 1;
      if (Number.isFinite(flip) && flip < 0.5) {
        setGround("dark");
        return;
      }
      if (paper) {
        setGround("light");
        return;
      }
      setGround(groundEnd.getBoundingClientRect().top < hem ? "light" : "dark");
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="dr-nav wrap">
      <div className="dr-rail dr-edge" data-stuck={stuck ? "true" : undefined} data-ground={ground}>
        <div className="dr-rail-in">
          <Link className="dr-lockup" href="/">
            <span className="dr-mono" aria-hidden />
            <b>Executive AI Solutions</b>
          </Link>

          {/* THE PROOF IN THE RAIL (`?v=navstrip`, hidden otherwise —
              room.css): the strip's faces and rating, after the mark.
              Rendered on every route so the first paint has it; the
              token decides whether it shows. */}
          {GOOGLE_REVIEWS.count > 0 && (
            <a
              className="dr-nav-proof"
              href={GOOGLE_REVIEWS.url || undefined}
              target={GOOGLE_REVIEWS.url ? "_blank" : undefined}
              rel={GOOGLE_REVIEWS.url ? "noopener noreferrer" : undefined}
              aria-label={`Rated ${GOOGLE_REVIEWS.rating.toFixed(1)} on Google from ${GOOGLE_REVIEWS.count} reviews`}
            >
              <span className="dr-faces" aria-hidden>
                {CLIENT_MARKS.map((c) => (
                  <span className="dr-face" key={c.initials} title={c.name}>
                    {c.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.src} alt="" />
                    ) : (
                      c.initials
                    )}
                  </span>
                ))}
              </span>
              <span className="dr-nav-proof-l">
                <b>{GOOGLE_REVIEWS.rating.toFixed(1)} on Google</b>
                <span>{GOOGLE_REVIEWS.count} reviews</span>
              </span>
            </a>
          )}

          {/* THE LINKS SIT RIGHT (Jake, 2026-09-13: "lets move the nav
              stuff to the right instead of centered"): in the row, after
              the lockup, pushed to the far side, with the action after
              them once it has opened. They used to float centred over
              the rail as an absolute box. */}
          {/* two groups, one nav for readers (`?v=logoc`, room.css: the
              mark goes to the centre of the rail with Work · Services on
              its left and Pricing · Ask on its right — a 1fr auto 1fr
              grid, so the mark is the rail's centre whatever the sides
              weigh; the call joins the right group. Every other layout
              sees one row, as before.) */}
          <nav className="dr-links dr-links--l" aria-label="Main">
            <Link href="/work" aria-label="Work">
              <Roll label="Work" />
            </Link>
            <Link href="/services/websites" aria-label="Services">
              <Roll label="Services" />
            </Link>
          </nav>
          <div className="dr-rail-r">
          <nav className="dr-links dr-links--r" aria-label="More">
            <Link href="/pricing" aria-label="Pricing">
              <Roll label="Pricing" />
            </Link>
            {/* ASK (`?v=ask`, hidden otherwise — room.css): the ask-this-
                site chat's one entry, in the rail with the links — the
                search bar and the chat as one word (Jake: "put the ask
                in the pill i want to see it"). Opens the chat that is
                already mounted (site-chat.tsx, layout.tsx) through its
                own event; the panel drops from under the rail on this
                route (room.css). */}
            <a
              href="#ask"
              className="dr-ask"
              role="button"
              aria-label="Ask this site a question"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new Event("eas:chat-open"));
              }}
            >
              <Roll label="Ask" />
            </a>
          </nav>

          {/* collapsed at the top of the homepage, so it must not be
              reachable by keyboard or read out until it is really there */}
          <Link
            href="/contact"
            className="dr-navcta dr-navcta--call dr-edge t-cta"
            tabIndex={stuck ? undefined : -1}
            aria-hidden={!stuck}
          >
            Book the call
          </Link>
          {/* `?v=navstrip`: the hero's door is the rail's one action —
              the price, the cold visitor's door; the call stays in the
              close. Hidden unless the token is on (room.css). */}
          <Link
            href="/pricing#estimate"
            className="dr-navcta dr-navcta--price dr-edge t-cta"
            tabIndex={stuck ? undefined : -1}
            aria-hidden={!stuck}
          >
            See your price
          </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
