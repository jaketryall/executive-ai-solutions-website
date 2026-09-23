"use client";

import { memo, useEffect, useState } from "react";
import Link from "next/link";
import { OfferHead, OfferMore, OFFER_NAV, OFFER_ROT_WORDS } from "@/components/dark/services-section";

/* the six audiences as the ticker says them: capitalised, no full stop */
const AUDIENCES = OFFER_ROT_WORDS.map((w) => w.charAt(0).toUpperCase() + w.slice(1).replace(/\.$/, ""));
import VoicesTiles from "@/components/dark/voices-tiles";
import OfferShow from "@/components/dark/offer-show";
import Survey from "@/components/dark/survey";
import Ticker from "@/components/dark/ticker";
import FilmSlice from "@/components/dark/film-slice";
import WorkSection from "@/components/dark/work-section";
import VoicesSection from "@/components/dark/voices-section";
import RunsSection from "@/components/dark/runs-section";
import ObjectionsSection from "@/components/dark/objections-section";
import { Monogram } from "@/components/ui/monogram";
import { CustomEase } from "gsap/CustomEase";
import { gsap, reducedMotion } from "@/components/anim/ease";
import { CLIENT_MARKS, GOOGLE_REVIEWS, NEXT_START, TICKER } from "@/lib/proof";
import { pickGreeting, replyLine, splitLead, type Greeting } from "@/lib/greeting";
import { getPersona } from "@/lib/persona";


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

/* THE TITLE'S OWN ELEMENT (2026-09-21): React renders it ONCE, with the
   server's title as plain text (SEO, no-JS, the first paint), and never
   again — memo with a constant prop — so the line masks splitRise writes
   into it survive the return-visit swap (the swap re-renders the page;
   React reconciling the h1's children would wipe the masks and the
   title would just appear). The swapped text reaches it through
   splitRise, called from the fit effect on every title change. */
const GreetTitle = memo(function GreetTitle({ initial }: { initial: string }) {
  const { lead, rest } = splitLead(initial);
  return (
    <h1 className="dr-h1 dr-greet" suppressHydrationWarning>
      {lead ? (
        <>
          <span className="dr-day-word">{lead}</span>
          {rest}
        </>
      ) : (
        rest
      )}
    </h1>
  );
});

/* the plain form, for the fit to measure against (block line masks
   would measure as the column's width and shrink the fit 1% a pass) */
function renderPlain(h1: HTMLElement, title: string, hasLead: boolean) {
  h1.textContent = "";
  if (hasLead) {
    const i = title.indexOf(". ") + 1;
    const sp = document.createElement("span");
    sp.className = "dr-day-word";
    sp.textContent = title.slice(0, i);
    h1.append(sp, title.slice(i));
  } else {
    h1.textContent = title;
  }
}

/* THE RISE's line maker (2026-09-21): words → probes → lines by top →
   one `.dr-greet-l` mask per line with a `.dr-greet-li` riser inside,
   --l on each; words of the lead sentence keep the cyan class. Idempotent:
   re-run on resize it rebuilds from the text, and keeps data-in so a
   resize never replays the entrance. */
function splitRise(h1: HTMLElement, title: string, hasLead: boolean) {
  const wasIn = h1.hasAttribute("data-in");
  const words = title.split(/\s+/).filter(Boolean);
  const leadEnd = hasLead ? title.indexOf(". ") + 1 : -1; // char index where the lead sentence ends
  let pos = 0;
  const probes = words.map((w) => {
    const sp = document.createElement("span");
    sp.textContent = w;
    const start = title.indexOf(w, pos);
    pos = start + w.length;
    if (hasLead && pos <= leadEnd) sp.className = "dr-day-word";
    return sp;
  });
  h1.textContent = "";
  probes.forEach((sp) => h1.append(sp, " "));
  const lines: HTMLSpanElement[][] = [];
  let top = NaN;
  for (const sp of probes) {
    const t = sp.getBoundingClientRect().top;
    if (!(Math.abs(t - top) < 2)) {
      lines.push([]);
      top = t;
    }
    lines[lines.length - 1].push(sp);
  }
  h1.textContent = "";
  lines.forEach((ws, i) => {
    const l = document.createElement("span");
    l.className = "dr-greet-l";
    l.style.setProperty("--l", String(i));
    const li = document.createElement("span");
    li.className = "dr-greet-li";
    ws.forEach((sp, k) => {
      li.append(sp);
      if (k < ws.length - 1) li.append(" ");
    });
    l.append(li);
    h1.append(l);
  });
  /* a rebuild before the entrance has FINISHED (data-entered, set on the
     last riser's transitionend below) starts the rise over from below —
     on a return visit the swap re-splits the title within the first
     ~100ms, when the first split's risers had been armed but had not
     moved yet, and building the new risers under data-in put them
     straight in place (measured: no rise on visit 2+). After the
     entrance, a rebuild (a resize) keeps the lines in place. */
  if (wasIn && h1.hasAttribute("data-entered")) {
    h1.setAttribute("data-in", "");
  } else {
    h1.removeAttribute("data-in");
    const last = h1.querySelector<HTMLElement>(".dr-greet-l:last-child .dr-greet-li");
    last?.addEventListener("transitionend", () => h1.setAttribute("data-entered", ""), { once: true });
    requestAnimationFrame(() => requestAnimationFrame(() => h1.setAttribute("data-in", "")));
  }
}

