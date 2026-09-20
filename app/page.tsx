"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ServicesSection, { OfferHead } from "@/components/dark/services-section";
import WorkSection from "@/components/dark/work-section";
import VoicesSection from "@/components/dark/voices-section";
import RunsSection from "@/components/dark/runs-section";
import ObjectionsSection from "@/components/dark/objections-section";
import { Monogram } from "@/components/ui/monogram";
import { CustomEase } from "gsap/CustomEase";
import { gsap, reducedMotion } from "@/components/anim/ease";
import { GOOGLE_REVIEWS, NEXT_START } from "@/lib/proof";
import { pickGreeting, replyLine, type Greeting } from "@/lib/greeting";


/* THE DAY LINE'S OWN DEFAULT (page.tsx, not lib/greeting.ts): the door
   before the visitor's clock has been read at all — the SAME "See your
   price" → /pricing#estimate the room has opened with since 2026-09-18,
   though TRIAL B (hero/snows) retires the door from the hero itself; the
   value stays on `greeting` for when the trial reverts. The line itself
   starts empty: the server renders nothing (Huge's mechanism reads the
   visitor's OWN day, not the build's) — col 3 of the meta row is what
   anchors that row's height meanwhile, so col 1 mounting never jumps it. */
const DEFAULT_GREETING: Greeting = {
  line: "",
  door: { label: "See your price", href: "/pricing#estimate" },
};

/* The room runs its own two curves — the same two the stylesheet declares,
   registered here so JS and CSS can never drift apart. Nothing in this room
   is allowed a third curve. */
const S = "dr-structure";
const U = "dr-ui";
CustomEase.create(S, "M0,0 C0.25,1 0.5,1 1,1"); //   --ease-structure
CustomEase.create(U, "M0,0 C0.16,1 0.3,1 1,1"); //   --ease-ui




/* THE LIVE TILE'S LEFT HALF (2026-09-20, THE LIVE TILE — Jake: "still
   feel theres something a little more we could do with the right
   side" → option 1: the mark's box widens into a wide tile, gets a
   job). Real, ticking information beside the mark: the Phoenix clock
   (the visitor's own clock in our time zone, ticking every second),
   the reply line (lib/greeting.ts replyLine(), the same day logic as
   the greeting above), and the honest capacity line (NEXT_START,
   lib/proof.ts — only while Jake has set a real one). Client-only, on
   purpose, same reasoning as the day line: the server renders nothing
   for the clock (Phoenix time is the visitor's clock, not the build's)
   and the two-line layout already reserves the height, so there is no
   jump when the first tick lands. */
