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
    /* THE SENTINEL ENDS WHERE THE STRIP ENDS (Jake, 2026-09-18: "i dont
       think the nav bar should come in with its animation until after the
       bar in the hero has disappeared"). The strip fades out by p .69 of
       the grow and its box leaves the top of the screen a beat later; the
       sentinel is sized to that box's bottom edge, through the offset
       chain (transforms ignored, same as the hero's own measure), so the
       rail's pill, lit edge and action arrive only once the hero's white
       bar is gone — on every viewport, the phone included, where the
       strip does not fade but simply scrolls off. The 19.8svh in the
       stylesheet is the no-JS fallback. */
    const strip = document.querySelector<HTMLElement>(".dr-strip");
    const wrap = top.offsetParent as HTMLElement | null;
    const docY = (el: HTMLElement) => {
      let y = 0;
      for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) y += e.offsetTop;
      return y;
    };
    const fit = () => {
      if (!strip || !wrap) return;
      top.style.height = `${docY(strip) + strip.offsetHeight - docY(wrap)}px`;
    };
    fit();
    const ro = strip && wrap ? new ResizeObserver(fit) : null;
    ro?.observe(wrap!);
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), {
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
      const isLightRoom = document.querySelector(".dr-root")?.classList.contains("dr-light");
      if (!isLightRoom) {
        setGround("dark");
        return;
      }
      const hem = rail.getBoundingClientRect().bottom;
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

          {/* THE LINKS SIT RIGHT (Jake, 2026-09-13: "lets move the nav
              stuff to the right instead of centered"): in the row, after
              the lockup, pushed to the far side, with the action after
              them once it has opened. They used to float centred over
              the rail as an absolute box. */}
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