/* §01 · COLD OPEN — "The Dark Room"
   Job: state the offer, the geography and the promise in three seconds;
   prove craft with one lit object; hand off two doors at different
   commitment levels. ~78% untouched black, six text objects. */

/* SERVER-RENDERED, THEN HANDED OFF (2026-09-20, THE MESSAGE IS THE
   TITLE): app/page.tsx (a thin Server Component, `dynamic =
   "force-dynamic"`) computes the visitor's Phoenix day title with
   `pickGreeting(1, new Date())` and hands it here as `initialGreeting`
   — a "use client" page file does not respect Next's route segment
   config (verified live: `export const dynamic` inside this file, when
   it WAS the page, built as `○ (Static)` regardless — the day would
   freeze at build day). This split is the only way the greeting is
   both interactive (the wave, the lean, the return-visit swap) and
   genuinely re-read per request. */
export default function DarkRoom({
  initialGreeting,
  variant = "",
}: {
  initialGreeting: Greeting;
  variant?: string;
}) {
  /* HERO TRIALS (2026-09-20, branch hero/air) — see app/page.tsx. Tokens:
     wide  · the title fills the column — its longest line is fitted to
             the measure by --fit (below), Huge's h1 reaching both edges
     light · the room's own lights come back, INSIDE the dark zone only:
             the two drifting white radials the ?dark room had (.dr-key,
             room.css), re-homed as .dr-air-key and clipped to the hero's
             ground, so the light room's --flip no longer puts them out
     glow  · the film's own light: the reel is sampled into a 32x18
             canvas ten times a second and blown up behind the words, so
             the void breathes with whatever the reel is showing
     halo  · a lamp BEHIND the film (Jake, liking the lamps: "what it
             would look like if the glow kinda came from behind and
             under the video like the lamp on the right") — one white
             radial centred on the film's own box (measured below), so
             what shows is its spill past the film's edges: over the top
             edge into the gap under the door, and down the two sides
     edge  · a glow HUGGING the film's rectangle, even on all four
             sides (Jake: "only a glow around the video, no other
             lamps") — an outer box-shadow on an empty box laid exactly
             over the slot, so it is the film's own edge light, not a
             lamp in the room
     pblur · HUGE'S TOP GLASS (Jake: "look at the blur glass effect or
             whatever it is at the top of the huge navbar"; decoded
             live 2026-09-20, decodes/hugeinc.md §10): not a bar — a
             fixed, pointer-less PROGRESSIVE BLUR under a transparent
             header. Three stacked backdrop-filter layers, each masked
             to a band, the blur radius climbing toward the top edge
             (1.8 → 7.2 → 28.7px), so whatever scrolls under the nav
             dissolves instead of sliding under a pill. With it, our
             rail's own stuck pill (the 92% dark, the 14px blur, the
             glint edge) comes off — the links float, Huge's way
     lines · EVERY line is full width (Jake, on `wide`: "they arent
             always full width") — the title is split at its sentence
             ends, one sentence per line, and each line is fitted to the
             column at its OWN size; the first sentence is the cyan lead */
  const v = variant.split(" ").filter(Boolean);
  const has = (t: string) => v.includes(t);

  /* The frame — tokens, ground, nav, ending, the scroll engine, the
     entrance arm and the ?dark switch — is the layout's
     RoomShell now. This page is the room's own atmosphere and sections. */

  /* THE PERSONAL MESSAGE IS THE TITLE (2026-09-20, branch hero/greeting,
     settled after several trials same day — Jake, correcting himself:
     "no, the basic one is for FIRST time visit. i want the hero to be
     centered around these personal messages, i want it to be the big
     thing"). The h1 is `greeting.title` — the CLAIM on a first visit
     (lib/greeting.ts's `TITLE`, no cyan lead: it is not a greeting), and
     from the second visit the escalating return-visit line ("Back
     again." / "Third visit." / "You keep coming back.", cyan lead) —
     the site recognising you. `greeting.sub`, the honest-capacity day
     line, sits under it always, at every visit count, cyan lead too
     (lib/greeting.ts's `splitLead`, shared by both lines so the "no cyan
     without a real sentence-lead" rule can't drift between them).

     `initialGreeting` (the prop, app/page.tsx's `pickGreeting(1, {i:
     null, svc:null}, new Date())` on every request, a real Server
     Component) seeds the state, so the claim and the real day sub are
     both on the page before hydration — no swap for a first visit.
     ⚠ ONE ACCEPTED EDGE: the server's render and a stale client clock
     could in principle disagree right at the Phoenix midnight boundary;
     Jake's own call, not chased further here.

     THE RETURN-VISIT SWAP is client-only (localStorage, capped at 9 so
     the counter never becomes a number the copy has no line for) and
     gated on `visits >= 2` so a first-time visitor's server-rendered
     title is never touched. Persona (lib/persona.ts's `?i=`/`?svc=`
     capture) is read and threaded through to `pickGreeting` for when
     the persona table lands — inert today (see lib/greeting.ts's own
     comment), so it changes nothing about what renders yet. THE
     CROSSFADE (Jake: make the swap read as "the site recognising you,"
     not a glitch): `swapped` arms a 400ms opacity keyframe on the h1
     alone (.dr-greet-swap, room.css) the instant the title text
     actually changes — never on a first visit, where the title never
     moves. Wrapped in try/catch: a visitor with storage blocked
     (private mode, a strict cookie policy) still gets the first-visit
     claim, every time. */
  const [greeting, setGreeting] = useState<Greeting>(initialGreeting);
  const [swapped, setSwapped] = useState(false);
  useEffect(() => {
    let visits = 1;
    try {
      /* `?fresh` forgets the visitor (Jake: "is there a way to clear it
         so i can see the default text") — the counter is removed BEFORE
         it is read, so this load is visit 1 and shows the claim */
      if (new URLSearchParams(window.location.search).has("fresh")) {
        window.localStorage.removeItem("eas:visits");
      }
      const raw = window.localStorage.getItem("eas:visits");
      const prev = raw ? parseInt(raw, 10) : 0;
      visits = Math.min((Number.isFinite(prev) ? prev : 0) + 1, 9);
      window.localStorage.setItem("eas:visits", String(visits));
    } catch {
      /* storage unavailable — the first-visit claim still stands, every visit */
    }
    /* every visit re-picks on the VISITOR's clock — the server's day line
       is the server's "now", and a first-time visitor at 11pm Phoenix on
       a Monday would otherwise keep Tuesday's line (or none); the title
       only swaps (and crossfades) when it actually changed */
    const next = pickGreeting(visits, getPersona(), new Date());
    /* THE ENTRANCE OWNS THE FIRST SWAP (2026-09-21 — Jake: "i dont know
       if the text being dependant on the user if the animation will not
       work correctly"): this effect runs on mount, BEFORE the room is
       lit (shell.tsx arms .dr-lit on the first frame after mount) and
       well before the entrance's 300ms delay — so the return-visit text
       is already in place when the lines rise, and the rise IS its
       reveal. The crossfade is only for a swap that lands after the
       entrance has started, which in practice is never. */
    if (next.title !== initialGreeting.title) {
      if (document.querySelector(".dr-root")?.classList.contains("dr-lit")) {
        setSwapped(true);
        document.querySelector(".dr-greet")?.classList.add("dr-greet-swap");
      }
    }
    setGreeting(next);
  }, [initialGreeting.title]);

  /* THE WORD IS THE SCREEN — RETIRED (2026-09-20, branch hero/greeting):
     "Welcome" was a single measure-wide word, sized by a canvas measure
     against the column's width (--welcome-fs). THE MESSAGE IS THE TITLE
     replaces it with the day greeting itself, set in ordinary CSS rem/vw
     units at the statement's own rung (.dr-greet, room.css) — prose of
     varying length needs balanced wrapping, not a measure-filling single
     word, so there is nothing left to measure. */
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
    /* the hero's own lights (trial `light`) answer the cursor the same way */
    const air = document.querySelector<HTMLElement>(".dr-air-key");
    const bx = air ? gsap.quickTo(air, "x", { duration: 1.2, ease: U }) : null;
    const by = air ? gsap.quickTo(air, "y", { duration: 1.2, ease: U }) : null;
    /* ⚠ AND IT IS A WHISPER IN THE DAY ROOM. ±78/±46 is right on the void,
       where the lamps are soft and most of the frame is black: you read
       "the light shifted". On paper the pools are near-white against a
       220 sheet, so the same travel reads as the whole background
       sliding with the cursor (Jake, 2026-09-22: "something is following
       the cursor i see the whole background move"). A fifth of it keeps
       the room alive without the sheet moving. */
    const root = document.querySelector<HTMLElement>(".dr-root");
    const onMove = (e: PointerEvent) => {
      const day = !!root?.classList.contains("dr-day");
      const px = day ? 16 : 78;
      const py = day ? 9 : 46;
      ax((e.clientX / window.innerWidth - 0.5) * px);
      ay((e.clientY / window.innerHeight - 0.5) * py);
      bx?.((e.clientX / window.innerWidth - 0.5) * px);
      by?.((e.clientY / window.innerHeight - 0.5) * py);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const wall = document.querySelector<HTMLElement>(".dr-wall"); // gone (2026-09-20) — null, the scroll below is inert
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

  /* THE MARK'S OWN HEIGHT measure (--hero-band-h, the day line's top to
     the door's bottom) is GONE (2026-09-20, THE BAND IS ONE CARD — Jake:
     "extend the card, i want to see it wider where the text on the left
     and everything is inside of it"). The band is the whole card now —
     background, radius and padding are declared on `.dr-hero-band`
     itself in room.css, so it sizes to its own content like any other
     panel; nothing needs to measure a span across two children and hand
     it back as a custom property any more. */

  /* THE LEAN (2026-09-20, THE LIVING MARK; RETARGETED same day by THE
     LIVE TILE — the box widened into a wide tile carrying real copy, so
     the lean now moves the MARK ONLY, not the whole tile: leaning a
     paragraph of live copy toward the cursor would read as a bug, not
     a bee. Jake: "some little greeting character that waves inside like
     a gray box ... to the right of welcome" → the EA mark, not a
     character; Lando's bee idles toward the pointer). Desktop only — no
     pointer to lean toward on touch, and the breathe alone carries
     "alive" there. --lx/--ly are the pointer's offset from the MARK's
     OWN centre (.dr-hero-mark-m, the icon itself — 56px now that THE
     MESSAGE IS THE TITLE shortened the card, 2026-09-20; not
     .dr-hero-mark, its link wrapper), normalised against its own half-width/half-height
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

  /* TRIAL `wide` — THE TITLE FILLS THE COLUMN. The h1 is prose that
     balances onto two lines, so "full width" means: the size at which
     its LONGEST line is exactly the column. Measured, not guessed —
     the line boxes are read off a Range (one rect per line), the
     ratio column / longest line is folded into --fit, and it is run
     three times because `text-wrap: balance` re-breaks the lines as
     the size moves (it converges by the second pass). The reel's
     measure below listens for resize, so it is nudged once the title
     has settled — the slot and the grow follow the new title height. */
  useEffect(() => {
    if (!has("wide")) return;
    const h1 = document.querySelector<HTMLElement>(".dr-greet");
    const col = document.querySelector<HTMLElement>(".dr-hero");
    if (!h1 || !col) return;
    /* re-entrancy guard: fit() ends by dispatching resize (for the reel's
       measure), and fit() itself listens for resize */
    let busy = false;
    const fit = () => {
      if (busy) return;
      const hasLead = !!splitLead(greeting.title).lead;
      if (!window.matchMedia("(min-width: 901px)").matches) {
        /* THE PHONE (2026-09-22): no fit — the title is the rung the
           media query sets — but the RISE still has to run, or the h1
           stays at the opacity 0 it holds until data-in (it did: the
           phone's hero had no title at all, measured). */
        h1.style.removeProperty("--fit");
        if (!h1.querySelector(".dr-greet-l")) splitRise(h1, greeting.title, hasLead);
        return;
      }
      busy = true;
      /* MEASURED ON A PROBE, never on the h1 itself (2026-09-21): the h1
         holds the rise's line masks, and rebuilding them for a re-fit
         (fonts.ready lands ~100ms after mount) recreated the risers in
         their arrived state and killed the entrance. The probe is a
         hidden twin — same classes, same column — carrying the plain
         current title; the fit and the line breaks are read off it, and
         the h1 is only touched if either actually changed. */
      const probe = document.createElement("h1");
      probe.className = h1.className.replace("dr-greet-swap", "");
      probe.removeAttribute("data-in");
      probe.style.cssText = "position:absolute; left:0; right:0; visibility:hidden; pointer-events:none; margin:0";
      probe.style.setProperty("--fit", "1");
      renderPlain(probe, greeting.title, hasLead);
      col.style.position = col.style.position || "relative";
      col.append(probe);
      let f = 1;
      for (let i = 0; i < 3; i++) {
        const range = document.createRange();
        range.selectNodeContents(probe);
        const rects = [...range.getClientRects()];
        /* one width per line: rects on the same row are one line
           (the cyan lead is its own rect on the first line) */
        const rows = new Map<number, { l: number; r: number }>();
        for (const b of rects) {
          const k = Math.round(b.top);
          const row = rows.get(k) ?? { l: b.left, r: b.right };
          row.l = Math.min(row.l, b.left); row.r = Math.max(row.r, b.right);
          rows.set(k, row);
        }
        let longest = 0;
        for (const row of rows.values()) longest = Math.max(longest, row.r - row.l);
        if (!longest) break;
        /* 1% of slack, and stop once it is within it: fitted to the
           exact pixel, the first line overflows by a fraction and the
           greedy wrap tips the whole title to three lines (measured:
           132.52px held two lines, 132.62 broke into three) */
        const ratio = (col.clientWidth * 0.99) / longest;
        if (Math.abs(ratio - 1) < 0.01 && rows.size <= 2) break;
        f = f * ratio;
        probe.style.setProperty("--fit", f.toFixed(4));
      }
      /* the line breaks at the fitted size, off the probe's own words */
      const fitted = f.toFixed(4);
      const lineKey = (() => {
        probe.textContent = "";
        const words = greeting.title.split(/\s+/).filter(Boolean);
        const spans = words.map((w) => { const sp = document.createElement("span"); sp.textContent = w; probe.append(sp, " "); return sp; });
        const tops = spans.map((sp) => Math.round(sp.getBoundingClientRect().top));
        return tops.join(",");
      })();
      probe.remove();
      const changed = h1.style.getPropertyValue("--fit") !== fitted || h1.dataset.lines !== lineKey;
      if (changed) {
        h1.style.setProperty("--fit", fitted);
        h1.dataset.lines = lineKey;
      }
      window.dispatchEvent(new Event("resize"));
      busy = false;
      if (!changed && h1.querySelector(".dr-greet-l")) return; // the lines stand; nothing to rebuild
      /* THE RISE (2026-09-21 — Jake: "the title in the hero is there a way
         to have it animate in"): leoparpeix's masked rise, the same recipe
         as §02a's screen, on whatever the title IS — fitted first (above:
         the size decides the line breaks), then split into one mask per
         rendered line (the engine's probe method), the cyan lead carried
         word by word, then armed on the next frame. The lines stand
         103% below their masks until data-in; the CSS does the rest. */
      splitRise(h1, greeting.title, hasLead);
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("resize", fit);
      h1.style.removeProperty("--fit");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greeting.title]);

  /* TRIAL `lines` — EVERY LINE FULL WIDTH. Each sentence is its own
     nowrap block (.dr-greet-l), so one measurement is exact: --fl is
     column / the line's own width, no re-wrap to converge on. The
     sizes differ by sentence length — "We build the site." stands
     taller than "You get on with the business." — which is the point:
     the short line is the big one. */
  useEffect(() => {
    if (!has("lines")) return;
    const h1 = document.querySelector<HTMLElement>(".dr-greet");
    const col = document.querySelector<HTMLElement>(".dr-hero");
    if (!h1 || !col) return;
    let busy = false;
    const fit = () => {
      if (busy) return;
      const lines = [...h1.querySelectorAll<HTMLElement>(".dr-greet-l")];
      if (!window.matchMedia("(min-width: 901px)").matches) {
        lines.forEach((l) => l.style.removeProperty("--fl"));
        return;
      }
      busy = true;
      for (const l of lines) {
        l.style.setProperty("--fl", "1");
        const w = l.getBoundingClientRect().width;
        if (w) l.style.setProperty("--fl", ((col.clientWidth * 0.995) / w).toFixed(4));
      }
      window.dispatchEvent(new Event("resize"));
      busy = false;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greeting.title]);

  /* TRIAL `glow` — THE FILM'S OWN LIGHT. The playing reel is drawn into
     a 32x18 canvas ten times a second; the canvas is a 32x18 CSS box
     blurred at that size (cheap) and then scaled up by transform to
     cover the dark zone (room.css, .dr-glow) — the ambilight trick,
     the blur costing 576 pixels rather than a million. Pointer,
     touch, everything: it is the film's light, not an interaction. */
  useEffect(() => {
    if (!has("glow")) return;
    const c = document.querySelector<HTMLCanvasElement>(".dr-glow");
    const video = document.querySelector<HTMLVideoElement>(".dr-hero-reel video");
    if (!c || !video || reducedMotion()) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const draw = () => {
      if (video.readyState >= 2) ctx.drawImage(video, 0, 0, c.width, c.height);
    };
    draw();
    const id = setInterval(draw, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // the LAST thing above the slot — THE DOOR again (final settle,
      // same day: title, then the day line, then the door pill — the
      // door's own bottom edge is what the slot must clear, same as the
      // room's very first hero).
      const day =
        document.querySelector<HTMLElement>(".dr-strip") ??
        document.querySelector<HTMLElement>(".dr-hero-proof") ??
        document.querySelector<HTMLElement>(".dr-hero-door") ??
        document.querySelector<HTMLElement>(".dr-h1"); // `navstrip`: nothing under the title but the film
      if (day) {
        const db = box(day);
        reel.closest<HTMLElement>(".dr-hero-wrap")?.style.setProperty("--day-b", `${db.y + db.h}px`);
      }
      const s = box(slot);
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
      /* the film's own centre and height, for the lamp behind it (trial
         `halo`, .dr-air-film in room.css) */
      wrapEl?.style.setProperty("--film-c", `${s.y + s.h / 2}px`);
      wrapEl?.style.setProperty("--film-h", `${s.h}px`);
      /* and its left edge / width, for the glow that hugs its rectangle
         (trial `edge`, .dr-air-edge) */
      wrapEl?.style.setProperty("--film-x", `${s.x}px`);
      wrapEl?.style.setProperty("--film-w", `${s.w}px`);
      /* THE REEL IS BOXED AFTER --grow IS WRITTEN (2026-09-21): with no
         grow the dock's own place IS --grow (room.css, `still`: margin-top
         grow − 100svh), so reading the reel's box before writing the new
         --grow read its OLD place — on a return visit, where the swapped
         title changed the slot's top, that left --c0 stale and the film
         parked 310px above its slot, over the title (measured). The
         offset read here forces the layout the new --grow implies. */
      const r = box(reel);
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
      /* the mask's full width is the SCREEN less the film's own gap
         (trial `full`'s --film-gap, room.css — 0 when there is none):
         the film grows to the screen's height but keeps its two
         gutters (Jake: "not full width ... the video isnt full size and
         we have lost the parallax too" — the grow stays, the gap stays) */
      /* FULL SCREEN AGAIN (2026-09-20, Jake: "im thinking i move back to
         having video scale to full screen but with the current way
         parallax works"): the mask's full width is the screen — the gap
         is the film's at rest only; the exit slide (--x) is untouched */
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
      {/* THE GROUND (`?v=survey`, step 1 of design-dna/lando-ground-plan.md):
          Lando's contour field, under every section (survey.tsx) */}
      {has("survey") && <Survey mark={has("loose") ? "loose" : has("mark") ? "tight" : undefined} />}
      <div className="dr-atmos" aria-hidden>
        <div className="dr-key" />
      </div>
      {/* THE WALL IS GONE (2026-09-20, hero/air — Jake: "can we take my
          logo out of the background"): the massive EAS mark half off the
          left edge, hatched and drifting, that was the dark room's own
          wall. Its CSS (.dr-wall/.dr-figure, room.css) is retired with it;
          the scroll rise it had in the parallax effect above is removed. */}
      <div className="dr-grain" aria-hidden />
      {has("pblur") && (
        <div className="dr-pblur" aria-hidden>
          <div className="dr-pblur-l dr-pblur-l1" />
          <div className="dr-pblur-l dr-pblur-l2" />
          <div className="dr-pblur-l dr-pblur-l3" />
        </div>
      )}
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
        data-v={variant || undefined}
        data-sp
        data-sp-edge="top"
        data-sp-from="0"
        data-sp-to="-0.55"
        data-sp-var="--hero-p"
      >
        {/* HERO TRIALS (hero/air): the zone's own air — the lights
            (`light`) and the film's glow (`glow`), clipped to the dark
            ground's own height, under the stage and the dock. Present
            only for the variants that use them. */}
        {(has("light") || has("glow") || has("halo") || has("edge")) && (
          <div className="dr-air" aria-hidden>
            {has("glow") && <canvas className="dr-glow" width={32} height={18} />}
            {has("light") && <div className="dr-air-key" />}
            {has("halo") && <div className="dr-air-film" />}
            {has("edge") && <div className="dr-air-edge" />}
          </div>
        )}
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
        {/* THE EXIT'S OWN CLOCK (2026-09-20, hero/air — Jake: "the parallax
            needs to continue, right now the parallax stops"): the grow's
            --p is clamped at 1 the moment the film is full height, and
            the picture inside froze with it. This sentinel sits at the
            slot's top (--grow) — the exact scroll the grow completes —
            and publishes --x on the wrapper: 0 there, 1 one screen
            later, the film's bottom edge at the top of the screen. The
            picture rides it (room.css, .dr-hero-reel video). */}
        <div
          className="dr-exit"
          aria-hidden
          data-sp
          data-sp-edge="top"
          data-sp-from="0"
          data-sp-to="-1"
          data-sp-var="--x"
          data-sp-target=".dr-hero-wrap"
        />
        {/* THE SEAM (trial `seam` — Jake: "add the glass as a seam between
            the two sections"): a band of glass straddling the edge where
            the hero's black meets the page's white, Huge's progressive
            blur turned sideways — the blur fades in from above and out
            below, so the hard line between the two grounds (and the
            film's lower glow just above it) dissolves into a frosted
            gradient instead of a cut. */}
        {has("seam") && (
          <div className="dr-seam" aria-hidden>
            <div className="dr-seam-l dr-seam-l1" />
            <div className="dr-seam-l dr-seam-l2" />
            <div className="dr-seam-l dr-seam-l3" />
          </div>
        )}

        <div className="dr-stage">
          <main className="dr-main wrap">
            <div className="dr-hero">
              {/* §01 · THE PERSONAL MESSAGE IS THE TITLE (2026-09-20,
                  branch hero/greeting, final settle of the day — Jake:
                  "i want the hero to be centered around these personal
                  messages, i want it to be the big thing"; a first-time
                  visitor with no signal yet sees the claim instead:
                  "the basic one is for FIRST time visit"). Three earlier
                  shapes today (the greeting alone as the h1 with no
                  card; the day line's own second sentence promoted into
                  the title as a stroked, arrowed link) are superseded
                  and live only in git — room.css's rules for all of it
                  (`.dr-hero-band` and its columns, `.dr-greet-cta` and
                  its arrow) are untouched and dead, not deleted, along
                  with `LiveTile`, `GOOGLE_REVIEWS` and `Monogram` above,
                  now unused in this file for the same reason.

                  THE SHAPE THAT SHIPS: the h1 (`greeting.title`,
                  lib/greeting.ts) IS the personal message — the claim on
                  a first visit (no cyan lead — `splitLead` finds no
                  ". " in it), the escalating return-visit line from the
                  second (cyan lead) — `.dr-greet-swap` (room.css) fades
                  it in over 400ms exactly when the text actually changes
                  (armed by the `swapped` state above), so a return visit
                  reads as the site recognising you, not a flash. Under
                  it, `.dr-hero-sub` is the honest-capacity day line,
                  same at every visit count; under THAT, the door is its
                  own pill again (`.dr-hero-door`, back to a plain
                  labelled button — `greeting.door.label`, not a sentence
                  fragment). Both lines share the same split rule and the
                  same cyan class (`.dr-day-word`) for their lead. */}
              <GreetTitle initial={initialGreeting.title} />
              {/* the day line — only on the days that earned one (lib/greeting.ts);
                  on a quiet day the title and the door sit alone */}
              {greeting.sub && (
                <p className="dr-hero-sub">
                  {(() => {
                    const { lead, rest } = splitLead(greeting.sub);
                    return lead ? (
                      <>
                        <span className="dr-day-word">{lead}</span>
                        {rest}
                      </>
                    ) : (
                      rest
                    );
                  })()}
                </p>
              )}
              {/* `nopill` / `navpill` / `navstrip` (Jake, same night: "maybe try
                  no pills on the hero at all" / "take the content out the
                  pill and have the pill be up top with the nav"): nothing
                  under the title — the film follows it. nopill leaves the
                  nav quiet; navpill makes the rail the pill from the first
                  frame (mark, links, the call); navstrip puts the strip's
                  proof and the price door in that pill (nav.tsx). */}
              {has("navstrip") || has("nopill") || has("navpill") ? null : has("strip") ? (
                /* THE STRIP, back (trial `?v=strip`, 2026-09-21 — Jake: "can
                   we try bringing the pill from the design that sells thing
                   in to this design … i just want to see it"): the thin
                   64px bar from the white hero, between the title and the
                   film — the faces, rotating, and the rating at the left;
                   the services ticker running; THIS design's cyan door at
                   its right end. It replaces the door + the proof line
                   (it IS both). room.css's retired .dr-strip rules carry
                   it; the light room's white bar, the dark room's dark
                   one. measure() clears it as the last thing above the
                   slot. */
                <div className="dr-strip">
                  {GOOGLE_REVIEWS.count > 0 && (
                    <a
                      className="dr-strip-rating"
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
                      <span className="dr-strip-l">
                        <b>{GOOGLE_REVIEWS.rating.toFixed(1)} on Google</b>
                        <span>{GOOGLE_REVIEWS.count} client reviews</span>
                      </span>
                    </a>
                  )}
                  <div className="dr-logos" aria-label="What we build">
                    <div className="dr-logos-track">
                      {[0, 1].map((i) => (
                        <div className="dr-logos-set" key={i} aria-hidden={i === 1}>
                          {TICKER.map((c) => (
                            <span key={c}>{c}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link href={greeting.door.href} className="dr-herocta dr-hero-door t-cta">
                    {greeting.door.label}
                  </Link>
                </div>
              ) : (
              <Link href={greeting.door.href} className="dr-herocta dr-hero-door t-cta">
                {greeting.door.label}
              </Link>
              )}
              {/* THE PROOF LINE (2026-09-21 — the one thing the white
                  "Design that sells" hero had that this one lost: the
                  strip's proof. Jake: "okay lets try it"). One quiet row
                  under the door, the screen's own 14px register: the three
                  client marks and the Google rating. lib/proof.ts's rule
                  stands — the rating renders only while `count` is real
                  (0 hides it); the numbers there are PLACEHOLDERS until
                  Jake sets the live ones. The row is the last thing above
                  the slot now, so measure() clears it, not the door. */}
              {!has("strip") && !has("navstrip") && !has("nopill") && !has("navpill") && (
              <div className="dr-hero-proof">
                <span className="dr-hero-proof-marks" aria-hidden>
                  {CLIENT_MARKS.map((m) => (
                    <i key={m.name} className="dr-hero-proof-mark" title={m.name}>
                      {m.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.src} alt="" width={26} height={26} loading="lazy" />
                      ) : (
                        m.initials
                      )}
                    </i>
                  ))}
                </span>
                <span className="dr-hero-proof-who">Built for Desert Wings, AAHG and Riled Up</span>
                {GOOGLE_REVIEWS.count > 0 && (
                  <>
                    <i className="dr-hero-proof-dot" aria-hidden />
                    {GOOGLE_REVIEWS.url ? (
                      <a className="dr-hero-proof-rating" href={GOOGLE_REVIEWS.url} target="_blank" rel="noopener">
                        {GOOGLE_REVIEWS.rating.toFixed(1)} on Google · {GOOGLE_REVIEWS.count} reviews
                      </a>
                    ) : (
                      <span className="dr-hero-proof-rating">
                        {GOOGLE_REVIEWS.rating.toFixed(1)} on Google · {GOOGLE_REVIEWS.count} reviews
                      </span>
                    )}
                  </>
                )}
              </div>
              )}

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
            {/* THE FILM ARRIVES WITH A FRAME IN IT (2026-09-21 — Jake: "for
                the video theres a stationary black box, you can see its
                weird when you reload page"): the reel used to fade in as
                an empty black plate and the picture arrived after. Now
                the plate is transparent and the rise waits for
                `data-film` — the first frame decoded (loadeddata), or
                already there on a warm cache — so nothing shows until
                there is a picture to show. */}
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/dark/reel-film-poster.jpg"
              preload="auto"
              aria-label="Recent Executive AI Solutions client work"
              /* data-film = A FRAME HAS BEEN PRESENTED (2026-09-21, second
                 pass — Jake: "no before the video animated in there is
                 black"): loadeddata fires with a frame DECODED, but the
                 first seek (the #t start) can still leave the element
                 painting black while the reel is already fading in.
                 requestVideoFrameCallback fires only when a frame has
                 actually been composited — that is the moment there is a
                 picture; loadeddata is the fallback where it does not
                 exist (Firefox). */
              ref={(v) => {
                if (!v || v.dataset.armed) return;
                v.dataset.armed = "1";
                const show = () => v.parentElement?.setAttribute("data-film", "");
                const anyV = v as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number };
                if (typeof anyV.requestVideoFrameCallback === "function") anyV.requestVideoFrameCallback(show);
                else v.addEventListener("loadeddata", show, { once: true });
              }}
              /* THE FILM SKIPS ITS OWN DARK SECOND (measured 2026-09-21:
                 the v1 cut opens at a mean luminance of 30–33 for 1.0s
                 before the picture comes up to 42 — fading THAT in read
                 as "a stationary black box"). It starts at 1.4s (the #t
                 fragment) and, because a loop returns to 0 regardless of
                 the fragment (measured), is seeked past the dark second
                 every time round. Goes away with the reel cut on black
                 (design-dna/reel-spec.md). */
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.currentTime < 1.35) v.currentTime = 1.4;
              }}
            >
              <source src="/dark/reel-film.mp4#t=1.4" type="video/mp4" />
            </video>
            {/* `?v=slice` — the pointer cuts the picture into bands
                (film-slice.tsx; Lando's WebGL hero, without the shader) */}
            {has("slice") && <FilmSlice />}
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
        {/* `?v=aud` (step 2 of design-dna/lando-ground-plan.md): Lando's
            message ticker — the six audiences in two rows running opposite
            ways, in the band between the film and the statement. It lives
            INSIDE the stage, not between the hero and it: under `flat` the
            stage's own geometry is keyed on `.dr-hero-wrap + .dr-say-stage`
            (room.css), and a sibling in between would break that. */}
        {has("aud") && (
          <Ticker
            className="dr-tick--aud"
            rows={[AUDIENCES, [...AUDIENCES.slice(3), ...AUDIENCES.slice(0, 3)]]}
          />
        )}
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
      {/* THE SERVICES CARD IS GONE (2026-09-20, hero/air — Jake: "services
          section has to go"): the dark ledger card that followed the
          statement is off the homepage; the statement hands straight to
          the work. ServicesSection still exists (services-section.tsx —
          OfferHead above is exported from it) for the services pages. */}

      {/* §02b · the paragraph and the in-page nav (services-section.tsx).
          `?v=nob` (trial, 2026-09-21: "should we remove 2b i want to see
          it") leaves it out; the tiles then carry its lamp clock. */}
      {/* `?v=apart` (trial, 2026-09-22 — Jake: "i really like section 2a
          and 2b individually im not sure they each go together"): they
          are two sites' grammars back to back — leoparpeix's centred
          poster, then Huge's left paragraph with its doors at the far
          right — and at the handoff they share one frame. Under apart
          neither changes; §02b moves to after the work, where its
          promise ("a fixed quote in two days…") lands once the proof
          has, and its doors are the way on. The tiles take the lamp
          clock. */}
      {/* `?v=show` (trial, 2026-09-22 — "i need to find a way to make it
          beatiful and visual"): the poster's three words, shown — the
          three photographs of the real deliverables (offer-show.tsx) */}
      {has("show") && <OfferShow />}
      {!has("nob") && !has("apart") && <OfferMore />}
      {/* §02c · the three voices as tiles, the last thing on the light
          page. `?v=noc` leaves these out instead — the other cut. */}
      {!has("noc") && <VoicesTiles lampsOn={has("nob") || has("apart")} />}

      {/* THE FLIP TO DARK, SCROLL-DRIVEN (2026-09-20 — Jake: "we need the
          background flip to dark before work section" → "i mean the flip
          like how lando does it the scroll driven one"): not a cut at
          the section's edge but the whole PAGE crossfading, the room's
          own --flip written on the ROOT (every token is a color-mix on
          it, room.css .dr-root) as this wrapper's top rises from 1.1
          screens to .9 — a fifth of a screen, FAST, Lando's 0.8s at a
          normal scroll: a crossfade of ground AND ink has a muddy middle
          (grey on grey at --flip .5, measured at a .5vh window), and the
          only cure is not to dwell there. The ground is dark before the
          work's head is on
          screen, and everything after (the voices, the runs, the close)
          sits on the void as it was designed to. data-sp-step is the
          measured perf floor for twelve color-mix tokens (1/32, see the
          old .dr-flip note below); the rail (nav.tsx) reads the root's
          --flip for its own chrome. */}
      {/* `paper` (trial, 2026-09-21): the flip runs the OTHER way and
          INSIDE the rail — dark → light across its first third (the
          clock in work-section.tsx writes --fp), light through the
          voices, the runs and the objections, and back to dark as the
          close arrives (--fe, the sentinel after .dr-flip below). This
          wrapper's own track — the light page's flip TO dark before the
          work — would fight it (a second writer of --flip on the same
          root), so under paper it is not rendered. room.css "PAPER". */}
      <div
        className="dr-work-zone"
        {...(has("paper") || has("lm")
          ? {}
          : {
              "data-sp": true,
              "data-sp-edge": "top",
              "data-sp-from": "0.9",
              "data-sp-to": "1.1",
              "data-sp-var": "--flip",
              "data-sp-target": ".dr-root",
              "data-sp-lerp": "0.1",
              "data-sp-step": "0.03125",
            })}
      >
        <WorkSection paper={has("paper")} gallery={has("gallery")} />
      </div>
      {has("apart") && (
        <OfferMore lamps={false} doors={OFFER_NAV.filter((d) => d.href !== "/work")} />
      )}
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
      {/* `paper`: the close takes the room back to dark — --fe 1 → 0 as
          this point (the close's top, shell.tsx renders it next) rises
          from 1.1 screens to .9, the same fifth-of-a-screen window the
          flip-to-dark used (a crossfade of ground and ink has a muddy
          middle; the cure is not to dwell there). */}
      {has("paper") && (
        <div
          className="dr-paper-end"
          aria-hidden
          data-sp
          data-sp-edge="top"
          data-sp-from="0.9"
          data-sp-to="1.1"
          data-sp-var="--fe"
          data-sp-target=".dr-root"
          data-sp-lerp="0.1"
          data-sp-step="0.03125"
        />
      )}
    </>
  );
}