function LiveTile() {
  const [time, setTime] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Phoenix",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => {
      const now = new Date();
      setTime(fmt.format(now));
      setReply(replyLine(now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="dr-tile-live">
      <span className="dr-tile-clock">
        PHOENIX <time>{time ?? " "}</time>
      </span>
      <span className="dr-tile-reply">{reply ?? " "}</span>
      {NEXT_START && (
        <span className="dr-tile-next">ONE BUILD AT A TIME · NEXT START {NEXT_START}</span>
      )}
    </div>
  );
}

/* §01 · COLD OPEN — "The Dark Room"
   Job: state the offer, the geography and the promise in three seconds;
   prove craft with one lit object; hand off two doors at different
   commitment levels. ~78% untouched black, six text objects. */

export default function DarkRoom() {
  /* The frame — tokens, ground, nav, ending, the scroll engine, the
     entrance arm and the ?dark switch — is the layout's
     RoomShell now. This page is the room's own atmosphere and sections. */

  /* THE DAY LINE AND THE RETURN (Huge's, decodes/hugeinc.md §3; the
     tables and the pickers live in lib/greeting.ts). Client-only, on
     purpose: rendering the day server-side would be the BUILD's clock,
     not the visitor's, so the line starts empty and is filled the
     moment this mounts — one localStorage read, capped at 9 so the
     counter never becomes a number the copy has no line for. Wrapped in
     try/catch: a visitor with storage blocked (private mode, a strict
     cookie policy) still gets the first-visit day line, just every time. */
  const [greeting, setGreeting] = useState<Greeting>(DEFAULT_GREETING);
  useEffect(() => {
    let visits = 1;
    try {
      const raw = window.localStorage.getItem("eas:visits");
      const prev = raw ? parseInt(raw, 10) : 0;
      visits = Math.min((Number.isFinite(prev) ? prev : 0) + 1, 9);
      window.localStorage.setItem("eas:visits", String(visits));
    } catch {
      /* storage unavailable — the day line still stands, every visit */
    }
    setGreeting(pickGreeting(visits, new Date()));
  }, []);

  /* THE WORD IS THE SCREEN (2026-09-19, TRIAL B — hero/snows,
     danielsnows.framer.website: "SNOWS" set to the full width of the
     screen, measured on theirs at 365px). Archivo wdth 100/wght 600 does
     not scale by one fixed ratio the way the condensed caps line did
     (glyphs of very uneven width), so the size is MEASURED, not guessed:
     a canvas context is given the h1's own resolved weight/family and
     "Welcome"'s ADVANCE width (m.width, matching a live Range's own
     getBoundingClientRect() — see below) is read at 100px; --welcome-fs
     is the column's own width scaled by that ratio. Canvas's own
     `letterSpacing` (Chrome 99+) carries the same -0.07em the CSS
     declares so the two numbers can never disagree.

     ⚠ TWO THINGS MEASURED, NOT GUESSED, BOTH CONTRADICTING THE SPEC'S OWN
     NUMBERS: (1) getComputedStyle(h1).fontWeight reads the CSS
     `font-weight` property, NOT the `font-variation-settings` "wght"
     axis — with font-weight left unset the canvas measured a THINNER
     400-weight "Welcome" than the 600 actually painted (confirmed
     against a real DOM Range measurement of the live h1); filling the
     1330px column at 1440 measures ≈350px either way, not the spec's
     "≈300", and its "cap at 17.8rem" (284.8px) would leave the ink
     ~250px short of the column's right edge — dropped, corroborated by
     the reference itself (Snows' own "SNOWS" is 365px at 1440, the same
     order of magnitude). (2) `actualBoundingBoxLeft/Right` (the ink's
     true pixel extent) measured "Welcome"'s trailing 'e' overshoot as
     ~2px wider than its ADVANCE box — compounded to a 6-7px shortfall
     at hero scale against the column, because a Range's own
     getBoundingClientRect() (used to verify this) follows the advance
     model, not ink pixels; switched to `m.width` so the two agree by
     construction. And the spec's 96px FLOOR overshoots its OWN "~90px
     at 390" expectation (the unfloored formula already lands at ~90 —
     confirmed live) by enough to push the ink past the phone column's
     gutter; lowered to 64px, a true safety floor for a viewport
     narrower than any this room supports, not a value meant to bind at
     390. See decisions.md for the full note on both. */
  useEffect(() => {
    const h1 = document.querySelector<HTMLElement>(".dr-welcome");
    if (!h1) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const measureWord = () => {
      if (!ctx) return;
      const cs = getComputedStyle(h1); // font-weight: 600 is declared alongside the axis (room.css) so this reads true
      const SIZE = 100;
      ctx.font = `${cs.fontWeight} ${SIZE}px ${cs.fontFamily}`;
      if ("letterSpacing" in ctx) {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-0.07 * SIZE}px`;
      }
      /* the ADVANCE width (m.width), not actualBoundingBox: a Range over
         the live text (used to verify this, and how a screenshot crop
         reads it) measures the same advance-based box a browser lays
         text out with — actualBoundingBox instead measured "Welcome"'s
         trailing overshoot (the 'e') as ~2px wider, which compounded to
         a 6-7px shortfall against the column at hero scale. */
      const m = ctx.measureText("Welcome");
      const inkW = m.width;
      const colW = h1.offsetWidth;
      if (!inkW || !colW) return;
      // 64px floor (a true safety net, not the spec's 96 — see the note
      // above); no meaningful ceiling short of an absurd viewport — 900px
      // is well past what 2560's own capped column (~1632px) ever needs
      // .992: the last e overshoots its advance by ~.8% of the size; aiming
      // a hair inside the column keeps its ink off the column's edge
      const fs = Math.max(64, Math.min((colW / inkW) * SIZE * 0.992, 900));
      h1.style.setProperty("--welcome-fs", `${fs}px`);
    };
    measureWord();
    document.fonts?.ready.then(measureWord);
    const ro = new ResizeObserver(measureWord);
    ro.observe(h1);
    window.addEventListener("resize", measureWord);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureWord);
    };
  }, []);
  /* PARALLAX — the LIGHT only. The mark holds still: it is the object in the
     room, and an object that slides with your cursor stops reading as one.
     Pointer only; on touch there is nothing to answer and the ambient drift
     already carries it. */
  useEffect(() => {
    const atmos = document.querySelector<HTMLElement>(".dr-atmos");
    if (
      !atmos ||
      reducedMotion() ||
      !window.matchMedia("(hover: hover)").matches
    )
      return;
    const ax = gsap.quickTo(atmos, "x", { duration: 1.2, ease: U });
    const ay = gsap.quickTo(atmos, "y", { duration: 1.2, ease: U });
    const onMove = (e: PointerEvent) => {
      ax((e.clientX / window.innerWidth - 0.5) * 78);
      ay((e.clientY / window.innerHeight - 0.5) * 46);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    /* THE WALL RISES ON SCROLL, at a tenth of the page's rate. It is a fixed
       layer, so without this it sits dead still while everything moves past
       it; a slow climb is what makes it read as depth rather than wallpaper.
       Capped so it never drifts out of frame on a long page. */
    const wall = document.querySelector<HTMLElement>(".dr-wall");
    /* THE HERO DIMS AS IT LEAVES. It used to shrink and lag as well —
       copied wholesale off a reference where the hero is a photograph.
       On type that read as a zoom rather than as depth, and it made §02
       feel like it arrived too fast, because the hero was running away
       from it. Only the dim survives, which was the honest half: a thing
       moving away from the light gets darker.

       That progress now comes from the engine — .dr-stage declares the
       window and --hero-p inherits down to everything in the hero. The
       WALL stays hand-rolled here, and deliberately: it is a FIXED layer,
       so its rect never moves and there is no element progress to measure.
       Its input is absolute scroll, which is a genuinely different thing
       from "how far through its own box has this element travelled". */
    let frame = 0;
    const onScroll = () => {
      if (frame || !wall) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = Math.min(window.scrollY * 0.1, window.innerHeight * 0.42);
        wall.style.transform = `translate3d(0, ${-y}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf(atmos);
      gsap.set(atmos, { clearProps: "transform" });
    };
  }, []);

  /* THE MARK'S OWN HEIGHT — measured, not left to a CSS calc against the
     grid row's stretched size (see room.css: that path left a real,
     if small, mismatch between the "auto" column's reserved width and
     the aspect-ratio box's own rendered one — enough to trip the ±1px
     right-edge check at 1440x900 though not at 736). Read the day
     line's own top and the door's own bottom directly, the same
     getBoundingClientRect this file already trusts for the slot and
     the dock, and hand the exact span to `.dr-hero-band` as one number. */
  useEffect(() => {
    const band = document.querySelector<HTMLElement>(".dr-hero-band");
    const meta = document.querySelector<HTMLElement>(".dr-meta");
    const door = document.querySelector<HTMLElement>(".dr-hero-door");
    if (!band || !meta || !door) return;
    const measure = () => {
      const h = door.getBoundingClientRect().bottom - meta.getBoundingClientRect().top;
      if (h > 0) band.style.setProperty("--hero-band-h", `${h}px`);
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(meta);
    ro.observe(door);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* THE LEAN (2026-09-20, THE LIVING MARK; RETARGETED same day by THE
     LIVE TILE — the box widened into a wide tile carrying real copy, so
     the lean now moves the MARK ONLY, not the whole tile: leaning a
     paragraph of live copy toward the cursor would read as a bug, not
     a bee. Jake: "some little greeting character that waves inside like
     a gray box ... to the right of welcome" → the EA mark, not a
     character; Lando's bee idles toward the pointer). Desktop only — no
     pointer to lean toward on touch, and the breathe alone carries
     "alive" there. --lx/--ly are the pointer's offset from the MARK's
     OWN centre (.dr-hero-mark-m, the 72px icon — not .dr-hero-tile, the
     box around it), normalised against its own half-width/half-height
     so the mark's own corner reads exactly ±1 (matches the CSS's own
     6px cap), clamped so a pointer anywhere else in the hero can't
     overshoot it. The CSS does the smoothing (translate, 600ms) — this
     only ever writes the target. */
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".dr-hero");
    const mark = document.querySelector<HTMLElement>(".dr-hero-mark-m");
    if (
      !hero ||
      !mark ||
      reducedMotion() ||
      !window.matchMedia("(hover: hover)").matches
    )
      return;
    const clamp = (n: number) => Math.max(-1, Math.min(1, n));
    const onMove = (e: PointerEvent) => {
      const r = mark.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      mark.style.setProperty("--lx", String(clamp((e.clientX - cx) / (r.width / 2))));
      mark.style.setProperty("--ly", String(clamp((e.clientY - cy) / (r.height / 2))));
    };
    const onLeave = () => {
      mark.style.setProperty("--lx", "0");
      mark.style.setProperty("--ly", "0");
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* THE REEL'S REST TRANSFORM — measured, not guessed. The slot in the
     line and the reel in the dock are both laid out by the browser; this
     reads where each one IS and writes the three numbers that put the
     reel onto the slot: the scale that makes it the slot's height, and
     the x/y from its own centre to the slot's. The CSS does the rest
     (see THE GROW in room.css). Re-read on resize and whenever the slot
     changes size, which is whenever the headline reflows or its font
     arrives. The reel's box is read through offsetLeft/Top — its rect
     would include the very transform being computed. */
  useEffect(() => {
    const slot = document.querySelector<HTMLElement>(".dr-slot");
    const reel = document.querySelector<HTMLElement>(".dr-hero-reel");
    if (!slot || !reel) return;
    const measure = () => {
      if (!window.matchMedia("(min-width: 901px)").matches) {
        reel.removeAttribute("data-ready");
        reel.closest(".dr-hero-wrap")?.removeAttribute("data-ready");
        return;
      }
      /* ⚠ BOTH boxes through the offset chain, never getBoundingClientRect:
         the reel's rect includes the transform being computed, and the
         slot's includes the line's ENTRANCE transform — measured at mount
         the line is still 103% below its place, and the reel landed 93px
         under the slot for exactly that reason. Offsets ignore transforms. */
      const box = (el: HTMLElement) => {
        let x = 0, y = 0;
        for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) {
          x += e.offsetLeft; y += e.offsetTop;
        }
        return { x, y, w: el.offsetWidth, h: el.offsetHeight };
      };
      /* HOW MUCH FILM SHOWS ABOVE THE FOLD (Jake, on trial B: "i dont think
         the video reel has to come up so high, in the reference it
         doesnt"): danielsnows' video top sits at y 624 of 736 — 112px of
         it in the first screen. The slot's own top is the day line's
         bottom plus a gap, which at 736 put 256px of film on screen; the
         hero hands the stylesheet the day line's bottom (page px, the
         offset chain) and .dr-slot's margin grows so the slot's top lands
         at the fold less --slot-show. Written BEFORE the slot is boxed —
         the margin moves the slot, and the grow is measured off it. */
      // the LAST thing above the slot — the door when there is one
      const day =
        document.querySelector<HTMLElement>(".dr-hero-door") ??
        document.querySelector<HTMLElement>(".dr-meta");
      if (day) {
        const db = box(day);
        reel.closest<HTMLElement>(".dr-hero-wrap")?.style.setProperty("--day-b", `${db.y + db.h}px`);
      }
      const s = box(slot), r = box(reel);
      /* THE GROW IS AS LONG AS THE SLOT IS HIGH (2026-09-19): the film's
         top edge leaves at scroll's rate and reaches the top of the
         screen exactly when the page has scrolled the slot's own top —
         so the grow's distance is --t0, not a fixed 0.55vh (with the
         slot lowered to danielsnows' height above the fold, 0.55vh fell
         181px short and the film stopped growing with its top at 181).
         The wrapper's window is handed the same number in px. */
      const wrapEl = reel.closest<HTMLElement>(".dr-hero-wrap");
      wrapEl?.setAttribute("data-sp-to-px", String(-s.y));
      wrapEl?.style.setProperty("--grow", `${s.y}px`);
      if (!s.h || !r.h) return;
      /* THE WORD NO LONGER CROSSES THE FILM (TRIAL B — hero/snows,
         2026-09-19): the film's box is no longer read against the
         headline's, and no --cross-* is written — see the retired
         .dr-line--film in room.css's history. */
      /* on the DOCK, so the reel and its shade both inherit the same numbers.
         Three frames (see THE GROW in room.css): the slot at p 0 — the reel
         and the slot are the same column box now, so this is a translate
         — the viewport at p 1, which is 0.9vh of scroll down, and home. */
      const dock = reel.closest<HTMLElement>(".dr-dock") ?? reel;
      const vw = document.documentElement.clientWidth;
      dock.style.setProperty("--dx0", `${s.x + s.w / 2 - (r.x + r.w / 2)}px`);
      /* THE BOX IS WRITTEN IN THE VIEWPORT'S FRAME (room.css, .dr-dock):
         the slot's top and the letterbox's height give the two edges'
         laws, the reel's flow centre is what the translate is measured
         from, --sx1 is the mask's full width, --hr the letterbox over
         the 16:9 picture so the picture's scale can be derived */
      dock.style.setProperty("--t0", `${s.y}px`);
      dock.style.setProperty("--h", `${r.h}px`);
      dock.style.setProperty("--c0", `${r.y + r.h / 2}px`);
      dock.style.setProperty("--sx1", String(vw / r.w));
      dock.style.setProperty("--hr", String(r.h / (r.w * 9 / 16)));
      /* the shade sits on the reel's box; `top` cannot read the padding's
         width-based percentage, so it is handed the measured offset */
      dock.style.setProperty("--reel-y", `${reel.offsetTop}px`);
      reel.setAttribute("data-ready", "");
      reel.closest(".dr-hero-wrap")?.setAttribute("data-ready", "");

      /* THE CURTAIN's own ruler (room.css, .dr-say-stage): --say-pull
         pulls the stage's natural document position — right after the
         dock, ~1248px at 1440×736 — up to doc 0.55vh, the exact scroll
         position the reel above reaches full screen (--grow). Through the
         offset chain, never getBoundingClientRect: the dock's own rect is
         mid-transform once scrolled. A negative margin this size on the
         stage COLLAPSES WITH, rather than adds to, the dock's own small
         negative margin-bottom (CSS takes the more negative of two
         adjoining margins) — the dock's own offsetHeight is enough, and
         verified live rather than assumed. */
      const sayStage = document.querySelector<HTMLElement>(".dr-say-stage");
      if (sayStage) {
        const d = box(dock);
        // the grow's distance is the slot's top (s.y) now, not 0.55vh
        sayStage.style.setProperty("--say-pull", `${d.y + d.h - s.y}px`);
      }
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(slot);
    ro.observe(reel);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      <div className="dr-atmos" aria-hidden>
        <div className="dr-key" />
      </div>
      {/* massive, half off the left edge, barely there — the room's own wall.
          No contour: the shape is carried entirely by its material. The
          wrapper exists so scroll can move the wall while the wall keeps its
          own drift — both want `transform`, and one would overwrite the other. */}
      <div className="dr-wall" aria-hidden>
        <div className="dr-figure" />
      </div>
      <div className="dr-grain" aria-hidden />
      <div className="dr-vignette" aria-hidden />

      {/* §01 · THE LINE. Jake, 2026-09-13, with a HeartBloom landing
          (dribbble 27394246): "can we try this but instead of that image
          in the card its my showreel and we have the itsjay effect for
          the video grow. i want a 5 star review thing somewhere too and
          we would be the white background version of course."

          Then a day of it — the chip in the title, the big card, the
          drop cap — and, with the Hyperactive pizza shot (dribbble
          25319896: a headline across the top of a big picture, words
          ON it): "im thinking the video could be dimmed so you get the
          text on top of it and when you scroll it grows and undims."
          And, on the first cut of that (the film washed light, the
          room's wide face): "it doesnt really look like the reference."
          It did not: theirs is a dark picture with LIGHT writing on it,
          a huge condensed one-line headline, and the picture's top edge
          cutting through the letters. So: one condensed uppercase line
          the width of the measure; the film DIMMED DARK with light copy
(the sprayed tags were tried and cut — Jake:
          "i dont like the tags"); the headline
          white where it crosses the film (a clipped second copy of the
          line, never a blend). On scroll the reel grows
          out of the card into the dock and the scrim lifts with it. On scroll, itsjay's grow (decodes/itsjay.md
          §5.3, measured): the reel's real home is a full-width block in
          the section right after the hero; at rest it is transformed UP
          into the chip in the line (scale ~0.13, translated to its
          centre),
          and across the first 0.9 viewports of scroll it scales and
          travels LINEARLY back to where it lives — so it grows out of
          the hero, takes the screen, and docks. No
          pin: the words leave at scroll's own rate and fade as the reel
          takes over.

          Retires the stage (d5daaf3), the lift (9cd34bc), the shutter
          (da61f3c) and the screening (b7637cd) — all of today. Kept: the
          film is there from the first frame, the minimal caption, the
          rail's wordmark as the name.

          --hero-p is measured on the WRAPPER's top edge: 0 at rest, 1
          at 0.55vh of scroll — it was itsjay's 0.9 (Jake, 2026-09-17:
          "maybe it's just a lot of scrolling, not the effect"): the same
          grow over 40% less scroll, so the statement is at the top of
          the screen by ~1.5vh instead of 1.9. The wrapper holds the stage
          AND the dock so the reel inherits it in both. */}
      <div
        className="dr-hero-wrap dr-zone-dark"
        data-sp
        data-sp-edge="top"
        data-sp-from="0"
        data-sp-to="-0.55"
        data-sp-var="--hero-p"
      >
        {/* the rail (components/room/nav) watches this by selector: the
            pill and the action are what the first scroll earns */}
        <div className="dr-top" aria-hidden />
        {/* THE ROOM (2026-09-19): the hero is a DARK ZONE even in the
            light room (.dr-zone-dark, room.css) — a ::before paints
            #0b0b0b from here down to the film's own frozen post-grow
            bottom edge. This second sentinel marks that SAME edge in
            the flow, so the rail (components/room/nav) knows when it
            has scrolled past the dark ground and can flip its own
            chrome from dark to light. */}
        <div className="dr-ground-end" aria-hidden />

        <div className="dr-stage">
          <main className="dr-main wrap">
            <div className="dr-hero">
              {/* §01 · THE SNOWS HERO (TRIAL B — branch hero/snows, Jake:
                  "i wonder if we can find a layout like this make this
                  work somehow" → "build B the snows one").
                  danielsnows.framer.website, measured at 1440x736: the
                  one word "SNOWS" at the screen's full width (rect x 10,
                  w 1420 of 1440); under it three small meta columns on
                  hairlines; the video full width, its top just above the
                  fold. Ours keeps the hero we had — the film, the grow,
                  the curtain, the dark zone, the nav — with two changes:
                  the word becomes "Welcome" set to the column's full
                  width (see the measure effect above), and the strip
                  becomes the three-column meta row below. ONE READING,
                  ONE LINE: the hover swap and the film-clipped second
                  copy both retire with "Design that sells" — see
                  decisions.md. The rise (leoparpeix's, --ease-reveal,
                  300ms) is the only entrance the word keeps. */}
              <h1 className="dr-h1 dr-welcome">
                <span className="dr-line">
                  <span className="dr-read">Welcome</span>
                </span>
              </h1>

              {/* THE META ROW (danielsnows' three columns, on hairlines).
                  Retires THE STRIP below it in room.css (the faces, the
                  ticker, the door) — its CSS stays, dead, in case the
                  trial reverts; `.dr-hero-day` is gone outright, its job
                  folded into col 1. Col 1 is the day line (lib/greeting.ts),
                  split at its own first period — the day word as the
                  label, the rest underneath; col 2 is the rating
                  (GOOGLE_REVIEWS, hidden while count is 0), a link to the
                  profile; col 3 is the three services, static. THE DOOR
                  LEAVES THE HERO: the nav's "Book the call" is the
                  persistent action now; the estimator door ("See your
                  price") returns in the close/ledger later — noted, not
                  built here. Col 3 is always populated, so it is what
                  anchors the row's height before col 1's async day line
                  has mounted — no reserved min-height needed, no shift
                  when it pops in. */}
              {/* THE SECOND VOICE (Jake, on trial B's meta row: "i dont like
                  the area under the welcome" — three columns of 12px labels
                  between two giant things was the smallest text on the
                  page). Huge's hero exactly: the one word, then the day
                  line at the 43 rung, white, left, ONE line — nothing else
                  in the hero. The rating and the three services leave the
                  first screen (the nav carries the action; the rating
                  returns where proof lives). The row's element name stays
                  so the nav's sentinel and the fades keep their hook. */}
              {/* THE LIVING MARK (2026-09-20, decisions.md: Jake, "some
                  little greeting character that waves inside like a gray
                  box or something to the right of welcome" → agreed as
                  the EA MARK, not a character — Huge's plush H, Lando's
                  bee: a brand object doing one small living thing;
                  "i feel theres more we can do with the section under
                  welcome"). The day line and the door move into their own
                  column, `.dr-hero-say` — same elements, same classes,
                  same margins and entrance rules as before this step —
                  so a second column, the mark's square, can sit beside
                  them on the band's right edge without touching either.
                  THE LIVE TILE (same day, Jake: "still feel theres
                  something a little more we could do with the right
                  side" → option 1): that square is now a wide tile, the
                  band's right HALF (`minmax(0,1fr) minmax(0,1fr)` below),
                  carrying real ticking information — see LiveTile above. */}
              <div className="dr-hero-band">
                <div className="dr-hero-say">
                  {/* THE DAY WORD IN THE ACCENT: the line's first word ("Weekend." ·
                      "Monday." · "Back again.") is the cyan — its first use as a
                      LETTER, on the black, the ground the accent decision gave
                      it (Huge's rotating word is their accent's text use; ours
                      in the hero is the day). The rest stays white. */}
                  <p className="dr-meta dr-hero-day">
                    {(() => {
                      const i = greeting.line.indexOf(". ");
                      if (i === -1) return greeting.line;
                      return (
                        <>
                          <span className="dr-day-word">{greeting.line.slice(0, i + 1)}</span>
                          {greeting.line.slice(i + 1)}
                        </>
                      );
                    })()}
                  </p>
                  {/* THE DOOR, back in the hero (Jake, on the band the lower film
                      opened under the day line: "now how can we use that
                      space"): the one action, cyan on the black (the accent's
                      home ground), ink type — the estimator, or the call from
                      the third visit (lib/greeting.ts). The last thing to
                      arrive in the entrance. */}
                  <Link href={greeting.door.href} className="dr-herocta dr-hero-door t-cta">
                    {greeting.door.label}
                  </Link>
                </div>

                {/* THE TILE (2026-09-20, THE LIVE TILE): the mark's old
                    square is now a wide tile — exactly the band's own
                    height (the day line's own top to the door's own
                    bottom, room.css), the frame's radius, same background
                    — split in two by its own grid: LiveTile's real,
                    ticking copy on the left, the EA mark large (72px) on
                    the right. The mark still waves once on load, still
                    breathes (now the tile breathes with it), and still
                    leans toward the cursor — the LEAN moves the mark
                    ONLY now, not the whole tile (see the lean effect
                    above). Links to /work. Hidden on the phone (room.css)
                    — a wide dark tile with live copy is still a desktop
                    object; the first screen there has no room for it. */}
                <Link href="/work" className="dr-hero-tile" aria-label="Recent work">
                  <LiveTile />
                  <Monogram className="dr-hero-mark-m" />
                </Link>
              </div>

              {/* THE CARD — the reel's rest position: full width, its top
                  in the first screen and its bottom past the fold, the way
                  Cosmos's video sits low. Undimmed from the first frame;
                  nothing on it. The reel lives in the dock and is measured
                  onto this box. */}
              <div className="dr-slot" aria-hidden />
            </div>
          </main>
        </div>

        {/* THE DOCK — where the reel actually lives: a full-width block
            right after the hero, 16:9 at the room's gutter, radius
            --radius-panel. At rest it is transformed up into the slot;
            by 0.9vh of scroll it is here, and the page carries on. */}
        {/* GROW, THEN LEAVE (Jake, 2026-09-15, with Snows' plain hero
            video: "do you think the video effect is too much" → A). The
            hold and the shrink-in-place are gone — they were a pin in
            everything but name, 0.45vh of film choreography between the
            scroll and the first sentence. Now the reel is the whole screen
            at 0.9vh and simply scrolls off, full width; the offer's head
            follows it directly (see --dock-pad in room.css). No window on
            the dock any more: --p is the only number. */}
        <section className="dr-dock" aria-label="Showreel">
          {/* THE SHADE: the reel's shadow, on a sibling. The reel's own
              radius is recomputed every frame (divided by the scale), and
              a shadow on a changing radius re-rasters the whole layer per
              frame; this box and its 24px radius are constant, so it
              paints once and only transforms — the same numbers, under
              the reel. */}
          <div className="dr-hero-shade" aria-hidden />
          <div className="dr-hero-reel">
            {/* ⚠ 1920, not 1280: docked, the well is 1394 wide and a
                1280 source is soft in it. Six seconds (t=4.3-10.4, the
                dark half of the source), 30fps, crf 23, 885KB. Jake is
                having a longer reel cut ON BLACK to
                design-dna/reel-spec.md; it drops in here with its
                poster and nothing else changes. Until it lands, the v1
                cut's own baked-in type is in the frame. */}
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/dark/reel-film-poster.jpg"
              preload="auto"
              aria-label="Recent Executive AI Solutions client work"
            >
              <source src="/dark/reel-film.mp4" type="video/mp4" />
            </video>
          </div>
        </section>
      </div>

      {/* No numbers band. It was tried (acquisition.com's stats row, done
          as receipts with a window and a source each — 2026-09-13/14) and
          cut: our honest figures need their captions to mean anything,
          and a number that needs a caption is a report, not proof (Jake:
          "people are way too lazy to read these days … if you need them
          to grasp something big you almost have to show them with
          visuals"). The receipts live on in lib/proof.ts for the pages
          where they are context, not a headline. */}

      {/* §02 · THE OFFER — the statement and the three services under it
          (Jake, 2026-09-14, with danielsnows.framer.website: "a centered
          approach thing like this and then just having services
          underneath" → "go"). The statement is the positioning sentence
          Cosmos and itsjay both put after their hero (measured: "WE ARE —
          UI/UX design agency that keeps your product growing"; Cosmos's
          actual About Us is section five) — what, for whom, how — and it
          is what stands between the reel and the work cards so they do
          not read as a repeat. Ours names the three columns under it.

          The head sits OUTSIDE the card's wrapper: --climb is measured on
          the wrapper's top, which has to be the card's own top.

          THE CURTAIN (2026-09-19, decisions.md: Jake, "this section isnt
          dramatic enough" → "go on the curtain"). The head is now PINNED
          UNDER THE FILM: `.dr-say-stage` is pulled up by --say-pull (page
          px, measured below) so its top sits at doc 0.55vh — the exact
          scroll position the reel reaches full screen (--grow, room.css).
          `.dr-say-pin` then holds it centred on screen while --cur runs
          0→1 as the film leaves at scroll's own rate (data-sp-to="-1" is
          one viewport of travel, matching the reel's 1:1 exit), then for
          --say-hold beyond that — a hold with the words alone. This is
          NOT the 2026-09-06 curtain that was reverted: that one uncovered
          a NEW light-room plate; this uncovers the statement in the
          room's own ground and ink (--void/--ink), already sitting there
          — no new surface. The kicker/h2 wipe (data-wipe) comes OFF
          entirely (services-section.tsx has the why: a wipe timed to an
          element nearing the fold fires while the film still covers it,
          and the engine's own split/undo cycle did not survive being
          inside the sticky pin on either width) — THE SETTLE below is
          the only reveal now, phone included. */}
      <div
        className="dr-say-stage"
        data-sp
        data-sp-edge="top"
        data-sp-from="0"
        data-sp-to="-1"
        data-sp-var="--cur"
      >
        {/* the pin's own approach, for the gate that keeps the words
            invisible until the film is the screen (room.css) */}
        <div
          className="dr-say-pin"
          data-sp
          data-sp-from="1"
          data-sp-to="0"
          data-sp-var="--pre"
        >
          <OfferHead />
        </div>
      </div>

      {/* §02 comes out of the wrapper and brings its own ruler. Inside it,
          it read --hero-p — the hero's progress — and its
          grow-into-the-room was tied to the hero's geometry by accident
          of nesting rather than on purpose. Measured on ITSELF the number
          finally means what §02's own comment always claimed: 0 with the
          card's top at the fold, 1 with it at the top of the viewport.
          Renamed --climb, because a variable that means two different
          things in two subtrees is a trap waiting for whoever reads it
          next.

          THE COVER (2026-09-19, built and removed the same day — Jake:
          "services shouldnt rise like that"): the card is no longer
          pulled up over the pinned words; it follows the stage in flow. */}
      <div
        className="dr-climb-wrap"
        data-sp
        data-sp-from="1"
        data-sp-to="0"
        data-sp-var="--climb"
      >
        <ServicesSection />
      </div>

      <WorkSection />
      <VoicesSection />

      {/* ══ THE FLIP ══════════════════════════════════════════════════
          The room turns inside out between the testimonials and the
          process (Jake, 2026-09-07: "i want the whole background to go
          from black to white and the white aspects to go to black like
          completely flip").

          ⚠ SUPERSEDES the standing "never a light room mid-page" call
          (decisions.md, 2026-09-06) — that one was made against a light
          §04 revealed by a curtain lift, and it was the whole treatment
          he rejected on sight. This is the opposite instruction, given
          knowingly, so it wins; the old entry stays on the record.

          ONE ELEMENT OWNS THE GROUND. Every bg track writes its target
          every frame, clamped — so a track resting at progress 0 paints
          its `from` colour over everything above it, and two of them
          means the lower one wins the whole page. §04 and §05 both gave
          theirs up for this.

          The same track writes --flip, and the token block below re-mixes
          EVERY colour in the room against it — ink, surfaces, edges — so
          the inversion is one number and nothing can flip out of step
          with anything else. Its subtree is the back half, which is why
          the wrapper starts here and not at the top of the page. */}
      {/* ⚠ THE FLIP IS PARKED (Jake, 2026-09-08: "can we kill the
          background transition for now"). Nothing about it has been
          deleted — the wrapper, the token block on .dr-root, the crossed
          surfaces in the back half and the atmos/vignette factors are all
          still here and all still correct. What is gone is the TRACK: with
          no data-sp on this div the engine never writes --flip, every
          token falls through to its `var(--flip, 0)` default, and the room
          simply stays dark, which is exactly the page as it read before
          the flip was built.

          TO BRING IT BACK, put these eight attributes back on this div and
          change nothing else:

            data-sp data-sp-from="0.86" data-sp-to="0.3"
            data-sp-var="--flip" data-sp-target=".dr-root"
            data-sp-lerp="0.1" data-sp-step="0.03125"
            data-bg-from="void" data-bg-to="#f2f2f4"

          data-sp-target puts the value on the ROOT so the fixed light rig
          ABOVE this wrapper can read it — a var only inherits downward.
          data-sp-step is a measured perf requirement, not a preference:
          twelve color-mix tokens resolving a new colour every frame
          re-rasterise every glyph and surface on screen (2026-09-08 —
          mean 13.6ms a frame and 14 dropped, against 8.6 with --flip
          held still). Publishing at 1/32 costs nothing visible and buys
          all of it back. The GROUND deliberately does not step.

          ONE ELEMENT OWNS THE GROUND still holds, and matters more now
          than it did: §04 and §05 both gave up their own bg tracks so
          this one could have the page, so with this track gone the back
          half has NO ground ramp at all and sits on the void end to end.
          If the ending needs its lifted ground back before the flip is
          re-sited, that is §05's track to re-declare — not a second one
          here. */}
      <div className="dr-flip">
        <RunsSection />
        <ObjectionsSection />
      </div>
    </>
  );
}
